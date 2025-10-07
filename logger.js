// middlewares/logger.js
// Logs antes do handler (entrada) e depois do handler (quando a resposta terminar)
function loggerMiddleware(req, res, next) {
  const start = Date.now();
  console.log(`[IN ] ${req.method} ${req.originalUrl}`);
  res.on('finish', () => {
    const ms = Date.now() - start;
    console.log(`[OUT] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms}ms)`);
  });
  next();
}

module.exports = loggerMiddleware;
