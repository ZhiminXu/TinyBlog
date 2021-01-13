var express = require("express");
var router = express.Router();
const model = require("../models");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/regist", function (req, res, next) {
  var data = {
    username: req.body.username,
    password: req.body.password,
    password2: req.body.password2,
  };
  model.connect(function (db) {
    db.collection("users").insertOne(data, function (err, ret) {
      if (err) {
        console.log("注册失败");
        res.redirect("/regist");
      } else {
        res.redirect("/login");
      }
    });
  });
});

router.post("/login", function (req, res, next) {
  var data = {
    username: req.body.username,
    password: req.body.password,
  };
  console.log("用户登录", data.username);
  model.connect(function (db) {
    db.collection("users")
      .find(data)
      .toArray(function (err, docs) {
        if (err) {
          console.log("登录失败");
          res.redirect("/login");
        } else {
          if (docs.length > 0) {
            //登录成功，状态session保存
            req.session.username = data.username;

            res.redirect("/");
          } else {
            res.redirect("/login");
          }
        }
      });
  });
});

router.get("/logout", function (req, res, next) {
  req.session.username = null;
  res.redirect("/login");
});

module.exports = router;
