<?php

function getCustomers($req,$res,$args){
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
            $stmt = $pdo->prepare("SELECT a.id,a.name,a.document,a.phone,a.email,a.status,
            a.date AS datetime,
            DATE_FORMAT(a.date,'%d/%m/%Y') AS date,
            DATE_FORMAT(a.date,'%H:%i:%s') AS hour,
            (SELECT COUNT(b.id) FROM subscriptions b WHERE b.customer=a.id) AS subscriptions,
            (SELECT COUNT(c.id) FROM invoices c WHERE c.subscription IN (SELECT b.id FROM subscriptions b WHERE b.customer=a.id)) AS invoices
            FROM customers a
            WHERE a.account=:account ".$status." ".$date."
            HAVING (LOWER(a.name) LIKE LOWER('%".$search."%') OR LOWER(a.document) LIKE LOWER('%".$search."%') OR LOWER(a.phone) LIKE LOWER('%".$search."%') OR LOWER(a.email) LIKE LOWER('%".$search."%'))
            ORDER BY ".$order." LIMIT ".$page.",".$limit);
            $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
            //subtotal
            $stmt2 = $pdo->prepare("SELECT COUNT(x.id) AS subtotal FROM (
            SELECT a.id,a.name,a.document,a.phone,a.email,
            a.date AS datetime
            FROM customers a
            WHERE a.account=:account ".$status." ".$date."
            HAVING (LOWER(a.name) LIKE LOWER('%".$search."%') OR LOWER(a.document) LIKE LOWER('%".$search."%') OR LOWER(a.phone) LIKE LOWER('%".$search."%') OR LOWER(a.email) LIKE LOWER('%".$search."%'))
            ) AS x");
            $stmt2->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
            $stmt2->execute();
            $subtotal = $stmt2->fetchAll(PDO::FETCH_ASSOC);
            //total
            $stmt2 = $pdo->prepare("SELECT COUNT(a.id) AS total FROM customers a WHERE a.account=:account");
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


function getCustomersId($req,$res,$args){
    if(validateToken($req->getParam('user'),$req->getParam('token')) && $req->getParam('account')){
        try {
            $banco = db();
            $pdo = new PDO('mysql:host='.$banco['host'].';dbname='.$banco['name'].'',$banco['user'],$banco['password']);
            $pdo->exec("SET time_zone='+03:00'");
            $stmt = $pdo->prepare("SELECT a.name,a.document,a.phone,a.whatsapp,a.email,a.status,a.groups,a.note,a.site,a.answerable,
            a.address->>'$.zip_code' AS zip_code,
            a.address->>'$.address' AS address,
            a.address->>'$.number' AS number,
            a.address->>'$.district' AS district,
            a.address->>'$.city' AS city,
            a.address->>'$.state' AS state,
            a.address->>'$.complement' AS complement
            FROM customers a WHERE a.id=:id AND a.account=:account");
            $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
            $stmt->bindValue(':id',$args['id'],PDO::PARAM_STR);
            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC)[0];
            $results['groups'] = json_decode(str_replace('"id"','"groups"',$results['groups']));
            //groups
            $stmt = $pdo->prepare("SELECT id AS value,name AS name FROM `groups` WHERE `account`=:account AND status='on' ORDER BY name");
            $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
            $stmt->execute();
            $groups = $stmt->fetchAll(PDO::FETCH_ASSOC);
            //results
            if($stmt->rowCount() == 0){
                $res->getBody()->write(json_encode(array('sts'=>200,'message'=>'Nenhum registro encontrado','groups'=>$groups)));
            }else{
                $res->getBody()->write(json_encode(array('sts'=>200,'results'=>$results,'groups'=>$groups)));
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

function postCustomers($req,$res,$args){
    if(validateToken($req->getParam('user'),$req->getParam('token')) && $req->getParam('account') && $req->getParam('name') && $req->getParam('email') && $req->getParam('document') && $req->getParam('phone')){
        try {
            $banco = db();
            $pdo = new PDO('mysql:host='.$banco['host'].';dbname='.$banco['name'].'',$banco['user'],$banco['password']);
            $pdo->exec("SET time_zone='+03:00'");
            $stmt = $pdo->prepare("SELECT * FROM `customers` WHERE `document`=:document AND `account`=:account");
            $stmt->bindValue(':document',$req->getParam('document'),PDO::PARAM_STR);
            $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
            $stmt->execute();
            if($stmt->rowCount() == 0){
                if(count(explode(' ',rtrim(ltrim($req->getParam('name')))))>1){
                    $id = id();
                    $stmt = $pdo->prepare("INSERT INTO `customers` (`id`,`account`,`date`,`name`,`document`,`phone`,`whatsapp`,`email`,`address`,`note`,`groups`,`status`,`site`,`answerable`) VALUES (:id,:account,:date,:name,:document,:phone,:whatsapp,:email,:address,:note,:groups,:status,:site,:answerable)");
                    $stmt->bindValue(':id',$id,PDO::PARAM_STR);
                    $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
                    $stmt->bindValue(':date',date('Y-m-d H:i:s'),PDO::PARAM_STR);
                    $stmt->bindValue(':name',$req->getParam('name'),PDO::PARAM_STR);
                    $stmt->bindValue(':document',$req->getParam('document'),PDO::PARAM_STR);
                    $stmt->bindValue(':phone',$req->getParam('phone'),PDO::PARAM_STR);
                    $stmt->bindValue(':whatsapp',$req->getParam('whatsapp'),PDO::PARAM_STR);
                    $stmt->bindValue(':email',$req->getParam('email'),PDO::PARAM_STR);
                    $stmt->bindValue(':address','{
                        "address":"'.$req->getParam('address').'",
                        "number":"'.$req->getParam('number').'",
                        "district":"'.$req->getParam('district').'",
                        "city":"'.$req->getParam('city').'",
                        "state":"'.$req->getParam('state').'",
                        "zip_code":"'.$req->getParam('zip_code').'",
                        "complement":"'.$req->getParam('complement').'"
                    }',PDO::PARAM_STR);
                    $stmt->bindValue(':note',$req->getParam('note'),PDO::PARAM_STR);
                    $stmt->bindValue(':groups',($req->getParam('groups')&&$req->getParam('groups')[0]?str_replace('"groups"','"id"',json_encode($req->getParam('groups'))):'[]'),PDO::PARAM_STR);
                    $stmt->bindValue(':status',$req->getParam('status'),PDO::PARAM_STR);
                    $stmt->bindValue(':site',$req->getParam('site'),PDO::PARAM_STR);
                    $stmt->bindValue(':answerable',$req->getParam('answerable'),PDO::PARAM_STR);
                    $stmt->execute();
                    //results
                    $res->getBody()->write(json_encode(array('sts'=>200,'message'=>'Registro adicionado','id'=>$id)));
                }else{
                    $res->getBody()->write(json_encode(array('sts'=>400,'message'=>'O nome precisa estar completo')));
                }
            }else{
                $res->getBody()->write(json_encode(array('sts'=>400,'message'=>'Já existe um registro com esse CPF/CNPJ')));
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

function putCustomers($req,$res,$args){
    if(validateToken($req->getParam('user'),$req->getParam('token')) && $req->getParam('account') && $args['id'] && $req->getParam('name') && $req->getParam('email') && $req->getParam('document') && $req->getParam('phone')){
        try {
            $banco = db();
            $pdo = new PDO('mysql:host='.$banco['host'].';dbname='.$banco['name'].'',$banco['user'],$banco['password']);
            $pdo->exec("SET time_zone='+03:00'");
            $stmt = $pdo->prepare("SELECT * FROM `customers` WHERE `document`=:document AND id<>:id AND `account`=:account");
            $stmt->bindValue(':id',$args['id'],PDO::PARAM_STR);
            $stmt->bindValue(':document',$req->getParam('document'),PDO::PARAM_STR);
            $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
            $stmt->execute();
            if($stmt->rowCount() == 0){
                if(count(explode(' ',rtrim(ltrim($req->getParam('name')))))>1){
                    $stmt = $pdo->prepare("UPDATE customers SET
                    name=:name,
                    email=:email,
                    document=:document,
                    phone=:phone,
                    whatsapp=:whatsapp,
                    answerable=:answerable,
                    site=:site,
                    note=:note,
                    `groups`=:groups,
                    address=:address
                    WHERE id=:id AND account=:account"); 
                    $stmt->bindValue(':id',$args['id'],PDO::PARAM_STR);
                    $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
                    $stmt->bindValue(':name',$req->getParam('name'),PDO::PARAM_STR);
                    $stmt->bindValue(':email',$req->getParam('email'),PDO::PARAM_STR);
                    $stmt->bindValue(':phone',$req->getParam('phone'),PDO::PARAM_STR);
                    $stmt->bindValue(':whatsapp',$req->getParam('whatsapp'),PDO::PARAM_STR);
                    $stmt->bindValue(':site',$req->getParam('site'),PDO::PARAM_STR);
                    $stmt->bindValue(':document',$req->getParam('document'),PDO::PARAM_STR);
                    $stmt->bindValue(':answerable',$req->getParam('answerable'),PDO::PARAM_STR);
                    $stmt->bindValue(':address','{
                        "address":"'.$req->getParam('address').'",
                        "number":"'.$req->getParam('number').'",
                        "district":"'.$req->getParam('district').'",
                        "city":"'.$req->getParam('city').'",
                        "state":"'.$req->getParam('state').'",
                        "zip_code":"'.$req->getParam('zip_code').'",
                        "complement":"'.$req->getParam('complement').'"
                    }',PDO::PARAM_STR);
                    $stmt->bindValue(':note',$req->getParam('note'),PDO::PARAM_STR);
                    $stmt->bindValue(':groups',($req->getParam('groups')&&$req->getParam('groups')[0]?str_replace('"groups"','"id"',json_encode($req->getParam('groups'))):'[]'),PDO::PARAM_STR);
                    $stmt->execute();
                    $stmt = $pdo->prepare("UPDATE `subscriptions` SET `customer`=JSON_SET(`customer`,'$.name',:name) WHERE JSON_SEARCH(`customer`,'one',:id,'','$.id') AND `account`=:account");
                    $stmt->bindValue(':id',$value,PDO::PARAM_STR);
                    $stmt->bindValue(':name',$req->getParam('name'),PDO::PARAM_STR);
                    $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
                    $stmt->execute();
                    $stmt = $pdo->prepare("UPDATE `invoices` SET `customer`=JSON_SET(`customer`,'$.name',:name) WHERE JSON_SEARCH(`customer`,'one',:id,'','$.id') AND `account`=:account");
                    $stmt->bindValue(':id',$value,PDO::PARAM_STR);
                    $stmt->bindValue(':name',$req->getParam('name'),PDO::PARAM_STR);
                    $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
                    $stmt->execute();
                    $res->getBody()->write(json_encode(array('sts'=>200,'message'=>'Registro modificado')));
                }else{
                    $res->getBody()->write(json_encode(array('sts'=>400,'message'=>'O nome precisa estar completo')));
                }
            }else{
                $res->getBody()->write(json_encode(array('sts'=>400,'message'=>'Já existe um registro com esse CPF/CNPJ')));
            }
        }catch(Exception $e){
            $res->getBody()->write(json_encode(array('message'=>'Operação inválida','sts'=>400)));
        }
    }elseif(validateToken($req->getParam('user'),$req->getParam('token')) && $req->getParam('account') && $args['id'] && $req->getParam('status')){
        try {
            $banco = db();
            $pdo = new PDO('mysql:host='.$banco['host'].';dbname='.$banco['name'].'',$banco['user'],$banco['password']);
            $pdo->exec("SET time_zone='+03:00'");
            $ids = explode(',',$args['id']);
            foreach($ids as $value){
                $stmt = $pdo->prepare("UPDATE `customers` SET `status`=:status WHERE `id`=:id AND `account`=:account");
                $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
                $stmt->bindValue(':id',$value,PDO::PARAM_STR);
                $stmt->bindValue(':status',$req->getParam('status'),PDO::PARAM_STR);
                $stmt->execute();
                $stmt = $pdo->prepare("UPDATE `subscriptions` SET `status`=:status WHERE JSON_SEARCH(customer,'one',:id,'','$.id') AND `account`=:account");
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
        $res->getBody()->write(json_encode(array('message'=>'Atributo inválido ou ausente','sts'=>400)));
    }
    $pdo = null;
    return $res->withHeader('Content-type','application/json; charset=utf-8');
}

function deleteCustomers($req,$res,$args){
    if(validateToken($req->getParam('user'),$req->getParam('token')) && $req->getParam('account') && $args['id']){
        try {
            $banco = db();
            $pdo = new PDO('mysql:host='.$banco['host'].';dbname='.$banco['name'].'',$banco['user'],$banco['password']);
            $pdo->exec("SET time_zone='+03:00'");
            $ids = explode(',',$args['id']);
            foreach($ids as $value){
                $stmt = $pdo->prepare("DELETE FROM `customers` WHERE `id`=:id AND `account`=:account");
                $stmt->bindValue(':id',$value,PDO::PARAM_STR);
                $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
                $stmt->execute();
                $stmt = $pdo->prepare("DELETE FROM `subscriptions` WHERE JSON_SEARCH(`customer`,'one',:id,'','$.id') AND `account`=:account");
                $stmt->bindValue(':id',$value,PDO::PARAM_STR);
                $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
                $stmt->execute();
                $stmt = $pdo->prepare("UPDATE `invoices` SET `customer`=JSON_SET(`customer`,'$.id','') WHERE JSON_SEARCH(`customer`,'one',:id,'','$.id') AND `account`=:account");
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