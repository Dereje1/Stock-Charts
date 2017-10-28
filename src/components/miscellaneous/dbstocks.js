import axios from 'axios'

function getAllStocks(){
  return new Promise(function(resolve,reject){
    axios.get('/api/').then(function(response){
      let symbolList = response.data.map((s)=>{
        return s.symbol
      })
      resolve(symbolList)
    })
    .catch(function(err){
      reject(err)
    })
  })
}

export default getAllStocks
