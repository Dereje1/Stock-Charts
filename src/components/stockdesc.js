"use strict"
import React, { Component } from 'react';
import {Grid,Row,Col,Button,Glyphicon} from 'react-bootstrap'
class Stocklist extends Component {
  buildList(){

    let stocksFormatted= this.props.stocks.map((s,idx)=>{
      return (
          <div key={idx} className="stocks">
            <Button type="button" onClick={()=>{this.props.onClick(s._id)}} className="close" aria-label="Close"><span aria-hidden="true">&times;</span></Button>
            {s.name}
          </div>
      )
    })
    return stocksFormatted
  }
  render() {
    return (

        <div id="stockContainer">{this.buildList()}</div>

    );
  }

}

export default Stocklist;
