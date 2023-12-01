<?php

function login($req,$res,$args){
    if($req->getParam('email') && $req->getParam('password')){
        try {
            $banco = db();
            $pdo = new PDO('mysql:host='.$banco['host'].';dbname='.$banco['name'].'',$banco['user'],$banco['password']);
            $stmt = $pdo->prepare("SELECT a.* FROM `users` a WHERE a.`email`=:email AND a.`password`=:password");
            $stmt->bindValue(':email',$req->getParam('email'));
            $stmt->bindValue(':password',md5($req->getParam('password')));
            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
            if($stmt->rowCount()){
                if($results[0]['status'] == 'on'){
                    try {
                        $token = uuid();
                        $stmt = $pdo->prepare("UPDATE `users` SET `tokens`=JSON_ARRAY_APPEND(`tokens`,'$',CAST(:obj AS JSON)) WHERE `id`=:user");
                        $stmt->bindValue(':obj',json_encode(array('token'=>$token,'expires_in'=>date('Y-m-d H:i:s',strtotime(date('Y-m-d H:i:s').'+7 day')))));
                        $stmt->bindValue(':user',$results[0]['id']);
                        $stmt->execute();
                        $stmt = $pdo->prepare("SELECT DATE_FORMAT(a.`date`,'%d/%m/%Y') AS date FROM `accounts` a WHERE `id`=:account");
                        $stmt->bindValue(':account',$results[0]['account']);
                        $stmt->execute();
                        $date = $stmt->fetchAll(PDO::FETCH_ASSOC);
                        $res->getBody()->write(json_encode(array('sts'=>200,'account'=>$results[0]['account'],'user'=>$results[0]['id'],'name'=>$results[0]['name'],'token'=>$token,'date'=>$date[0]['date'],'main'=>$results[0]['main'])));
                    }catch(Exception $e){
                        $res->getBody()->write(json_encode(array('message'=>'Operação inválida','sts'=>400)));
                    }
                }else{
                    $res->getBody()->write(json_encode(array('sts'=>403,'message'=>'Usuário bloqueado ou inativo')));
                }
            }else{
                $res->getBody()->write(json_encode(array('sts'=>406,'message'=>'Email e/ou senha inválido')));
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

function logged($req,$res,$args){
    if($req->getParam('token') && $req->getParam('user')){
        try {
            $banco = db();
            $pdo = new PDO('mysql:host='.$banco['host'].';dbname='.$banco['name'].'',$banco['user'],$banco['password']);
            $stmt = $pdo->prepare("SELECT a.* FROM `users` a WHERE JSON_UNQUOTE(JSON_EXTRACT(a.`tokens`,REPLACE(JSON_UNQUOTE(JSON_SEARCH(a.`tokens`,'one',:token,'','$[*].token')),'.token','.expires_in')))>:date AND a.`id`=:user");
            $stmt->bindValue(':token',$req->getParam('token'));
            $stmt->bindValue(':user',$req->getParam('user'));
            $stmt->bindValue(':date',date('Y-m-d H:i:s'));
            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
            if($stmt->rowCount()){
                if($results[0]['status'] == 'on'){
                    try {
                        $stmt = $pdo->prepare("UPDATE `users` SET `tokens`=JSON_SET(`tokens`,REPLACE(JSON_UNQUOTE(JSON_SEARCH(`tokens`,'one',:token,'','$[*].token')),'.token','.expires_in'),:expires_in) WHERE `id`=:user");
                        $stmt->bindValue(':token',$req->getParam('token'));
                        $stmt->bindValue(':user',$req->getParam('user'));
                        $stmt->bindValue(':expires_in',date('Y-m-d H:i:s',strtotime(date('Y-m-d H:i:s').'+7 day')));
                        $stmt->execute();
                        $stmt = $pdo->prepare("SELECT DATE_FORMAT(a.`date`,'%d/%m/%Y') AS date FROM `accounts` a WHERE `id`=:account");
                        $stmt->bindValue(':account',$results[0]['account']);
                        $stmt->execute();
                        $date = $stmt->fetchAll(PDO::FETCH_ASSOC);
                        $res->getBody()->write(json_encode(array('sts'=>200,'account'=>$results[0]['account'],'user'=>$results[0]['id'],'name'=>$results[0]['name'],'token'=>$req->getParam('token'),'date'=>$date[0]['date'],'main'=>$results[0]['main'])));
                    }catch(Exception $e){
                        $res->getBody()->write(json_encode(array('message'=>'Operação inválida','sts'=>400)));
                    }
                }else{
                    $res->getBody()->write(json_encode(array('sts'=>403,'message'=>'Usuário bloqueado ou inativo')));
                }
            }else{
                $res->getBody()->write(json_encode(array('sts'=>406,'message'=>'Token inválido')));
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

function logout($req,$res,$args){
    if($req->getParam('token') && $req->getParam('user')){
        try {
            $banco = db();
            $pdo = new PDO('mysql:host='.$banco['host'].';dbname='.$banco['name'].'',$banco['user'],$banco['password']);
            $stmt = $pdo->prepare("UPDATE `users` SET `tokens`=JSON_REMOVE(`tokens`,REPLACE(JSON_UNQUOTE(JSON_SEARCH(`tokens`,'one',:token,'','$[*].token')),'.token','')) WHERE `id`=:user");
            $stmt->bindValue(':user',$req->getParam('user'));
            $stmt->bindValue(':token',$req->getParam('token'));
            $stmt->execute();
            $res->getBody()->write(json_encode(array('sts'=>200,'message'=>'Registro excluído')));
        }catch(Exception $e){
            $res->getBody()->write(json_encode(array('message'=>'Atributo inválido ou ausente','sts'=>400)));
        }
    }else{
        $res->getBody()->write(json_encode(array('message'=>'Atributo inválido ou ausente','sts'=>400)));
    }
    $pdo = null;
    return $res->withHeader('Content-type','application/json; charset=utf-8');
}

function token($req,$res,$args){
    if(validateToken($req->getParam('user'),$req->getParam('token'))){
       $res->getBody()->write(json_encode(array('sts'=>200,'message'=>'Token válido')));
    }else{
       $res->getBody()->write(json_encode(array('sts'=>400,'message'=>'Token inválido')));
    }
    return $res->withHeader('Content-type','application/json; charset=utf-8');
}
