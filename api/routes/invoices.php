<?php

function getInvoices($req,$res,$args){
    if(validateToken($req->getParam('user'),$req->getParam('token')) && $req->getParam('account')){
        try {
            $banco = db();
            $pdo = new PDO('mysql:host='.$banco['host'].';dbname='.$banco['name'].'',$banco['user'],$banco['password']);
            $pdo->exec("SET time_zone='+03:00'");
            //search
            $search = '';
            if($req->getParam('search')){$search = $req->getParam('search');}
            //customers
            $customers = '';
            if($req->getParam('customers')){$customers = "AND customer_status='".$req->getParam('customers')."'";}
            //status
            $status = '';
            if($req->getParam('status')){
                $status .= "AND (";
                foreach(explode(',',$req->getParam('status')) as $key=>$value){
                    if($key==0){
                        $status .= "a.status = '".$value."'";
                    }else{
                        $status .= " OR a.status = '".$value."'";
                    }
                }
                $status .= ")";
            }
            //date
            $date = '';
            if($req->getParam('date')){
                $dates = explode(' - ',$req->getParam('date'));
                $date_start = explode('/',$dates[0]);
                $date_end = explode('/',$dates[1]);
                $date = "AND a.date BETWEEN '".$date_start[2]."-".$date_start[1]."-".$date_start[0]." 00:00:00' AND '".$date_end[2]."-".$date_end[1]."-".$date_end[0]." 23:59:59'";
            }
            //order
            $order = 'datetime DESC';
            if($req->getParam('order')){
                if($req->getParam('order')=='date'){
                    $order = str_replace('date','datetime',$req->getParam('order'));
                }else{
                    $order = str_replace('due_date','a.due_date',$req->getParam('order'));
                }
            }
            //limit
            $limit = 20;
            if($req->getParam('limit')){$limit = (int)$req->getParam('limit');}
            //page
            $page = 0;
            if($req->getParam('page')){$page = ((int)$req->getParam('page')-1)*$limit;}
            //results
            $stmt = $pdo->prepare("SELECT a.id,a.date AS datetime,a.due_date,a.subscription,
            CONCAT('R$ ',format(a.total,2,'pt_BR')) AS total,
            DATE_FORMAT(a.due_date,'%d/%m/%Y') AS due_date,
            DATE_FORMAT(a.date,'%d/%m/%Y') AS date,
            DATE_FORMAT(a.date,'%H:%i:%s') AS hour,
            customer->>'$.id' AS customer,
            customer->>'$.name' AS customer_name,
            (CASE WHEN customer->>'$.id'<>'' THEN (SELECT cu.status FROM customers cu WHERE cu.id=customer->>'$.id') ELSE 'off' END) AS customer_status,
            (CASE WHEN a.status='waiting' THEN 'Aguardando' WHEN a.status='paid' THEN 'Pago' WHEN a.status='late' THEN 'Atrasado' WHEN a.status='canceled' THEN 'Cancelado' ELSE '' END) AS status,
            (CASE WHEN a.status='waiting' THEN 'royalblue' WHEN a.status='paid' THEN 'limegreen' WHEN a.status='late' THEN 'red' WHEN a.status='canceled' THEN 'slategray' ELSE '' END) AS status_background,
            (CASE WHEN a.status='paid' THEN DATE_FORMAT(a.payday,'%d/%m/%Y') ELSE 'Em aberto' END) AS payday,
            CONCAT('[',GROUP_CONCAT('{\"name\":\"',CONCAT(z.quantity,' x ',z.name,': R$',format(z.price,2,'pt_BR')),'\"}'),']') AS services
            FROM `invoices` a
            JOIN JSON_TABLE(a.services,'$[*]' COLUMNS (quantity INT PATH '$.quantity',name varchar(100) PATH '$.name',price decimal(10,2) PATH '$.price')) z
            WHERE a.account=:account ".$status." ".$date." GROUP BY a.id
            HAVING LOWER(customer_name) LIKE LOWER('%".$search."%') ".$customers."
            ORDER BY ".$order." LIMIT ".$page.",".$limit);
            $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
            foreach($results AS $key=>$value){
                $results[$key]['services']=json_decode($results[$key]['services']);
            }
            //subtotal
            $stmt2 = $pdo->prepare("SELECT COUNT(x.id) AS subtotal FROM (
            SELECT a.id,a.date AS datetime,
            customer->>'$.name' AS customer_name,
            (CASE WHEN customer->>'$.id'<>'' THEN (SELECT cu.status FROM customers cu WHERE cu.id=customer->>'$.id') ELSE 'off' END) AS customer_status,
            CONCAT('[',GROUP_CONCAT('{\"name\":\"',CONCAT(z.quantity,' x ',z.name,': R$',format(z.price,2,'pt_BR')),'\"}'),']') AS services
            FROM `invoices` a
            JOIN JSON_TABLE(a.services,'$[*]' COLUMNS (quantity INT PATH '$.quantity',name varchar(100) PATH '$.name',price decimal(10,2) PATH '$.price')) z
            WHERE a.account=:account ".$status." ".$date." GROUP BY a.id
            HAVING LOWER(customer_name) LIKE LOWER('%".$search."%') ".$customers."
            ) AS x");
            $stmt2->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
            $stmt2->execute();
            $subtotal = $stmt2->fetchAll(PDO::FETCH_ASSOC);
            //total
            $stmt2 = $pdo->prepare("SELECT COUNT(a.id) AS total FROM `invoices` a WHERE a.account=:account");
            $stmt2->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
            $stmt2->execute();
            $total = $stmt2->fetchAll(PDO::FETCH_ASSOC);
            //return
            if($stmt->rowCount() == 0){
                $res->getBody()->write(json_encode(array('sts'=>200,'message'=>'Nenhum registro encontrado','total'=>$total[0]['total'])));
            }else{
                $res->getBody()->write(json_encode(array('sts'=>200,'results'=>$results,'subtotal'=>$subtotal[0]['subtotal'],'total'=>$total[0]['total'])));
            }
        }catch(Exception $e){
            $res->getBody()->write(json_encode(array('message'=>'Operação inválida','sts'=>400)));
        }
    }else{
        $res->getBody()->write(json_encode(array('message'=>'Atributo inválido ou ausente','sts'=>400)));
    }
    $pdo = null;
    return $res->withHeader('Content-type','application/json; charset=utf-8');
}

function getInvoicesId($req,$res,$args){
    if(validateToken($req->getParam('user'),$req->getParam('token')) && $req->getParam('account')){
        try {
            $banco = db();
            $pdo = new PDO('mysql:host='.$banco['host'].';dbname='.$banco['name'].'',$banco['user'],$banco['password']);
            $pdo->exec("SET time_zone='+03:00'");
            $stmt = $pdo->prepare("SELECT a.status,a.due_date,a.total,a.notifications,a.services,
            (CASE WHEN a.payday<>'0000-00-00 00:00:00' THEN DATE_FORMAT(a.payday,'%d/%m/%Y %H:%i') ELSE 'Em aberto' END) AS payday,
            (CASE WHEN a.type='auto' THEN 'Automático' ELSE 'Manual' END) AS type,
            (CASE WHEN a.subscription='' THEN 'Nenhuma' ELSE a.subscription END) AS subscription,
            (CASE WHEN a.transaction='' THEN 'Não informado' ELSE a.transaction END) AS transaction,
            (CASE WHEN a.payment->>'$.pixcode' IS NULL OR a.payment->>'$.pixcode'='' THEN 'Não informado' ELSE a.payment->>'$.pixcode' END) AS pixcode,
            (CASE WHEN a.payment->>'$.barcode' IS NULL OR a.payment->>'$.barcode' THEN 'Não informado' ELSE a.payment->>'$.barcode' END) AS barcode,
            a.customer->>'$.name' AS name,
            a.customer->>'$.id' AS customer,
            a.payment->>'$.id' AS payment,
            a.details->>'$.pdf' AS pdf
            FROM `invoices` a WHERE a.id=:id AND a.account=:account");
            $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
            $stmt->bindValue(':id',$args['id'],PDO::PARAM_STR);
            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC)[0];
            if($stmt->rowCount()){
                $results['services']=json_decode($results['services']);
                foreach($results['services'] as $key=>$value){
                    $results['services'][$key]->services=$value->id;
                }
                $results['notifications']=json_decode($results['notifications']);
                foreach($results['notifications'] as $key=>$value){
                    $results['notifications'][$key]->text = $value->date.', '.($value->send=='on'?'enviado: ':'a enviar: ').($value->type=='invoice_due'?'Notificação de fatura antes do vencimento.':($value->type=='invoice_due_today'?'Notificação de fatura no dia do vencimento.':'Notificação de fatura depois do vencimento.'));
                }
            }
            //payments
            $stmt2 = $pdo->prepare("SELECT (CASE WHEN a.app<>'' THEN CONCAT((SELECT c.name FROM apps c WHERE c.id = (SELECT JSON_UNQUOTE(JSON_EXTRACT(b.apps,REPLACE(JSON_UNQUOTE(JSON_SEARCH(b.apps,'one',a.app,'','$[*].id')),'id','app'))) FROM accounts b WHERE b.id=a.account)),'/',(SELECT JSON_UNQUOTE(JSON_EXTRACT(b.apps,REPLACE(JSON_UNQUOTE(JSON_SEARCH(b.apps,'one',a.app,'','$[*].id')),'id','name'))) FROM accounts b WHERE b.id=a.account),': ',a.name) ELSE a.name END) AS name,
            a.id AS value FROM `payments` a WHERE a.status='on' AND a.account=:account ORDER BY a.name");
            $stmt2->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
            $stmt2->execute();
            $payment = $stmt2->fetchAll(PDO::FETCH_ASSOC);
            //customers
            $stmt2 = $pdo->prepare("SELECT a.name AS name,a.id AS value
            FROM `customers` a WHERE a.status='on' AND a.account=:account ORDER BY a.name");
            $stmt2->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
            $stmt2->execute();
            $customer = $stmt2->fetchAll(PDO::FETCH_ASSOC);
            //services
            $stmt2 = $pdo->prepare("SELECT a.name AS name,a.id AS value,format(a.price,2,'pt_BR') AS total
            FROM `services` a WHERE a.status='on' AND a.account=:account ORDER BY a.name");
            $stmt2->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
            $stmt2->execute();
            $services = $stmt2->fetchAll(PDO::FETCH_ASSOC);
            if($stmt->rowCount() == 0){
                $res->getBody()->write(json_encode(array('sts'=>200,'message'=>'Nenhum registro encontrado','payment'=>$payment,'customer'=>$customer,'services'=>$services)));
            }else{
                $res->getBody()->write(json_encode(array('sts'=>200,'results'=>$results,'payment'=>$payment,'customer'=>$customer,'services'=>$services)));
            }
        }catch(Exception $e){
            $res->getBody()->write(json_encode(array('message'=>'Operação inválida','sts'=>400)));
        }
    }else{
        $res->getBody()->write(json_encode(array('message'=>'Atributo inválido ou ausente','sts'=>400)));
    }
    $pdo = null;
    return $res->withHeader('Content-type','application/json; charset=utf-8');
}

function postInvoices($req,$res,$args){
    if(validateToken($req->getParam('user'),$req->getParam('token')) && $req->getParam('account') && $req->getParam('customer') && $req->getParam('services') && $req->getParam('status')){
        try {
            if($req->getParam('due_date')<date('Y-m-d')){
                $res->getBody()->write(json_encode(array('sts'=>400,'message'=>'Vencimento não pode ser menor que a data de amanhã')));
            }else{
                $id = id();
                $total = 0;
                if(is_array($req->getParam('services'))){
                    foreach($req->getParam('services') as $key=>$val){
                        $stmt = $pdo->prepare("SELECT a.name FROM `services` a WHERE a.account=:account AND a.id=:id");
                        $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
                        $stmt->bindValue(':id',$val['services'],PDO::PARAM_STR);
                        $stmt->execute();
                        $service = $stmt->fetchAll(PDO::FETCH_ASSOC)[0];
                        if($key!=0){
                            $services .= ',';
                        }
                        $services .= '{
                            "id": "'.$val['services'].'",
                            "name": "'.$service['name'].'",
                            "price": "'.$val['price'].'",
                            "quantity": "'.$val['quantity'].'"
                        }';
                        $total += $val['quantity']*$val['price'];
                    }
                    $services = '['.$services.']';
                }else{
                    $services = '[]';
                }
                $stmt = $pdo->prepare("SELECT a.name,a.document FROM `customers` a WHERE a.account=:account AND a.id=:id");
                $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
                $stmt->bindValue(':id',$req->getParam('customer'),PDO::PARAM_STR);
                $stmt->execute();
                $customer = $stmt->fetchAll(PDO::FETCH_ASSOC)[0];
                $stmt = $pdo->prepare("SELECT a.service,a.app,(CASE WHEN a.app<>'' THEN CONCAT((SELECT c.name FROM apps c WHERE c.id = (SELECT JSON_UNQUOTE(JSON_EXTRACT(b.apps,REPLACE(JSON_UNQUOTE(JSON_SEARCH(b.apps,'one',a.app,'','$[*].id')),'id','app'))) FROM accounts b WHERE b.id=a.account)),'/',(SELECT JSON_UNQUOTE(JSON_EXTRACT(b.apps,REPLACE(JSON_UNQUOTE(JSON_SEARCH(b.apps,'one',a.app,'','$[*].id')),'id','name'))) FROM accounts b WHERE b.id=a.account),': ',a.name) ELSE a.name END) AS name,
                (SELECT JSON_UNQUOTE(JSON_EXTRACT(b.apps,REPLACE(JSON_UNQUOTE(JSON_SEARCH(b.apps,'one',a.app,'','$[*].id')),'id','app'))) FROM accounts b WHERE b.id=a.account) AS app_name,
                (SELECT JSON_UNQUOTE(JSON_EXTRACT(b.apps,REPLACE(JSON_UNQUOTE(JSON_SEARCH(b.apps,'one',a.app,'','$[*].id')),'id','application'))) FROM accounts b WHERE b.id=a.account) AS application
                FROM `payments` a WHERE a.account=:account AND a.id=:id");
                $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
                $stmt->bindValue(':id',$req->getParam('payment'),PDO::PARAM_STR);
                $stmt->execute();
                $payment = $stmt->fetchAll(PDO::FETCH_ASSOC)[0];
                $payment['application'] = json_decode($payment['application']);
                if($req->getParam('status')=='paid'){
                    $payday = date('Y-m-d H:i:s');
                }else{
                    $payday = "0000-00-00 00:00:00";
                }
                if($payment['app']){
                    $charge = createPayment($req->getParam('account'),$id,array("name"=>$customer['name'],"document"=>$customer['document']),array("name"=>$payment['app_name'],"application"=>$payment['application'],"service"=>$payment['service']),json_decode($services));
                    createInvoice(array(
                        "id"=>$id,
                        "account"=>$req->getParam('account'),
                        "subscription"=>'',
                        "customer"=>'{"id":"'.$req->getParam('customer').'","name":"'.$customer['name'].'"}',
                        "due_date"=>$req->getParam('due_date'),
                        "total"=>$total,
                        "status"=>$req->getParam('status'),
                        "type"=>'manual',
                        "send"=>$req->getParam('send'),
                        "transaction"=>'',
                        "details"=>'{"barcode":"'.($charge->data->barcode?$charge->data->barcode:'').'","pdf":"https://pdf.paggy.com.br/'.$id.'","qrcode":"'.($charge->data->pix->qrcode?$charge->data->pix->qrcode:'').'","qrcode_image":"'.($charge->data->pix->qrcode_image?$charge->data->pix->qrcode_image:'').'"}',
                        "payment"=>'{"id":"'.$req->getParam('payment').'","app":"'.$payment['app'].'","service":"'.$payment['service'].'","name":"'.$payment['name'].'"}',
                        "services"=>$services,
                        "period"=>'',
                        "payday"=>$payday,
                        "note"=>''
                    ));
                }else{
                    createInvoice(array(
                        "id"=>$id,
                        "account"=>$req->getParam('account'),
                        "subscription"=>'',
                        "customer"=>'{"id":"'.$req->getParam('customer').'","name":"'.$customer['name'].'"}',
                        "due_date"=>$req->getParam('due_date'),
                        "total"=>$total,
                        "status"=>$req->getParam('status'),
                        "type"=>'manual',
                        "send"=>$req->getParam('send'),
                        "transaction"=>'',
                        "details"=>'{"barcode":"","pdf":"","qrcode":"","qrcode_image":""}',
                        "payment"=>'{"id":"'.$req->getParam('payment').'","app":"'.$payment['app'].'","service":"'.$payment['service'].'","name":"'.$payment['name'].'"}',
                        "services"=>$services,
                        "period"=>'',
                        "payday"=>$payday,
                        "note"=>''
                    ));
                }
                

                //enviar email

                //results
                $res->getBody()->write(json_encode(array('sts'=>200,'message'=>'Registro adicionado','id'=>$id)));
            }
        }catch(Exception $e){
            $res->getBody()->write(json_encode(array('sts'=>400,'message'=>'Operação inválida')));
        }
    }else{
        $res->getBody()->write(json_encode(array('sts'=>400,'message'=>'Atributo inválido ou inexistente')));
    }
    $pdo = null;
    return $res->withHeader('Content-type','application/json; charset=utf-8');
}

function putInvoices($req,$res,$args){
    if(validateToken($req->getParam('user'),$req->getParam('token')) && $req->getParam('account') && $args['id'] && $req->getParam('status')){
        try {
            $banco = db();
            $pdo = new PDO('mysql:host='.$banco['host'].';dbname='.$banco['name'].'',$banco['user'],$banco['password']);
            $pdo->exec("SET time_zone='+03:00'");
            $ids = explode(',',$args['id']);
            foreach($ids as $value){
                $stmt = $pdo->prepare("UPDATE `invoices` SET `status`=:status,`note`=:note WHERE `id`=:id AND `account`=:account");
                $stmt->bindValue(':id',$value,PDO::PARAM_STR);
                $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
                $stmt->bindValue(':status',$req->getParam('status'),PDO::PARAM_STR);
                $stmt->bindValue(':note',$req->getParam('note'),PDO::PARAM_STR);
                $stmt->execute();
                $res->getBody()->write(json_encode(array('sts'=>200,'message'=>'Registro modificado','id'=>$id)));
            }
        }catch(Exception $e){
            $res->getBody()->write(json_encode(array('sts'=>400,'message'=>'Operação inválida')));
        }
    }else{
        $res->getBody()->write(json_encode(array('message'=>'Atributo inválido ou inexistente','sts'=>400)));
    }
    $pdo = null;
    return $res->withHeader('Content-type','application/json; charset=utf-8');
}

function deleteInvoices($req,$res,$args){
    if(validateToken($req->getParam('user'),$req->getParam('token')) && $req->getParam('account') && $args['id']){
        try {
            $banco = db();
            $pdo = new PDO('mysql:host='.$banco['host'].';dbname='.$banco['name'].'',$banco['user'],$banco['password']);
            $pdo->exec("SET time_zone='+03:00'");
            $ids = explode(',',$args['id']);
            foreach($ids as $value){
                $stmt = $pdo->prepare("DELETE FROM `invoices` WHERE `id`=:id AND `account`=:account");
                $stmt->bindValue(':id',$value,PDO::PARAM_STR);
                $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
                $stmt->execute();
            }
            $res->getBody()->write(json_encode(array('sts'=>200,'message'=>'Registro excluído','id'=>$args['id'])));
        }catch(Exception $e){
            $res->getBody()->write(json_encode(array('message'=>'Operação inválida','sts'=>400)));
        }
    }else{
        $res->getBody()->write(json_encode(array('message'=>'Atributo inválido ou inexistente','sts'=>400)));
    }
    $pdo = null;
    return $res->withHeader('Content-type','application/json; charset=utf-8');
}