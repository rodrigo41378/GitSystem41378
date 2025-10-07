// middlewares/cors.js
// Middleware CORS simples (Aula 11)
function corsMiddleware(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // desenvolvimento: permite todas origens
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();
  next();
}

module.exports = corsMiddleware;
