const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

// necessary middleware

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "20kb" }));
app.use(express.static("public"));
app.use(cookieParser());


//routes import
const userRoutes = require("./routes/user.routes.js");


//routes declaration
app.get('/', (req, res) => {
    res.redirect('/register') // will change it to Home once home page is ready
})

app.use('/api/v1/users', userRoutes); // https//:localhost:300/api/v1/users ( here v is version of our api currently its 1 so, v1)

module.exports = { app };
