var express = require("express");
const { route } = require(".");
var router = express.Router();
const model = require("../models");
const multiparty = require("multiparty");
const fs = require('fs');

router.post("/add", function (req, res, next) {
  let id = parseInt(req.body.id);
  if (id) {
    let page = req.body.page;
    let title = req.body.title;
    let content = req.body.content;
    model.connect(function (db) {
      db.collection("articles").updateOne(
        { id: id },
        {
          $set: {
            title: title,
            content: content,
          },
        },
        function (err, ret) {
          if (err) {
            console.log("修改失败", err);
          } else {
            console.log("修改成功");
            res.redirect("/?page=" + page);
          }
        }
      );
    });
  } else {
    let data = {
      title: req.body.title,
      content: req.body.content,
      id: Date.now(),
      username: req.session.username,
    };
    model.connect(function (db) {
      db.collection("articles").insertOne(data, function (err, ret) {
        if (err) {
          console.log("发布失败", err);
          res.redirect("/write");
        } else {
          res.redirect("/");
        }
      });
    });
  }
});

router.get("/delete", function (req, res, next) {
  let id = parseInt(req.query.id);
  let page = req.query.curPage;
  model.connect(function (db) {
    db.collection("articles").deleteOne({ id: id }, function (err, ret) {
      if (err) {
        console.log("删除失败");
      } else {
        console.log("删除成功");
        res.redirect("/?page=" + page);
      }
    });
  });
});

router.post('/upload', function(req, res, next){
  let form = new multiparty.Form();
  form.parse(req, function(err, fields, files){
    if(err){
      console.log("上传失败！");
    }else{
      console.log(files);
      var file = files.filedata[0];
      var rs = fs.createReadStream(file.path);
      var newPath = '/upload/' + file.originalFilename;
      var ws = fs.createWriteStream('./public' + newPath);;
      rs.pipe(ws);
      ws.on('close', function(){
        console.log('文件上传成功');
        res.send({err:'', msg:newPath});
      })
    }
  });
});

module.exports = router;
