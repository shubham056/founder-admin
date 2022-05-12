
import React, { Component } from 'react';
import { Row, Col, Input, Form, Button, notification, Card, Radio } from 'antd';
// relative imports
import '../../Pages/InvesterIndividual/InvesterIndividual.css';
import { Strings } from '../../Constants/Strings';
import { connect } from 'react-redux';


class InvesterIre extends Component {

    constructor(props) {
        super(props)

        this.state = {
            user: null,
            selectedItem: 'NDTCO'
        }
    }

    componentDidMount() {
        let userObj = {
            firstName: this.props.user.firstName,
            lastName: this.props.user.lastName,
            phoneNumber: this.props.user.phoneNumber,
            email: this.props.user.email
        }
        this.setState({
            user: userObj
        })
    }

    // handle form submit event
    formSubmit() {
        if(this.state.selectedItem){
            let obj ={
                id: 3,
                IRAType: this.state.selectedItem
            }
            this.props.submitForm(obj)
        }else{
            this.showingMessage(Strings.errorType, Strings.iraNotSelectedError);
        }
    }
    
    //showing notification message
    showingMessage(type, message, title) {
        notification[type]({
            description: message,
        });
    }

    // radio buttons on change event
    handleRadioChange(val) {
        this.setState({
            selectedItem: val
        })
    }


    render() {
        return (
            <div>
                <div className="form-section" key={this.state.user ? this.state.user : null}>
                    {console.log(this.state.selectedItem, 141)}
                    <Radio.Group onChange={(e) => { this.handleRadioChange(e.target.value) }} value={this.state.selectedItem}>
                        <Row gutter={[16]} className="invester-ire-sec">
                            <Col sm={24} md={8} lg={8}>
                                <Card>
                                    <Radio value={'NDTCO'} >NDTCO </Radio>
                                    </Card>
                            </Col>
                            <Col sm={24} md={8} lg={8}>
                                <Card><Radio value={'IDGS'} >IDGS</Radio></Card>
                            </Col>
                            <Col sm={24} md={8} lg={8}>
                                <Card><Radio value={'IAPF'} >IAPF</Radio></Card>
                            </Col>
                        </Row>
                    </Radio.Group>

                </div>
                <div className="save-btn-sec-profile">
                        {/* <Button type="primary" className="primary-button-back" onClick={() => {
                                this.props.goBack(0)
                            }}>Back</Button> */}
                            
                        <Button type="primary" onClick={() => { this.formSubmit() }} className="primary-button">PROCEED</Button>
                    </div>
                   

            </div>
        )
    }
}

export default connect(null, { })(InvesterIre);