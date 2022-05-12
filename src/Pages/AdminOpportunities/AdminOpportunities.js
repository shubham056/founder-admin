import React, { Component } from 'react'
import { connect } from 'react-redux'

// relative imports
import { Input, Tooltip, Form, Row, Col, Dropdown, Menu, Button, DatePicker, Space, Select, Table, Empty, Image } from 'antd';
import { AppHeader } from '../../Components';
import { getUserData, getOpportunities } from '../../Redux/Crud';
import { Strings } from '../../Constants/Strings';
import headerProfile from '../../assets/images/headerProfile.png';
import userImage from '../../assets/images/userImage.png';
import './AdminOpportunities.css';
import { CheckOutlined, CloseCircleOutlined } from '@ant-design/icons';
const { Search } = Input;

class AdminOpportunities extends Component {
    constructor(props) {
        super(props)

        this.state = {
            user: null,
            allOpportunities: [],
            totalCount: 0,
            searchValue: "",

            skip: 0,
            limit: Strings.noOfOrdersPerPage,
            current: 1,
            companiesData: []
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.getUserDetails()
    }


    //getting user data
    getUserDetails() {
        if (localStorage.getItem('userData')) {
            let user = JSON.parse(localStorage.getItem('userData'));
            this.props.getUserData(user.id)
                .then(res => {
                    if (res.type == Strings.successType) {
                        if (res.data && res.data.userType == 2) {
                            this.props.history.push('/investor-opportunities');

                        }
                        this.setState({
                            user: res.data,
                        });
                        this.getOpportunitiesData(this.state.skip, this.state.limit);
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

    //get opportunities data
    getOpportunitiesData(skip, limit) {
        this.props.getOpportunities({
            searchValue: this.state.searchValue,
            skip: skip,
            limit: limit
        }).then(res => {
            if (res.type == Strings.successType) {
                this.state.allOpportunities = res.data.data;
                this.setState({
                    allOpportunities: this.state.allOpportunities,
                    totalCount: res.data.totalCount
                });
            }
        });
    }

    //on changing page  
    handleTableChange = (pagination) => {
        this.setState({
            current: pagination.current,
            skip: (pagination.current * pagination.pageSize) - pagination.pageSize,
            limit: pagination.pageSize
        });
        this.getOpportunitiesData(
            (pagination.current * pagination.pageSize) - pagination.pageSize,
            pagination.pageSize
        );
    }

    // search on change event
    searchItem(val) {
        if (val && val.length >= 3) {
            this.setState({
                searchValue: val,
                current: 1
            }, () => {
                this.getOpportunitiesData(0, this.state.limit);
            });
        } else {
            this.setState({
                searchValue: "",
                current: 1
            }, () => {
                this.getOpportunitiesData(0, this.state.limit);
            });
        }
    }

    //submit opportunity form
    handleOpportunity(data, type) {
        if (data && type == 'edit') {
            this.props.history.push('/add-opportunity', { user: this.state.user, opportunityData: data })
        } else if (data && type == 'view') {
            this.props.history.push('/view-opportunity', { user: this.state.user, opportunityData: data })
        } else {
            this.props.history.push('/add-opportunity', { user: this.state.user })
        }
    }

    render() {
        const columns = [
            {
                title: 'S.no',
                key: 'id',
                render: (text, record, index) => {
                    return <span className="table-data-navigation" >
                        {this.state.skip + (index + 1)}
                    </span>
                }
            },
            {
                title: 'Company', key: 'id', fixed: 'left', render: (text, record) => {
                    return record.logo ?
                        <div className="logo-company-name-table"> <Image src={record.logo.thumbnailUrl} />
                            {/* <span>{record.portfolioCompanyName}</span>  */}
                        </div> :
                        <Image src={userImage} />
                }
            },
            {
                title: 'Fund Name', dataIndex: 'fund', key: 'id',
                render: (text, record) => {
                    return record.fund
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
            {
                title: 'Active', key: 'id',
                render: (text, record) => {
                    if (record.isActive) {
                        return <CheckOutlined />
                    } else {
                        return <CloseCircleOutlined />
                    }
                }
            },
            {
                title: 'Fully Subscribed', key: 'id',
                render: (text, record) => {
                    if (record.isFullySubscribed) {
                        return <CheckOutlined />
                    } else {
                        return <CloseCircleOutlined />
                    }
                }
            },

            {
                title: 'Total shares', dataIndex: 'totalShares', key: 'id',
                render: (text, record) => {
                    return record.totalShares
                }
            },
            {
                title: 'Subscribed shares', key: 'id',
                render: (text, record) => {
                    return record.subscribedShares && record.subscribedShares ? record.subscribedShares : 0
                }
            },
            {
                title: 'Paid shares', key: 'id',
                render: (text, record) => {
                    return record.paidShares && record.paidShares ? record.paidShares : 0
                }
            },
            {
                title: 'Total Remaining shares',
                title: () => <Tooltip title="Total Shares - Paid Shares">Total Remaining shares</Tooltip>, 
                key: 'id',
                render: (text, record) => {
                    return record.totalShares - (record.paidShares ? record.paidShares : 0)

                }
            },
            {
                title: '$', dataIndex: 'availableShares', key: 'date',
                render: (text, record) => {
                    return record.pricePerShare ? record.pricePerShare : record.pricePerUnit
                }
            },
            {
                title: '', key: 'edit',
                render: (text, record) => {
                    return <span className="edit-button" onClick={() => { this.handleOpportunity(record, 'edit') }}>Edit</span>
                }
            },
            {
                title: '', key: 'view', fixed: 'right',
                render: (text, record) => {
                    return <a onClick={() => { this.handleOpportunity(record, 'view') }}>View</a>
                }
            },

        ];

        let locale = {
            emptyText: (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} >
                </Empty>
            )
        };

        return (
            <div className="admin-opportunity-main">
                <div key={this.state.user ? this.state.user : null}>
                    <AppHeader history={this.props.history} user={this.state.user} />
                </div>
                <div className="container">
                    <h1 className="page-main-heading">Opportunity List</h1>
                    <div className="search-add-opportunity">
                        <Search placeholder="Search(Min 3 chars)...." enterButton onChange={(e) => this.searchItem(e.target.value)} allowClear />
                        <Button className="" onClick={() => { this.handleOpportunity(null, null) }} className="add-opportunity-btn">Add Opportunity</Button>
                    </div>
                    <div>
                        <Table
                            locale={this.state.allOpportunities.length == 0 ? locale : null}
                            key={(record) => { return record.id }} columns={columns}
                            dataSource={this.state.allOpportunities} rowKey={(record) => { return record.id }}
                            onChange={this.handleTableChange}
                            pagination={{
                                current: this.state.current,
                                pageSize: Strings.noOfOrdersPerPage,
                                total: this.state.totalCount,
                                showSizeChanger: false,
                            }} className='' />
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(null, { getUserData, getOpportunities })(AdminOpportunities)
