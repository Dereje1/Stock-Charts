"use strict"//dumb component that displays all stocks
import React, { Component } from 'react';
import {Button,Glyphicon} from 'react-bootstrap'
class Stocklist extends Component {
  buildList(){
    //formatting panel, trying to use css flexbox on class rather than bootstrap
    let stocksFormatted= this.props.stocks.map((s,idx)=>{
      return (
          <div key={s._id} className="stocks">
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
