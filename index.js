const express = require("express");
const utils = require("./helpers/utils");
const auth = require("./routes/user/auth");
const admin_kategori = require("./routes/admin/kategori");
const app = new express();

app.use(express.urlencoded({extended: true}));

// ROUTES
app.use("/api/admin/kategori", admin_kategori);
app.use("/api/user", auth)


// -

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Listening to " + port);
})