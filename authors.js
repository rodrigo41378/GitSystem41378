// routes/authors.js
// Recebe a instância do db via factory: module.exports = (db) => router
const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // GET lista
  router.get('/', async (req, res, next) => {
    try {
      const authors = await db.getAuthors();
      res.json(authors);
    } catch (err) { next(err); }
  });

  // GET detalhe
  router.get('/:id', async (req, res, next) => {
    try {
      const author = await db.getAuthor(req.params.id);
      if (!author) return res.status(404).json({ error: 'Author not found' });
      res.json(author);
    } catch (err) { next(err); }
  });

  // POST criar
  router.post('/', async (req, res, next) => {
    try {
      const { name, bio } = req.body;
      if (!name) return res.status(400).json({ error: 'name required' });

      const id = String(Date.now());
      await db.createAuthor({ id, name, bio });
      const created = await db.getAuthor(id);
      res.status(201).json(created);
    } catch (err) { next(err); }
  });

  // PUT atualizar
  router.put('/:id', async (req, res, next) => {
    try {
      const author = await db.getAuthor(req.params.id);
      if (!author) return res.status(404).json({ error: 'Author not found' });
      const { name, bio } = req.body;
      await db.updateAuthor(req.params.id, { name, bio });
      const updated = await db.getAuthor(req.params.id);
      res.json(updated);
    } catch (err) { next(err); }
  });

  // DELETE remover (verifica livros ligados)
  router.delete('/:id', async (req, res, next) => {
    try {
      // verificar se há livros com esse authorId
      const books = await db.all('SELECT * FROM books WHERE authorId = ?;', [req.params.id]);
      if (books.length > 0) return res.status(400).json({ error: 'Author has books; cannot delete' });
      await db.deleteAuthor(req.params.id);
      res.status(204).end();
    } catch (err) { next(err); }
  });

  return router;
};
