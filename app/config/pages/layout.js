window['Layout'] = class Layout{
    constructor(){
        this.get = {
            id: 'Layout',
            texts: {
                title: 'Layout',
                search: null,
                add: null,
                register: null,
            },
            endpoint: 'layout',
            bulk: null,
            call:  null,
            filter: null,
            columns: null,
        }
        this.set ={
            general: {
                name: 'Email',
                type: 'normal',
                fields: {
                    email_font: {
                        name: 'Tipo da fonte',
                        width: {
                            desktop: 100,
                            mobile: 100,
                        },
                        value: '',
                        required: true,
                        disabled: false,
                        input: null,
                        select: null,
                        list: {
                            type: 'font',
                            options: [],
                        },
                        image: null,
                    },
                    email_main_size: {
                        name: 'Tamanho da fonte do conteúdo',
                        width: {
                            desktop: 33.33,
                            mobile: 100,
                        },
                        value: '',
                        required: true,
                        disabled: false,
                        input: null,
                        select: null,
                        list: {
                            type: 'size',
                            options: [],
                        },
                        image: null,
                    },
                    email_main_color: {
                        name: 'Cor da fonte do conteúdo',
                        width: {
                            desktop: 33.33,
                            mobile: 100,
                        },
                        value: '',
                        required: true,
                        disabled: false,
                        input: null,
                        select: null,
                        list: {
                            type: 'color',
                            options: [],
                        },
                        image: null,
                    },
                    email_main_title: {
                        name: 'Cor do título do conteúdo',
                        width: {
                            desktop: 33.33,
                            mobile: 100,
                        },
                        value: '',
                        required: true,
                        disabled: false,
                        input: null,
                        select: null,
                        list: {
                            type: 'color',
                            options: [],
                        },
                        image: null,
                    },
                    email_header_size: {
                        name: 'Tamanho da fonte do cabeçalho',
                        width: {
                            desktop: 33.33,
                            mobile: 100,
                        },
                        value: '',
                        required: true,
                        disabled: false,
                        input: null,
                        select: null,
                        list: {
                            type: 'size',
                            options: [],
                        },
                        image: null,
                    },
                    email_header_color: {
                        name: 'Cor da fonte do cabeçalho',
                        width: {
                            desktop: 33.33,
                            mobile: 100,
                        },
                        value: '',
                        required: true,
                        disabled: false,
                        input: null,
                        select: null,
                        list: {
                            type: 'color',
                            options: [],
                        },
                        image: null,
                    },
                    email_header_background: {
                        name: 'Cor do fundo do cabeçalho',
                        width: {
                            desktop: 33.33,
                            mobile: 100,
                        },
                        value: '',
                        required: true,
                        disabled: false,
                        input: null,
                        select: null,
                        list: {
                            type: 'color',
                            options: [],
                        },
                        image: null,
                    },
                    email_footer_size: {
                        name: 'Tamanho da fonte do rodapé',
                        width: {
                            desktop: 33.33,
                            mobile: 100,
                        },
                        value: '',
                        required: true,
                        disabled: false,
                        input: null,
                        select: null,
                        list: {
                            type: 'size',
                            options: [],
                        },
                        image: null,
                    },
                    email_footer_color: {
                        name: 'Cor da fonte do rodapé',
                        width: {
                            desktop: 33.33,
                            mobile: 100,
                        },
                        value: '',
                        required: true,
                        disabled: false,
                        input: null,
                        select: null,
                        list: {
                            type: 'color',
                            options: [],
                        },
                        image: null,
                    },
                    email_footer_background: {
                        name: 'Cor do fundo do rodapé',
                        width: {
                            desktop: 33.33,
                            mobile: 100,
                        },
                        value: '',
                        required: true,
                        disabled: false,
                        input: null,
                        select: null,
                        list: {
                            type: 'color',
                            options: [],
                        },
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
        $('.top__name').text('Layout');
        $('.up__title').text('Layout');
        $('.top__return').hide();
        $('button[code="deletar"]').hide();
    }
}