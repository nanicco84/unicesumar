window['Search'] = class Search{
    constructor(){
        this.get = {
            id: 'Search',
            texts: {
                title: 'Busca',
                search: 'Buscar em tudo',
                add: null,
                register: null,
            },
            endpoint: 'search',
            bulk: null,
            call:  {
                date: rangeDate(),
                order: '`date` DESC',
            },
            filter: {
                date: {
                    name: 'Data',
                    type: 'date',
                    options: null,
                },
            },
            columns: {
                date: {
                    name: 'Data',
                    width: 'date',
                    row: {
                        date: {
                            type: 'normal',
                            text: '[text]',
                            link: null,
                        },
                        hour: {
                            type: 'normal',
                            text: '[text]',
                            link: null,
                        },
                    },
                },
                type: {
                    name: 'Tipo',
                    width: 25,
                    row: {
                        type: {
                            type: 'normal',
                            text: '[text]',
                            link: `get(table)`,
                        },
                    },
                },
                name: {
                    name: 'Nome',
                    width: 75,
                    row: {
                        name: {
                            type: 'bold',
                            text: '[text]',
                            link: `set(table,'id')`,
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
        this.set = null
    }
    custom(database=null,attr=null){
        return false;
    }
    customGet(database=null,attr=null){
        if(JSON.parse(Cookies.get('auth')).main=='off'){
            if(database.results){
                $.each(database.results,function(key,val){
                    if(val.type=='Usuários'&&val.id!=JSON.parse(Cookies.get('auth')).user){
                        $(`.list__item[code="${val.id}"] .list__actions[opcao="edit"]`).html('');
                        $(`.list__item[code="${val.id}"] .list__actions[opcao="edit"]`).attr('class','list__actions__none fields');
                        $(`.list__item[code="${val.id}"] .list__actions__none[opcao="edit"]`).removeAttr('opcao');
                        $(`.list__item[code="${val.id}"] .list__title span`).removeAttr('onclick');
                    }
                });
            }
        }
    }
    customSet(database=null,attr=null){
        return false;
    }
}