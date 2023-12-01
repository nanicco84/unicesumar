window['Users'] = class Users{
    constructor(){
        this.get = {
            id: 'Users',
            texts: {
                title: 'Usuários',
                search: 'Buscar em usuários',
                add: 'Novo usuário',
                register: 'Cadastre seu primeiro usuário.',
            },
            endpoint: 'users',
            bulk: {
                activate: 'Ativar',
                deactivate: 'Desativar',
                delete: 'Excluir',
            },
            call:  {
                date: rangeDate(),
                status: '',
            },
            filter: {
                date: {
                    name: 'Data',
                    type: 'date',
                    options: null,
                },
                status: {
                    name: 'Status',
                    type: 'select',
                    options: [
                        {name: 'Todos', value: ''},
                        {name: 'Ativo', value: 'on'},
                        {name: 'Inativo', value: 'off'},
                    ],
                },
            },
            columns: {
                status: {
                    name: null,
                    width: null,
                    row: null,
                },
                check: {
                    name: null,
                    width: null,
                    row: null,
                },
                date: {
                    name: 'Data',
                    width: 'date',
                    row: {
                        date: {
                            type: 'normal',
                            text: '[text]',
                            link: null,
                            mobile: true,
                        },
                        hour: {
                            type: 'normal',
                            text: '[text]',
                            link: null,
                            mobile: false,
                        },
                    },
                },
                name: {
                    name: 'Nome',
                    width: 60,
                    row: {
                        name: {
                            type: 'bold',
                            text: '[text]',
                            link: `set(['Users'],'id')`,
                            mobile: true,
                        },
                    },
                },
                email: {
                    name: 'Email',
                    width: 40,
                    row: {
                        email: {
                            type: 'normal',
                            text: '[text]',
                            link: null,
                            mobile: true,
                        },
                    },
                },
                edit: {
                    name: 'Editar',
                    width: null,
                    row: null,
                },
                delete: {
                    name: 'Excluir',
                    width: null,
                    row: null,
                },
            }
        }
        this.set = {
            general: {
                name: 'Geral',
                type: 'normal',
                fields: {
                    name: {
                        name: 'Nome',
                        width: {
                            desktop: 100,
                            mobile: 100,
                        },
                        value: '',
                        required: true,
                        disabled: false,
                        input: {
                            type: 'text',
                            holder: 'Digite o nome',
                            length: '50',
                            mask: null,
                            prev: null,
                            next: null,
                            button: null,
                        },
                        select: null,
                        list: null,
                        image: null,
                    },
                    email: {
                        name: 'Email',
                        width: {
                            desktop: 70,
                            mobile: 100,
                        },
                        value: '',
                        required: true,
                        disabled: false,
                        input: {
                            type: 'text',
                            holder: 'Digite o email',
                            length: '100',
                            mask: 'email',
                            prev: null,
                            next: null,
                            button: null,
                        },
                        select: null,
                        list: null,
                        image: null,
                    },
                    status: {
                        name: 'Status',
                        width: {
                            desktop: 30,
                            mobile: 100,
                        },
                        value: 'on',
                        required: true,
                        disabled: false,
                        input: null,
                        select: {
                            options: [
                                {name: 'Ativo', value: 'on'},
                                {name: 'Inativo', value: 'off'},
                            ],
                        },
                        list: null,
                        image: null,
                    },
                }
            }
        }
    }
    custom(database=null,attr=null){
        return false;
    }
    customGet(database=null,attr=null){
        if(JSON.parse(Cookies.get('auth')).main=='off'){
            $('.top__add').hide();
            $(`.list__item .list__actions[opcao="delete"]`).html('');
            $(`.list__item .list__actions[opcao="delete"]`).attr('class','list__actions__none fields');
            $(`.list__item .list__actions__none[opcao="delete"]`).removeAttr('opcao');
            $(`.list__item .list__check`).attr('class','list__check__off');
            $(`.list__item .list__check__off`).html('');
            $(`.list__item .list__status div`).html('');
            $(`.list__item .list__status`).removeAttr('onclick');
            $(`.list__item .list__status__sts`).addClass('none');
            $(`.list__fields .list__check`).attr('class','list__check__off');
            $(`.list__fields .list__check__off`).html('');
            if(database.results){
                $.each(database.results,function(key,val){
                    if(val.id!=JSON.parse(Cookies.get('auth')).user){
                        $(`.list__item[code="${val.id}"] .list__actions[opcao="edit"]`).html('');
                        $(`.list__item[code="${val.id}"] .list__actions[opcao="edit"]`).attr('class','list__actions__none fields');
                        $(`.list__item[code="${val.id}"] .list__actions__none[opcao="edit"]`).removeAttr('opcao');
                        $(`.list__item[code="${val.id}"] .list__title span`).removeAttr('onclick');
                    }
                });
            }
        }else{
            $(`.list__item[code="${JSON.parse(Cookies.get('auth')).user}"] .list__check`).attr('class','list__check__off');
            $(`.list__item[code="${JSON.parse(Cookies.get('auth')).user}"] .list__check__off`).html('');
            $(`.list__item[code="${JSON.parse(Cookies.get('auth')).user}"] .list__status div`).html('');
            $(`.list__item[code="${JSON.parse(Cookies.get('auth')).user}"] .list__status`).removeAttr('onclick');
            $(`.list__item[code="${JSON.parse(Cookies.get('auth')).user}"] .list__status__sts`).addClass('none');
            if(database.results){
                $.each(database.results,function(key,val){
                    if(val.main=='on'){
                        $(`.list__item[code="${val.id}"] .list__actions[opcao="delete"]`).html('');
                        $(`.list__item[code="${val.id}"] .list__actions[opcao="delete"]`).attr('class','list__actions__none fields');
                        $(`.list__item[code="${val.id}"] .list__actions__none[opcao="delete"]`).removeAttr('opcao');
                    }
                });
            }
        }
    }
    customSet(database=null,attr=null){
        if(JSON.parse(Cookies.get('auth')).main=='off'){
            $('.buttons button[code="deletar"]').hide();
            $('#status').attr('disabled',true);
        }else{
            if(JSON.parse(Cookies.get('auth')).user == window.varData.set.id){
                $('.buttons button[code="deletar"]').hide();
                $('#status').attr('disabled',true);
            }
        }
        if(window.varData.set.id != 0){
            $('.buttons').append(`<button code="senha" class="yellow"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M512 176.001C512 273.203 433.202 352 336 352c-11.22 0-22.19-1.062-32.827-3.069l-24.012 27.014A23.999 23.999 0 0 1 261.223 384H224v40c0 13.255-10.745 24-24 24h-40v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24v-78.059c0-6.365 2.529-12.47 7.029-16.971l161.802-161.802C163.108 213.814 160 195.271 160 176 160 78.798 238.797.001 335.999 0 433.488-.001 512 78.511 512 176.001zM336 128c0 26.51 21.49 48 48 48s48-21.49 48-48-21.49-48-48-48-48 21.49-48 48z"/></svg>Nova Senha</button>`);
            $('.buttons button[code="senha"]').on('click',function(){
                const call = databasePut({password: 'x'},[window.varData.set.id]);
                if(call){
                    get(['Users']);
                }
            });
        }
    }
}