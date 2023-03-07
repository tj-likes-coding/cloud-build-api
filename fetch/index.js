const fs = require("fs");
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "sql.freedb.tech",
  user: "freedb_cloud-build-author",
  password: "Km5pdq!KCYyAN*c",
  database: "freedb_cloud-build-js"
});

con.connect(function(err) {
  if (err) throw err;
});

exports.fetchGit = (req, res) => {
    let pkgname = req.headers['package_name'];
    let author = req.headers['author'];
    let appname = req.headers['appname'];
    let json = fs.readFileSync("../db.txt", "utf-8", (data) => {return data;});
    json = JSON.parse(json);
    let data = json[pkgname];

    if( data.author === author && data.appname === appname ) {
        fetch(data.repo+"/"+data.main).then((response) => {
            res.json({
                data: response.text()
            });
        });
    }
}

exports.fetchGitFile = (req, res) => {
    let pkgname = req.headers['package_name'];
    let author = req.headers['author'];
    let appname = req.headers['appname'];
    let data;
    con.query("SELECT * FROM `cloud-build-repos`", function (err, result) {
    if (err) console.log(err);
      if(result.length > 0) {
        result.forEach(row => {
          if(row['package_name'] === pkgname && row['appname'] === appname && row['author'] === author) {
              data = row;
          }
        });
      } else {
        throw "Package Not Found!";
      }
    });
  
    const request = require('request');

    const URL = data.repo + "/" + req.params.filename;
    const TOKEN = data.token;

    var options = {
      url: URL,
      headers: {
        'Authorization': 'token ' + TOKEN
      }
    };

    function callback(error, response, body) {
//           console.log(response.statusCode);
//           console.error(error);
//           console.log(body);
       res.json({
        data: body
       });
      res.end();
    }

    request(options, callback);
}

exports.fetchFileList = (req, res) => {
    let pkgname = req.headers['package_name'];
    let author = req.headers['author'];
    let appname = req.headers['appname'];
    
    con.query("SELECT * FROM `cloud-build-repos`", function (err, result) {
    if (err) console.log(err);
      if(result.length > 0) {
        result.forEach(row => {
          if(row['package_name'] === pkgname && row['appname'] === appname && row['author'] === author) {
              res.json(row);
              res.end();
          }
        });
      } else {
        throw "Package Not Found!";
      }
    });
}
