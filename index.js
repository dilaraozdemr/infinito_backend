require("./mongo/db.js");
const bodyParser = require("body-parser")
const express = require("express");
const app = express();
const cors = require("cors");
const projectController  = require("./controller/projectController.js");
const newController  = require("./controller/newController.js");
const contactController  = require("./controller/contactController.js");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const PORT = process.env.PORT || 4000;
app.use(cors());
app.listen(PORT, () =>{
    console.log('Server is listening on port');
    console.log(PORT);
})

app.use("/api", projectController);
app.use("/api", newController);
app.use("/api", contactController);

