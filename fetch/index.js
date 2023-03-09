const fs = require("fs");
const fetch = require("node-fetch");
const { Octokit } = require("octokit");

function fetchFromDB() {
  let data = require("./repos.json");
  return data;
}

let octokitCache = {};

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
            const token = process.env.GIT_TOKEN;  
            const repo = row.repo;
            const owner = row.owner;
            const main = row.main;

            // check if an Octokit instance for this token exists in the cache
            let octokit;
            if(octokitCache[token]) {
              octokit = octokitCache[token];
            } else {
              // create a new Octokit instance for this token and add it to the cache
              octokit = new Octokit({auth: token});
              octokitCache[token] = octokit;
            }

            const { data } = await octokit.rest.repos.getContent({
              mediaType: {
                format: "raw"
              },
              owner: owner,
              repo: repo,
              path: main
            });

            if(data !== "") {
              res.json({
                data: data
              });
              res.end();
            }

            // Update token in the cache if it has changed
            if(octokitCache[token] && octokitCache[token].auth !== token) {
              octokitCache[token] = new Octokit({auth: token});
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
            const token = process.env.GIT_TOKEN;  
            const repo = row.repo;
            const owner = row.owner;

            // check if an Octokit instance for this token exists in the cache
            let octokit;
            if(octokitCache[token]) {
              octokit = octokitCache[token];
            } else {
              // create a new Octokit instance for this token and add it to the cache
              octokit = new Octokit({auth: token});
              octokitCache[token] = octokit;
            }

            const { data } = await octokit.rest.repos.getContent({
              mediaType: {
                format: "raw"
              },
              owner: owner,
              repo: repo,
              path: btoa(req.params.filename)
            });

            if(data !== "") {
              res.json({
                data: data
              });
              res.end();
            }

            // Update token in the cache if it has changed
            if(octokitCache[token] && octokitCache[token].auth !== token) {
              octokitCache[token] = new Octokit({auth: token});
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
