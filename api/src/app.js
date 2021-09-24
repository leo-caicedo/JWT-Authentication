const express = require("express");

const routes = require("./routes");

const createApp = () => {
  const app = express();

  // middleware
  app.use(express.json());

  // routes
  app.use("/api", routes);

  return app;
};

module.exports = createApp;
