const express = require("express");

const server = express();
server.use(express.json());

// Query params = /users/?nome=rodrigo
// Route params = /users/1
// Request body = { name: "Rodrigo", email: "rodrigo_fgf@hotmail.com" }

const users = ["Rodrigo", "Lucas", "Samuel"];

server.use((req, res, next) => {
  //Middleware global....útil para registrar logs, por exemplo
  console.time("Request");

  console.log(`Método: ${req.method}; URL: ${req.url}`);

  next();

  console.timeEnd("Request");
});

function checkUserExists(req, res, next) {
  //Função usada para validação do request no middleware local
  if (!req.body.user) {
    return res.status(400).json({ error: "User name is required" });
  }

  return next();
}

function checkUserInArray(req, res, next) {
  //Função usada para validação do request no middleware local

  const user = users[req.params.id];

  if (!user) {
    return res.status(400).json({ error: "User does not exists" });
  }

  req.user = user;

  return next();
}

server.get("/users", (req, res) => {
  return res.json(users);
});

server.get("/users/:id", checkUserInArray, (req, res) => {
  const nome = req.query.nome;
  //const id = req.params.id;
  const { id } = req.params; //Usando desestruturação do ES6
  console.log(`Buscando usuário ${id}`);

  //return res.json(users[id]);

  //Usando a variável setada pelo middleware
  return res.json(req.user);
});

server.post("/users", checkUserExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

server.put("/users/:id", checkUserExists, checkUserInArray, (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  users[id] = name;

  return res.json(users);
});

server.delete("/users/:id", checkUserInArray, (req, res) => {
  const { id } = req.params;

  users.splice(id, 1);

  return res.send();
});

server.listen(3000);
