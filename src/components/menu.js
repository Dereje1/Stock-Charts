"use strict"//navigation bar self explanatory
import React from 'react'
import {Nav, NavItem, Navbar, Button} from 'react-bootstrap';

class Menu extends React.Component{
  nav(){
      return (
        <Nav pullRight>
          <NavItem eventKey={2} href="/">Home</NavItem>
        </Nav>
      )
  }

  render(){
    return(
    <Navbar fixedTop>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/">Stock Charts App</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavItem eventKey={1} href="/about">About</NavItem>
          </Nav>
          {this.nav()}
        </Navbar.Collapse>
    </Navbar>
    )
  }
}


export default (Menu)
