<?php

function getUsers($req,$res,$args){
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
            $stmt = $pdo->prepare("SELECT a.id,a.status,a.name,a.email,a.main,
            a.date AS datetime,
            DATE_FORMAT(a.date,'%d/%m/%Y') AS date,
            DATE_FORMAT(a.date,'%H:%i:%s') AS hour
            FROM users a
            WHERE a.account=:account ".$status." ".$date."
            HAVING (LOWER(a.name) LIKE LOWER('%".$search."%') OR LOWER(a.email) LIKE LOWER('%".$search."%'))
            ORDER BY ".$order." LIMIT ".$page.",".$limit);
            $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
            //subtotal
            $stmt2 = $pdo->prepare("SELECT COUNT(x.id) AS subtotal FROM (
            SELECT a.id,a.name,a.email,
            a.date AS datetime
            FROM users a
            WHERE a.account=:account ".$status." ".$date."
            HAVING (LOWER(a.name) LIKE LOWER('%".$search."%') OR LOWER(a.email) LIKE LOWER('%".$search."%'))
            ) AS x");
            $stmt2->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
            $stmt2->execute();
            $subtotal = $stmt2->fetchAll(PDO::FETCH_ASSOC);
            //total
            $stmt2 = $pdo->prepare("SELECT COUNT(a.id) AS total FROM users a WHERE a.account=:account");
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

function getUsersId($req,$res,$args){
    if(validateToken($req->getParam('user'),$req->getParam('token')) && $req->getParam('account')){
        try {
            $banco = db();
            $pdo = new PDO('mysql:host='.$banco['host'].';dbname='.$banco['name'].'',$banco['user'],$banco['password']);
            $pdo->exec("SET time_zone='+03:00'");
            $stmt = $pdo->prepare("SELECT a.name,a.email,a.status FROM users a WHERE a.id=:id AND a.account=:account");
            $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
            $stmt->bindValue(':id',$args['id'],PDO::PARAM_STR);
            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
            if($stmt->rowCount() == 0){
                $res->getBody()->write(json_encode(array('sts'=>200,'message'=>'Nenhum registro encontrado')));
            }else{
                $res->getBody()->write(json_encode(array('sts'=>200,'results'=>$results[0])));
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

function postUsers($req,$res,$args){
    if(validateToken($req->getParam('user'),$req->getParam('token')) && $req->getParam('account') && $req->getParam('name') && $req->getParam('email') && $req->getParam('status')){
        try {
            $banco = db();
            $pdo = new PDO('mysql:host='.$banco['host'].';dbname='.$banco['name'].'',$banco['user'],$banco['password']);
            $pdo->exec("SET time_zone='+03:00'");
            $stmt = $pdo->prepare("SELECT * FROM `users` WHERE `email`=:email");
            $stmt->bindValue(':email',$req->getParam('email'),PDO::PARAM_STR);
            $stmt->execute();
            if($stmt->rowCount() == 0){
                $id = id();
                $password = generatePassword();
                $stmt = $pdo->prepare("INSERT INTO `users` (`id`,`account`,`date`,`name`,`email`,`password`,`main`,`status`,`tokens`) VALUES (:id,:account,:date,:name,:email,:password,:main,:status,:tokens)");
                $stmt->bindValue(':id',$id,PDO::PARAM_STR);
                $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
                $stmt->bindValue(':date',date('Y-m-d H:i:s'),PDO::PARAM_STR);
                $stmt->bindValue(':name',$req->getParam('name'),PDO::PARAM_STR);
                $stmt->bindValue(':email',$req->getParam('email'),PDO::PARAM_STR);
                $stmt->bindValue(':password',md5($password),PDO::PARAM_STR);
                $stmt->bindValue(':main','off',PDO::PARAM_STR);
                $stmt->bindValue(':status',$req->getParam('status'),PDO::PARAM_STR);
                $stmt->bindValue(':tokens','[]',PDO::PARAM_STR);
                $stmt->execute();
                //email
                $stmt = $pdo->prepare("SELECT name,email FROM `accounts` WHERE `id`=:account");
                $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
                $stmt->execute();
                $company = $stmt->fetchAll(PDO::FETCH_ASSOC)[0];
                $body = 'Olá '.$req->getParam('name').',\n\nUma nova senha foi gerada para você. Segue abaixo:\n\nSenha: '.$password;
                $curl = curl_init();
                curl_setopt_array($curl, array(
                    CURLOPT_URL => 'https://api.paggy.com.br/v1/email?account='.$req->getParam('account').'&subject=Nova%20senha&body='.urlencode($body).'&to[0][email]='.$req->getParam('email').'&to[0][name]='.urlencode($req->getParam('name')).'&from[email]='.$company['email'].'&from[name]='.urlencode($company['name']),
                    CURLOPT_RETURNTRANSFER => true,
                    CURLOPT_ENCODING => '',
                    CURLOPT_MAXREDIRS => 10,
                    CURLOPT_TIMEOUT => 0,
                    CURLOPT_FOLLOWLOCATION => true,
                    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                    CURLOPT_CUSTOMREQUEST => 'POST',
                ));
                $response = curl_exec($curl);
                curl_close($curl);
                //result
                $res->getBody()->write(json_encode(array('sts'=>200,'message'=>'Registro adicionado','id'=>$id)));
            }else{
                $res->getBody()->write(json_encode(array('message'=>'Já existe um registro com esse email','sts'=>400)));
            }
        }catch(Exception $e){
            $res->getBody()->write(json_encode(array('message'=>'Operação inválida','sts'=>400)));
        }
    }else{
        $res->getBody()->write(json_encode(array('message'=>'Atributo inválido ou inexistente','sts'=>400)));
    }
    $pdo = null;
    return $res->withHeader('Content-type','application/json; charset=utf-8');
}

function putUsers($req,$res,$args){
    if(validateToken($req->getParam('user'),$req->getParam('token')) && $req->getParam('account') && $args['id'] && $req->getParam('name') && $req->getParam('email') && $req->getParam('status')){
        try {
            $banco = db();
            $pdo = new PDO('mysql:host='.$banco['host'].';dbname='.$banco['name'].'',$banco['user'],$banco['password']);
            $pdo->exec("SET time_zone='+03:00'");
            $ids = explode(',',$args['id']);
            foreach($ids as $value){
                $stmt = $pdo->prepare("SELECT * FROM `users` WHERE `email`=:email AND `id`<>:id");
                $stmt->bindValue(':email',$req->getParam('email'),PDO::PARAM_STR);
                $stmt->bindValue(':id',$value,PDO::PARAM_STR);
                $stmt->execute();
                if($stmt->rowCount() == 0){
                    $stmt = $pdo->prepare("UPDATE `users` SET `name`=:name,`email`=:email,`status`=:status WHERE `id`=:id AND `account`=:account");
                    $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
                    $stmt->bindValue(':id',$value,PDO::PARAM_STR);
                    $stmt->bindValue(':name',$req->getParam('name'),PDO::PARAM_STR);
                    $stmt->bindValue(':email',$req->getParam('email'),PDO::PARAM_STR);
                    $stmt->bindValue(':status',$req->getParam('status'),PDO::PARAM_STR);
                    $stmt->execute();
                    $res->getBody()->write(json_encode(array('sts'=>200,'message'=>'Registro modificado','id'=>$args['id'])));
                }else{
                    $res->getBody()->write(json_encode(array('message'=>'Já existe um registro com esse email','sts'=>400)));
                }
            }
        }catch(Exception $e){
            $res->getBody()->write(json_encode(array('message'=>'Operação inválida','sts'=>400)));
        }
    }elseif(validateToken($req->getParam('user'),$req->getParam('token')) && $req->getParam('account') && $args['id'] && $req->getParam('password')){
        try {
            $banco = db();
            $pdo = new PDO('mysql:host='.$banco['host'].';dbname='.$banco['name'].'',$banco['user'],$banco['password']);
            $pdo->exec("SET time_zone='+03:00'");
            $ids = explode(',',$args['id']);
            foreach($ids as $value){
                $password = generatePassword();
                $stmt = $pdo->prepare("UPDATE `users` SET `password`=:password WHERE `id`=:id AND `account`=:account");
                $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
                $stmt->bindValue(':id',$value,PDO::PARAM_STR);
                $stmt->bindValue(':password',md5($password),PDO::PARAM_STR);
                $stmt->execute();
                //email
                $stmt = $pdo->prepare("SELECT * FROM `users` WHERE `id`=:id AND `account`=:account");
                $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
                $stmt->bindValue(':id',$value,PDO::PARAM_STR);
                $stmt->execute();
                $user = $stmt->fetchAll(PDO::FETCH_ASSOC)[0];
                $stmt = $pdo->prepare("SELECT name,email FROM `accounts` WHERE `id`=:account");
                $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
                $stmt->execute();
                $company = $stmt->fetchAll(PDO::FETCH_ASSOC)[0];
                $body = 'Olá '.$user['name'].',\n\nUma nova senha foi gerada para você. Segue abaixo:\n\nSenha: '.$password;
                $curl = curl_init();
                curl_setopt_array($curl, array(
                    CURLOPT_URL => 'https://api.paggy.com.br/v1/email?account='.$req->getParam('account').'&subject=Nova%20senha&body='.urlencode($body).'&to[0][email]='.$user['email'].'&to[0][name]='.urlencode($user['name']).'&from[email]='.$company['email'].'&from[name]='.urlencode($company['name']),
                    CURLOPT_RETURNTRANSFER => true,
                    CURLOPT_ENCODING => '',
                    CURLOPT_MAXREDIRS => 10,
                    CURLOPT_TIMEOUT => 0,
                    CURLOPT_FOLLOWLOCATION => true,
                    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                    CURLOPT_CUSTOMREQUEST => 'POST',
                ));
                $response = curl_exec($curl);
                curl_close($curl);
            }
            $res->getBody()->write(json_encode(array('sts'=>200,'message'=>'Registro modificado','id'=>$args['id'])));
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
                $stmt = $pdo->prepare("UPDATE `users` SET `status`=:status WHERE `id`=:id AND `account`=:account");
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

function deleteUsers($req,$res,$args){
    if(validateToken($req->getParam('user'),$req->getParam('token')) && $req->getParam('account') && $args['id']){
        try {
            $banco = db();
            $pdo = new PDO('mysql:host='.$banco['host'].';dbname='.$banco['name'].'',$banco['user'],$banco['password']);
            $pdo->exec("SET time_zone='+03:00'");
            $ids = explode(',',$args['id']);
            foreach($ids as $value){
                $stmt = $pdo->prepare("DELETE FROM `users` WHERE `id`=:id AND `account`=:account");
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