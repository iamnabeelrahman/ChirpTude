require("dotenv").config(); 
const express = require("express")
const dbConnect = require("./db");

const app = express()

dbConnect()
.then(() => {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server is running in port ${process.env.PORT}`);
        
    })
})
.catch((error) => {
    console.error("Database connection failed:", error);
  });