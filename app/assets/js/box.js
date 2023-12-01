//inicio
function boxStart(){
    if(Cookies.get('auth')){
        $('.box').show();
        $('.background').fadeIn(500);
        $('.box .box__background').show();
        $('.box .loading').show();
        $('.box .box__main').html('');
        $('.box').css('right','0');
        $('.box').css('height',`${window.innerHeight}`);
    }else{
        logout();
    }
}

//fim
function boxEnd(){
    $('.box__body').css('height',`calc(${window.innerHeight}px - ${isMobile() ? '7vh' : '6vh'})`);
    setTimeout(function(){
        $('.box .box__background').fadeOut(500);
        $('.box .loading').fadeOut(500);
    },500);
    $('.background').on('click',function(){
        boxClose();
    });
    $('.box .box__close').on('click',function(){
        boxClose();
    });
    $('.box #close').on('click',function(){
        boxClose();
    });
}

//fechar
function boxClose(){
    if($('.menumobile').is(':hidden')){
        $('.box').css('right','-50vh');
    }else{
        $('.box').css('right','-100%');
    }
    $('.background').fadeOut(500);
}

//principal
async function box(type,attr){
    boxStart();
    if(type == 'settings'){
        $('.box__main').html(`
            <div class="box__title">Definições<div class="box__close"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z"/></svg></div></div>
            <div class="box__body">
                <div class="box__div box__div2">
                    <div class="box__div__100">
                        <div class="box__name">Theme</div>
                        <div class="box__option" type="theme" code="theme-light">
                            <div><div></div></div>Light
                        </div>
                        <div class="box__option" type="theme" code="theme-dark">
                            <div><div></div></div>Dark
                        </div>
                    </div>
                    <div class="box__div__100">
                        <div class="box__name">Menu</div>
                        <div class="box__option" type="menu" code="menu-light">
                            <div><div></div></div>Light
                        </div>
                        <div class="box__option" type="menu" code="menu-dark">
                            <div><div></div></div>Dark
                        </div>
                        <div class="box__option" type="menu" code="menu-color">
                            <div><div></div></div>Color
                        </div>
                        <div class="box__option" type="menu" code="menu-gradient">
                            <div><div></div></div>Gradient
                        </div>
                    </div>
                </div>
            </div>
        `);
        $(`.box__option[type="theme"][code="${$('#theme').attr('href').replace('./assets/css/','').replace('.css','')}"]`).find('div div').addClass('active');
        $(`.box__option[type="menu"][code="${$('#menu').attr('href').replace('./assets/css/','').replace('.css','')}"]`).find('div div').addClass('active');
        $('.box__option').on('click',function(){
            $(`#${$(this).attr('type')}`).attr('href',`./assets/css/${$(this).attr('code')}.css`);
            Cookies.set($(this).attr('type'),$(this).attr('code'),{expires:30});
            $(`.box__option[type="${$(this).attr('type')}"] div div`).removeClass('active');
            $(this).find('div div').addClass('active');
        });
        boxEnd();
    }else if(type == 'filter'){
        $('.box__main').html(`
            <div class="box__title">Filtrar<div class="box__close"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z"/></svg></div></div>
            <div class="box__body">
                <div class="box__div"></div>
                <div class="box__buttons">
                    <button code="filter" class="green"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M3.9 54.9C10.5 40.9 24.5 32 40 32H472c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9V448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6V320.9L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z"/></svg>Filtrar</button>
                    <button code="clean" class="red"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>Limpar</button>
                </div>
            </div>
        `);
        $.each(window.varData.get.filter,function(key,val){
            $('.box .box__div').append(`
                <div class="box__div__100">
                    <div class="box__name">${val.name}</div>
                    <div class="box__input">
                        ${val.type == 'select' ? `
                        <select id="box_${key}"></select>
                        ` : val.type == 'multiple' ? `
                        <select id="box_${key}" multiple></select>
                        ` : val.type == 'date' || val.type == 'expires_in' ? `
                        <input type="text" id="box_${key}" value="${window.varData.get.call[key].value}" readonly />
                        ` : '' }
                    </div>
                </div>
            `);
            if(val.type == 'select'){
                var code = key;
                $(val.options).each(function(){
                    $(`.box #box_${code}`).append(`
                        <option value="${this.value}" ${window.varData.get.call[code].value == this.value ? 'selected' : ''}>${this.name}</option>
                    `);
                });
            }
            if(val.type == 'multiple'){
                var code = key;
                $(val.options).each(function(){
                    let value = this.value;
                    let selected = '';
                    $(window.varData.get.call[code].value).each(function(){
                        if(this==value){
                            selected = 'selected';
                        }
                    });
                    $(`.box #box_${code}`).append(`
                        <option value="${this.value}" ${selected}>${this.name}</option>
                    `);
                });
            }
        });
        let datepicker = {
            "locale": {
                "format": "DD/MM/YYYY",
                "separator": " - ",
                "applyLabel": "Aplicar",
                "cancelLabel": "Cancelar",
                "fromLabel": "De",
                "toLabel": "Até",
                "customRangeLabel": "Custom",
                "daysOfWeek": ["D","S","T","Q","Q","S","S"],
                "monthNames": ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],
                "firstDay": 0
            }
        };
        $('.box #box_date').daterangepicker(datepicker);
        $('.box #box_expires_in').daterangepicker(datepicker);
        $('.box button[code="filter"]').on('click',function(){
            let attr = {};
            $.each(window.varData.get.filter,function(key,val){
                attr[key] = $(`#box_${key}`).val();
            });
            if(window.varData.get.subid){
                get([window.varData.get.id,window.varData.get.subid],{...getCall(), ...attr, page: 1});
            }else{
                get([window.varData.get.id],{...getCall(), ...attr, page: 1});
            }
            boxClose();
        });
        $('.box button[code="clean"]').on('click',function(){
            let attr = {};
            $.each(window.varData.get.filter,function(key,val){
                attr[key] = window.varData.get.call[key].default;
            });
            if(window.varData.get.subid){
                get([window.varData.get.id,window.varData.get.subid],{...getCall(), ...attr, page: 1});
            }else{
                get([window.varData.get.id],{...getCall(), ...attr, page: 1});
            }
            boxClose();
        });
        boxEnd();
    }else if(type == 'list'){
        let options = '';
        console.log(attr)
        $(attr.options).each(function(){
            if(attr.box=='text'){
                options += `<div class="box__div__100"><div class="box__list ${attr.selected==this.value/*attr.selected.includes(this.value)*/ ? 'active' : ''}" name="${this.name}" value="${this.value}" ${attr.name=='Serviço'?`total="${this.total}"`:''}>${this.name}</div></div>`
            }else if(attr.box=='color'){
                options += `<div class="box__div__100"><div class="box__list ${attr.selected==this.value/*attr.selected.includes(this.value)*/ ? 'active' : ''}" name="${this.name}" value="${this.value}" style="padding-left: 5vh;"><div class="box__color" style="background-color:${this.value}"></div>${this.name}</div></div>`
            }else if(attr.box=='font'){
                options += `<div class="box__div__100"><div class="box__list ${attr.selected==this.value/*attr.selected.includes(this.value)*/ ? 'active' : ''}" name="${this.name}" value="${this.value}" style="font-family:${this.value}">${this.name}</div></div>`
            }else if(attr.box=='size'){
                options += `<div class="box__div__100"><div class="box__list ${attr.selected==this.value/*attr.selected.includes(this.value)*/ ? 'active' : ''}" name="${this.name}" value="${this.value}" style="font-size:${this.value}">${this.name}</div></div>`
            }else if(attr.box=='case'){
                options += `<div class="box__div__100"><div class="box__list ${attr.selected==this.value/*attr.selected.includes(this.value)*/ ? 'active' : ''}" name="${this.name}" value="${this.value}" style="text-transform:${this.value}">${this.name}</div></div>`
            }else if(attr.box=='style'){
                options += `<div class="box__div__100"><div class="box__list ${attr.selected==this.value/*attr.selected.includes(this.value)*/ ? 'active' : ''}" name="${this.name}" value="${this.value}" style="${this.value.replace('normal','font-weight:normal;font-style:normal').replace('bold','font-weight:bold;font-style:normal').replace('italic','font-weight:normal;font-style:italic').replace('bolditalic','font-weight:bold;font-style:italic')}">${this.name}</div></div>`
            }
        });
        $('.box__main').html(`
            <div class="box__title">${attr.name}<div class="box__close"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z"/></svg></div></div>
            <div class="box__body">
                <div class="box__div box__div2">
                    <div class="box__search">
                        <input type="text" id="box__search" placeholder="Buscar em ${attr.name.toLowerCase()}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352c79.5 0 144-64.5 144-144s-64.5-144-144-144S64 128.5 64 208s64.5 144 144 144z"/></svg>
                    </div>
                    <div class="box__div__100"><div class="box__list__text">Escolha uma das opções abaixo</div></div>
                    ${options}
                </div>
            </div>
        `);
        $('#box__search').keyup(function(){
            let search = $(this).val().toLowerCase();
            $('.box__list').each(function(){
                if($(this).text().toLowerCase().indexOf(search)=='-1'){
                    $(this).parent().hide();
                }else{
                    $(this).parent().show();
                }
            });
            if($('.box__list').parent(':visible').length==0){
                $('.box__list__text').text('Nenhum resultado encontrado');
            }else{
                $('.box__list__text').text('Escolha uma das opções abaixo');
            }
        });
        $('.box__list').on('click',function(){
            $(`#${attr.id}`).attr('value',$(this).text());
            $(`#${attr.id}`).attr('val',$(this).attr('value'));
            $(`#${attr.id}`).next().css('background-color',$(this).children('.box__color').css('background-color'));
            if(attr.name=='Serviço'){
                $(`#${attr.id.replace('services','price')}`).attr('value',$(this).attr('total'));
            }
            boxClose();
        });
        boxEnd();
    }else if(type == 'status'){
        console.log(attr)
        let options = '';
        for(i=0;i<Object.keys(attr.options).length;i++){
            const status = Object.entries(attr.options).find(el => el[1].rank==(i+1));
            options += `
                <div class="box__div__100">
                    <div class="box__list ${attr.selected.includes(status[1].name) ? 'active' : ''}" value="${status[0]}">${status[1].image}${status[1].name}</div>
                    ${status[0]=='sent' ? `
                    <div class="box__input" style="display:none;margin-top:0.5vh;"><input type="text" id="tracker" value="${attr.tracker}" maxlength="13" placeholder="Digite o código de rastreio. Ex: SE123456789BR" style="background-color:var(--background3);"></div>
                    ` : ''}
                </div>
            `;
        }
        $('.box__main').html(`
            <div class="box__title">Status<div class="box__close"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z"/></svg></div></div>
            <div class="box__body">
                <div class="box__div">
                    <div class="box__div__100"><div class="box__list__text">Escolha uma das opções abaixo</div></div>
                    ${options}
                </div>
                <div class="box__buttons">
                    <button code="save" class="green"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941zM224 416c-35.346 0-64-28.654-64-64 0-35.346 28.654-64 64-64s64 28.654 64 64c0 35.346-28.654 64-64 64zm96-304.52V212c0 6.627-5.373 12-12 12H76c-6.627 0-12-5.373-12-12V108c0-6.627 5.373-12 12-12h228.52c3.183 0 6.235 1.264 8.485 3.515l3.48 3.48A11.996 11.996 0 0 1 320 111.48z"/></svg>Salvar</button>
                    <button code="cancel" class="red"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 352 512"><path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"/></svg>Cancelar</button>
                </div>
            </div>
        `);
        if($('.box__list.active').attr('value')=='sent'){
            $('#tracker').parent().show();
        }
        $('.box__list').on('click',function(){
            $('.box__list').removeClass('active');
            $(this).addClass('active');
            if($(this).attr('value')=='sent'){
                $('#tracker').parent().show();
            }else{
                $('#tracker').parent().hide();
            }
        });
        $('.box__buttons button[code="save"]').on('click',async function(){
            $('.box__background').fadeIn(500);
            $('.loading').fadeIn(500);
            const verify = await databasePut({status: $('.box__list.active').attr('value'), tracker: $('#tracker').val()},[attr.id]);
            if(verify && verify.sts==200 && verify.email){
                var data = {
                    account: JSON.parse(Cookies.get('auth')).account,
                    from: {email: verify.email.from_email, name: verify.email.from_name},
                    to: [{email: verify.order.email, name: verify.order.name}],
                    subject: verify.email.subject,
                    body: verify.email.body
                };
                $.post('https://api.mimi.doitweb.com.br/email',data);
            }
            if(window.varData.get.subid){
                get([window.varData.get.id,window.varData.get.subid]);
            }else{
                get([window.varData.get.id]);
            }
            boxClose();
        });
        $('.box__buttons button[code="cancel"]').on('click',function(){
            boxClose();
        });
        boxEnd();
    }else if(type == 'tracker'){
        $('.box__main').html(`
            <div class="box__title">Rastreio<div class="box__close"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z"/></svg></div></div>
            <div class="box__body">
                <div class="box__div">
                    <div class="box__div__100"><div class="box__list__text">Adicione o código de rastreio</div></div>
                    <div class="box__div__100"><div class="box__input"><input type="text" id="tracker" value="${attr.tracker}" maxlength="13" placeholder="SE123456789BR"></div></div>
                </div>
                <div class="box__buttons">
                    <button code="save" class="green"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941zM224 416c-35.346 0-64-28.654-64-64 0-35.346 28.654-64 64-64s64 28.654 64 64c0 35.346-28.654 64-64 64zm96-304.52V212c0 6.627-5.373 12-12 12H76c-6.627 0-12-5.373-12-12V108c0-6.627 5.373-12 12-12h228.52c3.183 0 6.235 1.264 8.485 3.515l3.48 3.48A11.996 11.996 0 0 1 320 111.48z"/></svg>Salvar</button>
                    <button code="cancel" class="red"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 352 512"><path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"/></svg>Cancelar</button>
                </div>
            </div>
        `);
        $('.box__buttons button[code="save"]').on('click',async function(){
            $('.box__background').fadeIn(500);
            $('.loading').fadeIn(500);
            const verify = await databasePut({status: 'sent', tracker: $('#tracker').val()},[window.varData.set.id]);
            console.log(verify)
            if(verify && verify.sts==200 && verify.email){
                var data = {
                    account: JSON.parse(Cookies.get('auth')).account,
                    from: {email: verify.email.from_email, name: verify.email.from_name},
                    to: [{email: verify.order.email, name: verify.order.name}],
                    subject: verify.email.subject,
                    body: verify.email.body
                };
                $.post('https://api.mimi.doitweb.com.br/email',data);
            }
            if(window.varData.get.subid){
                get([window.varData.get.id,window.varData.get.subid]);
            }else{
                get([window.varData.get.id]);
            }
            boxClose();
        });
        $('.box__buttons button[code="cancel"]').on('click',function(){
            boxClose();
        });
        boxEnd();
    }else if(type == 'bulk'){
        const database = await databaseGet({custom: attr.type,items: attr.items});
        let title = '<div class="box__grid__title">Nome</div>';
        let columns = '40% ';
        let i = 1;
        $.each(database.fields,function(key,val){
            title += `<div class="box__grid__title" ${i==Object.keys(database.fields).length ? 'style="border-right:0;"' : ''}>${val.name}${val.required ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M192 32c17.7 0 32 14.3 32 32V199.5l111.5-66.9c15.2-9.1 34.8-4.2 43.9 11s4.2 34.8-11 43.9L254.2 256l114.3 68.6c15.2 9.1 20.1 28.7 11 43.9s-28.7 20.1-43.9 11L224 312.5V448c0 17.7-14.3 32-32 32s-32-14.3-32-32V312.5L48.5 379.4c-15.2 9.1-34.8 4.2-43.9-11s-4.2-34.8 11-43.9L129.8 256 15.5 187.4c-15.2-9.1-20.1-28.7-11-43.9s28.7-20.1 43.9-11L160 199.5V64c0-17.7 14.3-32 32-32z"/></svg>` : ''}</div>`;
            columns += `${val.width}% `;
            i++;
        });
        let items = '';
        $(database.results).each(function(){
            items += `
                <div class="box__grid__name" code="${this.id}">
                    ${this.image ? `
                    <div class="box__grid__image">
                        <img src="https://img.mimi.doitweb.com.br/${this.image}?w=100">
                        <img src="https://img.mimi.doitweb.com.br/${this.image}?w=100"> 
                    </div>
                    ` : ''}
                    <p>${this.name}</p>
                </div>
            `;
            let item = this;
            let i = 1;
            $.each(database.fields,function(key,val){
                let subitems = '';
                $.each(item[key],function(key2,val2){
                    subitems += `${subitems ? '<hr>' : ''}<input type="${val.input.type}" id="${key2}-${key}" value="${val.input.prev?val.input.prev:''}${val.input.mask=='price' ? parseFloat(val2).toLocaleString('pt-br',{minimumFractionDigits: 2, maximumFractionDigits: 2}) : val2}${val.input.next?val.input.next:''}" mask="${val.input.mask}" ${val.input.length ? `maxlength="${val.input.length}"` : ''} ${val.disabled ? 'disabled' : ''}>`;
                });
                items += `<div class="box__grid__input ${val.disabled ? '' : 'on'}" code="${item.id}" ${i==Object.keys(database.fields).length ? 'style="border-right:0;"' : ''}>${subitems}</div>`;
                i++;
            });
        });
        let all = '';
        let columnsAll = '';
        j = 0;
        $.each(database.fields,function(key,val){
            if(!val.disabled){
                all += `<div class="box__grid__title" style="border-top:0;line-height:100%;"><p>${val.name}</p></div>`;
                all += `<div class="box__grid__input" style="border-top:0;" ${i==Object.keys(database.fields).length ? 'style="border-right:0;"' : ''}"><input type="${val.input.type}" class="all" id="${key}-all" value="${val.value}" mask="${val.input.mask}" ${val.input.length ? `maxlength="${val.input.length}"` : ''}></div>`;
                j++;
            }
        });
        for(i=0;i<j;i++){
            columnsAll += `${50/j}% ${50/j}% `;
        }
        $('.box__main').html(`
            <div class="box__title">${attr.name}<div class="box__close"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z"/></svg></div></div>
            <div class="box__body">
                <div class="box__div">
                    <div class="box__div__100"><div class="box__list__text">Alterar todos</div></div>
                    <div class="box__grid" style="grid-template-columns: ${columnsAll}">
                        ${all}
                    </div>
                    <div class="box__div__100"><div class="box__list__text">Alterar individualmente</div></div>
                    <div class="box__grid" style="grid-template-columns: ${columns}">
                        ${title}
                        ${items}
                    </div>
                </div>
                <div class="box__buttons">
                    <button code="save" class="green"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941zM224 416c-35.346 0-64-28.654-64-64 0-35.346 28.654-64 64-64s64 28.654 64 64c0 35.346-28.654 64-64 64zm96-304.52V212c0 6.627-5.373 12-12 12H76c-6.627 0-12-5.373-12-12V108c0-6.627 5.373-12 12-12h228.52c3.183 0 6.235 1.264 8.485 3.515l3.48 3.48A11.996 11.996 0 0 1 320 111.48z"/></svg>Salvar</button>
                    <button code="cancel" class="red"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 352 512"><path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"/></svg>Cancelar</button>
                </div>
            </div>
        `);
        $('input[mask="discount"]').maskMoney({allowNegative: false, allowZero: true, thousands:'', decimal:'', affixesStay: true, precision: 0, suffix: '%'});
        $('input[mask="quantity"]').maskMoney({allowNegative: false, allowZero: true, thousands:'', decimal:'', affixesStay: true, precision: 0, suffix: ' un'});
        $('input[mask="price"]').maskMoney({allowNegative: false, allowZero: true, thousands:'.', decimal:',', affixesStay: true, precision: 2, prefix: 'R$'});
        $('.box__grid__input input').on('click',function(){
            $(this).select();
        });
        $('.box__grid__input input[mask="discount"]').on('keyup',function(){
            if($(this).attr('id')!='discount-all'){
                $(`.box__grid__input input#${$(this).attr('id').split('-')[0]}-promotional`).val('R$'+parseFloat(database.results[database.results.findIndex(x => x.id ===$(this).parent().attr('code'))].price[$(this).attr('id').split('-')[0]]-(database.results[database.results.findIndex(x => x.id ===$(this).parent().attr('code'))].price[$(this).attr('id').split('-')[0]]*$(this).val().replace('%','')/100)).toLocaleString('pt-br',{minimumFractionDigits: 2, maximumFractionDigits: 2}));
            }
        });
        $('.box__grid__input .all').on('keyup',function(){
            const key = $(this).attr('id').split('-')[0];
            const val = $(this).val();
            $('.box__grid__input input').each(function(){
                if($(this).attr('id').split('-')[1]==key){
                    $(this).val(val);
                    if(key=='discount'){
                        $(`.box__grid__input input#${$(this).attr('id').split('-')[0]}-promotional`).val('R$'+parseFloat(database.results[database.results.findIndex(x => x.id ===$(this).parent().attr('code'))].price[$(this).attr('id').split('-')[0]]-(database.results[database.results.findIndex(x => x.id ===$(this).parent().attr('code'))].price[$(this).attr('id').split('-')[0]]*val.replace('%','')/100)).toLocaleString('pt-br',{minimumFractionDigits: 2, maximumFractionDigits: 2}));
                    }
                }
            });
        });
        $('.box__buttons button[code="save"]').on('click',async function(){
            let err = '';
            if(database.fields.price){
                
                $.each(database.results,function(key,val){
                    
                    $.each(val.variation,function(key2,val2){
                        console.log(`.box__grid__input input#${key2}`)
                        if(parseFloat($(`.box__grid__input input#${key2}-price`).val().replace('R$','').replaceAll('.','').replaceAll(',','.'))==0){
                            err = 'Preço não pode ser zero';
                        }else if(parseFloat($(`.box__grid__input input#${key2}-promotional`).val().replace('R$','').replaceAll('.','').replaceAll(',','.'))==0){
                            err = 'Promocional não pode ser zero';
                        }else if(parseFloat($(`.box__grid__input input#${key2}-promotional`).val().replace('R$','').replaceAll('.','').replaceAll(',','.'))>parseFloat($(`.box__grid__input input#${key2}-price`).val().replace('R$','').replaceAll('.','').replaceAll(',','.'))){
                            err = 'Promocional não pode ser maior que preço';
                        }
                    });
                });
            }
            if(!err){
                $('.box__background').fadeIn(500);
                $('.loading').fadeIn(500);
                var fields = {};
                fields.products = {};
                $('.box__grid__name').each(function(i){
                    let code = [$(this).attr('code')];
                    fields.products[code] = [];
                    let j = 0;
                    $.each(database.results[i].variation,function(key,val){
                        fields.products[code][j] = {};
                        fields.products[code][j].id = key;
                        j++;
                    });
                    $.each(fields.products[code],function(key,val){
                        $.each(database.fields,function(key2,val2){
                            if(val2.input.mask=='price'){
                                fields.products[code][fields.products[code].findIndex(x => x.id ===val.id)][key2] = (val2.input.prev ? $(`.box__grid__input input#${val.id}-${key2}`).val().replace(val2.input.prev,'') : val2.input.next ? $(`.box__grid__input input#${val.id}-${key2}`).val().replace(val2.input.next,'') : $(`.box__grid__input input#${val.id}-${key2}`).val()).replaceAll('.','').replaceAll(',','.');
                            }else{
                                fields.products[code][fields.products[code].findIndex(x => x.id ===val.id)][key2] = val2.input.prev ? $(`.box__grid__input input#${val.id}-${key2}`).val().replace(val2.input.prev,'') : val2.input.next ? $(`.box__grid__input input#${val.id}-${key2}`).val().replace(val2.input.next,'') : $(`.box__grid__input input#${val.id}-${key2}`).val();
                            }
                        });
                    });
                });
                const verify = await databasePut(fields,Object.keys(fields.products).map(key => key));
                if(verify){
                    if(window.varData.get.subid){
                        get([window.varData.get.id,window.varData.get.subid]);
                    }else{
                        get([window.varData.get.id]);
                    }
                    boxClose();
                }
            }else{
                $('.box__background').fadeIn(500).delay(2000).fadeOut(500);
                $('.loading').fadeIn(500).delay(2000).fadeOut(500);
                $('.box__alert').fadeIn(500).text(err).delay(2000).fadeOut(500);
            }
            
        });
        $('.box__buttons button[code="cancel"]').on('click',function(){
            boxClose();
        });
        boxEnd();
    }
}