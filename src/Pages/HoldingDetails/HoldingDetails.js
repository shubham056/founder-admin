import React, { Component } from 'react'
import { connect } from 'react-redux'

import { getUserDataLean, getByExpressInterestIdLean, getSignedUrls } from '../../Redux/Crud';
import { Strings } from '../../Constants/Strings';
import { AppHeader, Footer } from '../../Components';
import './HoldingDetails.css';
import { Row, Col, Tabs, Table, Breadcrumb, Timeline, Menu, Steps, Dropdown } from 'antd';
import { UpOutlined, DownOutlined, CheckCircleOutlined, MessageOutlined, MessageFilled, FilePdfFilled, InfoCircleTwoTone, CloseCircleOutlined } from '@ant-design/icons';
import cardImage from "../../assets/images/cardImage.png";
import moment from 'moment';

import greenTick from "../../assets/icons/checkcircle.svg";
import warning from "../../assets/icons/warning.svg";
import expandless from "../../assets/icons/expandless.svg";
import expandmore from "../../assets/icons/expandmore.svg"

import mobileIcon from '../../assets/images/mobileIcon.png';
import chatIcon from '../../assets/images/chatIcon.png';
import { isValidElement } from 'react';
// import './MyHoldings.css';

const { TabPane } = Tabs;

function callback(key) {
}

const { Step } = Steps;
class HoldingDetails extends Component {
    constructor(props) {
        super(props)

        this.state = {
            user: null,
            holdingData: null
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.getUserDetails();
        console.log(this.props.location.state.data)
        // this.setState({
        //     holdingData: this.props.location.state.data
        // }, () => {
        if (this.props.location.state.data) {
            this.getParticularOrderData()
        }
        // }); 
    }

    //get particular order data
    getParticularOrderData() {
        this.props.getByExpressInterestIdLean(this.props.location.state.data.id).then((res) => {
            if (res.type == Strings.successType) {
                if (res.data) {
                    this.state.holdingData = res.data;
                    this.setState({ holdingData: this.state.holdingData }, () => {
                        console.log(this.state.holdingData, res.data)
                    })
                }
            }
        })
    }

    // getSignedUrl
    getSignedUrl(val) {
        this.setState({ loading: true });
        this.props.getSignedUrls({
            key: val,
            from: "docusign"
        }).then((res) => {
            if (res.type == Strings.successType) {
                this.setState({ loading: false });
                window.open(res.data, '_blank')
            } else {
                this.setState({ loading: false });
            }
        })
    }

    //getting user data
    getUserDetails() {
        if (localStorage.getItem('userData')) {
            let user = JSON.parse(localStorage.getItem('userData'));
            this.props.getUserDataLean(user.id)
                .then(res => {
                    if (res.type == Strings.successType) {
                        this.setState({
                            user: res.data,
                        });
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

    render() {
        const menu = (
            <Steps className="holding-details-steps">
                <Step status="finish" title="Indicated" description="Interest" icon={<CheckCircleOutlined />} />
                <Step status={this.state.holdingData && this.state.holdingData.expressInterstStatus && (this.state.holdingData.expressInterstStatus == 2 || this.state.holdingData.expressInterstStatus >= 2)} title="Subscription" description="Received" icon={<CheckCircleOutlined />} />
                {this.state.holdingData && this.state.holdingData.regeneratedStatus ?
                    (this.state.holdingData && this.state.holdingData.memberSigned ?
                        <Step status={this.state.holdingData && this.state.holdingData.memberSigned} title="Member" description="Signed" icon={<CheckCircleOutlined />} /> : null) :
                    <Step status={this.state.holdingData && this.state.holdingData.memberSigned} title="Member" description="Signed" icon={<CheckCircleOutlined />} />}
                {this.state.holdingData && this.state.holdingData.regeneratedStatus ?
                    <Step status="finish" title="Re generated" icon={<CheckCircleOutlined />} /> : null}
                {this.state.holdingData && this.state.holdingData.regeneratedStatus ?
                    <Step status={this.state.holdingData && this.state.holdingData.memberReSigned} title="Member" description="Signed" icon={<CheckCircleOutlined />} /> : null}
                {this.state.holdingData && this.state.holdingData.isPaymentCompleted ?
                    <Step status="finish" title="Funded" icon={<CheckCircleOutlined />} /> :
                    (this.state.holdingData && this.state.holdingData.partialPayment ?
                        <Step status="finish" title="Funded" icon={<InfoCircleTwoTone />} /> :
                        <Step title="Funded" icon={<CheckCircleOutlined />} />)
                }
                {this.state.holdingData && this.state.holdingData.regeneratedStatus ?
                    <Step status={this.state.holdingData && this.state.holdingData.counterReSigned} title="Counter" description="Signed" icon={<CheckCircleOutlined />} /> :
                    <Step status={this.state.holdingData && this.state.holdingData.counterSigned} title="Counter" description="Signed" icon={<CheckCircleOutlined />} />}
                <Step status={this.state.holdingData && this.state.holdingData.expressInterstStatus && this.state.holdingData.expressInterstStatus >= 3} title="Subscription" description="Completed" icon={<CheckCircleOutlined />} />
            </Steps>
        );
        const { form, data } = this.props.location.state;
        if (form) {
            this.state.holdingData = data;
        }
        // this.state.holdingData = data;
        const dataRows = [

        ];
        const columns = [
            {
                title: 'Document Type', fixed: 'left', key: 'id'
            },
            {
                title: 'Date Signed', key: 'id'
            },
            {
                title: 'Status', key: 'id'
            },
            {
                title: '', fixed: 'right', key: 'id'
            },
        ];

        return (
            <div className="my-holdings-main invester-opp-main" id="my-holdings">
                <div key={this.state.user ? this.state.user : null}>
                    <AppHeader history={this.props.history} user={this.state.user} />
                </div>
                <div className="bread-crum-container">
                    <Breadcrumb separator="" key={this.state.holdingData && this.state.holdingData.opportunityDetails ? this.state.holdingData.opportunityDetails : null}>
                        <Breadcrumb.Item onClick={() => { this.props.history.push('/my-holdings') }}>Holdings {`/`} </Breadcrumb.Item>
                        <span>{this.state.holdingData && this.state.holdingData.opportunityDetails && this.state.holdingData.opportunityDetails.portfolioCompanyName ? this.state.holdingData.opportunityDetails.portfolioCompanyName : null}</span>
                    </Breadcrumb>
                </div>
                <div className="hloding-invester ani-left-to-right my-hold-investor">
                    <div gutter={[16]} className="logo-name-img" justify="center">
                        {this.state.holdingData && this.state.holdingData.opportunityDetails && this.state.holdingData.opportunityDetails.logo && this.state.holdingData.opportunityDetails.logo.orginalUrl ? <img width=" " src={this.state.holdingData.opportunityDetails.logo.orginalUrl} />
                            : <img src={cardImage} />}
                        <h1 className="company-name">{this.state.holdingData && this.state.holdingData.opportunityDetails && this.state.holdingData.opportunityDetails.portfolioCompanyName ? this.state.holdingData.opportunityDetails.portfolioCompanyName : null}
                        </h1>
                    </div>
                    <Row gutter={[16]} className="investor-joint-investor-details">

                        <Col sm={24} md={24} lg={24} className="web-only">
                            <div className="holdings-details-sub-sec">
                                <h2 className="holding-detail-company-name holding-details-step">Status</h2>
                                <>
                                    <Steps className="holding-details-steps">
                                        <Step status="finish" title="Indicated" description="Interest" icon={<CheckCircleOutlined />} />
                                        <Step status={this.state.holdingData && this.state.holdingData.expressInterstStatus && (this.state.holdingData.expressInterstStatus == 2 || this.state.holdingData.expressInterstStatus >= 2)} title="Subscription" description="Received" icon={<CheckCircleOutlined />} />
                                        {this.state.holdingData && this.state.holdingData.regeneratedStatus ?
                                            (this.state.holdingData && this.state.holdingData.memberSigned ?
                                                <Step status={this.state.holdingData && this.state.holdingData.memberSigned} title="Member" description="Signed" icon={<CheckCircleOutlined />} /> : null) :
                                            <Step status={this.state.holdingData && this.state.holdingData.memberSigned} title="Member" description="Signed" icon={<CheckCircleOutlined />} />}
                                        {this.state.holdingData && this.state.holdingData.regeneratedStatus ?
                                            <Step status="finish" title="Regenerated" icon={<CheckCircleOutlined />} /> : null}
                                        {this.state.holdingData && this.state.holdingData.regeneratedStatus ?
                                            <Step status={this.state.holdingData && this.state.holdingData.memberReSigned} title="Member" description="Signed" icon={<CheckCircleOutlined />} /> : null}
                                        {this.state.holdingData && this.state.holdingData.isPaymentCompleted ?
                                            <Step status="finish" title="Funded" icon={<CheckCircleOutlined />} /> :
                                            (this.state.holdingData && this.state.holdingData.partialPayment ?
                                                <Step status="finish" title="Funded" icon={<InfoCircleTwoTone />} /> :
                                                <Step title="Funded" icon={<CheckCircleOutlined />} />)
                                        }
                                        {this.state.holdingData && this.state.holdingData.regeneratedStatus ?
                                            <Step status={this.state.holdingData && this.state.holdingData.counterReSigned} title="Counter" description="Signed" icon={<CheckCircleOutlined />} /> :
                                            <Step status={this.state.holdingData && this.state.holdingData.counterSigned} title="Counter" description="Signed" icon={<CheckCircleOutlined />} />}
                                        <Step status={this.state.holdingData && this.state.holdingData.expressInterstStatus && this.state.holdingData.expressInterstStatus >= 3} title="Subscription" description="Completed" icon={<CheckCircleOutlined />} />
                                        {this.state.holdingData && this.state.holdingData.expressInterstStatus ?
                                            <Step status={this.state.holdingData && this.state.holdingData.expressInterstStatus == 5} title="Delivered" icon={<CheckCircleOutlined />} /> : null}
                                    </Steps>

                                </>,
                            </div>
                        </Col>
                        <Col sm={24} md={24} lg={24} className="mobile-only">
                            <div className="holdings-details-sub-sec">
                                <>
                                    <Dropdown overlay={menu} trigger={['click']}>
                                        <div className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                            Status <DownOutlined />
                                        </div>
                                    </Dropdown>
                                </>
                            </div>
                        </Col>
                    </Row>
                    <div className="investor-joint-investor-details" id="investor-joint-investor-details">
                        <Row gutter={[16]}>
                            <Col xsm={24} sm={12} md={12} lg={12}>
                                {this.state.holdingData && this.state.holdingData.investorDetails ?
                                    <div className="holdings-details-sub-sec" >
                                        <h2 className="holding-detail-company-name">Investor Details</h2>
                                        <div className="security-section">
                                            <label>Full Name: <span>{this.state.holdingData && this.state.holdingData.investorDetails ? (this.state.holdingData.investorDetails.firstName + " " + (this.state.holdingData.investorDetails.middleName ? this.state.holdingData.investorDetails.middleName + " " : "") + this.state.holdingData.investorDetails.lastName) : null}</span> </label>
                                        </div>

                                        <div className="security-section">
                                            <label>Email: <span>{this.state.holdingData && this.state.holdingData.investorDetails ? this.state.holdingData.investorDetails.email : null}</span> </label>
                                        </div>
                                    </div>
                                    : null}

                            </Col>
                            <Col xsm={24} sm={12} md={12} lg={12}>

                                {this.state.holdingData && this.state.holdingData.investorDetails ?
                                    <div className="holdings-details-sub-sec" >
                                        <h2 className="holding-detail-company-name-copy">Investor Details</h2>
                                        <div className="security-section">
                                            <label> Contact Number: <span>{this.state.holdingData && this.state.holdingData.investorDetails ? this.state.holdingData.investorDetails.countryCode + " " + this.state.holdingData.investorDetails.phoneNumber : null}</span> </label>
                                        </div>
                                        {/* <div className="security-section">
                                            <label>Tax Identification Number:<span> {this.state.holdingData && this.state.holdingData.investorDetails ? this.state.holdingData.investorDetails.taxId : null}</span> </label>
                                        </div> */}
                                    </div>
                                    : null}
                            </Col>

                        </Row>
                        <Row className="joint-investor-row ">
                            <Col xsm={24} sm={24} md={12} lg={12}>
                                {this.state.holdingData && this.state.holdingData.jointInvestorDetails ?
                                    <>
                                        <div className="holdings-details-sub-sec" >
                                            <h2 className="holding-detail-company-name">Joint Investor Details</h2>
                                            <div className="security-section">
                                                <label>Full Name : <span>{this.state.holdingData && this.state.holdingData.jointInvestorDetails ? (this.state.holdingData.jointInvestorDetails.firstName + " " + (this.state.holdingData.jointInvestorDetails.middleName ? this.state.holdingData.jointInvestorDetails.middleName + " " : "") + this.state.holdingData.jointInvestorDetails.lastName) : null}</span> </label>
                                            </div>

                                            <div className="security-section">
                                                <label>Email :<span> {this.state.holdingData && this.state.holdingData.jointInvestorDetails ? this.state.holdingData.jointInvestorDetails.email : null} </span></label>
                                            </div>
                                        </div>
                                    </>
                                    : null}
                            </Col>
                            <Col xsm={24} sm={24} md={12} lg={12} className="joint-investor-second-col">
                                {this.state.holdingData && this.state.holdingData.jointInvestorDetails ?
                                    <>
                                        <div className="holdings-details-sub-sec" >
                                            <h2 className="holding-detail-company-name-copy">Joint Investor Details</h2>
                                            <div className="security-section">
                                                <label>Contact Number : <span>{this.state.holdingData && this.state.holdingData.jointInvestorDetails ? this.state.holdingData.jointInvestorDetails.countryCode + " " + this.state.holdingData.jointInvestorDetails.phoneNumber : null} </span></label>
                                            </div>
                                            {/* <div className="security-section">
                                                <label>Tax Identification Number :<span> {this.state.holdingData && this.state.holdingData.investAsDetails && this.state.holdingData.investAsDetails.jointInvestor ? this.state.holdingData.investAsDetails.jointInvestor.taxId : null}</span> </label>
                                            </div> */}
                                        </div>
                                    </>
                                    : null}
                            </Col>
                        </Row>
                        {this.state.holdingData && this.state.holdingData.investorTypeId == 2 ?
                            <Row className="joint-investor-row ">
                                <Col xsm={24} sm={24} md={12} lg={12}>
                                    {this.state.holdingData && this.state.holdingData.entityDetails && this.state.holdingData.entityDetails ?
                                        <>
                                            <div className="holdings-details-sub-sec" >
                                                <h2 className="holding-detail-company-name">Entity Details</h2>
                                                <div className="security-section">
                                                    <label>Entity Name :<span> {this.state.holdingData && this.state.holdingData.entityDetails && this.state.holdingData.entityDetails ? this.state.holdingData.entityDetails.entityName : null} </span></label>
                                                </div>
                                                <div className="security-section">
                                                    <label>Full Name : <span>{this.state.holdingData && this.state.holdingData.entityDetails && this.state.holdingData.entityDetails ? (this.state.holdingData.entityDetails.firstName + " " + (this.state.holdingData.entityDetails.middleName ? this.state.holdingData.entityDetails.middleName + " " : "") + this.state.holdingData.entityDetails.lastName) : null}</span> </label>
                                                </div>

                                                <div className="security-section">
                                                    <label>Email :<span> {this.state.holdingData && this.state.holdingData.entityDetails && this.state.holdingData.entityDetails ? this.state.holdingData.entityDetails.email : null} </span></label>
                                                </div>
                                            </div>
                                        </>
                                        : null}
                                </Col>
                                <Col xsm={24} sm={24} md={12} lg={12}>
                                    {this.state.holdingData && this.state.holdingData.entityDetails && this.state.holdingData.entityDetails ?
                                        <>
                                            <div className="holdings-details-sub-sec" >
                                                <h2 className="holding-detail-company-name-copy">Entity Details</h2>
                                                <div className="security-section">
                                                    <label>Contact Number : <span>{this.state.holdingData && this.state.holdingData.entityDetails ? this.state.holdingData.entityDetails.countryCode + " " + this.state.holdingData.entityDetails.phoneNumber : null} </span></label>
                                                </div>
                                                {/* <div className="security-section">
                                                    <label>Tax Identification Number :<span> {this.state.holdingData && this.state.holdingData.investAsDetails && this.state.holdingData.investAsDetails ? this.state.holdingData.investAsDetails.taxId : null}</span> </label>
                                                </div> */}
                                            </div>
                                        </>
                                        : null}
                                </Col>
                            </Row>
                            : null}
                    </div>
                    <Row>
                        <Col sm={24} md={12} lg={12}>
                            {this.state.holdingData && this.state.holdingData.documents && this.state.holdingData.documents && this.state.holdingData.documents.length > 0 ?
                                <div className="holdings-details-sub-sec">
                                    <h2>Documents</h2>
                                    {this.state.holdingData && this.state.holdingData.documents && this.state.holdingData.documents.map((item, ind) => {
                                        if (item && item.filePath) {
                                            return (
                                                <div className="documents-card">
                                                    <div className="file-document"><FilePdfFilled />
                                                        <span>DocuSign Document</span></div>
                                                    <a onClick={() => {
                                                        this.getSignedUrl(item.filePath)
                                                    }}>View</a>
                                                </div>
                                            )
                                        }
                                    })}
                                </div> : null}
                        </Col>
                    </Row>
                    <Row gutter={[16]} className="logo-name my-holding-details joint-investor-row-holdings">
                        <Col xsm={24} sm={24} md={12} lg={12} className="company-sec-div">
                            <div className="logo-text-sec" key={this.state.holdingData ? this.state.holdingData : null}>

                                <h3 className="security-section security-section-label">Breakdown</h3>
                                <div className="card-text-sec">
                                    <div className="security-section">
                                        <label>Shares Unit : {this.state.holdingData ? this.state.holdingData.numberOfShares : 0}</label>

                                    </div>
                                    {this.state.holdingData && this.state.holdingData.opportunityDetails && this.state.holdingData.opportunityDetails.pricePerShare ?
                                        <div className="security-section">
                                            <label>Price Per Share : ${this.state.holdingData && this.state.holdingData.opportunityDetails ? this.state.holdingData.opportunityDetails.pricePerShare : 0}</label>
                                        </div> :
                                        <div className="security-section">
                                            <label>Price Per Unit : ${this.state.holdingData && this.state.holdingData.opportunityDetails ? this.state.holdingData.opportunityDetails.pricePerUnit : 0}</label>
                                        </div>}
                                    {this.state.holdingData && this.state.holdingData.opportunityDetails && this.state.holdingData.opportunityDetails.primaryDetails && this.state.holdingData.opportunityDetails.primaryDetails.length > 0 ?
                                        <div className="security-section">
                                            {this.state.holdingData.opportunityDetails.primaryDetails.map((item) => {
                                                if (item.key.indexOf('Carry') < 0 )
                                                    return ( // <div>
                                                        <label>{item.key} {item.value}</label>
                                                        // </div>
                                                    )
                                            })}

                                        </div> : null}
                                    {this.state.holdingData ?
                                        <label> {(this.state.holdingData.carriedInterest != null) ?

                                            <div className="security-section">
                                                <label>Carry : {this.state.holdingData.carriedInterest}%</label>
                                            </div>
                                            :
                                            <div className="security-section">
                                                {this.state.holdingData.opportunityDetails.primaryDetails.map((item) => {
                                                if (item.key.indexOf('Carry') >= 0 )
                                                        return (
                                                            // <div>
                                                            <label>{item.key} {item.value}</label>
                                                            // </div>

                                                        )
                                                })}
                                            </div>
                                        }</label>
                                        :
                                        null}
                                    <div className="security-section">
                                        <label>Total Value : ${this.state.holdingData ? (this.state.holdingData.transactionVolume.toLocaleString('USD')) : 0}</label>
                                    </div>
                                    <div className="security-section">
                                        <label>Investor Type : {this.state.holdingData && this.state.holdingData.investorTypeId ? (this.state.holdingData.investorTypeId == 1 ? ("Individual" + (this.state.holdingData.investAsDetails && this.state.holdingData.investAsDetails.jointInvestor ? " (Joint)" : "")) :
                                            (this.state.holdingData.investorTypeId == 2 ? "Entity" : (this.state.holdingData.investorTypeId == 3 ? "IRA" : null))
                                        ) : null}</label>
                                    </div>
                                    <div className="security-section">
                                        <label>Invested On : {this.state.holdingData ? moment(new Date(this.state.holdingData.createdAt)).format('MM/DD/YYYY') : null}</label>

                                    </div>
                                    <div className="security-section">
                                        {data.paidOn ?

                                            <label>Paid On : {moment(new Date(data.paidOn)).format('MM/DD/YYYY')}</label>
                                            :
                                            null}
                                    </div>

                                </div>
                            </div>
                        </Col>

                        <Col xsm={24} sm={24} md={12} lg={12} className="contact-col">
                            <div className="holdings-details-sub-sec">
                                <div className="contact-us-section">
                                    <h3 className="lets-connect">Happy to help</h3>
                                    <p className='contact-email-btn'><a href="mailto:operations@topshelfequitypartners.com">Contact Us</a></p>
                                    <div className="mobile-num"><img src={mobileIcon} /> +1 (980) 422-5672</div>
                                    {/* <div className="chat-sec" onClick={() => { window.FreshworksWidget('open') }}><img src={chatIcon} /><a> Chat with us</a></div> */}
                                </div>
                            </div>

                        </Col>
                    </Row >
                </div >
                <Footer history={this.props.history} />
            </div >
        )
    }
}
export default connect(null, { getUserDataLean, getByExpressInterestIdLean, getSignedUrls })(HoldingDetails)

