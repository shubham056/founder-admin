import React, { Component } from 'react'
import { Row, Col, Space, Input, Form, Button, Table, Select, notification, Empty, Dropdown, Menu } from 'antd';
import { AudioOutlined } from '@ant-design/icons';

import filter from '../../assets/images/filter.png';
import {
    UserOutlined,
    PhoneOutlined,
    MailOutlined,
    LockOutlined,
} from "@ant-design/icons";
import { AppHeader, Footer } from '../../Components'

import '../../App.css';
import './ViewOpportunity.css';
import * as _ from 'lodash';
import { Strings } from '../../Constants/Strings';
import { connect } from 'react-redux';
import { getExpressIntrestDataOfAnOpportunity, getPortfolioCompanies, generateCsvFormatData } from '../../Redux/Crud';

const { Option } = Select;
const { Search } = Input;

class ViewOpportunity extends Component {

    constructor(props) {
        super(props)

        this.state = {
            user: null,
            opportunityData: null,
            skip: 0,
            limit: Strings.noOfItemsPerPage,
            allOrderedData: [],
            totalCount: 0,
            current: 1,
            loading: false,
            companyData: [],
            sectorData: [],
            companyNames: [],
            securityTypes: ["Common type", "Common Type1"],
            searchValue: "",
            expressInterstStatus: 0,
            searchValue: "",
            selectedRowKeys: [],            
            selectedRows: [],
            finalSelectedRows: {},
            finalSelectedRowKeys: {}
        }
    }

    componentDidMount() {
        this.state.user = this.props.location.state.user;
        this.props.getPortfolioCompanies().then((res) => {
            if (res.type == Strings.successType) {
                this.setState({ companyNames: res.data });
            } else {
                this.setState({ companyNames: [] });
            }
        })
        if (this.props.location.state.opportunityData) {
            this.state.opportunityData = this.props.location.state.opportunityData;
            this.handleTableChange();
            this.state.companyData = [{
                type: 'Company One',
                value: 27,
            },
            {
                type: 'Company Two',
                value: 25,
            }, {
                type: 'Company Three',
                value: 25,
            }];
            this.state.sectorData = [{
                type: 'Sector One',
                value: 25,
            },
            {
                type: 'Sector Two',
                value: 27,
            }];

        }
        this.setState({
            user: this.state.user,
            opportunityData: this.state.opportunityData
        });

    }

    //search express interests
    // searchItem(val) {
    //     if (val && val.length >= 3) {
    //         this.setState({
    //             searchValue: val,
    //             current: 1
    //         }, () => {
    //             this.getExpressIntrestDataOfAnOpportunity(this.state.opportunityData.id, 0, this.state.limit);
    //         });
    //     } else if (val.length == 0) {
    //         this.setState({
    //             searchValue: "",
    //             current: 1
    //         }, () => {
    //             this.getExpressIntrestDataOfAnOpportunity(this.state.opportunityData.id, 0, this.state.limit);
    //         });
    //     }
    // }

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
        this.props.getExpressIntrestDataOfAnOpportunity({
            "expressInterestStatus": this.state.expressInterstStatus,
            "opportunityId": this.state.opportunityData.id,
            "searchValue": this.state.searchValue,
            "skip": skip,
            "limit": limit
        }).then(res => {
            if (res.type == Strings.successType) {
                this.setState({
                    allOrderedData: res.data.data,
                    totalCount: res.data.totalCount,
                    loading: false
                })
            } else {
                this.setState({
                    allOrderedData: [],
                    totalCount: 0,
                    loading: false
                })
                this.showingMessage('error', res.message, Strings.ViewOpportunityTitle)
            }
        })

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


    //getting express intrest data of an opportunity
    getExpressIntrestDataOfAnOpportunity(id, skip, limit) {
        this.props.getExpressIntrestDataOfAnOpportunity({
            "searchValue": this.state.searchValue,
            "opportunityId": id,
            "skip": skip,
            "limit": limit
        }).then(res => {
            if (res.type == Strings.successType) {
                this.setState({
                    allOrderedData: res.data.data,
                    totalCount: res.data.totalCount,
                    loading: false
                })
            } else {
                this.setState({
                    allOrderedData: [],
                    totalCount: 0,
                    loading: false
                })
                this.showingMessage('error', res.message, Strings.ViewOpportunityTitle)
            }
        })
    }

    // //on changing page  
    // handleTableChange = (pagination) => {
    //     this.setState({
    //         current: pagination.current,
    //         skip: (pagination.current * pagination.pageSize) - pagination.pageSize,
    //         limit: pagination.pageSize
    //     });
    //     this.getExpressIntrestDataOfAnOpportunity(
    //         this.state.opportunityData.id,
    //         (pagination.current * pagination.pageSize) - pagination.pageSize,
    //         pagination.pageSize,
    //     );
    // }


    //showing notification message
    showingMessage(type, message, title) {
        notification[type]({
            description: message,
        });
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
        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(selectedRowKeys)
                this.selectRowsInTable(selectedRows, selectedRowKeys);
                // this.setState({ selectedRows: selectedRows });
            }
        };
        const menu = (
            <Menu>
                {Strings.ExpressInterstStatusTypes.map(x => {
                    return <Menu.Item onClick={() => { this.setState({ expressInterstStatus: x.id }); this.filter() }}>
                        {x.status}
                    </Menu.Item>
                })}
            </Menu>
        );
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
                width: '30%',
                render: (text, record) => {
                    return <span className="table-data-navigation" onClick={() => { this.props.history.push('/admin-investor-portfolio', { userData: record }) }}>
                       { record.investorDetails ?
                         ((record.investorDetails.firstName + " " + (record.investorDetails.middleName ? record.investorDetails.middleName + " " : "") + record.investorDetails.lastName)) : null}
                    </span>
                }
            },
           
            {
                title: 'No.Of Shares',
                key: 'id',
                width: '30%',
                render: (text, record) => {
                    return <span className="table-data-navigation" onClick={() => { 
                        // this.props.history.push('/admin-investor-portfolio', { userData: record }) 
                        }}>
                        {record.numberOfShares}
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

        let locale = {
            emptyText: (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} >
                </Empty>
            )
        };
        return (
            <div className="view-opportunity-main">
                <div key={this.state.user ? this.state.user : null}>
                    <AppHeader history={this.props.history} user={this.state.user} />
                </div>
                <div className="container">
                    <h1 className="page-main-heading">
                        View Opportunity
                    </h1>

                    {/* opportunity details */}
                    <div className="admin-details" id="admin-details">
                        <div className="card-main">
                            <div className="form-section" key={this.state.opportunityData ? this.state.opportunityData : null}>
                                <Form layout="vertical" initialValues={this.state.opportunityData} >
                                    <fieldset disabled={"disabled"}>
                                        <Row gutter={[16]}>
                                            <Col md={12} lg={12} sm={24} >
                                                <Form.Item
                                                    name="portfolioCompanyName"
                                                    label={Strings.companyNameTitle}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: Strings.companyNameInputMessage,
                                                        },
                                                    ]}
                                                >
                                                    <Input
                                                        prefix={<MailOutlined className="" />}
                                                        placeholder={Strings.companyNamePlaceholder}
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row gutter={[16]}>
                                            <Col md={12} lg={12} sm={24}>
                                                <Form.Item
                                                    name="fund"
                                                    label={Strings.fundTitle}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: Strings.fundInputMessage,
                                                        },
                                                    ]}
                                                >
                                                    <Input
                                                        prefix={<MailOutlined className="" />}
                                                        placeholder={Strings.fundPlaceholder}
                                                    />
                                                </Form.Item>
                                            </Col>

                                            <Col md={12} lg={12} sm={24} >
                                                <Form.Item
                                                    name="lastRound"
                                                    label={Strings.lastRoundTitle}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: Strings.lastRoundInputMessage,
                                                        }, {
                                                            min: 3,
                                                            message: Strings.lastRoundInputMinLengthMessage,
                                                        },
                                                        {
                                                            max: 30,
                                                            message: Strings.lastRoundInputMaxLengthMessage,
                                                        },
                                                    ]}
                                                >
                                                    <Input
                                                        prefix={<MailOutlined className="" />}
                                                        placeholder={Strings.lastRoundPlaceholder}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            {/* <Col md={12} lg={12}  sm={24}>
                                                <Form.Item
                                                    name="offerPrice"
                                                    label={Strings.offerPriceTitle}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: Strings.offerPriceInputMessage,
                                                        },
                                                        {
                                                            pattern: /(\d+(?:\.\d+)?)/,
                                                            message: Strings.onlyNumbersMessage
                                                        }
                                                    ]}
                                                >
                                                    <Input
                                                        min={0}
                                                        onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                                                        onWheel={(e) => { e.currentTarget.blur() }}
                                                        prefix={<MailOutlined className="" />}
                                                        placeholder={Strings.offerPricePlaceholder}
                                                    />
                                                </Form.Item>
                                            </Col> */}
                                            <Col md={12} lg={12} sm={24}>
                                                <Form.Item
                                                    name="lastRoundValuation"
                                                    label={Strings.lastRoundVTitle}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: Strings.lastRoundVInputMessage,
                                                        },
                                                        {
                                                            pattern: /(\d+(?:\.\d+)?)/,
                                                            message: Strings.onlyNumbersMessage
                                                        }

                                                    ]}
                                                >
                                                    <Input min={0}
                                                        onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                                                        onWheel={(e) => { e.currentTarget.blur() }}
                                                        prefix={<MailOutlined className="" />}
                                                        placeholder={Strings.lastRoundVPlaceholder}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col md={12} lg={12} sm={24}>
                                                <Form.Item
                                                    name="dealImpliedValuation"
                                                    label={Strings.dealImpliedValuationTitle}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: Strings.dealImpliedValuationInputMessage
                                                        }
                                                    ]}
                                                >
                                                    <Input
                                                        min={0}
                                                        prefix={<MailOutlined className="" />}
                                                        placeholder={Strings.dealImpliedValuationPlaceholder}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col md={12} lg={12} sm={24}>
                                                <Form.Item
                                                    name="pricePerShare"
                                                    label={Strings.pricePerShareTitle}
                                                    rules={[
                                                        {
                                                            pattern: /(\d+(?:\.\d+)?)/,
                                                            message: Strings.onlyNumbersMessage
                                                        }
                                                    ]}
                                                >
                                                    <Input
                                                        min={0}
                                                        onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                                                        onWheel={(e) => { e.currentTarget.blur() }}
                                                        prefix={<MailOutlined className="" />}
                                                        placeholder={Strings.pricePerSharePlaceholder}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col md={12} lg={12} sm={24}>
                                                <Form.Item
                                                    name="pricePerUnit"
                                                    label={Strings.pricePerUnitTitle}
                                                    rules={[
                                                        {
                                                            pattern: /(\d+(?:\.\d+)?)/,
                                                            message: Strings.onlyNumbersMessage
                                                        }
                                                    ]}
                                                >
                                                    <Input
                                                        min={0}
                                                        onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                                                        onWheel={(e) => { e.currentTarget.blur() }}
                                                        prefix={<MailOutlined className="" />}
                                                        placeholder={Strings.pricePerUnitPlaceholder}
                                                    />
                                                </Form.Item>
                                            </Col>

                                            <Col md={12} lg={12} sm={24}>
                                                <Form.Item
                                                    name='securityType'
                                                    label={Strings.securityTypeTitle}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: Strings.securityTypeInputMessage,
                                                        }
                                                    ]}
                                                >
                                                    <Select placeholder={Strings.securityTypePlaceholder} disabled={true}>
                                                        {this.state.securityTypes.map((item, index) => {
                                                            return <Option value={item} key={index}>{item}</Option>
                                                        })}
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col md={12} lg={12} sm={24}>
                                                <Form.Item
                                                    name="totalShares"
                                                    label={Strings.numberOfSharesTitle}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: Strings.numberOfSharesInputMessage,
                                                        },
                                                        {
                                                            pattern: /(\d+(?:\.\d+)?)/,
                                                            message: Strings.onlyNumbersMessage
                                                        }
                                                    ]}
                                                >
                                                    <Input
                                                        min={0}
                                                        onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                                                        onWheel={(e) => { e.currentTarget.blur() }}
                                                        prefix={<MailOutlined className="" />}
                                                        placeholder={Strings.numberOfSharesPlaceholder}
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </fieldset>
                                </Form>
                            </div>
                        </div>
                    </div>

                    {/* express intrest details of opportunity */}
                    <div className="view-table">
                        {/* <div className="search-filter">
                            <Space direction="vertical">
                        <Search placeholder="Search(Min 3 chars)...." enterButton onChange={(e) => this.searchItem(e.target.value)} allowClear />
                            </Space>
                            
                        </div> */}
                        <div className="search-filter">
                           
                            <Space direction="vertical">
                                <Search placeholder="Search(Min 3 chars)...." enterButton onChange={(e) => this.searchItem(e.target.value)} allowClear />
                            </Space>
                            <Dropdown overlay={menu} placement="bottomLeft">
                                <img src={filter} className="filter-image" />
                            </Dropdown>
                            <div >
                                <Button className="add-opportunity-btn" onClick={() => { this.generateCSV() }}>
                                    Download CSV
                                </Button>
                            </div>

                        </div>
                        <div>
                            <Table
                                key={(record) => { return record.id }}
                                rowKey={(record) => { return record.id }}
                                rowSelection={rowSelection}
                                columns={columns}
                                dataSource={this.state.allOrderedData} onChange={this.handleTableChange}
                                pagination={{
                                    current: this.state.current,
                                    pageSize: Strings.noOfOrdersPerPage,
                                    total: this.state.totalCount,
                                    showSizeChanger: false
                                }}
                            />
                        </div>
                    </div>

                </div>
                 <Footer history={this.props.history} />
            </div>
        )
    }
}

export default connect(null, { generateCsvFormatData, getExpressIntrestDataOfAnOpportunity, getPortfolioCompanies })(ViewOpportunity);
