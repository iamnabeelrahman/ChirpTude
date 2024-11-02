require("dotenv").config(); 
const dbConnect = require("./db");
const {app} = require("./app.js")


dbConnect()
.then(() => {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server is running in port ${process.env.PORT}`);
        
    })
})
.catch((error) => {
    console.error("Database connection failed:", error);
  });