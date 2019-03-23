const express = require("express");
const networkController = require("./controllers/networkController");
const bodyParser = require("body-parser");

// db instance connection

require("./config/db");
const app = express();
const port = process.env.PORT || 3001;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// API end points

app.get('/api/neuralnetwork', networkController.runNetwork);


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});