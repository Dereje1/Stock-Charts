"use strict"
import axios from 'axios'

export function getAllStocks(){//gets all the stocks that are in the database
  return new Promise(function(resolve,reject){
    axios.get('/api/').then(function(response){
      resolve(response.data)
    })
    .catch(function(err){
      reject(err)
    })
  })
}

export function addStock(symb){//adds a stock to the database
  return new Promise(function(resolve,reject){
    axios.get('/api/quand/'+symb).then(function(response){//test if historical data exusts for it @quandl
      let stockFormat={//format it per mongoose schema
        symbol:symb.toUpperCase(),
        name:response.data.name,
        timestamp:Date.now()
      }
      if(!response.data.hasOwnProperty('quandl_error')){//if historical data is available must be a valid stock
        axios.post('/api/',stockFormat).then(function(addresp){//add to db
            resolve([response,addresp.data]) //send both db response and quandl response back to home / react client
        })
        .catch(function(err){
          reject(err)
        })
      }
      else{//quandl has returned an error , do not enter in db , handle response on client side
        resolve([response,[]])
      }
    })
    .catch(function(err){
      reject(err)
    })
  })
}

export function deleteStock(id){//deletes stock from db by _id
  return new Promise(function(resolve,reject){
    axios.delete('/api/'+id).then(function(response){
      resolve(response.data)
    })
    .catch(function(err){
      reject(err)
    })
  })
}
