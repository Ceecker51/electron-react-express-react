const express = require("express");
const path = require("path");

function createServer() {
  const app = express();

  // Serve the static files from the React app
  app.use(express.static(path.join(__dirname, "../server/build")));

  // An api endpoint that returns a short list of items
  app.get("/api/getList", (req, res) => {
    var list = ["item1", "item2", "item3"];
    res.json(list);
    console.log("Sent list of items");
  });

  // Handles any requests that don't match the ones above
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../server/build/index.html"));
  });

  const port = process.env.PORT || 5000;
  const server = app.listen(port);

  console.log("App is listening on port " + port);

  return server;
}

module.exports = {
  createServer
}
