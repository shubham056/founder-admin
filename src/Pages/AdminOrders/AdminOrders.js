import React, { Component } from 'react'
import { Input, Space, Popover, Table, Image, Select, notification, Button, Dropdown, Menu } from 'antd';
import { AudioOutlined } from '@ant-design/icons';

import filter from '../../assets/images/filter.png';
import { AppHeader, Loading } from '../../Components';
import { getUserData, getAllOrders, addNewNotification, generateCsvFormatData } from '../../Redux/Crud';
import { connect } from 'react-redux';
import { Strings } from '../../Constants/Strings';
import * as _ from 'lodash';
import '../../App.css';
import './AdminOrders.css';
const { Option } = Select;

export class AdminOrders extends Component {

    constructor(props) {
        super(props)
        this.state = {
            status: null,
            user: null,
            orders: [],
            totalCount: 0,
            current: 1,
            selectedRows: [],
            finalSelectedRows: {},
            finalSelectedRowKeys: {},
            selectedAction: null,
            loading: false,
            skip: 0,
            limit: Strings.noOfOrdersPerPage,
            expressInterstStatus: 0,
            searchValue: "",
            selectedRowKeys: []
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

    // ffilter select event
    filter() {
        this.setState({
            skip: 0,
            searchValue: "",
            current: 1,
            selectedRows: [],
            finalSelectedRows: {},
            selectedRowKeys: [],
            finalSelectedRowKeys: {}
        }, () => {
            this.handleTableChange();
        });
    }

    // search on change event
    searchItem(val) {
        if (val && val.length >= 3) {
            this.setState({
                skip: 0,
                expressInterstStatus: 0,
                searchValue: val,
                current: 1,
                selectedRows: [],
                finalSelectedRows: {},
                selectedRowKeys: [],
                finalSelectedRowKeys: {}
            }, () => {
                this.handleTableChange();
            });
        } else {
            this.setState({
                skip: 0,
                expressInterstStatus: 0,
                searchValue: "",
                current: 1
            }, () => {
                this.handleTableChange();
            });
        }
    }

    // table pagination chage event
    handleTableChange = (pagination) => {
        let skip = this.state.skip,
            limit = this.state.limit;
        if (pagination) {
            console.log(this.state.finalSelectedRows, pagination.current, this.state.finalSelectedRows[pagination.current])
            this.state.selectedRowKeys = this.state.finalSelectedRowKeys[pagination.current]
            this.state.selectedRows = this.state.finalSelectedRows[pagination.current];
            this.setState({
                selectedRows: this.state.selectedRows,
                selectedRowKeys: this.state.selectedRowKeys,
                current: pagination.current,
                skip: (pagination.current * pagination.pageSize) - pagination.pageSize,
                limit: pagination.pageSize
            });
            skip = (pagination.current * pagination.pageSize) - pagination.pageSize;
            limit = pagination.pageSize;
        }
        this.props.getAllOrders({
            "expressInterstStatus": this.state.expressInterstStatus,
            "searchValue": this.state.searchValue,
            "skip": skip,
            "limit": limit
        });
    }

    //showing notification message
    showingMessage(type, message) {
        notification[type]({
            description: message,
        });
    }

    //navigation to admin order details
    navigateToDetails(data) {
        this.props.history.push('/admin-orders-details', { orderData: data })
    }

    // select rows in table
    selectRowsInTable(selectedRows, selectedRowKeys) {
        this.state.finalSelectedRows[this.state.current] = selectedRows;
        this.state.finalSelectedRowKeys[this.state.current] = selectedRowKeys;
        this.setState({ selectedRows: selectedRows, selectedRowKeys: selectedRowKeys })
    }

    // generate csv
    generateCSV() {
        // this.downloadXML()

        console.log(this.state.finalSelectedRowKeys)
        if (Object.keys(this.state.finalSelectedRowKeys).length > 0) {
            this.setState({ loading: true });
            let ordersList = _.flatten(Object.values(this.state.finalSelectedRowKeys));
            console.log(ordersList)
            this.props.generateCsvFormatData({
                expressInterestIds: ordersList
            }).then((res) => {
                if (res.type == Strings.successType) {
                    if (res.data && res.data.header && res.data.records) {
                        var csvData = this.generateXML(res.data.header, res.data.records);
                        console.log(csvData)
                        var a = document.createElement("a");
                        a.setAttribute('style', 'display:none;');
                        document.body.appendChild(a);
                        var blob = new Blob([csvData], { type: 'text/csv' });
                        var url = window.URL.createObjectURL(blob);
                        a.href = url;
                        a.download = 'SampleExport.csv';
                        a.click();
                        this.setState({
                            selectedRows: [],
                            selectedRowKeys: [],
                            finalSelectedRows: {},
                            finalSelectedRowKeys: {},
                            loading: false
                        })
                    } else {
                        this.setState({ loading: false });
                    }
                } else {
                    this.setState({ loading: false });
                }

            })

        } else {
            this.showingMessage('error', "Please Select Orders");
        }
    }

    generateXML(JsonFields, JsonArray) {
        var csvStr = JsonFields.join(",") + "\n";

        JsonArray.forEach(element => {
            let str = "";
            Object.values(element).map((key, index) => {
                if (index == (Object.values(element).length - 1)) {
                    str += key + "\n";

                } else {
                    str += key + ","
                }
            })
            csvStr += str;
        })
        return csvStr;
    }


    render() {

        const { orders, loading, totalCount } = this.props;

        // const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(selectedRowKeys)
                this.selectRowsInTable(selectedRows, selectedRowKeys);
                // this.setState({ selectedRows: selectedRows });
            }
        };

        const dataRows = orders;
        const columns = [
            {
                title: 'Company', fixed: 'left', key: 'id', render: (text, record) => {
                    if (record.opportunityDetails && record.opportunityDetails.logo && record.opportunityDetails.logo.thumbnailUrl) {
                        return <div className="logo-company-name-table"><Image src={record.opportunityDetails.logo.thumbnailUrl} /><span onClick={() => { this.navigateToDetails(record) }}>{record.opportunityDetails && record.opportunityDetails.fund ?
                            record.opportunityDetails.fund
                            :
                            record.opportunityDetails.portfolioCompanyName
                        }</span> </div>
                    } else {
                        return null
                    }
                }
            },
            {
                title: 'Name', key: 'id', render: (text, record) => {
                    if (record.investorDetails && record.investorDetails.firstName) {
                        return record.investorDetails.firstName + " " + record.investorDetails.lastName
                    } else {
                        return null
                    }
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
                title: 'Country', key: 'id', render: (text, record) => {
                    if (record.investorDetails && record.investorDetails.primaryAddress && record.investorDetails.primaryAddress.country) {
                        return record.investorDetails.primaryAddress.country
                    } else {
                        return null
                    }
                }
            },
            {
                title: 'Date', key: 'id', render: (text, record) => {
                    if (record.createdAt) {
                        let arr = record.createdAt.split('T')[0].split('-')
                        return arr[1] + '/' + arr[2] + '/' + arr[0]
                    } else {
                        return null
                    }
                }
            },
            { title: 'No.Of shares', dataIndex: 'numberOfShares', key: 'id' },
            { title: 'Amount', dataIndex: 'transactionVolume', key: 'id' },
            {
                title: 'Status', key: 'status', fixed: 'right', render: (text, record) => {
                    let index = _.findIndex(Strings.ExpressInterstStatusTypes, { id: record.expressInterstStatus })
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
            },
        ];
        const content = (
            <div className="pop-over-sec" key={Strings.ExpressInterstStatusTypes}>
                {Strings.ExpressInterstStatusTypes.map(x => {
                    return <p onClick={() => { this.setState({ status: x.id }); this.filter() }}>{x.status}</p>
                })}
            </div>
        );
        const menu = (
            <Menu>
                {Strings.ExpressInterstStatusTypes.map(x => {
                    return <Menu.Item onClick={() => { this.setState({ expressInterstStatus: x.id }); this.filter() }}>
                        {x.status}
                    </Menu.Item>
                })}
            </Menu>
        );
        const { Search } = Input;

        const suffix = (
            <AudioOutlined
                style={{
                    fontSize: 16,
                    color: '#1890ff',
                }}
            />
        );
        return (
            <div className="admin-orders-main">
                {this.state.loading ? <Loading></Loading> : null}
                <div key={this.state.user ? this.state.user : null}>
                    <AppHeader history={this.props.history} user={this.state.user} />
                </div>
                <div className="container">
                    <div className="search-filter-container">
                        <div className="orders-title">
                            <h2 >Orders</h2>
                        </div>
                        <div className="search-filter">
                        <div >
                            <Button className="add-opportunity-btn"  onClick={() => { this.generateCSV() }}>
                            Download CSV
                            </Button>
                        </div>
                        
                            <Space direction="vertical">
                                <Search placeholder="Search(Min 3 chars)...." enterButton onChange={(e) => this.searchItem(e.target.value)} allowClear />
                            </Space>
                            <Dropdown overlay={menu} placement="bottomLeft">
                                <img src={filter} className="filter-image" />
                            </Dropdown>

                        </div>
                    </div>
                    <div>
                        <Table
                            key={(record) => { return record.id }}
                            rowKey={(record) => { return record.id }}
                            rowSelection={rowSelection}
                            columns={columns}
                            dataSource={dataRows} onChange={this.handleTableChange}
                            pagination={{
                                current: this.state.current,
                                pageSize: Strings.noOfOrdersPerPage,
                                total: totalCount,
                                showSizeChanger: false
                            }}
                        />

                    </div>
                </div>
            </div>
        )
    }
}
const mapStateToProps = state => ({ orders: state.orders.allData ? state.orders.allData : [], loading: state.orders.loading, totalCount: state.orders.totalCount });

export default connect(mapStateToProps, { getUserData, getAllOrders, addNewNotification, generateCsvFormatData })(AdminOrders);
