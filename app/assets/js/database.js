//não salvo
async function databaseUnsaved(){
    let verify = false;
    if(window.varData.set && window.varData.set.data){
        $.each(window.varData.set.data,function(key,val){
            if($.type(val)=='string'){
                if(key != 'image' && key != 'logo' && key != 'cover' && $(`#${key}`).is(':visible')){
                    if($(`#${key}`).attr('type')=='list'){
                        if(val != $(`#${key}`).attr('val')){
                            verify = true;
                        }
                    }else{
                        if(val != `${$(`#${key}`).attr('mask')=='price' ? parseFloat($(`#${key}`).val().replaceAll('.','').replaceAll(',','.')).toFixed(2) : $(`#${key}`).attr('mask')=='weight' ? parseFloat($(`#${key}`).val().replaceAll('.','').replaceAll(',','.')).toFixed(3) : $(`#${key}`).val()}`){
                            verify = true;
                        }
                    }
                }
            }else if($.type(val)=='array'){
                if(key != 'images'){
                    $(val).each(function(i){
                        $.each(this,function(key2,val2){
                            if(key != 'image' && $(`#${key}`).is(':visible')){
                                if($(`#${key2}-${i+1}`).attr('type')=='list'){
                                    if(val2 != $(`#${key2}-${i+1}`).attr('val')){
                                        verify = true;
                                    }
                                }else{
                                    if(val2 != `${$(`[tab="${key}"] #${key2}-${i+1}`).attr('mask')=='price' ? parseFloat($(`[tab="${key}"] #${key2}-${i+1}`).val().replaceAll('.','').replaceAll(',','.')).toFixed(2) : $(`[tab="${key}"] #${key2}-${i+1}`).val()}`){
                                        verify = true;
                                    }
                                }
                            }
                        });
                    });
                    if(val.length != $(`.group[tab="${key}"] .subgroup`).length){
                        verify = true;
                    }
                }
            }
        });
    }
    if(verify){
        verify = await alert('confirm','green',{title: 'Salvar', text: 'Deseja salvar as alterações feitas?', itens: []});
        if(verify){
            databaseSave();
        }else{
            return true;
        }
    }else{
        return true;
    }
}

//salvar
async function databaseSave(){
    var error = [];
    $.each(window.varData.set.form,function(key,val){
        if(val.type=='normal'){
            $.each(val.fields,function(key2,val2){
                if(!val2.image && key2!='id'){
                    if(val2.input && val2.input.mask == 'date' && $(`#${key2}`).val() == ''){
                        error.push(`O campo <span>${val2.name}</span> está com a data inválida`);
                    }else if(val2.required && $(`#${key2}`).val() == ''){
                        error.push(`O campo <span>${val2.name}</span> está vazio ou incompleto`);
                    }else if(val2.input && val2.input.mask == 'document' && $(`#${key2}`).val().length > 0 && $(`#${key2}`).val().length == 14 && !validateCPF($(`#${key2}`).val())){
                        error.push(`O <span>CPF</span> está inválido`);
                    }else if(val2.input && val2.input.mask == 'document' && $(`#${key2}`).val().length > 0 && $(`#${key2}`).val().length == 18 && !validateCNPJ($(`#${key2}`).val())){
                        error.push(`O <span>CNPJ</span> está inválido`);
                    }else if(val2.input && val2.input.mask == 'document' && $(`#${key2}`).val().length > 0 && ($(`#${key2}`).val().length != 14 && $(`#${key2}`).val().length != 18)){
                        error.push(`O <span>CPF/CNPJ</span> está incorreto`);
                    }else if(val2.input && val2.input.mask == 'phone' && $(`#${key2}`).val().length > 0 && $(`#${key2}`).val().length < 14){
                        error.push(`O <span>${val2.name}</span> está inválido`);
                    }else if(val2.required && val2.input && val2.input.mask == 'price' && $(`#${key2}`).val() == '0,00'){
                        error.push(`O <span>${val2.name}</span> não pode ser zero`);
                    }else if(key2 == 'email' && $(`#${key2}`).val().length > 0 && !validateEmail($(`#${key2}`).val())){
                        error.push(`O <span>${val2.name}</span> está inválido`);
                    }else if(val2.input && val2.input.mask == 'zip_code' && $(`#${key2}`).val().length > 0 && $(`#${key2}`).val().length < 9){
                        error.push(`O <span>${val2.name}</span> está inválido`);
                    }else if(val2.input && val2.input.type == 'password' && $(`#${key2}`).val().length > 0 && $(`#${key2}`).val().length < 8){
                        error.push(`O <span>${val2.name}</span> tem que ter 8 ou mais caracteres`);
                    }else if(val2.input && val2.input.type == 'horary' && $(`#${key2}`).val().length > 0 && $(`#${key2}`).val().length < 5){
                        error.push(`O <span>${val2.name}</span> está inválido`);
                    }
                }
            });
        }else if(val.type=='multi'){
            $(`.group[tab="${key}"] .subgroup`).each(function(i){
                $(this).find('.item__input').children().each(function(){
                    if($(this).attr('id') && $(this).attr('id')!='id'){
                        if(window.varData.set.form[key].fields[$(this).attr('id').split('-')[0]].required && $(`[tab="${key}"] #${$(this).attr('id')}`).val() == ''){
                            error.push(`O campo <span>${$(this).parent().prev().children('p:first-child').text()}</span> está vazio ou incompleto`);
                        }else if(window.varData.set.form[key].fields[$(this).attr('id').split('-')[0]].required && window.varData.set.form[key].fields[$(this).attr('id').split('-')[0]].list && $(`[tab="${key}"] #${$(this).attr('id')}`).attr('val') == ''){
                            error.push(`O campo <span>${$(this).parent().prev().children('p:first-child').text()}</span> está vazio ou incompleto`);
                        }else if(window.varData.set.form[key].fields[$(this).attr('id').split('-')[0]].required && window.varData.set.form[key].fields[$(this).attr('id').split('-')[0]].input && window.varData.set.form[key].fields[$(this).attr('id').split('-')[0]].input.mask=='price' && $(`[tab="${key}"] #${$(this).attr('id')}`).val() == '0,00'){
                            error.push(`O <span>${$(this).parent().prev().children('p:first-child').text()}</span> não pode ser zero`);
                        }else if(window.varData.set.form[key].fields[$(this).attr('id').split('-')[0]].input && window.varData.set.form[key].fields[$(this).attr('id').split('-')[0]].input.mask == 'phone' && $(`[tab="${key}"] #${$(this).attr('id')}`).val().length > 0 && $(`[tab="${key}"] #${$(this).attr('id')}`).val().length < 14){
                            error.push(`O <span>${$(this).parent().prev().children('p:first-child').text()}</span> está inválido`);
                        }else if(window.varData.set.form[key].fields[$(this).attr('id').split('-')[0]].input && window.varData.set.form[key].fields[$(this).attr('id').split('-')[0]].input.mask == 'zip_code' && $(`[tab="${key}"] #${$(this).attr('id')}`).val().length > 0 && $(`[tab="${key}"] #${$(this).attr('id')}`).val().length < 9){
                            error.push(`O <span>${$(this).parent().prev().children('p:first-child').text()}</span> está inválido`);
                        }
                    }
                });
            });
        }
    });
    if(error.length > 0){
        alert('alert','red',error);
    }else{
        $.each(window.varData.get.call,function(key,val){
            if(key == 'parent'){
                window.varData.get.call.parent.value = $(`#parent`).val();
            }else{
                window.varData.get.call[key].value = window.varData.get.call[key].default;
            }
        });
        var fields = {};
        $.each(window.varData.set.form,function(key,val){
            if(val.type=='normal'){
                $.each(val.fields,function(key2,val2){
                    if($(`#${key2}`).attr('type')=='list'){
                        fields[key2] = $(`#${key2}`).attr('val');
                    }else if(val2.input && val2.input.mask=='price'){
                        fields[key2] = parseFloat($(`#${key2}`).val().replaceAll('.','').replaceAll(',','.'));
                    }else{
                        fields[key2] = $(`#${key2}`).val();
                    }
                });
            }else if(val.type=='multi'){
                fields[key] = [];
                $(`.group[tab="${key}"] .subgroup`).each(function(i){
                    fields[key][i] = {};
                    $(this).find('.item__input').children().each(function(){
                        if($(this).attr('id')){
                            if($(this).attr('type')=='list'){
                                fields[key][i][$(this).attr('id').split('-')[0]] = $(this).attr('val');
                            }else if(window.varData.set.form[key].fields[$(this).attr('id').split('-')[0]].input && window.varData.set.form[key].fields[$(this).attr('id').split('-')[0]].input.mask=='price'){
                                fields[key][i][$(this).attr('id').split('-')[0]] = parseFloat($(this).val().replaceAll('.','').replaceAll(',','.'));
                            }else{
                                fields[key][i][$(this).attr('id').split('-')[0]] = $(this).val();
                            }
                        }
                        
                    });
                    fields[key][i].rank = i+1;
                });
            }
        });
        if(window.varData.set.id == 0){
            const verify = await databasePost(fields);
            if(verify){
                //image
                $.each(window.varData.set.form,async function(key,val){
                    if(val.type=='normal'){
                        $.each(val.fields,async function(key2,val2){
                            if(val2.image){
                                let images = await fileUpload(key2);
                                await fileUpdate(verify,key2,images[0].name);
                            }
                        });
                    }
                    if(val.type=='gallery'){
                        if($(`.group[tab="${key}"] .item`).length>0){
                            $(`.group[tab="${key}"] .item .item__image__div .item__image__img:first-child img`).each(async function(){
                                console.log($(this))
                                console.log($(this).attr('src'))
                                let images = await fileUpload(key,$(this).attr('src'));
                                console.log(images[0].name);
                                console.log(key);
                                console.log(verify);
                                await fileUpdate(verify,key,'add/'+images[0].name);
                            });

                            
                        }
                            

                    }
                });
                //link
                setTimeout(function(){
                    console.log(window.varData.get.id)
                    window.varData.set = null;
                    if(window.varData.get.subid){
                        if(window.varData.get.id=='Products'){
                            set([window.varData.get.id],verify,'images');
                        }else{
                            get([window.varData.get.id,window.varData.get.subid]);
                        }
                        
                    }else{
                        get([window.varData.get.id]);
                    }
                },2000);
            }
        }else{
            const verify = await databasePut(fields,[window.varData.set.id]);
            if(verify){
                window.varData.set = null;
                if(window.varData.get.columns){
                    if(window.varData.get.subid){
                        get([window.varData.get.id,window.varData.get.subid]);
                    }else{
                        get([window.varData.get.id]);
                    }
                }else{
                    set([window.varData.get.id],JSON.parse(Cookies.get('auth')).account);
                }
            }
        }
    }
}

//select no banco
async function databaseGet(custom=null){
    return new Promise(callback => {
        let fields;
        if(custom){
            fields = Object.keys(window.varData.get.call).reduce((a,b)=>({...a,[b]:window.varData.get.call[b].value}),0);
            fields['custom'] = custom.custom;
            fields['items'] = custom.items;
        }else{
            fields = Object.keys(window.varData.get.call).reduce((a,b)=>({...a,[b]:window.varData.get.call[b].value}),0);
        }
        $.get(`${window.api}/${window.varData.get.endpoint}${window.varData.set ? `/${window.varData.set.id}` : ''}`,fields,function(res,txt,sts){
            console.log(res);
            if(res.sts == 200){
                callback(res);
            }else{
                alert('alert','red',[res.message]);
                callback(false);
            }
        }).fail(function(err){
            alert('alert','red',[err.responseText]);
            callback(false);
        });
    });
}

//insert no banco
async function databasePost(fields){
    return new Promise(callback => {
        alertStart();
        fields['user'] = JSON.parse(Cookies.get('auth')).user;
        fields['token'] = JSON.parse(Cookies.get('auth')).token;
        fields['account'] = JSON.parse(Cookies.get('auth')).account;
        $.post(`${window.api}/${window.varData.get.endpoint}`,fields,function(res,txt,sts){
            console.log(res);
            if(res.sts == 200){
                alert('message','green','Adicionado com sucesso');
                callback(res.id);
            }else{
                alert('alert','red',[res.message]);
                callback(false);
            }
        }).fail(function(err){
            alert('alert','red',[err.responseText]);
            callback(false);
        });
    });
}

//update no banco
async function databasePut(fields,id){
    return new Promise(callback => {
        alertStart();
        fields['user'] = JSON.parse(Cookies.get('auth')).user;
        fields['token'] = JSON.parse(Cookies.get('auth')).token;
        fields['account'] = JSON.parse(Cookies.get('auth')).account;
        console.log(fields);
        console.log(`${window.api}/${window.varData.get.endpoint}/${id.join(',')}`);
        $.put(`${window.api}/${window.varData.get.endpoint}/${id.join(',')}`,fields,function(res,txt,sts){
            if(res.sts == 200){
                alert('message','green','Modificado com sucesso');
                callback(res);
            }else{
                alert('alert','red',[res.message]);
                callback(false);
            }
        }).fail(function(err){
            alert('alert','red',[err.responseText]);
            callback(false);
        });
    });
}

//delete no banco
async function databaseDelete(id){
    return new Promise(callback => {
        alertStart();
        let fields = [];
        fields['user'] = JSON.parse(Cookies.get('auth')).user;
        fields['token'] = JSON.parse(Cookies.get('auth')).token;
        fields['account'] = JSON.parse(Cookies.get('auth')).account;
        $.delete(`${window.api}/${window.varData.get.endpoint}/${id.join(',')}?${Object.keys(fields).map(key => key + '=' + fields[key]).join('&')}`,function(res,txt,sts){
            if(res.sts == 200){
                alert('message','green','Excluído com sucesso');
                callback(true);
            }else{
                alert('alert','red',[res.message]);
                callback(false);
            }
        }).fail(function(err){
            alert('alert','red',[err.responseText]);
            callback(false);
        });
    });
}