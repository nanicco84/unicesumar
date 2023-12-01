Projeto academico TCC2 para Unicesumar

APP
Essa pasta contém os arquivos da parte do frontend do sistema de cobranças, feito em HTML / JavaScript / CSS.
Dentro em assets, tem os dados base do sistema, como arquivos de estilização (CSS), os arquivos Javascript, que fazem as funcionalidades de listagem, edição de dados, uploads de imagens, etc.
Em config, temos os arquivos de cada sessão do sistema, lá configuro campos, tipos e personalização de cada tabela do banco de dados.

API
Essa pasta contém os arquivos de backend, apis responsáveis em pegar os dados do banco e alimentar o sistema, feito em PHP.
Utilizamos o framework Slim, para desenvolver a API, responsável em pegar os dados do banco para utilizar no sistema e salvar as informações.
Também tem funções para envio de emails, e tarefas crons que geram as faturas diariamentes, no automático.
