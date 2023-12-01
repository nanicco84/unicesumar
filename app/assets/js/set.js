//set
async function set(page,id=0,tab){
    isMobile() ? $('.menu').css('top','100%') : '';
    $('main .main__background').fadeIn(500);
    const data = new window[page[0]](page[1]);
    window.varData = {get: data.get, set: null};
    await getConfigCall();
    window.varData.set = {};
    window.varData.set.id = id;
    let database = await databaseGet();
    await setConfig(database,data);
    setTimeout(function(){
        getTitle();
        setBody();
        data.customSet(database);
        if(tab){
            $(`.tab__item[code="${tab}"]`).trigger('click');
        }
        console.log(database)
        console.log(window.varData)
    },500);
    window.varCustom = data;
}

//config set
async function setConfig(database,data){
    window.varData.set.form = JSON.parse(JSON.stringify(data.set));
    window.varData.set.data = {}; 
    $.each(window.varData.set.form,function(key,val){
        if(val.type=='normal'){
            $.each(val.fields,function(key2,val2){
                if(database.results){
                    window.varData.set.data[key2] = database.results[key2];
                }else{
                    window.varData.set.data[key2] = val2.value;
                }
                if((val2.select) && database[key2]){
                    window.varData.set.form[key].fields[key2].select.options = window.varData.set.form[key].fields[key2].select.options.concat(database[key2]);
                }
                if((val2.list) && database[key2]){
                    window.varData.set.form[key].fields[key2].list.options = window.varData.set.form[key].fields[key2].list.options.concat(database[key2]);
                }
            });
        }else if(val.type=='multi' || val.type=='gallery'){
            window.varData.set.data[key] = [];
            if(database.results){
                let i = 0
                $.each(database.results[key],function(key2,val2){
                    window.varData.set.data[key][i] = {};
                    $.each(val.fields,function(key3,val3){
                        window.varData.set.data[key][i][key3] = val2[key3];
                    });
                    i++;
                });
            }
            $.each(val.fields,function(key2,val2){
                if(val2.select && database[key2]){
                    window.varData.set.form[key].fields[key2].select.options = window.varData.set.form[key].fields[key2].select.options.concat(database[key2]);
                }
                if(val2.list && database[key2]){
                    window.varData.set.form[key].fields[key2].list.options = window.varData.set.form[key].fields[key2].list.options.concat(database[key2]);
                }
            });
        }
    });
}

//corpo do set
function setBody(){
    if(isMobile()){
        $('.up__title').text(`${window.varData.set.id ? window.varData.set.data.name : window.varData.get.texts.add}`);
    }
    $('.main').html(`
        <div class="top">
            <div class="top__title">
                <div class="top__name">${window.varData.set.id ? window.varData.set.data.name : window.varData.get.texts.add}</div>
            </div>
            ${!isMobile() ? `
            <div class="top__options">
                <button class="top__return"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M48.5 224H40c-13.3 0-24-10.7-24-24V72c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2L98.6 96.6c87.6-86.5 228.7-86.2 315.8 1c87.5 87.5 87.5 229.3 0 316.8s-229.3 87.5-316.8 0c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0c62.5 62.5 163.8 62.5 226.3 0s62.5-163.8 0-226.3c-62.2-62.2-162.7-62.5-225.3-1L185 183c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8H48.5z"/></svg>Voltar</button>
            </div>
            ` : ''}
        </div>
        <div class="tab"></div>
        <div class="button">
            ${isMobile() ? `
            <button class="top__return"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M48.5 224H40c-13.3 0-24-10.7-24-24V72c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2L98.6 96.6c87.6-86.5 228.7-86.2 315.8 1c87.5 87.5 87.5 229.3 0 316.8s-229.3 87.5-316.8 0c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0c62.5 62.5 163.8 62.5 226.3 0s62.5-163.8 0-226.3c-62.2-62.2-162.7-62.5-225.3-1L185 183c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8H48.5z"/></svg>Voltar</button>
            ` : ''}
            <button code="salvar" class="green"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V173.3c0-17-6.7-33.3-18.7-45.3L352 50.7C340 38.7 323.7 32 306.7 32H64zm0 96c0-17.7 14.3-32 32-32H288c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V128zM224 416c-35.3 0-64-28.7-64-64s28.7-64 64-64s64 28.7 64 64s-28.7 64-64 64z"/></svg>Salvar</button>
            ${window.varData.set.id ? `
            <button code="deletar" class="red"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>Deletar</button>
            ` : ''}
        </div>
    `);
    setGroups();
    if(window.varData.set.data){
        setActions();
    }else{
        setActions();
    }
    $('main .main__background').fadeOut(500);    
}

//adciona os campos
function setGroups(){
    $.each(window.varData.set.form,function(key,val){
        $('.tab').append(`
            <div class="tab__item${key=='general' ? ' active' : ''}" code="${key}">${val.name}</div>
        `);
        $('.tab').after(`<div class="group${key=='general' ? ' active' : ''}" tab="${key}"></div>`);
        if(val.type=='normal'){
            $.each(val.fields,function(key2,val2){
                if(val2.name){
                    setItem(`[tab=${key}]`,key2,val2);
                }
            });
        }else if(val.type=='multi'){
            $(window.varData.set.data[key]).each(function(i){
                $(`.group[tab="${key}"]`).append(`
                    <div class="subgroup" tab="${key}-${i+1}"><div class="subgroup__form"></div></div>
                `);
                $.each(val.fields,function(key2,val2){
                    if(val2.name){
                        setItem(`[tab=${key}-${i+1}] .subgroup__form`,key2,val2,{id:key,i:i});
                    }
                });
                $(`[tab="${key}-${i+1}"]`).append(`
                    <div class="subgroup__options">
                        ${i==0 ? '<button class="none"></button>' : `<button onclick="setUp(this)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"/></svg><div class="tip">Subir</div></button>`}
                        ${i==window.varData.set.data[key].length-1 ? '<button class="none"></button>' : `<button onclick="setDown(this)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg><div class="tip">Descer</div></button>`}
                        <button onclick="setDel(this)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg><div class="tip">Excluir</div></button>
                    </div>
                `);
            });
            $(`[tab="${key}"]`).append(`
                <div class="group__button">
                    <button onclick="setAdd('${key}')"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>Adicionar</button>
                </div>
            `);
        }else if(val.type=='gallery'){
            $(`.group[tab="${key}"]`).append(`
                <div class="subgroup"></div>
            `);
            $(window.varData.set.data[key]).each(function(i){
                $.each(val.fields,function(key2,val2){
                    if(val2.name){
                        setItem(`[tab=${key}] .subgroup`,key2,val2,{id:key,i:i,type:'gallery'});
                    }
                });
            });
            $(`[tab="${key}"]`).append(`
            <div class="group__button">
                    <label for="${key}">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>Adicionar
                    <input type="file" name="image[]" id="${key}" accept="image/*" style="display:none" onchange="addFiles('${key}');" multiple/>
                    </label>
                </div>
            `);
            /*$(`[tab="${key}"]`).append(`
                <div class="item" style="width:10%;">
                    <div class="item__input">
                        <div class="item__image" id="${key}">
                            <div class="item__image__div noimage">
                                <div class="item__image__img"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M152 120c-26.51 0-48 21.49-48 48s21.49 48 48 48s48-21.49 48-48S178.5 120 152 120zM447.1 32h-384C28.65 32-.0091 60.65-.0091 96v320c0 35.35 28.65 64 63.1 64h384c35.35 0 64-28.65 64-64V96C511.1 60.65 483.3 32 447.1 32zM463.1 409.3l-136.8-185.9C323.8 218.8 318.1 216 312 216c-6.113 0-11.82 2.768-15.21 7.379l-106.6 144.1l-37.09-46.1c-3.441-4.279-8.934-6.809-14.77-6.809c-5.842 0-11.33 2.529-14.78 6.809l-75.52 93.81c0-.0293 0 .0293 0 0L47.99 96c0-8.822 7.178-16 16-16h384c8.822 0 16 7.178 16 16V409.3z"/></svg></div>
                                <form><input type="file" name="image[]" accept="image/*" style="display:none" multiple/></form>
                            </div>
                        </div>
                    </div>
                </div>
            `);*/
        }
    });
    if($('.tab__item').length==1){
        $('.tab').hide();
        $('.group').css({'border-radius':'1vh','margin-top':'1vh'});
    }
    setMasks();
}

//adiciona campo a campo no form
function setItem(tab,key,attr,multi){
    if(attr.image){
        if(multi && multi.type=='gallery'){
            let value = `${multi ? window.varData.set.data[multi.id][multi.i][key] ? window.varData.set.data[multi.id][multi.i][key] : '' : window.varData.set.data[key] ? window.varData.set.data[key] : ''}`;
            var image = `
                <div class="item__image" id="${key}${multi ? '-'+(multi.i+1) : ''}">
                    <div class="item__image__div move">
                        <div class="item__image__img"><img src="${window.img}/${value}?w=100"></div>
                        <div class="item__image__img"><img src="${window.img}/${value}?w=100"></div>
                        <div class="item__image__info">
                            <div class="item__image__del" onclick="delFiles('${multi.id}','${value}');"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg><div class="tip">Excluir</div></div>
                        </div>
                        <div class="item__image__rank">${multi.i+1}</div>
                    </div>
                </div>
            `;
        }else{
            let value = `${multi ? window.varData.set.data[multi.id][multi.i][key] ? window.varData.set.data[multi.id][multi.i][key] : '' : window.varData.set.data[key] ? window.varData.set.data[key] : ''}`;
            var image = `
                <div class="item__image">
                    ${!value ? `<label for="${key}${multi ? '-'+(multi.i+1) : ''}">` : ''}
                        <div class="item__image__div${!value ? ' addimages' : ''}">
                            <div class="item__image__img"><svg class="${value ? 'none' : ''}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M152 120c-26.51 0-48 21.49-48 48s21.49 48 48 48s48-21.49 48-48S178.5 120 152 120zM447.1 32h-384C28.65 32-.0091 60.65-.0091 96v320c0 35.35 28.65 64 63.1 64h384c35.35 0 64-28.65 64-64V96C511.1 60.65 483.3 32 447.1 32zM463.1 409.3l-136.8-185.9C323.8 218.8 318.1 216 312 216c-6.113 0-11.82 2.768-15.21 7.379l-106.6 144.1l-37.09-46.1c-3.441-4.279-8.934-6.809-14.77-6.809c-5.842 0-11.33 2.529-14.78 6.809l-75.52 93.81c0-.0293 0 .0293 0 0L47.99 96c0-8.822 7.178-16 16-16h384c8.822 0 16 7.178 16 16V409.3z"/></svg><img ${!value ? `class="none"` : ''} src="${value ? `${window.img}/${value}?w=100` : ''}"></div>
                            <div class="item__image__img"><img ${!value ? `class="none"` : ''} src="${value ? `${window.img}/${value}?w=100` : ''}"></div>
                            ${!attr.disabled ? `
                            <div class="item__image__info ${!value ? 'none': ''}">
                                <label for="${key}${multi ? '-'+(multi.i+1) : ''}" class="item__image__edt"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"/></svg><div class="tip">Alterar</div></label>
                                <div class="item__image__del" onclick="delFiles('${key}${multi ? '-'+(multi.i+1) : ''}','${value}');"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg><div class="tip">Excluir</div></div>
                            </div>
                            ` : ''}
                            <input type="file" name="image[]" id="${key}${multi ? '-'+(multi.i+1) : ''}" accept="image/*" style="display:none" onchange="${!value ? `addFiles('${key}${multi ? '-'+(multi.i+1) : ''}');` : `edtFiles('${key}${multi ? '-'+(multi.i+1) : ''}','${value}');`}" />
                        </div>
                    ${!value ? `</label>` : ''}
                </div>
            `;
        }
    }
    if(attr.select){
        var options = '';
        $(attr.select.options).each(function(){
            options += `<option value="${this.value}" ${multi ? window.varData.set.data[multi.id][multi.i][key] == this.value ? 'selected' : '' : window.varData.set.data[key] == this.value ? 'selected' : ''}>${this.name}</option>`;
        });
    }
    $(tab).append(`
        <div class="item${key=='custom' ? ' custom' : ''}" style="width:${attr.image&&attr.image.type=='multi' ? 'calc(10vh + 1.5vh)' : !isMobile() ? attr.width.desktop+'%' : attr.width.mobile+'%'};${!attr.name||(attr.width&&attr.width.desktop==0&&attr.width.mobile==0) ? 'visibility:hidden;padding:0;' : ''}">
            ${key=='custom' ? '' : `
            ${multi && multi.type=='gallery' ? '' : `
            <div class="item__name">
                <p>${attr.name}${multi ? ` ${(multi.i+1)}` : ''}${attr.required ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M192 32c17.7 0 32 14.3 32 32V199.5l111.5-66.9c15.2-9.1 34.8-4.2 43.9 11s4.2 34.8-11 43.9L254.2 256l114.3 68.6c15.2 9.1 20.1 28.7 11 43.9s-28.7 20.1-43.9 11L224 312.5V448c0 17.7-14.3 32-32 32s-32-14.3-32-32V312.5L48.5 379.4c-15.2 9.1-34.8 4.2-43.9-11s-4.2-34.8 11-43.9L129.8 256 15.5 187.4c-15.2-9.1-20.1-28.7-11-43.9s28.7-20.1 43.9-11L160 199.5V64c0-17.7 14.3-32 32-32z"/></svg>` : ''}</p>
                ${attr.input && attr.input.length ? `<p><span>${attr.input.length}</span> caracteres restantes</p>` : ''}
            </div>
            `}
            <div class="item__input">
                ${attr.select ? `
                <select id="${key}${multi ? '-'+(multi.i+1) : ''}" ${attr.disabled ? 'disabled' : ''}>${options}</select>
                ` : attr.input && attr.input.type == 'text' ? `
                ${attr.input.prev ? `<span class="item__prev">${attr.input.prev}</span>` : ''}
                <input type="${attr.input.type}" ${attr.input.prev ? 'class="item__prev"' : attr.input.next||attr.input.button ? 'class="item__next"' : ''} mask="${attr.input.mask}" id="${key}${multi ? '-'+(multi.i+1) : ''}" ${attr.input.length ? `maxlength="${attr.input.length}"` : ''} ${attr.input.holder ? `placeholder="${attr.input.holder}"` : ''} value="${multi ? window.varData.set.data[multi.id][multi.i][key]||window.varData.set.data[multi.id][multi.i][key]=='0' ? attr.input.mask=='price'||attr.input.mask=='weight' ? `${parseFloat(window.varData.set.data[multi.id][multi.i][key]).toLocaleString('pt-br',{minimumFractionDigits: attr.input.mask=='price' ? 2 : 3, maximumFractionDigits: attr.input.mask=='price' ? 2 : 3})}` : window.varData.set.data[multi.id][multi.i][key] : attr.input.mask=='price'||attr.input.mask=='weight' ? `0,00${attr.input.mask=='weight' ? '0' : ''}` : '' : window.varData.set.data[key] ? attr.input.mask=='price'||attr.input.mask=='weight' ? `${parseFloat(window.varData.set.data[key]).toLocaleString('pt-br',{minimumFractionDigits: attr.input.mask=='price' ? 2 : 3, maximumFractionDigits: attr.input.mask=='price' ? 2 : 3})}` : window.varData.set.data[key] : attr.input.mask=='price'||attr.input.mask=='weight' ? `0,00${attr.input.mask=='weight' ? '0' : ''}` : ''}"  ${attr.input.length ? `onKeyUp="setCharacter(this,${attr.input.length})"` : ''} ${attr.disabled ? 'disabled' : ''}>
                ${attr.input.next ? `<span class="item__next">${attr.input.next}</span>` : ''}
                ${attr.input.button ? `<button class="item__button" name="${attr.input.button}">${attr.input.button}</button>` : ''}
                ` : attr.input && attr.input.type == 'textarea' ? `
                <textarea id="${key}${multi ? '-'+(multi.i+1) : ''}" ${attr.input.holder ? `placeholder="${attr.input.holder}"` : ''} oninput="setHeight(this)" ${attr.input.length ? `onKeyUp="setCharacter(this,${attr.input.length})"` : ''} ${attr.disabled ? 'disabled' : ''}>${multi ? window.varData.set.data[multi.id][multi.i][key] ? window.varData.set.data[multi.id][multi.i][key] : '' : window.varData.set.data[key] ? window.varData.set.data[key] : ''}</textarea>
                ` : attr.input && attr.input.type == 'date' ? `
                <input type="${attr.input.type}" mask="${attr.input.mask}" id="${key}${multi ? '-'+(multi.i+1) : ''}" ${attr.input.holder ? `placeholder="${attr.input.holder}"` : ''} value="${multi ? window.varData.set.data[multi.id][multi.i][key] ? window.varData.set.data[multi.id][multi.i][key] : '' : window.varData.set.data[key] ? window.varData.set.data[key] : ''}" ${attr.disabled ? 'disabled' : ''}>
                ` : attr.list ? `
                <input type="list" id="${key}${multi ? '-'+(multi.i+1) : ''}" options="${JSON.stringify(attr.list.options).replaceAll('"','\'')}" box="${attr.list.type}" name="${attr.name}" ${attr.list.type=='color' ? `style="padding-left: 5vh"` : ''} val="${multi ? window.varData.set.data[multi.id][multi.i][key] ? window.varData.set.data[multi.id][multi.i][key] : '' : window.varData.set.data[key] ? window.varData.set.data[key] : ''}" value="${multi ? window.varData.set.data[multi.id][multi.i][key] ? attr.list.options[attr.list.options.findIndex(obj=>obj.value==window.varData.set.data[multi.id][multi.i][key])].name : '' : window.varData.set.data[key] ? attr.list.options[attr.list.options.findIndex(obj=>obj.value==window.varData.set.data[key])].name : ''}" readonly ${attr.disabled ? 'disabled' : ''}>${attr.list.type=='color' ? `<div class="item__color" style="background-color:${multi ? window.varData.set.data[multi.id][multi.i][key] ? window.varData.set.data[multi.id][multi.i][key] : '' : window.varData.set.data[key] ? window.varData.set.data[key] : ''}"></div>` : ''}
                ` : attr.image ? `
                ${image}
                ` : ''}
            </div>
            `}
        </div>
    `);
    if(attr.input && attr.input.length){
        setCharacter(document.getElementById(`${key}${multi ? '-'+(multi.i+1) : ''}`),attr.input.length);
    }
    if(attr.input && attr.input.type=='textarea'){
        setHeight(document.getElementById(`${key}${multi ? '-'+(multi.i+1) : ''}`));
    }
}

//ações add e edt
function setActions(){
    $('.tab__item').on('click',function(){
        $(`.group`).removeClass('active');
        $(`.group[tab="${$(this).attr('code')}"]`).addClass('active');
        $('.tab__item').removeClass('active');
        $(this).addClass('active');
    });
    $('.button button[code="deletar"]').on('click',async function(){
        let verify = await alert('confirm','red',{title: 'Excluir', text: 'Tem certeza que deseja excluir?', itens: [window.varData.set.data.name]});
        if(verify){
            verify = await databaseDelete([window.varData.set.id]);
            if(verify){
                if(window.varData.get.subid){
                    get([window.varData.get.id,window.varData.get.subid]);
                }else{
                    get([window.varData.get.id]);
                }
            }
        }
    });
    $('.button button[code="salvar"]').on('click',function(){
        databaseSave();
    });
    $('button.top__return').on('click',async function(){
        if(window.varData.get.subid){
            get([window.varData.get.id,window.varData.get.subid]);
        }else{
            get([window.varData.get.id]);
        }
    }); 
    $('input[type="list"]').on('click',function(){
        const attr = {id:$(this).attr('id'),name:$(this).attr('name'),box:$(this).attr('box'),selected:$(this).attr('val'),options:JSON.parse($(this).attr('options').replaceAll('\'','"'))};
        box('list',attr);
    });
}

//adicionar campos para multiplo cadastros
function setAdd(id){
    var qtd = $(`[tab=${id}] .subgroup__form`).length;
    $(`.group[tab="${id}"]`).append(`
        <div class="subgroup" tab="${id}-${qtd+1}"><div class="subgroup__form"></div></div>
    `);
    $.each(window.varData.set.form[id].fields,async function(key,val){
        if(val.image){
            /*var image = `
                <div class="item__image">
                    <div class="item__image__div${!val.value ? ' addimages' : ''}" code="${key}">
                        <div class="item__image__img"><svg class="${val.value ? 'none' : ''}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M152 120c-26.51 0-48 21.49-48 48s21.49 48 48 48s48-21.49 48-48S178.5 120 152 120zM447.1 32h-384C28.65 32-.0091 60.65-.0091 96v320c0 35.35 28.65 64 63.1 64h384c35.35 0 64-28.65 64-64V96C511.1 60.65 483.3 32 447.1 32zM463.1 409.3l-136.8-185.9C323.8 218.8 318.1 216 312 216c-6.113 0-11.82 2.768-15.21 7.379l-106.6 144.1l-37.09-46.1c-3.441-4.279-8.934-6.809-14.77-6.809c-5.842 0-11.33 2.529-14.78 6.809l-75.52 93.81c0-.0293 0 .0293 0 0L47.99 96c0-8.822 7.178-16 16-16h384c8.822 0 16 7.178 16 16V409.3z"/></svg><img ${!val.value ? `class="none"` : ''} src="${val.value ? `${window.img}/${val.value}?w=100` : ''}"></div>
                        <div class="item__image__img"><img ${!val.value ? `class="none"` : ''} src="${val.value ? `${window.img}/${val.value}?w=100` : ''}"></div>
                        <div class="item__image__info ${!val.value ? 'none': ''}">
                            <div class="item__image__edt"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"/></svg><div class="tip">Alterar</div></div>
                            <div class="item__image__del"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg><div class="tip">Excluir</div></div>
                        </div>
                        <form id="${key}-${qtd+1}"><input type="file" name="image[]" accept="image/*" style="display:none" /></form>
                    </div>
                </div>
            `;*/
            var image = `
                <div class="item__image">
                    <label for="${key}-${qtd+1}">
                        <div class="item__image__div addimages">
                            <div class="item__image__img"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M152 120c-26.51 0-48 21.49-48 48s21.49 48 48 48s48-21.49 48-48S178.5 120 152 120zM447.1 32h-384C28.65 32-.0091 60.65-.0091 96v320c0 35.35 28.65 64 63.1 64h384c35.35 0 64-28.65 64-64V96C511.1 60.65 483.3 32 447.1 32zM463.1 409.3l-136.8-185.9C323.8 218.8 318.1 216 312 216c-6.113 0-11.82 2.768-15.21 7.379l-106.6 144.1l-37.09-46.1c-3.441-4.279-8.934-6.809-14.77-6.809c-5.842 0-11.33 2.529-14.78 6.809l-75.52 93.81c0-.0293 0 .0293 0 0L47.99 96c0-8.822 7.178-16 16-16h384c8.822 0 16 7.178 16 16V409.3z"/></svg><img class="none" src=""></div>
                            <div class="item__image__img"><img class="none" src=""></div>
                            <div class="item__image__info none">
                                <label for="${key}-${qtd+1}" class="item__image__edt"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"/></svg><div class="tip">Alterar</div></label>
                                <div class="item__image__del" onclick="delFiles('${key}-${qtd+1}','');"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg><div class="tip">Excluir</div></div>
                            </div>
                            <input type="file" name="image[]" id="${key}-${qtd+1}" accept="image/*" style="display:none" onchange="addFiles('${key}-${qtd+1}');" />
                        </div>
                    </label>
                </div>
            `;
        }
        if(val.select){
            var options = '';
            $(val.select.options).each(function(){
                options += `<option value="${this.value}">${this.name}</option>`;
            });
        }
        $(`[tab=${id}-${qtd+1}] .subgroup__form`).append(`
            <div class="item" style="width:${!isMobile() ? val.width.desktop : val.width.mobile}%;${!val.name||(val.width&&val.width.desktop==0&&val.width.mobile==0) ? 'visibility:hidden;padding:0;' : ''}">
                <div class="item__name">
                    <p>${val.name ? `${val.name} ${qtd+1}` : ''}${val.required ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M192 32c17.7 0 32 14.3 32 32V199.5l111.5-66.9c15.2-9.1 34.8-4.2 43.9 11s4.2 34.8-11 43.9L254.2 256l114.3 68.6c15.2 9.1 20.1 28.7 11 43.9s-28.7 20.1-43.9 11L224 312.5V448c0 17.7-14.3 32-32 32s-32-14.3-32-32V312.5L48.5 379.4c-15.2 9.1-34.8 4.2-43.9-11s-4.2-34.8 11-43.9L129.8 256 15.5 187.4c-15.2-9.1-20.1-28.7-11-43.9s28.7-20.1 43.9-11L160 199.5V64c0-17.7 14.3-32 32-32z"/></svg>` : ''}</p>
                    ${val.input && val.input.length ? `<p><span>${val.input.length}</span> caracteres restantes</p>` : ''}
                </div>
                <div class="item__input">
                    ${val.select ? `
                    <select id="${key}-${qtd+1}" ${val.disabled ? 'disabled' : ''}>${options}</select>
                    ` : val.input && val.input.type == 'text' ? `
                    ${val.input.prev ? `<span class="item__prev">${val.input.prev}</span>` : ''}
                    <input type="${val.input.type}" ${val.input.prev ? 'class="item__prev"' : val.input.next||val.input.button ? 'class="item__next"' : ''} mask="${val.input.mask}" id="${key}-${qtd+1}" ${val.input.length ? `maxlength="${val.input.length}"` : ''} ${val.input.holder ? `placeholder="${val.input.holder}"` : ''} value="${val.value}"  ${val.input.length ? `onKeyUp="setCharacter(this,${val.input.length})"` : ''} ${val.disabled ? 'disabled' : ''}>
                    ${val.input.next ? `<span class="item__next">${val.input.next}</span>` : ''}
                    ${val.input.button ? `<button class="item__button" name="${val.input.button}">${val.input.button}</button>` : ''}
                    ` : val.input && val.input.type == 'textarea' ? `
                    <textarea id="${key}-${qtd+1}" ${val.input.holder ? `placeholder="${val.input.holder}"` : ''} oninput="setHeight(this)" ${val.input.length ? `onKeyUp="setCharacter(this,${val.input.length})"` : ''} ${val.disabled ? 'disabled' : ''}>${val.value}</textarea>
                    ` : val.input && val.input.type == 'date' ? `
                    <input type="${val.input.type}" mask="${val.input.mask}" id="${key}-${qtd+1}" ${val.input.holder ? `placeholder="${val.input.holder}"` : ''} value="${val.value}" ${val.disabled ? 'disabled' : ''}>
                    ` : val.list ? `
                    <input type="list" id="${key}-${qtd+1}" options="${JSON.stringify(val.list.options).replaceAll('"','\'')}" box="${val.list.type}" name="${val.name}" ${val.list.type=='color' ? `style="padding-left: 5vh"` : ''} val="" value="${val.value}" readonly ${val.disabled ? 'disabled' : ''}>${val.list.type=='color' ? `<div class="item__color" style="background-color:${val.value}"></div>` : ''}
                    ` : val.image ? `
                    ${image}
                    ` : ''}
                </div>
            </div>
        `);
    });
    $(`[tab="${id}-${qtd+1}"]`).append(`
        <div class="subgroup__options">
            <button onclick="setUp(this)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"/></svg></button>
            <button onclick="setDown(this)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg></button>
            <button onclick="setDel(this)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg></button>
        </div>
    `);
    setMasks();
    var add = $(`[tab="${id}"] .group__button`);
    $(`[tab="${id}"] .group__button`).remove();
    $(`[tab="${id}"]`).append(add);
    setCount(id);
    $('input[type="list"]').on('click',function(){
        const attr = {id:$(this).attr('id'),name:$(this).attr('name'),box:$(this).attr('box'),selected:$(this).attr('val'),options:JSON.parse($(this).attr('options').replaceAll('\'','"'))};
        box('list',attr);
    });
    window.varCustom.customSet();
}

//deleta um multiplo cadastro
function setDel(div){
    const tab = $(div).parent().parent().parent().attr('tab');
    $(div).parent().parent().remove();
    setCount(tab);
}

//sobe um field multiplo
function setUp(div){
    const tab = $(div).parent().parent().parent().attr('tab');
    //var divChange = $(`.${$(div).parent().parent().attr('tab').split('-')[0]}-${parseInt($(div).parent().parent().attr('tab').split('-')[1])-1}`);
    var html = $(div).parent().parent().html();
    var htmlChange = $(div).parent().parent().prev().html();
    $(div).parent().parent().prev().html(html);
    $(div).parent().parent().html(htmlChange);
    setCount(tab);
}

//desce um field multiplo
function setDown(div){
    const tab = $(div).parent().parent().parent().attr('tab');
    //var divChange = $(`.${$(div).parent().parent().attr('tab').split('-')[0]}-${parseInt($(div).parent().parent().attr('tab').split('-')[1])+1}`);
    var html = $(div).parent().parent().html();
    var htmlChange = $(div).parent().parent().next().html();
    $(div).parent().parent().next().html(html);
    $(div).parent().parent().html(htmlChange);
    setCount(tab);
}

//reordena os multi fields
function setCount(tab){
    $(`[tab="${tab}"] .subgroup`).each(function(i){
        $(this).attr('tab',`${$(this).attr('tab').split('-')[0]}-${i+1}`);
        $(this).find('.item').each(function(){
            if($(this).find('.item__name').html() != ''){
                $(this).find('.item__name p:first-child').html(`${$(this).find('.item__name p:first-child svg').length>0 ? `${$(this).find('.item__name p:first-child').text().replace(/\d+/g, '')} ${i+1}<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M192 32c17.7 0 32 14.3 32 32V199.5l111.5-66.9c15.2-9.1 34.8-4.2 43.9 11s4.2 34.8-11 43.9L254.2 256l114.3 68.6c15.2 9.1 20.1 28.7 11 43.9s-28.7 20.1-43.9 11L224 312.5V448c0 17.7-14.3 32-32 32s-32-14.3-32-32V312.5L48.5 379.4c-15.2 9.1-34.8 4.2-43.9-11s-4.2-34.8 11-43.9L129.8 256 15.5 187.4c-15.2-9.1-20.1-28.7-11-43.9s28.7-20.1 43.9-11L160 199.5V64c0-17.7 14.3-32 32-32z"/></svg>` : `${$(this).find('.item__name p:first-child').text().replace(/\d+/g, '')} ${i+1}`}`);
                if($(this).find('.item__image').length>0){
                    if($(this).find('form').length>0){
                        var img = $(this).find('form');
                        console.log(img);
                    }else{
                        var img = $(this).find('input');
                        console.log(img);
                    }
                    img.attr('id',`${img.attr('id').split('-')[0]}-${i+1}`);
                }else{
                    $(this).find('.item__input').find('[id]').attr('id',`${$(this).find('.item__input').find('[id]').attr('id').split('-')[0]}-${i+1}`);
                }
            }
        });
        if(i==0 && i==$(`[tab=${tab}] .subgroup__form`).length-1){
            $(this).find('.subgroup__options').html(`
                <button class="none"></button>
                <button class="none"></button>
                <button onclick="setDel(this)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path></svg><div class="tip">Excluir</div></button>
            `);
        }else if(i==0){
            $(this).find('.subgroup__options').html(`
                <button class="none"></button>
                <button onclick="setDown(this)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg></svg><div class="tip">Descer</div></button>
                <button onclick="setDel(this)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path></svg><div class="tip">Excluir</div></button>
            `);
        }else if(i==$(`[tab=${tab}] .subgroup__form`).length-1){
            $(this).find('.subgroup__options').html(`
                <button onclick="setUp(this)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"/></svg><div class="tip">Subir</div></button>
                <button class="none"></button>
                <button onclick="setDel(this)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path></svg><div class="tip">Excluir</div></button>
            `);
        }else{
            $(this).find('.subgroup__options').html(`
                <button onclick="setUp(this)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"/></svg><div class="tip">Subir</div></button>
                <button onclick="setDown(this)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg><div class="tip">Descer</div></button>
                <button onclick="setDel(this)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path></svg><div class="tip">Excluir</div></button>
            `);
        }
    });
    setMasks();
    window.varCustom.customSet();
}

//contador de caracteres
function setCharacter(input,size){
    let character = size - $(input).val().length;
    $(input).parent().prev().find('span').text(character);
}

//auto height textarea
function setHeight(element){
    $(element).css({'height': (element.scrollHeight+20)+'px','overflow-y':'hidden'});
    $(element).on("input",function(){
        this.style.height = 0;
        this.style.height = (this.scrollHeight) + "px";
    });
}

//mascaras input
function setMasks(){
    $('input[mask="ean"]').mask('0 000000 000000');
    $('input[mask="ncm"]').mask('0000.00.00');
    $('input[mask="zip_code"]').mask('00000-000');
    $('input[mask="horary"]').mask('00h00');
    $('input[mask="horary"]').on('keyup',function(){
        if($(this).val().charAt(0)>2){
            $(this).val('');
        }else if($(this).val().charAt(1)>3){
            $(this).val($(this).val().substr(0,1));
        }else if($(this).val().charAt(3)>5){
            $(this).val($(this).val().substr(0,3));
        }
    });
    $('input[mask="number"]').mask('0000000000');
    $('input[mask="price"]').maskMoney({allowNegative: false, allowZero: true, thousands:'.', decimal:',', affixesStay: true, precision: 2});
    $('input[mask="weight"]').maskMoney({allowNegative: false, allowZero: true, thousands:'.', decimal:',', affixesStay: true, precision: 3});
    $('input[mask="phone"]').on('keydown',function(){
        const phone = $(this);
        setTimeout(function(){
            if(phone.val().length <= 14){
                phone.mask('(00) 0000-00000');
            }else{
                phone.mask('(00) 00000-0000');
            }
        },500);
    });
    $('input[mask="document"]').on('keydown',function(){
        const document = $(this);
        setTimeout(function(){
            if(document.val().length <= 14){
                document.mask('000.000.000-000');
            }else{
                document.mask('00.000.000/0000-00');
            }
        },500);
    });
    $('input[mask="zip_code"]').on('keyup',function(){
        var pos = $(this).attr('id');
        console.log(pos)
        if($(this).val().length == 9){
            alertStart();
            $.getJSON(`https://viacep.com.br/ws/${$(this).val()}/json/`,function(res){         
                $(`#address`).val(res.logradouro);
                $(`#district`).val(res.bairro);
                $(`#city`).val(res.localidade);
                $(`#state`).val(res.uf);
                $(`#number`).focus();
                alertClose();
            });
        }
    });
}