//add image
async function addFiles(code){
    console.log(code)
    if(window.varData.set.id == 0 || window.varData.set.id == '8b70fa23d8'){//add
        await fileLoad(code);
        if(code=='images'||code=='favicon'||code=='logo'){
            let images = await fileUpload(code);
            $(images).each(async function(){
                await fileUpdate(window.varData.set.id,code,window.varData.set.form[code]&&window.varData.set.form[code].type=='gallery' ? `add/${this.name}` : this.name);
                await set(window.varData.get.subid ? [window.varData.get.id,window.varData.get.subid] : [window.varData.get.id],window.varData.set.id,window.varData.set.form[code]&&window.varData.set.form[code].type=='gallery' ? 'images' : '');
            });
        }
    }else{//edt
        let images = await fileUpload(code);
        $(images).each(async function(){
            await fileUpdate(window.varData.set.id,code,window.varData.set.form[code]&&window.varData.set.form[code].type=='gallery' ? `add/${this.name}` : this.name);
            await set(window.varData.get.subid ? [window.varData.get.id,window.varData.get.subid] : [window.varData.get.id],window.varData.set.id,window.varData.set.form[code]&&window.varData.set.form[code].type=='gallery' ? 'images' : '');
        });
    }
}

//edt image
async function edtFiles(code,image){
    console.log('edt')
    console.log(code)
    console.log(image)
    if(window.varData.set.id == 0){//add
        await fileLoad(code);
    }else{//edt
        let images = await fileUpload(code);
        await fileDelete(image);
        await fileUpdate(window.varData.set.id,code,images[0].name);
        await set(window.varData.get.subid ? [window.varData.get.id,window.varData.get.subid] : [window.varData.get.id],window.varData.set.id,window.varData.set.form[code]&&window.varData.set.form[code].type=='gallery' ? 'images' : '');
    }
}

//del image
async function delFiles(code,image){
    console.log('del')
    console.log(code)
    console.log(image)
    if(window.varData.set.id == 0){//add
        await fileUnload(code);
    }else{//edt
        await fileDelete(image);
        await fileUpdate(window.varData.set.id,code,window.varData.set.form[code]&&window.varData.set.form[code].type=='gallery' ? `del/${image}` : 'null');
        await set(window.varData.get.subid ? [window.varData.get.id,window.varData.get.subid] : [window.varData.get.id],window.varData.set.id,window.varData.set.form[code]&&window.varData.set.form[code].type=='gallery' ? 'images' : '');
    }
}

//load da imagem //imageLoad
async function fileLoad(code){
    return new Promise(callback => {
        console.log(code)
        const max = window.varData.set.form[code]&&window.varData.set.form[code].type=='gallery' ? window.varData.set.form[code].fields.image.max : window.varData.set.form[Object.keys(window.varData.set.form).map(obj=>{if(window.varData.set.form[obj].fields.hasOwnProperty(code.replace(/\d+/g, '').replace('-', ''))){return obj;}}).filter(e => e)[0]].fields[code.replace(/\d+/g, '').replace('-', '')].image.max;

        //const max = window.varData.set.form[Object.keys(window.varData.set.form).map(obj=>{if(window.varData.set.form[obj].fields.hasOwnProperty(code.replace(/\d+/g, '').replace('-', ''))){return obj;}}).filter(e => e)[0]].fields[code.replace(/\d+/g, '').replace('-', '')].image.max;
        console.log(max)
        console.log(code)
        alertStart();
        var check = false;
        $($(`#${code}`)[0].files).each(function(){
            if(!this || !this.type.match('image')){
                check = true;
            }
        });
        if(check){
            $(`#${code}`).val('');
            alert('alert','red',['O arquivo não é uma imagem válida']);
            callback(false);
        }else{
            if(max == 1){
                const files = $(`#${code}`)[0].files;
                $($(`#${code}`)[0].files).each(function(){
                    $(`#${code}`).parent().parent().parent().parent().find('.item__image').html(`
                        <div class="item__image__div">
                            <div class="item__image__img"><svg class="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M152 120c-26.51 0-48 21.49-48 48s21.49 48 48 48s48-21.49 48-48S178.5 120 152 120zM447.1 32h-384C28.65 32-.0091 60.65-.0091 96v320c0 35.35 28.65 64 63.1 64h384c35.35 0 64-28.65 64-64V96C511.1 60.65 483.3 32 447.1 32zM463.1 409.3l-136.8-185.9C323.8 218.8 318.1 216 312 216c-6.113 0-11.82 2.768-15.21 7.379l-106.6 144.1l-37.09-46.1c-3.441-4.279-8.934-6.809-14.77-6.809c-5.842 0-11.33 2.529-14.78 6.809l-75.52 93.81c0-.0293 0 .0293 0 0L47.99 96c0-8.822 7.178-16 16-16h384c8.822 0 16 7.178 16 16V409.3z"/></svg><img src="${URL.createObjectURL(this)}"></div>
                            <div class="item__image__img"><img src="${URL.createObjectURL(this)}"></div>
                            <div class="item__image__info">
                                <label for="${code}" class="item__image__edt"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"/></svg><div class="tip">Alterar</div></label>
                                <div class="item__image__del" onclick="delFiles('${code}');"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg><div class="tip">Excluir</div></div>
                            </div>
                            <input type="file" name="image[]" id="${code}" accept="image/*" style="display:none" onchange="edtFiles('${code}');" />
                        </div>
                    `);
                    /*$(`#${code}`).parent().find(`.item__image__img img`).attr('src',URL.createObjectURL(this));
                    $(`#${code}`).parent().removeClass('addimages');
                    $(`#${code}`).parent().find(`.item__image__img img`).removeClass('none');
                    $(`#${code}`).prev().removeClass('none');
                    $(`#${code}`).parent().find(`.item__image__img svg`).addClass('none');*/
                });
                $(`#${code}`)[0].files = files;
                callback(false);
                alertClose();
            }else{
                if($(`#${code}`)[0].files.length+$(`[tab="${code}"] .item`).length-1>max){
                    alert('alert','red',[`A quantidade máxima de imagens são ${max}`]);
                    callback(false);
                }else{
                    $($(`#${code}`)[0].files).each(function(){
                        $(`[tab="${code}"]`).prepend(`
                            <div class="item" style="width:10%;">
                                <div class="item__input">
                                    <div class="item__image" id="image-${$(`[tab="${code}"] .item`).length+1}">
                                    <div class="item__image__div">
                                        <div class="item__image__img"><img src="${URL.createObjectURL(this)}"></div>
                                        <div class="item__image__img"><img src="${URL.createObjectURL(this)}"></div>
                                        <div class="item__image__info">
                                            <div class="item__image__del" onclick="fileUnload(null,this)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path></svg><div class="tip">Excluir</div></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `);
                    });
                    if($(`[tab="${code}"] .item`).length>=max){
                        $(`[tab="${code}"] .noimage`).parent().parent().hide();
                    }
                    callback(false);
                    alertClose();
                }
            }
        }
        
    });
}

//unload da imagem //imageUnload
async function fileUnload(code,div=false){
    return new Promise(callback => {
        alertStart();
        if(div){
            $(div).parent().parent().parent().parent().remove();
            $(`[tab="${code}"] .noimage`).parent().parent().show();
        }else{
            $(`#${code}`).parent().parent().parent().find('.item__image').html(`
                <label for="${code}">
                    <div class="item__image__div addimages">
                        <div class="item__image__img"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M152 120c-26.51 0-48 21.49-48 48s21.49 48 48 48s48-21.49 48-48S178.5 120 152 120zM447.1 32h-384C28.65 32-.0091 60.65-.0091 96v320c0 35.35 28.65 64 63.1 64h384c35.35 0 64-28.65 64-64V96C511.1 60.65 483.3 32 447.1 32zM463.1 409.3l-136.8-185.9C323.8 218.8 318.1 216 312 216c-6.113 0-11.82 2.768-15.21 7.379l-106.6 144.1l-37.09-46.1c-3.441-4.279-8.934-6.809-14.77-6.809c-5.842 0-11.33 2.529-14.78 6.809l-75.52 93.81c0-.0293 0 .0293 0 0L47.99 96c0-8.822 7.178-16 16-16h384c8.822 0 16 7.178 16 16V409.3z"/></svg><img class="none" src=""></div>
                        <div class="item__image__img"><img class="none" src=""></div>
                        <div class="item__image__info none">
                            <label for="${code}" class="item__image__edt"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"/></svg><div class="tip">Alterar</div></label>
                            <div class="item__image__del" onclick="delFiles('${code}');"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg><div class="tip">Excluir</div></div>
                        </div>
                        <input type="file" name="image[]" id="${code}" accept="image/*" style="display:none" onchange="addFiles('${code}');" />
                    </div>
                </label>
            `);
            /*$(`#${code} .item__image__div img`).attr('src','null');
            $(`#${code} .item__image__div`).addClass('noimage');
            $(`#${code} .item__image__div img`).addClass('none');
            $(`#${code} .item__image__info`).addClass('none');
            $(`#${code} .item__image__div svg`).removeClass('none');*/
        }
        alertClose();
        callback(false);
    });
}

//upload de imagem no servidor //imageUpload
async function fileUpload(code,img=''){
    return new Promise(callback => {
        alertStart();
        let field;
        //if(type=='gallery'){
            //field = window.varData.set.form[Object.keys(window.varData.set.form).map(obj=>{if(window.varData.set.form[obj].fields.hasOwnProperty('image')){return obj;}}).filter(e => e)[0]].fields['image'];
        //}else{window.setData.set.form[code]&&window.setData.set.form[code].type=='gallery'
            field = window.varData.set.form[code]&&window.varData.set.form[code].type=='gallery' ? window.varData.set.form[code].fields.image : window.varData.set.form[Object.keys(window.varData.set.form).map(obj=>{if(window.varData.set.form[obj].fields.hasOwnProperty(code)){return obj;}}).filter(e => e)[0]].fields[code];
        //}
        /*if(window.varData.set.form[window.varData.set.form.findIndex(obj=>obj.id==type)].params.type=='gallery' && window.varData.set.form[window.varData.set.form.findIndex(obj=>obj.id==type)].params.fields[1].params.max<(window.varData.set.data[window.varData.set.data.findIndex(obj=>obj.id==type)].value.length+$(`#${type} input`)[0].files.length)){
            alert('alert','red',[`A quantidade máxima de imagens são ${window.varData.set.form[window.varData.set.form.findIndex(obj=>obj.id==type)].params.fields[1].params.max}`]);
            callback(false);*/
        if(field.image.type=='multi' && field.image.max<($(`[tab="${code}"] .subgroup .item`).length+$(`#${code}`)[0].files.length)){
            alert('alert','red',[`A quantidade máxima de imagens são ${field.image.max}`]);
            callback(false);
        }else{
            if(img==''){
                var check = false;
                $($(`#${code}`)[0].files).each(function(){
                    if(!this || !this.type.match('image')){
                        check = true;
                    }
                });
                if(check){
                    $(`#${code}`).val('');
                    alert('alert','red',['O arquivo não é uma imagem válida']);
                    callback(false);
                }else{
                    if($(`#${code}`)[0].files){
                        $(`#${code}`).on('submit',function(e){
                            e.preventDefault();
                            var formData = new FormData();
                            if(field.image.max==1){
                                formData.append('image[]',$(`#${code}`)[0].files[0]);
                            }else{
                                $($(`#${code}`)[0].files).each(function(){
                                    formData.append('image[]',this);
                                });
                            }
                            formData.append('token',JSON.parse(Cookies.get('auth')).token); 
                            formData.append('user',JSON.parse(Cookies.get('auth')).user); 
                            $.ajax({
                                type: 'POST',
                                url: `${window.img}/api`,
                                data: formData,
                                cache: false,
                                contentType: false,
                                processData: false,
                                success: async function(res){
                                    if(res.sts == 200){
                                        callback(res.images);
                                    }else{
                                        alert('alert','red',['Erro ao processar a imagem']);
                                        callback(false);
                                    }
                                },
                                fail: function(){
                                    alert('alert','red',['Erro ao processar a imagem']);
                                }
                            });
                        });
                        $(`#${code}`).submit();
                    }else{
                        alert('alert','red',['Erro ao processar a imagem']);
                        callback(false);
                    }
                }
            }else{
                console.log(img);
                var formData = new FormData();
                formData.append('image[]',img);
                formData.append('token',JSON.parse(Cookies.get('auth')).token); 
                formData.append('user',JSON.parse(Cookies.get('auth')).user); 
                $.ajax({
                    type: 'POST',
                    url: `${window.img}/api`,
                    data: formData,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: async function(res){
                        if(res.sts == 200){
                            callback(res.images);
                        }else{
                            alert('alert','red',['Erro ao processar a imagem']);
                            callback(false);
                        }
                    },
                    fail: function(){
                        alert('alert','red',['Erro ao processar a imagem']);
                    }
                });
            }
        }
    });
}

//deletar imagens //imageDelete
async function fileDelete(image){
    $.delete(`${window.img}/api`,{token:JSON.parse(Cookies.get('auth')).token,user:JSON.parse(Cookies.get('auth')).user,image:image});
}

//update de imagem no banco //imageUpdate
async function fileUpdate(id,key,value){
    alertStart();
    await databasePut({[key]: value},[id]);   
}

async function fileSort(tab){
    let fields = [];
    $(`[tab="${tab}"] .subgroup .item`).each(function(i){
        fields.push({image: $(this).find('.item__image__img img').attr('src').split('/')[3].split('?')[0], rank: i+1});
        $(this).find('.item__image__rank').text(i+1);
    });
    alertStart();
    await databasePut({rank: fields},[window.varData.set.id]);  
}