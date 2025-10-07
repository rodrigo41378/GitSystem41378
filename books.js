// routes/books.js
// Recebe a instância do db via factory: module.exports = (db) => router
const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // GET lista
  router.get('/', async (req, res, next) => {
    try {
      const books = await db.getBooks();
      res.json(books);
    } catch (err) { next(err); }
  });

  // GET detalhe
  router.get('/:id', async (req, res, next) => {
    try {
      const book = await db.getBook(req.params.id);
      if (!book) return res.status(404).json({ error: 'Book not found' });
      res.json(book);
    } catch (err) { next(err); }
  });

  // POST criar
  router.post('/', async (req, res, next) => {
    try {
      const { title, authorId, year } = req.body;
      if (!title || !authorId) return res.status(400).json({ error: 'title and authorId required' });

      // validar authorId
      const author = await db.getAuthor(authorId);
      if (!author) return res.status(400).json({ error: 'authorId invalid' });

      const id = String(Date.now());
      await db.createBook({ id, title, authorId, year });
      const created = await db.getBook(id);
      res.status(201).json(created);
    } catch (err) { next(err); }
  });

  // PUT atualizar
  router.put('/:id', async (req, res, next) => {
    try {
      const book = await db.getBook(req.params.id);
      if (!book) return res.status(404).json({ error: 'Book not found' });

      const { title, authorId, year } = req.body;
      if (authorId) {
        const author = await db.getAuthor(authorId);
        if (!author) return res.status(400).json({ error: 'authorId invalid' });
      }

      await db.updateBook(req.params.id, { title, authorId, year });
      const updated = await db.getBook(req.params.id);
      res.json(updated);
    } catch (err) { next(err); }
  });

  // DELETE remover
  router.delete('/:id', async (req, res, next) => {
    try {
      const book = await db.getBook(req.params.id);
      if (!book) return res.status(404).json({ error: 'Book not found' });
      await db.deleteBook(req.params.id);
      res.status(204).end();
    } catch (err) { next(err); }
  });

  return router;
};
