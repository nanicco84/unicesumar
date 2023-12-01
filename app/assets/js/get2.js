//get
async function get(page,attr){
    isMobile() ? $('.menu').css('top','100%') : '';
    const verify = await databaseUnsaved();
    if(verify){
        $('main .main__background').fadeIn(500);
        $('#searchall').val('');
        const data = new window[page[0]](page[1]);
        window.varData = {get: data.get, set: null};
        await getConfigCall();
        if(attr){
            $.each(attr,function(key,val){
                window.varData.get.call[key].value = val;
            });
        }
        const database = await databaseGet();
        await getConfigFilter(database);
        setTimeout(function(){
            getTitle();
            if(!data.custom(database)){
                if(database.subtotal){
                    getList(database);
                }else{
                    getListNone(database);
                }
                data.customGet(database);
            }
            console.log(window.varData)
            console.log(database)
        },500);
    }
}

//monta call
async function getConfigCall(){
    const auth = JSON.parse(Cookies.get('auth'));
    let call = {
        user:       {value: auth.user,      default: auth.user},
        token:      {value: auth.token,     default: auth.token},
        account:    {value: auth.account,   default: auth.account},
        search:     {value: '',             default: ''},
        order:      {value: '`date` DESC',    default: '`date` DESC'},
        page:       {value: 1,              default: 1},
        limit:      {value: 20,             default: 20}
    };
    $.each(window.varData.get.call,function(key,val){
        call[key] = {value: val, default: val};
    });
    window.varData.get.call = call;
}

//monta filter com database
async function getConfigFilter(database){
    $.each(window.varData.get.filter,function(key,val){
        if(val.type=='select' || val.type=='multiple'){
            if(database[key]){
                window.varData.get.filter[key].options = val.options.concat(database[key]);
            }
        }
    });
}

//altera o titulo e no menu
function getTitle(){
    $('.menu__item').removeClass('active');
    $('.menu__item .menu__bar').removeClass('active');
    $('.menu__subitem .menu__bar').removeClass('active');
    $('.up__title').text(window.varData.get.texts.title);
    $(`.menu__item[menu="${window.varData.get.id}"]`).addClass('active');
    $(`.menu__item[menu="${window.varData.get.id}"]`).next().find(`.menu__item[submenu="${window.varData.get.subid}"]`).addClass('active');
    $(`.menu__item[submenu="${window.varData.get.id}"]`).addClass('active');
    $(`.menu__item[submenu="${window.varData.get.id}"]`).parent().prev().addClass('active');
    $(`.menu__item[menu="${window.varData.get.id}"] .menu__bar`).addClass('active');
    $(`.menu__item[menu="${window.varData.get.id}"]`).next('.menu__subitem').find('.menu__bar').addClass('active');
    $(`.menu__item[menu="${window.varData.get.id}"]`).next('.menu__subitem').find('.menu__bar').css('border-radius','0 0 0.5vh 0.5vh');
    $(`.menu__item[menu="${window.varData.get.id}"]`).next('.menu__subitem').find('.menu__bar').parent().prev().find('.menu__bar').css('border-radius','0.5vh 0.5vh 0 0');
    $(`.menu__item[submenu="${window.varData.get.id}"]`).parent().find('.menu__bar').addClass('active');
    $(`.menu__item[submenu="${window.varData.get.id}"]`).parent().prev().find('.menu__bar').addClass('active');
    $(`.menu__item[submenu="${window.varData.get.id}"]`).parent().find('.menu__bar').css('border-radius','0 0 0.5vh 0.5vh');
    $(`.menu__item[submenu="${window.varData.get.id}"]`).parent().prev().find('.menu__bar').css('border-radius','0.5vh 0.5vh 0 0');
    if($(`.menu__item[menu="${window.varData.get.id}"]`).next().css('display')=='none'){
        $(`.menu__item[menu="${window.varData.get.id}"]`).next().slideDown(500);
        $(`.menu__item[menu="${window.varData.get.id}"]`).find('.menu__arrow').css('transform','rotate(180deg)');
    }
    if($(`.menu__item[submenu="${window.varData.get.id}"]`).parent().css('display')=='none'){
        $(`.menu__item[submenu="${window.varData.get.id}"]`).parent().slideDown(500);
        $(`.menu__item[submenu="${window.varData.get.id}"]`).parent().prev().find('.menu__arrow').css('transform','rotate(180deg)');
    }
}

//lista sem resultados
function getList(database){
    let rowsTitle = '';
    if(!isMobile()){
        $.each(window.varData.get.columns,function(key,val){
            if(key=='status'){
                rowsTitle += `<div class="list__status"></div>`;
            }else if(key=='check'){
                rowsTitle += `<div class="list__check"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M374.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 178.7l-57.4-57.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l80 80c12.5 12.5 32.8 12.5 45.3 0l160-160zm96 128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 402.7 86.6 297.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l256-256z"/></svg></div>`;
            }else if(key=='date'){
                rowsTitle += `<div class="list__fields__item" style="width:${getWidth(val.width,'desktop')};" code="${key}"><span>${val.name}</span></div>`;
            }else if(key=='image'){
                rowsTitle += `<div class="list__actions__none fields" style="width:${getWidth(val.width,'desktop')};"></div>`;
            }else if(key=='rank'){
                rowsTitle += `<div class="list__fields__item" style="width:${getWidth(val.width,'desktop')};" code="${key}"><span>${val.name}</span></div>`;
            }else if(key=='edit'){
                rowsTitle += `<div class="list__actions__none fields"></div>`;
            }else if(key=='delete'){
                rowsTitle += `<div class="list__actions__none fields"></div>`;
            }else{
                rowsTitle += `<div class="list__fields__item" style="width:${getWidth(val.width,'desktop')}" code="${key}"><span>${val.name}</span></div>`;
            }
        });
    }
    let rows = ``;
    $(database.results).each(function(){
        let dataItem = this;
        let rowsItem = '';
        if(!isMobile()){
            $('.list__fields').show();
            $.each(window.varData.get.columns,function(key,val){
                if(key=='status'){
                    if(window.varData.get.endpoint=='orders'||window.varData.get.endpoint=='club'||window.varData.get.endpoint=='box'){
                        rowsItem += `<div class="list__status" style="height:6vh;"><div class="list__status__sts" style="cursor:default;background-color:${dataItem.status_background}"></div><div class="tip">${dataItem.status}</div></div>`;
                    }else{
                        rowsItem += `<div class="list__status" value="${dataItem.status}" onclick="getStatus(['${dataItem.id}'],'${dataItem.status=='on' ? 'off' : 'on'}');"><div class="list__status__sts ${dataItem.status == 'on' ? 'green' : 'red'}"><div></div></div></div>`;
                    }
                }else if(key=='check'){
                    rowsItem += `<div class="list__check"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M470.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L192 338.7 425.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg></div>`;
                }else if(key=='image'){
                    if(dataItem.image){
                        if(dataItem.image.indexOf('svg')==-1){
                            rowsItem += `<div class="list__image"><img src="${window.img}/${dataItem.image}?w=100"/><img src="${window.img}/${dataItem.image}?w=100"/></div>`;
                        }else{
                            rowsItem += `<div class="list__image">${dataItem.image}</div>`;
                        }
                    }else{
                        rowsItem += `<div class="list__image"><div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM323.8 202.5c-4.5-6.6-11.9-10.5-19.8-10.5s-15.4 3.9-19.8 10.5l-87 127.6L170.7 297c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6h96 32H424c8.9 0 17.1-4.9 21.2-12.8s3.6-17.4-1.4-24.7l-120-176zM112 192c26.5 0 48-21.5 48-48s-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48z"/></svg></div></div>`;
                    }
                }else if(key=='rank'){
                    rowsItem += `
                        <div class="list__flex" style="width:${getWidth(val.width,'desktop')};" rank="${dataItem[key]}">
                            <div class="list__actions" option="up"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M240.971 130.524l194.343 194.343c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667c-9.357 9.357-24.522 9.375-33.901.04L224 227.495 69.255 381.516c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667c-9.373-9.373-9.373-24.569 0-33.941L207.03 130.525c9.372-9.373 24.568-9.373 33.941-.001z"/></svg><div class="tip">Subir</div></div>
                            <div style="width:1vh"></div>
                            <div class="list__actions" option="down"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"/></svg><div class="tip">Descer</div></div>
                        </div>
                    `;
                }else if(key=='edit'){
                    rowsItem += `<div class="list__actions" option="edit"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z"/></svg><div class="tip">Editar</div></div>`;
                }else if(key=='delete'){
                    rowsItem += `<div class="list__actions" option="delete"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg><div class="tip">Excluir</div></div>`;
                }else{
                    rowsItem += `<div style="width:${getWidth(val.width,'desktop')}">`;
                    $.each(val.row,function(key2,val2){
                        if(val2.type=='array'){
                            $.each(dataItem[key2],function(key3,val3){
                                rowsItem += `
                                    <div class="list__text">
                                        <div ${val2.link ? `onclick="${val2.link.replace('value',val3.id)}"` : ''}>
                                            ${val3.image ? `
                                            <div class="list__mini">
                                                ${val3.image ? `
                                                <img src="${window.img}/${val3.image}?w=100"/>
                                                <img src="${window.img}/${val3.image}?w=100"/>
                                                ` : `
                                                <div>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM323.8 202.5c-4.5-6.6-11.9-10.5-19.8-10.5s-15.4 3.9-19.8 10.5l-87 127.6L170.7 297c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6h96 32H424c8.9 0 17.1-4.9 21.2-12.8s3.6-17.4-1.4-24.7l-120-176zM112 192c26.5 0 48-21.5 48-48s-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48z"/></svg>
                                                </div>
                                                `}
                                            </div>
                                            ` : ''}
                                            ${val3.status ? `
                                            <div class="list__sts" style="background-color:${val3.status=='on' ? 'limegreen' : 'red'}"></div>
                                            ` : ''}
                                            ${val3.color ? `
                                            <div class="list__color" style="background-color:${val3.color}"></div>
                                            ` : ''}
                                            <div>
                                                <p>${val2.text.indexOf('R$')!=-1 ? val2.text.replace('[text]',parseFloat(val3.name).toLocaleString('pt-br',{minimumFractionDigits: 2, maximumFractionDigits: 2})) : val2.text.indexOf('[upper]')!=-1 ? val2.text.replace('[text]',val3.name).replace('[upper]','').toUpperCase() : val2.text.indexOf('/')!=-1 ? val2.text.replace('[text]',val3.name).replace(val2.text.substring(val2.text.indexOf('('),val2.text.indexOf(')')+1),`${val3.name>1 ? val2.text.substring(val2.text.indexOf('(')+1,val2.text.indexOf(')')).split('/')[1] : val2.text.substring(val2.text.indexOf('(')+1,val2.text.indexOf(')')).split('/')[0]}`) : val2.text.replace('[text]',val3.name)}</p>
                                                ${val3.subname ? `<span>${val3.subname}</span>` : ''}
                                            </div>
                                        </div>
                                    </div>
                                `;
                            });
                        }else{
                            rowsItem += `
                                <div class="${val2.type=='bold' ? 'list__title' : 'list__text'}">
                                    <span ${val2.link ? `onclick="${val2.link.replace('id',dataItem.id).replace('value',dataItem[`${key2}_id`]).replace('name',dataItem[key2]).replace('table',dataItem.table)}"` : ''}>
                                        ${val2.text.indexOf('R$')!=-1 ? val2.text.replace('[text]',parseFloat(dataItem[key2]).toLocaleString('pt-br',{minimumFractionDigits: 2, maximumFractionDigits: 2})) : val2.text.indexOf('[upper]')!=-1 ? val2.text.replace('[text]',dataItem[key2]).replace('[upper]','').toUpperCase() : val2.text.indexOf('/')!=-1 ? val2.text.replace('[text]',dataItem[key2]).replace(val2.text.substring(val2.text.indexOf('('),val2.text.indexOf(')')+1),`${dataItem[key2]>1 ? val2.text.substring(val2.text.indexOf('(')+1,val2.text.indexOf(')')).split('/')[1] : val2.text.substring(val2.text.indexOf('(')+1,val2.text.indexOf(')')).split('/')[0]}`) : val2.text.replace('[text]',dataItem[key2])}
                                    </span>
                                </div>
                            `;
                        }
                    });
                    rowsItem += `</div>`;
                }
            });
        }else{
            $('.list__fields').show();
            let rowsSubItem = '';
            rowsItem = `<div class="list__info" style="width:${getWidth(100,'mobile')}">[rowsSubItem]</div>`;
            $.each(window.varData.get.columns,function(key,val){
                if(key=='status'){
                    if(window.varData.get.endpoint=='orders'||window.varData.get.endpoint=='club'||window.varData.get.endpoint=='box'){
                        rowsItem += `<div class="list__status" style="height:6vh;"><div class="list__status__sts" style="cursor:default;background-color:${dataItem.status_background}"></div><div class="tip">${dataItem.status}</div></div>`;
                    }else{
                        rowsItem += `<div class="list__status" value="${dataItem.status}" onclick="getStatus(['${dataItem.id}'],'${dataItem.status=='on' ? 'off' : 'on'}');"><div class="list__status__sts ${dataItem.status == 'on' ? 'green' : 'red'}"><div></div></div></div>`;
                    }
                }else if(key=='check'){
                    rowsItem += `<div class="list__check"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M470.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L192 338.7 425.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg></div>`;
                }else if(key=='image'){
                    if(dataItem.image){
                        if(dataItem.image.indexOf('svg')==-1){
                            rowsItem += `<div class="list__image"><img src="${window.img}/${dataItem.image}?w=100"/><img src="${window.img}/${dataItem.image}?w=100"/></div>`;
                        }else{
                            rowsItem += `<div class="list__image">${dataItem.image}</div>`;
                        }
                    }else{
                        rowsItem += `<div class="list__image"><div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM323.8 202.5c-4.5-6.6-11.9-10.5-19.8-10.5s-15.4 3.9-19.8 10.5l-87 127.6L170.7 297c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6h96 32H424c8.9 0 17.1-4.9 21.2-12.8s3.6-17.4-1.4-24.7l-120-176zM112 192c26.5 0 48-21.5 48-48s-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48z"/></svg></div></div>`;
                    }
                }else if(key=='rank'){
                    rowsItem += `
                        <div class="list__rank" style="width:${getWidth(val.width,'mobile')};" rank="${dataItem[key]}">
                            <div class="list__actions" option="up"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M240.971 130.524l194.343 194.343c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667c-9.357 9.357-24.522 9.375-33.901.04L224 227.495 69.255 381.516c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667c-9.373-9.373-9.373-24.569 0-33.941L207.03 130.525c9.372-9.373 24.568-9.373 33.941-.001z"/></svg></div>
                            <div style="width:1vh"></div>
                            <div class="list__actions" option="down"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"/></svg></div>
                        </div>
                    `;
                }else if(key=='edit'){
                    if(rowsItem.indexOf('list__buttons')==-1){
                        rowsItem += `<div class="list__buttons"><div class="list__actions" option="edit"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z"/></svg></div>[actions]</div>`;
                    }else{
                        rowsItem = rowsItem.replace('[actions]',`<div class="list__actions" option="edit"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z"/></svg></div>[actions]`);
                    }
                }else if(key=='delete'){
                    if(rowsItem.indexOf('list__buttons')==-1){
                        rowsItem += `<div class="list__buttons"><div class="list__actions" option="delete"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg></div>[actions]</div>`;
                    }else{
                        rowsItem = rowsItem.replace('[actions]',`<div class="list__actions" option="delete"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg></div>[actions]`);
                    }
                }else{
                    if(rowsItem.indexOf('list__info')==-1){
                        rowsItem += `<div class="list__info" style="width:${getWidth(100,'mobile')}">[rowsSubItem]</div>`;
                    }
                    $.each(val.row,function(key2,val2){
                        if(val2.type=='array'){
                            $.each(dataItem[key2],function(key3,val3){
                                if(val2.mobile){
                                    rowsSubItem += `
                                        <div class="list__text">
                                            <div ${val2.link ? `onclick="${val2.link.replace('value',val3.id)}"` : ''}>
                                                ${val3.image ? `
                                                <div class="list__mini">
                                                    ${val3.image ? `
                                                    <img src="${window.img}/${val3.image}?w=100"/>
                                                    <img src="${window.img}/${val3.image}?w=100"/>
                                                    ` : `
                                                    <div>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM323.8 202.5c-4.5-6.6-11.9-10.5-19.8-10.5s-15.4 3.9-19.8 10.5l-87 127.6L170.7 297c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6h96 32H424c8.9 0 17.1-4.9 21.2-12.8s3.6-17.4-1.4-24.7l-120-176zM112 192c26.5 0 48-21.5 48-48s-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48z"/></svg>
                                                    </div>
                                                    `}
                                                </div>
                                                ` : ''}
                                                ${val3.status ? `
                                                <div class="list__sts" style="background-color:${val3.status=='on' ? 'limegreen' : 'red'}"></div>
                                                ` : ''}
                                                ${val3.color ? `
                                                <div class="list__color" style="background-color:${val3.color}"></div>
                                                ` : ''}
                                                <div class="list__info">
                                                    <p>${val2.text.indexOf('R$')!=-1 ? val2.text.replace('[text]',parseFloat(val3.name).toLocaleString('pt-br',{minimumFractionDigits: 2, maximumFractionDigits: 2})) : val2.text.indexOf('[upper]')!=-1 ? val2.text.replace('[text]',val3.name).replace('[upper]','').toUpperCase() : val2.text.indexOf('/')!=-1 ? val2.text.replace('[text]',val3.name).replace(val2.text.substring(val2.text.indexOf('('),val2.text.indexOf(')')+1),`${val3.name>1 ? val2.text.substring(val2.text.indexOf('(')+1,val2.text.indexOf(')')).split('/')[1] : val2.text.substring(val2.text.indexOf('(')+1,val2.text.indexOf(')')).split('/')[0]}`) : val2.text.replace('[text]',val3.name)}</p>
                                                    ${val3.subname ? `<span>${val3.subname}</span>` : ''}
                                                </div>
                                            </div>
                                        </div>
                                    `;
                                }
                            });
                        }else{
                            if(val2.mobile){
                                rowsSubItem += `
                                    <div class="${val2.type=='bold' ? 'list__title' : 'list__text'}">
                                        <span ${val2.link ? `onclick="${val2.link.replace('id',dataItem.id).replace('value',dataItem[`${key2}_id`]).replace('name',dataItem[key2]).replace('table',dataItem.table)}"` : ''}>
                                            ${val2.text.indexOf('R$')!=-1 ? val2.text.replace('[text]',parseFloat(dataItem[key2]).toLocaleString('pt-br',{minimumFractionDigits: 2, maximumFractionDigits: 2})) : val2.text.indexOf('[upper]')!=-1 ? val2.text.replace('[text]',dataItem[key2]).replace('[upper]','').toUpperCase() : val2.text.indexOf('/')!=-1 ? val2.text.replace('[text]',dataItem[key2]).replace(val2.text.substring(val2.text.indexOf('('),val2.text.indexOf(')')+1),`${dataItem[key2]>1 ? val2.text.substring(val2.text.indexOf('(')+1,val2.text.indexOf(')')).split('/')[1] : val2.text.substring(val2.text.indexOf('(')+1,val2.text.indexOf(')')).split('/')[0]}`) : val2.text.replace('[text]',dataItem[key2])}
                                        </span>
                                    </div>
                                `;
                            }
                        }
                    });
                }
            });
            rowsItem = rowsItem.replace('[rowsSubItem]',rowsSubItem);
            rowsItem = rowsItem.replaceAll('[actions]','');
        }
        rows += `<div class="list__item" code="${dataItem.id}">${rowsItem}</div>`;
    });
    $('.main').html(`
        <div class="top">
            <div class="top__title">
                <div class="top__name">${window.varData.get.texts.title}</div>
                <div class="top__number">${database.total}</div>
            </div>
            <div class="top__options">
                <div class="top__search"><input type="text" id="search" placeholder="${window.varData.get.texts.search}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352c79.5 0 144-64.5 144-144s-64.5-144-144-144S64 128.5 64 208s64.5 144 144 144z"/></svg></div>
                <div class="top__filter"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M3.9 54.9C10.5 40.9 24.5 32 40 32H472c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9V448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6V320.9L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z"/></svg><span>Filtrar</span><div></div></div>
                ${window.varData.get.bulk ? `<div class="top__actions"><select id="actions" disabled>
                    <option value="" selected>Ações</option>
                </select></div>` : ''}
                ${window.varData.get.texts.add ? `<div class="top__add" onclick="set(${window.varData.get.subid ? `['${window.varData.get.id}','${window.varData.get.subid}']` : `['${window.varData.get.id}']`},0)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg><span>Adicionar</span></div>` : ''}
            </div>
        </div>
        <div class="list">
            <div class="list__fields">${rowsTitle}</div>
            <div class="list__alert">
                <div class="list__alert__background"></div>
                <div class="list__alert__text"></div>
            </div>
            ${rows}
            <div class="list__pages"></div>
        </div>
    `);
    getFilter();
    getPages(database.subtotal);
    getCheckbox();
    getSearch();
    getSort();
    isScroll();
    $('.list__actions').on('click',async function(){
        if($(this).attr('option')=='edit'){
            if(window.varData.get.subid){
                set([window.varData.get.id,window.varData.get.subid],$(this).parent().attr('code') ? $(this).parent().attr('code') : $(this).parent().parent().attr('code'));
            }else{
                set([window.varData.get.id],$(this).parent().attr('code') ? $(this).parent().attr('code') : $(this).parent().parent().attr('code'));
            }
        }else if($(this).attr('option')=='delete'){
            let verify = await alert('confirm','red',{title: 'Excluir', text: 'Tem certeza que deseja excluir?', itens: [$(this).parent().find('.list__title span').text() ? $(this).parent().find('.list__title span').text() : $(this).parent().parent().find('.list__title span').text()]});
            if(verify){
                verify = await databaseDelete([$(this).parent().attr('code') ? $(this).parent().attr('code') : $(this).parent().parent().attr('code')]);
                if(verify){
                    if(window.varData.get.subid){
                        get([window.varData.get.id,window.varData.get.subid]);
                    }else{
                        get([window.varData.get.id]);
                    }
                }
            }
        }else if($(this).attr('option')=='up'){
            const verify = await databasePut({rank: parseInt($(this).parent().attr('rank'))-1},[$(this).parent().parent().attr('code')]);
            if(verify){
                if(window.varData.get.subid){
                    get([window.varData.get.id,window.varData.get.subid]);
                }else{
                    get([window.varData.get.id]);
                }
            }
        }else if($(this).attr('option')=='down'){
            const verify = await databasePut({rank: parseInt($(this).parent().attr('rank'))+1},[$(this).parent().parent().attr('code')]);
            if(verify){
                if(window.varData.get.subid){
                    get([window.varData.get.id,window.varData.get.subid]);
                }else{
                    get([window.varData.get.id]);
                }
            }
        }
    });
    $.each(window.varData.get.bulk,function(key,val){
        $('#actions').append(`<option value="${key}">${val}</option>`);
    });
    $('main .main__background').fadeOut(500);
}

//lista sem resultados
function getListNone(database){
    if(!database.total){
        $('.main').html(`
            <div class="top">
                <div class="top__title">
                    <div class="top__name">${window.varData.get.texts.title}</div>
                </div>
            </div>
            <div class="none">
                <div class="none__info">
                    <div class="none__title">Não há ${window.varData.get.texts.title}!</div>
                    <div class="none__text">${window.varData.get.texts.register}</div>
                    ${window.varData.get.texts.add ? `<div class="none__button" onclick="set(${window.varData.get.subid ? `['${window.varData.get.id}','${window.varData.get.subid}']` : `['${window.varData.get.id}']`},0)"><button><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>${window.varData.get.texts.add}</button></div>` : ''}
                </div>
                <div class="none__image"></div>
            </div>
        `);
    }else{
        $('.main').html(`
            <div class="top">
                <div class="top__title">
                    <div class="top__name">${window.varData.get.texts.title}</div>
                    <div class="top__number">0</div>
                </div>
                <div class="top__options">
                    <div class="top__search"><input type="text" id="search" placeholder="${window.varData.get.texts.search}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352c79.5 0 144-64.5 144-144s-64.5-144-144-144S64 128.5 64 208s64.5 144 144 144z"/></svg></div>
                    <div class="top__filter"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M3.9 54.9C10.5 40.9 24.5 32 40 32H472c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9V448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6V320.9L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z"/></svg><span>Filtrar</span><div></div></div>
                    ${window.varData.get.bulk ? `<div class="top__actions"><select id="actions" disabled>
                        <option value="" selected>Ações</option>
                    </select></div>` : ''}
                    ${window.varData.get.texts.add ? `<div class="top__add" onclick="set(${window.varData.get.subid ? `['${window.varData.get.id}','${window.varData.get.subid}']` : `['${window.varData.get.id}']`},0)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg><span>Adicionar</span></div>` : ''}
                </div>
            </div>
            <div class="list">
                <div class="list__none">Nenhum resultado encontrado</div>
            </div>
        `);
        getFilter();
        getSearch();
    }
    $.each(window.varData.get.bulk,function(key,val){
        $('#actions').append(`<option value="${key}">${val}</option>`);
    });
    $('main .main__background').fadeOut(500);
}

//paginação dos resultados
function getPages(total){
    var page = parseInt(window.varData.get.call.page.value);
    var limit = parseInt(window.varData.get.call.limit.value);
    var total = parseInt(total);
    var prev = '';
    if(page-2 <= 0){
        var ini = 1;
    }else{
        var ini = page-2;
    }
    for(i=ini;i<page&&i>=1;i++){
        prev += `
            <div class="list__pages__item click" page="${i}">${i}</div>
        `;
    }
    var next = '';
    for(i=(page+1);i<(page+3)&&i<=Math.ceil(total/limit);i++){
        next += `
            <div class="list__pages__item click" page="${i}">${i}</div>
        `;
    }
    $('.list__pages').html(`
        <div class="list__pages__result">${!isMobile() ? 'Mostrando ' : ''}${((page-1)*limit)+1} a ${((page-1)*limit)+limit > total ? total : ((page-1)*limit)+limit} de ${total}</div>
        <div class="list__pages__list">
            ${page == 1 ? '' : `<div class="list__pages__item click" page="1">Primeira</div>`}
            ${prev}
            <div class="list__pages__item active">${page}</div>
            ${next}
            ${page == Math.ceil(total/limit) ? '' : `<div class="list__pages__item click" page="${Math.ceil(total/limit)}">Última</div>`}
        </div>
    `);
    $('.list__pages__item.click').on('click',function(){
        if(window.varData.get.subid){
            get([window.varData.get.id,window.varData.get.subid],{...getCall(), page: parseInt($(this).attr('page'))});
        }else{
            get([window.varData.get.id],{...getCall(), page: parseInt($(this).attr('page'))});
        }
    });
}

//ordenação dos resultados
function getSort(){
    var order = (window.varData.get.call.order.value).split(' ');
    $(`.list__fields__item[code="${order[0].replaceAll('`','')}"] span`).append(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M201.4 137.4c12.5-12.5 32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 205.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160z"/></svg>`);
    $(`.list__fields__item[code="${order[0].replaceAll('`','')}"] span svg`).css('transform',`${order[1] == 'ASC' ? 'rotate(0deg)' : 'rotate(180deg)'}`);
    $('.list__fields__item[code] span').on('click',function(){
        if($(this).children('svg').css('transform') == 'matrix(1, 0, 0, 1, 0, 0)'){
            if(window.varData.get.subid){
                get([window.varData.get.id,window.varData.get.subid],{...getCall(), order: `\`${$(this).parent().attr('code')}\` DESC`, page: 1});
            }else{
                get([window.varData.get.id],{...getCall(), order: `\`${$(this).parent().attr('code')}\` DESC`, page: 1});
            }
        }else{
            if(window.varData.get.subid){
                get([window.varData.get.id,window.varData.get.subid],{...getCall(), order: `\`${$(this).parent().attr('code')}\` ASC`, page: 1});
            }else{
                get([window.varData.get.id],{...getCall(), order: `\`${$(this).parent().attr('code')}\` ASC`, page: 1});
            }
        }
    });
}

//buscar dos resultados
function getSearch(){
    if(!isMobile()){
        $('#search').focus();
    }
    $('#search').val(window.varData.get.call.search.value);
    $('#search2').val(window.varData.get.call.search.value);
    if($('#search2').val() != ''){
        $('#search2 .top__search').css('width','100%');
        $('#search2').css({'width':'calc(100% - 3vh)','padding-left':'1vh'});
    }
    $('.top__search svg').on('click',function(){   
        if(isMobile()){
            $('.top__search').css('width','100%');
            $('#search2').css({'width':'calc(100% - 3vh)','padding-left':'1vh'});
            $('#search2').focus();
        }else{
            if(window.varData.get.subid){
                get([window.varData.get.id,window.varData.get.subid],{...getCall(), search: $('#search').val(), page: 1});
            }else{
                get([window.varData.get.id],{...getCall(), search: $('#search').val(), page: 1});
            }
        }
    });
    $('#search').on('keypress',function(e){
        var keycode = (e.keyCode ? e.keyCode : e.which);
        if(keycode == '13'){
            if(window.varData.get.subid){
                get([window.varData.get.id,window.varData.get.subid],{...getCall(), search: $('#search').val(), page: 1});
            }else{
                get([window.varData.get.id],{...getCall(), search: $('#search').val(), page: 1});
            }
        }
    });
    $('#search2').on('keypress',function(e){
        var keycode = (e.keyCode ? e.keyCode : e.which);
        if(keycode == '13'){
            if(window.varData.get.subid){
                get([window.varData.get.id,window.varData.get.subid],{...getCall(), search: $('#search2').val(), page: 1});
            }else{
                get([window.varData.get.id],{...getCall(), search: $('#search2').val(), page: 1});
            }
        }
    });
}

//filtrar resultados
function getFilter(){
    $('.top__filter').on('click',function(){
        box('filter');
    });
    $('.top__filter div').hide();
    $.each(window.varData.get.filter,function(key,val){
        if(window.varData.get.call[key].value != window.varData.get.call[key].default && key!='limit'){
            $('.top__filter div').show();
        }
    });
}

//gera call com filtros
function getCall(){
    let values = {};
    $.each(window.varData.get.call,function(key,val){
        if(key!='user'&&key!='token'&&key!='account'){
            values[key] = window.varData.get.call[key].value;
        }
    });
    return values;
}

//checkbox ações em massa
function getCheckbox(){
    $('.list__item .list__check').on('click',function(){
        if($(this).attr('class') == 'list__check'){
            $(this).addClass('active');
        }else{
            $(this).removeClass('active');
        }
        if($('.list__item .list__check.active').length > 0){
            $('.list__alert').slideDown();
            $('.list__alert__text').text(`${$('.list__item .list__check.active').length} ${$('.list__item .list__check.active').length > 1 ? 'itens selecionados' : 'item selecionado'}`);
            $('.top__actions').addClass('active');
            $('.top__actions select').attr('disabled',false);
        }else{
            $('.list__alert').slideUp();
            $('.top__actions').removeClass('active');
            $('.top__actions select').attr('disabled',true);
        }
        if($('.list__item .list__check.active').length < $('.list__item .list__check').length){
            $('.list__fields .list__check').removeClass('active');
        }
        if($('.list__item .list__check.active').length == $('.list__item .list__check').length){
            $('.list__fields .list__check').addClass('active');
        }
    });
    $('.list__fields .list__check').on('click',function(){
        if($(this).attr('class') == 'list__check'){
            $(this).addClass('active');
            $('.list__item .list__check').addClass('active');
            if($('.list__item .list__check.active').length > 0){
                $('.list__alert').slideDown();
                $('.list__alert__text').text(`${$('.list__item .list__check.active').length} ${$('.list__item .list__check.active').length > 1 ? 'itens selecionados' : 'item selecionado'}`);
                $('.top__actions').addClass('active');
                $('.top__actions select').attr('disabled',false);
            }
        }else{
            $(this).removeClass('active');
            $('.list__item .list__check').removeClass('active');
            $('.list__alert').slideUp();
            $('.top__actions').removeClass('active');
            $('.top__actions select').attr('disabled',true);
        }
    });
    $('.top__actions select').on('change',async function(){
        await getCheckboxAction($(this).val());
    });
}

//ações da checkbox
async function getCheckboxAction(type){
    $('.top__actions select').val('');
    let items = [];
    $('.list__item .list__check.active').each(function(){
        items.push($(this).parent().find('.list__title span').text());
    });
    let ids = [];
    $('.list__item .list__check.active').each(function(){
        ids.push($(this).parent().attr('code'));
    });
    console.log(type);
    if(type=='activate' || type=='deactivate' || type=='delete'){
        let verify = await alert('confirm',`${type=='activate' ? 'green' : type=='deactivate' ? 'red' : type=='delete' ? 'red' : ''}`,{title: `${type=='activate' ? 'Ativar' : type=='deactivate' ? 'Desativar' : type=='delete' ? 'Excluir' : ''}`, text: `${type=='activate' ? 'Tem certeza que deseja ativar?' : type=='deactivate' ? 'Tem certeza que deseja desativar?' : type=='delete' ? 'Tem certeza que deseja excluir?' : ''}`, itens: items});
        if(verify){
            if(type=='activate'){
                getStatus(ids,'on');
            }else if(type=='deactivate'){
                getStatus(ids,'off');
            }else if(type=='delete'){
                verify = await databaseDelete(ids);
                if(verify){
                    if(window.varData.get.subid){
                        get([window.varData.get.id,window.varData.get.subid]);
                    }else{
                        get([window.varData.get.id]);
                    }
                }
            }
        }
    }else{
        const attr = {type:type,name:$(`#actions option[value="${type}"]`).text(),items:ids};
        console.log(attr);
        box('bulk',attr);
    }
}

//mudanças de status
async function getStatus(ids,status){
    const verify = await databasePut({status: status},ids);
    if(verify){
        $('.list__fields .list__check').removeClass('active');
        $('.list__item .list__check').removeClass('active');
        $('.list__alert').slideUp();
        $('.top__actions').removeClass('active');
        $('.top__actions select').attr('disabled',true);
        $(ids).each(function(i,val){
            if(status == 'on'){
                $(`.list__item[code="${val}"] .list__status__sts`).removeClass('red');
                $(`.list__item[code="${val}"] .list__status__sts`).addClass('green');
            }else{
                $(`.list__item[code="${val}"] .list__status__sts`).removeClass('green');
                $(`.list__item[code="${val}"] .list__status__sts`).addClass('red');
            }
            $(`.list__item[code="${val}"] .list__status`).attr('onclick',`getStatus(['${val}'],'${status=='on' ? 'off' : 'on'}');`);
        });
    }
}

//calcula o width das colunas
function getWidth(width,display){
    if(display=='desktop'){
        if(width==='date'){
            return `80px`;
        }else if(width==='image'){
            return `6vh`;
        }else if(width==='rank'){
            return `70px`;
        }else{
            let total = 0,totalVH = 0,totalPX = 0;
            if(window.varData.get.columns.status){totalVH += 1.5;total++;}
            if(window.varData.get.columns.check){totalVH += 2.5;total++;}
            if(window.varData.get.columns.date){totalPX += 80;total++;}
            if(window.varData.get.columns.image){totalVH += 8;total++;}
            if(window.varData.get.columns.rank){totalPX += 70;total++;}
            if(window.varData.get.columns.edit){totalVH += 2.5;total++;}
            if(window.varData.get.columns.delete){totalVH += 2.5;total++;}
            return `calc(${width}% - ${totalPX/(Object.keys(window.varData.get.columns).length-total)}px - ${(totalVH+Object.keys(window.varData.get.columns).length-1)/(Object.keys(window.varData.get.columns).length-total)}vh)`;
        }
    }else if(display=='mobile'){
        if(width==='image'){
            return `6vh`;
        }else if(width==='rank'){
            return `2.5vh`;
        }else{
            let total = 0,totalVH = 0;
            if(window.varData.get.columns.status){totalVH += 1.5;total++;}
            if(window.varData.get.columns.check){totalVH += 2.5;total++;}
            if(window.varData.get.columns.image){totalVH += 6;total++;}
            if(window.varData.get.columns.rank){totalVH += 2.5;total++;}
            if(window.varData.get.columns.edit||window.varData.get.columns.delete){totalVH += 2.5;total++;}
            return `calc(${width}% - ${totalVH+total}vh)`;
        }
    }
}