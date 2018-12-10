var app = require('express')()
var http = require('http').Server(app)
var url = require('url')
var fs = require('fs')
var io = require('socket.io')(http)

var user = {
  'right': 0,
  'left': 0
}

var score = {
  'right': 0,
  'left': 0
}

app.get('*', function(req, res){
  var q = url.parse(req.url, true)
  var filename = '.' + q.pathname
  fs.readFile(filename, function (err, data) {
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'})
      return res.end('404 Not Found')
    }
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.write(data)
    return res.end()
  })
});

http.listen(7777, '0.0.0.0')

io.on('connection', function(socket) {
  console.log('connected')
  handle_socket(socket)
})

function handle_socket(socket) {
  if (user.right == 0) {
    user.right = socket
    var userid = 'right'
    console.log('assigned to right')
  }
  else if (user.left == 0) {
    user.left = socket
    var userid = 'left'
    console.log('assigned to left')
  }
  else {
    socket.disconnect()
    console.log('connection refused')
  }

  socket.on('disconnect', function() {
    user[userid] = 0
    console.log(userid + ' disconnect')
    return
  })

  socket.on('who am i', function(data) {
    socket.emit('you are', userid)
  })

  socket.on('ball', function(data) {
    io.emit('ball', data)
  })

  socket.on('score', function(data) {
    score[data] += 1
    io.emit('score', score)
  })

  socket.on('keydown', function(data) {
    handle_key(userid, data, 'keydown')
  })

  socket.on('keyup', function(data) {
    handle_key(userid, data, 'keyup')
  })
}

function handle_key(userid, data, behavior) {
  data = {
    'player_side': userid,
    'key_code': data,
  }
  io.emit(behavior, data)
}