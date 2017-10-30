"use strict"
import React, { Component } from 'react';
import {Col,Row,InputGroup,FormControl,Button,FormGroup,OverlayTrigger,Tooltip} from 'react-bootstrap'
class Addstock extends Component {

  render() {
    const tooltip = (<Tooltip id="tooltip"><strong>Add Stock</strong></Tooltip>);
    return (
      <Row style={{"marginTop":"25px"}}>
          <Col xs={8} xsOffset={2}>
            <FormGroup>
              <InputGroup >
                <FormControl ref={this.props.inputRef}  type="text" onKeyDown={(e)=>this.props.onKeyDown(e.keyCode)} style={{"height":"60px","borderRadius":"10px 0 0px 10px","fontSize":"20px"}} placeholder="Add stock symbol"/>
                <OverlayTrigger placement="top" overlay={tooltip}>
                  <Button componentClass={InputGroup.Button} className="addstock" style={{"height":"60px","borderRadius":"0px 10px 10px 0px"}} type="submit" onClick ={()=>{this.props.buttonSubmit("button")}}><span style={{"fontSize":"40px"}} className="fa fa-plus"/></Button>
                </OverlayTrigger>
              </InputGroup>
            </FormGroup>
          </Col>
      </Row>
    );
  }

}

export default Addstock;
