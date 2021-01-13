var MongodbClient = require('mongodb').MongoClient;
var url = "mongodb://119.45.209.146:27017";
var dbName = "blog";

function connect(callback){
    MongodbClient.connect(url, function(err, client){
        if(err){
            console.log("connect fail", err);
        }else {
            var db = client.db(dbName);
            callback(db);
            client.close();
        }
    });
}

module.exports = {
    connect
}
