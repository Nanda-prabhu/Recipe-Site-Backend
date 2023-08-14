const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const AuthRouter = require("./routes/users");
const RecipiesRouter = require("./routes/recipes");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", AuthRouter);
app.use("/recipes", RecipiesRouter);

mongoose.connect(process.env.MONGO_URI)
    .then(console.log("Connected to DB"));

app.get("/", async(req, res) => {
    res.send("<div> <h1>vanakam da mapla</h1><h2>Your API works Nanda :)</h2></div>")
});

app.listen(process.env.PORT, () => {
    console.log("Server started in port 3000");
});