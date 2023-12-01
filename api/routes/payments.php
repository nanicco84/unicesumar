<?php

function getPayments($req,$res,$args){
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
            //order
            $order = 'datetime DESC';
            if($req->getParam('order')){$order = str_replace('date','datetime',$req->getParam('order'));}
            //limit
            $limit = 20;
            if($req->getParam('limit')){$limit = (int)$req->getParam('limit');}
            //page
            $page = 0;
            if($req->getParam('page')){$page = ((int)$req->getParam('page')-1)*$limit;}
            //app
            $app = '';
            if($req->getParam('app')){$app = " AND a.app='".$req->getParam('app')."'";}
            //results
            $stmt = $pdo->prepare("
            SELECT a.name,a.status,a.service,a.id,a.app,a.date AS datetime,
            DATE_FORMAT(a.date,'%d/%m/%Y') AS date,
            DATE_FORMAT(a.date,'%H:%i:%s') AS hour,
            (CASE WHEN a.app<>'' THEN (SELECT b.name FROM apps b WHERE b.id=(SELECT JSON_UNQUOTE(JSON_EXTRACT(c.apps,REPLACE(JSON_UNQUOTE(JSON_SEARCH(c.apps,'one',a.app,'','$[*].id')),'id','app'))) FROM accounts c WHERE c.id=a.account)) ELSE '' END) AS app_name
            FROM payments a
            WHERE a.account=:account ".$status." ".$app."
            HAVING (LOWER(a.name) LIKE LOWER('%".$search."%') OR LOWER(app_name) LIKE LOWER('%".$search."%'))
            ORDER BY ".$order." LIMIT ".$page.",".$limit);
            $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
            //subtotal
            $stmt2 = $pdo->prepare("SELECT COUNT(x.name) AS subtotal FROM (
            SELECT a.name,a.status,a.date AS datetime,
            (CASE WHEN a.app<>'' THEN (SELECT b.name FROM apps b WHERE b.id=(SELECT JSON_UNQUOTE(JSON_EXTRACT(c.apps,REPLACE(JSON_UNQUOTE(JSON_SEARCH(c.apps,'one',a.app,'','$[*].id')),'id','app'))) FROM accounts c WHERE c.id=a.account)) ELSE '' END) AS app_name
            FROM payments a
            WHERE a.account=:account ".$status." ".$app."
            HAVING (LOWER(a.name) LIKE LOWER('%".$search."%') OR LOWER(app_name) LIKE LOWER('%".$search."%'))
            ) AS x");
            $stmt2->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
            $stmt2->execute();
            $subtotal = $stmt2->fetchAll(PDO::FETCH_ASSOC);
            //total
            $stmt2 = $pdo->prepare("SELECT COUNT(a.id) AS total FROM payments a WHERE a.account=:account");
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

function getPaymentsId($req,$res,$args){
    if(validateToken($req->getParam('user'),$req->getParam('token')) && $req->getParam('account')){
        try {
            $banco = db();
            $pdo = new PDO('mysql:host='.$banco['host'].';dbname='.$banco['name'].'',$banco['user'],$banco['password']);
            $pdo->exec("SET time_zone='+03:00'");
            $stmt = $pdo->prepare("SELECT a.name,a.status,a.text,a.app
            FROM `payments` a WHERE a.id=:id AND a.account=:account");
            $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
            $stmt->bindValue(':id',$args['id'],PDO::PARAM_STR);
            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC)[0];
            if($stmt->rowCount() == 0){
                $res->getBody()->write(json_encode(array('sts'=>200,'message'=>'Nenhum registro encontrado')));
            }else{
                $res->getBody()->write(json_encode(array('sts'=>200,'results'=>$results)));
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

function putPayments($req,$res,$args){
    if(validateToken($req->getParam('user'),$req->getParam('token')) && $req->getParam('account') && $args['id'] && $req->getParam('name') && $req->getParam('status')){
        try {
            $banco = db();
            $pdo = new PDO('mysql:host='.$banco['host'].';dbname='.$banco['name'].'',$banco['user'],$banco['password']);
            $pdo->exec("SET time_zone='+03:00'");
            $ids = explode(',',$args['id']);
            foreach($ids as $value){
                $stmt = $pdo->prepare("SELECT * FROM `payments` WHERE `name`=:name AND `account`=:account AND `id`<>:id");
                $stmt->bindValue(':name',$req->getParam('name'),PDO::PARAM_STR);
                $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
                $stmt->bindValue(':id',$value,PDO::PARAM_STR);
                $stmt->execute();
                if($stmt->rowCount() == 0){
                    $stmt = $pdo->prepare("UPDATE `payments` SET `name`=:name,`text`=:text,`status`=:status WHERE `id`=:id AND `account`=:account");
                    $stmt->bindValue(':id',$value,PDO::PARAM_STR);
                    $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
                    $stmt->bindValue(':name',$req->getParam('name'),PDO::PARAM_STR);
                    $stmt->bindValue(':text',$req->getParam('text'),PDO::PARAM_STR);
                    $stmt->bindValue(':status',$req->getParam('status'),PDO::PARAM_STR);
                    $stmt->execute();
                    $res->getBody()->write(json_encode(array('sts'=>200,'message'=>'Registro modificado','id'=>$id)));
                }else{
                    $res->getBody()->write(json_encode(array('sts'=>400,'message'=>'Já existe um registro com esse nome')));
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
                $stmt = $pdo->prepare("UPDATE `payments` SET `status`=:status WHERE `id`=:id AND `account`=:account");
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