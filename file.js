const app = require("./app.js");

const port = 3000;

app.listen(port, () => {
  console.log(`Server Running at http://localhost:${port}/`);
});
