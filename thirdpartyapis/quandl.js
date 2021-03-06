"use strict"//gets quandl historical stock data
var axios = require('axios')

module.exports = function(stock){
  return new Promise(function(resolve,reject){
    let today = (new Date).toLocaleDateString().split("/")//set time stamp
    let formattedDate = today[2]+"-"+today[0]+"-"+today[1] //need for qunadl
    let urlBuild = "https://www.quandl.com/api/v3/datasets/WIKI/" + stock + ".json?column_index=4&start_date=2010-01-01&end_date="+formattedDate+"&collapse=daily&api_key=" + process.env.QUAND_API_KEY
    axios.get(urlBuild)
      .then(function(response){//parse info for react stock charts to understand
        let instrumentName = response.data.dataset.name.split("(")[0].trim()
        let instrumentData = response.data.dataset.data
        let instrumenformattedData = instrumentData.map((q)=>{//convert date to unix
          return [Date.parse(q[0]),q[1]]
        })
        let respObject={
          name:instrumentName,
          data:instrumenformattedData.reverse()
        }
        resolve(respObject)//send formatted object
      })
      .catch(function(error){
        console.log(error.response.data)
        reject(error.response.data)
      })
  })
}
