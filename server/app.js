const express= require('express');
const dotenv= require('dotenv');
require('dotenv').config();
const app= express();

const userRoutes = require("./routes/userRoutes");


const connectDB= require("./config/db");
connectDB();

app.use(express.json());


app.use('/api/', userRoutes);


const PORT= process.env.PORT || 5000;
app.listen(PORT, console.log("Server started at "+PORT));