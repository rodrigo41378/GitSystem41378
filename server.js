// server.js
// Ponto de entrada da aplicação - arranca o servidor, conecta o DB e monta middlewares e rotas.
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const corsMiddleware = require('./middlewares/cors');
const loggerMiddleware = require('./middlewares/logger');
const authMiddleware = require('./middlewares/auth');

const { Database } = require('./database/database');

// criar pasta data se não existir
const fs = require('fs');
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

// instanciar o banco (arquivo dentro de data/)
const dbFile = path.join(__dirname, 'data', 'database.sqlite');
const db = new Database(dbFile);

// middlewares globais simples
app.use(express.json());
app.use(corsMiddleware);
app.use(loggerMiddleware);

// Rota pública para gerar token simples (não usa JWT, é intencionalmente simples)
const { tokens } = require('./data/store');
app.post('/token', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });

  // validação simples para fins didáticos
  if (username === 'admin' && password === 'password') {
    const token = String(Date.now()) + Math.random().toString(36).slice(2,8);
    tokens[token] = { username, createdAt: Date.now() };
    return res.json({ token });
  }
  return res.status(401).json({ error: 'Invalid credentials' });
});

// Inicializar banco e só depois registrar as rotas que usam o DB
db.init()
  .then(() => {
    // aplicar autenticação a partir daqui (rota /token já ficou acima e é pública)
    app.use(authMiddleware);

    // rotas - passamos a instância do db para cada router
    app.use('/books', require('./routes/books')(db));
    app.use('/authors', require('./routes/authors')(db));

    // erro global simples
    app.use((err, req, res, next) => {
      console.error('Erro inesperado:', err);
      res.status(500).json({ error: 'Internal server error' });
    });

    app.listen(PORT, () => {
      console.log(`Server listening at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Erro ao inicializar o banco:', err);
    process.exit(1);
  });