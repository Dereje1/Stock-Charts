import React, { Component } from 'react';
import ReactHighChart from 'react-highcharts/ReactHighstock.src'
import axios from 'axios';
import {findDOMNode} from 'react-dom';
import {Grid,Col,Row,InputGroup,FormControl,Button,FormGroup,OverlayTrigger,Image,Tooltip} from 'react-bootstrap'

import Stocklist from './stockdesc'
import {getAllStocks,addStock,deleteStock} from '../miscellaneous/clientcrud'
import {chartConfig} from '../miscellaneous/otherinfo'
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      configuration:chartConfig,
      dbStocks:[],
      loaded: false
    }
    this.addingStock=this.addingStock.bind(this)
  }
  componentDidMount() {
    this.startupCharts()
  }
  startupCharts(){
    getAllStocks().then((allstocks)=>{
      if(!allstocks.length){
        this.setState({
          loaded:true
        },()=>{return})
      }
      let seriesCollect=[]
      let chartConfigCopy = JSON.parse(JSON.stringify(this.state.configuration))

      let quandInterval=setInterval(()=>{//wait a full second before fetching quotes
        console.log(" Running " + seriesCollect.length)
        let stockurl = "api/quand/"+allstocks[seriesCollect.length].symbol
        axios.get(stockurl).then((response)=>{
          seriesCollect.push({
            name:response.data.name,
            data:response.data.data
          })
          if(allstocks.length===seriesCollect.length){
            clearInterval(quandInterval)
            chartConfigCopy.series = seriesCollect
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
    let stockSymbol = findDOMNode(this.refs.stockadd).value.trim()
    if(e.keyCode===13||e==="button"){
      let currentSymbols = this.state.dbStocks.map((s)=>{
        return s.symbol
      })
      if(currentSymbols.includes(stockSymbol.toUpperCase())){return;}
      addStock(stockSymbol).then(function(response){
        response[0].data._colorIndex = this.state.dbStocks.length
        let chartConfigCopy = JSON.parse(JSON.stringify(this.state.configuration))
        let seriesUpdate = [...chartConfigCopy.series,{...response[0].data}]
        let clientUpdate = [...this.state.dbStocks,{...response[1]}]
        chartConfigCopy.series=seriesUpdate
        this.setState({
          configuration:chartConfigCopy,
          dbStocks: clientUpdate
        },()=>{findDOMNode(this.refs.stockadd).value =""})
      }.bind(this))
    }

  }
  deletingStock(stockID){
    deleteStock(stockID).then(function(response){
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
        dbStocks: clientUpdate
      })
    }.bind(this))
  }
  render() {
      if(this.state.loaded){
        const tooltip = (<Tooltip id="tooltip"><strong>Add Stock</strong></Tooltip>);
        return (
          <Grid>
            <Row style={{"marginTop":"25px"}}>
              <Col xs={12}>
                <ReactHighChart config={this.state.configuration}/>
              </Col>
            </Row>
            <Row style={{"marginTop":"25px"}}>
                <Col xs={8} xsOffset={2}>
                  <FormGroup>
                    <InputGroup >
                      <FormControl ref="stockadd"  type="text" onKeyDown={(e)=>this.addingStock(e)} style={{"height":"75px","borderRadius":"10px 0 0px 10px","fontSize":"20px"}} placeholder="Add stock symbol"/>
                      <OverlayTrigger placement="bottom" overlay={tooltip}>
                        <Button componentClass={InputGroup.Button} className="addstock" style={{"height":"75px","borderRadius":"0px 10px 10px 0px"}} type="submit" onClick ={()=>{this.addingStock("button")}}><span style={{"fontSize":"45px"}} className="fa fa-plus"/></Button>
                      </OverlayTrigger>
                    </InputGroup>
                  </FormGroup>
                </Col>
                <Stocklist stocks={this.state.dbStocks} onClick={this.deletingStock.bind(this)}/>
            </Row>
          </Grid>
        );
      }
      else{
        return(<div className="loader"></div>)
      }

  }

}



export default Home;
