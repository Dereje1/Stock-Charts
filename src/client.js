"use strict" //primary entry module

//react and router modules
import React from 'react'
import {render} from 'react-dom'
import {Router, Route, IndexRoute,browserHistory} from 'react-router';

//Import all Created react components that are associated with the router
import Main from './main'
import Home from './components/home'
import About from './components/about'

//decalre all routes of application
const Routes = (
  <Router history={browserHistory}>
    <Route path="/" component={Main}>
      <IndexRoute component={Home}/>
      <Route path="/about" component={About}/>
    </Route>
  </Router>
)
// render routes
render (Routes,document.getElementById('app'))
