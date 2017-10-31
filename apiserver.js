"use strict"//primary module to interact with client
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var getquandl = require('./thirdpartyapis/quandl')//gets quandl historical stock data

var app = express();
var server = require('http').createServer(app);//needed to attach app to socket
var io = require('socket.io')(server);//get socket

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

var db = require('./models/db') //mongoose required common db
var stocksdb = require('./models/stocksstored') // stock schema for db

app.get("/quand/:ticker",function(req,res){//gets historical data for one ticker
  getquandl(req.params.ticker).then(function(stockdata){
    res.json(stockdata)
  })
  .catch(function(err){
    res.json(err)
  })
})
app.get("/",function(req,res){//gets all tickers in the db
  stocksdb.find({},function(err,allstocks){
    if(err){throw err}
    res.json(allstocks)
  })
})
app.post("/",function(req,res){//adds one symbol to the db
  let info=req.body;
  stocksdb.create(info,function(err,stockadded){
    if(err){throw(err)}
    res.json(stockadded)
  })
})

app.delete('/:_id', function(req,res){//deletes 1 symbol from db
  var query = {_id: req.params._id};
  stocksdb.remove(query, function(err, stock){
    if(err){
    throw err;
    }
    res.json(query);
  })
})

io.on('connection', function(client){//socket connection
  console.log("Connection Established!!!")
  client.on('disconnect', function(){
    console.log('user disconnected');
  });
  client.on('client update', function(msg){//recieve message from client
    io.emit('server update', msg);//send message back to all clients, if not wanting to send to the sending client then use i0.broadcast.emit
  });
});

server.listen(process.env.PORT || 3001,function(err){//important must change to server.listen for socket to work!! not app.listen
  if(err){
    console.log(err)
  }
  console.log("API Server is listening on port 3001")
})
