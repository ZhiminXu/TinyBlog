var express = require("express");
var router = express.Router();
var model = require("../models/index");
var moment = require('moment');

/* GET home page. */
router.get("/", function (req, res, next) {
  var username = req.session.username;
  var page = req.query.page || 1;
  var data = {
    total: 0,  //页数
    curPage: page, //当前页
    list: []
  }
  var pageSize = 10;

  model.connect(function (db) {
    db.collection("articles")
      .find({username:username})
      .toArray(function (err, docs) {

        data.total = Math.ceil(docs.length / pageSize);
        docs.map(function(item, index){
          item['time'] = moment(item.id).format('YYYY-MM-DD HH:mm:ss');
        })

        model.connect(function(db){
          db.collection('articles').find({username:username}).sort({_id:-1}).limit(pageSize).skip((page-1)*pageSize).toArray(function(err, docs2){
            if(docs2.length == 0 && data.total != 0){
              res.redirect('/?page='+((page-1)||1));
            }
            docs2.map(function(item, index){
              item['time'] = moment(item.id).format('YYYY-MM-DD HH:mm:ss');
            })
            data.list = docs2
            res.render("index", { username: username, data:data});
          });
        })
      });
  });
  
});

router.get('/regist', function(req, res, next){
  res.render("regist", {});
})

router.get('/login', function(req, res, next){
  res.render("login", {});
})

router.get('/detail', function(req, res, next){
  let id = parseInt(req.query.id);
  let username = req.session.username || '';
  model.connect(function(db){
    db.collection('articles').findOne({id:id}, function(err, docs){
      if(err){
        console.log('查询失败');
      }else{
        var item = docs;
        item['time'] = moment(item.id).format('YYYY-MM-DD HH:mm:ss');
        res.render("detail", {item:item, username:username});
      }
    })
  })
})

router.get('/write', function(req, res, next){
  var username = req.session.username;
  let id = parseInt(req.query.id);
  let page = req.query.page;
  let data ={
    title: '',
    content:''
  }

  if(id){
    model.connect(function(db){
      db.collection('articles').findOne({id:id}, function(err, docs){
        if(err){
          console.log("查询失败")
        }else{
          data = docs;
          data['page'] = page;
          res.render("write", {username: username, data:data});

        }
      })
    })
  }else{
    res.render("write", {username: username, data:data});
  }
})

module.exports = router;
