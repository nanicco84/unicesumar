<?php

function address($req,$res,$args){
    if($req->getParam('zip_code')){
        try {
            $clientpuro = new SoapClient("https://apps.correios.com.br/SigepMasterJPA/AtendeClienteService/AtendeCliente?wsdl");
            $zip_code=array('cep' => $req->getParam('zip_code'));
            $result=$clientpuro->consultaCEP($zip_code);
            $results['address'] = trim($result->return->end);
            $results['district'] = trim($result->return->bairro);
            $results['city'] = trim($result->return->cidade);
            $results['state'] = trim($result->return->uf);
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