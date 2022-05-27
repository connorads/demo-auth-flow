const express = require("express");
const bodyParser = require("body-parser");
const { config } = require("./config");
const { userLogin, getUserConnections } = require("./controllers/user");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/login', userLogin);
app.get('/user/:userId/connections', getUserConnections)

app.listen(config.port, () => {
  console.log(`Server listening on ${config.port}`);
});