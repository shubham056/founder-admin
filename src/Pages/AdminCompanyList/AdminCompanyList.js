import React, { Component } from 'react';
import { connect } from 'react-redux';

// relative imports
import { Input, Form, Row, Col, Dropdown, Menu, Button, DatePicker, Space, Select, Table, Empty, Image } from 'antd';
import { AppHeader, Loading } from '../../Components';
import { getUserData, getCompaniesWithSkipLimit, deleteCompanyData } from '../../Redux/Crud';
import { Strings } from '../../Constants/Strings';
// import headerProfile from '../../assets/images/headerProfile.png';

import userImage from '../../assets/images/userImage.png';
import './AdminCompanyList.css';

const { Search } = Input;

//admin company list component declaration 
class AdminCompanyList extends Component {
    constructor(props) {
        super(props)

        this.state = {
            user: null,
            allCompanies: [],
            totalCount: 0,
            loading: true,

            skip: 0,
            limit: Strings.noOfOrdersPerPage,
            current: 1,
            companiesData: [],
            searchKey: ""
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
                        this.setState({
                            user: res.data,
                        });
                        this.getAllCompanies(this.state.skip, this.state.limit, this.state.searchKey);
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
    getAllCompanies(skip, limit, searchKey) {
        this.props.getCompaniesWithSkipLimit({
            searchValue: searchKey,
            skip: skip,
            limit: limit
        }).then(res => {
            if (res.type == Strings.successType) {
                this.setState({
                    allCompanies: res.data.data,
                    totalCount: res.data.totalCount,
                    loading: false
                });
            } else {
                this.setState({
                    allCompanies: [],
                    totalCount: 0,
                    loading: false
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
        this.getAllCompanies(
            (pagination.current * pagination.pageSize) - pagination.pageSize,
            pagination.pageSize,
            this.state.searchKey
        );
    }

    //on clicking action
    handleCompany(company) {
        this.props.history.push('/admin-company-add-edit', { companyData: company ? company : null, user: this.state.user });
    }

    //searching
    searchItem(val) {
        if (val && val.length >= 3) {
            this.setState({ skip: 0, limit: Strings.noOfItemsPerPage, searchKey: val, current: 1 }, () => {
                this.getAllCompanies(this.state.skip, this.state.limit, this.state.searchKey);
            })
        } else if ((!val) || (val && val.length == 0)) {
            this.setState({ skip: 0, limit: Strings.noOfItemsPerPage, searchKey: '', current: 1 }, () => {
                this.getAllCompanies(this.state.skip, this.state.limit, this.state.searchKey);
            })

        }
    }
    
    render() {
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
                title: 'Company', key: 'id', fixed: 'left', render: (text, record) => {
                    return record.logo ?
                        <div className="logo-company-name-table"> <Image src={record.logo.thumbnailUrl} /><span>{record.portfolioCompanyName}</span> </div> :
                        <Image src={userImage} />
                }
            },
            {
                title: 'Created On', key: 'createdAt', render: (text, record) => {
                    if (record.createdAt) {
                        let arr = record.createdAt.split('T')[0].split('-')
                        return arr[1] + '/' + arr[2] + '/' + arr[0]
                    } else {
                        return null
                    }
                }
            },
            {
                title: 'Actions',
                key: 'edit',
                render: (text, record) => {
                    return <div><span className="edit-button" onClick={() => { this.handleCompany(record) }}>Edit</span>
                    </div>
                }
            }
        ];

        let locale = {
            emptyText: (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} >
                </Empty>
            )
        };

        return (
            <div className="company-list-main">
                {/* loading */}
                {this.state.loading ? <Loading></Loading> : null}
                <div key={this.state.user ? this.state.user : null}>
                    <AppHeader history={this.props.history} user={this.state.user} />
                </div>
                <div className="container">  
                <h1 className="page-main-heading">Company List</h1>
                <div className="search-add-opportunity">
                        <Search placeholder="Search(Min 3 chars)...." enterButton onChange={(e) => this.searchItem(e.target.value)} allowClear />
                        <Button  onClick={() => { this.handleCompany(null, null) }} className="add-opportunity-btn">Add Company</Button>
                    </div>
                    {/* table  */}
                    <div className="company-list-table">
                        <Table locale={this.state.allCompanies.length == 0 ? locale : null}
                            key={(record) => { return record.id }} columns={columns}
                            dataSource={this.state.allCompanies} rowKey={(record) => { return record.id }}
                            onChange={this.handleTableChange}
                            pagination={{
                                current: this.state.current,
                                pageSize: Strings.noOfOrdersPerPage,
                                total: this.state.totalCount,
                                showSizeChanger: false,
                            }} />
                    </div>
                </div>
            </div>

        )
    }
}

//exporting admin company list
export default connect(null, { getUserData, getCompaniesWithSkipLimit, deleteCompanyData })(AdminCompanyList)
