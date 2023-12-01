<?php

require 'routes/send.php';

function cronTokens($req,$res,$args){
    try {
        $banco = db();
        $pdo = new PDO('mysql:host='.$banco['host'].';dbname='.$banco['name'].'',$banco['user'],$banco['password']);
        $pdo->exec("SET time_zone='+03:00'");
        //users
        $stmt = $pdo->prepare("SELECT a.id,z.token FROM users a
        JOIN JSON_TABLE(a.tokens,'$[*]' COLUMNS (expires_in datetime PATH '$.expires_in',token varchar(100) PATH '$.token')) z
        WHERE z.expires_in < :date");
        $stmt->bindValue(':date',date('Y-m-d H:i:s'),PDO::PARAM_STR);
        $stmt->execute();
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach($users as $val){
            $stmt = $pdo->prepare("UPDATE users SET tokens=JSON_REMOVE(tokens,JSON_UNQUOTE(REPLACE(JSON_SEARCH(tokens,'one',:token),'.token',''))) WHERE id=:id");
            $stmt->bindValue(':id',$val['id'],PDO::PARAM_STR);
            $stmt->bindValue(':token',$val['token'],PDO::PARAM_STR);
            $stmt->execute();
        }
        //results
        $res->getBody()->write(json_encode(array('sts'=>200)));
    }catch(Exception $e){
        $res->getBody()->write(json_encode(array('message'=>'Operação inválida','sts'=>400)));
    }
    $pdo = null;
    return $res->withHeader('Content-type','application/json; charset=utf-8');
}

function cronStatus($req,$res,$args){
    try {
        $banco = db();
        $pdo = new PDO('mysql:host='.$banco['host'].';dbname='.$banco['name'].'',$banco['user'],$banco['password']);
        $pdo->exec("SET time_zone='+03:00'");
        //invoices
        $stmt = $pdo->prepare("UPDATE invoices SET status='late' WHERE status='waiting' AND due_date < :date");
        $stmt->bindValue(':date',date('Y-m-d H:i:s'),PDO::PARAM_STR);
        $stmt->execute();
        //results
        $res->getBody()->write(json_encode(array('sts'=>200)));
    }catch(Exception $e){
        $res->getBody()->write(json_encode(array('message'=>'Operação inválida','sts'=>400)));
    }
    $pdo = null;
    return $res->withHeader('Content-type','application/json; charset=utf-8');
}

function cronInvoices($req,$res,$args){
    try {
        $banco = db();
        $pdo = new PDO('mysql:host='.$banco['host'].';dbname='.$banco['name'].'',$banco['user'],$banco['password']);
        $pdo->exec("SET time_zone='+03:00'");
        //invoices
        $stmt = $pdo->prepare("SELECT a.*,
        a.customer->>'$.id' AS customer,
        a.customer->>'$.name' AS customer_name,
        (SELECT cu.document FROM customers cu WHERE cu.id=a.customer->>'$.id' AND cu.account=a.account) AS customer_document,
        a.payment->>'$.id' AS payment,
        a.payment->>'$.service' AS payment_service,
        (CASE WHEN a.payment->>'$.app'='' THEN '' ELSE (SELECT JSON_UNQUOTE(JSON_EXTRACT(ac.apps,REPLACE(JSON_UNQUOTE(JSON_SEARCH(ac.apps,'one',a.payment->>'$.app','','$[*].id')),'id','id'))) FROM accounts ac WHERE ac.id=a.account) END) AS payment_app,
        (SELECT JSON_UNQUOTE(JSON_EXTRACT(ac.apps,REPLACE(JSON_UNQUOTE(JSON_SEARCH(ac.apps,'one',a.payment->>'$.app','','$[*].id')),'id','app'))) FROM accounts ac WHERE ac.id=a.account) AS payment_name,
        (CASE WHEN a.payment->>'$.app'='' THEN a.payment->>'$.name' ELSE CONCAT((SELECT ap.name FROM apps ap WHERE ap.id=(SELECT JSON_UNQUOTE(JSON_EXTRACT(ac.apps,REPLACE(JSON_UNQUOTE(JSON_SEARCH(ac.apps,'one',a.payment->>'$.app','','$[*].id')),'id','app'))) FROM accounts ac WHERE ac.id=a.account)),'/',(SELECT JSON_UNQUOTE(JSON_EXTRACT(ac.apps,REPLACE(JSON_UNQUOTE(JSON_SEARCH(ac.apps,'one',a.payment->>'$.app','','$[*].id')),'id','name'))) FROM accounts ac WHERE ac.id=a.account),': ',(SELECT pa.name FROM payments pa WHERE pa.id=a.payment->>'$.id' AND pa.account=a.account)) END) AS payment_text,
        (SELECT JSON_UNQUOTE(JSON_EXTRACT(ac.apps,REPLACE(JSON_UNQUOTE(JSON_SEARCH(ac.apps,'one',a.payment->>'$.app','','$[*].id')),'id','application'))) FROM accounts ac WHERE ac.id=a.account) AS payment_application
        FROM subscriptions a WHERE a.status='on' AND a.next_due_date<=:date LIMIT 5");
        $stmt->bindValue(':date',date('Y-m-d', strtotime('+10 days',strtotime(date('Y-m-d')))),PDO::PARAM_STR);
        $stmt->execute();
        $subscriptions = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach($subscriptions as $key=>$value){
            $subscriptions[$key]['payment_application'] = json_decode($value['payment_application']);
            $subscriptions[$key]['services'] = json_decode($value['services']);
        }
        foreach($subscriptions as $value){
            if($value['period']=='monthly'){
                $period=1;
            }elseif($value['period']=='bimonthly'){
                $period=2;
            }elseif($value['period']=='quarterly'){
                $period=3;
            }elseif($value['period']=='semiannual'){
                $period=6;
            }elseif($value['period']=='yearly'){
                $period=12;
            }
            $id = id();
            $charge = createPayment($value['account'],$id,array("name"=>$value['customer_name'],"document"=>$value['customer_document']),array("name"=>$value['payment_name'],"application"=>$value['payment_application'],"service"=>$value['payment_service']),$value['services'],$period);
            createInvoice(array(
                "id"=>$id,
                "account"=>$value['account'],
                "subscription"=>$value['id'],
                "customer"=>'{"id":"'.$value['customer'].'","name":"'.$value['customer_name'].'"}',
                "due_date"=>date('Y-m-d',strtotime('+10 days',strtotime(date('Y-m-d')))),
                "total"=>number_format(($value['total']*$period),2,'.',''),
                "status"=>'waiting',
                "type"=>'auto',
                "send"=>$value['send'],
                "transaction"=>$charge->data->charge_id,
                "details"=>'{"barcode":"'.($charge->data->barcode?$charge->data->barcode:'').'","pdf":"https://pdf.paggy.com.br/'.$id.'","qrcode":"'.($charge->data->pix->qrcode?$charge->data->pix->qrcode:'').'","qrcode_image":"'.($charge->data->pix->qrcode_image?$charge->data->pix->qrcode_image:'').'"}',
                "payment"=>'{"id":"'.$value['payment'].'","app":"'.$value['payment_app'].'","service":"'.$value['payment_service'].'","name":"'.$value['payment_text'].'"}',
                "services"=>json_encode($value['services']),
                "period"=>$period,
                "payday"=>"0000-00-00 00:00:00",
                "note"=>''
            ));
        }
        //results
        $res->getBody()->write(json_encode(array('sts'=>200)));
    }catch(Exception $e){
        $res->getBody()->write(json_encode(array('message'=>'Operação inválida','sts'=>400)));
    }
    $pdo = null;
    return $res->withHeader('Content-type','application/json; charset=utf-8');
}

function cronNotifications($req,$res,$args){
    try {
        $banco = db();
        $pdo = new PDO('mysql:host='.$banco['host'].';dbname='.$banco['name'].'',$banco['user'],$banco['password']);
        $pdo->exec("SET time_zone='+03:00'");
        //invoices
        $stmt = $pdo->prepare("SELECT a.id,a.services,a.due_date,a.total,a.status,a.details,z.notification_method AS method,
        a.account AS company,
        (SELECT ac.name FROM accounts ac WHERE ac.id=a.account) AS company_name,
        (SELECT ac.email FROM accounts ac WHERE ac.id=a.account) AS company_email,
        (SELECT ac.phone FROM accounts ac WHERE ac.id=a.account) AS company_phone,
        (SELECT ac.whatsapp FROM accounts ac WHERE ac.id=a.account) AS company_whatsapp,
        (SELECT ac.site FROM accounts ac WHERE ac.id=a.account) AS company_site,
        (SELECT ac.address FROM accounts ac WHERE ac.id=a.account) AS company_address,
        (SELECT ac.layout->>'$.email' AS layout FROM accounts ac WHERE ac.id=a.account) AS layout,
        a.customer->>'$.name' AS customer_name,
        (SELECT cu.email FROM customers cu WHERE cu.id=a.customer->>'$.id') AS customer_email,
        a.payment->>'$.service' AS payment_service,
        (SELECT pa.text FROM payments pa WHERE pa.id=a.payment->>'$.id') AS payment_text,
        (SELECT JSON_UNQUOTE(JSON_EXTRACT(ac.notifications,REPLACE(JSON_UNQUOTE(JSON_SEARCH(ac.notifications,'one',z.notification_days,'','$[*].days')),'days','subject'))) FROM accounts ac WHERE ac.id=a.account) AS subject,
        (SELECT JSON_UNQUOTE(JSON_EXTRACT(ac.notifications,REPLACE(JSON_UNQUOTE(JSON_SEARCH(ac.notifications,'one',z.notification_days,'','$[*].days')),'days','text'))) FROM accounts ac WHERE ac.id=a.account) AS text
        FROM invoices a
        JOIN JSON_TABLE(a.notifications,'$[*]' COLUMNS (notification_date DATE PATH '$.date',notification_send varchar(3) PATH '$.send',notification_days varchar(10) PATH '$.days',notification_method varchar(50) PATH '$.method')) z
        WHERE (a.status='waiting' OR a.status='late') AND z.notification_date=:date AND z.notification_send='off' LIMIT 5");
        $stmt->bindValue(':date',date('Y-m-d'),PDO::PARAM_STR);
        $stmt->execute();
        $invoices = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach($invoices as $key=>$value){
            $invoices[$key]['services'] = json_decode($value['services']);
            $invoices[$key]['details'] = json_decode($value['details']);
            $invoices[$key]['company_address'] = json_decode($value['company_address']);
            $invoices[$key]['layout'] = json_decode($value['layout']);
        }
        foreach($invoices as $invoice){
            $send = false;
            foreach(explode(',',$invoice['method']) as $method){
                if($method=='email'){
                    $send = sendEmail(
                        array('id'=>$invoice['company'],'name'=>$invoice['company_name'],'email'=>$invoice['company_email'],'phone'=>($invoice['company_whatsapp']&&($invoice['company_phone']!=$invoice['company_whatsapp'])?$invoice['company_phone'].' / '.$invoice['company_whatsapp']:$invoice['company_phone']),'site'=>$invoice['company_site'],'address'=>$invoice['company_address']),
                        array('name'=>$invoice['customer_name'],'email'=>$invoice['customer_email']),
                        $invoice['layout'],
                        'invoice',
                        array(
                            'services'=>$invoice['services'],
                            'total'=>$invoice['total'],
                            'due_date'=>$invoice['due_date'],
                            'invoice'=>$invoice['id'],
                            'details'=>$invoice['details'],
                            'payment_text'=>$invoice['payment_text'],
                            'service'=>$invoice['payment_service'],
                            'subject'=>$invoice['subject'],
                            'text'=>$invoice['text']
                        )
                    );
                }
            }
            if($send){
                $stmt = $pdo->prepare("UPDATE invoices SET
                notifications=JSON_SET(notifications,REPLACE(JSON_UNQUOTE(JSON_SEARCH(notifications,'one',:date,'','$[*].date')),'date','send'),:send)
                WHERE id=:id");
                $stmt->bindValue(':date',date('Y-m-d'),PDO::PARAM_STR);
                $stmt->bindValue(':id',$invoice['id'],PDO::PARAM_STR);
                $stmt->bindValue(':send','on',PDO::PARAM_STR);
                $stmt->execute();
            }
        }
        //results
        $res->getBody()->write(json_encode(array('sts'=>200)));
    }catch(Exception $e){
        $res->getBody()->write(json_encode(array('message'=>'Operação inválida','sts'=>400)));
    }
    $pdo = null;
    return $res->withHeader('Content-type','application/json; charset=utf-8');
}