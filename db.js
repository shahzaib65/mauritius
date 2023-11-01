
const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config({path: './config.env'});

mongoose.set("strictQuery", false);

const connectToMongo = () => {
    mongoose.connect(process.env.DATABASE,{
    }).then(()=> {
        console.log(`connection established`);
    }).catch((err) => console.log(err));
}

module.exports = connectToMongo