const createApp = require("./app");
const app = createApp();

app.listen(3000, (err) => {
  if (err) return console.error(err);
  console.log("Server on port 3000");
});
