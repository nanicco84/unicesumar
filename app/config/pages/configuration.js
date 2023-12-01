window['Configuration'] = class Configuration{
    constructor(){
        this.get = {
            id: 'Configuration',
            texts: {
                title: 'Configuração',
                search: null,
                add: null,
                register: null,
            },
            endpoint: 'configuration',
            bulk: null,
            call:  null,
            filter: null,
            columns: null,
        }
        this.set = {
            general: {
                name: 'Geral',
                type: 'normal',
                fields: {
                    footer_logo: {
                        name: 'Status da loja',
                        width: {
                            desktop: 33.33,
                            mobile: 50,
                        },
                        value: 'on',
                        required: true,
                        disabled: false,
                        input: null,
                        select: {
                            options: [
                                {name: 'Ativo', value: 'on'},
                                {name: 'Manutenção', value: 'off'},
                            ],
                        },
                        image: null,
                    },
                    general_type: {
                        name: 'Tipo da loja',
                        width: {
                            desktop: 33.33,
                            mobile: 50,
                        },
                        value: 'shop',
                        required: true,
                        disabled: false,
                        input: null,
                        select: {
                            options: [],
                        },
                        image: null,
                    },
                    general_buyer: {
                        name: 'Compradores',
                        width: {
                            desktop: 33.33,
                            mobile: 50,
                        },
                        value: '',
                        required: true,
                        disabled: false,
                        input: null,
                        select: {
                            options: [],
                        },
                        image: null,
                    },
                    general_new: {
                        name: 'Página novidades',
                        width: {
                            desktop: 33.33,
                            mobile: 50,
                        },
                        value: '',
                        required: true,
                        disabled: false,
                        input: null,
                        select: {
                            options: [],
                        },
                        image: null,
                    },
                    general_outlet: {
                        name: 'Página outlet',
                        width: {
                            desktop: 33.33,
                            mobile: 50,
                        },
                        value: '',
                        required: true,
                        disabled: false,
                        input: null,
                        select: {
                            options: [],
                        },
                        image: null,
                    },
                },
            },
            home: {
                name: 'Home',
                type: 'normal',
                fields: {
                    home_about: {
                        name: 'Sobre nós',
                        width: {
                            desktop: 33.33,
                            mobile: 50,
                        },
                        value: 'off',
                        required: true,
                        disabled: false,
                        input: null,
                        select: {
                            options: [
                                {name: 'Mostrar', value: 'on'},
                                {name: 'Não mostrar', value: 'off'}
                            ],
                        },
                        list: null,
                        image: null,
                    },
                    home_category: {
                        name: 'Categorias',
                        width: {
                            desktop: 33.33,
                            mobile: 50,
                        },
                        value: 'off',
                        required: true,
                        disabled: false,
                        input: null,
                        select: {
                            options: [
                                {name: 'Mostrar', value: 'on'},
                                {name: 'Não mostrar', value: 'off'},
                            ],
                        },
                        list: null,
                        image: null,
                    },
                    home_outlet: {
                        name: 'Outlet',
                        width: {
                            desktop: 33.33,
                            mobile: 50,
                        },
                        value: 'on',
                        required: true,
                        disabled: false,
                        input: null,
                        select: {
                            options: [
                                {name: 'Mostrar', value: 'on'},
                                {name: 'Não mostrar', value: 'off'},
                            ],
                        },
                        list: null,
                        image: null,
                    },
                },
            },
            page: {
                name: 'Páginas',
                type: 'normal',
                fields: {
                    page_new: {
                        name: 'Novidades',
                        width: {
                            desktop: 33.33,
                            mobile: 50,
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
                    page_cart: {
                        name: 'Carrinho',
                        width: {
                            desktop: 33.33,
                            mobile: 50,
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
                    page_outlet: {
                        name: 'Outlet',
                        width: {
                            desktop: 33.33,
                            mobile: 50,
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
            company: {
                name: 'Empresa',
                type: 'normal',
                fields: {
                    company_address: {
                        name: 'Endereço da empresa',
                        width: {
                            desktop: 33.33,
                            mobile: 50,
                        },
                        value: 'on',
                        required: true,
                        disabled: false,
                        input: null,
                        select: {
                            options: [
                                {name: 'Mostrar', value: 'on'},
                                {name: 'Não mostrar', value: 'off'},
                            ],
                        },
                        list: null,
                        image: null,
                    },
                    company_document: {
                        name: 'CPF/CNPJ da empresa',
                        width: {
                            desktop: 33.33,
                            mobile: 50,
                        },
                        value: 'on',
                        required: true,
                        disabled: false,
                        input: null,
                        select: {
                            options: [
                                {name: 'Mostrar', value: 'on'},
                                {name: 'Não mostrar', value: 'off'},
                            ],
                        },
                        list: null,
                        image: null,
                    },
                    company_map: {
                        name: 'Mapa de localização',
                        width: {
                            desktop: 33.33,
                            mobile: 50,
                        },
                        value: 'on',
                        required: true,
                        disabled: false,
                        input: null,
                        select: {
                            options: [
                                {name: 'Mostrar', value: 'on'},
                                {name: 'Não mostrar', value: 'off'},
                            ],
                        },
                        list: null,
                        image: null,
                    },
                },
            },
            product: {
                name: 'Produtos',
                type: 'normal',
                fields: {
                    product_order: {
                        name: 'Ordenação',
                        width: {
                            desktop: 33.33,
                            mobile: 50,
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
                    product_exchange: {
                        name: 'Prazo para troca',
                        width: {
                            desktop: 33.33,
                            mobile: 50,
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
                    product_quantity: {
                        name: 'Quantidade do estoque',
                        width: {
                            desktop: 33.33,
                            mobile: 50,
                        },
                        value: 'on',
                        required: true,
                        disabled: false,
                        input: null,
                        select: {
                            options: [
                                {name: 'Mostrar', value: 'on'},
                                {name: 'Não mostrar', value: 'off'},
                            ],
                        },
                        list: null,
                        image: null,
                    },
                    product_installment: {
                        name: 'Parcelamento',
                        width: {
                            desktop: 33.33,
                            mobile: 50,
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
                    product_out_of_stock: {
                        name: 'Produtos sem estoque',
                        width: {
                            desktop: 33.33,
                            mobile: 50,
                        },
                        value: 'on',
                        required: true,
                        disabled: false,
                        input: null,
                        select: {
                            options: [
                                {name: 'Mostrar', value: 'on'},
                                {name: 'Não mostrar', value: 'off'},
                            ],
                        },
                        list: null,
                        image: null,
                    },
                },
            },
            checkout: {
                name: 'Checkout',
                type: 'normal',
                fields: {
                    checkout_registration: {
                        name: 'Cadastro obrigatório',
                        width: {
                            desktop: 33.33,
                            mobile: 50,
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
                    checkout_installment: {
                        name: 'Parcelamento',
                        width: {
                            desktop: 33.33,
                            mobile: 50,
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
                    checkout_coupon: {
                        name: 'Cupom de desconto',
                        width: {
                            desktop: 33.33,
                            mobile: 50,
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
                },
            },
            shipping: {
                name: 'Frete',
                type: 'normal',
                fields: {
                    shipping_cart: {
                        name: 'Frete no carrinho',
                        width: {
                            desktop: 33.33,
                            mobile: 50,
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
                    shipping_time: {
                        name: 'Prazo do frete',
                        width: {
                            desktop: 33.33,
                            mobile: 50,
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
                    shipping_product: {
                        name: 'Frete no produto',
                        width: {
                            desktop: 33.33,
                            mobile: 50,
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
                },
            },
            header: {
                name: 'Header',
                type: 'normal',
                fields: {
                    header_category: {
                        name: 'Quantidade de categorias',
                        width: {
                            desktop: 33.33,
                            mobile: 50,
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
                },
            },
            footer: {
                name: 'Footer',
                type: 'normal',
                fields: {
                    footer_logo: {
                        name: 'Logotipo',
                        width: {
                            desktop: 33.33,
                            mobile: 50,
                        },
                        value: 'off',
                        required: true,
                        disabled: false,
                        value: '',
                        input: null,
                        select: {
                            options: [
                                {name: 'Mostrar', value: 'on'},
                                {name: 'Não mostrar', value: 'off'},
                            ],
                        },
                        list: null,
                        image: null,
                    },
                    footer_payment: {
                        name: 'Formas de pagamentos',
                        width: {
                            desktop: 33.33,
                            mobile: 50,
                        },
                        value: 'on',
                        required: true,
                        disabled: false,
                        value: '',
                        input: null,
                        select: {
                            options: [
                                {name: 'Mostrar', value: 'on'},
                                {name: 'Não mostrar', value: 'off'},
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
        $('.top__name').text('Configuração');
        $('.up__title').text('Configuração');
        $('.top__return').hide();
        $('button[code="deletar"]').hide();
    }
}