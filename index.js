const express = require("express");
const conn = require("./utils");
const app = new express();

app.use(express.urlencoded({extended: true}));

// ROUTES

// -

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Listening to " + port);
})