"use strict"
import React, { Component } from 'react';
import ReactHighChart from 'react-highcharts/ReactHighstock.src'
import axios from 'axios';
import {findDOMNode} from 'react-dom';
import {Grid,Col,Row,InputGroup,FormControl,Button,FormGroup,OverlayTrigger,Image,Tooltip} from 'react-bootstrap'

import Stocklist from './stockdesc'
import {getAllStocks,addStock,deleteStock} from '../miscellaneous/clientcrud'
import {chartConfig} from '../miscellaneous/configuration'
import Addstock from './addstock'
import Info from './infomodal'
import {deletion} from '../miscellaneous/socketing'

import io from 'socket.io-client';
const socket = io('https://localhost:3001');

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      configuration:chartConfig,
      dbStocks:[],
      loaded: false,
      message:"",
      colorVar:0
    }
    socket.on('server update', (newState)=>{
      this.updateStatefromSockets(newState)
    });
    this.addingStock=this.addingStock.bind(this)
    this.updateStatefromSockets =this.updateStatefromSockets.bind(this)
  }
  componentDidMount() {
    this.startupChart()
  }
  updateStatefromSockets(newstate){
    this.setState(newstate)
  }
  startupChart(){
    getAllStocks().then((allstocks)=>{//gets stocks from db
      if(!allstocks.length){
        this.setState({
          loaded:true,
          dbStocks:allstocks,
        })
        return;
      }
      let seriesCollect=[]
      let chartConfigCopy = JSON.parse(JSON.stringify(this.state.configuration))

      let quandInterval=setInterval(()=>{//wait a full second before fetching quotes
        let stockurl = "api/quand/"+allstocks[seriesCollect.length].symbol
        axios.get(stockurl).then((response)=>{
          seriesCollect.push({
            name:response.data.name,
            data:response.data.data
          })
          if(allstocks.length===seriesCollect.length){
            clearInterval(quandInterval)
            chartConfigCopy.series = seriesCollect
            if(window.innerWidth>1100){
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

            this.setState({
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
  addingStock(e){
    let stockSymbol = findDOMNode(this.inputNode).value.trim().toUpperCase()
    if(e===13||e==="button"){
      let currentSymbols = this.state.dbStocks.map((s)=>{
        return s.symbol
      })
      if(currentSymbols.includes(stockSymbol)){
        findDOMNode(this.inputNode).value ="";
        this.setState({message: stockSymbol+" Already Included!"})
        return;}
      if(stockSymbol===""){return;}
      addStock(stockSymbol).then((response)=>{
        if(!response[0].data.hasOwnProperty('quandl_error')){
          response[0].data._colorIndex = this.state.dbStocks.length + this.state.colorVar
          let chartConfigCopy = JSON.parse(JSON.stringify(this.state.configuration))
          let seriesUpdate = [...chartConfigCopy.series,{...response[0].data}]
          let clientUpdate = [...this.state.dbStocks,{...response[1]}]
          chartConfigCopy.series=seriesUpdate
          this.setState({
            configuration:chartConfigCopy,
            dbStocks: clientUpdate,
            message:response[1].name + " Added" ,
            colorVar: this.state.colorVar + 1
          },()=>{findDOMNode(this.inputNode).value =""})
          socket.emit('client update', this.state)
        }
        else{
          this.setState({message: stockSymbol+" Not Found!"},()=>{findDOMNode(this.inputNode).value =""})
        }
      })
    }
  }
  deletingStock(stockID){
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
