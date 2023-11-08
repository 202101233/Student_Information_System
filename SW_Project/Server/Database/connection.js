const mongoose = require('mongoose');

const connectDB = async () => {
    try {
<<<<<<< HEAD
        const con = await mongoose.connect("mongodb://127.0.0.1:27017/admin", {
=======

        const con = await mongoose.connect("mongodb+srv://admin:sis_it304@cluster0.7fcnw1p.mongodb.net/?retryWrites=true&w=majority", {
>>>>>>> origin/main
            useNewUrlParser: true,
            useUnifiedTopology : true,
            // useFindAndModify : false,
            // // useCreateIndex : true,
        })
        console.log(`MongoDB Connected : ${con.connection.host}`);
    }
    catch (err) {
        console.error('MongoDB Connection Error:', err);
        // process.exit(1);
    }
}
module.exports = connectDB