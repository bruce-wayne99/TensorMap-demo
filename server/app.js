const express = require("express");
const networkController = require("./controllers/networkController");
const bodyParser = require("body-parser");

// db instance connection

require("./config/db");
const app = express();
const port = process.env.PORT || 2000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// API end points

app.get('/api/neuralnetwork', networkController.getNetworks);


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});