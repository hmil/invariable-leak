const http = require('http');
const fs = require('fs');


const server = http.createServer((req, res) => {
  if (req.url === '/') {
    var rs = fs.createReadStream('victim.html');
    rs.pipe(res);
  } else if (req.url === '/endpoint'){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization');
    res.setHeader('Cache-Control', 'no-transform, max-age=60');
    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
    } else {
      if (req.headers.authorization === 'Basic bXkgdG9rZW4=' &&
          req.headers.cookie.indexOf('secret_cookey') !== -1) {
        res.write('The top secret code is 123456789.');
      } else {
        res.statusCode = 401;
        res.write('Not authorized');
      }
    }
    res.end();
  } else {
    res.end();
  }
});
server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.listen(8888);


const rogueServer = http.createServer((req, res) => {
  if (req.url === '/') {
    var rs = fs.createReadStream('attack.html');
    rs.pipe(res);
  } else {
    res.end();
  }
});

server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
rogueServer.listen(8877);
