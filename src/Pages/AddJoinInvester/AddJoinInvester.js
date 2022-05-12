import React, { Component } from 'react';
import { Row, Col, Radio, Input, Form, Button, Dropdown, Menu, Upload, message, Select, notification, Image, Checkbox, Tabs, Modal } from 'antd';
import { CloseCircleOutlined, DeleteOutlined, MailOutlined, UploadOutlined, AddOutlined, PlusCircleOutlined, EditOutlined } from "@ant-design/icons";
import { connect } from 'react-redux';
import { Strings } from '../../Constants/Strings';
import { AppHeader, Loading } from '../../Components';
import { addNewJointInvestor, getUserDataLean, updateDataByJointInvestorById } from '../../Redux/Crud';

const { Option } = Select;

class AddJoinInvester extends Component {
    formRef = React.createRef();
    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            user: null,
            initialValues: null,
            JointInvestors: [],
            checkedInvestor: null,
            editInvestorValue: null,
            initialValue: null,
            showAddInvestor: false,
            shareData: null,
            showPrimarySelect: false,
            showInputRelation: false
        }
    }



    componentDidMount() {
        window.scrollTo(0, 0);
        this.setState({
            editInvestorValue: this.props.location.state.editInvestorValue ? this.props.location.state.editInvestorValue : null,
            initialValues: this.props.location.state.initialValues ? this.props.location.state.initialValues : null,
            shareData: this.props.location.state.shareData ? this.props.location.state.shareData : null
        }, () => {
            this.getUserDetails();
        });
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
                        }, () => {
                            if (this.state.initialValues) {

                                this.bindValues(this.state.initialValues)
                            } else {

                                // this.bindValues(res.data)
                            }
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

    // change event for country list
    countryOnChange(value, type) {
        if (value == '1') {
            if (Strings.States[type]) {
                this.setState({ showPrimarySelect: true })
            } else {
                this.setState({ showPrimarySelect: false })
            }
            this.formRef.current.setFieldsValue({ "primaryState": null })
        }
    }

    relationOnChange(value) {
        console.log(value)
        // if (value == 'other') {
        //     this.setState({
        //         showInputRelation: true
        //     })
        // } else {
        //     this.setState({
        //         showInputRelation: false
        //     })

        // }
    }


    //handling form submit
    handleSubmit(values) {
        this.setState({ loading: true });
        let user = JSON.parse(localStorage.getItem('userData'));
        let obj = {
            "firstName": values.firstName,
            "middleName": values.middleName,
            "lastName": values.lastName,
            "relationship": values.relationship ? values.relationship : "",
            investorId: user.id,
            countryCode: values.countryCode,
            phoneNumber: values.phoneNumber,
            taxId: "000000000",
            email: values.email,
            primaryAddress: {
                city: values.primaryCity,
                country: values.primaryCountry,
                state: values.primaryState,
                streetOne: values.primaryStreetOne,
                streetTwo: values.primaryStreetTwo,
                zipcode: values.primaryZipcode
            },

        }
        if (this.state.editInvestorValue && this.state.editInvestorValue.id) {
            this.props.updateDataByJointInvestorById({
                jointInvestorId: this.state.editInvestorValue.id,
                data: obj
            }).then(res => {
                if (res.type == Strings.successType) {
                    this.showingMessage(Strings.successType, res.message, Strings.profileTitle);
                    this.handleCancel()
                    this.setState({ loading: false, showAddInvestor: false });
                } else {
                    this.showingMessage(Strings.errorType, res.message, Strings.profileTitle)
                    this.setState({ loading: false });
                }
            })
        } else {
            this.props.addNewJointInvestor(obj).then(res => {
                if (res.type == Strings.successType) {
                    this.showingMessage(Strings.successType, res.message, Strings.profileTitle);
                    this.handleCancel()
                    this.setState({ loading: false, showAddInvestor: false });
                } else {
                    this.showingMessage(Strings.errorType, res.message, Strings.profileTitle)
                    this.setState({ loading: false });
                }
            })
        }
    }

    // cancle the entity
    handleCancel() {
        this.formRef.current.resetFields();
        if (this.state.shareData) {
            this.props.history.push('/investor-individual', { shareData: this.state.shareData, step: 'join' })
        } else {
            // this.props.history.goBack();

            this.props.history.push('/profile', { step: 0 })
        }
    }

    //showing notification message
    showingMessage(type, message, title) {
        notification[type]({
            description: message,
        });
    }

    // change event for select entity
    handleRadioButtonChange(ind) {
        this.state.JointInvestors.map(item => {
            item.checked = false;
        })
        this.state.JointInvestors[ind].checked = true;
        this.setState({
            JointInvestors: this.state.JointInvestors,
            checkedInvestor: this.state.JointInvestors[ind]
        })

        this.props.SelectInvestor(this.state.JointInvestors[ind])
    }


    // bind values
    bindValues(user) {
        let obj = {
            firstName: user.firstName,
            middleName: user.middleName ? user.middleName : "",
            lastName: user.lastName,
            relationship: user.relationship ? user.relationship : "",
            countryCode: user.countryCode,
            phoneNumber: user.phoneNumber,
            email: user.email,
            taxId: "",
            id: user.id,
            primaryCity: user.primaryAddress ? user.primaryAddress.city : "",
            primaryCountry: user.primaryAddress ? user.primaryAddress.country : "",
            primaryState: user.primaryAddress ? user.primaryAddress.state : "",
            primaryStreetOne: user.primaryAddress ? user.primaryAddress.streetOne : "",
            primaryStreetTwo: user.primaryAddress ? user.primaryAddress.streetTwo : "",
            primaryZipcode: user.primaryAddress ? user.primaryAddress.zipcode : "",

        }
        this.setState({
            initialValues: obj,
            showAddInvestor: true
        }, () => {
            this.formRef.current.setFieldsValue(obj);
        })
    }



    render() {
        return (
            <div className="edit-profile-sec-main">
                <div className="profile-main" key={this.props.user ? this.props.user : null}>
                    {this.state.loading ? <Loading></Loading> : null}
                    <div className="header-main" key={this.state.user ? this.state.user : null}>
                        <AppHeader history={this.props.history} user={this.state.user} />
                    </div>
                    <div className="container">
                        <h1 className="join-investor-h">{this.state.editInvestorValue ? "Edit Joint Investor" : "Add Joint Investor"}</h1>
                        <div className="profile-section add-joint-investor" >

                            <Form layout="horizantal" onFinish={this.handleSubmit.bind(this)} ref={this.formRef}>
                                {/* <Row gutter={[16]}>
                            <Col sm={24} md={12} lg={12}>
                                <Form.Item
                                    name="taxId"
                                    label={Strings.TaxIdTitle}
                                    rules={[
                                        {
                                            required: true,
                                            message: Strings.TaxId
                                        },
                                        {
                                            min: 9,
                                            message: Strings.taxIdMinLengthMessage,
                                        },
                                        {
                                            max: 9,
                                            message: Strings.taxIdMinLengthMessage,
                                        }
                                    ]}
                                >
                                    <Input prefix={<MailOutlined />} placeholder={Strings.taxIdPlaceholder} />
                                </Form.Item>

                            </Col>
                        </Row> */}
                                <h4 className="responsive-label">Joint Investor Details</h4>
                                <Row gutter={[16]}>
                                    <Col md={8} lg={8} sm={24}>
                                        <Form.Item
                                            name="firstName"
                                            label={Strings.firstNameTitle}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: Strings.firstNameInputMessage
                                                },
                                                {
                                                    min: 3,
                                                    message: Strings.firstNameInputMinLengthMessage,
                                                },
                                                {
                                                    max: 30,
                                                    message: Strings.firstNameInputMaxLengthMessage,
                                                },
                                            ]}
                                        >
                                            <Input
                                                prefix={<MailOutlined className="" />}
                                                placeholder={Strings.firstNamePlaceholder}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col md={8} lg={8} sm={24}>
                                        <Form.Item
                                            name="middleName"
                                            label={Strings.middleNameTitle}
                                            rules={[
                                                {
                                                    required: false,
                                                    message: Strings.middleNameInputMessage
                                                }
                                            ]}
                                        >
                                            <Input
                                                prefix={<MailOutlined className="" />}
                                                placeholder={Strings.middleNamePlaceholder}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col md={8} lg={8} sm={24}>
                                        <Form.Item
                                            name="lastName"
                                            label={Strings.lastNameTitle}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: Strings.lastNameInputMessage
                                                },
                                                {
                                                    min: 1,
                                                    message: Strings.lastNameInputMinLengthMessage,
                                                },
                                                {
                                                    max: 30,
                                                    message: Strings.lastNameInputMaxLengthMessage,
                                                },
                                            ]}
                                        >
                                            <Input
                                                prefix={<MailOutlined className="" />}
                                                placeholder={Strings.lastNamePlaceholder}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={[16]}>
                                    <Col sm={24} md={12} lg={12}>
                                        <Form.Item
                                            name="email"
                                            label={Strings.emailTitle}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: Strings.emailInputMessage
                                                },
                                                {
                                                    type: 'email',
                                                    message: Strings.invalidEmailMessage,
                                                }
                                            ]}
                                        >
                                            <Input
                                                prefix={<MailOutlined className="" />}
                                                placeholder={Strings.emailPlaceholder}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col sm={24} md={12} lg={12} className="city-select number-select">
                                    <Col sm={24} md={8} lg={8} xsm={24} className='phone-number-label-col'>
                                        <div className="phone-number"> {Strings.phoneNumberTitle}</div>
                                    </Col>
                                        <div className="country-code-input add-entity-country-code">
                                        <Col sm={24} md={3} lg={3} xsm={24}>
                                            <Form.Item
                                                name="countryCode"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: Strings.countryCodeInputMessage
                                                    }]}
                                            >
                                                <Select
                                                    showSearch
                                                    style={{ width: 150 }}
                                                    placeholder={Strings.countryCodePlaceholder}
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) =>
                                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    }
                                                    filterSort={(optionA, optionB) =>
                                                        optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                                    }
                                                >
                                                    {Strings.countryCodeList.map((item, index) => {
                                                        return <Option key={index} value={item}>{item}</Option>
                                                    })}
                                                </Select>
                                            </Form.Item>
                                            </Col>
                                            <Col sm={24} md={13} lg={13} xsm={24} className="number-col-sec">
                                            <Form.Item
                                                className="number-section joint-number-section"
                                                name="phoneNumber"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: Strings.phoneNumberInputMessage
                                                    },
                                                    {
                                                        pattern: new RegExp("^[0-9]{10}$"),
                                                        message: "Phone Number must contain 10 digits"
                                                    }
                                                    
                                                ]}
                                            >
                                                <Input
                                                    prefix={<MailOutlined className="" />}
                                                    placeholder={Strings.phoneNumberPlaceholder}
                                                />
                                            </Form.Item>
                                            </Col>
                                        </div>
                                    </Col>
                                </Row>
                                <Row gutter={[16]}>
                                    <Col sm={24} md={12} lg={12} className='city-select'>
                                        <Form.Item
                                            name="relationship"
                                            label={Strings.relationTitle}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: Strings.relationInputMessage
                                                }
                                            ]}
                                        >
                                            {/* {this.state.showInputRelation ?
                                             <Input
                                                 prefix={<MailOutlined className="" />}
                                                 placeholder={Strings.relationPlaceholder}
                                             />:  */}
                                                <Select
                                                    showSearch
                                                    
                                                    placeholder={Strings.relationPlaceholder}
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) =>
                                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    }
                                                    filterSort={(optionA, optionB) =>
                                                        optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                                    }
                                                    onChange={this.relationOnChange.bind(this)}
                                                >
                                                    {Strings.relationships && Strings.relationships.map((item, index) => {
                                                        return <Option key={index} value={item}>{item}</Option>
                                                    })}
                                                </Select>
                                            {/* } */}
                                        </Form.Item>
                                    </Col>
                                </Row>


                                <h4 className="section-header">Primary Address</h4>

                                <Row gutter={[16]}>
                                    <Col sm={24} md={12} lg={12} xsm={24}>
                                        <Form.Item
                                            name="primaryStreetOne"
                                            label={Strings.streetTitle}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: Strings.streetInputMessage
                                                }
                                            ]}
                                        >
                                            <Input
                                                prefix={<MailOutlined className="" />}
                                                placeholder={Strings.streetPlaceholder}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col sm={24} md={12} lg={12} xsm={24} className="street-two-label">
                                        <Form.Item
                                            name="primaryStreetTwo"
                                            label={Strings.streetTitleTwo}
                                        >
                                            <Input
                                                prefix={<MailOutlined className="" />}
                                                placeholder={Strings.streetPlaceholder}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={[16]}>
                                    <Col sm={24} md={12} lg={12} xsm={24} className="city-select">
                                        <Form.Item
                                            name="primaryCity"
                                            label={Strings.cityTitle}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: Strings.cityInputMessage,
                                                },
                                            ]}>
                                            <Input
                                                prefix={<MailOutlined className="" />}
                                                placeholder={Strings.cityPlaceholder}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col sm={24} md={12} lg={12} xsm={24}>
                                        <Form.Item
                                            name="primaryZipcode"
                                            label={Strings.zipTitle}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: Strings.zipInputMessage
                                                }
                                            ]}
                                        >
                                            <Input
                                                prefix={<MailOutlined className="" />}
                                                placeholder={Strings.zipPlaceholder}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={[16]} className="primary-address-section">
                                    <Col sm={24} md={12} lg={12} xsm={24} className="city-select" >
                                        <Form.Item
                                            name="primaryCountry"
                                            label={Strings.countryTitle}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: Strings.countryInputMessage,
                                                },
                                            ]}>
                                            <Select
                                                showSearch
                                                style={{ width: 150 }}
                                                placeholder={Strings.countryPlaceholder}
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                                filterSort={(optionA, optionB) =>
                                                    optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                                }
                                                onChange={this.countryOnChange.bind(this, '1')}
                                            >
                                                {Strings.Countries && Strings.Countries.map((item, index) => {
                                                    return <Option key={index} value={item}>{item}</Option>
                                                })}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col sm={24} md={12} lg={12} xsm={24} className="city-select" >
                                        <Form.Item
                                            name="primaryState"
                                            label={Strings.stateTitle}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: Strings.stateInputMessage,
                                                },
                                            ]}>

                                            {this.state.showPrimarySelect ?
                                                <Select
                                                    showSearch
                                                    style={{ width: 150 }}
                                                    placeholder={Strings.statePlaceholder}
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) =>
                                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    }
                                                    filterSort={(optionA, optionB) =>
                                                        optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                                    }
                                                >
                                                    {this.formRef.current && Strings.States[this.formRef.current.getFieldValue("primaryCountry")] && Strings.States[this.formRef.current.getFieldValue("primaryCountry")].map((item, index) => {
                                                        return <Option key={index} value={item}>{item}</Option>
                                                    })}
                                                </Select> :
                                                <Input
                                                    prefix={<MailOutlined className="" />}
                                                    placeholder={Strings.statePlaceholder}
                                                />
                                            }
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <div className="save-btn-sec-profile right-align-buttons">
                                    <Button type="primary" onClick={() => { this.handleCancel() }} className="cancel-button">Cancel</Button>
                                    <Button type="primary" htmlType="submit" className="primary-button">{Strings.saveButtonTitle}</Button>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(null, { addNewJointInvestor, updateDataByJointInvestorById, getUserDataLean })(AddJoinInvester)

