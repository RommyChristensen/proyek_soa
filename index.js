const express = require("express");
const utils = require("./helpers/utils");
const auth = require("./routes/user/auth");
const app = new express();

app.use(express.urlencoded({extended: true}));

// ROUTES
app.use("/api/user", auth)


// -

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Listening to " + port);
})