const express = require('express');const bodyParser = require('body-parser');
const fs = require("fs");
const { fetchGit, fetchGitFile, fetchFileList, loginUser } = require('./fetch');

const app = express();

const port = process.env.PORT || 8000;

app.route("/fetch/:filename")
    .get((req, res) => {
        if(req.headers['kindred'] !== "cloud-build") {
            res.statusCode = 404;
            res.end();
        }
        fetchGitFile(req, res);
    });

app.route("/fetch")
    .get((req, res) => {
        if(req.headers['kindred'] !== "cloud-build") {
            res.statusCode = 404;
            res.end();
        }
        fetchGit(req, res);
    })

app.route("/fetchList")
    .get((req, res) => {
        if(req.headers['kindred'] !== "cloud-build") {
            res.statusCode = 404;
            res.end();
        }
        fetchFileList(req, res);
    })

app.route("/")
    .get((req, res) => {
        loginUser(req, res);
    })

app.listen(port, () => {  console.log('We are live on ' + port);});
