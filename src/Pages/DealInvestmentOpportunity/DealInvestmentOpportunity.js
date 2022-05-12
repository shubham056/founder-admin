import React, { Component } from "react";

/* Antd library components */
import { Row, Col, List, Typography, Form, Tabs, Button, Input, Slider, notification, Breadcrumb } from "antd";

/* Relative imports */
import { AppHeader, Footer } from "../../Components";
import "./DealInvestmentOpportunity.css";
import cardImage from '../../assets/images/cardImage.png';
import cardImageTwo from '../../assets/images/cardImageTwo.png';
import members from "../../assets/images/members.PNG";
import { getUserDataLean, addNewMailJoining } from '../../Redux/Crud';
import { connect } from 'react-redux';
import { Strings } from '../../Constants/Strings';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import moment from 'moment';

import { EditorState, convertToRaw, convertFromRaw, convertFromHTML, CompositeDecorator, ContentState, compositeDecorator } from 'draft-js';

import { CloseOutlined, MailOutlined } from "@ant-design/icons";
const { Paragraph, Title } = Typography;

/* Deal investment opportunity component */
const { TabPane } = Tabs;
// const { Meta } = Card;
class DealInvestmentOpportunity extends Component {
  formRef = React.createRef()
  formRef1 = React.createRef()
  constructor(props) {
    super(props)
    this.state = {
      user: null,
      offerData: null,
      overView: null,
      shares: 100,
      transactionVolume: 0
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.setState({
      offerData: this.props.location.state.data ? this.props.location.state.data : null
    }, () => {
      this.state.overView = this.props.location.state.data && this.props.location.state.data.companyDetails && this.props.location.state.data.companyDetails.overview && this.props.location.state.data.companyDetails.overview.content ? EditorState.createWithContent(convertFromRaw(JSON.parse(this.props.location.state.data.companyDetails.overview.content))) : null;
      this.setState({ overView: this.state.overView });
      console.log(this.state.offerData);
      if (this.formRef.current) {
        let amount = (this.state.offerData && this.state.offerData.pricePerShare ? this.state.offerData.pricePerShare * this.state.shares : (this.state.offerData.pricePerUnit ? this.state.offerData.pricePerUnit * this.state.shares : 0));
        this.setState({
          transactionVolume: JSON.parse(amount.toFixed(2))
        })
        this.formRef.current.setFieldsValue({
          "shares": this.state.shares
        })
      }
    });
    this.getUserDetails()
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

  //handling form submit
  handleSubmit() {
    if (this.state.transactionVolume >= 10000) {
      let obj = this.state.offerData;
      obj.transactionVolume = this.state.transactionVolume;
      obj.selectedShares = this.state.shares;
      this.props.history.push('/investor-individual', { shareData: obj })
    } else {
      // this.showingMessage('error', Strings.transactionVolumeError);
      this.showingMessage('error', "Minimum Units must be greater than 100");
    }
  }


  //handling form submit for mail joining
  handleSubmitJoin(values) {
    this.props.addNewMailJoining({
      "userName": this.state.user.firstName + " " + (this.state.user.middleName ? this.state.user.middleName + " " : "") + this.state.user.lastName,
      "investorId": this.state.user.id,
      "email": values.email
    }).then((res) => {
      if (res.type == Strings.successType) {
        this.formRef1.current.resetFields();
        this.showingMessage(Strings.successType, Strings.mailJoinSuccess);
      }
    })
  }

  //showing notification message
  showingMessage(type, message) {
    notification[type]({
      description: message,
    });
  }

  //slider on change event
  handleSliderChange(e) {
    if (e) {
      this.formRef.current.setFieldsValue({
        "shares": e
      })
      this.setState({ shares: e }, () => {
        let amount = (this.state.offerData && this.state.offerData.pricePerShare ? this.state.offerData.pricePerShare * e : 0);
        this.setState({
          transactionVolume: JSON.parse(amount.toFixed(2))
        })
      })
    }
  }

  // input on change event
  handelNumberOfShares = (e) => {
    if (e.target.value) {
      if (e.target.value > 10000) {
        e.target.value = 10000;
      }
      this.formRef.current.setFieldsValue({
        "shares": e.target.value
      })
      this.setState({ shares: e.target.value }, () => {
        let amount = (this.state.offerData && this.state.offerData.pricePerShare ? this.state.offerData.pricePerShare * e.target.value : (this.state.offerData.pricePerUnit ? this.state.offerData.pricePerUnit * e.target.value : 0));
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
      // Deal Investment Opportunity
      <div className="deal-investment-section">
        <div key={this.state.user ? this.state.user : null}>
          <AppHeader history={this.props.history} user={this.state.user} />
        </div>

        {/* ----Deal investment line item---- */}
        <div className="container ani-left-to-right">
          {/* <h1 className="login-register-title-h investor-opportunity-title-h">Hello <span className="">{this.state.user ? (this.state.user.firstName + " " + this.state.user.lastName) : null}</span><br />Make The Right Investment</h1> */}

          <Breadcrumb separator="" key={this.state.offerData ? this.state.offerData : null}>
            <Breadcrumb.Item onClick={() => { this.props.history.push('/investor-opportunities') }}>Opportunities {`/`} </Breadcrumb.Item>
            <span>{this.state.offerData && this.state.offerData.portfolioCompanyName ? this.state.offerData.portfolioCompanyName : null}</span>
          </Breadcrumb>
          <div>
          <section>
            <Row gutter={[16, 16]} className="deal-lineitem">
              <Col sm={24} md={13} lg={17} className="company-details-section">
                <div className="logo-content">
                  <div>
                  {this.state.offerData && this.state.offerData.logo && this.state.offerData.logo.orginalUrl ?
                     <img src={this.state.offerData.logo.orginalUrl} className="deal-investor-company-logo"/>
                        : <img src={cardImage} className="deal-investor-company-logo"/>}
                  </div>
                  <div>
                    <h1 className="page-main-heading">{this.state.offerData && this.state.offerData.portfolioCompanyName ? this.state.offerData.portfolioCompanyName : null}</h1>
                    {/* {this.state.offerData && this.state.offerData.companyDetails && this.state.offerData.companyDetails.companyUrl ?
                  <h5>{this.state.offerData.companyDetails.companyUrl} | Founded: {moment(new Date(this.state.offerData.companyDetails.founded)).format('YYYY')} | Funding to Date: ${(this.state.offerData.companyDetails.fundingToDate).toLocaleString()}</h5> :
                  <p className="company-details-sec-div">Rubrik.com | Founded: Year | Funding to Date: $556,072,559</p>} */}

                    {this.state.offerData && this.state.offerData.companyDetails ?
                      <h4 className="company-name">{this.state.offerData.companyDetails.category ? this.state.offerData.companyDetails.category : null} {this.state.offerData.companyDetails.founded ? ' | ' + moment(new Date(this.state.offerData.companyDetails.founded)).format('YYYY') : null}{this.state.offerData.companyDetails.location ? ' | ' + this.state.offerData.companyDetails.location : null}</h4> : null}

                    {this.state.offerData && this.state.offerData.companyDetails && this.state.offerData.companyDetails.introOne ? <p className="about-company">{this.state.offerData.companyDetails.introOne}</p> :
                      <p className="about-company">Rubrik is a cloud data management company based in Palo Alto, California, United States founded in Deccember 2013 with offices in 10 countries</p>}
                    {/* {this.state.offerData && this.state.offerData.companyDetails && this.state.offerData.companyDetails.introTwo ? <p className="about-company-borderd">{this.state.offerData.companyDetails.introTwo}</p> : */}
                    {/* <p className="about-company-borderd">Rubrik is a cloud data management company based in Palo Alto, California, United States founded in Deccember 2013 with offices in 10 countries</p>} */}
                  </div>
                </div>
              </Col>
              {this.state.user && (this.state.user.verifyStatus == 2 && this.state.offerData.isFullySubscribed != true) ?
              <Col sm={24} md={9} lg={4} className="price-col">
                <div className="shares-form">
                  {/* <img src={cardImage} /> */}
                  {/* {this.state.offerData && this.state.offerData.logo && this.state.offerData.logo.thumbnailUrl ? <img width="100" src={this.state.offerData.logo.thumbnailUrl} />
                    : <img src={cardImage} />} */}

                  <Form layout="horizantal" initialValues={this.state.offerData} ref={this.formRef} >
                    {/* <label className="select-shares-label">Select no. of Shares</label>
                    <div className="range-slider-div">
                      <label> 0 </label><Slider min={0} max={10000} defaultValue={this.state.shares} value={this.state.shares}
                        onChange={(e) => { this.handleSliderChange(e) }} /><label> 10000</label>
                    </div> */}
                    <Row className="total-price-row-sec">
                      <Col sm={24} md={24} lg={24} className="caliculation-sec">
                      {this.state.offerData && this.state.offerData.pricePerShare ?
                        <Form.Item
                          name="shares"
                          label="No. of Shares:"
                        >

                          <Input type="number" onChange={this.handelNumberOfShares} onKeyDown={(evt) => (evt.key === '+' || evt.key === '.' || evt.key === '-' || evt.key === 'e') && evt.preventDefault()} prefix={<MailOutlined className="main-outlined" />} />

                        </Form.Item>:
                        <Form.Item
                        name="shares"
                        label="No. of Units:"
                      >

                        <Input type="number" onChange={this.handelNumberOfShares} onKeyDown={(evt) => (evt.key === '+' || evt.key === '.' || evt.key === '-' || evt.key === 'e') && evt.preventDefault()} prefix={<MailOutlined className="main-outlined" />} />

                      </Form.Item>

                      }
                      </Col>

                    </Row>
                    {this.state.offerData && this.state.offerData.pricePerShare ?
                      <>
                        <Row className="total-price-row-sec">
                          <Col sm={12} md={12} lg={15} className="price-sec">
                            <div className="share-price-label">Share Price: </div>
                           </Col>

                          <Col sm={12} md={12} lg={9} className="price-sec">
                            {this.state.offerData && this.state.offerData.pricePerShare ? <div className="total-price-div"> <span className="multile-dolor">$  </span><span className="share-price-text">{this.state.offerData.pricePerShare}</span></div> : <div className="total-price-div">Price per Share : $0</div>}
                          </Col>
                        </Row>
                      </> :
                      <Row className="total-price-row-sec">
                        <Col sm={12} md={12} lg={15} className="price-sec">
                          <div className="share-price-label">Unit Price: </div>
                        </Col>
                        <Col sm={12} md={12} lg={9} className="price-sec">
                          {this.state.offerData && this.state.offerData.pricePerUnit ? <div className="total-price-div"> <span className="multile-dolor">$  </span><span className="share-price-text">{this.state.offerData.pricePerUnit}</span></div> : <div className="total-price-div">Price per Unit : $0</div>}
                        </Col>
                      </Row>

                    }
                     {this.state.offerData && this.state.offerData.minimumShares ?<p className="subscription-amount">{this.state.offerData.minimumShares.key}{this.state.offerData.minimumShares.value} </p> : null }
                          
                    <p className="subscription-amount">Subscription Amount:  <br /><label> ${this.state.transactionVolume.toLocaleString('USD')}</label></p>

                    <div className="shares-next-button">
                      <Button type="primary" disabled={this.state.user && this.state.user.verifyStatus == 2 ? false : true} onClick={() => {
                        this.handleSubmit()
                      }}>NEXT</Button>
                      { /*this.state.user && this.state.user.verifyStatus == 2 ? null : <p onClick={() => {
                        this.props.history.push('/profile')
                      }}>Complete Your Profile</p> */}
                    </div>   

                  </Form>
                </div>
              </Col> : null }
              {this.state.user && this.state.user.verifyStatus == 1 ? 
                <Col sm={24} md={9} lg={4} className="price-col">
                <div className="shares-form top-shelf-note">                 
                <div>
                    TopShelf team will get back to you with verification steps
                    </div>
                </div>
              </Col>: null
              }

            </Row>
            {/* {this.state.offerData && this.state.offerData.companyDetails && this.state.offerData.companyDetails.financials && this.state.offerData.companyDetails.financials.orginalUrl ?
            
            <div className="members-financial">
              <h2 className="financial-h">Financials</h2>
              <hr></hr>
              <img src={this.state.offerData.companyDetails.financials.orginalUrl} />
            </div>
              : null} 
            {this.state.offerData && this.state.offerData.companyDetails && this.state.offerData.companyDetails.people && this.state.offerData.companyDetails.people.orginalUrl?
            <div className="members-financial">
              <h2 className="financial-h">People</h2>
              <hr></hr>
              <img src={this.state.offerData.companyDetails.people.orginalUrl} />
            </div>
              : null}  */}
            {/* <Row gutter={[16, 16]} className="deal-lineitem">
              <Col sm={24} md={13} lg={17} className="company-details-section">
                <div >
                  <h2 className="company-details-section-h">Announcing $70M Series D for NEA & Spark Capital-backed SaaS for Residence Management w/$51M Run Rate</h2>
                  <p>Gaingels is pleased to announce a new investment opportunity in a series D for a ProTech backed by NEA(Robinhood, Uber, Groupon), ACME (Airbnb, DraftKings),
                    Greystar (International real estate developer/manager, $32B AUM), Adam Neumann (WeWork Co-Founder), and Spark Capital (Twitter, Slack, Coinbase).
                    Gaingels is pleased to announce a new investment opportunity in a series D for a ProTech backed by NEA(Robinhood, Uber, Groupon), ACME (Airbnb, DraftKings),
                    Greystar (International real estate developer/manager, $32B AUM), Adam Neumann (WeWork Co-Founder), and Spark Capital (Twitter, Slack, Coinbase)
                    Gaingels is pleased to announce a new investment opportunity in a series D for a ProTech backed by NEA(Robinhood, Uber, Groupon), ACME (Airbnb, DraftKings),
                    Greystar (International real estate developer/manager, $32B AUM), Adam Neumann (WeWork Co-Founder), and Spark Capital (Twitter, Slack, Coinbase)
                  </p>
                  <h4 className="company-details-section-sub-h">Quote from Co-Founder and CEO</h4>
                  <p>
                    "The Company leads the market as the first resident-first, tech-enabled management partner to owners. We sell software and services to owners and
                    residents. Our AOS operating system reduce costs for the property manager and owner while presenting a powerful consumer proposition.
                    The Company leads the market as the first resident-first, tech-enabled management partner to owners. We sell software and services to owners and
                    residents. Our AOS operating system reduce costs for the property manager and owner while presenting a powerful consumer proposition."
                  </p>
                </div>
              </Col>
            </Row> */}
          </section>
          <section className="company-detals-rich-sec">
            {console.log(this.state.overView)}
            {this.state.overView ?
             <Col sm={24} md={13} lg={17} className="company-details-section">
         
              <Editor placeholder={Strings.overviewPlaceholder}
                toolbarHidden={true}
                editorState={this.state.overView}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
              />
              </Col>
              : null}
          </section>
        </div>
      </div>
       <Footer history={this.props.history} />
      </div>
    );
  }
}

export default connect(null, { getUserDataLean, addNewMailJoining })(DealInvestmentOpportunity);
