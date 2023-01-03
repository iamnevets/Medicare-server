require('dotenv').config();

const {connect} = require("mongoose");

const connectDb = async () => {
    try {
        await connect("mongodb+srv://medicare-admin:admin5142@cluster0.jntre5e.mongodb.net/?retryWrites=true&w=majority" , {
            dbName: "medicare"
        })
        console.log("Database connected successfully!")
    }
    catch (error) {
        console.log(error);
        process.exit(1)
    }
}

module.exports = connectDb;