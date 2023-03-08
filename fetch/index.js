const fs = require("fs");
const fetch = require("node-fetch");
const { Octokit } = require("octokit");

function fetchFromDB() {
  let data = require("./repos.json");
  return data;
}

exports.loginUser = (req, res) => {
  res.sendFile("index.html");
  
  res.end();
}

exports.fetchGit = async (req, res) => {
    let pkgname = req.headers['package_name'];
    let author = req.headers['author'];
    let appname = req.headers['appname'];
    let result = fetchFromDB();
  
    if(result.length > 0) {
        for(let i=0;i<result.length;i++) {
            let row = result[i];
          if(row['package_name'] === pkgname && row['appname'] === appname && row['author'] === author) {
            const token = row.token;  
            const repo = row.repo;
            const owner = row.owner;
            const main = row.main;
            console.log(owner, repo, main, token);

              async function getocto () {
                const octokit = new Octokit({ auth: token })

                const { data } = await octokit.rest.repos.getContent({
                  mediaType: {
                    format: "raw",
                  },
                  owner: owner,
                  repo: repo,
                  path: main,
                });
                return data;
            }
            let output = await getocto();
            if(output !== "") {
              res.json({
                data: output
              });
              res.end();
            }
            break;
          }
        };
        return;
      } else {
        throw "Package Not Found!";
      }
}

exports.fetchGitFile = async (req, res) => {
    let pkgname = req.headers['package_name'];
    let author = req.headers['author'];
    let appname = req.headers['appname'];
    let result = fetchFromDB();
      if(result.length > 0) {
        for(let i=0;i<result.length;i++) {
            let row = result[i];
          if(row['package_name'] === pkgname && row['appname'] === appname && row['author'] === author) {
            const token = row.token;  
            const repo = row.repo;
            const owner = row.owner;

              async function getocto () {
                const octokit = new Octokit({ auth: token })

                const { data } = await octokit.rest.repos.getContent({
                  mediaType: {
                    format: "raw",
                  },
                  owner: owner,
                  repo: repo,
                  path: req.params.filename,
                });
                return data;
            }
            let output = await getocto();
            if(output !== "") {
              res.json({
                data: output
              });
              res.end();
            }
            break;
          }
        };
        return;
      } else {
        throw "Package Not Found!";
      }
}

exports.fetchFileList = (req, res) => {
    let pkgname = req.headers['package_name'];
    let author = req.headers['author'];
    let appname = req.headers['appname'];
    let result = fetchFromDB();
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
}
