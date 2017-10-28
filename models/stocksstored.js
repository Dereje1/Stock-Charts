"use strict"
//mongoose shcema on what to store fror venue goers?
var mongoose = require('mongoose');
var stocksschema = mongoose.Schema({
   symbol: String,
   timestamp: Number
});

//exported = mongoose.model(collectionName,Schema);
module.exports = mongoose.model('stocksdb',stocksschema);
