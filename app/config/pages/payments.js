window['Payments'] = class Payments{
    constructor(){
        this.get = {
            id: 'Payments',
            texts: {
                title: 'Pagamentos',
                search: 'Buscar em pagamentos',
                add: null,
                register: 'Cadastre sua forma de pagamento.',
            },
            endpoint: 'payments',
            bulk: {
                activate: 'Ativar',
                deactivate: 'Desativar',
            },
            call:  {
                status: '',
            },
            filter: {
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
                name: {
                    name: 'Nome',
                    width: 70,
                    row: {
                        name: {
                            type: 'bold',
                            text: '[text]',
                            link: `set(['Payments'],'id')`,
                            mobile: true,
                        },
                    },
                },
                app_name: {
                    name: 'App',
                    width: 30,
                    row: {
                        app_name: {
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
                            desktop: 70,
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
                    text: {
                        name: 'Texto do email da fatura',
                        width: {
                            desktop: 100,
                            mobile: 100,
                        },
                        value: '',
                        required: false,
                        disabled: false,
                        input: {
                            type: 'textarea',
                            holder: 'Digite o texto',
                            length: '500',
                            mask: null,
                            prev: null,
                            next: null,
                            button: null,
                        },
                        select: null,
                        list: null,
                        image: null,
                    },
                },
            },
        }
    }
    custom(database=null,attr=null){
        return false;
    }
    customGet(database=null,attr=null){
        return false;
    }
    customSet(database=null,attr=null){
        $('button[code="deletar"]').hide();
        if(database.results.app!=''){
            $('#text').parent().parent().hide();
        }
    }
}