//logged
function logged(){
    if(Cookies.get('auth')){
        $.post(`${window.api}${window.auth}/logged`,JSON.parse(Cookies.get('auth')),function(res, txt, sts){
            if(res.sts == 200){
                Cookies.set('auth', JSON.stringify(res), { expires:7 });
                opening(header=true);
            }else{
                Cookies.remove('auth');
                opening(header=false);
            }
        }).fail(function(){
            Cookies.remove('auth');
            opening(header=false);
        });
    }else{
        opening(header=false);
    }
}

//login
function login(email,password){
    $('footer .loading').fadeIn(500);
    var data = {email: email, password: password};
    $.post(`${window.api}${window.auth}/login`,data,function(res, txt, sts){
        if(res.sts == 200){
            setTimeout(function(){
                $('footer .loading').fadeOut(500);
            },500);
            setTimeout(function(){
                $('.footer__logo').fadeIn(500);
                $('.footer__background').css({'transition':'all 0.5s ease','opacity':'1'});
            },1000);
            setTimeout(function(){
                if(isMobile()){
                    $('footer').css({'height':'100%','top':'0'});
                }else{
                    $('footer').css({'width':'100%','left':'0'});
                }
            },1500);
            setTimeout(function(){
                Cookies.set('auth', JSON.stringify(res), { expires:7 });
                location.reload();
            },2000);
        }else{
            setTimeout(function(){
                $('footer .loading').fadeOut(500);
                $('.footer__message').fadeIn(500);
                $('.footer__message').text(res.message);
            },500);
            setTimeout(function(){
                $('.footer__message').fadeOut(500);
                $('.footer__background').fadeOut(500);
                $('footer').fadeOut(500);
            },2500);
        }
    }).fail(function(err){
        setTimeout(function(){
            $('footer .loading').fadeOut(500);
            $('.footer__message').fadeIn(500);
            $('.footer__message').text(err.responseJSON.message);
        },500);
        setTimeout(function(){
            $('.footer__message').fadeOut(500);
            $('.footer__background').fadeOut(500);
            $('footer').fadeOut(500);
        },2500);
    });
}

//logout
function logout(){
    $('footer').fadeIn(500);
    setTimeout(function(){
        $.post(`${window.api}${window.auth}/logout`,JSON.parse(Cookies.get('auth')));
        Cookies.remove('auth');
        document.location = './';
    },500); 
}