const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");

app.use(express.static("public"));

let globalVersion = 0;
const companies = {
    "aaa": {"subscribers":0},
    "bbb": {"subscribers":0},
    "ccc": {"subscribers":0},
};

app.get("/", (req, res) => {
    var html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
   res.status(200).send(html)
});

app.get("/subscribe/:id", (req, res) => {
    const id =req.params.id;
    companies[id].subscribers ++;
    console.log(`Subscribed to: ${id}`);
    res.status(200).json({"message": `Subscribed to: ${id}`})
    globalVersion ++;
});

app.get("/sse", (req, res) => {
    let localVersion = 0;
    res.set("Content-Type", "text/event-stream");
    res.set("Connection", "keep-alive");
    res.set("Cache-control", "no-cache");

    setInterval(() => {
        if(localVersion < globalVersion) {
            res.status(200).write(`data: ${JSON.stringify(companies)}\n\n`);
            localVersion = globalVersion;
        }
    }, 1000);
});

app.listen(8080, err => {
    if(err){console.log("Server cannot listen..."); return}
    console.log("Server listening");
});