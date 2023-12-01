window['Notifications'] = class Notifications{
    constructor(){
        this.get = {
            id: 'Notifications',
            texts: {
                title: 'Notificações',
                search: 'Buscar em notificações',
                add: null,
                register: null,
            },
            endpoint: 'notifications',
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
                    width: 100,
                    row: {
                        name: {
                            type: 'bold',
                            text: '[text]',
                            link: null,
                            mobile: true,
                        },
                    },
                },
            }
        }
        this.set = null
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