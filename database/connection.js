const mongoose = require("mongoose");

//DB connection
mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("DBConnection Successful"))
    .catch((err) => {
        console.log(err)
    });