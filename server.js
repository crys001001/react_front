const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3001;

// Conectar ao banco de dados SQLite
let db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run("CREATE TABLE domains (id INTEGER PRIMARY KEY AUTOINCREMENT, domain TEXT, status TEXT)");
  db.run("INSERT INTO domains (domain, status) VALUES ('example.com', 'registered')");
});

app.use(express.json());

app.get('/api/domain/:domain', (req, res) => {
  const domain = req.params.domain;
  db.get('SELECT * FROM domains WHERE domain = ?', [domain], (err, row) => {
    if (err) {
      return res.status(500).send("Erro ao acessar o banco de dados.");
    }
    if (row) {
      res.json({ ldhName: row.domain, status: row.status });
    } else {
      res.status(404).send("Domínio não encontrado.");
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
