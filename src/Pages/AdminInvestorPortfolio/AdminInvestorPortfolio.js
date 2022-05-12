import React, { Component } from 'react'

import { AppHeader, Loading } from '../../Components';
import { Input, Form, Row, Col, Dropdown, Menu, Button, DatePicker, Space, Select, Image, Table, Popover, Switch } from 'antd';
import './AdminInvestorPortfolio.css';
import moment from 'moment';
import { getUserData, getInvestorsOrders, getNotesByQuery, addNewNotes, updateProfile } from '../../Redux/Crud';
import { connect } from 'react-redux';
import { Strings } from '../../Constants/Strings';
import * as _ from 'lodash';
const { Option } = Select;

export class AdminInvestorPortfolio extends Component {
    formRef1 = React.createRef();

    constructor(props) {
        super(props)
        this.state = {
            user: null,
            loading: false,
            viewingUser: null,
            orders: [],
            totalCount: 0,
            current: 1,
            searchValue: "",
            notesList: [],
            skip: 0

        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.getUserDetails();
        this.handleTableChange();
    }

    //getting user data
    getUserDetails() {
        if (localStorage.getItem('userData')) {
            let user = JSON.parse(localStorage.getItem('userData'));
            this.props.getUserData(user.id)
                .then(res => {
                    if (res.type == Strings.successType) {
                        this.setState({
                            user: res.data,
                            viewingUser: this.props.location.state ? this.props.location.state.userData : null
                        }, () => {
                            this.getOrderNotes()

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

    // seach event
    searchItem(val) {
        if (val && val.length >= 3) {
            this.setState({
                searchValue: val,
                current: 1
            }, () => {
                this.handleTableChange();
            });
        } else {
            this.setState({
                searchValue: "",
                current: 1
            }, () => {
                this.handleTableChange();
            });
        }
    }


    // get data with filters
    handleTableChange = (pagination) => {
        let skip = 0,
            limit = Strings.noOfOrdersPerPage;
            this.setState({skip: 0})
        if (pagination) {
            this.setState({ current: pagination.current, skip: (pagination.current * pagination.pageSize) - pagination.pageSize});
            skip = (pagination.current * pagination.pageSize) - pagination.pageSize;
            limit = pagination.pageSize;
        } else {
            this.setState({ current: 1 });
        }
        this.props.getInvestorsOrders({
            searchValue: this.state.searchValue,
            "investorId": this.props.location.state.userData ? this.props.location.state.userData.id : null,
            "skip": skip,
            "limit": limit
        });
    }

    //get particular order notes
    getOrderNotes() {
        this.props.getNotesByQuery({
            "investorId": this.state.viewingUser.id,
            "withOrderId": false
        }).then((res) => {
            if (res.type == Strings.successType) {
                this.setState({ notesList: res.data });
            } else {
                this.setState({ notesList: [] })
            }
        })
    }

    // add notes
    addNotes(values) {
        this.props.addNewNotes({
            "notes": values.notes,
            "investorId": this.state.viewingUser.id,
        }).then((res) => {
            if (res.type == Strings.successType) {
                this.getOrderNotes()
                this.formRef1.current.resetFields()
            }
        })
    }

    //navigation to admin order details
    navigateToDetails(data) {
        this.props.history.push('/admin-orders-details', { orderData: data })
    }

    changeStatus = (obj) => {
        console.log(obj)
        this.setState({ loading: true });
        this.props.updateProfile({
            userId: this.state.viewingUser.id,
            data: obj
        }).then((res) => {
            if (res.type == Strings.successType) {
                
                // this.showingMessage(Strings.successType, res.message, Strings.profileTitle);
                if (res.data) {
                    this.state.viewingUser = res.data;
                }
                this.setState({
                    viewingUser: this.state.viewingUser,

                    loading: false
                })
            } else {
                
                // this.showingMessage(Strings.successType, res.message, Strings.profileTitle);
                this.setState({ loading: false });
            }
        })
    }



    render() {
        const content = (
            <div className="note-popover">
                {this.state.notesList && this.state.notesList.length > 0 ?
                    this.state.notesList.map((data, ind) => {
                        return (<div key={ind}>
                            <span className="date-section-div">{data.createdAt ? moment(new Date(data.createdAt)).format('MM/DD/YYYY') : null}</span>
                            <p className="popover-desc">{data.notes}</p>
                        </div>)
                    })
                    : null}
                <Form layout="vertical" onFinish={this.addNotes.bind(this)} ref={this.formRef1}>
                    <Form.Item
                        name="notes"
                        label="Description"
                        rules={[
                            {
                                required: true,
                                message: "Please Enter Notes"
                            }
                        ]}
                    >
                        <Input.TextArea placeholder="description"/>
                    </Form.Item>
                    <div className="popover-send">
                        <Button htmlType="submit" >Send</Button>
                    </div>
                </Form>
            </div >
        );
        const { orders, loading, totalCount } = this.props;
        const dataRows = orders;
        const columns = [
            {
                title: 'S.no',
                key: 'id',
                render: (text, record, index) => {
                    return <span className="table-data-navigation" >
                        {this.state.skip + (index+1)}
                    </span>
                }
            },
            
            {
                title: 'Logo', key: 'image', fixed: 'left', render: (text, record) => {
                    if (record.opportunityDetails && record.opportunityDetails.logo && record.opportunityDetails.logo.thumbnailUrl) {
                        return <Image src={record.opportunityDetails.logo.thumbnailUrl} />
                    } else {
                        return null
                    }
                }
            },
            {
                title: 'Name', key: 'name', render: (text, record) => {
                    return <span className="table-data-navigation" onClick={() => { this.navigateToDetails(record) }}>
                        {record.opportunityDetails && record.opportunityDetails.portfolioCompanyName ?
                            record.opportunityDetails.portfolioCompanyName
                            :
                            null
                        }
                    </span>
                }
            },
            {
                title: 'Investor Type', key: 'id', render: (text, record) => {
                    if (record.investorTypeId ) {
                        return (record.investorTypeId == 1 ? ("Individual"+ (record.investAsDetails && record.investAsDetails.jointInvestor ? " (Joint)": "" )) :
                        (record.investorTypeId == 2 ? "Entity" : (record.investorTypeId == 3 ? "IRA" : null)))
                    } else {
                        return null
                    }
                }
            },            
            {
                title: 'Date', key: 'date', render: (text, record) => {
                    if (record.createdAt) {
                        let arr = record.createdAt.split('T')[0].split('-')
                        return arr[1] + '/' + arr[2] + '/' + arr[0]
                    } else {
                        return null
                    }
                }
            },
            { title: 'No.Of shares', dataIndex: 'numberOfShares', key: 'shares' },
            { title: 'Amount', dataIndex: 'transactionVolume', key: 'transactionVolume' },
            {
                title: 'Status', key: 'status', render: (text, record) => {
                    if (record.expressInterstStatus) {
                        let index = _.findIndex(Strings.ExpressInterstStatusTypes, { id: record.expressInterstStatus })
                        if (index > -1) {
                            return Strings.ExpressInterstStatusTypes[index].status
                        } else {
                            return null
                        }
                    } else {
                        return null
                    }
                }
            }
        ];
        const { Search } = Input;
        return (
            <div className="admin-investor-portfolio">
                
                {this.state.loading ? <Loading></Loading> : null}
                <div key={this.state.user ? this.state.user : null}>
                    <AppHeader history={this.props.history} user={this.state.user} />
                </div>
                <div className="container">
                    <div className="heading-note">
                        <h1 className="page-main-heading">Investor Details</h1>
                        <Popover placement="left" content={content} title="Add Notes" trigger="click">
                            <Button>Note</Button>
                        </Popover>
                        <div key={this.state.viewingUser ? this.state.viewingUser : null}>
                             
                            {this.state.viewingUser && this.state.viewingUser.verifyStatus && this.state.viewingUser.verifyStatus == 2 ?
                                    <>
                                        <label className='verify-label'>Verify Status</label>
                                        < Switch defaultChecked onChange={(val) => { this.changeStatus( { verifyStatus: 1 }) }} />
                                    </> : <>
                                        <label className='verify-label'>Verify Status</label>
                                        < Switch onChange={(val) => { this.changeStatus({ verifyStatus: 2 }) }} />
                                    </>
                                }
                        </div>
                    </div>
                    <div className="admin-details" key={this.state.viewingUser ? this.state.viewingUser : null}>

                        <Row justify="center">
                        {this.state.viewingUser ?
                            <Col sm="24" md={10} lg={10} className="admin-investor-details">
                                <div className="security-section">
                                    <label>Name : {this.state.viewingUser.firstName} {this.state.viewingUser.middleName} {this.state.viewingUser.lastName}</label>
                                    
                                </div>
                                {/* <div className="security-section">
                                    <label>Tax Identification Number : {this.state.viewingUser.taxId}</label>
                                </div> */}
                                <div className="security-section">
                                    <label>Email : {this.state.viewingUser.email}</label>
                                </div>
                                <div className="security-section">
                                    <label>Phone Number : {this.state.viewingUser.countryCode + " " + this.state.viewingUser.phoneNumber}</label>
                                </div>
                                {this.state.viewingUser && this.state.viewingUser.taxIdentificationType ?<div className="security-section">
                                    <label>Tax Form : {this.state.viewingUser.taxIdentificationType}</label>
                                </div>: null}
                                {this.state.viewingUser && this.state.viewingUser.primaryAddress && this.state.viewingUser.primaryAddress.country ?<div className="security-section">
                                    <label>Country : {this.state.viewingUser.primaryAddress.country }</label>
                                </div>: null}
                            </Col>: null}
                        </Row>
                    </div>

                    <div>
                        <div className="search-filter">
                            <Space direction="vertical">
                                <Search placeholder="Search(Min 3 chars)...." enterButton onChange={(e) => this.searchItem(e.target.value)} allowClear />
                            </Space>
                        </div>
                        <Table

                            key={(record) => { return record.id }}
                            rowKey={(record) => { return record.id }}
                            columns={columns}
                            dataSource={dataRows} onChange={this.handleTableChange}
                            pagination={{
                                current: this.state.current,
                                pageSize: Strings.noOfOrdersPerPage,
                                total: totalCount
                            }}

                        />
                    </div>
                </div>
            </div>
        )
    }
}


const mapStateToProps = state => ({ orders: state.orders.allData ? state.orders.allData : [], loading: state.orders.loading, totalCount: state.orders.totalCount });

export default connect(mapStateToProps, { updateProfile, getUserData, getInvestorsOrders, getNotesByQuery, addNewNotes })(AdminInvestorPortfolio);

