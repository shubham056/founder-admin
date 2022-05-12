import React, { Component } from 'react';
import { Card, Button, Row, Col } from 'antd';
import cardImage from "../../assets/images/cardImage.png";
import moment from 'moment';
import { MailOutlined } from "@ant-design/icons";
import mobileIcon from '../../assets/images/mobileIcon.png';
import chatIcon from '../../assets/images/chatIcon.png';
import checkSuccess from '../../assets/images/checkSuccess.png';
import { connect } from 'react-redux';
import { getUserDataLean } from '../../Redux/Crud';
import { AppHeader, Loading, Footer } from '../../Components';
import '../../App.css';
import './OpportunitySuccess.css';
import { Strings } from '../../Constants/Strings';


const { Meta } = Card;
class OpportunitySuccess extends Component {
    constructor(props) {
        super(props)

        this.state = {
            user: null,
            holdingData: null

        }
    }

    componentDidMount() {
        console.log(this.props)
        window.scrollTo(0, 0);
        // window.FreshworksWidget('show');
        this.getUserDetails();
        this.setState({
            holdingData: this.props.location.state.holdingData
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
    render() {
        return (
            <div className="opportunity-success-main">
                <div key={this.state.user ? this.state.user : null}>
                    <AppHeader history={this.props.history} user={this.state.user} />
                </div>
                <div className="container-payment ani-left-to-right">
                    <h1 className="login-register-title-h investor-opportunity-title-h">Hello <span className="">{this.state.user ? (this.state.user.firstName + " " + this.state.user.lastName) : null}</span><br />Make The Right Investment</h1>
                    <div className="hloding-invester">
                        <h2 className="thankyou-h">Thank you, for expressing interest in {this.state.holdingData && this.state.holdingData.opportunityDetails && this.state.holdingData.opportunityDetails.portfolioCompanyName ? this.state.holdingData.opportunityDetails.portfolioCompanyName : null}.</h2>
                        <h3 className="thankyou-dec">Our operations team will get in touch with you shortly.</h3>
                        <div className="logo-text-sec" key={this.state.holdingData ? this.state.holdingData : null}>
                            <div className="logo-name row-logo-name">
                                <div className="company-sec-div">

                                    {this.state.holdingData && this.state.holdingData.opportunityDetails && this.state.holdingData.opportunityDetails.logo && this.state.holdingData.opportunityDetails.logo.orginalUrl ? <img width="100" src={this.state.holdingData.opportunityDetails.logo.orginalUrl} />
                                        : <img src={cardImage} />}
                                    {/* <h2 className="company-name">{this.state.holdingData && this.state.holdingData.opportunityDetails && this.state.holdingData.opportunityDetails.portfolioCompanyName ? this.state.holdingData.opportunityDetails.portfolioCompanyName : null} */}
                                    {/* </h2> */}
                                    <div className="card-text-sec">
                                        <div className="security-section">
                                        {this.state.holdingData && this.state.holdingData.opportunityDetails && this.state.holdingData.opportunityDetails.pricePerShare ?
                                            <label style={{fontWeight:"bolder"}}>No. of Shares:  </label>:
                                            <label style={{fontWeight:"bolder"}}>No. of Units:  </label>
                                        }
                                            
                                            <label> {this.state.holdingData ? this.state.holdingData.numberOfShares : 0}</label>

                                        </div>
                                        {this.state.holdingData && this.state.holdingData.opportunityDetails && this.state.holdingData.opportunityDetails.pricePerShare ?
                                            <div className="security-section">
                                                <label style={{fontWeight:"bolder"}}>Price Per Share: </label> <label> ${this.state.holdingData && this.state.holdingData.opportunityDetails ? this.state.holdingData.opportunityDetails.pricePerShare : 0}</label>

                                            </div> :
                                            <div className="security-section">
                                                <label style={{fontWeight:"bolder"}}>Price Per Unit: </label> <label> ${this.state.holdingData && this.state.holdingData.opportunityDetails ? this.state.holdingData.opportunityDetails.pricePerUnit : 0}</label>

                                            </div>
                                        }
                                        {this.state.holdingData && this.state.holdingData.opportunityDetails && this.state.holdingData.opportunityDetails.primaryDetails && this.state.holdingData.opportunityDetails.primaryDetails.length > 0  ? 
                                    <div className="security-section">
                                                    {this.state.holdingData.opportunityDetails.primaryDetails.map((item) => {
                                                        return (
                                                            <div className="security-section">
                                                                <label  style={{fontWeight:"bolder"}}>{item.key} </label>
                                                                <label>{item.value}</label>
                                                            </div>

                                                        )
                                                    })}
                                                
                                    </div>: null}
                                    
                                        <div className="security-section">
                                            <label  style={{fontWeight:"bolder"}}>Invested On: </label><label> {this.state.holdingData ? moment(new Date(this.state.holdingData.createdAt)).format('MM/DD/YYYY') : null}</label>
                                        </div>
                                        <div className="security-section total-value">
                                            <label  style={{fontWeight:"bolder"} }>Total Value: </label> <label> ${this.state.holdingData ? (this.state.holdingData.transactionVolume.toLocaleString('USD')) : 0}</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <h4 className="thankyou-p">Please wait. You are being redirected to <span  onClick={() => { this.props.history.push('/my-holdings') }}>My holdings</span></h4> */}
                    </div>
                </div>
                 <Footer history={this.props.history} />
            </div>
        )

    }
}

export default connect(null, { getUserDataLean })(OpportunitySuccess);