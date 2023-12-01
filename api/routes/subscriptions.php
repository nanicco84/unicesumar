<?php

function getSubscriptions($req,$res,$args){
    if(validateToken($req->getParam('user'),$req->getParam('token')) && $req->getParam('account')){
        try {
            $banco = db();
            $pdo = new PDO('mysql:host='.$banco['host'].';dbname='.$banco['name'].'',$banco['user'],$banco['password']);
            $pdo->exec("SET time_zone='+03:00'");
            //search
            $search = '';
            if($req->getParam('search')){$search = $req->getParam('search');}
            //status
            $status = '';
            if($req->getParam('status')){$status = "AND a.status='".$req->getParam('status')."'";}
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
            if($req->getParam('order')){$order = str_replace('date','datetime',$req->getParam('order'));}
            //limit
            $limit = 20;
            if($req->getParam('limit')){$limit = (int)$req->getParam('limit');}
            //page
            $page = 0;
            if($req->getParam('page')){$page = ((int)$req->getParam('page')-1)*$limit;}
            //results
            $stmt = $pdo->prepare("SELECT a.id,a.date AS datetime,a.status,
            DATE_FORMAT(a.date,'%d/%m/%Y') AS date,
            DATE_FORMAT(a.date,'%H:%i:%s') AS hour,
            CONCAT('R$ ',format(a.total,2,'pt_BR')) AS total,
            DATE_FORMAT(a.next_due_date,'%d/%m/%Y') AS next_due_date,
            (CASE WHEN a.period='biweekly' THEN 'Quinzenal' WHEN a.period='monthly' THEN 'Mensal' WHEN a.period='bimonthly' THEN 'Bimestral' WHEN a.period='quarterly' THEN 'Trimestral' WHEN a.period='semiannual' THEN 'Semestral' WHEN a.period='yearly' THEN 'Anual' ELSE '' END) AS period,
            customer->>'$.id' AS customer,
            customer->>'$.name' AS customer_name,
            CONCAT('[',GROUP_CONCAT('{\"name\":\"',CONCAT(z.quantity,' x ',z.name,': R$',format(z.price,2,'pt_BR')),'\"}'),']') AS services,
            payment->>'$.id' AS payment,
            (CASE WHEN payment->>'$.id'='' THEN (SELECT JSON_UNQUOTE(JSON_EXTRACT(ap.services,REPLACE(JSON_UNQUOTE(JSON_SEARCH(ap.services,'one',payment->>'$.service','','$[*].id')),'id','name'))) FROM apps ap WHERE ap.id=payment->>'$.app') ELSE (SELECT pa.name FROM payments pa WHERE pa.id=payment->>'$.id') END) AS payment_name
            FROM `subscriptions` a
            JOIN JSON_TABLE(a.services,'$[*]' COLUMNS (quantity INT PATH '$.quantity',name varchar(100) PATH '$.name',price decimal(10,2) PATH '$.price')) z
            WHERE a.account=:account ".$status." ".$date." GROUP BY a.id
            HAVING (LOWER(customer_name) LIKE LOWER('%".$search."%') || LOWER(services) LIKE LOWER('%".$search."%'))
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
            CONCAT('[',GROUP_CONCAT('{\"name\":\"',CONCAT(z.quantity,' x ',z.name,': R$',format(z.price,2,'pt_BR')),'\"}'),']') AS services
            FROM `subscriptions` a
            JOIN JSON_TABLE(a.services,'$[*]' COLUMNS (quantity INT PATH '$.quantity',name varchar(100) PATH '$.name',price decimal(10,2) PATH '$.price')) z
            WHERE a.account=:account ".$status." ".$date." GROUP BY a.id
            HAVING (LOWER(customer_name) LIKE LOWER('%".$search."%') || LOWER(services) LIKE LOWER('%".$search."%'))
            ) AS x");
            $stmt2->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
            $stmt2->execute();
            $subtotal = $stmt2->fetchAll(PDO::FETCH_ASSOC);
            //total
            $stmt2 = $pdo->prepare("SELECT COUNT(a.id) AS total FROM `subscriptions` a WHERE a.account=:account");
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

function getSubscriptionsId($req,$res,$args){
    if(validateToken($req->getParam('user'),$req->getParam('token')) && $req->getParam('account')){
        try {
            $banco = db();
            $pdo = new PDO('mysql:host='.$banco['host'].';dbname='.$banco['name'].'',$banco['user'],$banco['password']);
            $pdo->exec("SET time_zone='+03:00'");
            $stmt = $pdo->prepare("SELECT a.status,a.total,a.next_due_date,a.period,a.send,a.note,a.services,
            a.customer->>'$.name' AS name,
            a.customer->>'$.id' AS customer,
            a.payment->>'$.id' AS payment
            FROM `subscriptions` a WHERE a.id=:id AND a.account=:account");
            $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
            $stmt->bindValue(':id',$args['id'],PDO::PARAM_STR);
            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC)[0];
            if($stmt->rowCount()){
                $results['services']=json_decode($results['services']);
                foreach($results['services'] as $key=>$value){
                    $results['services'][$key]->services=$value->id;
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
            //result
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

function postSubscriptions($req,$res,$args){
    if(validateToken($req->getParam('user'),$req->getParam('token')) && $req->getParam('account') && $req->getParam('customer') && $req->getParam('services') && $req->getParam('status')){
        try {
            if($req->getParam('next_due_date')<date('Y-m-d',strtotime(date('Y-m-d').'+1 day'))){
                $res->getBody()->write(json_encode(array('sts'=>400,'message'=>'Vencimento não pode ser menor que a data de amanhã')));
            }else{
                $banco = db();
                $pdo = new PDO('mysql:host='.$banco['host'].';dbname='.$banco['name'].'',$banco['user'],$banco['password']);
                $pdo->exec("SET time_zone='+03:00'");
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
                $stmt = $pdo->prepare("SELECT a.name FROM `customers` a WHERE a.account=:account AND a.id=:id");
                $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
                $stmt->bindValue(':id',$req->getParam('customer'),PDO::PARAM_STR);
                $stmt->execute();
                $customer = $stmt->fetchAll(PDO::FETCH_ASSOC)[0];
                $stmt = $pdo->prepare("SELECT a.service,a.app,(CASE WHEN a.app<>'' THEN CONCAT((SELECT c.name FROM apps c WHERE c.id = (SELECT JSON_UNQUOTE(JSON_EXTRACT(b.apps,REPLACE(JSON_UNQUOTE(JSON_SEARCH(b.apps,'one',a.app,'','$[*].id')),'id','app'))) FROM accounts b WHERE b.id=a.account)),'/',(SELECT JSON_UNQUOTE(JSON_EXTRACT(b.apps,REPLACE(JSON_UNQUOTE(JSON_SEARCH(b.apps,'one',a.app,'','$[*].id')),'id','name'))) FROM accounts b WHERE b.id=a.account),': ',a.name) ELSE a.name END) AS name FROM `payments` a WHERE a.account=:account AND a.id=:id");
                $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
                $stmt->bindValue(':id',$req->getParam('payment'),PDO::PARAM_STR);
                $stmt->execute();
                $payment = $stmt->fetchAll(PDO::FETCH_ASSOC)[0];
                $stmt = $pdo->prepare("INSERT INTO `subscriptions` (`id`,`account`,`date`,`customer`,`services`,`total`,`next_due_date`,`period`,`payment`,`send`,`note`,`status`) VALUES (:id,:account,:date,:customer,:service,:total,:next_due_date,:period,:payment,:send,:note,:status)");
                $stmt->bindValue(':id',$id,PDO::PARAM_STR);
                $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
                $stmt->bindValue(':date',date('Y-m-d H:i:s'),PDO::PARAM_STR);
                $stmt->bindValue(':customer','{
                    "id": "'.$req->getParam('customer').'",
                    "name": "'.$customer['name'].'"
                }',PDO::PARAM_STR);
                $stmt->bindValue(':service',$services,PDO::PARAM_STR);
                $stmt->bindValue(':total',$total,PDO::PARAM_STR);
                $stmt->bindValue(':status',$req->getParam('status'),PDO::PARAM_STR);
                $stmt->bindValue(':next_due_date',$req->getParam('next_due_date'),PDO::PARAM_STR);
                $stmt->bindValue(':period',$req->getParam('period'),PDO::PARAM_STR);
                $stmt->bindValue(':payment','{
                    "id": "'.$req->getParam('payment').'",
                    "app": "'.$payment['app'].'",
                    "name": "'.$payment['name'].'",
                    "service": "'.$payment['service'].'"
                }',PDO::PARAM_STR);
                $stmt->bindValue(':send',$req->getParam('send'),PDO::PARAM_STR);
                $stmt->bindValue(':note',$req->getParam('note'),PDO::PARAM_STR);
                $stmt->execute();
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

function putSubscriptions($req,$res,$args){
    if(validateToken($req->getParam('user'),$req->getParam('token')) && $req->getParam('account') && $args['id'] && $req->getParam('customer') && $req->getParam('services') && $req->getParam('status')){
        try {
            if($req->getParam('next_due_date')<date('Y-m-d')){
                $res->getBody()->write(json_encode(array('sts'=>400,'message'=>'Vencimento não pode ser menor que a data de hoje')));
            }else{
                $banco = db();
                $pdo = new PDO('mysql:host='.$banco['host'].';dbname='.$banco['name'].'',$banco['user'],$banco['password']);
                $pdo->exec("SET time_zone='+03:00'");
                $ids = explode(',',$args['id']);
                foreach($ids as $value){
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
                    $stmt = $pdo->prepare("SELECT a.name FROM `customers` a WHERE a.account=:account AND a.id=:id");
                    $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
                    $stmt->bindValue(':id',$req->getParam('customer'),PDO::PARAM_STR);
                    $stmt->execute();
                    $customer = $stmt->fetchAll(PDO::FETCH_ASSOC)[0];
                    $stmt = $pdo->prepare("SELECT a.service,a.app,(CASE WHEN a.app<>'' THEN CONCAT((SELECT c.name FROM apps c WHERE c.id = (SELECT JSON_UNQUOTE(JSON_EXTRACT(b.apps,REPLACE(JSON_UNQUOTE(JSON_SEARCH(b.apps,'one',a.app,'','$[*].id')),'id','app'))) FROM accounts b WHERE b.id=a.account)),'/',(SELECT JSON_UNQUOTE(JSON_EXTRACT(b.apps,REPLACE(JSON_UNQUOTE(JSON_SEARCH(b.apps,'one',a.app,'','$[*].id')),'id','name'))) FROM accounts b WHERE b.id=a.account),': ',a.name) ELSE a.name END) AS name FROM `payments` a WHERE a.account=:account AND a.id=:id");
                    $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
                    $stmt->bindValue(':id',$req->getParam('payment'),PDO::PARAM_STR);
                    $stmt->execute();
                    $payment = $stmt->fetchAll(PDO::FETCH_ASSOC)[0];
                    $stmt = $pdo->prepare("UPDATE `subscriptions` SET `customer`=:customer,`services`=:services,`total`=:total,`status`=:status,`next_due_date`=:next_due_date,`period`=:period,`payment`=:payment,`send`=:send,`note`=:note WHERE `id`=:id AND `account`=:account");
                    $stmt->bindValue(':id',$value,PDO::PARAM_STR);
                    $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
                    $stmt->bindValue(':customer','{
                        "id": "'.$req->getParam('customer').'",
                        "name": "'.$customer['name'].'"
                    }',PDO::PARAM_STR);
                    $stmt->bindValue(':services',$services,PDO::PARAM_STR);
                    $stmt->bindValue(':total',$total,PDO::PARAM_STR);
                    $stmt->bindValue(':status',$req->getParam('status'),PDO::PARAM_STR);
                    $stmt->bindValue(':next_due_date',$req->getParam('next_due_date'),PDO::PARAM_STR);
                    $stmt->bindValue(':period',$req->getParam('period'),PDO::PARAM_STR);
                    $stmt->bindValue(':payment','{
                        "id": "'.$req->getParam('payment').'",
                        "app": "'.$payment['app'].'",
                        "name": "'.$payment['name'].'",
                        "service": "'.$payment['service'].'"
                    }',PDO::PARAM_STR);
                    $stmt->bindValue(':send',$req->getParam('send'),PDO::PARAM_STR);
                    $stmt->bindValue(':note',$req->getParam('note'),PDO::PARAM_STR);
                    $stmt->execute();
                    $res->getBody()->write(json_encode(array('sts'=>200,'message'=>'Registro modificado','id'=>$id)));
                }
            }
        }catch(Exception $e){
            $res->getBody()->write(json_encode(array('sts'=>400,'message'=>'Operação inválida')));
        }
    }elseif(validateToken($req->getParam('user'),$req->getParam('token')) && $req->getParam('account') && $args['id'] && $req->getParam('status')){
        try {
            $banco = db();
            $pdo = new PDO('mysql:host='.$banco['host'].';dbname='.$banco['name'].'',$banco['user'],$banco['password']);
            $pdo->exec("SET time_zone='+03:00'");
            $ids = explode(',',$args['id']);
            foreach($ids as $value){
                $stmt = $pdo->prepare("UPDATE `subscriptions` SET `status`=:status WHERE `id`=:id AND `account`=:account");
                $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
                $stmt->bindValue(':id',$value,PDO::PARAM_STR);
                $stmt->bindValue(':status',$req->getParam('status'),PDO::PARAM_STR);
                $stmt->execute();
            }
            $res->getBody()->write(json_encode(array('sts'=>200,'message'=>'Registro modificado','id'=>$args['id'])));
        }catch(Exception $e){
            $res->getBody()->write(json_encode(array('message'=>'Operação inválida','sts'=>400)));
        }
    }else{
        $res->getBody()->write(json_encode(array('message'=>'Atributo inválido ou inexistente','sts'=>400)));
    }
    $pdo = null;
    return $res->withHeader('Content-type','application/json; charset=utf-8');
}

function deleteSubscriptions($req,$res,$args){
    if(validateToken($req->getParam('user'),$req->getParam('token')) && $req->getParam('account') && $args['id']){
        try {
            $banco = db();
            $pdo = new PDO('mysql:host='.$banco['host'].';dbname='.$banco['name'].'',$banco['user'],$banco['password']);
            $pdo->exec("SET time_zone='+03:00'");
            $ids = explode(',',$args['id']);
            foreach($ids as $value){
                $stmt = $pdo->prepare("DELETE FROM `subscriptions` WHERE `id`=:id AND `account`=:account");
                $stmt->bindValue(':id',$value,PDO::PARAM_STR);
                $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
                $stmt->execute();
                $stmt = $pdo->prepare("UPDATE `invoices` SET `subscription`='' WHERE subscriptions=:id AND `account`=:account");
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