const express = require("express");

const server = express();
server.use(express.json());

const projects = [
  { id: 0, title: "Project X", tasks: [] },
  { id: 1, title: "Project Y", tasks: [] },
  { id: 2, title: "Project Z", tasks: [] }
];

let reqCount = 0;

server.use((req, res, next) => {
  console.time("Request");

  reqCount++;
  console.log(
    `Request Count: ${reqCount}; HTTP Method: ${req.method}; URL: ${req.url}`
  );

  next();

  console.timeEnd("Request");
});

function checkProjectTitleExists(req, res, next) {
  if (!req.body.title) {
    return res.status(400).json({ error: "Project title is required" });
  }

  return next();
}

function checkProjectInArray(req, res, next) {
  const project = projects[req.params.id];

  if (!project) {
    return res.status(400).json({ error: "Project does not exists" });
  }

  req.project = project;

  return next();
}

function checkProjectExistsInArray(req, res, next) {
  const project = projects[req.body.id];

  if (project) {
    return res.status(400).json({ error: "Project already exists" });
  }

  req.project = project;

  return next();
}

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.get("/projects/:id", checkProjectInArray, (req, res) => {
  const { id } = req.params;

  return res.json(projects[id]);
});

server.post(
  "/projects",
  checkProjectTitleExists,
  checkProjectExistsInArray,
  (req, res) => {
    const { id, title } = req.body;

    projects.push({ id: id, title: title, tasks: [] });

    return res.json(projects);
  }
);

server.post("/projects/:id/tasks", checkProjectInArray, (req, res) => {
  const { id } = req.params;
  const title = req.query.title;

  projects[id].tasks.push(title);

  return res.json(projects);
});

server.put(
  "/projects/:id",
  checkProjectTitleExists,
  checkProjectInArray,
  (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    projects[id].title = title;

    return res.json(projects);
  }
);

server.delete("/projects/:id", checkProjectInArray, (req, res) => {
  const { id } = req.params;

  projects.splice(id, 1);

  return res.send();
});

server.listen(3000);
