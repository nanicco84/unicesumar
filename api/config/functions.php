<?php

function id($length=10){
    $salt = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    $len = strlen($salt);
    $pass = '';
    mt_srand(10000000*(double)microtime());
    for($i=0;$i<$length;$i++){
        $pass .= $salt[mt_rand(0,$len - 1)];
    }
    return $pass;
}

function uuid($data = null) {
    $data = $data ?? random_bytes(16);
    assert(strlen($data) == 16);
    $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
    $data[8] = chr(ord($data[8]) & 0x3f | 0x80);
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}

function validateToken($user,$token){
    if($user && strlen($user) == 10 && $token && strlen($token) == 36){
        try{
            $banco = db();
            $pdo = new PDO('mysql:host='.$banco['host'].';dbname='.$banco['name'].'',$banco['user'],$banco['password']);
            $pdo->exec("SET time_zone='+03:00'");
            $stmt = $pdo->prepare("SELECT * FROM `users` WHERE JSON_UNQUOTE(JSON_EXTRACT(`tokens`,REPLACE(JSON_UNQUOTE(JSON_SEARCH(`tokens`,'one',:token,'','$[*].token')),'.token','.expires_in'))) > :date AND `id`=:user");
            $stmt->bindValue(':token',$token,PDO::PARAM_STR);
            $stmt->bindValue(':user',$user,PDO::PARAM_STR);
            $stmt->bindValue(':date',date('Y-m-d H:i:s'),PDO::PARAM_STR);
            $stmt->execute();
            $pdo = null;
            if($stmt->rowCount() == 0){
                return false;
            }else{
                return true;
            }
        }catch(Exception $e){
            return false;
        }
    }else{
        return false;
    }
}

function generatePassword(){
    $ma = "ABCDEFGHIJKLMNOPQRSTUVYXWZ";
    $mi = "abcdefghijklmnopqrstuvyxwz";
    $nu = "0123456789";
    $si = "!@#$%¨&*()_+=";
    $senha = '';
    $senha .= str_shuffle($ma);
    $senha .= str_shuffle($mi);
    $senha .= str_shuffle($nu);
    $senha .= str_shuffle($si);
    return substr(str_shuffle($senha),0,10);
}

function createInvoice($data){
    if($data['send']=='on'){
        $notifications = '[
            {"date":"'.date('Y-m-d',strtotime($data['due_date'].'-10 day')).'","days":"-10","send":"off","method":"email"},
            {"date":"'.date('Y-m-d',strtotime($data['due_date'].'-3 day')).'","days":"-3","send":"off","method":"email"},
            {"date":"'.date('Y-m-d',strtotime($data['due_date'].'-1 day')).'","days":"-1","send":"off","method":"email"},
            {"date":"'.$data['due_date'].'","days":"0","send":"off","method":"email"},
            {"date":"'.date('Y-m-d',strtotime($data['due_date'].'+2 day')).'","days":"2","send":"off","method":"email"},
            {"date":"'.date('Y-m-d',strtotime($data['due_date'].'+7 day')).'","days":"7","send":"off","method":"email"},
            {"date":"'.date('Y-m-d',strtotime($data['due_date'].'+15 day')).'","days":"15","send":"off","method":"email"}
            {"date":"'.date('Y-m-d',strtotime($data['due_date'].'+20 day')).'","days":"20","send":"off","method":"email"}
            {"date":"'.date('Y-m-d',strtotime($data['due_date'].'+25 day')).'","days":"25","send":"off","method":"email"}
            {"date":"'.date('Y-m-d',strtotime($data['due_date'].'+30 day')).'","days":"30","send":"off","method":"email"}
        ]';
    }else{
        $notifications = '[]';
    }
    $banco = db();
    $pdo = new PDO('mysql:host='.$banco['host'].';dbname='.$banco['name'].'',$banco['user'],$banco['password']);
    $pdo->exec("SET time_zone='+03:00'");
    $stmt = $pdo->prepare("INSERT INTO invoices (id,account,date,customer,subscription,due_date,payment,total,status,transaction,notifications,details,type,payday,services,note) VALUES (:id,:account,:date,:customer,:subscription,:due_date,:payment,:total,:status,:transaction,:notifications,:details,:type,:payday,:services,:note)");
    $stmt->bindValue(':id',$data['id'],PDO::PARAM_STR);
    $stmt->bindValue(':account',$data['account'],PDO::PARAM_STR);
    $stmt->bindValue(':date',date('Y-m-d H:i:s'),PDO::PARAM_STR);
    $stmt->bindValue(':customer',$data['customer'],PDO::PARAM_STR);
    $stmt->bindValue(':subscription',$data['subscription'],PDO::PARAM_STR);
    $stmt->bindValue(':due_date',$data['due_date'],PDO::PARAM_STR);
    $stmt->bindValue(':payment',$data['payment'],PDO::PARAM_STR);
    $stmt->bindValue(':total',$data['total'],PDO::PARAM_STR);
    $stmt->bindValue(':services',$data['services'],PDO::PARAM_STR);
    $stmt->bindValue(':status',$data['status'],PDO::PARAM_STR);
    $stmt->bindValue(':transaction',$data['transaction'],PDO::PARAM_STR);
    $stmt->bindValue(':notifications',$notifications,PDO::PARAM_STR);
    $stmt->bindValue(':details',$data['details'],PDO::PARAM_STR);
    $stmt->bindValue(':type',$data['type'],PDO::PARAM_STR);
    $stmt->bindValue(':payday',$data['payday'],PDO::PARAM_STR);
    $stmt->bindValue(':note','',PDO::PARAM_STR);
    $stmt->execute();
    if($data['subscription']!=''){
        $stmt = $pdo->prepare("UPDATE subscriptions SET next_due_date=:date WHERE id=:subscription AND account=:account");
        $stmt->bindValue(':date',date('Y-m-d',strtotime('+'.$data['period'].' month',strtotime($data['due_date']))),PDO::PARAM_STR);
        $stmt->bindValue(':subscription',$data['subscription'],PDO::PARAM_STR);
        $stmt->bindValue(':account',$data['account'],PDO::PARAM_STR);
        $stmt->execute();
    }
    $pdo = null;
}

function createError($error,$account){
    $banco = db();
    $pdo = new PDO('mysql:host='.$banco['host'].';dbname='.$banco['name'].'',$banco['user'],$banco['password']);
    $pdo->exec("SET time_zone='+03:00'");
    $stmt = $pdo->prepare("INSERT INTO errors (id,account,date,error) VALUES (:id,:account,:date,:error)");
    $stmt->bindValue(':id',id(),PDO::PARAM_STR);
    $stmt->bindValue(':account',$account,PDO::PARAM_STR);
    $stmt->bindValue(':date',date('Y-m-d H:i:s'),PDO::PARAM_STR);
    $stmt->bindValue(':error',$error,PDO::PARAM_STR);
    $pdo = null;
}

function pdfUpload($id,$pdf,$user='',$token='09def7ce-96e8-402d-8099-51b37d0a1f30'){
    $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_URL => 'https://pdf.paggy.com.br/api?token='.$token.'&user='.$user.'&id='.$id.'&pdf='.$pdf,
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

function createPayment($account,$id,$customer,$payment,$items,$period=null){
    if($payment['name']=='efi'){
        $auth = efiAuth($payment['application']->client_id,$payment['application']->client_secret);
        $newItems = '';
        foreach($items as $key=>$item){
            if($key!=0){
                $newItems .= ',';
            }
            $newItems .= '{
                "name": "'.$item->name.($period?' ('.$period.' '.($period==1?'mês':'meses').')':'').'",
                "value": '.preg_replace('/\D/','',number_format(($period?$item->price*$period:$item->price),2,'.','')).',
                "amount": '.$item->quantity.'
            }';
        }
        if($payment['service']=='billet'){
            $charge = efiBillet($auth->access_token,$id,array('name'=>ltrim(rtrim($customer['name'])),'document'=>preg_replace('/\D/','',$customer['document'])),$newItems);
            if($charge->code==200){
                pdfUpload($id,$charge->data->pdf->charge);
                return $charge;
            }else{
                createError('[Efí] '.$charge->code.': '.($charge->error_description->message?($charge->error_description->property?$charge->error_description->property.' - ':'').$charge->error_description->message:$charge->error_description),$account);
                return false;
            }
        }elseif($payment['service']=='pix'){
            $charge = efiBillet($auth->access_token,$id,array('name'=>ltrim(rtrim($customer['name'])),'document'=>preg_replace('/\D/','',$customer['document'])),$newItems);
            if($charge->code==200){
                pdfUpload($id,$charge->data->pdf->charge);
                return $charge;
            }else{
                createError('[Efí] '.$charge->code.': '.($charge->error_description->message?($charge->error_description->property?$charge->error_description->property.' - ':'').$charge->error_description->message:$charge->error_description),$account);
                return false;
            }
        }
    }
}
