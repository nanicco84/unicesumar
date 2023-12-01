<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

function send($req,$res,$args){
    if($req->getParam('to') && $req->getParam('from') && $req->getParam('body') && $req->getParam('account') && $req->getParam('subject')){
        $send = sendEmail();
    }else{
        $res->getBody()->write(json_encode(array('message'=>'Atributo inválido ou inexistente','sts'=>400)));
    }
    return $res->withHeader('Content-type','application/json; charset=utf-8');
}

function sendEmail($company,$customer,$layout,$type,$data){
    try {
        $content = createContent($company,$customer,$type,$data);
        $body = createTemplate($company,$layout,$content);
        $mail = new PHPMailer(true);
        /*$mail->SMTPDebug = SMTP::DEBUG_SERVER;*/ 
        $mail->isSMTP();
        $mail->CharSet = 'UTF-8';
        $mail->Host = 'mail.paggy.com.br';
        $mail->SMTPAuth = true;
        $mail->Username = 'noreply@paggy.com.br';
        $mail->Password = '_@J+#%_LE&T$';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = 465;
        $mail->setFrom('noreply@paggy.com.br',$company['name']);
        $mail->addAddress($customer['email'],$customer['name']);
        $mail->addReplyTo($company['email'],$company['name']);
        $mail->addBCC('noreply@paggy.com.br');
        $mail->isHTML(true);
        $mail->Subject = $data['subject'];
        $mail->Body = $body;
        $mail->send();
        return true;
    }catch(Exception $e){
        createError($mail->ErrorInfo,$company['id']);
        return false;
    }
}

function createContent($company,$customer,$type,$data){
    if($type=='invoice'){
        $services = '';
        foreach($data['services'] as $value){
            $services .= '<div class="services__item">
                <div class="services__div">'.$value->name.'</div>
                <div class="services__div">'.$value->quantity.'</div>
                <div class="services__div">R$ '.number_format($value->price,2,',','.').'</div>
                <div class="services__div">R$ '.number_format($value->price*$value->quantity,2,',','.').'</div>
            </div>';
        }
        $content = '<div class="summary">
            <div class="summary__item">
                <strong>Total</strong>
                <p>R$ '.number_format($data['total'],2,',','.').'</p>
            </div>
            <div class="summary__item">
                <strong>Vencimento</strong>
                <p>'.date_format(date_create($data['due_date']),"d/m/Y").'</p>
            </div>
            <div class="summary__item">
                <strong>Fatura</strong>
                <p>'.$data['invoice'].'</p>
            </div>
        </div>
        <p class="subtitle">Itens da fatura</p>
        <div class="services">
            <div class="services__topic">
                <div class="services__div">Itens</div>
                <div class="services__div">Quantidade</div>
                <div class="services__div">Valor</div>
                <div class="services__div">Total</div>
            </div>
            '.$services.'
        </div>';
        if($data['service']=='billet'){
            $content = '<p class="title">Olá, '.$customer['name'].'!</p>
                <p>'.str_replace('[company]','<strong>'.$company['name'].'</strong>',$data['text']).'</p>
                <p>Abaixo as informações sobre esta fatura:</p>
                '.$content.'
                <a class="button" href="'.$data['details']->pdf.'">Visualizar boleto</a>
                <p class="text">Caso não seja possível acessar o boleto através do botão acima ou pelo arquivo em anexo, copie e cole o link a seguir na barra de endereços do seu navegador: <a href="'.$data['details']->pdf.'">'.$data['details']->pdf.'</a></p>
                <p class="subtext">Se preferir realizar o pagamento de alguma outra forma, <a href="https://pay.paggy.com.br/'.$data['invoice'].'">acesse aqui</a>!</p>
                <p class="text">Atenciosamente,<br><strong>'.$company['name'].'</strong></p>
            ';
        }elseif($data['service']=='pix'){
            $content = '<p class="title">Olá, '.$customer['name'].'!</p>
                <p>'.str_replace('[company]','<strong>'.$company['name'].'</strong>',$data['text']).'</p>
                <p>Abaixo as informações sobre esta fatura:</p>
                '.$content.'
                <img class="pix" src="'.$data['details']->qrcode_image.'">
                <a class="button" href="https://pay.paggy.com.br/'.$data['invoice'].'">Visualizar QRCode</a>
                <p class="text">Caso não seja possível acessar o QRCode através do botão acima ou pelo QRCode em anexo, copie e cole o link a seguir na barra de endereços do seu navegador: <a href="https://pay.paggy.com.br/'.$data['invoice'].'">https://pay.paggy.com.br/'.$data['invoice'].'</a></p>
                <p class="subtext">Se preferir realizar o pagamento de alguma outra forma, <a href="https://pay.paggy.com.br/'.$data['invoice'].'">acesse aqui</a>!</p>
                <p class="text">Atenciosamente,<br><strong>'.$company['name'].'</strong></p>
            ';
        }elseif($data['service']=='credit'){
            $content = '<p class="title">Olá, '.$customer['name'].'!</p>
                <p>'.str_replace('[company]','<strong>'.$company['name'].'</strong>',$data['text']).'</p>
                <p>Abaixo as informações sobre esta fatura:</p>
                '.$content.'
                <a class="button" href="https://pay.paggy.com.br/'.$data['invoice'].'">Realizar pagamento</a>
                <p class="text">Caso não seja possível acessar o botão acima, copie e cole o link a seguir na barra de endereços do seu navegador: <a href="https://pay.paggy.com.br/'.$data['invoice'].'">https://pay.paggy.com.br/'.$data['invoice'].'</a></p>
                <p class="subtext">Se preferir realizar o pagamento de alguma outra forma, <a href="https://pay.paggy.com.br/'.$data['invoice'].'">acesse aqui</a>!</p>
                <p class="text">Atenciosamente,<br><strong>'.$company['name'].'</strong></p>
            ';
        }else{
            $content = '<p class="title">Olá, '.$customer['name'].'!</p>
                <p>'.str_replace('[company]','<strong>'.$company['name'].'</strong>',$data['text']).'</p>
                <p>Abaixo as informações sobre esta fatura:</p>
                '.$content.'
                <p class="text">'.nl2br($data['payment_text']).'</a></p>
                <p class="text">Atenciosamente,<br><strong>'.$company['name'].'</strong></p>
            ';
        }
    }elseif($type=='paid'){
        $services = '';
        foreach($data['services'] as $value){
            $services .= '<div class="services__item">
                <div class="services__div">'.$value->name.'</div>
                <div class="services__div">'.$value->quantity.'</div>
                <div class="services__div">R$ '.number_format($value->price,2,',','.').'</div>
                <div class="services__div">R$ '.number_format($value->price*$value->quantity,2,',','.').'</div>
            </div>';
        }
        $content = '<div class="summary">
            <div class="summary__item">
                <strong>Total</strong>
                <p>R$ '.number_format($data['total'],2,',','.').'</p>
            </div>
            <div class="summary__item">
                <strong>Vencimento</strong>
                <p>'.date_format(date_create($data['due_date']),"d/m/Y").'</p>
            </div>
            <div class="summary__item">
                <strong>Fatura</strong>
                <p>'.$data['invoice'].'</p>
            </div>
        </div>
        <p class="subtitle">Itens da fatura</p>
        <div class="services">
            <div class="services__topic">
                <div class="services__div">Itens</div>
                <div class="services__div">Quantidade</div>
                <div class="services__div">Valor</div>
                <div class="services__div">Total</div>
            </div>
            '.$services.'
        </div>';
        $content = '<p class="title">Obrigado, '.$customer['name'].'!</p>
            <p>'.str_replace('[company]','<strong>'.$company['name'].'</strong>',$data['text']).'</p>
            <p>Abaixo as informações da fatura paga:</p>
            '.$content.'
            <p class="text">Agradecemos pelo pagamento desta fatura.</p>
            <p class="text">Atenciosamente,<br><strong>'.$company['name'].'</strong></p>
        ';
    }elseif($type=='message'){
        $content = '<p class="title">Olá, '.$customer['name'].'!</p>
            <p class="text">'.nl2br($data['text']).'</p>
            <p class="text">Atenciosamente,<br><strong>'.$company['name'].'</strong></p>
        ';
    }
    return $content;
}

function createTemplate($company,$layout,$content){
    $body = '
    <html>
        <head>
            <style>
                @import url("https://fonts.googleapis.com/css2?family='.$layout->font.'&display=swap");
                body, html{
                    background-color: #eeeeee;
                    width: 100%;
                    padding: 10px 0;
                    margin: 0;
                    cursor: default;
                    font-family: \''.str_replace('+',' ',$layout->font).'\', sans-serif;
                }
                p{
                    margin: 0;
                }
                header{
                    max-width: 600px;
                    width: 100%;
                    margin: 0 auto;
                    background-color: '.$layout->header->background.';
                    text-transform: uppercase;
                    padding: 30px 0;
                    text-align: center;
                    font-size: '.$layout->header->size.';
                    color: '.$layout->header->color.';
                    line-height: 100%;
                    border-radius: 20px 20px 0 0;
                    font-weight: bold;
                }
                footer{
                    max-width: 600px;
                    width: 100%;
                    margin: 0 auto;
                    background-color: '.$layout->footer->background.';
                    color: '.$layout->footer->color.';
                    font-size: '.$layout->footer->size.';
                    padding: 30px 0;
                    border-radius: 0 0 20px 20px;
                }
                .footer__text{
                    text-align: center;
                    line-height: 120%;
                }
                .footer__space{
                    height: 5px;
                }
                .footer__text a:hover, .footer__text a:active, .footer__text a:visited, .footer__text a:link{
                    color: '.$layout->footer->color.';
                    text-decoration: none;
                }
                main{
                    max-width: 600px;
                    width: 100%;
                    margin: 0 auto;
                    background: #ffffff;
                    color: '.$layout->main->color.';
                    font-size: '.$layout->main->size.';
                    padding: 30px 20px 40px 20px;
                    box-sizing: border-box;
                }
                main a:hover, main a:active, main a:visited, main a:link{
                    color: '.$layout->main->title.';
                    text-decoration: none;
                    font-weight: bold;
                }
                .title{
                    font-weight: bold;
                    font-size: '.str_replace('px','',$layout->main->size)*1.5.'px;
                    padding-bottom: 10px;
                    color: '.$layout->main->title.';
                }
                .subtitle{
                    font-weight: bold;
                    font-size: '.$layout->main->size.';
                    padding-top: 35px;
                    color: '.$layout->main->title.';
                }
                .summary{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 35px;
                }
                .summary__item{
                    background: #eeeeee;
                    color: '.$layout->main->color.';
                    font-size: '.$layout->main->size.';
                    width: calc(33.33% - 13.33px);
                    padding: 10px;
                    box-sizing: border-box;
                    text-align: center;
                }
                .summary__item strong{
                    color: '.$layout->main->title.';
                }
                .services{
                    padding-top: 10px;
                }
                .services__title{
                    font-weight: bold;
                    font-size: '.$layout->main->size.';
                    padding-bottom: 10px;
                    color: '.$layout->main->title.';
                }
                .services__topic{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: #eeeeee;
                    font-weight: bold;
                }
                .services__item{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #eeeeee;
                }
                .services__div{
                    width: 20%;
                    padding: 10px;
                    box-sizing: border-box;
                    color: '.$layout->main->color.';
                    font-size: '.str_replace('px','',$layout->main->size)*0.8.'px;
                }
                .services__div:first-child{
                    width: 40%;
                }
                .text{
                    color: '.$layout->main->color.';
                    font-size: '.$layout->main->size.';
                    padding-top: 35px;
                }
                .subtext{
                    color: #999999;
                    font-size: '.str_replace('px','',$layout->main->size)*0.8.'px;
                    padding-top: 35px;
                }
                .button{
                    background-color: '.$layout->main->title.';
                    color: #ffffff !important;
                    padding: 10px 0;
                    text-align: center;
                    text-transform: uppercase;
                    width: 100%;
                    display: block;
                    margin-top: 40px;
                    font-weight: bold;
                    border-radius: 30px;
                }
                .button:hover{
                    color: '.$layout->main->title.' !important;
                    background-color: #eeeeee !important;
                }
                .pix{
                    padding-top: 40px;
                    width: 200px;
                    margin: 0 auto;
                    display: flex;
                }
                .paggy{
                    padding-top: 10px;
                    text-align: center;
                    color: #999999;
                    font-size: 12px;
                }
                .paggy a:hover, .paggy a:active, .paggy a:visited, .paggy a:link{
                    color: #999999;
                    text-decoration: none;
                }
            </style>
        </head>
        <body>
            <header>'.$company['name'].'</header>
            <main>'.$content.'</main>
            <footer>
                <div class="footer__text">'.$company['phone'].'</div>
                <div class="footer__space"></div>
                <div class="footer__text">'.$company['address']->address.' '.$company['address']->number.', '.$company['address']->district.'<br>'.$company['address']->city.', '.$company['address']->state.' - CEP: '.$company['address']->zip_code.'</div>
                <div class="footer__space"></div>
                <div class="footer__text"><a href="https://'.$company['site'].'" target="_blank">'.$company['site'].'</a></div>
            </footer>
            <div class="paggy">Esse serviço é oferecido por <a href="https://paggy.com.br">Paggy.com.br</a></div>
        </body>
    </html>
    ';
    return $body;
}