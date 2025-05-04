const mongoose= require("mongoose");

mongoose.set("strictQuery", false);

const connectDB= async ()=>{
    try {
        const conn= await mongoose.connect(process.env.MONGO_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            // useCreateIndex: true
        });
        console.log("Mongo db connected:"+conn.connection.host);
    } catch (error) {
        console.log(error);
        process.exit();
    }
}

module.exports= connectDB;