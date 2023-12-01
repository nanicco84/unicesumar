<?php

function callbackEfi($req,$res,$args){
    try {
        $banco = db();
        $pdo = new PDO('mysql:host='.$banco['host'].';dbname='.$banco['name'].'',$banco['user'],$banco['password']);
        $pdo->exec("SET time_zone='+03:00'");
        $stmt = $pdo->prepare("SELECT a.status,
        (SELECT JSON_EXTRACT(b.apps,REPLACE(JSON_UNQUOTE(JSON_SEARCH(b.apps,'one',a.payment->>'$.app','','$[*].id')),'id','application')) FROM accounts b WHERE b.id=a.account) AS payment_application
        FROM invoices a WHERE a.id=:id");
        $stmt->bindValue(':id',$args['id'],PDO::PARAM_STR);
        $stmt->execute();
        $invoice = $stmt->fetchAll(PDO::FETCH_ASSOC)[0];
        $invoice['payment_application'] = json_decode($invoice['payment_application']);
        $auth = efiAuth($invoice['payment_application']->client_id,$invoice['payment_application']->client_secret);
        $callback = efiCallback($auth->access_token,$req->getParam('notification'));
        if($callback->code==200){
            if($callback->data[count($callback->data)-1]->status->current=='new'||$callback->data[count($callback->data)-1]->status->current=='waiting'||$callback->data[count($callback->data)-1]->status->current=='identified'||$callback->data[count($callback->data)-1]->status->current=='approved'||$callback->data[count($callback->data)-1]->status->current=='link'){
                $status = 'waiting';
            }elseif($callback->data[count($callback->data)-1]->status->current=='paid'||$callback->data[count($callback->data)-1]->status->current=='settled'){
                $status = 'paid';
            }elseif($callback->data[count($callback->data)-1]->status->current=='unpaid'||$callback->data[count($callback->data)-1]->status->current=='contested'){
                $status = 'late';
            }elseif($callback->data[count($callback->data)-1]->status->current=='refunded'||$callback->data[count($callback->data)-1]->status->current=='canceled'||$callback->data[count($callback->data)-1]->status->current=='expired'){
                $status = 'canceled';
            }
            if($status!=$invoice['status']){
                $stmt = $pdo->prepare("UPDATE invoices SET status=:status WHERE id=:id");
                $stmt->bindValue(':id',$args['id'],PDO::PARAM_STR);
                $stmt->bindValue(':status',$status,PDO::PARAM_STR);
                $stmt->execute();
            }
        }
        //results
        $res->getBody()->write(json_encode(array('sts'=>200)));
    }catch(Exception $e){
        $res->getBody()->write(json_encode(array('message'=>'Operação inválida','sts'=>400)));
    }
    $pdo = null;
    return $res->withHeader('Content-type','application/json; charset=utf-8');
}