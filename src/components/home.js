"use strict"
import React, { Component } from 'react';
import ReactHighChart from 'react-highcharts/ReactHighstock.src'
import axios from 'axios';
import {findDOMNode} from 'react-dom';
import {Grid,Col,Row} from 'react-bootstrap'
import io from 'socket.io-client';

//custom components and functions
import Stocklist from './stockdesc'
import {getAllStocks,addStock,deleteStock} from '../miscellaneous/clientcrud'
import {chartConfig} from '../miscellaneous/configuration'
import Addstock from './addstock'
import Info from './infomodal'


//const socket = io('//localhost:3001'); //establish socket connection as public , can not use this address on heroku
const socket = io('https://dereje-stock-charts.herokuapp.com');
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      configuration:chartConfig,//chart config per highstocks
      dbStocks:[],//all stocks current in db
      loaded: false,//true if loading all stocks is done
      message:"",//client interaction message
      colorVar:0//line color change when not updated from server(only for inbrowser)
    }
    socket.on('server update', (newState)=>{//listen to socket events
      this.updateStatefromSockets(newState)
    });
    this.addingStock=this.addingStock.bind(this)
  }
  componentDidMount() {
    this.startupChart()//run on every mount once,i.e. get data from db only once
  }
  updateStatefromSockets(newstate){
    this.setState(newstate)//sets entire state with socket update
  }
  startupChart(){//runs only once
    getAllStocks().then((allstocks)=>{//gets all stock symbols stored in the db
      if(!allstocks.length){//if empty just exit
        this.setState({
          loaded:true,
          dbStocks:allstocks,
        })
        return;
      }
      let seriesCollect=[]//prepare series for ReactHighstock
      let chartConfigCopy = JSON.parse(JSON.stringify(this.state.configuration)) //copy current configuration so not to mutate state

      let quandInterval=setInterval(()=>{//can not loop thru all stocks in the db as it is too fast and quandl returns an error , wait one second before attemoting to fetch next stock
        let stockurl = "api/quand/"+allstocks[seriesCollect.length].symbol
        axios.get(stockurl).then((response)=>{//get individual stock data from backend
          seriesCollect.push({//add to series
            name:response.data.name,
            data:response.data.data
          })
          if(allstocks.length===seriesCollect.length){//once all stock data is retrieved....
            clearInterval(quandInterval)
            chartConfigCopy.series = seriesCollect //change copy of configuration series property
            if(window.innerWidth>1100){//rough adjustment of react stock chart height based on screen width
              chartConfigCopy.chart.height = window.innerWidth /30 +"%"
            }
            else if(window.innerWidth>700){
              chartConfigCopy.chart.height = window.innerWidth /12 +"%"
            }
            else if(window.innerWidth>500){
              chartConfigCopy.chart.height = window.innerWidth /5 +"%"
            }
            else{
              chartConfigCopy.chart.height = window.innerWidth /2 +"%"
            }

            this.setState({//set new state of chart
              configuration:chartConfigCopy,
              dbStocks:allstocks,
              loaded:true
            })
          }
        })
        .catch(function(err){
          clearInterval(quandInterval)
          console.log(err)
        })
      },1000)
    })
  }
  addingStock(e){//adds a stock
    //this.inputNode = inout in form of external component
    let stockSymbol = findDOMNode(this.inputNode).value.trim().toUpperCase()
    if(e===13||e==="button"){ //on enter or add button
      let currentSymbols = this.state.dbStocks.map((s)=>{
        return s.symbol
      })
      if(currentSymbols.includes(stockSymbol)){//check if stock already exists in the list
        findDOMNode(this.inputNode).value ="";
        this.setState({message: stockSymbol+" Already Included!"})//if it does display modal accordingly
        return;}
      if(stockSymbol===""){return;}//no entry
      addStock(stockSymbol).then((response)=>{//attempt adding the stock
        if(!response[0].data.hasOwnProperty('quandl_error')){//if no error from quandl
          //color index of chart must be set manually if the series are being changed by client on the fly
          //however with a complete refresh chart colors are assigned by highstocks
          response[0].data._colorIndex = this.state.dbStocks.length + this.state.colorVar
          //copy config as to not mutate
          let chartConfigCopy = JSON.parse(JSON.stringify(this.state.configuration))

          let seriesUpdate = [...chartConfigCopy.series,{...response[0].data}]//used for highstocks
          let clientUpdate = [...this.state.dbStocks,{...response[1]}]//used for client stock display
          chartConfigCopy.series=seriesUpdate
          this.setState({
            configuration:chartConfigCopy,
            dbStocks: clientUpdate,
            message:response[1].name + " Added" ,
            colorVar: this.state.colorVar + 1
          },()=>{findDOMNode(this.inputNode).value =""})
          socket.emit('client update', this.state)//emit to socket on a succesful stock addition
        }
        else{//error from quandl means stock not found display modal accordingly
          this.setState({message: stockSymbol+" Not Found!"},()=>{findDOMNode(this.inputNode).value =""})
        }
      })
    }
  }
  deletingStock(stockID){//recieves db id to delete stock with
    deleteStock(stockID).then((response)=>{
      //find stock symbol from id
      let chartConfigCopy = JSON.parse(JSON.stringify(this.state.configuration))
      let dbIndexofDeletion = this.state.dbStocks.findIndex((stock)=>{
        return (stock._id===response._id)
      })
      let nameToDelete = this.state.dbStocks[dbIndexofDeletion].name

      let configIndexofDeletion = chartConfigCopy.series.findIndex((stock)=>{
        return (nameToDelete===stock.name)
      })
      let seriesUpdate = [...chartConfigCopy.series.slice(0,configIndexofDeletion),...chartConfigCopy.series.slice(configIndexofDeletion+1)]
      let clientUpdate = [...this.state.dbStocks.slice(0,dbIndexofDeletion),...this.state.dbStocks.slice(dbIndexofDeletion+1)]
      chartConfigCopy.series=seriesUpdate
      this.setState({
        configuration:chartConfigCopy,
        dbStocks: clientUpdate,
        message: nameToDelete+" Deleted",
        colorVar: this.state.colorVar + 1
      })
      socket.emit('client update', this.state)
    })
  }
  render() {
      if(this.state.loaded){
        return (
          <Grid>
            <Row style={{"marginTop":"25px"}}>
              <Col xs={12}>
                <ReactHighChart config={this.state.configuration}/>
              </Col>
            </Row>

            <Addstock
            inputRef={node => this.inputNode = node}
            onKeyDown={this.addingStock}
            buttonSubmit={this.addingStock}
            />

            <Stocklist stocks={this.state.dbStocks}
             onClick={this.deletingStock.bind(this)}
             />

             <Info message={this.state.message}/>
          </Grid>
        );
      }
      else{
        return(<div className="loader"></div>)
      }
  }

}

export default Home;
