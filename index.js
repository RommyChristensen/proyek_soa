const express = require("express");
const utils = require("./helpers/utils");
const auth = require("./routes/user/auth");
const admin_kategori = require("./routes/admin/kategori");
const admin_hashtag = require("./routes/admin/hashtag");
const app = new express();

app.use(express.urlencoded({extended: true}));

// ROUTES
app.use("/api/admin/kategori", admin_kategori);
<<<<<<< Updated upstream
app.use("/api/admin/hashtag", admin_hashtag);
app.use("/api/user", auth)

=======
app.use("/api/user", auth);
>>>>>>> Stashed changes

// -

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Listening to " + port);
})