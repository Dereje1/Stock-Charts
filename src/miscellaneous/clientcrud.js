import axios from 'axios'

export function getAllStocks(){//gets all the stocks that are in the database
  return new Promise(function(resolve,reject){
    axios.get('/api/').then(function(response){

      let symbolList = response.data.map((s)=>{
        return s.symbol
      })
      resolve(response.data)
    })
    .catch(function(err){
      reject(err)
    })
  })
}

export function addStock(symb){//gets all the stocks that are in the database
  return new Promise(function(resolve,reject){
    axios.get('/api/quand/'+symb).then(function(response){
      let stockFormat={
        symbol:symb.toUpperCase(),
        name:response.data.name,
        timestamp:Date.now()
      }
      if(!response.data.hasOwnProperty('quandl_error')){
        axios.post('/api/',stockFormat).then(function(addresp){
            resolve([response,addresp.data])
        })
        .catch(function(err){
          reject(err)
        })
      }
      else{
        resolve([response,[]])
      }
    })
    .catch(function(err){
      reject(err)
    })
  })
}

export function deleteStock(id){//gets all the stocks that are in the database
  return new Promise(function(resolve,reject){
    axios.delete('/api/'+id).then(function(response){
      resolve(response.data)
    })
    .catch(function(err){
      reject(err)
    })
  })
}
