//inicio
function alertStart(){
    if(Cookies.get('auth')){
        $('.background').fadeIn(500);
    }else{
        logout();
    }
}

//fim
function alertEnd(){
    $('.alert').css('top',`calc(50% - calc(${$('.alert').css('height')} / 2))`);
    if(!isMobile()){
        $('.alert').css('left',`calc(50% - calc(${$('.alert').css('width')} / 2) + calc(${$('.menu').css('width')} / 2))`);
    }
    $('.alert').fadeIn(500);
}

//fechar
function alertClose(){
    $('.alert').fadeOut(500);
    $('.background').fadeOut(500);
}

//principal
function alert(type,color,data){
    return new Promise(callback => {
        console.log(type)
        alertStart();
        if(type == 'message'){
            $('.alert').html(`
                <div class="alert__title ${color}" style="margin-bottom:0;border-radius:1vh;">${data}</div>
            `);
            setTimeout(function(){
                alertClose();
            },2000);
        }else if(type == 'alert'){
            var body = '';
            $(data).each(function(){
                body += `<div class="alert__text bold">${this}</div>`;
            });
            $('.alert').html(`
                <div class="alert__title ${color}">Erro</div>
                ${body}
                <div class="alert__button">
                    <button code="close"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z"/></svg>Fechar</button>
                </div>
            `);
            $('.alert__button button[code="close"]').on('click',function(){
                alertClose();
            });
        }else if(type == 'confirm'){
            var body = '';
            $(data.itens).each(function(){
                body += `<div class="alert__text bold">${this}</div>`;
            });
            $('.alert').html(`
                <div class="alert__title ${color}">${data.title}</div>
                <div class="alert__text">${data.text}</div>
                ${body}
                <div class="alert__button">
                    <button code="yes" class="${color}">${data.title == 'Excluir' ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>' : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M470.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L192 338.7 425.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>'}Sim</button>
                    <button code="no"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z"/></svg>Não</button>
                </div>
            `);
            $('.alert__button button[code="no"]').on('click',function(){
                alertClose();
                callback(false);
            });
            $('.alert__button button[code="yes"]').on('click',function(){
                $('.alert').fadeOut(500);
                setTimeout(function(){
                    callback(true);
                },500);
            });
        }
        alertEnd();
    });
}