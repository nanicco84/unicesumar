<?php

function getSearch($req,$res,$args){
    if(validateToken($req->getParam('user'),$req->getParam('token')) && $req->getParam('account')){
        try {
            $banco = db();
            $pdo = new PDO('mysql:host='.$banco['host'].';dbname='.$banco['name'].'',$banco['user'],$banco['password']);
            $pdo->exec("SET time_zone='+03:00'");
            //search
            $search = '';
            if($req->getParam('search')){$search = $req->getParam('search');}
            //date
            $date = '';
            if($req->getParam('date')){
                $dates = explode(' - ',$req->getParam('date'));
                $date_start = explode('/',$dates[0]);
                $date_end = explode('/',$dates[1]);
                $date = "AND xx.`date` BETWEEN '".$date_start[2]."-".$date_start[1]."-".$date_start[0]." 00:00:00' AND '".$date_end[2]."-".$date_end[1]."-".$date_end[0]." 23:59:59'";
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
            $stmt = $pdo->prepare("
            SELECT cu.`id`,cu.date AS datetime,DATE_FORMAT(cu.date,'%d/%m/%Y') AS date,DATE_FORMAT(cu.date,'%H:%i:%s') AS hour,cu.`name`,'[\'Customers\']' AS `table`,'Clientes' AS `type` FROM `customers` cu WHERE cu.`account`=:account ".str_replace('xx','cu',$date)." HAVING LOWER(cu.`name`) LIKE LOWER('%".$search."%')
            UNION
            SELECT gr.`id`,gr.date AS datetime,DATE_FORMAT(gr.date,'%d/%m/%Y') AS date,DATE_FORMAT(gr.date,'%H:%i:%s') AS hour,gr.`name`,'[\'Groups\']' AS `table`,'Grupos' AS `type` FROM `groups` gr WHERE gr.`account`=:account ".str_replace('xx','gr',$date)." HAVING LOWER(gr.`name`) LIKE LOWER('%".$search."%')
            UNION
            SELECT se.`id`,se.date AS datetime,DATE_FORMAT(se.date,'%d/%m/%Y') AS date,DATE_FORMAT(se.date,'%H:%i:%s') AS hour,se.`name`,'[\'Services\']' AS `table`,'Serviços' AS `type` FROM `services` se WHERE se.`account`=:account ".str_replace('xx','se',$date)." HAVING LOWER(se.`name`) LIKE LOWER('%".$search."%')
            UNION
            SELECT su.`id`,su.date AS datetime,DATE_FORMAT(su.date,'%d/%m/%Y') AS date,DATE_FORMAT(su.date,'%H:%i:%s') AS hour,su.`id` AS name,'[\'Subscriptions\']' AS `table`,'Assinaturas' AS `type` FROM `subscriptions` su WHERE su.`account`=:account ".str_replace('xx','su',$date)." HAVING LOWER(su.`id`) LIKE LOWER('%".$search."%')
            UNION
            SELECT iv.`id`,iv.date AS datetime,DATE_FORMAT(iv.date,'%d/%m/%Y') AS date,DATE_FORMAT(iv.date,'%H:%i:%s') AS hour,iv.`id` AS name,'[\'Invoices\']' AS `table`,'Faturas' AS `type` FROM `invoices` iv WHERE iv.`account`=:account ".str_replace('xx','iv',$date)." HAVING LOWER(iv.`id`) LIKE LOWER('%".$search."%')
            UNION
            SELECT us.`id`,us.date AS datetime,DATE_FORMAT(us.date,'%d/%m/%Y') AS date,DATE_FORMAT(us.date,'%H:%i:%s') AS hour,us.`name`,'[\'Users\']' AS `table`,'Usuários' AS `type` FROM `users` us WHERE us.`account`=:account ".str_replace('xx','us',$date)." HAVING LOWER(us.`name`) LIKE LOWER('%".$search."%')
            ORDER BY ".$order." LIMIT ".$page.",".$limit);
            $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
            //subtotal
            $stmt2 = $pdo->prepare("SELECT COUNT(x.id) AS subtotal FROM (
            SELECT cu.`id`,cu.`name` FROM `customers` cu WHERE cu.`account`=:account ".str_replace('xx','cu',$date)." HAVING LOWER(cu.`name`) LIKE LOWER('%".$search."%')
            UNION
            SELECT gr.`id`,gr.`name` FROM `groups` gr WHERE gr.`account`=:account ".str_replace('xx','gr',$date)." HAVING LOWER(gr.`name`) LIKE LOWER('%".$search."%')
            UNION
            SELECT se.`id`,se.`name` FROM `services` se WHERE se.`account`=:account ".str_replace('xx','se',$date)." HAVING LOWER(se.`name`) LIKE LOWER('%".$search."%')
            UNION
            SELECT su.`id`,su.`id` AS name FROM `subscriptions` su WHERE su.`account`=:account ".str_replace('xx','su',$date)." HAVING LOWER(su.`id`) LIKE LOWER('%".$search."%')
            UNION
            SELECT iv.`id`,iv.`id` AS name FROM `invoices` iv WHERE iv.`account`=:account ".str_replace('xx','iv',$date)." HAVING LOWER(iv.`id`) LIKE LOWER('%".$search."%')
            UNION
            SELECT us.`id`,us.`name` FROM `users` us WHERE us.`account`=:account ".str_replace('xx','us',$date)." HAVING LOWER(us.`name`) LIKE LOWER('%".$search."%')
            ) AS x");
            $stmt2->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
            $stmt2->execute();
            $subtotal = $stmt2->fetchAll(PDO::FETCH_ASSOC);
            //total
            $stmt2 = $pdo->prepare("SELECT COUNT(x.id) AS total FROM (
            SELECT cu.`id`,cu.`name` FROM `customers` cu WHERE cu.`account`=:account HAVING LOWER(cu.`name`) LIKE LOWER('%".$search."%')
            UNION
            SELECT gr.`id`,gr.`name` FROM `groups` gr WHERE gr.`account`=:account HAVING LOWER(gr.`name`) LIKE LOWER('%".$search."%')
            UNION
            SELECT se.`id`,se.`name` FROM `services` se WHERE se.`account`=:account HAVING LOWER(se.`name`) LIKE LOWER('%".$search."%')
            UNION
            SELECT su.`id`,su.`id` AS name FROM `subscriptions` su WHERE su.`account`=:account HAVING LOWER(su.`id`) LIKE LOWER('%".$search."%')
            UNION
            SELECT iv.`id`,iv.`id` AS name FROM `invoices` iv WHERE iv.`account`=:account HAVING LOWER(iv.`id`) LIKE LOWER('%".$search."%')
            UNION
            SELECT us.`id`,us.`name` FROM `users` us WHERE us.`account`=:account HAVING LOWER(us.`name`) LIKE LOWER('%".$search."%')
            ) AS x");
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