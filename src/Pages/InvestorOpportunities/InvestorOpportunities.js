import React, { Component } from 'react';
import { Card, Slider, Button, Row, Col, notification, Breadcrumb, Input, Space, Select } from 'antd';

import cardImage from '../../assets/images/cardImage.png';
import cardImageTwo from '../../assets/images/cardImageTwo.png';
import { AppHeader, Loading, Footer } from '../../Components';
import '../../App.css';
import './InvesterOpportunities.css';
import { connect } from 'react-redux';
import { getOpportunities, getUserDataLean, getActiveOpportunitiesLean } from '../../Redux/Crud';
import { Strings } from '../../Constants/Strings';
import InfiniteScroll from 'react-infinite-scroller';
import { AudioOutlined, ArrowRightOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Search } = Input;

const { Meta } = Card;
const { Option } = Select;

function handleChange(value) {
    console.log(`selected ${value}`);
}
const suffix = (
    <AudioOutlined
        style={{
            fontSize: 16,
            color: '#1890ff',
        }}
    />
);
class InvesterOpportunities extends Component {
    constructor(props) {
        super(props)

        this.state = {
            disabled: false,
            allOpportunities: [],
            totalCount: 0,
            hasMore: true,
            user: null
        }
        this.loadDatas = this.loadData.bind(this)
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        // window.FreshworksWidget('show')
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
                        if (res.data && res.data.isVerified) {
                            this.loadData(0);
                        } else {
                            this.props.history.push('/profile');
                            this.showingMessage(Strings.errorType, Strings.profileNotVerificationError, Strings.profileTitle)
                        }
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

    //selecting shares
    handleSliderChange(e, ind) {
        let opportunities = JSON.parse(JSON.stringify(this.state.allOpportunities));
        opportunities[ind]['selectedShares'] = e;
        this.setState({
            allOpportunities: opportunities
        })
    }

    //shares buying
    handleNavigation(item) {
        if (item && item.selectedShares && item.selectedShares > 0) {
            this.props.history.push('/investor-individual', { shareData: item })
        } else {
            this.showingMessage(Strings.errorType, Strings.notSelectedSharesError, Strings.opportunityTitle)
        }
    }

    //showing notification message
    showingMessage(type, message, title) {
        notification[type]({
            description: message,
        });
    }

    //get opportunities on scroll
    loadData = (page) => {
        let limit = Strings.noOfOffersPerPage;
        let skip = page * limit;
        this.props.getActiveOpportunitiesLean({
            searchValue: "",
            skip: skip,
            limit: limit
        }).then(res => {
            if (res.type == Strings.successType) {
                this.state.allOpportunities = this.state.allOpportunities.concat(res.data.data);
                if (page > (res.data.totalCount / limit)) {
                    this.state.hasMore = false;
                } else {
                    this.state.hasMore = true;
                }
                this.state.allOpportunities.map(item => {
                    item.selectedShares = 100;
                    return item;
                })
                this.setState({
                    allOpportunities: this.state.allOpportunities,
                    totalCount: res.data.totalCount,
                    hasMore: this.state.hasMore
                });
            }
        });
    }

    render() {
        return (
            <div className="invester-opp-main">
                <div key={this.state.user ? this.state.user : null}>
                    <AppHeader history={this.props.history} user={this.state.user} />
                </div>

                <div className="container-invester  ani-top-to-bottom">
                    {/* <Breadcrumb separator="">
                        <Breadcrumb.Item>Opportunities{`>`}</Breadcrumb.Item>
                    </Breadcrumb> */}
                    <h1 className="login-register-title-h investor-opportunity-title-h">Hello <span className="">{this.state.user ? (this.state.user.firstName + " " + this.state.user.lastName) : null}</span><br />Make The Right Investment</h1>
                    <h1 className="holding-details-section-card-h opportunity-h"  >Opportunities</h1>
                    <div className="filters-section">
                        {/* <Space>
                            <Search placeholder="Search" allowClear  style={{ width: 250 }} />

                        </Space> */}
                        {/* <Select style={{ width: 250 }} defaultValue="Industry"  onChange={handleChange}>
                            <Option value="ind">Industry</Option>
                        </Select> */}
                    </div>
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={this.loadDatas}
                        hasMore={this.state.hasMore}
                        loader={<div key={0}></div>}
                    >

                        <Row className="investor-row" gutter={32}>
                        {this.state.allOpportunities.length > 0 ?
                        <>
                            {this.state.allOpportunities.map((item, ind) => {
                                return <Col sm={20} md={12} lg={8} key={ind}>
                                    <Card
                                        className="investor-opp-card">
                                        <div className="investor-opp-card-title" >
                                            <div className="hover-section" onClick={() => { this.props.history.push('/deal-investment', { data: item }) }}>
                                                <ArrowRightOutlined />
                                            </div>
                                            <div className="img-section">
                                                <Meta
                                                    avatar={item.logo && item.logo.orginalUrl ? <img src={item.logo.orginalUrl} />
                                                        : <img src={cardImage} />}
                                                    onClick={() => { this.props.history.push('/deal-investment', { data: item }) }}
                                                />
                                            </div>
                                            <div className="holding-card-content opportunity-card-content">
                                                <h4 className="company-name">{item.portfolioCompanyName} <span className="opportunity-category"> {item.companyDetails.category ? ' | '+ item.companyDetails.category: null}</span> {item.companyDetails.founded ? ' | '+ moment(new Date(item.companyDetails.founded)).format('YYYY'): null}</h4>
                                                {/* <div className="price-section">
                                                    <label>Sector : </label>
                                                    <label className="social-network-label">Social Network</label>
                                                </div>
                                                <div className="security-section">
                                                    <label>Deal Implied Valuation : </label>
                                                    <label>${item.dealImpliedValuation}</label>
                                                </div>
                                                <div className="security-section" >
                                                    <label>Last Round Est. Valuation : </label>
                                                    <label>${item.lastRoundValuation}</label>
                                                </div> */}
                                                {item && item.primaryDetails && item.primaryDetails.length > 0 ?
                                                    item.primaryDetails.map((item) => {
                                                        return (
                                                            <div className="security-section">
                                                                <label>{item.key} </label>
                                                                <label>{item.value}</label>
                                                            </div>

                                                        )
                                                    })
                                                    : null}
                                                <div className="invest-button-sec">
                                                    <Button type="primary" onClick={() => { this.props.history.push('/deal-investment', { data: item }) }}>
                                                        
                                                        {this.state.user && this.state.user.verifyStatus == 2 ? 'Learn more': 'Learn more' }
                                                        </Button>
                                                </div>
                                            </div>
                                            {item.isFullySubscribed ? <div className='fully-subscribed'>Fully Subscribed</div> : null}
                                        </div>
                                       
                                    </Card>
                                </Col>
                            })}</>
                             : 
                            <h4 className="no-holdings">
                            Please wait while we retrieve Active opportunities.
                        </h4>
                            }
                        </Row>
                    </InfiniteScroll>
                </div>
                <Footer history={this.props.history} />
            </div>

        )
    }
}

//Exporting login page
export default connect(null, { getOpportunities, getUserDataLean, getActiveOpportunitiesLean })(InvesterOpportunities);
