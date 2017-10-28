"use strict"//primary module to interact with client
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var getquandl = require('./thirdpartyapis/quandl')

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

var db = require('./models/db') //mongoose required common db
var stocksdb = require('./models/stocksstored') // VenueGoers schema

app.get("/quand/:ticker",function(req,res){
  getquandl(req.params.ticker).then(function(stockdata){
    res.json(stockdata)
  })
  .catch(function(err){
    res.json(err)
  })
})
app.get("/",function(req,res){
  stocksdb.find({},function(err,allstocks){
    if(err){throw err}
    res.json(allstocks)
  })
})
app.post("/",function(req,res){
  let info=req.body;
  stocksdb.create(info,function(err,stockadded){
    if(err){throw(err)}
    res.json(stockadded)
  })
})

app.listen(3001,function(err){
  if(err){
    console.log(err)
  }
  console.log("API Server is listening on port 3001")
})
