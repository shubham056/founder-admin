import React, { Component } from 'react'
import { connect } from 'react-redux'

import { getUserDataLean, getParticularUserHoldings, getParticularUserHoldingswithStatus } from '../../Redux/Crud';
import { Strings } from '../../Constants/Strings';
import { AppHeader, MyHoldingsCard, Footer } from '../../Components';
import { Row, Col, Breadcrumb, Tabs, Steps } from 'antd';
import './MyHoldings.css';
const { TabPane } = Tabs;   


const { Step } = Steps;
class MyHoldings extends Component {

    constructor(props) {
        super(props)

        this.state = {
            user: null,
            allHoldings: [],
            currentHoldings: [],
            pendingHoldings: [],
            existHoldings: [],
            totalCount: 0,
            step: 0,
            activeInvestmentsMessage: "Please wait while we retrieve your Active Investments.",
            fundedInvestmentsMessage: "Please wait while we retrieve your Funded Investments.",
            exitedInvestmentsMessage: "Please wait while we retrieve your Exited Investments.",
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.getUserDetails();
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
                        }, () => {
                            this.getActiveInvestments();
                            // this.getUserHoldings({
                            //     "investorId": user.id
                            // });
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

    //getting user holdings
    getUserHoldings(obj) {
        this.props.getParticularUserHoldingswithStatus(obj).then(res => {
            const { allHoldings } = this.props;
            this.setState({
                allHoldings: allHoldings,
                currentHoldings: [],
                pendingHoldings: [],
                existHoldings: [],
                totalCount: 0
            }, () => {
                if (allHoldings.length > 0) {
                    allHoldings.map((data) => {
                        if (data.expressInterstStatus == 3) {
                            this.state.currentHoldings.push(data);
                            this.setState({ currentHoldings: this.state.currentHoldings });
                        } else if (data.expressInterstStatus == 5) {
                            this.state.existHoldings.push(data);
                            this.setState({ existHoldings: this.state.existHoldings });
                        } else {
                            this.state.pendingHoldings.push(data);
                            this.setState({ pendingHoldings: this.state.pendingHoldings });

                        }
                        this.setState({
                            fundedInvestmentsMessage: "Sorry, you dont have any Funded Investments.",
                            activeInvestmentsMessage: "Sorry, you dont have any Active Investments.",
                            exitedInvestmentsMessage: "Sorry, you dont have any Exited Investments."
                        })
                    })
                }
            })
        })
    }

    getActiveInvestments() {
        this.props.getParticularUserHoldingswithStatus({"investorId": this.state.user.id}).then(res => {
            console.log(res)
            if (res && res.payload && res.payload.data) {
                // pendingHoldings
                this.setState({ pendingHoldings: res.payload.data,
                    activeInvestmentsMessage: "Sorry, you dont have any Active Investments." });

            } else {
                this.setState({
                    activeInvestmentsMessage: "Sorry, you dont have any Active Investments."
                })
            }
        })
    }

    getFundedInvestments() {
        this.props.getParticularUserHoldingswithStatus({"investorId": this.state.user.id, expressInterstStatus : 3}).then(res => {
            console.log(res)
            if (res && res.payload && res.payload.data) {
                // currentHoldings
                this.setState({ currentHoldings: res.payload.data,
                    fundedInvestmentsMessage: "Sorry, you dont have any Funded Investments." });

            } else {
                this.setState({
                    fundedInvestmentsMessage: "Sorry, you dont have any Funded Investments."
                })
            }
        })
    }

    getExistedInvestments() {
        this.props.getParticularUserHoldingswithStatus({"investorId": this.state.user.id, expressInterstStatus : 5}).then(res => {
            console.log(res)
            if (res && res.payload && res.payload.data) {
                // existHoldings
                this.setState({ existHoldings: res.payload.data,
                    exitedInvestmentsMessage: "Sorry, you dont have any Exited Investments." });

            } else {
                this.setState({
                    exitedInvestmentsMessage: "Sorry, you dont have any Exited Investments."
                })
            }
        })
    }

    render() {
        return (
            // My holdings 
            <div className="my-holdings-main invester-opp-main">
                <div key={this.state.user ? this.state.user : null}>
                    <AppHeader history={this.props.history} user={this.state.user} />
                </div>
                <div className="container-invester ani-top-to-bottom">
                    {/* <Breadcrumb separator="">
                        <Breadcrumb.Item>Holdings{`>`}</Breadcrumb.Item>
                    </Breadcrumb> */}
                    <h1 className="login-register-title-h">Hello <span className="">{this.state.user ? (this.state.user.firstName + " " + this.state.user.lastName) : null}</span><br />Make The Right Investment</h1>
                    <div className="holding-details-section-card" id="steps-investor-individual">
                        <Steps size="small" type="navigation"
                            current={this.state.step}  >
                            <Step title="Active Investments" onClick={() => { this.setState({ step: 0 }); this.getActiveInvestments() }} value={0} />
                            <Step title="Funded Investments" onClick={() => { this.setState({ step: 1 }); this.getFundedInvestments() }} value={1} />
                            <Step title="Exited Investments" onClick={() => { this.setState({ step: 2 }); this.getExistedInvestments() }} value={2} />
                        </Steps>

                        {/* <h2 className="holding-details-section-card-h"></h2> */}
                        {this.state.step == 0 ?
                            <>
                                <div className='scrollable-div'>
                                <Row className="investor-row" gutter={64}>
                                    {this.state.pendingHoldings.length > 0 ?
                                        <>
                                            {this.state.pendingHoldings.map((item, ind) => {
                                                return <Col sm={20} md={12} lg={8} key={ind}  >
                                                    <MyHoldingsCard data={item} history={this.props.history} />

                                                </Col>
                                            })}
                                            {/* <Col sm={20} md={8} lg={8} onClick={() => { this.props.history.push('/investor-opportunities') }}>
                                                <div className="go-to-opportunity">
                                                    <div>
                                                        <a className="go-to-opportunity-text">Replace me with a new Opportunity from our collection.</a>
                                                    </div>
                                                </div>
                                            </Col> */}
                                        </>
                                        :
                                        <>
                                            <h4 className="no-holdings">

                                                {this.state.activeInvestmentsMessage}
                                                

                                            </h4>
                                            <Col sm={20} md={8} lg={8} onClick={() => { this.props.history.push('/investor-opportunities') }}>
                                                <div className="go-to-opportunity">
                                                    <div>
                                                        <a className="go-to-opportunity-text">Replace me with a new Opportunity from our collection.</a>
                                                    </div>
                                                </div>
                                            </Col>
                                        </>
                                    }
                                </Row>
                                </div>
                            </>
                            : null
                        }
                        {this.state.step == 1 ?
                            <>
                                {/* <h2 className="holding-details-section-card-h" >Current Holdings</h2> */}

                                <Row className="investor-row" gutter={64}>
                                    {this.state.currentHoldings.length > 0 ?
                                        <>
                                            {this.state.currentHoldings.map((item, ind) => {
                                                return <Col sm={20} md={8} lg={8} key={ind}  >
                                                    <MyHoldingsCard data={item} history={this.props.history} />

                                                </Col>
                                            })}
                                            {/* <Col sm={20} md={8} lg={8} onClick={() => { this.props.history.push('/investor-opportunities') }}>
                                                <div className="go-to-opportunity">
                                                    <div>
                                                        <a className="go-to-opportunity-text">Replace me with a new Opportunity from our collection.</a>
                                                    </div>
                                                </div>
                                            </Col> */}
                                        </>
                                        :
                                        <>
                                            {/* <div className="no-holdings-text">


                                        <p>You do not have anything to show right now. :disappointed: Have a look at our <a className="go-to-opportunity-text" onClick={() => { this.props.history.push('/investor-opportunities') }}>Opportunities</a> to Invest.</p>

                                    </div> */}
                                            <h4 className="no-holdings">

                                                {this.state.fundedInvestmentsMessage}
                                                {/* <p>You do not have anything to show right now. :disappointed: Have a look at our <a className="go-to-opportunity-text" onClick={() => { this.props.history.push('/investor-opportunities') }}>Opportunities</a> to Invest.</p> */}

                                            </h4>
                                        </>
                                    }

                                </Row>
                            </>
                            : null
                        }
                        {this.state.step == 2 ?
                            <>
                                {/* <h2 className="holding-details-section-card-h" >Past Holdings</h2> */}

                                <Row className="investor-row" gutter={64}>
                                    {this.state.existHoldings.length > 0 ?
                                        <>
                                            {this.state.existHoldings.map((item, ind) => {
                                                return <Col sm={20} md={8} lg={8} key={ind}  >
                                                    <MyHoldingsCard data={item} history={this.props.history} />

                                                </Col>
                                            })}
                                            {/* <Col sm={20} md={8} lg={8} onClick={() => { this.props.history.push('/investor-opportunities') }}>
                                                <div className="go-to-opportunity">
                                                    <div>
                                                        <a className="go-to-opportunity-text">Replace me with a new Opportunity from our collection.</a>
                                                    </div>
                                                </div>
                                            </Col> */}
                                        </>
                                        :
                                        <>
                                            {/* <div className="no-holdings-text">


                                            <p>You do not have anything to show right now. :disappointed: Have a look at our <a className="go-to-opportunity-text" onClick={() => { this.props.history.push('/investor-opportunities') }}>Opportunities</a> to Invest.</p>

                                        </div> */}
                                            <h4 className="no-holdings">

                                                {this.state.exitedInvestmentsMessage}
                                                {/* <p>You do not have anything to show right now. :disappointed: Have a look at our <a className="go-to-opportunity-text" onClick={() => { this.props.history.push('/investor-opportunities') }}>Opportunities</a> to Invest.</p> */}

                                            </h4>
                                        </>
                                    }

                                </Row>

                            </>
                            : null
                        }
                    </div>

                </div>
                 <Footer history={this.props.history} />
            </div>
        )
    }
}

const mapStateToProps = state => ({ allHoldings: state.myHoldings.allData ? state.myHoldings.allData : [], loading: state.myHoldings.loading, totalCount: state.myHoldings.totalCount });

export default connect(mapStateToProps, { getUserDataLean, getParticularUserHoldings, getParticularUserHoldingswithStatus })(MyHoldings)
