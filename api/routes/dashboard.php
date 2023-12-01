<?php

function getDashboard($req,$res,$args){
    if(validateToken($req->getParam('user'),$req->getParam('token')) && $req->getParam('account')){
        try {
            $banco = db();
            $pdo = new PDO('mysql:host='.$banco['host'].';dbname='.$banco['name'].'',$banco['user'],$banco['password']);
            //total
            $stmt = $pdo->prepare("
            SELECT
            (SELECT COUNT(id) FROM customers WHERE account=:account) AS Customers,
            (SELECT COUNT(id) FROM `groups` WHERE account=:account) AS `Groups`,
            (SELECT COUNT(id) FROM services WHERE account=:account) AS Services,
            (SELECT COUNT(id) FROM subscriptions WHERE account=:account) AS Subscriptions,
            (SELECT COUNT(id) FROM invoices WHERE account=:account) AS Invoices
            ");
            $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
            $stmt->execute();
            $total = $stmt->fetchAll(PDO::FETCH_ASSOC);
            //dashboard
            $stmt = $pdo->prepare("SELECT
            (SELECT COUNT(a.id) FROM customers a WHERE a.account=:account AND a.status='on') AS customers,
            (SELECT COUNT(a.id) FROM subscriptions a WHERE a.account=:account AND a.status='on') AS subscriptions,
            (SELECT COUNT(a.id) FROM `groups` a WHERE a.account=:account AND a.status='on') AS `groups`,
            (SELECT COUNT(a.id) FROM services a WHERE a.account=:account AND a.status='on') AS services,
            (SELECT COUNT(a.id) FROM invoices a WHERE a.account=:account AND a.status='paid' AND a.payday=NOW()) AS paid,
            (SELECT SUM(a.total) FROM invoices a WHERE a.account=:account AND a.status='paid' AND a.payday=NOW()) AS paid_value,
            (SELECT COUNT(a.id) FROM invoices a WHERE a.account=:account AND a.status='paid' AND a.payday>=DATE(NOW() - INTERVAL 7 DAY)) AS paid7,
            (SELECT SUM(a.total) FROM invoices a WHERE a.account=:account AND a.status='paid' AND a.payday>=DATE(NOW() - INTERVAL 7 DAY)) AS paid7_value,
            (SELECT COUNT(a.id) FROM invoices a WHERE a.account=:account AND a.status='paid' AND a.payday>=DATE(NOW() - INTERVAL 30 DAY)) AS paid30,
            (SELECT SUM(a.total) FROM invoices a WHERE a.account=:account AND a.status='paid' AND a.payday>=DATE(NOW() - INTERVAL 30 DAY)) AS paid30_value,
            (SELECT COUNT(a.id) FROM invoices a WHERE a.account=:account AND a.status='waiting' AND a.due_date=NOW()) AS waiting,
            (SELECT SUM(a.total) FROM invoices a WHERE a.account=:account AND a.status='waiting' AND a.due_date=NOW()) AS waiting_value,
            (SELECT COUNT(a.id) FROM invoices a WHERE a.account=:account AND a.status='waiting' AND a.due_date>=DATE(NOW() - INTERVAL 7 DAY)) AS waiting7,
            (SELECT SUM(a.total) FROM invoices a WHERE a.account=:account AND a.status='waiting' AND a.due_date>=DATE(NOW() - INTERVAL 7 DAY)) AS waiting7_value,
            (SELECT COUNT(a.id) FROM invoices a WHERE a.account=:account AND a.status='waiting' AND a.due_date>=DATE(NOW() - INTERVAL 30 DAY)) AS waiting30,
            (SELECT SUM(a.total) FROM invoices a WHERE a.account=:account AND a.status='waiting' AND a.due_date>=DATE(NOW() - INTERVAL 30 DAY)) AS waiting30_value,
            (SELECT COUNT(a.id) FROM invoices a WHERE a.account=:account AND a.status='late' AND a.due_date=NOW()) AS late,
            (SELECT SUM(a.total) FROM invoices a WHERE a.account=:account AND a.status='late' AND a.due_date=NOW()) AS late_value,
            (SELECT COUNT(a.id) FROM invoices a WHERE a.account=:account AND a.status='late' AND a.due_date>=DATE(NOW() - INTERVAL 7 DAY)) AS late7,
            (SELECT SUM(a.total) FROM invoices a WHERE a.account=:account AND a.status='late' AND a.due_date>=DATE(NOW() - INTERVAL 7 DAY)) AS late7_value,
            (SELECT COUNT(a.id) FROM invoices a WHERE a.account=:account AND a.status='late' AND a.due_date>=DATE(NOW() - INTERVAL 30 DAY)) AS late30,
            (SELECT SUM(a.total) FROM invoices a WHERE a.account=:account AND a.status='late' AND a.due_date>=DATE(NOW() - INTERVAL 30 DAY)) AS late30_value
            ");
            $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC)[0];
            $dashboard['customers'] = $results['customers']==null ? 0 : $results['customers'];
            $dashboard['subscriptions'] = $results['subscriptions']==null ? 0 : $results['subscriptions'];
            $dashboard['groups'] = $results['groups']==null ? 0 : $results['groups'];
            $dashboard['services'] = $results['services']==null ? 0 : $results['services'];
            $dashboard['services'] = $results['services']==null ? 0 : $results['services'];
            $dashboard['paid'] = $results['paid']==null ? 0 : $results['paid'];
            $dashboard['paid7'] = $results['paid7']==null ? 0 : $results['paid7'];
            $dashboard['paid30'] = $results['paid30']==null ? 0 : $results['paid30'];
            $dashboard['paid_value'] = $results['paid_value']==null ? 0 : $results['paid_value'];
            $dashboard['paid7_value'] = $results['paid7_value']==null ? 0 : $results['paid7_value'];
            $dashboard['paid30_value'] = $results['paid30_value']==null ? 0 : $results['paid30_value'];
            $dashboard['waiting'] = $results['waiting']==null ? 0 : $results['waiting'];
            $dashboard['waiting7'] = $results['waiting7']==null ? 0 : $results['waiting7'];
            $dashboard['waiting30'] = $results['waiting30']==null ? 0 : $results['waiting30'];
            $dashboard['waiting_value'] = $results['waiting_value']==null ? 0 : $results['waiting_value'];
            $dashboard['waiting7_value'] = $results['waiting7_value']==null ? 0 : $results['waiting7_value'];
            $dashboard['waiting30_value'] = $results['waiting30_value']==null ? 0 : $results['waiting30_value'];
            $dashboard['late'] = $results['late']==null ? 0 : $results['late'];
            $dashboard['late7'] = $results['late7']==null ? 0 : $results['late7'];
            $dashboard['late30'] = $results['late30']==null ? 0 : $results['late30'];
            $dashboard['late_value'] = $results['late_value']==null ? 0 : $results['late_value'];
            $dashboard['late7_value'] = $results['late7_value']==null ? 0 : $results['late7_value'];
            $dashboard['late30_value'] = $results['late30_value']==null ? 0 : $results['late30_value'];
            //paids
            $stmt = $pdo->prepare("SELECT a.total,a.customer->>'$.name' AS name,DATE_FORMAT(a.payday,'%d/%m/%Y %Hh%i') AS date,a.id FROM invoices a WHERE a.account=:account AND a.status='paid' ORDER BY a.payday DESC LIMIT 10");
            $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
            $stmt->execute();
            $dashboard['paids'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
            //lates
            $stmt = $pdo->prepare("SELECT a.total,a.customer->>'$.name' AS name,DATE_FORMAT(DATE_ADD(a.due_date,INTERVAL 1 DAY),'%d/%m/%Y %Hh%i') AS date,a.id,(SELECT b.status FROM customers b WHERE b.id=a.customer->>'$.id') AS sts FROM invoices a WHERE a.account=:account AND a.status='late' HAVING sts='on' ORDER BY a.due_date DESC LIMIT 10");
            $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
            $stmt->execute();
            $dashboard['lates'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
            //return
            $res->getBody()->write(json_encode(array('sts'=>200,'total'=>$total[0],'dashboard'=>$dashboard)));
        }catch(Exception $e){
            $res->getBody()->write(json_encode(array('message'=>'Operação inválida','sts'=>400)));
        }
    }else{
        $res->getBody()->write(json_encode(array('message'=>'Atributo inválido ou ausente','sts'=>400)));
    }
    $pdo = null;
    return $res->withHeader('Content-type','application/json; charset=utf-8');
}