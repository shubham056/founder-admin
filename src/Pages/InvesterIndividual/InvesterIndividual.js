import React, { Component } from 'react'

import { Row, Col, Radio, Input, Form, Button, notification, Card, Breadcrumb, Steps, Space } from 'antd';
import { UpOutlined, DownOutlined, CheckCircleOutlined, MessageOutlined, MessageFilled } from '@ant-design/icons';
import cardImage from "../../assets/images/cardImage.png";
import moment from 'moment';
import { MailOutlined } from "@ant-design/icons";
import mobileIcon from '../../assets/images/mobileIcon.png';
import chatIcon from '../../assets/images/chatIcon.png';
import checkSuccess from '../../assets/images/checkSuccess.png';
import { AppHeader, Loading, Footer } from '../../Components';
import './InvesterIndividual.css';
import { PaymentInvesterIndividual, InvesterIre, AddEntity } from '../../Components';
import { connect } from 'react-redux';
import { getOpportunities, getUserDataLean, addNewNotification, getAllQuestionsByFilters } from '../../Redux/Crud';
import { Strings } from '../../Constants/Strings';

const { Meta } = Card;
const { Step } = Steps;
export class InvesterIndividual extends Component {
    formRef = React.createRef()

    constructor(props) {
        super(props)

        this.state = {
            formType: null,
            shareData: null,
            user: null,
            loading: false,
            step: 0,
            holdingData: null,
            shares: 100,
            transactionVolume: 0,
            showCheckBox: false,
            q1List: [],
        }

    }

    componentDidMount() {
        console.log(this.props)
        window.scrollTo(0, 0);
        // window.FreshworksWidget('show')
        this.getUserDetails();
        this.getQuestionsByFilters();
        this.setState({
            shareData: this.props.location.state.shareData
        }, () => {
            if (this.props.location.state.shareData) {
                this.formRef.current.setFieldsValue({
                    "shares": this.props.location.state.shareData.selectedShares
                })
                this.setState({
                    shares: this.props.location.state.shareData.selectedShares,
                    transactionVolume: this.props.location.state.shareData.transactionVolume
                });
            }
            if (this.props.location.state.step) {
                if (this.props.location.state.step == 'join') {
                    this.setState({ showCheckBox: true })
                    this.onChangeRadioButtons(0)
                } else {
                    this.onChangeRadioButtons(1)
                }
            }
        });
    }

    //getting user data
    getUserDetails() {
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

    // radio buttons on change event
    onChangeRadioButtons(value) {
        console.log(value)
        this.setState({
            step: value
        })
    }

    onChangeAccridate = (e) => {
        this.setState({
            accridate: e.target.value,
        });
    }

    //handling form submit
    handleSubmitForm(props) {
        console.log(props)
        let obj = {
            "investorId": JSON.parse(localStorage.getItem('userData')).id,
            "opportunityId": this.state.shareData.id,
            "numberOfShares": JSON.parse(this.state.shares),
            "transactionVolume": this.state.transactionVolume,
            "partialPayment": false,
            "expressInterstStatus": 1,
            "investorTypeId": props.id
        }
        if (props.investAsDetails) {
            obj.investAsDetails = props.investAsDetails
        }
        if (props.IRAType) {
            obj.IRAType = props.IRAType
        }
        if (props.jointInvestorId) {
            obj.jointInvestorId = props.jointInvestorId
        }
        if (props.entityId) {
            obj.entityId = props.entityId
        }
        let notificationObj = {
            "senderId": JSON.parse(localStorage.getItem('userData')).id,
            "receiverId": Strings.adminId,
            "unRead": true,
            "content": "In " + this.state.shareData.portfolioCompanyName + ", " + this.state.user.firstName + " " + (this.state.user.middleName ? this.state.user.middleName + " " : "") + this.state.user.lastName + " have intiated interest to buy " + JSON.parse(this.state.shareData.selectedShares) + " shares."
        }
        this.props.history.push('/document-permissions', { expressObj: obj, notificationObj: notificationObj, shareData: this.state.shareData })
        // this.setState({ loading: true });
        // let obj = {
        //     "investorId": JSON.parse(localStorage.getItem('userData')).id,
        //     "opportunityId": this.state.shareData.id,
        //     "numberOfShares": JSON.parse(this.state.shares),
        //     "transactionVolume": this.state.transactionVolume,
        //     "partialPayment": false,
        //     "expressInterstStatus": 1,
        //     "investorTypeId": props.id
        // }
        // if (props.investAsDetails) {
        //     obj.investAsDetails = props.investAsDetails
        // }
        // if (props.IRAType) {
        //     obj.IRAType = props.IRAType
        // }
        // this.props.addExpressInterest(obj).then(res => {
        //     if (res.type == Strings.successType) {
        //         // this.setState({ holdingData: res.data, step: 2 });
        //         this.props.history.push('/success', { holdingData: res.data });
        //         let obj = {
        //             "senderId": JSON.parse(localStorage.getItem('userData')).id,
        //             "receiverId": Strings.adminId,
        //             "unRead": true,
        //             orderId: res.data.id,
        //             "content": "In " + this.state.shareData.portfolioCompanyName + ", " + this.state.user.firstName + " " + (this.state.user.middleName ? this.state.user.middleName + " " : "") + this.state.user.lastName + " have intiated interest to buy " + JSON.parse(this.state.shareData.selectedShares) + " shares."
        //         }
        //         this.props.addNewNotification(obj)
        //         this.setState({ loading: false });
        //     }
        // })
    }

    //showing notification message
    showingMessage(type, message) {
        notification[type]({
            description: message,
        });
    }

    // handle back button
    handleBack(value) {
        console.log(value)
        this.setState({
            step: value,
            formType: null
        })
    }

    handelNumberOfShares = (e) => {
        if (e.target.value) {
            if (e.target.value > 10000) {
                e.target.value = 10000;
            }
            this.formRef.current.setFieldsValue({
                "shares": e.target.value
            })
            this.setState({ shares: e.target.value }, () => {
                let amount = (this.state.shareData && this.state.shareData.pricePerShare ? this.state.shareData.pricePerShare * e.target.value : (this.state.shareData.pricePerUnit ? this.state.shareData.pricePerUnit * e.target.value : 0));
                this.setState({
                    transactionVolume: JSON.parse(amount.toFixed(2))
                })
            })
        } else {

            this.setState({
                shares: 0,
                transactionVolume: 0
            })

        }
    }


    render() {

        return (
            <div className="invester-individula-main">
                {this.state.loading ? <Loading></Loading> : null}
                <div key={this.state.user ? this.state.user : null}>
                    <AppHeader history={this.props.history} user={this.state.user} />
                </div>
                <div className="container-payment ani-left-to-right">
                    <h1 className="login-register-title-h profile-title-h" id="investerindividual">Hello <span className="">{this.state.user ? (this.state.user.firstName + " " + this.state.user.lastName) : null}</span> Make The Right Investment</h1>

                    <Breadcrumb separator="" key={this.state.shareData ? this.state.shareData : null}>
                        <Breadcrumb.Item onClick={() => { this.props.history.push('/investor-opportunities') }}><a className="bread-crumb-a">Opportunities {`/`} </a></Breadcrumb.Item>
                        <Breadcrumb.Item onClick={() => { this.props.history.push('/deal-investment', { data: this.state.shareData }) }}><a className="bread-crumb-a">{this.state.shareData && this.state.shareData.portfolioCompanyName ? this.state.shareData.portfolioCompanyName : null} {`/`} </a></Breadcrumb.Item>
                        <span>Investment</span>
                    </Breadcrumb>

                    <h1 className="page-main-heading">Invest as</h1>
                    <Row gutter={[16]} className="invest-main-row-sec">
                        <Col sm={24} md={15} lg={19}>
                            <h1 className="page-main-heading">{this.state.offerData && this.state.offerData.portfolioCompanyName ? this.state.offerData.portfolioCompanyName : null}</h1>
                            <div>
                                <div className="document-type-card">
                                    <div className="card-main" id="steps-investor-individual">
                                        <Steps size="small" type="navigation"
                                            current={this.state.step}  >
                                            <Step title="Individual" onClick={() => { this.setState({ step: 0 }) }} value={0} />
                                            <Step title="Entity" onClick={() => { this.setState({ step: 1 }) }} value={1} />
                                            <Step title="IRA" onClick={() => { this.setState({ step: 2 }) }} value={2} />
                                        </Steps>
                                        {/* {this.state.step == 0 ?
                                    <div className="individual-radio-section">
                                        <Radio.Group onChange={(e) => this.onChangeRadioButtons(e.target.value)} value={this.state.formType}>
                                            <Space direction="vertical">
                                                <Radio value={1}>Individual</Radio>
                                                <Radio value={2}>Entity</Radio>
                                                <Radio value={3}>IRA</Radio>
                                            </Space>
                                        </Radio.Group>
                                        <div className="back-complete-btn">
                                            <Button type="primary" className="primary-button-back" onClick={() => {
                                                this.props.history.goBack()
                                            }}>Back</Button>

                                        </div>
                                    </div> : null} */}
                                        {this.state.step == 0 ?
                                            <>
                                                {/* getting forms on selecting radio */}
                                                {/* {this.state.formType == 1 ?  */}
                                                <div key={this.state.user ? this.state.user : null} className="ani-left-to-right">
                                                    <PaymentInvesterIndividual shareData={this.state.shareData} user={this.state.user} showCheckBox={this.state.showCheckBox} history={this.props.history} propss={this.props} submitForm={this.handleSubmitForm.bind(this)} goBack={this.handleBack.bind(this)} />
                                                </div>
                                                {/* // : null} */}
                                                {/* {this.state.formType == 2 ? <div className="ani-left-to-right"> */}
                                                {/* <AddEntity shareData={this.state.shareData} user={this.state.user} express={true} history={this.props.history} submitForm={this.handleSubmitForm.bind(this)} goBack={this.handleBack.bind(this)} /> */}
                                                {/* </div> : null}
                                        {this.state.formType == 3 ? <div className="ani-left-to-right"> <InvesterIre user={this.state.user} history={this.props.history} submitForm={this.handleSubmitForm.bind(this)} goBack={this.handleBack.bind(this)} /> </div> : null} */}
                                            </>
                                            : null}
                                        {this.state.step == 1 ? <div className="ani-left-to-right">
                                            <AddEntity shareData={this.state.shareData} user={this.state.user} express={true} history={this.props.history} submitForm={this.handleSubmitForm.bind(this)} goBack={this.handleBack.bind(this)} />
                                        </div>
                                            : null}

                                        {this.state.step == 2 ? <div className="ani-left-to-right"> <InvesterIre user={this.state.user} history={this.props.history} submitForm={this.handleSubmitForm.bind(this)} goBack={this.handleBack.bind(this)} /> </div> : null}

                                        {this.state.step == 4 ?
                                            <div>
                                                <div className="hloding-invester">
                                                    <Row gutter={[16]}>
                                                        <Col sm={24} md={24} lg={24}>
                                                            <div className="holdings-details-sub-sec" id="holdings-details-sub-sec">
                                                                <div className="success-sec">
                                                                    <img src={checkSuccess} />
                                                                    <h2>Thank you</h2>
                                                                    <p>For your interest in {this.state.holdingData && this.state.holdingData.opportunityDetails && this.state.holdingData.opportunityDetails.portfolioCompanyName ? this.state.holdingData.opportunityDetails.portfolioCompanyName : null} Our Operations team will reach out with further steps</p>
                                                                </div>
                                                                <div className="logo-text-sec" key={this.state.holdingData ? this.state.holdingData : null}>
                                                                    <Row gutter={[16]} className="logo-name row-logo-name">
                                                                        <Col xsm={24} sm={24} md={12} lg={12} className="company-sec-div">

                                                                            {this.state.holdingData && this.state.holdingData.opportunityDetails && this.state.holdingData.opportunityDetails.logo && this.state.holdingData.opportunityDetails.logo.orginalUrl ? <img width="100" src={this.state.holdingData.opportunityDetails.logo.orginalUrl} />
                                                                                : <img src={cardImage} />}
                                                                            <h2 className="company-name">{this.state.holdingData && this.state.holdingData.opportunityDetails && this.state.holdingData.opportunityDetails.portfolioCompanyName ? this.state.holdingData.opportunityDetails.portfolioCompanyName : null}
                                                                            </h2>
                                                                            <div className="card-text-sec">
                                                                                <div className="security-section">
                                                                                    <label>Shares Unit  </label><label>: {this.state.holdingData ? this.state.holdingData.numberOfShares : 0}</label>

                                                                                </div>
                                                                                {this.state.holdingData && this.state.holdingData.opportunityDetails && this.state.holdingData.opportunityDetails.pricePerShare ?
                                                                                    <div className="security-section">
                                                                                        <label>Price Per Share </label> <label>: ${this.state.holdingData && this.state.holdingData.opportunityDetails ? this.state.holdingData.opportunityDetails.pricePerShare : 0}</label>

                                                                                    </div> :
                                                                                    <div className="security-section">
                                                                                        <label>Price Per Unit </label> <label>: ${this.state.holdingData && this.state.holdingData.opportunityDetails ? this.state.holdingData.opportunityDetails.pricePerUnit : 0}</label>

                                                                                    </div>
                                                                                }

                                                                                <div className="security-section">
                                                                                    <label>Total Value </label> <label>: ${this.state.holdingData ? (this.state.holdingData.transactionVolume.toLocaleString('USD')) : 0}</label>
                                                                                </div>
                                                                                <div className="security-section">
                                                                                    <label>Invested On </label><label>: {this.state.holdingData ? moment(new Date(this.state.holdingData.createdAt)).format('MM/DD/YYYY') : null}</label>

                                                                                </div>

                                                                            </div>
                                                                        </Col>

                                                                        <Col xsm={24} sm={24} md={12} lg={12} className="contact-col">
                                                                            <div className="holdings-details-sub-sec">
                                                                                <div className="contact-us-section">
                                                                                    <h1 className="lets-connect">Let's Connect</h1>
                                                                                    <p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                                                                                    <div className="mobile-num"><img src={mobileIcon} /> +919998886644</div>
                                                                                    <div className="chat-sec" onClick={() => { window.FreshworksWidget('open') }}><img src={chatIcon} /><a> Chat with us</a></div>
                                                                                </div>
                                                                            </div>
                                                                        </Col>
                                                                    </Row>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Row>

                                                </div>

                                            </div>
                                            : null}
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col sm={24} md={8} lg={5} className="share-form-col">
                            <div className="shares-form">
                                <Form layout="horizantal" initialValues={this.state.shareData} ref={this.formRef} >
                                    <Row className="total-price-row-sec">
                                        <Col sm={24} md={24} lg={24} className="caliculation-sec">
                                            {this.state.shareData && this.state.shareData.pricePerShare ?
                                                <Form.Item
                                                    name="shares"
                                                    label="No. of shares"
                                                >
                                                    <Input type="number" onChange={this.handelNumberOfShares} onKeyDown={(evt) => (evt.key === '+' || evt.key === '.' || evt.key === '-' || evt.key === 'e') && evt.preventDefault()} prefix={<MailOutlined className="main-outlined" />} />
                                                </Form.Item> :
                                                <Form.Item
                                                    name="shares"
                                                    label="No. of Units"
                                                >
                                                    <Input type="number" onChange={this.handelNumberOfShares} onKeyDown={(evt) => (evt.key === '+' || evt.key === '.' || evt.key === '-' || evt.key === 'e') && evt.preventDefault()} prefix={<MailOutlined className="main-outlined" />} />
                                                </Form.Item>
                                            }

                                        </Col>

                                    </Row>
                                    {this.state.shareData && this.state.shareData.pricePerShare ?
                                        <>
                                            <Row className="total-price-row-sec">
                                                <Col sm={12} md={12} lg={15} className="price-sec">
                                                    <div className="share-price-label">Share Price:</div>
                                                </Col>
                                                <Col sm={12} md={12} lg={9} className="price-sec">
                                                    {this.state.shareData && this.state.shareData.pricePerShare ? <div className="total-price-div"> <span className="multile-dolor">$  </span><span className="share-price-text">{this.state.shareData.pricePerShare}</span></div> : <div className="total-price-div">$0</div>}

                                                    {/* <div className="total-price-div"> <span className="multile-dolor">$  </span><span className="share-price-text">10</span></div> */}
                                                </Col>
                                            </Row>
                                        </> :
                                        <>
                                            <Row className="total-price-row-sec">
                                                <Col sm={12} md={12} lg={15} className="price-sec">
                                                    <div className="share-price-label">Unit Price:</div>
                                                </Col>
                                                <Col sm={12} md={12} lg={9} className="price-sec">
                                                    {this.state.shareData && this.state.shareData.pricePerUnit ? <div className="total-price-div"> <span className="multile-dolor">$  </span><span className="share-price-text">{this.state.shareData.pricePerUnit}</span></div> : <div className="total-price-div">$0</div>}

                                                    {/* <div className="total-price-div"> <span className="multile-dolor">$  </span><span className="share-price-text">10</span></div> */}
                                                </Col>
                                            </Row>
                                        </>}
                                    <p className="subscription-amount">Subscription Amount:  <br /><label> ${this.state.transactionVolume.toLocaleString('USD')}</label></p>
                                    <div className="shares-next-button">
                                        {/* <Button type="primary" >NEXT</Button> */}
                                        {/* <p onClick={() => {
                        this.props.history.push('/profile')
                      }}>Complete Your Profile</p> */}
                                    </div>
                                </Form>
                            </div>
                            {/* <div className="shares-form-accredited">
                                <p>How is <span className="">{this.state.user ? (this.state.user.firstName + " " + this.state.user.lastName) : null}</span> accredited?</p>
                                <Radio.Group onChange={this.onChangeAccridate} defaultValue={this.state.accridate}>
                                    <Space direction="vertical">
                                        {this.state.q1List.map((item, index) => {
                                            return <Radio value={item.optionText}>{item.optionText}</Radio>
                                        })}
                                    </Space>

                                </Radio.Group>
                            </div> */}
                        </Col>
                    </Row>
                </div>
                <Footer history={this.props.history} />
            </div >
        )
    }
}

export default connect(null, { getUserDataLean, addNewNotification, getAllQuestionsByFilters })(InvesterIndividual);
