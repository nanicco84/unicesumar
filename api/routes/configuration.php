<?php

function getConfigurationId($req,$res,$args){
    if(validateToken($req->getParam('user'),$req->getParam('token')) && $req->getParam('account')){
        try {
            $banco = db();
            $pdo = new PDO('mysql:host='.$banco['host'].';dbname='.$banco['name'].'',$banco['user'],$banco['password']);
            $pdo->exec("SET time_zone='+03:00'");
            $stmt = $pdo->prepare("SELECT
            status,
            `configuration`->>'$.home.about' AS `home_about`,
            `configuration`->>'$.home.outlet' AS `home_outlet`,
            `configuration`->>'$.home.category' AS `home_category`,
            `configuration`->>'$.page.new' AS `page_new`,
            `configuration`->>'$.page.cart' AS `page_cart`,
            `configuration`->>'$.page.outlet' AS `page_outlet`,
            `configuration`->>'$.footer.logo' AS `footer_logo`,
            `configuration`->>'$.footer.payment' AS `footer_payment`,
            `configuration`->>'$.header.category' AS `header_category`,
            `configuration`->>'$.company.map' AS `company_map`,
            `configuration`->>'$.company.address' AS `company_address`,
            `configuration`->>'$.company.document' AS `company_document`,
            `configuration`->>'$.general.new' AS `general_new`,
            `configuration`->>'$.general.type' AS `general_type`,
            `configuration`->>'$.general.buyer' AS `general_buyer`,
            `configuration`->>'$.general.outlet' AS `general_outlet`,
            `configuration`->>'$.product.order' AS `product_order`,
            `configuration`->>'$.product.exchange' AS `product_exchange`,
            `configuration`->>'$.product.quantity' AS `product_quantity`,
            `configuration`->>'$.product.installment' AS `product_installment`,
            `configuration`->>'$.product.out_of_stock' AS `product_out_of_stock`,
            `configuration`->>'$.checkout.coupon' AS `checkout_coupon`,
            `configuration`->>'$.checkout.installment' AS `checkout_installment`,
            `configuration`->>'$.checkout.registration' AS `checkout_registration`,
            `configuration`->>'$.shipping.cart' AS `shipping_cart`,
            `configuration`->>'$.shipping.time' AS `shipping_time`,
            `configuration`->>'$.shipping.product' AS `shipping_product`,
            `configuration`->>'$.payment.book_product' AS `payment_book_product`,
            `configuration`->>'$.payment.invoice_due_date' AS `payment_invoice_due_date`
            FROM `accounts` WHERE `id`=:account");
            $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC)[0];
            //settings
            $stmt = $pdo->prepare("SELECT `configuration` FROM `settings`");
            $stmt->execute();
            $settings = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $settings = json_decode($settings[0]['configuration']);
            foreach($settings as $key => $val){
                ${$key} = $val;
            }
            //return
            $res->getBody()->write(json_encode(array('sts'=>200,'results'=>$results,
            'header_category'=>$category,
            'general_new'=>$new,
            'general_type'=>$type,
            'general_buyer'=>$buyer,
            'general_outlet'=>$outlet,
            'product_order'=>$order,
            'product_exchange'=>$exchange,
            'product_installment'=>$installment,
            'payment_invoice_due_date'=>$invoice_due_date
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

function putConfiguration($req,$res,$args){
    if(validateToken($req->getParam('user'),$req->getParam('token'))
    && $req->getParam('account')
    /*&& $req->getParam('grid_home_row')
    && $req->getParam('grid_home_column')
    && $req->getParam('grid_more_column')
    && $req->getParam('grid_products_column')
    && $req->getParam('menu_case')
    && $req->getParam('menu_font')
    && $req->getParam('menu_size')
    && $req->getParam('menu_style')
    && $req->getParam('text_case')
    && $req->getParam('text_font')
    && $req->getParam('text_size')
    && $req->getParam('text_style')
    && $req->getParam('title_case')
    && $req->getParam('title_font')
    && $req->getParam('title_size')
    && $req->getParam('title_style')
    && $req->getParam('button_case')
    && $req->getParam('button_font')
    && $req->getParam('button_size')
    && $req->getParam('button_style')
    && $req->getParam('layout_theme')
    && $req->getParam('layout_template')
    && $req->getParam('primary_color')
    && $req->getParam('primary_background')
    && $req->getParam('secundary_color')
    && $req->getParam('secundary_background')
    && $req->getParam('border_frame')
    && $req->getParam('border_hover')
    && $req->getParam('border_width')
    && $req->getParam('border_radius')
    && $req->getParam('banner_case')
    && $req->getParam('banner_font')
    && $req->getParam('banner_size')
    && $req->getParam('banner_style')
    && $req->getParam('banner_color')
    && $req->getParam('banner_hover')
    && $req->getParam('banner_effect')
    && $req->getParam('banner_format')
    && $req->getParam('banner_opacity')
    && $req->getParam('banner_position')
    && $req->getParam('banner_background')
    && $req->getParam('banner_transition')
    && $req->getParam('image_fill')
    && $req->getParam('image_hover')
    && $req->getParam('image_ratio')
    && $req->getParam('image_padding')
    && $req->getParam('image_position')
    && $req->getParam('email_body_font')
    && $req->getParam('email_body_size')
    && $req->getParam('email_body_color')
    && $req->getParam('email_body_background')
    && $req->getParam('email_main_font')
    && $req->getParam('email_main_size')
    && $req->getParam('email_main_color')
    && $req->getParam('email_main_radius')
    && $req->getParam('email_main_background')*/
    ){
        try {
            $banco = db();
            $pdo = new PDO('mysql:host='.$banco['host'].';dbname='.$banco['name'].'',$banco['user'],$banco['password']);
            $pdo->exec("SET time_zone='+03:00'");
            $stmt = $pdo->prepare("UPDATE accounts SET status=:status,configuration=CAST(:obj AS JSON) WHERE id=:account"); 
            $stmt->bindValue(':account',$req->getParam('account'),PDO::PARAM_STR);
            $stmt->bindValue(':status',$req->getParam('status'),PDO::PARAM_STR);
            $stmt->bindValue(':obj','{
                "home": {
                    "about": "'.$req->getParam('home_about').'",
                    "outlet": "'.$req->getParam('home_outlet').'",
                    "category": "'.$req->getParam('home_category').'"
                },
                "page": {
                    "new": "'.$req->getParam('page_new').'",
                    "cart": "'.$req->getParam('page_cart').'",
                    "outlet": "'.$req->getParam('page_outlet').'"
                },
                "footer": {
                    "logo": "'.$req->getParam('footer_logo').'",
                    "payment": "'.$req->getParam('footer_payment').'"
                },
                "header": {
                    "category": "'.$req->getParam('header_category').'"
                },
                "company": {
                    "map": "'.$req->getParam('company_map').'",
                    "address": "'.$req->getParam('company_address').'",
                    "document": "'.$req->getParam('company_document').'"
                },
                "general": {
                    "new": "'.$req->getParam('general_new').'",
                    "type": "'.$req->getParam('general_type').'",
                    "buyer": "'.$req->getParam('general_buyer').'",
                    "outlet": "'.$req->getParam('general_outlet').'"
                },
                "product": {
                    "order": "'.$req->getParam('product_order').'",
                    "exchange": "'.$req->getParam('product_exchange').'",
                    "quantity": "'.$req->getParam('product_quantity').'",
                    "installment": "'.$req->getParam('product_installment').'",
                    "out_of_stock": "'.$req->getParam('product_out_of_stock').'"
                },
                "checkout": {
                    "coupon": "'.$req->getParam('checkout_coupon').'",
                    "installment": "'.$req->getParam('checkout_installment').'",
                    "registration": "'.$req->getParam('checkout_registration').'"
                },
                "shipping": {
                    "cart": "'.$req->getParam('shipping_cart').'",
                    "time": "'.$req->getParam('shipping_time').'",
                    "product": "'.$req->getParam('shipping_product').'"
                },
                "payment": {
                    "book_product": "'.$req->getParam('payment_book_product').'",
                    "invoice_due_date": "'.$req->getParam('payment_invoice_due_date').'"
                }
            }',PDO::PARAM_STR);
            $stmt->execute();
            createJson($req->getParam('account'));
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