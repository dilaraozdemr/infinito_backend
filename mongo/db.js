const mongo = require("mongoose");

const CONNECTION_STRING = "mongodb+srv://dilaraozdmr66:imLYGnBEwjz2lqjn@cluster0.u5j00v9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongo.connect(CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(()=>{
    console.log("Mongo db active")
}).catch((error) => {
    console.error("Error Mongo db", error);
});