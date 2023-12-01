window['Services'] = class Services{
    constructor(){
        this.get = {
            id: 'Services',
            texts: {
                title: 'Serviços',
                search: 'Buscar em serviços',
                add: 'Novo serviço',
                register: 'Cadastre seu primeiro serviço.',
            },
            endpoint: 'services',
            bulk: {
                activate: 'Ativar',
                deactivate: 'Desativar',
                delete: 'Excluir',
            },
            call: {
                date: rangeDate(),
                status: 'on',
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
                            link: `set(['Services'],'id')`,
                            mobile: true,
                        },
                    },
                },
                price: {
                    name: 'Preço',
                    width: 20,
                    row: {
                        price: {
                            type: 'normal',
                            text: '[text]',
                            link: null,
                            mobile: true,
                        },
                    },
                },
                subscriptions: {
                    name: 'Assinaturas',
                    width: 20,
                    row: {
                        subscriptions: {
                            type: 'normal',
                            text: '[text] (assinatura/assinaturas)',
                            link: `get(['Subscriptions'],{service:'id'})`,
                            mobile: false,
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
                            desktop: 60,
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
                    price: {
                        name: 'Preço',
                        width: {
                            desktop: 20,
                            mobile: 100,
                        },
                        value: '0,00',
                        required: true,
                        disabled: false,
                        input: {
                            type: 'text',
                            holder: 'Digite o preço',
                            length: null,
                            mask: 'price',
                            prev: 'R$ ',
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
                            desktop: 20,
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
                    description: {
                        name: 'Descrição',
                        width: {
                            desktop: 100,
                            mobile: 100,
                        },
                        value: '',
                        required: false,
                        disabled: false,
                        input: {
                            type: 'textarea',
                            holder: 'Digite a descrição',
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
        return false;
    }
}