const path = require("path");
const fs = require("fs");
const { createServer } = require("http");
const crypto = require("crypto");

const PORT = process.env.PORT || 4000;

function makeId() {
  return crypto.randomBytes(16).toString("hex");
}

async function sendGreetings(client) {
  const his = ["Hi", "Bonjour", "Hola", "Ciao", "Zdravo"];
  let i = 0;
  while (!client.res.destroyed) {
    client.res.write(`id: ${makeId()}\ndata: ${his[i]}\n\n`);
    console.log("sending", his[i]);
    i = (i + 1) % 5;
    await new Promise((resolve) => setTimeout(resolve, 5_000));
  }
}

function sseHandler(req, res) {
  const clientId = makeId();

  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
    "x-client-id": clientId,
  };
  res.writeHead(200, headers);

  const newClient = {
    id: clientId,
    req,
    res,
  };

  req.on("close", () => {
    console.log(`${clientId} Connection closed`);
  });

  sendGreetings(newClient);
}

console.log("creating server");
const indexFile = fs.readFileSync(path.join(__dirname, "/front.html"));

const server = createServer((req, res) => {
  // console.log("req", req.url);
  if (req.url === "/sse") {
    console.log("Connection opened");
    sseHandler(req, res);
  } else if (req.url === "/" && req.method === "GET") {
    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);
    res.end(indexFile);
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: "Resource not found" }));
  }
});

server.listen(PORT, () => {
  console.log(`✴️  server ready at port ${PORT}`);
});
