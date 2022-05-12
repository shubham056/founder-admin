import React, { Component } from "react";

import { connect } from 'react-redux';
/* Antd library components */
import { Col, Button, Checkbox, Radio, Space, Row } from "antd";
import { getOpportunities, getUserDataLean, addExpressInterest, addNewNotification, getAllQuestionsByFilters, getAllClosingDocumentsProvisions } from '../../Redux/Crud';

/* Relative imports */
import { AppHeader, Loading, Footer } from "../../Components";
import { Strings } from '../../Constants/Strings';
import "./DocumentPermissions.css";


class DocumentPermissions extends Component {
    constructor(props) {
        super(props)

        this.state = {
            shareData: null,
            user: null,
            loading: false,
            expressObj: null,
            notificationObj: null,
            options: [],
            q1List: [],
            closingDocumentsProvisions: [],
            accridate: null
        }

    }
    componentDidMount() {
        window.scrollTo(0, 0);
        this.getUserDetails();
        this.getQuestionsByFilters()
        this.getClosingDocumentsProvisions();
        if (this.props.location.state && this.props.location.state.expressObj) {
            this.setState({
                expressObj: this.props.location.state.expressObj
            })
        }
        if (this.props.location.state && this.props.location.state.notificationObj) {
            this.setState({
                notificationObj: this.props.location.state.notificationObj
            })
        }
        if (this.props.location.state && this.props.location.state.shareData) {
            this.setState({ shareData: this.props.location.state.shareData })
        }
    }

    getQuestionsByFilters() {
        this.props.getAllQuestionsByFilters({
            questionId: 1
        }).then(res => {
            if (res.type == Strings.successType) {
                this.state.q1List = res.data;
                this.setState({
                    q1List: this.state.q1List
                });
            } else {
            }
        })
    }

    //getting user data
    getUserDetails() {
        if (localStorage.getItem('userData')) {
            let user = JSON.parse(localStorage.getItem('userData'));
            this.props.getAllClosingDocumentsProvisions()
                .then(res => {
                    if (res.type == Strings.successType) {
                        this.setState({
                            options: res.data
                        })
                    } else {
                        this.setState({ options: [] })
                    }
                })
        } else {
            localStorage.clear();
            this.props.history.push('/');
        }
    }

    getClosingDocumentsProvisions() {
        if (localStorage.getItem('userData')) {
            let user = JSON.parse(localStorage.getItem('userData'));
            this.props.getUserDataLean(user.id)
                .then(res => {
                    if (res.type == Strings.successType) {
                        this.setState({
                            user: res.data
                        })
                    } else {
                        localStorage.clear();
                        this.props.history.push('/');
                    }
                })
        } else {
            localStorage.clear();
            this.props.history.push('/');
        }
    }

    //handling form submit
    handleSubmitForm() {
        console.log(this.state.accridate)

        if (this.state.accridate != null && this.state.closingDocumentsProvisions.length > 0) {
            this.setState({ loading: true });
            let obj = this.state.expressObj;
            obj.accredited = this.state.accridate;
            obj.closingDocumentsProvisions = this.state.closingDocumentsProvisions;
            this.props.addExpressInterest(obj).then(res => {
                if (res.type == Strings.successType) {
                    this.props.history.push('/success', { holdingData: res.data });
                    let notificationObj = this.state.notificationObj;
                    notificationObj.orderId = res.data.id
                    this.props.addNewNotification(notificationObj)
                    this.setState({ loading: false });
                }
            })
        }

    }



    onChange = (e) => {
        console.log(e)
        this.setState({ closingDocumentsProvisions: e })
    }



    onChangeAccridate = (e) => {
        this.setState({
            accridate: e.target.value,
        });
    }

    render() {
        return (
            <div>

                {this.state.loading ? <Loading></Loading> : null}
                <div key={this.state.user ? this.state.user : null}>
                    <AppHeader history={this.props.history} user={this.state.user} />
                </div>
                <div className="container-permissions ani-left-to-right">
                    <div className="document-permissions-main-h">
                        <h1 className="login-register-title-h investor-opportunity-title-h"> <span className="">{this.state.user ? (this.state.user.firstName + " " + this.state.user.lastName) : null}</span> is investing ${this.state.expressObj && this.state.expressObj.transactionVolume ? this.state.expressObj.transactionVolume.toLocaleString('USD') : 0} in {this.state.shareData && this.state.shareData.portfolioCompanyName ? this.state.shareData.portfolioCompanyName : null}</h1>
                    </div>
                    <Row gutter={[32]} className="document-permission-row">
                    <Col sm={24} md={24} lg={24} xsm={24} className="accredited-col">
                        <div className="document-permission-div accredited-div">
                            <p><span className="required">*</span>How is <span className="">{this.state.user ? (this.state.user.firstName + " " + this.state.user.lastName) : null}</span> accredited?</p>
                            <Radio.Group onChange={this.onChangeAccridate} defaultValue={this.state.accridate}>
                                <Space direction="vertical">
                                    {this.state.q1List.map((item, index) => {
                                        return <Radio value={item.optionText}>{item.optionText}</Radio>
                                    })}
                                </Space>
                            </Radio.Group>
                        </div>
                    </Col>
                        <Col sm={24} md={24} lg={24} xsm={24} className="documents-main-sec">
                            <div className="document-permission-div">
                                <Checkbox.Group style={{ width: '100%' }} onChange={this.onChange}>
                                    {this.state.options.map((option) => {
                                        return <Checkbox value={option.optionId}>{(option.optionText).replaceAll('{COMPANY}', this.state.shareData && this.state.shareData.portfolioCompanyName ? this.state.shareData.portfolioCompanyName : null)}</Checkbox>
                                    })}
                                </Checkbox.Group>
                                <Button className="primary-button" disabled={this.state.accridate == null || this.state.accridate == 'I am NOT accredited' || this.state.options.length != this.state.closingDocumentsProvisions.length} onClick={() => this.handleSubmitForm()}>Confirm and E-sign for ${this.state.expressObj && this.state.expressObj.transactionVolume ? this.state.expressObj.transactionVolume.toLocaleString('USD') : 0} investment</Button>
                            </div>
                        </Col>
                    </Row>
                </div >
                 <Footer history={this.props.history} />
            </div>
        )
    }
}

export default connect(null, { getUserDataLean, addExpressInterest, addNewNotification, getAllQuestionsByFilters, getAllClosingDocumentsProvisions })(DocumentPermissions);
