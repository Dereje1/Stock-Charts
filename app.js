var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var app = express();

var getquandl = require('./thirdpartyapis/quandl')//gets quandl historical stock data



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

var db = require('./models/db') //mongoose required common db
var stocksdb = require('./models/stocksstored') // stock schema for db

app.get("/api/quand/:ticker",function(req,res){//gets historical data for one ticker
  getquandl(req.params.ticker).then(function(stockdata){
    res.json(stockdata)
  })
  .catch(function(err){
    res.json(err)
  })
})
app.get("/api/",function(req,res){//gets all tickers in the db
  stocksdb.find({},function(err,allstocks){
    if(err){throw err}
    res.json(allstocks)
  })
})
app.post("/api/",function(req,res){//adds one symbol to the db
  let info=req.body;
  stocksdb.create(info,function(err,stockadded){
    if(err){throw(err)}
    res.json(stockadded)
  })
})

app.delete('/api/:_id', function(req,res){//deletes 1 symbol from db
  var query = {_id: req.params._id};
  stocksdb.remove(query, function(err, stock){
    if(err){
    throw err;
    }
    res.json(query);
  })
})


//server primary route
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', function(req, res){
   res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
  });


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.end('error');
});
var port = (process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

//var server = http.createServer(app);
var server = require('http').createServer(app);//needed to attach app to socket
var io = require('socket.io')(server);//get socket
io.on('connection', function(client){//socket connection
  console.log("Connection Established!!!")
  client.on('disconnect', function(){
    console.log('user disconnected');
  });
  client.on('client update', function(msg){//recieve message from client
    io.emit('server update', msg);//send message back to all clients, if not wanting to send to the sending client then use i0.broadcast.emit
  });
});

server.listen(port);
