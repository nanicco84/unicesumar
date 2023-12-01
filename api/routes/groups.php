<?php

function getGroups($req,$res,$args){
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
            $stmt = $pdo->prepare("SELECT a.id,a.name,a.status,a.date AS datetime,
            DATE_FORMAT(a.date,'%d/%m/%Y') AS date,
            DATE_FORMAT(a.date,'%H:%i:%s') AS hour,
            (SELECT COUNT(b.id) FROM customers b WHERE JSON_SEARCH(b.`groups`,'one',a.id,'','$[*]')) AS customers
            FROM `groups` a
            WHERE a.account=:account ".$status." ".$date."
            HAVING LOWER(a.name) LIKE LOWER('%".$search."%')
            ORDER BY ".$order." LIMIT ".$page.",".$limit);
            $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
            //subtotal
            $stmt2 = $pdo->prepare("SELECT COUNT(x.id) AS subtotal FROM (
            SELECT a.id,a.name,a.date AS datetime
            FROM `groups` a
            WHERE a.account=:account ".$status." ".$date."
            HAVING LOWER(a.name) LIKE LOWER('%".$search."%')
            ) AS x");
            $stmt2->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
            $stmt2->execute();
            $subtotal = $stmt2->fetchAll(PDO::FETCH_ASSOC);
            //total
            $stmt2 = $pdo->prepare("SELECT COUNT(a.id) AS total FROM `groups` a WHERE a.account=:account");
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

function getGroupsId($req,$res,$args){
    if(validateToken($req->getParam('user'),$req->getParam('token')) && $req->getParam('account')){
        try {
            $banco = db();
            $pdo = new PDO('mysql:host='.$banco['host'].';dbname='.$banco['name'].'',$banco['user'],$banco['password']);
            $pdo->exec("SET time_zone='+03:00'");
            $stmt = $pdo->prepare("SELECT a.name,a.status
            FROM `groups` a WHERE a.id=:id AND a.account=:account");
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

function postGroups($req,$res,$args){
    if(validateToken($req->getParam('user'),$req->getParam('token')) && $req->getParam('account') && $req->getParam('name') && $req->getParam('status')){
        try {
            $banco = db();
            $pdo = new PDO('mysql:host='.$banco['host'].';dbname='.$banco['name'].'',$banco['user'],$banco['password']);
            $pdo->exec("SET time_zone='+03:00'");
            $stmt = $pdo->prepare("SELECT * FROM `groups` WHERE `name`=:name AND `account`=:account");
            $stmt->bindValue(':name',$req->getParam('name'),PDO::PARAM_STR);
            $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
            $stmt->execute();
            if($stmt->rowCount() == 0){
                $id = id();
                $stmt = $pdo->prepare("INSERT INTO `groups` (`id`,`account`,`date`,`name`,`status`) VALUES (:id,:account,:date,:name,:status)");
                $stmt->bindValue(':id',$id,PDO::PARAM_STR);
                $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
                $stmt->bindValue(':date',date('Y-m-d H:i:s'),PDO::PARAM_STR);
                $stmt->bindValue(':name',$req->getParam('name'),PDO::PARAM_STR);
                $stmt->bindValue(':status',$req->getParam('status'),PDO::PARAM_STR);
                $stmt->execute();
                //results
                $res->getBody()->write(json_encode(array('sts'=>200,'message'=>'Registro adicionado','id'=>$id)));
            }else{
                $res->getBody()->write(json_encode(array('sts'=>400,'message'=>'Já existe um registro com esse nome')));
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

function putGroups($req,$res,$args){
    if(validateToken($req->getParam('user'),$req->getParam('token')) && $req->getParam('account') && $args['id'] && $req->getParam('name') && $req->getParam('status')){
        try {
            $banco = db();
            $pdo = new PDO('mysql:host='.$banco['host'].';dbname='.$banco['name'].'',$banco['user'],$banco['password']);
            $pdo->exec("SET time_zone='+03:00'");
            $ids = explode(',',$args['id']);
            foreach($ids as $value){
                $stmt = $pdo->prepare("SELECT * FROM `groups` WHERE `name`=:name AND `account`=:account AND `id`<>:id");
                $stmt->bindValue(':name',$req->getParam('name'),PDO::PARAM_STR);
                $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
                $stmt->bindValue(':id',$value,PDO::PARAM_STR);
                $stmt->execute();
                if($stmt->rowCount() == 0){
                    $stmt = $pdo->prepare("UPDATE `groups` SET `name`=:name,`status`=:status WHERE `id`=:id AND `account`=:account");
                    $stmt->bindValue(':id',$value,PDO::PARAM_STR);
                    $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
                    $stmt->bindValue(':name',$req->getParam('name'),PDO::PARAM_STR);
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
                $stmt = $pdo->prepare("UPDATE `groups` SET `status`=:status WHERE `id`=:id AND `account`=:account");
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

function deleteGroups($req,$res,$args){
    if(validateToken($req->getParam('user'),$req->getParam('token')) && $req->getParam('account') && $args['id']){
        try {
            $banco = db();
            $pdo = new PDO('mysql:host='.$banco['host'].';dbname='.$banco['name'].'',$banco['user'],$banco['password']);
            $pdo->exec("SET time_zone='+03:00'");
            $ids = explode(',',$args['id']);
            foreach($ids as $value){
                $stmt = $pdo->prepare("DELETE FROM `groups` WHERE `id`=:id AND `account`=:account");
                $stmt->bindValue(':id',$value,PDO::PARAM_STR);
                $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
                $stmt->execute();
                $stmt = $pdo->prepare("UPDATE `customers` SET `groups`=JSON_REMOVE(`groups`,REPLACE(JSON_UNQUOTE(JSON_SEARCH(`groups`,'one',:id,'','$[*].id')),'.id','')) WHERE JSON_SEARCH(`groups`,'one',:id,'','$[*].id') AND `account`=:account");
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