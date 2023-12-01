window['Subscriptions'] = class Subscriptions{
    constructor(){
        this.get = {
            id: 'Subscriptions',
            texts: {
                title: 'Assinaturas',
                search: 'Buscar em assinaturas',
                add: 'Nova assinatura',
                register: 'Crie sua primeira assinatura.',
            },
            endpoint: 'subscriptions',
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
                customer: {
                    name: 'Cliente',
                    width: 25,
                    row: {
                        customer_name: {
                            type: 'bold',
                            text: '[text]',
                            link: `set(['Subscriptions'],'id')`,
                            mobile: true,
                        },
                    },
                },
                services: {
                    name: 'Serviços',
                    width: 30,
                    row: {
                        services: {
                            type: 'array',
                            text: '[text]',
                            link: null,
                            mobile: false,
                        },
                    },
                },
                total: {
                    name: 'Total',
                    width: 15,
                    row: {
                        total: {
                            type: 'normal',
                            text: '[text]',
                            link: null,
                            mobile: true,
                        },
                    },
                },
                next_due_date: {
                    name: 'Vencimento',
                    width: 15,
                    row: {
                        next_due_date: {
                            type: 'normal',
                            text: '[text]',
                            link: null,
                            mobile: true,
                        },
                    },
                },
                period: {
                    name: 'Período',
                    width: 15,
                    row: {
                        period: {
                            type: 'normal',
                            text: '[text]',
                            link: null,
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
                        name: null,
                        width: null,
                        value: '',
                        required: false,
                        disabled: false,
                        input: null,
                        select: null,
                        list: null,
                        image: null,
                    },
                    customer: {
                        name: 'Cliente',
                        width: {
                            desktop: 50,
                            mobile: 100,
                        },
                        value: '',
                        required: true,
                        disabled: false,
                        input: null,
                        select: null,
                        list: {
                            type: 'text',
                            options: [],
                        },
                        image: null,
                    },
                    next_due_date: {
                        name: 'Próximo vencimento',
                        width: {
                            desktop: 30,
                            mobile: 100,
                        },
                        value: '',
                        required: true,
                        disabled: false,
                        input: {
                            type: 'date',
                            holder: 'Digite o vencimento',
                            length: null,
                            mask: null,
                            prev: null,
                            next: null,
                            button: null,
                        },
                        select: null,
                        list: null,
                        image: null,
                    },
                    total: {
                        name: 'Total',
                        width: {
                            desktop: 20,
                            mobile: 100,
                        },
                        value: '0,00',
                        required: false,
                        disabled: true,
                        input: {
                            type: 'text',
                            holder: null,
                            length: null,
                            mask: 'price',
                            prev: 'R$',
                            next: null,
                            button: null,
                        },
                        select: null,
                        list: null,
                        image: null,
                    },
                    period: {
                        name: 'Período',
                        width: {
                            desktop: 25,
                            mobile: 100,
                        },
                        value: 'monthly',
                        required: true,
                        disabled: false,
                        input: null,
                        select: {
                            options: [
                                {name: 'Mensal', value: 'monthly'},
                                {name: 'Bimestral', value: 'bimonthly'},
                                {name: 'Trimestral', value: 'quarterly'},
                                {name: 'Semestral', value: 'semiannual'},
                                {name: 'Anual', value: 'yearly'},
                            ],
                        },
                        list: null,
                        image: null,
                    },
                    payment: {
                        name: 'Pagamento',
                        width: {
                            desktop: 25,
                            mobile: 100,
                        },
                        value: '',
                        required: true,
                        disabled: false,
                        input: null,
                        select: {
                            options: [],
                        },
                        list: null,
                        image: null,
                    },
                    send: {
                        name: 'Enviar notificações',
                        width: {
                            desktop: 25,
                            mobile: 100,
                        },
                        value: 'on',
                        required: true,
                        disabled: false,
                        input: null,
                        select: {
                            options: [
                                {name: 'Sim', value: 'on'},
                                {name: 'Não', value: 'off'},
                            ],
                        },
                        list: null,
                        image: null,
                    },
                    status: {
                        name: 'Status',
                        width: {
                            desktop: 25,
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
                    note: {
                        name: 'Anotações',
                        width: {
                            desktop: 100,
                            mobile: 100,
                        },
                        value: '',
                        required: false,
                        disabled: false,
                        input: {
                            type: 'textarea',
                            holder: 'Digite as anotações',
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
            services: {
                name: 'Serviços',
                type: 'multi',
                fields: {
                    quantity: {
                        name: 'Quantidade',
                        width: {
                            desktop: 20,
                            mobile: 100,
                        },
                        value: '1',
                        required: true,
                        disabled: false,
                        input: {
                            type: 'text',
                            holder: 'Digite a quantidade',
                            length: null,
                            mask: 'number',
                            prev: null,
                            next: null,
                            button: null,
                        },
                        select: null,
                        list: null,
                        image: null,
                    },
                    services: {
                        name: 'Serviço',
                        width: {
                            desktop: 60,
                            mobile: 100,
                        },
                        value: '',
                        required: true,
                        disabled: false,
                        input: null,
                        select: null,
                        list: {
                            type: 'text',
                            options: [],
                        },
                        image: null,
                    },
                    price: {
                        name: 'Preço unitário',
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
        if(database && !database.results){
            setAdd('services');
        }
        if($('.group[tab="services"] .subgroup').length==1){
            $('.group[tab="services"] .subgroup .subgroup__options button[onclick="setDel(this)"]').hide();
        }else{
            $('.group[tab="services"] .subgroup .subgroup__options button[onclick="setDel(this)"]').show();
        }
        $('.group[tab="services"] .subgroup .subgroup__options button[onclick="setUp(this)"]').hide();
        $('.group[tab="services"] .subgroup .subgroup__options button[onclick="setDown(this)"]').hide();
        setInterval(function(){
            var total = 0;
            $('.group[tab="services"] .subgroup .subgroup__form').each(function(){
                var quantity = $(this).find('.item:nth-child(1) input').val()>0?$(this).find('.item:nth-child(1) input').val():1;
                var price = $(this).find('.item:nth-child(3) input').val()!='0,00'?$(this).find('.item:nth-child(3) input').val():0;
                total += parseInt(quantity)*parseFloat(price);
            });
            $('#total').val(parseFloat(total).toLocaleString('pt-br',{minimumFractionDigits: 2, maximumFractionDigits: 2}));
        },1000);
    }
}