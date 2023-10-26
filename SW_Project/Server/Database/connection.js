const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const con = await mongoose.connect("mongodb://127.0.0.1:27017", {
            useNewUrlParser: true,
            useUnifiedTopology : true,
            // useFindAndModify : false,
            // useCreateIndex : true,
        })
        console.log(`MongoDB Connected : ${con.connection.host}`);
    }
    catch (er) {
        console.log(er);
        process.exit(1);
    }
}



module.exports = connectDB