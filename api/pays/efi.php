<?php

function efiAuth($client_id,$client_secret){
    $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_URL => 'https://cobrancas.api.efipay.com.br/v1/authorize',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_POSTFIELDS =>'{
            "grant_type": "client_credentials"
        }',
        CURLOPT_HTTPHEADER => array(
            'Authorization: Basic '.base64_encode($client_id.':'.$client_secret),
            'Content-Type: application/json'
        ),
    ));
    $response = curl_exec($curl);
    curl_close($curl);
    return json_decode($response);
}

function efiBillet($access_token,$id,$customer,$items){
    $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_URL => 'https://cobrancas.api.efipay.com.br/v1/charge/one-step',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_POSTFIELDS => '{
            "items": ['.$items.'],
            "metadata": {
                "custom_id": "'.$id.'",
                "notification_url": "https://api.paggy.com.br/v1/callback/efi/'.$id.'"
            },
            "payment": {
                "banking_billet": {
                    "expire_at": "'.date('Y-m-d',strtotime('+10 days',strtotime(date('Y-m-d')))).'",
                    "customer": {
                        '.(strlen($customer['document'])==11?'
                        "name": "'.$customer['name'].'",
                        "cpf": "'.$customer['document'].'"
                        ':'
                        "juridical_person":{
                            "corporate_name": "'.$customer['name'].'",
                            "cnpj": "'.$customer['document'].'"
                        }
                        ').'
                    }
                }   
            }
        }',
        CURLOPT_HTTPHEADER => array(
            'Authorization: Bearer '.$access_token,
            'Content-Type: application/json'
        ),
    ));
    $response = curl_exec($curl);
    curl_close($curl);
    return json_decode($response);
}

function efiPix($access_token,$id,$customer,$items){
    $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_URL => 'https://cobrancas.api.efipay.com.br/v1/charge/one-step',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_POSTFIELDS => '{
            "items": ['.$items.'],
            "metadata": {
                "custom_id": "'.$id.'",
                "notification_url": "https://api.paggy.com.br/v1/callback/efi/'.$id.'"
            },
            "payment": {
                "banking_billet": {
                    "expire_at": "'.date('Y-m-d',strtotime('+10 days',strtotime(date('Y-m-d')))).'",
                    "customer": {
                        '.(strlen($customer['document'])==11?'
                        "name": "'.$customer['name'].'",
                        "cpf": "'.$customer['document'].'"
                        ':'
                        "juridical_person":{
                            "corporate_name": "'.$customer['name'].'",
                            "cnpj": "'.$customer['document'].'"
                        }
                        ').'
                    }
                }   
            }
        }',
        CURLOPT_HTTPHEADER => array(
            'Authorization: Bearer '.$access_token,
            'Content-Type: application/json'
        ),
    ));
    $response = curl_exec($curl);
    curl_close($curl);
    return json_decode($response);
}

function efiCallback($access_token,$token){
    $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_URL => 'https://cobrancas.api.efipay.com.br/v1/notification/'.$token,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'GET',
        CURLOPT_HTTPHEADER => array(
            'Authorization: Bearer '.$access_token,
            'Content-Type: application/json'
        ),
    ));
    $response = curl_exec($curl);
    curl_close($curl);
    return json_decode($response);
}