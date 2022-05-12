import React, { Component } from 'react';
import { Row, Col, Input, Form, Button, Radio, Checkbox, Space } from 'antd';
import { MailOutlined } from "@ant-design/icons";
// relative imports
import '../../Pages/InvesterIndividual/InvesterIndividual.css';
import { Strings } from '../../Constants/Strings';
import { connect } from 'react-redux';
import { JointInvestors } from '../index.js';


class PaymentInvesterIndividual extends Component {
    formRef = React.createRef();
    constructor(props) {
        super(props)

        this.state = {
            user: null,
            checkBoxStatus: 'no',
            selectedInvest: null,
            shareData: null
        }
    }

    componentDidMount() {
        if (this.props.user) {
            this.setState({
                user: this.props.user
            }, () => {
                if (this.props.shareData) {
                    this.setState({
                        shareData: this.props.shareData
                    })
                }
            });
        }
        if (this.props.showCheckBox) {
            this.setState({ checkBoxStatus: 'yes' })
        }
    }

    // handle form submit
    formSubmit() {
        let values = this.state.user;
        if (this.state.checkBoxStatus == 'yes') {
            if (this.state.selectedInvest) {
                values.jointInvestor = this.state.selectedInvest
            }
        }
        let obj = {
            "investAsDetails": values,
            id: 1
        }
        if (values.jointInvestor) {
            obj.jointInvestorId = values.jointInvestor.id
        }
        this.props.submitForm(obj)
    }

    //select joint investor
    SelectJointInvestor(value) {
        this.setState({ selectedInvest: value })
    }

    onChange = (e) => {
        let val = e.target.value
        console.log(e.target.value);
        this.setState({ checkBoxStatus: val })
    }

    render() {
        return (
            <div>
                <div className="form-section" key={this.state.user ? this.state.user : null} >
                    <div className="main-investor-main">
                        <Row gutter={[16]} className='invest-as-details'>
                            <Col offset={8} md={16} lg={8} sm={24} xsm={24}>
                                <div className='add-investor-card'>
                                    <h2>Invest as</h2>
                                    <div className="main-investor">
                                        <div className="investor-name">{this.state.user ? this.state.user.firstName + " " + (this.state.user.middleName ? this.state.user.middleName + " " : "") + this.state.user.lastName : null}</div>
                                        <div>{this.state.user ? this.state.user.email : null}</div>
                                        <div>{this.state.user ? this.state.user.countryCode + " " + this.state.user.phoneNumber : null}</div>
                                        {/* <div>{this.state.user ? this.state.user.taxId : null}</div> */}
                                    </div>
                                </div>
                            </Col>
                            <Col md={24} lg={8} sm={24} xsm={24}>
                                <div className='add-investor-card' id="add-invester-card">
                                    <p>Do you want to add a join investor to this investment?</p>
                                    <Radio.Group onChange={this.onChange} value={this.state.checkBoxStatus}>
                                        <Space direction="horizantal">
                                            <Radio value={'yes'} >Yes</Radio>
                                            <Radio value={'no'}>No</Radio>
                                        </Space>
                                    </Radio.Group>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    {this.state.checkBoxStatus && this.state.checkBoxStatus == 'yes' ?
                        <JointInvestors user={this.props.user} shareData={this.props.shareData} express={true} history={this.props.history} SelectInvestor={this.SelectJointInvestor.bind(this)} /> : null}
                    <div className="back-complete-btn">
                        {/* <Button type="primary" className="primary-button-back" onClick={() => {
                            this.props.goBack(0)
                        }}>Back</Button> */}
                        <Button type="primary" onClick={() => { this.formSubmit() }} className="primary-button">PROCEED</Button>
                    </div>
                </div>
            </div>

        )
    }
}

export default connect(null, {})(PaymentInvesterIndividual);
