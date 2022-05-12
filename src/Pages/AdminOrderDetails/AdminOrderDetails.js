import React, { Component } from 'react';
import { Row, Col, Modal, Form, Input, Space, Popover, Table, Image, Select, notification, Button, Dropdown, Menu, DatePicker, Switch } from 'antd';
import { AppHeader, Loading } from '../../Components';
import { getUserData, addNewNotification, updateDataByExpressInterestId, addNewTransaction, getAllTransactionssByOrderId, addNewNotes, getNotesByQuery, getByExpressInterestId, getSignedUrls, getDocusignTemplatesList } from '../../Redux/Crud';
import { connect } from 'react-redux';
import { Strings } from '../../Constants/Strings';
import cardImage from "../../assets/images/cardImage.png";
import moment from 'moment';
import '../AdminOrders/AdminOrders.css'
import { FilePdfFilled, MailOutlined } from '@ant-design/icons';
import editIcon from '../../assets/images/editIcon.png';

const { Option } = Select;

export class AdminOrderDetails extends Component {
    formRef = React.createRef();
    formRef1 = React.createRef();
    formRef2 = React.createRef();
    formRef3 = React.createRef();

    constructor(props) {
        super(props)
        this.state = {
            user: null,
            loading: false,
            orderDetails: null,
            showAddFunds: false,
            transactions: [],
            templates: [],
            template: null,
            notesList: [],
            newNotes: null,
            showEditShares: false,
            visible: false,
            showTemplates: false
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.getUserDetails();
        this.setState({ orderDetails: this.props.location.state.orderData }, () => {
            if (this.props.location.state.orderData) {
                this.getParticularOrderData();
                this.getAllTransactions();
                this.getOrderNotes();
                this.getAllTemplates()
            }
        });
    }

    //get particular order data
    getParticularOrderData() {
        this.props.getByExpressInterestId(this.state.orderDetails.id).then((res) => {
            if (res.type == Strings.successType) {
                this.setState({ orderDetails: res.data })
            }
        })
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


    // deliverOrder
    deliverOrder = () => {
        this.setState({ loading: true, visible: false });
        this.props.updateDataByExpressInterestId({
            expressInterestId: this.state.orderDetails.id,
            data: { expressInterstStatus: 5 }
        }).then((res) => {
            if (res.type == Strings.successType) {
                if (res.data) {
                    this.state.orderDetails = res.data;
                }
                this.setState({
                    orderDetails: this.state.orderDetails,

                    loading: false
                })
            } else {
                this.setState({ loading: false });
            }
        })

    }

    // getSignedUrl
    getSignedUrl(val) {
        this.setState({ loading: true });
        this.props.getSignedUrls({
            key: val,
            from: "docusign"
        }).then((res) => {
            if (res.type == Strings.successType) {
                this.setState({ loading: false });
                window.open(res.data, '_blank')
            } else {
                this.setState({ loading: false });
            }
        })
    }

    //get Transactions list
    getAllTransactions() {
        this.props.getAllTransactionssByOrderId(this.state.orderDetails.id).then((res) => {
            if (res.type == Strings.successType) {
                this.setState({ transactions: res.data });
            } else {
                this.setState({ transactions: [] })
            }
        })
    }

    //get particular order notes
    getOrderNotes() {
        this.props.getNotesByQuery({
            "investorId": this.state.orderDetails.investorId,
            "orderId": this.state.orderDetails.id,
            "withOrderId": true
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
        console.log(this.state.newNotes, values)
        // if (this.state.newNotes) {
        this.props.addNewNotes({
            "notes": values.notes,
            "investorId": this.state.orderDetails.investorId,
            "orderId": this.state.orderDetails.id
        }).then((res) => {
            if (res.type == Strings.successType) {
                this.getOrderNotes()
                this.formRef1.current.resetFields()
            }
        })
        // }
    }

    // update bank funds data
    addFunds(values) {
        if (values.amount > 0) {
            this.setState({ loading: true });
            let obj = {
                transactionDate: new Date(values.date).toISOString(),
                amount: JSON.parse(values.amount),
                source: values.source,
                investorId: this.state.orderDetails.investorId,
                orderId: this.state.orderDetails.id,
            }
            let paidAmount = this.state.orderDetails.paidAmount ? (this.state.orderDetails.paidAmount + JSON.parse(values.amount)) : JSON.parse(values.amount);
            let expressObj = {
                paidAmount: paidAmount
            }
            if (paidAmount < this.state.orderDetails.transactionVolume) {
                expressObj.partialPayment = true;
            } else {
                expressObj.partialPayment = true;
                expressObj.isPaymentCompleted = true;
            }
            this.props.addNewTransaction(obj).then((res) => {
                if (res.type == Strings.successType) {
                    this.props.updateDataByExpressInterestId({
                        expressInterestId: this.state.orderDetails.id,
                        data: expressObj
                    }).then((ress) => {
                        if (ress.type == Strings.successType) {
                            this.getAllTransactions()
                            if (res.data) {
                                this.state.orderDetails.partialPayment = res.data.partialPayment;
                                this.state.orderDetails.isPaymentCompleted = res.data.isPaymentCompleted;
                                this.state.orderDetails.paidAmount = res.data.paidAmount;
                            }
                            this.formRef.current.resetFields();
                            this.setState({
                                orderDetails: this.state.orderDetails,
                                showAddFunds: false,
                                loading: false
                            })
                        }
                    }, (err => {
                        this.setState({ loading: false })
                    }))
                }
            }, (err => {
                this.setState({ loading: false })
            }))
            console.log(obj, expressObj)
        } else {
            this.showingMessage('error', "Please Enter Amount");
        }
    }

    //showing notification message
    showingMessage(type, message) {
        notification[type]({
            description: message,
        });
    }

    // cancle the add funds
    handleCancel() {
        this.formRef.current.resetFields();
        this.setState({
            showAddFunds: false
        })
    }


    // cancle the edit shares
    handleEditCancel() {
        this.formRef2.current.resetFields();
        this.setState({
            showEditShares: false
        })

    }

    // update shares data
    editShares(values) {
        if (values.shares > 0) {
            this.setState({ loading: true });
            let expressObj = {
                numberOfShares: values.shares,
                transactionVolume: JSON.parse((this.state.orderDetails && this.state.orderDetails.opportunityDetails.pricePerShare ? (this.state.orderDetails.opportunityDetails.pricePerShare * JSON.parse(values.shares)) : (this.state.orderDetails.opportunityDetails.pricePerUnit ? (this.state.orderDetails.opportunityDetails.pricePerUnit * JSON.parse(values.shares)) : 0)).toFixed(2)),
                regeneratedStatus: 1,
                envelopeId: null
            }
            this.props.updateDataByExpressInterestId({
                expressInterestId: this.state.orderDetails.id,
                data: expressObj
            }).then((res) => {
                if (res.type == Strings.successType) {
                    if (res.data) {
                        this.state.orderDetails = res.data;
                    }
                    this.formRef2.current.resetFields();
                    this.setState({
                        orderDetails: this.state.orderDetails,
                        showEditShares: false,
                        loading: false
                    })
                }
            }, (err => {
                this.setState({ loading: false })
            }))
        } else {
            this.showingMessage('error', "Please Enter No.of Shares");
        }
    }

    showModal() {
        this.setState({ visible: true })

    }

    hideModal() {
        this.setState({ visible: false })
    }

    getAllTemplates() {
        this.props.getDocusignTemplatesList().then((res) => {
            if (res.type == Strings.successType) {
                this.setState({
                    templates: res.data,
                });
                console.log(res.data)
            }
        })
    }


    handleSelectChange = (e) => {
        this.state.template = e;
        this.setState({ template: this.state.template });
    }

    changeStatus = (e, obj) => {
        console.log(e, obj)
        this.setState({ loading: true });
        this.props.updateDataByExpressInterestId({
            expressInterestId: this.state.orderDetails.id,
            data: obj
        }).then((res) => {
            if (res.type == Strings.successType) {
                if (res.data) {
                    this.state.orderDetails = res.data;
                }
                this.setState({
                    orderDetails: this.state.orderDetails,

                    loading: false
                })
            } else {
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
                        <Input.TextArea placeholder="description" />
                    </Form.Item>
                    <div className="popover-send">
                        <Button htmlType="submit" >Send</Button>
                    </div>
                </Form>
            </div >
        );
        const dateFormat = 'MM-DD-YYYY';
        const customFormat = value => `${value.format(dateFormat)}`;

        return (
            <div className="admin-orders-details-main">
                {this.state.loading ? <Loading></Loading> : null}
                <div key={this.state.user ? this.state.user : null}>
                    <AppHeader history={this.props.history} user={this.state.user} />
                </div>
                <div className="container" key={this.state.orderDetails ? this.state.orderDetails : null}>


                    <div className="logo-text-sec" >
                        <Row gutter={[16]} className="logo-name-admin">
                            <div className="logo-name-text">
                                {this.state.orderDetails && this.state.orderDetails.opportunityDetails && this.state.orderDetails.opportunityDetails.logo && this.state.orderDetails.opportunityDetails.logo.orginalUrl ? <img width="100" src={this.state.orderDetails.opportunityDetails.logo.orginalUrl} />
                                    : <img src={cardImage} />}
                                <h2 className="company-name">{this.state.orderDetails && this.state.orderDetails.opportunityDetails && this.state.orderDetails.opportunityDetails.portfolioCompanyName ? this.state.orderDetails.opportunityDetails.portfolioCompanyName : null}
                                </h2>
                            </div>

                        </Row>


                    </div>


                    <Row gutter={[16]} className="investor-details-admin">
                        <Col sm={24} md={12} lg={8}>
                            <div className="holdings-details-sub-sec" >
                                <h2 className="holding-detail-company-name">Investor Details</h2>
                                <div className="security-section">
                                    <label>Investor Type : {this.state.orderDetails && this.state.orderDetails.investorTypeId ? (this.state.orderDetails.investorTypeId == 1 ? "Individual" :
                                        (this.state.orderDetails.investorTypeId == 2 ? "Entity" : (this.state.orderDetails.investorTypeId == 3 ? "IRA" : null))
                                    ) : null}</label>
                                </div>
                                {this.state.orderDetails && this.state.orderDetails.IRAType ? <div className="security-section">
                                    <label>IRA Type : {this.state.orderDetails && this.state.orderDetails.IRAType ? this.state.orderDetails.IRAType : null}</label>
                                </div>
                                    : null}
                                <div className="security-section">
                                    <label>Full Name : {this.state.orderDetails && this.state.orderDetails.investorDetails ? (this.state.orderDetails.investorDetails.firstName + " " + (this.state.orderDetails.investorDetails.middleName ? this.state.orderDetails.investorDetails.middleName + " " : "") + this.state.orderDetails.investorDetails.lastName) : null} </label>
                                </div> 

                                <div className="security-section">
                                    <label>Email : {this.state.orderDetails && this.state.orderDetails.investorDetails ? this.state.orderDetails.investorDetails.email : null} </label>
                                </div>
                                <div className="security-section">
                                    <label> Contact Number : {this.state.orderDetails && this.state.orderDetails.investorDetails ? this.state.orderDetails.investorDetails.countryCode + " " + this.state.orderDetails.investorDetails.phoneNumber : null} </label>
                                </div>
                                {this.state.orderDetails && this.state.orderDetails.investorTypeId == 2 ? <>
                                    <h2 className="holding-detail-company-name">Entity Details</h2>
                                    <div className="security-section">
                                        <label>Entity Name : {this.state.orderDetails && this.state.orderDetails.entityDetails ? this.state.orderDetails.entityDetails.entityName : null} </label>
                                    </div>
                                    <div className="security-section">
                                        <label>Full Name : {this.state.orderDetails && this.state.orderDetails.entityDetails ? (this.state.orderDetails.entityDetails.firstName + " " + (this.state.orderDetails.entityDetails.middleName ? this.state.orderDetails.entityDetails.middleName + " " : "") + this.state.orderDetails.entityDetails.lastName) : null} </label>
                                    </div>

                                    <div className="security-section">
                                        <label>Email : {this.state.orderDetails && this.state.orderDetails.entityDetails ? this.state.orderDetails.entityDetails.email : null} </label>
                                    </div>
                                    <div className="security-section">
                                        <label>Contact Number : {this.state.orderDetails && this.state.orderDetails.entityDetails ? this.state.orderDetails.entityDetails.countryCode + " " + this.state.orderDetails.entityDetails.phoneNumber : null} </label>
                                    </div>
                                </> : null}
                                {this.state.orderDetails && this.state.orderDetails.jointInvestorDetails && this.state.orderDetails.jointInvestorDetails ?
                                    <>

                                        <h2 className="holding-detail-company-name">Joint Investor Details</h2>
                                        <div className="security-section">
                                            <label>Full Name : {this.state.orderDetails && this.state.orderDetails.jointInvestorDetails && this.state.orderDetails.jointInvestorDetails ? (this.state.orderDetails.jointInvestorDetails.firstName + " " + (this.state.orderDetails.jointInvestorDetails.middleName ? this.state.orderDetails.jointInvestorDetails.middleName + " " : "") + this.state.orderDetails.jointInvestorDetails.lastName) : null} </label>
                                        </div>

                                        <div className="security-section">
                                            <label>Email : {this.state.orderDetails && this.state.orderDetails.jointInvestorDetails && this.state.orderDetails.jointInvestorDetails ? this.state.orderDetails.jointInvestorDetails.email : null} </label>
                                        </div>
                                        <div className="security-section">
                                            <label>Contact Number : {this.state.orderDetails && this.state.orderDetails.jointInvestorDetails && this.state.orderDetails.jointInvestorDetails ? this.state.orderDetails.jointInvestorDetails.countryCode + " " + this.state.orderDetails.jointInvestorDetails.phoneNumber : null} </label>
                                        </div>
                                    </>
                                    : null}

                            </div>
                        </Col>



                        <Col sm={24} md={12} lg={6} className="break-down">
                            <div className="holdings-details-sub-sec">
                                <div className="heading-edit-icon">
                                    <h2 className="holding-detail-company-name">Breakdown</h2>

                                    <img src={editIcon} onClick={() => {
                                        this.setState({ showEditShares: true })
                                    }} className="edit-icon" />
                                </div>
                                <div className="security-section">
                                    <label>Shares Unit : {this.state.orderDetails ? this.state.orderDetails.numberOfShares : 0}</label>

                                </div>
                                {this.state.orderDetails && this.state.orderDetails.opportunityDetails && this.state.orderDetails.opportunityDetails.pricePerShare ?
                                    <div className="security-section">
                                        <label>Price Per Share : ${this.state.orderDetails && this.state.orderDetails.opportunityDetails ? this.state.orderDetails.opportunityDetails.pricePerShare : 0}</label>
                                    </div> :
                                    <div className="security-section">
                                        <label>Price Per Unit : ${this.state.orderDetails && this.state.orderDetails.opportunityDetails ? this.state.orderDetails.opportunityDetails.pricePerUnit : 0}</label>
                                    </div>}

                                <div className="security-section">
                                    <label>Total Value : ${this.state.orderDetails ? (this.state.orderDetails.transactionVolume.toLocaleString('USD')) : 0}</label>
                                </div>
                                <div className="security-section">
                                    <label>Invested On : {this.state.orderDetails ? moment(new Date(this.state.orderDetails.createdAt)).format('MM/DD/YYYY') : null}</label>

                                </div>

                            </div>
                        </Col>

                        <Col sm={24} md={12} lg={10}>
                            {this.state.orderDetails ?
                                <div className="table-child-document">
                                    <Col sm={24} md={12} lg={24}>
                                        <Row justify="center">
                                            <Col span={24} className="deliver-btn">
                                                <Button className={this.state.orderDetails.expressInterstStatus === 3 ? "button-active" : "button-deactive"} disabled={this.state.orderDetails.expressInterstStatus === 3 ? false : true} onClick={() => { this.showModal() }}>Deliver</Button>
                                            </Col>
                                        </Row>
                                        <Row justify="center">
                                            <Col span={24} className="deliver-btn">
                                                <Popover placement="bottom" content={content} title="Add Notes" trigger="click">
                                                    <Button className="note-button">Note</Button>
                                                </Popover>
                                            </Col>
                                        </Row>
                                    </Col>
                                </div>
                                : null}

                        </Col>
                        {/* </Col> */}


                    </Row>
                    <div className='user-permissions'>
                    <div className='transactions' key={this.state.orderDetails ? this.state.orderDetails : null}>
                        {this.state.orderDetails && this.state.orderDetails.expressInterstStatus && this.state.orderDetails.expressInterstStatus >= 2 ?
                            <><label>Subscription Received</label>
                                < Switch defaultChecked onChange={(val) => { this.changeStatus(val, { expressInterstStatus: 1 }) }} /></>
                            :
                            <>
                                <label>Subscription Received</label>
                                < Switch onChange={(val) => { this.changeStatus(val, { expressInterstStatus: 2 }) }} />
                            </>
                        }
                        {this.state.orderDetails && this.state.orderDetails.regeneratedStatus ? (
                                <div>
                                    {this.state.orderDetails && this.state.orderDetails.memberReSigned ?
                                        <>    <label>Member Signed</label>
                                            < Switch defaultChecked onChange={(val) => { this.changeStatus(val, { memberReSigned: 0 }) }} />
                                        </>
                                        : <>
                                            <label>Member Signed</label>
                                            < Switch onChange={(val) => { this.changeStatus(val, { memberReSigned: 1 }) }} />
                                        </>
                                    }
                                </div>)
                            :
                            <div>
                                {this.state.orderDetails && this.state.orderDetails.memberSigned ?
                                    <>    <label>Member Signed</label>
                                        < Switch defaultChecked onChange={(val) => { this.changeStatus(val, { memberSigned: 0 }) }} />
                                    </>
                                    : <>
                                        <label>Member Signed</label>
                                        < Switch onChange={(val) => { this.changeStatus(val, { memberSigned: 1 }) }} />
                                    </>
                                }
                            </div>
                        }
                        {this.state.orderDetails && this.state.orderDetails.regeneratedStatus ?
                            <div>
                                {this.state.orderDetails && this.state.orderDetails.counterReSigned ?
                                    <>
                                        <label>Counter Signed</label>
                                        < Switch defaultChecked onChange={(val) => { this.changeStatus(val, { counterReSigned: 0 }) }} />
                                    </> : <>
                                        <label>Counter Signed</label>
                                        < Switch onChange={(val) => { this.changeStatus(val, { counterReSigned: 1 }) }} />
                                    </>
                                }
                            </div> :
                            <div>
                                {this.state.orderDetails && this.state.orderDetails.counterSigned ?
                                    <>
                                        <label>Counter Signed</label>
                                        < Switch defaultChecked onChange={(val) => { this.changeStatus(val, { counterSigned: 0 }) }} />
                                    </>
                                    : <>
                                        <label>Counter Signed</label>
                                        < Switch onChange={(val) => { this.changeStatus(val, { counterSigned: 1 }) }} />
                                    </>
                                }
                            </div>}
                        {this.state.orderDetails && this.state.orderDetails.expressInterstStatus >= 3 ?
                            <>
                                <label>Subscription Completed</label>
                                        < Switch defaultChecked onChange={(val) => { this.changeStatus(val, { expressInterstStatus: 2 }) }} />
                            </>
                            : <>
                                <label>Subscription Completed</label>
                                        < Switch onChange={(val) => { this.changeStatus(val, { expressInterstStatus: 3 }) }} />
                            </>

                        }

                    </div>

                </div>
                    <div className="transactions">
                        <div className="add-funds-btn">
                            <h2>Transactions</h2>
                            {this.state.orderDetails && this.state.orderDetails.partialPayment && this.state.orderDetails.isPaymentCompleted ? null :
                                <Button onClick={() => {
                                    this.setState({ showAddFunds: true })
                                }}>Add Funds</Button>}
                        </div>

                        {this.state.transactions && this.state.transactions.length > 0 ?
                            <Row gutter={[64]}>
                                {this.state.transactions && this.state.transactions.length > 0 ? this.state.transactions.map((item, ind) => {
                                    return (

                                        <Col sm={24} md={8} lg={8}>
                                            <div className="transaction-details-card">
                                                <p className="date-section"><span className="date-label">Date : </span><span className="date-number">{moment(new Date(item.transactionDate)).format('MM/DD/YYYY')}</span></p>
                                                <p className="amount-section-p"><span className="amount-label">Amount :</span> <span className="amount-number">{item.amount}</span></p>
                                                <h4>Description : {item.source}</h4>
                                            </div>
                                        </Col>
                                    )
                                }) : null}

                            </Row> : <p className="no-transactions">No Transactions </p>}
                    </div>
                    {this.state.orderDetails && this.state.orderDetails.documents && this.state.orderDetails.documents.length > 0 ?
                        <div className="documents-section">
                            <h2>Documents</h2>
                            {this.state.orderDetails && this.state.orderDetails.documents && this.state.orderDetails.documents.map((item, ind) => {
                                if (item && item.filePath) {
                                    return (
                                        <div className="documents-card">
                                            <div className="file-document"><FilePdfFilled />
                                                <span>DocuSign Document</span></div>
                                            <a onClick={() => {
                                                this.getSignedUrl(item.filePath)
                                            }}>View</a>
                                        </div>
                                    )
                                }
                            })}
                        </div> : null}

                </div>

                <Modal className="modal-form-sec entity-modal" title="Add Funds" visible={this.state.showAddFunds} onOk={() => { this.formRef.current.submit() }} onCancel={() => { this.handleCancel() }} >
                    <Form layout="vertical" onFinish={this.addFunds.bind(this)} ref={this.formRef}>
                        <Row gutter={[16]}>
                            <Col sm={24} md={12} lg={12} className="amount-input">
                                <Form.Item
                                    name="amount"
                                    label={Strings.amountTitle}
                                    rules={[
                                        {
                                            required: true,
                                            message: Strings.amountInputMessage
                                        }
                                    ]}
                                >
                                    <Input type="number" min={0}

                                        onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                                        onWheel={(e) => { e.currentTarget.blur() }}
                                        placeholder={Strings.amountPlaceholder}
                                    />
                                </Form.Item>
                            </Col>
                            <Col sm={24} md={12} lg={12}>
                                <Form.Item
                                    name="date"
                                    label={Strings.dateTitle}
                                    rules={[
                                        {
                                            required: true,
                                            message: Strings.dateInputMessage
                                        }
                                    ]}
                                >
                                    <DatePicker allowClear={false} format={customFormat} />
                                </Form.Item>

                            </Col>
                        </Row>
                        <Row gutter={[16]}>
                            <Col sm={24} md={12} lg={12}>
                                <Form.Item
                                    name="source"
                                    label="Description"
                                    rules={[
                                        {
                                            required: true,
                                            message: Strings.sourceInputMessage
                                        }
                                    ]}
                                >
                                    <Input.TextArea placeholder={Strings.sourcePlaceholder} />
                                </Form.Item>

                            </Col>
                        </Row>
                    </Form>
                </Modal >

                <Modal className="modal-form-sec entity-modal" title="Edit No.of Shares" visible={this.state.showEditShares} onOk={() => { this.formRef2.current.submit() }} onCancel={() => { this.handleEditCancel() }} >
                    <Form layout="vertical" onFinish={this.editShares.bind(this)} ref={this.formRef2}>
                        <Row gutter={[16]}>
                            <Col sm={24} md={12} lg={12} className="amount-input">
                                <Form.Item
                                    name="shares"
                                    label="No.of Shares"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please enter No.of Shares"
                                        }
                                    ]}
                                >
                                    <Input type="number" min={0}

                                        onKeyDown={(evt) => ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()}
                                        onWheel={(e) => { e.currentTarget.blur() }}
                                        placeholder="No.of Shares"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Modal >
                <Modal
                    title="Confirm"
                    visible={this.state.visible}
                    onOk={() => { this.deliverOrder() }}
                    onCancel={() => { this.hideModal() }}
                    okText="Confirm"
                >
                    <p>Are you sure to confirm !</p>
                </Modal>

            </div>


        )
    }
}

export default connect(null, { getUserData, addNewNotification, updateDataByExpressInterestId, addNewTransaction, getAllTransactionssByOrderId, addNewNotes, getNotesByQuery, getByExpressInterestId, getSignedUrls, getDocusignTemplatesList })(AdminOrderDetails);

