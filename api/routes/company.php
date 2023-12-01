<?php

function getCompanyId($req,$res,$args){
    if(validateToken($req->getParam('user'),$req->getParam('token')) && $req->getParam('account')){
        try {
            $banco = db();
            $pdo = new PDO('mysql:host='.$banco['host'].';dbname='.$banco['name'].'',$banco['user'],$banco['password']);
            $pdo->exec("SET time_zone='+03:00'");
            $stmt = $pdo->prepare("SELECT
            `name`,
            `document`,
            `email`,
            `site`,
            `address`->>'$.address' AS `address`,
            `address`->>'$.number' AS `number`,
            `address`->>'$.district' AS `district`,
            `address`->>'$.city' AS `city`,
            `address`->>'$.state' AS `state`,
            `address`->>'$.zip_code' AS `zip_code`,
            `address`->>'$.complement' AS `complement`,
            `logo`,
            `phone`,
            `whatsapp`,
            `company`
            FROM `accounts` WHERE `id`=:account");
            $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC)[0];
            //return
            $res->getBody()->write(json_encode(array('sts'=>200,'results'=>$results)));
        }catch(Exception $e){
            $res->getBody()->write(json_encode(array('message'=>'Operação inválida','sts'=>400)));
        }
    }else{
        $res->getBody()->write(json_encode(array('message'=>'Atributo inválido ou ausente','sts'=>400)));
    }
    $pdo = null;
    return $res->withHeader('Content-type','application/json; charset=utf-8');
}

function putCompany($req,$res,$args){
    if(validateToken($req->getParam('user'),$req->getParam('token')) && $req->getParam('account') && $req->getParam('name') && $req->getParam('email') && $req->getParam('document') && $req->getParam('phone')){
        try {
            $banco = db();
            $pdo = new PDO('mysql:host='.$banco['host'].';dbname='.$banco['name'].'',$banco['user'],$banco['password']);
            $pdo->exec("SET time_zone='+03:00'");
            $stmt = $pdo->prepare("UPDATE accounts SET
            name=:name,
            email=:email,
            document=:document,
            phone=:phone,
            whatsapp=:whatsapp,
            company=:company,
            site=:site,
            address=JSON_SET(address,'$.address',:address),
            address=JSON_SET(address,'$.number',:number),
            address=JSON_SET(address,'$.district',:district),
            address=JSON_SET(address,'$.city',:city),
            address=JSON_SET(address,'$.state',:state),
            address=JSON_SET(address,'$.zip_code',:zip_code),
            address=JSON_SET(address,'$.complement',:complement)
            WHERE id=:account"); 
            $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
            $stmt->bindValue(':name',$req->getParam('name'),PDO::PARAM_STR);
            $stmt->bindValue(':email',$req->getParam('email'),PDO::PARAM_STR);
            $stmt->bindValue(':phone',$req->getParam('phone'),PDO::PARAM_STR);
            $stmt->bindValue(':whatsapp',$req->getParam('whatsapp'),PDO::PARAM_STR);
            $stmt->bindValue(':site',$req->getParam('site'),PDO::PARAM_STR);
            $stmt->bindValue(':document',$req->getParam('document'),PDO::PARAM_STR);
            $stmt->bindValue(':address',$req->getParam('address'),PDO::PARAM_STR);
            $stmt->bindValue(':number',$req->getParam('number'),PDO::PARAM_STR);
            $stmt->bindValue(':district',$req->getParam('district'),PDO::PARAM_STR);
            $stmt->bindValue(':city',$req->getParam('city'),PDO::PARAM_STR);
            $stmt->bindValue(':state',$req->getParam('state'),PDO::PARAM_STR);
            $stmt->bindValue(':zip_code',$req->getParam('zip_code'),PDO::PARAM_STR);
            $stmt->bindValue(':complement',$req->getParam('complement'),PDO::PARAM_STR);
            $stmt->bindValue(':company',$req->getParam('company'),PDO::PARAM_STR);
            $stmt->execute();
            $res->getBody()->write(json_encode(array('sts'=>200,'message'=>'Registro modificado')));
        }catch(Exception $e){
            $res->getBody()->write(json_encode(array('message'=>'Operação inválida','sts'=>400)));
        }
    }elseif(validateToken($req->getParam('user'),$req->getParam('token')) && $req->getParam('account') && $req->getParam('logo')){
        try {
            $banco = db();
            $pdo = new PDO('mysql:host='.$banco['host'].';dbname='.$banco['name'].'',$banco['user'],$banco['password']);
            $pdo->exec("SET time_zone='+03:00'");
            $stmt = $pdo->prepare("UPDATE accounts SET
            logo=:logo
            WHERE id=:account"); 
            $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
            $stmt->bindValue(':logo',str_replace('null','',$req->getParam('logo')),PDO::PARAM_STR);
            $stmt->execute();
            $res->getBody()->write(json_encode(array('sts'=>200,'message'=>'Registro modificado')));
        }catch(Exception $e){
            $res->getBody()->write(json_encode(array('message'=>'Operação inválida','sts'=>400)));
        }
    }else{
        $res->getBody()->write(json_encode(array('message'=>'Atributo inválido ou ausente','sts'=>400)));
    }
    $pdo = null;
    return $res->withHeader('Content-type','application/json; charset=utf-8');
}