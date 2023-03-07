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
    let json = fs.readFileSync("../db.txt", "utf-8", (data) => {return data;});
    json = JSON.parse(json);
    let data = json[pkgname];
    
    if( data.author === author && data.appname === appname ) {
        fetch(data.repo+"/"+req.params.filename).then((response) => {
            res.json({
                data: response.text()
            });
        });
    }
}

exports.fetchFileList = (req, res) => {
    console.log(__dirname);
    let pkgname = req.headers['package_name'];
    let author = req.headers['author'];
    let appname = req.headers['appname'];
//     let json = fs.readFileSync("../db.txt", "utf-8", (data) => {return data;});
//     json = JSON.parse(json);
//     res.json(json);
//     let data = json[pkgname];
    
//     if( data.author === author && data.appname === appname ) {
//         res.json(data.files);
//     }
    
    con.query("SELECT * FROM `cloud-build-repos`", function (err, result) {
    if (err) throw err;
      console.log(result);
        result.forEach(row => {
          if(row['package_name'] === pkgname && row['appname'] === appname && row['author'] === author) {
              res.json(row);
          }
        });
    });
}
