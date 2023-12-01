//start
$(function(){
    window.varData = {get: null, set: null};
    setTimeout(function(){
        $('.footer__logo').fadeIn(500);
    },500);
    logged();
    theme();
    $.each(new Menu().items,function(key,val){
        if(key==='Configurations'){
            $.each(val.items,function(key2){
                $.getScript(`./config/pages/${key2.toLowerCase()}.js`);
            });
        }else{
            $.getScript(`./config/pages/${key.toLowerCase()}.js`);
        }
        $.getScript(`./config/pages/search.js`);
    });
});

//theme
function theme(){
    if(Cookies.get('theme')){
        $('#theme').attr('href',`./assets/css/${Cookies.get('theme')}.css`);
    }
    if(Cookies.get('menu')){
        $('#menu').attr('href',`./assets/css/${Cookies.get('menu')}.css`);
    }
}

//opening
function opening(header){
    $('title').text(window.title);
    $('link[rel="shortcut icon"]').attr('href',`${window.img}/200/mini.png`);
    if(header){
        $('main').attr('id',null);
        $('header').show();
        setTimeout(function(){
            get(['Dashboard']);
        },500);
        searchAll();
        let category;
        $.each(new Menu().items,function(key,val){
            if(val.category!=category){
                $('.menu .menu__list').append(`
                    <div class="menu__title">${val.category}</div>
                `);
                category = val.category;
            }
            let submenu = '';
            $.each(val.items,function(key,val){
                submenu += `
                    <div class="menu__item" submenu="${key}" onclick="${val.link}">
                        <div class="menu__div">
                            <div class="menu__name">${val.name}</div>
                        </div>
                    </div>
                `;
            });
            $(`.menu .menu__list`).append(`
                <div class="menu__item" menu="${key}" ${val.link ? `onclick="${val.link}"` : ''}>
                    <div class="menu__bar"></div>
                    <div class="menu__div">
                        <div class="menu__icon">${val.icon}</div>
                        <div class="menu__name">${val.name}</div>
                        ${val.numbers ? `<div class="menu__number">0</div>`: ''}
                        ${val.items ? `<div class="menu__arrow"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg></div>` : ''}
                    </div>
                </div>
                ${val.items ? `<div class="menu__subitem"><div class="menu__bar"></div>${submenu}</div>` : ''}
            `);
            if(val.mobile){
                $('.mobile .menu__list').append(`
                    <div class="menu__item ${key=='dashboard' ? 'active' : ''}" onclick="${val.link}">
                        <div class="menu__div">${val.icon}</div>
                        <div class="menu__name">${val.name}</div>
                    </div>
                `);
            }
            if(val.up){
                $('.menu__footer').append(`<div class="menu__footer__item" menu="${key}" onclick="${val.link}">${val.icon}${val.numbers ? `<div class="menu__footer__alert">0</div>` : ''}</div>`);
                $('.up .up__right').append(`<div class="up__item" menu="${key}" onclick="${val.link}">${val.icon}${val.numbers ? `<div class="up__alert">0</div>` : ''}</div>`);
            }
        });
        $('.mobile .menu__list').append(`
            <div class="menu__item" onclick="menuMobile()">
                <div class="menu__div"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 512"><path d="M64 360c30.9 0 56 25.1 56 56s-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56zm0-160c30.9 0 56 25.1 56 56s-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56zM120 96c0 30.9-25.1 56-56 56S8 126.9 8 96S33.1 40 64 40s56 25.1 56 56z"/></svg></div>
                <div class="menu__name">Menu</div>
            </div>
        `);
        menuSlide();
        var user = JSON.parse(Cookies.get('auth')).name.split(' ');
        $('.up__user .up__name').text(user[0]);
        $('.up__user .up__name').attr('codigo',JSON.parse(Cookies.get('auth')).user);
        $('.up__user .up__icon').text(user[0].substr(0,1));
        $('footer').fadeOut(500);        
    }else{
        $('main').attr('id','login');
        $.get(`./assets/js/login.js`);
        setTimeout(function(){
            $('footer').fadeOut(500);
            $('.loading').fadeOut(500);
        },2000);
    }
}

//validar CPF
function validateCPF(Objcpf) {
    var cpf = Objcpf.replace('.','').replace('-','');
    exp = /\.|\-/g
    cpf = cpf.toString().replace(exp, "");
    var digitoDigitado = eval(cpf.charAt(9) + cpf.charAt(10));
    var soma1 = 0,
    soma2 = 0;
    var vlr = 11;
    for(i = 0; i < 9; i++){
        soma1 += eval(cpf.charAt(i) * (vlr - 1));
        soma2 += eval(cpf.charAt(i) * vlr);
        vlr--;
    }
    soma1 = (((soma1 * 10) % 11) == 10 ? 0 : ((soma1 * 10) % 11));
    soma2 = (((soma2 + (2 * soma1)) * 10) % 11);
    var digitoGerado = (soma1 * 10) + soma2;
    if(digitoGerado != digitoDigitado){
        return false;
    }else{
        return true;
    }
}

//validar CNPJ
function validateCNPJ(ObjCnpj) {
    var cnpj = ObjCnpj.replace('.','').replace('-','').replace('/','');
    var valida = new Array(6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2);
    var dig1 = new Number;
    var dig2 = new Number;
    exp = /\.|\-|\//g
    cnpj = cnpj.toString().replace(exp, "");
    var digito = new Number(eval(cnpj.charAt(12) + cnpj.charAt(13)));
    for(i = 0; i < valida.length; i++){
        dig1 += (i > 0 ? (cnpj.charAt(i - 1) * valida[i]) : 0);
        dig2 += cnpj.charAt(i) * valida[i];
    }
    dig1 = (((dig1 % 11) < 2) ? 0 : (11 - (dig1 % 11)));
    dig2 = (((dig2 % 11) < 2) ? 0 : (11 - (dig2 % 11)));
    if(((dig1 * 10) + dig2) != digito){
        return false;
    }else{
        return true;
    }
}

//validar email
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

//search
function searchAll(){
    $('#searchall').focus();
    $('.up__search svg').on('click',function(){        
        get(['Search'],{search: $('#searchall').val()});
    });
    $('#searchall').on('keypress',function(e){
        var keycode = (e.keyCode ? e.keyCode : e.which);
        if(keycode == '13'){
            get(['Search'],{search: $('#searchall').val()});
        }
    });
}

//menu slide, mostra e esconde
function menuSlide(){
    $('.menu .menu__list>.menu__item').on('click',function(){
        if($(`.menu__subitem[submenu="${$(this).attr('menu')}"]`).css('display')=='none'){
            $(`.menu__subitem[submenu="${$(this).attr('menu')}"]`).slideDown(500);
            $(this).find('.menu__arrow').css('transform','rotate(180deg)');
        }else{
            $(`.menu__subitem[submenu="${$(this).attr('menu')}"]`).slideUp(500);
            $(this).find('.menu__arrow').css('transform','rotate(0deg)');
        }
    });
    $('.menubar').on('click',function(){
        if($('.menu').css('width') == '60px'){
            $('.menu').css('width','280px');
            $('.up').css({'width':'calc(100% - 280px)','left':'280px'});
            $('main').css({'width':'calc(100% - 280px)','left':'280px'});
            $('.menu__title').show();
            $('.menu__name').show();
            $('.menu__number').show();
            $('.menu__footer').show();
            $('.menu__list').css({'height':'calc(100% - 13vh)'});
            $('.menu__icon svg').css({'height':'1.5vh','width':'2vh'});
            $('.menu__logo').css('background-image','var(--logo)');
            $('.menu__subitem').removeClass('menu__subitem2');
        }else{
            $('.menu').css('width','60px');
            $('.up').css({'width':'calc(100% - 60px)','left':'60px'});
            $('main').css({'width':'calc(100% - 60px)','left':'60px'});
            $('.menu__title').hide();
            $('.menu__name').hide();
            $('.menu__subitem .menu__name').show();
            $('.menu__number').hide();
            $('.menu__footer').hide();
            $('.menu__list').css({'height':'calc(100% - 8vh)'});
            $('.menu__icon svg').css({'height':'2.5vh','width':'2.3vh'});
            $('.menu__logo').css('background-image','var(--mini)');
            $('.menu__subitem').addClass('menu__subitem2');
        }
    });
    $('.menu__item[menu]').hover(function(){
        let menu = $(this).attr('menu');
        $('.menu__item[menu]').each(function(){
            if($(this).attr('menu')!=menu&&$(this).next().attr('class')=='menu__subitem menu__subitem2'){
                $(this).next().fadeOut(500);
            }
        })
        if($(this).next().attr('class')=='menu__subitem menu__subitem2'){
            $(this).next().fadeIn(500);
        }
    });
    $('.up').hover(function(){
        $('.menu__subitem2').fadeOut(500);
    });
    $('main').hover(function(){
        $('.menu__subitem2').fadeOut(500);
    });
}

//mobile
function menuMobile(){
    if($('.menu').css('top') == '0px'){
        $('.menu').css('top','100%');
    }else{
        $('.menu').css('top','0');
    }
    $('.menu__close').on('click',function(){
        $('.menu').css('top','100%');
    });
}

//verifica se o conteúdo é maior que a tela, e ativa a scrollbar
function isScroll(){
    if(!isMobile()){
        if($('.main').get(0).scrollHeight > $('.main').height()){
            $('main').css('padding','0.5vh 0.7vh 0.5vh 1vh');
        }else{
            $('main').css('padding','0.5vh 1vh');
        }
    }
}

//verifica se é desktop ou mobile
function isMobile(){
    return screen.availHeight > screen.availWidth;
}

//funções ajax
jQuery.each(["put","delete"],function(i,method){
    jQuery[method]=function(url,data,callback,type){
        if(jQuery.isFunction(data)){
            type=type || callback;
            callback=data;
            data=undefined;
        }
        return jQuery.ajax({
            url: url,
            type: method,
            dataType: type,
            data: data,
            success: callback
        });
    };
});

//copia para área de transferência 
function copyClipboard(element){
    $(element).select();
    document.execCommand("copy");
}

//cria faixa de datas
function rangeDate(type=null){
    if(type=='expires_in'){
        return `${JSON.parse(Cookies.get('auth')).date} - ${new Date(new Date().setFullYear(new Date().getFullYear()+1)).toLocaleDateString('pt-BR')}`;
    }else if(type=='last7'){
        return `${new Date(new Date().setDate(new Date().getDate()-6)).toLocaleDateString('pt-BR')} - ${new Date().toLocaleDateString('pt-BR')}`;
    }else if(type=='last15'){
        return `${new Date(new Date().setDate(new Date().getDate()-14)).toLocaleDateString('pt-BR')} - ${new Date().toLocaleDateString('pt-BR')}`;
    }else if(type=='last30'){
        return `${new Date(new Date().setDate(new Date().getDate()-29)).toLocaleDateString('pt-BR')} - ${new Date().toLocaleDateString('pt-BR')}`;
    }else{
        return `${JSON.parse(Cookies.get('auth')).date} - ${new Date().toLocaleDateString('pt-BR')}`;
    }
}