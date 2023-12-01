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

function unique($length=16){
    $salt = "abcdefghijklmnopqrstuvwxyz0123456789";
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

function removerCaracter($string) {
    $what = array( 'ä','ã','à','á','â','ê','ë','è','é','ï','ì','í','ö','õ','ò','ó','ô','ü','ù','ú','û','À','Á','É','Í','Ó','Ú','ñ','Ñ','ç','Ç',' ','-','(',')',',',';',':','|','!','"','#','$','%','&','/','=','?','~','^','>','<','ª','º','+' );
    $by   = array( 'a','a','a','a','a','e','e','e','e','i','i','i','o','o','o','o','o','u','u','u','u','A','A','E','I','O','U','n','n','c','C','-','-','','','','','','','','','','','','','','','','','','','','','','' );
    return str_replace($what, $by, $string);
}

function url($type,$name){
        $name = removerCaracter(strtolower($name));
        if($name=='produtos' || $name=='categorias' || $name=='categoria' || $name=='novidades' || $name=='outlet' || $name=='busca' || $name=='produto' || $name=='rastrear' || $name=='pedido' || $name=='login' || $name=='carrinho' || $name=='minha-conta' || $name=='sitemap' || $name=='instagram' || $name=='checkout' || $name=='links'){
            $name .= '-2';
        }
    return $name;
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

function deleteImage($user,$token,$image){
    $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_URL => 'https://img.autolabs.com.br/api?user='.$user.'&token='.$token.'&image='.$image,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'DELETE',
    ));
    $response = curl_exec($curl);
    curl_close($curl);
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

function createJson($id){
    $banco = db();
    $pdo = new PDO('mysql:host='.$banco['host'].';dbname='.$banco['name'].'',$banco['user'],$banco['password']);
    $pdo->exec("SET time_zone='+03:00'");
    //account
    $stmt = $pdo->prepare("SELECT `customer`,`status`,`name`,`domain`,`configuration`,`layout`,`seo`,`company`,`apps`->>'$.payment' AS `payment` FROM `accounts` WHERE `id`=:account");
    $stmt->bindValue(':account',$id,PDO::PARAM_STR);
    $stmt->execute();
    $account = $stmt->fetchAll(PDO::FETCH_ASSOC)[0];
    $account['layout'] = json_decode($account['layout']);
    $account['configuration'] = json_decode($account['configuration']);
    $account['company'] = json_decode($account['company']);
    $account['payment'] = json_decode($account['payment']);
    //addresses
    $stmt = $pdo->prepare("SELECT z.* FROM accounts a JOIN JSON_TABLE(a.company,'$.addresses[*]' COLUMNS (address varchar(100) PATH '$.address',number int PATH '$.number',district varchar(50) PATH '$.district',city varchar(50) PATH '$.city',state varchar(2) PATH '$.state',complement varchar(100) PATH '$.complement',zip_code varchar(20) PATH '$.zip_code',status varchar(3) PATH '$.status',`rank` int PATH '$.rank')) z WHERE a.id=:account AND z.status='on' ORDER BY z.`rank` ASC");
    $stmt->bindValue(':account',$id,PDO::PARAM_STR);
    $stmt->execute();
    $account['company']->addresses = $stmt->fetchAll(PDO::FETCH_ASSOC);
    //phones
    $stmt = $pdo->prepare("SELECT z.* FROM accounts a JOIN JSON_TABLE(a.company,'$.phones[*]' COLUMNS (number varchar(20) PATH '$.number',type varchar(20) PATH '$.type',status varchar(3) PATH '$.status',`rank` int PATH '$.rank')) z WHERE a.id=:account AND z.status='on' AND (z.type='phone' OR z.type='cell') ORDER BY z.`rank` ASC");
    $stmt->bindValue(':account',$id,PDO::PARAM_STR);
    $stmt->execute();
    $account['company']->phones = $stmt->fetchAll(PDO::FETCH_ASSOC);
    //whatsapps
    $stmt = $pdo->prepare("SELECT z.* FROM accounts a JOIN JSON_TABLE(a.company,'$.phones[*]' COLUMNS (number varchar(20) PATH '$.number',type varchar(20) PATH '$.type',status varchar(3) PATH '$.status',`rank` int PATH '$.rank')) z WHERE a.id=:account AND z.status='on' AND z.type='whatsapp' ORDER BY z.`rank` ASC");
    $stmt->bindValue(':account',$id,PDO::PARAM_STR);
    $stmt->execute();
    $account['company']->whatsapps = $stmt->fetchAll(PDO::FETCH_ASSOC);
    //customer
    $stmt = $pdo->prepare("SELECT `company` FROM `customers` WHERE `id`=:customer");
    $stmt->bindValue(':customer',$account['customer'],PDO::PARAM_STR);
    $stmt->execute();
    $customer = $stmt->fetchAll(PDO::FETCH_ASSOC)[0];
    //discount
    $stmt = $pdo->prepare("SELECT MAX(z.discount) AS discount FROM products a JOIN JSON_TABLE(a.variations,'$[*]' COLUMNS (quantity INT PATH '$.quantity',discount INT PATH '$.discount',status varchar(3) PATH '$.status')) z WHERE a.account=:account AND a.status='on' AND z.status='on' AND z.quantity>0");
    $stmt->bindValue(':account',$id,PDO::PARAM_STR);
    $stmt->execute();
    $discount = $stmt->fetchAll(PDO::FETCH_ASSOC)[0]['discount'];
    //pages
    $stmt = $pdo->prepare("SELECT a.name,a.url FROM pages a WHERE a.account=:account AND a.status='on' ORDER BY a.rank");
    $stmt->bindValue(':account',$id,PDO::PARAM_STR);
    $stmt->execute();
    $pages = $stmt->fetchAll(PDO::FETCH_ASSOC);
    //banners
    $stmt = $pdo->prepare("SELECT a.title,a.subtitle,a.image FROM banners a WHERE a.account=:account AND a.status='on' ORDER BY a.`rank` ASC");
    $stmt->bindValue(':account',$id,PDO::PARAM_STR);
    $stmt->execute();
    $banners = json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    //categories
    $stmt = $pdo->prepare("SELECT a.name,a.url FROM categories a WHERE a.account=:account AND a.status='on' AND a.parent='0' ORDER BY a.rank LIMIT ".$account['configuration']->header->category);
    $stmt->bindValue(':account',$id,PDO::PARAM_STR);
    $stmt->execute();
    $categories = json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    //json
    $json = '{
        "id": "'.$id.'",
        "status": "'.$account['status'].'",
        "domain": '.$account['domain'].',
        "name": "'.$account['name'].'",
        "seo": '.$account['seo'].',
        "company": '.json_encode($account['company']).',
        "configuration": '.json_encode($account['configuration']).',
        "layout": '.json_encode($account['layout']).',
        "customer": '.$customer['company'].',
        "discount": "'.$discount.'",
        "pages": '.json_encode($pages).',
        "categories": '.$categories.',
        "banners": '.$banners.',
        "payment": '.json_encode($account['payment']).'
    }';
    file_put_contents("../usr/json/accounts/$id.json",$json);
}

function createJsonDomain(){
    $banco = db();
    $pdo = new PDO('mysql:host='.$banco['host'].';dbname='.$banco['name'].'',$banco['user'],$banco['password']);
    $pdo->exec("SET time_zone='+03:00'");
    $stmt = $pdo->prepare("SELECT `domain`->>'$.domain' AS `domain`,`domain`->>'$.subdomain' AS `subdomain`,`id` FROM `accounts`");
    $stmt->bindValue(':account',$account,PDO::PARAM_STR);
    $stmt->execute();
    $accounts = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach($accounts as $value){
        $json[] = $value;
    }
    file_put_contents("../usr/json/accounts.json",json_encode($json));
}

function addQuantity($account,$order){
    $banco = db();
    $pdo = new PDO('mysql:host='.$banco['host'].';dbname='.$banco['name'].'',$banco['user'],$banco['password']);
    $pdo->exec("SET time_zone='+03:00'");
    //products
    $stmt = $pdo->prepare("SELECT a.`products` FROM `orders` a WHERE a.`account`=:account AND a.`id`=:order");
    $stmt->bindValue(':order',$order,PDO::PARAM_STR);
    $stmt->bindValue(':account',$account,PDO::PARAM_STR);
    $stmt->execute();
    $products = json_decode($stmt->fetchAll(PDO::FETCH_ASSOC)[0]['products']);
    //add quantity products
    foreach($products as $value){
        if($value['inventory']=='on'){
            $stmt = $pdo->prepare("UPDATE `products` SET `variations`=JSON_SET(`variations`,REPLACE(JSON_UNQUOTE(JSON_SEARCH(`variations`,'one',:variation,'','$[*].variation_name')),'variation_name','quantity'),JSON_EXTRACT(`variations`,REPLACE(JSON_UNQUOTE(JSON_SEARCH(`variations`,'one',:variation,'','$[*].variation_name')),'variation_name','quantity'))+:quantity) WHERE `account`=:account AND `id`=:id");
            $stmt->bindValue(':id',$value['id'],PDO::PARAM_STR);
            $stmt->bindValue(':account',$account,PDO::PARAM_STR);
            $stmt->bindValue(':variation',$value['variation_name'],PDO::PARAM_STR);
            $stmt->bindValue(':quantity',$value['quantity'],PDO::PARAM_INT);
            $stmt->execute();
            //change inventory off products order
            $stmt = $pdo->prepare("UPDATE `orders` SET `products`=JSON_SET(`products`,REPLACE(JSON_UNQUOTE(JSON_SEARCH(`products`,'one',:variation,'','$[*].variation_name')),'variation_name','inventory'),'off') WHERE `account`=:account AND `id`=:order");
            $stmt->bindValue(':order',$order,PDO::PARAM_STR);
            $stmt->bindValue(':account',$account,PDO::PARAM_STR);
            $stmt->bindValue(':variation',$value['variation_name'],PDO::PARAM_STR);
            $stmt->execute();
        }
    }
}

function delQuantity($account,$order){
    $banco = db();
    $pdo = new PDO('mysql:host='.$banco['host'].';dbname='.$banco['name'].'',$banco['user'],$banco['password']);
    $pdo->exec("SET time_zone='+03:00'");
    //products
    $stmt = $pdo->prepare("SELECT a.`configuration`->>'$.payment.book_product' AS `book_product` FROM `accounts` a WHERE a.`id`=:account");
    $stmt->bindValue(':account',$account,PDO::PARAM_STR);
    $stmt->execute();
    $account = $stmt->fetchAll(PDO::FETCH_ASSOC)[0];
    $stmt = $pdo->prepare("SELECT a.`products`,a.`status`->>'$[0].status' AS `status` FROM `orders` a WHERE a.`account`=:account AND a.`id`=:order");
    $stmt->bindValue(':order',$order,PDO::PARAM_STR);
    $stmt->bindValue(':account',$account,PDO::PARAM_STR);
    $stmt->execute();
    $products = json_decode($stmt->fetchAll(PDO::FETCH_ASSOC)[0]['products']);
    //del quantity products
    if(($account['book_product']=='on'&&$products['status']=='pending')||$products['status']!='pending'){
        foreach($products as $value){
            if($value['inventory']=='off'){
                //if control inventory = on, entao abate o estoque
                $stmt = $pdo->prepare("SELECT inventory_control,CAST(JSON_EXTRACT(`variations`,REPLACE(JSON_UNQUOTE(JSON_SEARCH(`variations`,'one',:variation,'','$[*].variation_name')),'variation_name','quantity')) AS UNSIGNED) AS quantity FROM `products` WHERE `account`=:account AND `id`=:id");
                $stmt->bindValue(':id',$value['id'],PDO::PARAM_STR);
                $stmt->bindValue(':account',$account,PDO::PARAM_STR);
                $stmt->bindValue(':variation',$value['variation_name'],PDO::PARAM_STR);
                $item = $stmt->fetchAll(PDO::FETCH_ASSOC)[0];
                if($item['inventory_control']=='on'){
                    if($item['quantity']-$value['quantity'] < 0){
                        //quantity final menor que zero, seta zero e nao coloca on no inventory
                        $stmt = $pdo->prepare("UPDATE `products` SET `variations`=JSON_SET(`variations`,REPLACE(JSON_UNQUOTE(JSON_SEARCH(`variations`,'one',:variation,'','$[*].variation_name')),'variation_name','quantity'),'0') WHERE `account`=:account AND `id`=:id");
                        $stmt->bindValue(':id',$value['id'],PDO::PARAM_STR);
                        $stmt->bindValue(':account',$account,PDO::PARAM_STR);
                        $stmt->bindValue(':variation',$value['variation_name'],PDO::PARAM_STR);
                        $stmt->execute();
                    }else{
                        //quantity final maior ou igual a zero, seta quantity novo e coloca on no inventory
                        $stmt = $pdo->prepare("UPDATE `products` SET `variations`=JSON_SET(`variations`,REPLACE(JSON_UNQUOTE(JSON_SEARCH(`variations`,'one',:variation,'','$[*].variation_name')),'variation_name','quantity'),JSON_EXTRACT(`variations`,REPLACE(JSON_UNQUOTE(JSON_SEARCH(`variations`,'one',:variation,'','$[*].variation_name')),'variation_name','quantity'))-:quantity) WHERE `account`=:account AND `id`=:id");
                        $stmt->bindValue(':quantity',$value['quantity'],PDO::PARAM_INT);
                        $stmt->bindValue(':id',$value['id'],PDO::PARAM_STR);
                        $stmt->bindValue(':account',$account,PDO::PARAM_STR);
                        $stmt->bindValue(':variation',$value['variation_name'],PDO::PARAM_STR);
                        $stmt->execute();
                        //change inventory on products order
                        $stmt = $pdo->prepare("UPDATE `orders` SET `products`=JSON_SET(`products`,REPLACE(JSON_UNQUOTE(JSON_SEARCH(`products`,'one',:variation,'','$[*].variation_name')),'variation_name','inventory'),'on') WHERE `account`=:account AND `id`=:order");
                        $stmt->bindValue(':order',$order,PDO::PARAM_STR);
                        $stmt->bindValue(':account',$account,PDO::PARAM_STR);
                        $stmt->bindValue(':variation',$value['variation_name'],PDO::PARAM_STR);
                        $stmt->execute();
                    }
                }
            }
        }
    }
}

function expiresIn($date,$days){
    $dateNew = $date;
    for($i=1;$i<=$days;$i++){
        $holidays = array('01-01', '04-21', '05-01', '09-07', '10-12', '11-02', '11-15', '12-25');
        $dateNew = date('Y-m-d',strtotime($dateNew)+(3600*24));
        if(date('w', strtotime($dateNew))==0 || date('w', strtotime($dateNew))==6){
            $i--;
        }else{
            foreach($holidays as $value){
                if(date('m', strtotime($dateNew))==explode('-',$value)[0] && date('d', strtotime($dateNew))==explode('-',$value)[1]){
                    $i--;
                }
            }
        }
    }
    return $dateNew;
}

function changeStatus($order,$status,$account){
    $banco = db();
    $pdo = new PDO('mysql:host='.$banco['host'].';dbname='.$banco['name'].'',$banco['user'],$banco['password']);
    $pdo->exec("SET time_zone='+03:00'");
    //status
    $stmt = $pdo->prepare("SELECT a.status FROM orders a WHERE a.account=:account AND a.id=:order");
    $stmt->bindValue(':account',$account,PDO::PARAM_STR);
    $stmt->bindValue(':order',$order,PDO::PARAM_STR);
    $stmt->execute();
    $statusAll = json_decode($stmt->fetchAll(PDO::FETCH_ASSOC)[0]['status']);
    array_unshift($statusAll, array('status'=> $status, 'date'=> date('Y-m-d H:i:s')));
    $stmt = $pdo->prepare("UPDATE orders SET status=CAST(:status AS JSON) WHERE account=:account AND id=:order");
    $stmt->bindValue(':account',$account,PDO::PARAM_STR);
    $stmt->bindValue(':order',$order,PDO::PARAM_STR);
    $stmt->bindValue(':status',json_encode($statusAll),PDO::PARAM_STR);
    $stmt->execute();
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