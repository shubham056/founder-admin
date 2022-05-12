import React, { Component } from 'react'
import { Card, Timeline, Popover, Dropdown, Menu, Progress, Collapse } from 'antd';
import moment from 'moment';
import './MyHoldingsCard.css'
import '../../Pages/MyHoldings/MyHoldings.css';
import { Strings } from '../../Constants/Strings';
import { UpOutlined, DownOutlined, CheckCircleOutlined } from '@ant-design/icons';
import greenTick from "../../assets/icons/checkcircle.svg";
import warning from "../../assets/icons/warning.svg";


const { Panel } = Collapse;
function callback(key) {
    console.log(key);
}

class MyHoldingsCard extends Component {

    constructor(props) {
        super(props)

        this.state = {
            openStatusDropDown: false,
            ProgressPercentage: 0,
            status: ""
        }
    }

    render() {
        const { data } = this.props;
        if (data.expressInterstStatus == 1) {
            this.state.ProgressPercentage = 25;
            this.state.status = "Indicated Interest";
        }
        if (data.expressInterstStatus == 2) {
            this.state.ProgressPercentage = 50;
            this.state.status = "Subscription Received";
        }
        if (data.memberSigned || data.memberReSigned) {
            this.state.ProgressPercentage = 60;
            this.state.status = "Member Signed";
        }
        if (data.partialPayment) {
            this.state.ProgressPercentage = 70;
            this.state.status = "Funded";
        }
        if (data.isPaymentCompleted) {
            this.state.ProgressPercentage = 80;
            this.state.status = "Funded";
        }
        if (data.counterReSigned || data.counterSigned) {
            this.state.ProgressPercentage = 100;
            this.state.status = "Counter Signed";
        }
        if (data.expressInterstStatus == 3){
            this.state.ProgressPercentage = 100;
            this.state.status = "Subscription Completed";
        } 
        if(data.expressInterstStatus == 5) {
            this.state.ProgressPercentage = 100;
            this.state.status = "Delivered";
        }

        const text = (
            <Timeline className="status-list" mode="right">
                <div>
                    <Timeline.Item color="green" dot={<img src={greenTick} />} className="status-list-lineitems">
                        <label>Indicated Interest</label>
                    </Timeline.Item>
                </div>
                <div>
                    {data && data.expressInterstStatus == 2 || data.expressInterstStatus >= 2 ?
                        <Timeline.Item color="green" dot={<img src={greenTick} />} className="status-list-lineitems">
                            <label>Subscription Received</label>
                        </Timeline.Item>
                        : <Timeline.Item color="gray" dot={<CheckCircleOutlined />} className="status-list-lineitems">
                            <label>Subscription Received</label>
                        </Timeline.Item>
                    }
                </div>
                {data && data.regeneratedStatus ? (
                    data && data.memberSigned ?
                        <div>
                            {data && data.memberSigned ?
                                <Timeline.Item color="green" dot={<img src={greenTick} />} className="status-list-lineitems">
                                    <label>Member Signed</label>
                                </Timeline.Item>
                                : <Timeline.Item color="gray" dot={<CheckCircleOutlined />} className="status-list-lineitems">
                                    <label>Member Signed</label>
                                </Timeline.Item>
                            }
                        </div>
                        : null)
                    :
                    <div>
                        {data && data.memberSigned ?
                            <Timeline.Item color="green" dot={<img src={greenTick} />} className="status-list-lineitems">
                                <label>Member Signed</label>
                            </Timeline.Item>
                            : <Timeline.Item color="gray" dot={<CheckCircleOutlined />} className="status-list-lineitems">
                                <label>Member Signed</label>
                            </Timeline.Item>
                        }
                    </div>
                }
                {data && data.regeneratedStatus ?
                <div>
                    <Timeline.Item color="green" dot={<img src={greenTick} />} className="status-list-lineitems">
                        <label>Re generated</label>
                    </Timeline.Item>
                </div>
                    : null}
                {data && data.regeneratedStatus ?
                    <div>
                        {data && data.memberReSigned ?
                            <Timeline.Item color="green" dot={<img src={greenTick} />} className="status-list-lineitems">
                                <label>Member Signed</label>
                            </Timeline.Item>
                            : <Timeline.Item color="gray" dot={<CheckCircleOutlined />} className="status-list-lineitems">
                                <label>Member Signed</label>
                            </Timeline.Item>
                        }
                    </div>
                    : null}
                <div>
                    {data && data.isPaymentCompleted ?
                        <Timeline.Item color="green" dot={<img src={greenTick} />} className="status-list-lineitems">
                            <label>Funded</label>
                        </Timeline.Item>
                        : (data && data.partialPayment ?
                            <Timeline.Item color="green" dot={<img src={warning} />} className="status-list-lineitems">
                                <label>Funded</label>
                            </Timeline.Item>
                            : <Timeline.Item color="gray" dot={<CheckCircleOutlined />} className="status-list-lineitems">
                                <label>Funded</label>
                            </Timeline.Item>)
                    }
                </div>
                {data && data.regeneratedStatus ?
                    <div>
                        {data && data.counterReSigned ?
                            <Timeline.Item color="green" dot={<img src={greenTick} />} className="status-list-lineitems">
                                <label>Counter Signed</label>
                            </Timeline.Item>
                            : <Timeline.Item color="gray" dot={<CheckCircleOutlined />} className="status-list-lineitems">
                                <label>Counter Signed</label>
                            </Timeline.Item>
                        }
                    </div> :
                    <div>
                        {data && data.counterSigned ?
                            <Timeline.Item color="green" dot={<img src={greenTick} />} className="status-list-lineitems">
                                <label>Counter Signed</label>
                            </Timeline.Item>
                            : <Timeline.Item color="gray" dot={<CheckCircleOutlined />} className="status-list-lineitems">
                                <label>Counter Signed</label>
                            </Timeline.Item>
                        }
                    </div>}
                <div>
                    {data && data.expressInterstStatus >= 3 ?
                        <Timeline.Item color="green" dot={<img src={greenTick} />} className="status-list-lineitems">
                            <label>Subscription Completed</label>
                        </Timeline.Item>
                        : <Timeline.Item color="gray" dot={<CheckCircleOutlined />} className="status-list-lineitems">
                            <label>Subscription Completed</label>
                        </Timeline.Item>
                    }
                </div>
                <div className="last-time-line">
                    {data && data.expressInterstStatus == 5 ?
                        <Timeline.Item color="green" dot={<img src={greenTick} />} className="status-list-lineitems">
                            <label>Delivered</label>
                        </Timeline.Item>
                        : <Timeline.Item color="gray" dot={<CheckCircleOutlined />} className="status-list-lineitems">
                            <label>Delivered</label>
                        </Timeline.Item>
                    }
                </div>

            </Timeline>
        );
        return (
            <div key={data.id} className="my-holdings">
                <Card>
                    <div className="progress-section">
                        <Progress percent={this.state.ProgressPercentage} size="small" />
                        <label className="progress-label">{this.state.status}</label>
                    </div>

                    <div className="img-section">
                        <img alt="example" onClick={() => { this.props.history.push('/holding-details', { data: data }) }} src={data.opportunityDetails.logo
                            ? data.opportunityDetails.logo.orginalUrl : ''} className="company-logo-img"  />
                    </div>

                    <div className="holding-card-content" onClick={() => { this.props.history.push('/holding-details', { data: data }) }} >
                        <div className="card-left-content">
                            <label>Shares Units :</label>
                            {data.opportunityDetails && data.opportunityDetails.pricePerShare ? 
                            <label>Price Per Share :</label>:
                            <label>Price Per Unit :</label>}
                            <label>Invested On :</label>
                            <label className="card-right-content-highlight">Total Value :</label>
                            {/* <label>Fund Name :</label> */}
                        </div>
                        <div className="card-right-content">
                            <label>{data.numberOfShares}</label>
                            {data.opportunityDetails && data.opportunityDetails.pricePerShare ? 
                            <label>${data.opportunityDetails.pricePerShare}</label>:
                            <label>${data.opportunityDetails.pricePerUnit}</label>}
                            {data.paidOn ?
                            
                            <label>{moment(new Date(data.paidOn)).format('MM/DD/YYYY')}</label>
                             : 
                             <label>{moment(new Date(data.createdAt)).format('MM/DD/YYYY')}</label> }
                            <label className="card-right-content-highlight price-highlight-label">${data.transactionVolume.toLocaleString('USD')}</label>
                            {/* <label>{data.opportunityDetails.fund}</label> */}
                        </div>
                    </div>
                    <div className="status-bar">
                        <div className="status-icon-items">
                            <Collapse Key={['1']} onChange={callback}>
                                <Panel header="" key="1">
                                    <p>{text}</p>
                                </Panel>
                            </Collapse>
                        </div>

                    </div>
                    {/* <div className="status-bar">
                        {Strings.ExpressInterstStatusTypes.map((item, ind) => {
                            return data.expressInterstStatus == item.id ?
                                <div className="status-icon-items">
                                    <label> {item.status} </label>
                                    <label>
                                        <Dropdown className="status-dropdown" overlay={menu} placement="bottomRight" onVisibleChange={(val) => {
                                            this.setState({ openStatusDropDown: val });
                                        }}>
                                            {this.state.openStatusDropDown ?

                                                <UpOutlined onClick={() => { this.setState({ openStatusDropDown: true, statusDropDownData: data }) }} />
                                                :

                                                <DownOutlined onClick={(e) => { e.preventDefault() }} />
                                            }

                                        </Dropdown>



                                    </label>
                                </div>
                                : null
                        })}
                    </div> */}
                </Card>
            </div >
        )
    }
}

export default (MyHoldingsCard);
