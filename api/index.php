<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
setlocale(LC_TIME, 'pt_BR', 'pt_BR.utf-8', 'pt_BR.utf-8', 'portuguese');
date_default_timezone_set('America/Sao_Paulo');

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

require __DIR__ . '/vendor/autoload.php';

require 'config/database.php';
require 'config/functions.php';
require 'pays/efi.php';

$app = new \Slim\App;

//auth
$app->group('/auth',function() use ($app){
    require 'routes/auth.php';
    $app->post('/login',function(Request $req, Response $res, $args){
        return login($req,$res,$args);
    });
    $app->post('/logged',function(Request $req, Response $res, $args){
        return logged($req,$res,$args);
    });
    $app->post('/logout',function(Request $req, Response $res, $args){
        return logout($req,$res,$args);
    });
    $app->post('/token',function(Request $req, Response $res, $args){
        return token($req,$res,$args);
    });
});

//dashboard
$app->group('/dashboard',function() use ($app){
    require 'routes/dashboard.php';
    $app->get('',function(Request $req, Response $res, $args){
        return getDashboard($req,$res,$args);
    });
});

//customers
$app->group('/customers',function() use ($app){
    require 'routes/customers.php';
    $app->get('',function(Request $req, Response $res, $args){
        return getCustomers($req,$res,$args);
    });
    $app->get('/{id}',function(Request $req, Response $res, $args){
        return getCustomersId($req,$res,$args);
    });
    $app->post('',function(Request $req, Response $res, $args){
        return postCustomers($req,$res,$args);
    });
    $app->put('/{id}',function(Request $req, Response $res, $args){
        return putCustomers($req,$res,$args);
    });
    $app->delete('/{id}',function(Request $req, Response $res, $args){
        return deleteCustomers($req,$res,$args);
    });
});

//groups
$app->group('/groups',function() use ($app){
    require 'routes/groups.php';
    $app->get('',function(Request $req, Response $res, $args){
        return getGroups($req,$res,$args);
    });
    $app->get('/{id}',function(Request $req, Response $res, $args){
        return getGroupsId($req,$res,$args);
    });
    $app->post('',function(Request $req, Response $res, $args){
        return postGroups($req,$res,$args);
    });
    $app->put('/{id}',function(Request $req, Response $res, $args){
        return putGroups($req,$res,$args);
    });
    $app->delete('/{id}',function(Request $req, Response $res, $args){
        return deleteGroups($req,$res,$args);
    });
});

//services
$app->group('/services',function() use ($app){
    require 'routes/services.php';
    $app->get('',function(Request $req, Response $res, $args){
        return getServices($req,$res,$args);
    });
    $app->get('/{id}',function(Request $req, Response $res, $args){
        return getServicesId($req,$res,$args);
    });
    $app->post('',function(Request $req, Response $res, $args){
        return postServices($req,$res,$args);
    });
    $app->put('/{id}',function(Request $req, Response $res, $args){
        return putServices($req,$res,$args);
    });
    $app->delete('/{id}',function(Request $req, Response $res, $args){
        return deleteServices($req,$res,$args);
    });
});

//subscriptions
$app->group('/subscriptions',function() use ($app){
    require 'routes/subscriptions.php';
    $app->get('',function(Request $req, Response $res, $args){
        return getSubscriptions($req,$res,$args);
    });
    $app->get('/{id}',function(Request $req, Response $res, $args){
        return getSubscriptionsId($req,$res,$args);
    });
    $app->post('',function(Request $req, Response $res, $args){
        return postSubscriptions($req,$res,$args);
    });
    $app->put('/{id}',function(Request $req, Response $res, $args){
        return putSubscriptions($req,$res,$args);
    });
    $app->delete('/{id}',function(Request $req, Response $res, $args){
        return deleteSubscriptions($req,$res,$args);
    });
});

//invoices
$app->group('/invoices',function() use ($app){
    require 'routes/invoices.php';
    $app->get('',function(Request $req, Response $res, $args){
        return getInvoices($req,$res,$args);
    });
    $app->get('/{id}',function(Request $req, Response $res, $args){
        return getInvoicesId($req,$res,$args);
    });
    $app->post('',function(Request $req, Response $res, $args){
        return postInvoices($req,$res,$args);
    });
    $app->put('/{id}',function(Request $req, Response $res, $args){
        return putInvoices($req,$res,$args);
    });
    $app->delete('/{id}',function(Request $req, Response $res, $args){
        return deleteInvoices($req,$res,$args);
    });
});

//company
$app->group('/company',function() use ($app){
    require 'routes/company.php';
    $app->get('/{id}',function(Request $req, Response $res, $args){
        return getCompanyId($req,$res,$args);
    });
    $app->put('/{id}',function(Request $req, Response $res, $args){
        return putCompany($req,$res,$args);
    });
});

//payments
$app->group('/payments',function() use ($app){
    require 'routes/payments.php';
    $app->get('',function(Request $req, Response $res, $args){
        return getPayments($req,$res,$args);
    });
    $app->get('/{id}',function(Request $req, Response $res, $args){
        return getPaymentsId($req,$res,$args);
    });
    $app->put('/{id}',function(Request $req, Response $res, $args){
        return putPayments($req,$res,$args);
    });
});

//notifications
$app->group('/notifications',function() use ($app){
    require 'routes/notifications.php';
    $app->get('',function(Request $req, Response $res, $args){
        return getNotifications($req,$res,$args);
    });
    $app->put('/{id}',function(Request $req, Response $res, $args){
        return putNotifications($req,$res,$args);
    });
});

//layout
$app->group('/layout',function() use ($app){
    require 'routes/layout.php';
    $app->get('/{id}',function(Request $req, Response $res, $args){
        return getLayoutId($req,$res,$args);
    });
    $app->put('/{id}',function(Request $req, Response $res, $args){
        return putLayout($req,$res,$args);
    });
});

//users
$app->group('/users',function() use ($app){
    require 'routes/users.php';
    $app->get('',function(Request $req, Response $res, $args){
        return getUsers($req,$res,$args);
    });
    $app->get('/{id}',function(Request $req, Response $res, $args){
        return getUsersId($req,$res,$args);
    });
    $app->post('',function(Request $req, Response $res, $args){
        return postUsers($req,$res,$args);
    });
    $app->put('/{id}',function(Request $req, Response $res, $args){
        return putUsers($req,$res,$args);
    });
    $app->delete('/{id}',function(Request $req, Response $res, $args){
        return deleteUsers($req,$res,$args);
    });
});

//search
$app->group('/search',function() use ($app){
    require 'routes/search.php';
    $app->get('',function(Request $req, Response $res, $args){
        return getSearch($req,$res,$args);
    });
});

//cron
$app->group('/cron',function() use ($app){
    require 'routes/cron.php';
    $app->get('/tokens',function(Request $req, Response $res, $args){
        return cronTokens($req,$res,$args);
    });
    $app->get('/status',function(Request $req, Response $res, $args){
        return cronStatus($req,$res,$args);
    });
    $app->get('/invoices',function(Request $req, Response $res, $args){
        return cronInvoices($req,$res,$args);
    });
    $app->get('/notifications',function(Request $req, Response $res, $args){
        return cronNotifications($req,$res,$args);
    });
});

//send
$app->post('/send',function(Request $req, Response $res, $args){
    require 'routes/send.php';
    return send($req,$res,$args);
});

//callback
$app->group('/callback',function() use ($app){
    require 'routes/callback.php';
    $app->post('/efi/{id}',function(Request $req, Response $res, $args){
        return callbackEfi($req,$res,$args);
    });
});

//error
$app->map(['GET','POST','PUT','DELETE'],'/',function(Request $request, Response $response, $args){
    $response->getBody()->write(json_encode(array('message'=>'Rota inválida','sts'=>404)));
    return $response->withHeader('Content-type','application/json; charset=utf-8');
});
$app->map(['GET','POST','PUT','DELETE'],'/{routes:.+}',function(Request $request, Response $response, $args){
    $response->getBody()->write(json_encode(array('message'=>'Rota inválida','sts'=>404)));
    return $response->withHeader('Content-type','application/json; charset=utf-8');
});

$app->run();
