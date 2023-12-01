window['Groups'] = class Groups{
    constructor(){
        this.get = {
            id: 'Groups',
            texts: {
                title: 'Grupos',
                search: 'Buscar em grupos',
                add: 'Novo grupo',
                register: 'Cadastre seu primeiro grupo.',
            },
            endpoint: 'groups',
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
                    width: 70,
                    row: {
                        name: {
                            type: 'bold',
                            text: '[text]',
                            link: `set(['Groups'],'id')`,
                            mobile: true,
                        },
                    },
                },
                customers: {
                    name: 'Clientes',
                    width: 30,
                    row: {
                        customers: {
                            type: 'normal',
                            text: '[text] (cliente/clientes)',
                            link: `get(['Customers'],{group:'id'})`,
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