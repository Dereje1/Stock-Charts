"use strict"
//root of the frontend get /set primary store vars here
import React from 'react';

import Menu from './components/menu'

class Main extends React.Component{
  componentDidMount(){
    console.log("CDM Mounted for Main")
  }
    render(){
      return (
        <div>
          <Menu/>
            {this.props.children}
        </div>
      )
    }
}

export default (Main)
