const express = require("express");
const utils = require("./helpers/utils");
const auth = require("./routes/user/auth");
const admin_kategori = require("./routes/admin/kategori");
const admin_hashtag = require("./routes/admin/hashtag");
const admin_plan = require("./routes/admin/plan");
const admin_user = require("./routes/admin/user");

const user_comments = require("./routes/user/comments");
const user_artikel = require("./routes/user/artikel");
const user_headlines = require("./routes/user/headline");
const user_likes = require("./routes/user/likes");

const app = new express();

app.use(express.urlencoded({extended: true}));

// ROUTES
app.use("/api/admin/kategori", admin_kategori);
app.use("/api/admin/hashtag", admin_hashtag);
app.use("/api/admin/plan", admin_plan);
app.use("/api/admin/user", admin_user);
app.use("/api/user", auth);


app.use("/api/user/comments", user_comments);
app.use("/api/user/artikel", user_artikel);
app.use("/api/user/headlines", user_headlines);
app.use("/api/user/like", user_likes);
// -


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Listening to " + port);
})