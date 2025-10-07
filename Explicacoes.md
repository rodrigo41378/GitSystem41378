**Explicação do projeto**

Foram usados slides de Banco de Dados 1 e 2, Estrutura de Dados 1 e 2, Programação Orientada a Objeto como referência.
Sendo assim, todo um sistema foi criado com base nas requisições do projeto.
O Prompt usado no ChatGPT: "Com base nas matérias citadas acima e nesses slides, devemos atender as requisições do [Projeto], dê as orientações e requisitos mínimos para uma boa execução desse projeto."  

# O objetivo desse projeto é aprender a criar uma API REST simples em Node.js, com:

* Dois recursos: Books (Livros) e Authors (Autores)
* Banco de dados SQLite
* Middlewares de CORS, Logs e Autenticação

2. O que cada arquivo faz:

* server.js
* Inicializa o servidor com Node.js e Express
* Conecta ao banco SQLite

Adiciona os middlewares:

* express.json() > permite enviar e receber dados em JSON
* cors.js > libera acesso de qualquer origem
* logger.js > mostra logs antes e depois da requisição
* Define rota pública /token para gerar tokens
* Registra rotas protegidas /books e /authors
* Trata erros globais
* package.json
* Guarda as informações do projeto

Define dependências:
* express → framework para criar API
* sqlite3 → banco de dados SQLite
* uuid → caso queira criar IDs únicos (não obrigatório nesse exemplo)
* nodemon → opcional para recarregar o servidor automaticamente ao salvar

Define scripts para rodar:
* npm start   # roda normalmente
* npm run dev # roda com nodemon, recarrega automaticamente
* database/database.js

* Isola toda a lógica do banco SQLite
* Cria tabelas authors e books se não existirem

Fornece funções para:
* Listar, criar, atualizar e deletar autores
* Cada função retorna promises, para poder usar async/await no código
* middlewares/cors.js
* Middleware CORS (Cross-Origin Resource Sharing)
* Permite que qualquer site acesse a API (apenas para aprendizado)

Configura métodos permitidos: GET, POST, PUT, DELETE, OPTIONS
* Se a requisição for OPTIONS (verificação do navegador), responde 204 e encerra
* middlewares/logger.js

Mostra logs de cada requisição
* Antes de entrar no handler: mostra [IN] método URL
* Depois de processar: mostra [OUT] método URL -> status (tempo ms)

Exemplo:
* [IN] GET /books
* [OUT] GET /books => 200 (2ms)

middlewares/auth.js

Middleware de autenticação simples
* Verifica se o header Authorization: Bearer <token> está presente
* Se não tiver, retorna 401 (não autorizado)
* A rota /token não exige token (porque é pública)
* Se o token estiver válido, adiciona req.user com os dados do usuário
* routes/authors.js e routes/books.js
* Cada arquivo define as rotas do recurso correspondente

CRUD completo:
* GET / > lista todos
* GET /:id > detalhes de um item
* POST / > cria novo item
* PUT /:id > atualiza item
* DELETE /:id > remove item

Faz tratamento de erros:
* 400 → erro de requisição
* 404 → item não encontrado
* 500 → erro interno do servidor
Exemplo: criar um livro

POST /books
{
  "title": "Harry Potter",
  "authorId": "12345",
  "year": 1997
}

data/store.js

Armazena tokens em memória para simplificar

Estrutura:
tokens = {
  "token123": { username: "admin", createdAt: 1696542349 }
}

Serve para o middleware de autenticação validar se o token existe

- Fluxo da aplicação (resumido)

* Usuário acessa /token → recebe token
* Usuário usa token para acessar /books ou /authors
* Middleware de autenticação verifica token
* Middleware de logs mostra entrada e saída
* Rotas fazem operações no banco SQLite

Resposta volta para o usuário

Banco de dados

Banco: SQLite, arquivo: data/database.sqlite

Tabelas:

CREATE TABLE authors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  bio TEXT
);

CREATE TABLE books (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  authorId TEXT NOT NULL,
  year INTEGER,
  FOREIGN KEY(authorId) REFERENCES authors(id)
);

O banco é criado automaticamente ao subir o servidor

- Como tudo funciona junto

* server.js importa os middlewares e rotas
* Middleware CORS + Logger → rodam em todas as requisições
* /token → rota pública
* authMiddleware → protege todas as rotas restantes
* /books e /authors → usam database.js para CRUD
* loggerMiddleware mostra antes e depois de cada requisição
* O banco SQLite guarda dados permanentes

Conclusão

* O projeto é simples, didático e funcional
* Permite criar, listar, atualizar e deletar livros e autores
* Middleware, autenticação e logs já estão implementados
* Banco SQLite armazena os dados em arquivo
* Pode ser expandido facilmente para outros recursos