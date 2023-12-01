window['Invoices'] = class Invoices{
    constructor(){
        this.get = {
            id: 'Invoices',
            texts: {
                title: 'Faturas',
                search: 'Buscar em faturas',
                add: 'Nova fatura',
                register: 'Crie sua primeira fatura.',
            },
            endpoint: 'invoices',
            bulk: {
                activate: 'Ativar',
                deactivate: 'Desativar',
                delete: 'Excluir',
            },
            call: {
                date: rangeDate(),
                status: 'waiting,late',
                order: 'due_date DESC',
                customers: 'on',
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
                        {name: 'Pendente', value: 'waiting,late'},
                        {name: 'Aguardando', value: 'waiting'},
                        {name: 'Pago', value: 'paid'},
                        {name: 'Atrasado', value: 'late'},
                        {name: 'Cancelado', value: 'canceled'},
                    ],
                },
                customers: {
                    name: 'Clientes',
                    type: 'select',
                    options: [
                        {name: 'Todos', value: ''},
                        {name: 'Ativo', value: 'on'},
                        {name: 'Inativo', value: 'off'},
                    ],
                }
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
                            link: `set(['Invoices'],'id')`,
                            mobile: true,
                        },
                        subscription: {
                            type: 'normal',
                            text: '[text]',
                            link: `set(['Subscription'],'name')`,
                            mobile: false,
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
                due_date: {
                    name: 'Vencimento',
                    width: 15,
                    row: {
                        due_date: {
                            type: 'normal',
                            text: '[text]',
                            link: null,
                            mobile: true,
                        },
                    },
                },
                payday: {
                    name: 'Pagamento',
                    width: 15,
                    row: {
                        payday: {
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
                    due_date: {
                        name: 'Vencimento',
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
                    subscription: {
                        name: 'Assinatura',
                        width: {
                            desktop: 33.33,
                            mobile: 100,
                        },
                        value: '',
                        required: false,
                        disabled: true,
                        input: {
                            type: 'text',
                            holder: null,
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
                    payment: {
                        name: 'Pagamento',
                        width: {
                            desktop: 33.33,
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
                            desktop: 33.33,
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
                    transaction: {
                        name: 'Transação',
                        width: {
                            desktop: 33.33,
                            mobile: 100,
                        },
                        value: '',
                        required: false,
                        disabled: true,
                        input: {
                            type: 'text',
                            holder: null,
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
                    barcode: {
                        name: 'Código de Barras',
                        width: {
                            desktop: 50,
                            mobile: 100,
                        },
                        value: '',
                        required: false,
                        disabled: true,
                        input: {
                            type: 'text',
                            holder: null,
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
                    pixcode: {
                        name: 'Código do Pix',
                        width: {
                            desktop: 50,
                            mobile: 100,
                        },
                        value: '',
                        required: false,
                        disabled: true,
                        input: {
                            type: 'text',
                            holder: null,
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
                    payday: {
                        name: 'Data do Pagamento',
                        width: {
                            desktop: 33.33,
                            mobile: 100,
                        },
                        value: '',
                        required: false,
                        disabled: true,
                        input: {
                            type: 'text',
                            holder: null,
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
                    status: {
                        name: 'Status',
                        width: {
                            desktop: 33.33,
                            mobile: 100,
                        },
                        value: 'waiting',
                        required: true,
                        disabled: false,
                        input: null,
                        select: {
                            options: [
                                {name: 'Aguardando', value: 'waiting'},
                                {name: 'Pago', value: 'paid'},
                                {name: 'Atrasado', value: 'late'},
                                {name: 'Cancelado', value: 'canceled'},
                            ],
                        },
                        list: null,
                        image: null,
                    },
                    type: {
                        name: 'Criação da Fatura',
                        width: {
                            desktop: 33.33,
                            mobile: 100,
                        },
                        value: '',
                        required: false,
                        disabled: true,
                        input: {
                            type: 'text',
                            holder: null,
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
            notifications: {
                name: 'Notificações',
                type: 'multi',
                fields: {
                    text: {
                        name: 'Notificação',
                        width: {
                            desktop: 100,
                            mobile: 100,
                        },
                        value: '',
                        required: false,
                        disabled: true,
                        input: {
                            type: 'text',
                            holder: null,
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
        if(!database || !database.results){
            $('#transaction').parent().parent().hide();
            $('#barcode').parent().parent().hide();
            $('#pixcode').parent().parent().hide();
            $('#type').parent().parent().hide();
            $('#payday').parent().parent().hide();
            $('#subscription').parent().parent().hide();
            $('.tab__item[code="notifications"]').hide();
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
        }else{
            $('#send').parent().parent().hide();
            $('#payment').attr('disabled',true);
            $('#due_date').attr('disabled',true);
            $('#customer').attr('disabled',true);
            if(database.results.subscription){
                $('button[code="deletar"]').hide();
            }
            //services
            $('.group[tab="services"] .subgroup__options').remove();
            $('.group[tab="services"] .group__button').remove();
            $('.group[tab="services"] .subgroup__form').css('width','100%');
            $('.group[tab="services"] input').attr('disabled',true);
            $('.group[tab="services"] .subgroup').css({'border-bottom':'none','margin-bottom':'0','padding-bottom':'0'});
            //notifications
            $('.group[tab="notifications"] .subgroup__options').remove();
            $('.group[tab="notifications"] .item__name').remove();
            $('.group[tab="notifications"] .group__button').remove();
            $('.group[tab="notifications"] .subgroup__form').css('width','100%');
            $('.group[tab="notifications"] input').css('margin-top','0');
            $('.group[tab="notifications"] .subgroup').css({'border-bottom':'none','margin-bottom':'0','padding-bottom':'0'});
            //pdf
            if(database.results.pdf){
                $('.button').append(`
                    <button class="yellow" onclick="window.open('${database.results.pdf}');"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 448V64h18v384H0zm26.9-.3V64H36v383.7h-9.1zm27.1 0V64h8.9v383.7H54zm44.9 0V64h8.9v383.7h-8.9zm36 0V64h17.7v383.7h-17.7zm44.9 0V64h8.9v383.7h-8.9zm18 0V64h8.9v383.7h-8.9zm18 0V64h8.9v383.7h-8.9zm35.7 0V64h18v383.7h-18zm44.9 0V64h18v383.7h-18zm36 0V64h18v383.7h-18zm36 0V64h18v383.7h-18zm26.9 0V64h18v383.7h-18zm45.1 0V64h26.9v383.7h-26.9zm35.7 0V64h9.1v383.7H476zm18 .3V64h18v384h-18z"/></svg>Boleto</button>
                `);
            }
        }   
    }
}