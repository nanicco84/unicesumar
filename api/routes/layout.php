<?php

function getLayoutId($req,$res,$args){
    if(validateToken($req->getParam('user'),$req->getParam('token')) && $req->getParam('account')){
        try {
            $banco = db();
            $pdo = new PDO('mysql:host='.$banco['host'].';dbname='.$banco['name'].'',$banco['user'],$banco['password']);
            $pdo->exec("SET time_zone='+03:00'");
            $stmt = $pdo->prepare("SELECT
            `layout`->>'$.email.font' AS `email_font`,
            `layout`->>'$.email.main.size' AS `email_main_size`,
            `layout`->>'$.email.main.color' AS `email_main_color`,
            `layout`->>'$.email.main.title' AS `email_main_title`,
            `layout`->>'$.email.footer.background' AS `email_footer_background`,
            `layout`->>'$.email.footer.size' AS `email_footer_size`,
            `layout`->>'$.email.footer.color' AS `email_footer_color`,
            `layout`->>'$.email.header.size' AS `email_header_size`,
            `layout`->>'$.email.header.color' AS `email_header_color`,
            `layout`->>'$.email.header.background' AS `email_header_background`
            FROM `accounts` WHERE `id`=:account");
            $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC)[0];
            //settings
            $stmt = $pdo->prepare("SELECT `layout` FROM `settings`");
            $stmt->execute();
            $settings = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $settings = json_decode($settings[0]['layout']);
            foreach($settings as $key => $val){
                ${$key} = $val;
            }
            //return
            $res->getBody()->write(json_encode(array('sts'=>200,'results'=>$results,
            'email_font'=>$font,
            'email_main_size'=>$size,
            'email_main_color'=>$color,
            'email_main_title'=>$color,
            'email_footer_background'=>$background,
            'email_footer_size'=>$size,
            'email_footer_color'=>$color,
            'email_header_size'=>$size,
            'email_header_color'=>$color,
            'email_header_background'=>$background
        )));
        }catch(Exception $e){
            $res->getBody()->write(json_encode(array('message'=>'Operação inválida','sts'=>400)));
        }
    }else{
        $res->getBody()->write(json_encode(array('message'=>'Atributo inválido ou ausente','sts'=>400)));
    }
    $pdo = null;
    return $res->withHeader('Content-type','application/json; charset=utf-8');
}

function putLayout($req,$res,$args){
    if(validateToken($req->getParam('user'),$req->getParam('token'))
    && $req->getParam('account')
    && $req->getParam('email_font')
    && $req->getParam('email_main_size')
    && $req->getParam('email_main_color')
    && $req->getParam('email_main_title')
    && $req->getParam('email_footer_background')
    && $req->getParam('email_footer_size')
    && $req->getParam('email_footer_color')
    && $req->getParam('email_header_size')
    && $req->getParam('email_header_color')
    && $req->getParam('email_header_background')
    ){
        try {
            $banco = db();
            $pdo = new PDO('mysql:host='.$banco['host'].';dbname='.$banco['name'].'',$banco['user'],$banco['password']);
            $pdo->exec("SET time_zone='+03:00'");
            $stmt = $pdo->prepare("UPDATE accounts SET layout=CAST(:obj AS JSON) WHERE id=:account"); 
            $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
            $stmt->bindValue(':obj','{
                "email": {
                    "font": "'.$req->getParam('email_font').'",
                    "main": {
                        "size": "'.$req->getParam('email_main_size').'",
                        "color": "'.$req->getParam('email_main_color').'",
                        "title": "'.$req->getParam('email_main_title').'"
                    },
                    "header": {
                        "size": "'.$req->getParam('email_header_size').'",
                        "color": "'.$req->getParam('email_header_color').'",
                        "background": "'.$req->getParam('email_header_background').'"
                    },
                    "footer": {
                        "size": "'.$req->getParam('email_footer_size').'",
                        "color": "'.$req->getParam('email_footer_color').'",
                        "background": "'.$req->getParam('email_footer_background').'"
                    }
                }
            }',PDO::PARAM_STR);
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