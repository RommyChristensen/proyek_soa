const express = require("express");
const utils = require("./helpers/utils");
const auth = require("./routes/user/auth");
const admin_kategori = require("./routes/admin/kategori");
const admin_hashtag = require("./routes/admin/hashtag");
const admin_plan = require("./routes/admin/plan");
const admin_user = require("./routes/admin/user");

const user_comments = require("./routes/user/comments");

const app = new express();

app.use(express.urlencoded({extended: true}));

// ROUTES
app.use("/api/admin/kategori", admin_kategori);
app.use("/api/admin/hashtag", admin_hashtag);
app.use("/api/admin/plan", admin_plan);
app.use("/api/admin/user", admin_user);
app.use("/api/user", auth);

app.use("/api/user/comments", user_comments);

// -


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Listening to " + port);
})