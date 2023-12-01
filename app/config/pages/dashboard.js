window['Dashboard'] = class Dashboard{
    constructor(){
        this.get = {
            id: 'Dashboard',
            texts: {
                title: 'Dashboard',
                search: null,
                add: null,
                register: null,
            },
            endpoint: 'dashboard',
            bulk: null,
            call: null,
            filter: null,
            columns: null,
        }
        this.set = null;
    }
    custom(database=null,attr=null){
        $.each(database.total,function(key,val){
            $(`.menu .menu__item[menu="${key}"] .menu__number`).text(val);
            $(`.menu__footer__item[menu="${key}"] .menu__footer__alert`).text(val);
            $(`.up__item[menu="${key}"] .up__alert`).text(val);
        });
        $('.main').html(`
            <div class="top">
                <div class="top__title">
                    <div class="top__name">Dashboard</div>
                </div>
            </div>
            <div class="dashboard">
                <div class="dashboard__25">
                    <div class="dashboard__flex">
                        <div class="dashboard__icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm32 32h-64c-17.6 0-33.5 7.1-45.1 18.6 40.3 22.1 68.9 62 75.1 109.4h66c17.7 0 32-14.3 32-32v-32c0-35.3-28.7-64-64-64zm-256 0c61.9 0 112-50.1 112-112S381.9 32 320 32 208 82.1 208 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C179.6 288 128 339.6 128 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zm-223.7-13.4C161.5 263.1 145.6 256 128 256H64c-35.3 0-64 28.7-64 64v32c0 17.7 14.3 32 32 32h65.9c6.3-47.4 34.9-87.3 75.2-109.4z"/></svg></div>
                        <div class="dashboard__number">
                            <p>${database.dashboard.customers}</p>
                            <span>${database.dashboard.customers>1?'clientes ativos':'cliente ativo'}</span>
                        </div>
                    </div>
                </div>
                <div class="dashboard__25">
                    <div class="dashboard__flex">
                        <div class="dashboard__icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M12.41 148.02l232.94 105.67c6.8 3.09 14.49 3.09 21.29 0l232.94-105.67c16.55-7.51 16.55-32.52 0-40.03L266.65 2.31a25.607 25.607 0 0 0-21.29 0L12.41 107.98c-16.55 7.51-16.55 32.53 0 40.04zm487.18 88.28l-58.09-26.33-161.64 73.27c-7.56 3.43-15.59 5.17-23.86 5.17s-16.29-1.74-23.86-5.17L70.51 209.97l-58.1 26.33c-16.55 7.5-16.55 32.5 0 40l232.94 105.59c6.8 3.08 14.49 3.08 21.29 0L499.59 276.3c16.55-7.5 16.55-32.5 0-40zm0 127.8l-57.87-26.23-161.86 73.37c-7.56 3.43-15.59 5.17-23.86 5.17s-16.29-1.74-23.86-5.17L70.29 337.87 12.41 364.1c-16.55 7.5-16.55 32.5 0 40l232.94 105.59c6.8 3.08 14.49 3.08 21.29 0L499.59 404.1c16.55-7.5 16.55-32.5 0-40z"/></svg></div>
                        <div class="dashboard__number">
                            <p>${database.dashboard.groups}</p>
                            <span>${database.dashboard.groups>1?'grupos ativos':'grupo ativo'}</span>
                        </div>
                    </div>
                </div>
                <div class="dashboard__25">
                    <div class="dashboard__flex">
                        <div class="dashboard__icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M288 130.54V112h16c8.84 0 16-7.16 16-16V80c0-8.84-7.16-16-16-16h-96c-8.84 0-16 7.16-16 16v16c0 8.84 7.16 16 16 16h16v18.54C115.49 146.11 32 239.18 32 352h448c0-112.82-83.49-205.89-192-221.46zM496 384H16c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h480c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16z"/></svg></div>
                        <div class="dashboard__number">
                            <p>${database.dashboard.services}</p>
                            <span>${database.dashboard.services>1?'serviços ativos':'serviço ativo'}</span>
                        </div>
                    </div>
                </div>
                <div class="dashboard__25">
                    <div class="dashboard__flex">
                        <div class="dashboard__icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M509.5 184.6L458.9 32.8C452.4 13.2 434.1 0 413.4 0H272v192h238.7c-.4-2.5-.4-5-1.2-7.4zM240 0H98.6c-20.7 0-39 13.2-45.5 32.8L2.5 184.6c-.8 2.4-.8 4.9-1.2 7.4H240V0zM0 224v240c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48V224H0z"/></svg></div>
                        <div class="dashboard__number">
                            <p>${database.dashboard.subscriptions}</p>
                            <span>${database.dashboard.subscriptions>1?'assinaturas ativas':'assinatura ativa'}</span>
                        </div>
                    </div>
                </div>
                <div class="dashboard__33">
                    <div class="dashboard__flex">
                        <div class="dashboard__icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M377 105L279.1 7c-4.5-4.5-10.6-7-17-7H256v128h128v-6.1c0-6.3-2.5-12.4-7-16.9zm-153 31V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zM64 72c0-4.42 3.58-8 8-8h80c4.42 0 8 3.58 8 8v16c0 4.42-3.58 8-8 8H72c-4.42 0-8-3.58-8-8V72zm0 80v-16c0-4.42 3.58-8 8-8h80c4.42 0 8 3.58 8 8v16c0 4.42-3.58 8-8 8H72c-4.42 0-8-3.58-8-8zm144 263.88V440c0 4.42-3.58 8-8 8h-16c-4.42 0-8-3.58-8-8v-24.29c-11.29-.58-22.27-4.52-31.37-11.35-3.9-2.93-4.1-8.77-.57-12.14l11.75-11.21c2.77-2.64 6.89-2.76 10.13-.73 3.87 2.42 8.26 3.72 12.82 3.72h28.11c6.5 0 11.8-5.92 11.8-13.19 0-5.95-3.61-11.19-8.77-12.73l-45-13.5c-18.59-5.58-31.58-23.42-31.58-43.39 0-24.52 19.05-44.44 42.67-45.07V232c0-4.42 3.58-8 8-8h16c4.42 0 8 3.58 8 8v24.29c11.29.58 22.27 4.51 31.37 11.35 3.9 2.93 4.1 8.77.57 12.14l-11.75 11.21c-2.77 2.64-6.89 2.76-10.13.73-3.87-2.43-8.26-3.72-12.82-3.72h-28.11c-6.5 0-11.8 5.92-11.8 13.19 0 5.95 3.61 11.19 8.77 12.73l45 13.5c18.59 5.58 31.58 23.42 31.58 43.39 0 24.53-19.05 44.44-42.67 45.07z"/></svg></div>
                        <div class="dashboard__number">
                            <p>${database.dashboard.paid}</p>
                            <span>${database.dashboard.paid>1?'faturas confirmadas hoje':'fatura confirmada hoje'}</span>
                            <span>R$ ${parseFloat(database.dashboard.paid).toLocaleString('pt-br',{minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                        </div>
                    </div>
                    <div class="dashboard__flex">
                        <div class="dashboard__text">
                            <p><strong>${database.dashboard.paid7}</strong> nos últimos 7 dias - R$ ${parseFloat(database.dashboard.paid7_value).toLocaleString('pt-br',{minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                            <p><strong>${database.dashboard.paid30}</strong> nos últimos 30 dias - R$ ${parseFloat(database.dashboard.paid30_value).toLocaleString('pt-br',{minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                        </div>
                    </div>
                </div>
                <div class="dashboard__33">
                    <div class="dashboard__flex">
                        <div class="dashboard__icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M377 105L279.1 7c-4.5-4.5-10.6-7-17-7H256v128h128v-6.1c0-6.3-2.5-12.4-7-16.9zm-153 31V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zM64 72c0-4.42 3.58-8 8-8h80c4.42 0 8 3.58 8 8v16c0 4.42-3.58 8-8 8H72c-4.42 0-8-3.58-8-8V72zm0 80v-16c0-4.42 3.58-8 8-8h80c4.42 0 8 3.58 8 8v16c0 4.42-3.58 8-8 8H72c-4.42 0-8-3.58-8-8zm144 263.88V440c0 4.42-3.58 8-8 8h-16c-4.42 0-8-3.58-8-8v-24.29c-11.29-.58-22.27-4.52-31.37-11.35-3.9-2.93-4.1-8.77-.57-12.14l11.75-11.21c2.77-2.64 6.89-2.76 10.13-.73 3.87 2.42 8.26 3.72 12.82 3.72h28.11c6.5 0 11.8-5.92 11.8-13.19 0-5.95-3.61-11.19-8.77-12.73l-45-13.5c-18.59-5.58-31.58-23.42-31.58-43.39 0-24.52 19.05-44.44 42.67-45.07V232c0-4.42 3.58-8 8-8h16c4.42 0 8 3.58 8 8v24.29c11.29.58 22.27 4.51 31.37 11.35 3.9 2.93 4.1 8.77.57 12.14l-11.75 11.21c-2.77 2.64-6.89 2.76-10.13.73-3.87-2.43-8.26-3.72-12.82-3.72h-28.11c-6.5 0-11.8 5.92-11.8 13.19 0 5.95 3.61 11.19 8.77 12.73l45 13.5c18.59 5.58 31.58 23.42 31.58 43.39 0 24.53-19.05 44.44-42.67 45.07z"/></svg></div>
                        <div class="dashboard__number">
                            <p>${database.dashboard.waiting}</p>
                            <span>${database.dashboard.waiting>1?'faturas a receber hoje':'fatura a receber hoje'}</span>
                            <span>R$ ${parseFloat(database.dashboard.waiting_value).toLocaleString('pt-br',{minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                        </div>
                    </div>
                    <div class="dashboard__flex">
                        <div class="dashboard__text">
                            <p><strong>${database.dashboard.waiting7}</strong> nos últimos 7 dias - R$ ${parseFloat(database.dashboard.waiting7_value).toLocaleString('pt-br',{minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                            <p><strong>${database.dashboard.waiting30}</strong> nos últimos 30 dias - R$ ${parseFloat(database.dashboard.waiting30_value).toLocaleString('pt-br',{minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                        </div>
                    </div>
                </div>
                <div class="dashboard__33">
                    <div class="dashboard__flex">
                        <div class="dashboard__icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M377 105L279.1 7c-4.5-4.5-10.6-7-17-7H256v128h128v-6.1c0-6.3-2.5-12.4-7-16.9zm-153 31V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zM64 72c0-4.42 3.58-8 8-8h80c4.42 0 8 3.58 8 8v16c0 4.42-3.58 8-8 8H72c-4.42 0-8-3.58-8-8V72zm0 80v-16c0-4.42 3.58-8 8-8h80c4.42 0 8 3.58 8 8v16c0 4.42-3.58 8-8 8H72c-4.42 0-8-3.58-8-8zm144 263.88V440c0 4.42-3.58 8-8 8h-16c-4.42 0-8-3.58-8-8v-24.29c-11.29-.58-22.27-4.52-31.37-11.35-3.9-2.93-4.1-8.77-.57-12.14l11.75-11.21c2.77-2.64 6.89-2.76 10.13-.73 3.87 2.42 8.26 3.72 12.82 3.72h28.11c6.5 0 11.8-5.92 11.8-13.19 0-5.95-3.61-11.19-8.77-12.73l-45-13.5c-18.59-5.58-31.58-23.42-31.58-43.39 0-24.52 19.05-44.44 42.67-45.07V232c0-4.42 3.58-8 8-8h16c4.42 0 8 3.58 8 8v24.29c11.29.58 22.27 4.51 31.37 11.35 3.9 2.93 4.1 8.77.57 12.14l-11.75 11.21c-2.77 2.64-6.89 2.76-10.13.73-3.87-2.43-8.26-3.72-12.82-3.72h-28.11c-6.5 0-11.8 5.92-11.8 13.19 0 5.95 3.61 11.19 8.77 12.73l45 13.5c18.59 5.58 31.58 23.42 31.58 43.39 0 24.53-19.05 44.44-42.67 45.07z"/></svg></div>
                        <div class="dashboard__number">
                            <p>${database.dashboard.late}</p>
                            <span>${database.dashboard.late>1?'faturas atrasadas hoje':'fatura atrasada hoje'}</span>
                            <span>R$ ${parseFloat(database.dashboard.late_value).toLocaleString('pt-br',{minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                        </div>
                    </div>
                    <div class="dashboard__flex">
                        <div class="dashboard__text">
                            <p><strong>${database.dashboard.late7}</strong> nos últimos 7 dias - R$ ${parseFloat(database.dashboard.late7_value).toLocaleString('pt-br',{minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                            <p><strong>${database.dashboard.late30}</strong> nos últimos 30 dias - R$ ${parseFloat(database.dashboard.late30_value).toLocaleString('pt-br',{minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                        </div>
                    </div>
                </div>
                <div class="dashboard__50">
                    <div class="dashboard__title">Últimas confirmações</div>
                    <div class="dashboard__list" id="list-paids"></div>
                </div>
                <div class="dashboard__50">
                    <div class="dashboard__title">Últimos inadimplentes</div>
                    <div class="dashboard__list" id="list-lates"></div>
                </div>
            </div>
        `);
        $(database.dashboard.paids).each(function(){
            $('#list-paids').append(`
                <div class="dashboard__item">
                    <div class="dashboard__div" onclick="set(['Invoices'],'${this.id}');">
                        <div class="dashboard__item__date">${this.date}</div>
                        <div class="dashboard__item__name" style="width: calc(100% - 23vh);">${this.name}</div>
                        <div class="dashboard__item__total">R$ ${parseFloat(this.total).toLocaleString('pt-br',{minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                    </div>
                </div>
            `);
        });
        $(database.dashboard.lates).each(function(){
            $('#list-lates').append(`
                <div class="dashboard__item">
                    <div class="dashboard__div" onclick="set(['Invoices'],'${this.id}');">
                        <div class="dashboard__item__date">${this.date}</div>
                        <div class="dashboard__item__name" style="width: calc(100% - 23vh);">${this.name}</div>
                        <div class="dashboard__item__total">R$ ${parseFloat(this.total).toLocaleString('pt-br',{minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                    </div>
                </div>
            `);
        });
        $('main .main__background').fadeOut(500);
        return true;
    }
    customGet(database=null,attr=null){
        return false;
    }
    customSet(database=null,attr=null){
        return false;
    }
}