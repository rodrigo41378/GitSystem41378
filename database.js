// database/database.js
// Módulo simples que isola o acesso ao SQLite.
// Exporta a classe Database conforme exigido: module.exports = { Database }
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor(filename) {
    this.filename = filename || path.join(__dirname, '..', 'data', 'database.sqlite');
    this.db = null;
  }

  // inicializa a conexão e cria as tabelas se necessário
  init() {
    const self = this;
    return new Promise((resolve, reject) => {
      self.db = new sqlite3.Database(self.filename, (err) => {
        if (err) return reject(err);
        // criar tabelas simples: authors, books
        const createAuthors = `CREATE TABLE IF NOT EXISTS authors (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          bio TEXT
        );`;
        const createBooks = `CREATE TABLE IF NOT EXISTS books (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          authorId TEXT NOT NULL,
          year INTEGER,
          FOREIGN KEY(authorId) REFERENCES authors(id)
        );`;
        self.db.serialize(() => {
          self.db.run("PRAGMA foreign_keys = ON;");
          self.db.run(createAuthors);
          self.db.run(createBooks, (err2) => {
            if (err2) return reject(err2);
            resolve();
          });
        });
      });
    });
  }

  // helpers que retornam Promises
  run(sql, params=[]) {
    const self = this;
    return new Promise((resolve, reject) => {
      self.db.run(sql, params, function(err) {
        if (err) return reject(err);
        resolve({ id: this.lastID, changes: this.changes });
      });
    });
  }

  get(sql, params=[]) {
    const self = this;
    return new Promise((resolve, reject) => {
      self.db.get(sql, params, (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  }

  all(sql, params=[]) {
    const self = this;
    return new Promise((resolve, reject) => {
      self.db.all(sql, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  // authors CRUD
  getAuthors() {
    return this.all('SELECT * FROM authors;');
  }
  getAuthor(id) {
    return this.get('SELECT * FROM authors WHERE id = ?;', [id]);
  }
  createAuthor(author) {
    const sql = 'INSERT INTO authors (id, name, bio) VALUES (?, ?, ?);';
    return this.run(sql, [author.id, author.name, author.bio || null]);
  }
  updateAuthor(id, data) {
    const sql = 'UPDATE authors SET name = COALESCE(?, name), bio = COALESCE(?, bio) WHERE id = ?;';
    return this.run(sql, [data.name, data.bio, id]);
  }
  deleteAuthor(id) {
    const sql = 'DELETE FROM authors WHERE id = ?;';
    return this.run(sql, [id]);
  }

  // books CRUD
  getBooks() {
    return this.all('SELECT * FROM books;');
  }
  getBook(id) {
    return this.get('SELECT * FROM books WHERE id = ?;', [id]);
  }
  createBook(book) {
    const sql = 'INSERT INTO books (id, title, authorId, year) VALUES (?, ?, ?, ?);';
    return this.run(sql, [book.id, book.title, book.authorId, book.year || null]);
  }
  updateBook(id, data) {
    const sql = 'UPDATE books SET title = COALESCE(?, title), authorId = COALESCE(?, authorId), year = COALESCE(?, year) WHERE id = ?;';
    return this.run(sql, [data.title, data.authorId, data.year, id]);
  }
  deleteBook(id) {
    const sql = 'DELETE FROM books WHERE id = ?;';
    return this.run(sql, [id]);
  }
}

module.exports = { Database };
