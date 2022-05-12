import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Space, notification, Table, Empty, Button, Image, Input } from "antd";

// relative imports
import { getUsers, getUserData, updateProfile, getFilterUsers } from '../../Redux/Crud';
import { Strings } from '../../Constants/Strings';
import { AppHeader } from '../../Components';
import { CheckOutlined, CloseCircleOutlined } from '@ant-design/icons';
import './AdminInvestors.css';

class AdminInvestors extends Component {

    constructor(props) {
        super(props)

        this.state = {
            allInvestors: [],
            totalCount: 0,
            searchValue: "",
            skip: 0,
            limit: Strings.noOfItemsPerPage,
            current: 1,
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.gettingInvestorsForBinding(this.state.skip, this.state.limit);
        this.getUserDetails();
    }

    //getting user data
    getUserDetails() {
        if (localStorage.getItem('userData')) {
            let user = JSON.parse(localStorage.getItem('userData'));
            this.props.getUserData(user.id)
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

    // get investor data
    gettingInvestorsForBinding(skip, limit) {
        this.props.getFilterUsers({ skip: skip, limit: limit, "searchValue": this.state.searchValue });
    }

    //showing notification message
    showingMessage(type, message, title) {
        notification[type]({
            description: message,
        });
    }

    //on changing page  
    handleTableChange = (pagination) => {
        this.setState({
            current: pagination.current,
            skip: (pagination.current * pagination.pageSize) - pagination.pageSize,
            limit: pagination.pageSize
        });
        
        this.gettingInvestorsForBinding(
            (pagination.current * pagination.pageSize) - pagination.pageSize,
            pagination.pageSize,
        );
    }

    // verify user event
    verifyUser(record, value) {
        this.props.updateProfile({ userId: record.id, data: { isVerified: value } }).then(res => {
            this.gettingInvestorsForBinding(this.state.skip, this.state.limit);
        })
    }

     // search on change event
     searchItem(val) {
        if (val && val.length >= 3) {
            this.setState({
                skip: 0,
                expressInterstStatus: 0,
                searchValue: val,
                current: 1
            }, () => {
                this.gettingInvestorsForBinding(0, this.state.limit);
            });
        } else {
            this.setState({
                skip: 0,
                expressInterstStatus: 0,
                searchValue: "",
                current: 1
            }, () => {
                this.gettingInvestorsForBinding(0, this.state.limit);
            });
        }
    }

    render() {
        const { investors, totalCount } = this.props;
        this.state.allInvestors = investors;
        this.state.totalCount = totalCount;
        
        const { Search } = Input;
        const columns = [
            {
                title: 'S.no',
                key: 'id',
                render: (text, record, index) => {
                    return <span className="table-data-navigation" onClick={() => { this.props.history.push('/admin-investor-portfolio', { userData: record }) }}>
                        {this.state.skip + (index+1)}
                    </span>
                }
            },
            {
                title: 'Name',
                key: 'id',
                render: (text, record) => {
                    return <span className="table-data-navigation" onClick={() => { this.props.history.push('/admin-investor-portfolio', { userData: record }) }}>
                         {(record.firstName + " " + (record.middleName ? record.middleName + " " : "") + record.lastName)}
                    </span>
                }
            },
            // {
            //     title: 'Middle Name',
            //     key: 'id',
            //     width: '30%',
            //     render: (text, record) => {
            //         return <span className="table-data-navigation" onClick={() => { this.props.history.push('/admin-investor-portfolio', { userData: record }) }}>
            //             {record.middleName}
            //         </span>
            //     }
            // },
            // {
            //     title: 'Last Name',
            //     key: 'id',
            //     width: '30%',
            //     render: (text, record) => {
            //         return <span className="table-data-navigation" onClick={() => { this.props.history.push('/admin-investor-portfolio', { userData: record }) }}>
            //             {record.lastName}
            //         </span>
            //     }
            // },
            {
                title: 'Phone Number',
                key: 'id',
                render: (text, record) => {
                    return <span className="table-data-navigation" onClick={() => { this.props.history.push('/admin-investor-portfolio', { userData: record }) }}>
                        {record.countryCode} {record.phoneNumber}
                    </span>
                }
            },
            {
                title: 'Email',
                key: 'id',
                render: (text, record) => {
                    return <span className="table-data-navigation" onClick={() => { this.props.history.push('/admin-investor-portfolio', { userData: record }) }}>
                        {record.email}
                    </span>
                }
            },
            {
                title: 'User Type',
                key: 'id',
                render: (text, record) => {
                    return <span className="table-data-navigation" onClick={() => { this.props.history.push('/admin-investor-portfolio', { userData: record }) }}>
                        {record.userType == 1 ? "Admin" : "Investor" }
                    </span>
                }
            },
            {
                title: 'Verified Status',
                key: 'id',
                render: (text, record) => {
                    if(record.verifyStatus == 2){
                        return <CheckOutlined />
                     }else {
                         return <CloseCircleOutlined />
                     }
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
            <div className="admin-invester-main">
                <div key={this.state.user ? this.state.user : null}>
                    <AppHeader history={this.props.history} user={this.state.user} />
                </div>
                <div className="container">
                    <div className="search-filter-container">
                        <h1 className="page-main-heading">Investor List</h1>
                        <div className="search-filter">
                            <Space direction="vertical">
                                <Search placeholder="Search(Min 3 chars)...." enterButton onChange={(e) => this.searchItem(e.target.value)} allowClear />
                            </Space>
                        </div>
                    </div>
                    <div>
                        <Table locale={this.state.allInvestors.length == 0 ? locale : null} key={(record) => { return record.id }} columns={columns} dataSource={this.state.allInvestors} rowKey={(record) => { return record.id }}
                            onChange={this.handleTableChange}
                            pagination={{
                                current: this.state.current,
                                pageSize: Strings.noOfItemsPerPage,
                                total: this.state.totalCount,
                                showSizeChanger: false,
                            }} />
                    </div>
                </div>
            </div>
        )
    }
}

//in this state we have all data which disptched functions called & mapping to props
const mapStateToProps = state => {
    return {
        investors: state.investors.allData,
        totalCount: state.investors.totalCount,
    }
};

export default connect(mapStateToProps, { getUsers, getUserData, updateProfile, getFilterUsers })(AdminInvestors)
