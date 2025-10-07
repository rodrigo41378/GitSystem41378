// middlewares/auth.js
// Middleware de autenticação simples (Aula 14)
// Rota /token deve ficar livre (essa rota é definida em server.js antes deste middleware)
const { tokens } = require('../data/store');

function authMiddleware(req, res, next) {
  if (req.path === '/token') return next();
  if (req.method === 'OPTIONS') return next();

  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ error: 'Authorization header missing' });

  const parts = header.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'Malformed Authorization header' });

  const token = parts[1];
  if (!tokens[token]) return res.status(401).json({ error: 'Invalid or expired token' });

  req.user = tokens[token];
  next();
}

module.exports = authMiddleware;
