const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

app.get('/', function(req, res, next) {
  res.status(200).sendFile(path.join(__dirname, 'index.html'));
});

app.get('/video', async function(req, res, next) {

  
  const range = req.headers.range;
  if (!range) {
    res.status(400).send('Requires Range header');
  }

  const videoPath = "Levi's Live Session 7 - Toh Phir Aao by Mustafa Zahid & ROXEN ( 480 X 480 ).mp4";
  const videoSize = fs.statSync(videoPath).size;

  const CHUNK_SIZE = 10 ** 6;
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start} - ${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4"
  }
  console.log(headers)

  res.writeHead(206, headers);

  const videoStream = fs.createReadStream(videoPath, { start, end });
  videoStream.pipe(res);

});

app.listen(4000, () => console.log("Server is up and running at 4000"));