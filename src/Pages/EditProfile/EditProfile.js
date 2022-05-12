import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateProfile, getUserDataLean, uploadImage, uploadSecureFiles, getSignedUrls } from '../../Redux/Crud';
import { Strings } from '../../Constants/Strings';
import { AppHeader, Loading, Footer } from '../../Components';
import { Row, Col, Radio, Input, Form, Button, Dropdown, Menu, Upload, message, Select, notification, Image, Checkbox, Tabs, Breadcrumb } from 'antd';
import { CloseCircleOutlined, FilePdfFilled, MailOutlined, UploadOutlined, AddOutlined, PlusCircleOutlined, EditOutlined } from "@ant-design/icons";

import camera from "../../assets/images/camera.png";
import headerProfile from "../../assets/images/headerProfile.png";
import userImage from '../../assets/images/userImage.png';
import moment from 'moment';


const { Option } = Select;

class EditProfile extends Component {
    formRef = React.createRef();
    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            user: null,
            actualUser: null,
            drivingLicense: null,
            taxIdentificationForm: null,
            profilePicture: null,
            hideHeader: false,
            disableCheckBox: false,
            checkBoxStatus: false,
            mailingFormDisable: false,
            showMailingSelect: false,
            showPrimarySelect: false,
            fromLogin: false
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.getUserDetails();
        if (this.props.location.state && this.props.location.state.fromLogin) {
            this.setState({ fromLogin: this.props.location.state.fromLogin })
        }
    }

    //getting user data
    getUserDetails() {
        if (localStorage.getItem('userData')) {
            let user = JSON.parse(localStorage.getItem('userData'));
            this.props.getUserDataLean(user.id)
                .then(res => {
                    if (res.type == Strings.successType) {
                        this.setState({
                            drivingLicense: res.data.drivingLicense,
                            taxIdentificationForm: res.data.taxIdentificationForm,
                            profilePicture: res.data.profilePicture,
                            actualUser: res.data
                        });

                        this.bindValues(res.data)
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

    //bind user data in form
    bindValues(user) {
        let obj = {
            firstName: user.firstName,
            middleName: user.middleName ? user.middleName : "",
            lastName: user.lastName,
            countryCode: user.countryCode,
            phoneNumber: user.phoneNumber,
            email: user.email,
            fullName: user.firstName + " " + (user.middleName ? user.middleName + " " : "") + user.lastName,
            // taxId: user.taxId,
            primaryCity: user.primaryAddress ? user.primaryAddress.city : "",
            primaryCountry: user.primaryAddress ? user.primaryAddress.country : "",
            primaryState: user.primaryAddress ? user.primaryAddress.state : "",
            primaryStreetOne: user.primaryAddress ? user.primaryAddress.streetOne : "",
            primaryStreetTwo: user.primaryAddress ? user.primaryAddress.streetTwo : "",
            primaryZipcode: user.primaryAddress ? user.primaryAddress.zipcode : "",
            mailingCity: user.mailingAddress ? user.mailingAddress.city : "",
            mailingCountry: user.mailingAddress ? user.mailingAddress.country : "",
            mailingState: user.mailingAddress ? user.mailingAddress.state : "",
            mailingStreetOne: user.mailingAddress ? user.mailingAddress.streetOne : "",
            mailingStreetTwo: user.mailingAddress ? user.mailingAddress.streetTwo : "",
            mailingZipcode: user.mailingAddress ? user.mailingAddress.zipcode : "",
            userType: user.userType,
            id: user.id,
            // taxIdentificationType : user.taxIdentificationType ? user.taxIdentificationType : "",
        }
        if (user.primaryAddress) {
            // this.setState({ disableCheckBox: false })
            if (Strings.States[user.primaryAddress.country]) {
                if (this.formRef.current) {
                    this.formRef.current.setFieldsValue({ "primaryCountry": user.primaryAddress.country })
                }
                this.setState({ showPrimarySelect: true })

            } else {
                this.setState({ showPrimarySelect: false })
            }

        }
        if (user.mailingAddress) {
            if (Strings.States[user.mailingAddress.country]) {
                if (this.formRef.current) {
                    this.formRef.current.setFieldsValue({ "mailingCountry": user.mailingAddress.country })
                }
                this.setState({ showMailingSelect: true })
            } else {
                this.setState({ showMailingSelect: false })
            }

        }
        this.setState({
            checkBoxStatus: user.mailingAddressIsDifferAsPrimary ? user.mailingAddressIsDifferAsPrimary : false,
            mailingFormDisable: user.mailingAddressIsDifferAsPrimary ? false : true,
            user: obj
        })
    }

    // cancle the entity
    handleCancel() {
        // this.state.actualUser.isProfileDetailsFilled = true;
        // this.setState({ actualUser: this.state.actualUser });
        // this.props.history.push('/profile');

        this.props.history.push('/profile', { step: 0 })
    }


    // check box event
    onChangeCheckBox(value) {
        if (value.target.checked) {
            this.setState({ checkBoxStatus: value.target.checked, mailingFormDisable: false })
        } else {
            if (Strings.States[this.formRef.current.getFieldValue('primaryCountry')]) {
                this.setState({ showMailingSelect: true })
            } else {
                this.setState({ showMailingSelect: false })
            }
            this.formRef.current.setFieldsValue({
                'mailingCountry': this.formRef.current.getFieldValue('primaryCountry'),
                'mailingState': this.formRef.current.getFieldValue('primaryState'),
                'mailingCity': this.formRef.current.getFieldValue('primaryCity'),
                'mailingZipcode': this.formRef.current.getFieldValue('primaryZipcode'),
                'mailingStreetOne': this.formRef.current.getFieldValue('primaryStreetOne'),
                'mailingStreetTwo': this.formRef.current.getFieldValue('primaryStreetTwo')
            })

            this.setState({ checkBoxStatus: value.target.checked, mailingFormDisable: true })

        }
    }


    // remove drivingLicense
    removeDrivingLicense() {
        this.setState({
            drivingLicense: null
        });
    }

    // remove w9form
    removeW9Form() {
        this.setState({
            taxIdentificationForm: null
        });
    }

    // form on value change event
    onValuesChange(values) {
        let formData = this.formRef.current.getFieldsValue(['primaryCountry', 'primaryState', 'primaryCity', 'primaryZipcode', 'primaryStreetOne', 'primaryStreetTwo'])
        if (formData) {
            if (this.state.checkBoxStatus) { } else {
                if (formData.primaryCountry) {
                    this.formRef.current.setFieldsValue({
                        'mailingCountry': this.formRef.current.getFieldValue('primaryCountry')
                    })
                    if (Strings.States[this.formRef.current.getFieldValue('primaryCountry')]) {
                        this.setState({ showMailingSelect: true })
                    } else {
                        this.setState({ showMailingSelect: false })
                    }
                }
                if (formData.primaryState) {
                    this.formRef.current.setFieldsValue({
                        'mailingState': this.formRef.current.getFieldValue('primaryState')
                    })
                }
                if (formData.primaryCity) {
                    this.formRef.current.setFieldsValue({
                        'mailingCity': this.formRef.current.getFieldValue('primaryCity')
                    })
                }
                if (formData.primaryZipcode) {
                    this.formRef.current.setFieldsValue({
                        'mailingZipcode': this.formRef.current.getFieldValue('primaryZipcode')
                    })
                }
                if (formData.primaryStreetOne) {
                    this.formRef.current.setFieldsValue({
                        'mailingStreetOne': this.formRef.current.getFieldValue('primaryStreetOne')
                    })
                }
                if (formData.primaryStreetTwo) {
                    this.formRef.current.setFieldsValue({
                        'mailingStreetTwo': this.formRef.current.getFieldValue('primaryStreetTwo')
                    })
                }
            }
        }
    }

    // change event for country list
    countryOnChange(value, type) {
        if (value == '2') {
            if (Strings.States[type]) {
                this.setState({ showMailingSelect: true })
            } else {
                this.setState({ showMailingSelect: false })
            }
            this.formRef.current.setFieldsValue({ "mailingState": null })
            this.formRef.current.validateFields();
        }
        if (value == '1') {
            if (Strings.States[type]) {
                this.setState({ showPrimarySelect: true })
            } else {
                this.setState({ showPrimarySelect: false })
            }
            this.formRef.current.setFieldsValue({ "primaryState": null })
            this.formRef.current.validateFields();
        }
    }

    //handling form submit
    handleSubmit(values) {
        this.setState({ loading: true });
        let user = JSON.parse(localStorage.getItem('userData'));
        let obj = {
            idProofType: values.idProofType,
            countryCode: values.countryCode,
            phoneNumber: values.phoneNumber,
            taxId: "000000000",
            mailingAddressIsDifferAsPrimary: this.state.checkBoxStatus,
            primaryAddress: {
                city: values.primaryCity,
                country: values.primaryCountry,
                state: values.primaryState,
                streetOne: values.primaryStreetOne,
                streetTwo: values.primaryStreetTwo,
                zipcode: values.primaryZipcode
            },
            mailingAddress: {
                city: values.mailingCity,
                country: values.mailingCountry,
                state: values.mailingState,
                streetOne: values.mailingStreetOne,
                streetTwo: values.mailingStreetTwo,
                zipcode: values.mailingZipcode
            }
        }
        if (this.state.checkBoxStatus) {
        } else {
            obj.mailingAddress = {
                city: values.primaryCity,
                country: values.primaryCountry,
                state: values.primaryState,
                streetOne: values.primaryStreetOne,
                streetTwo: values.primaryStreetTwo,
                zipcode: values.primaryZipcode
            }
        }
        // if (this.state.taxIdentificationForm) {
        //     obj.taxIdentificationType = values.taxIdentificationType;
        //     obj.taxIdentificationForm = this.state.taxIdentificationForm;
        // }
        obj.profilePicture = this.state.profilePicture;
        if (this.state.actualUser && this.state.actualUser.verifyStatus != 2) {
            obj.verifyStatus = 1;
        }
        this.props.updateProfile({ userId: user.id, data: obj }).then(res => {
            if (res.type == Strings.successType) {
                this.showingMessage(Strings.successType, res.message, Strings.profileTitle);
                this.bindValues(res.data);
                // if (this.state.fromLogin) {
                //     this.props.history.push('/verify');
                // } else {
                this.props.history.push('/profile');

                //this.props.history.push('/profile', { step: 0 })
                // }
                this.setState({
                    loading: false,
                    actualUser: res.data
                });
            } else {
                this.showingMessage(Strings.errorType, res.message, Strings.profileTitle)
                this.setState({ loading: false });
            }
        })
    }

    //showing notification message
    showingMessage(type, message, title) {
        notification[type]({
            description: message,
        });
    }


    // upload drivingLicense file
    onUpload = (info) => {
        this.setState({ loading: true });
        const form = new FormData();
        form.append('file', info);
        this.props.uploadSecureFiles(form).then(res => {
            if (res.type == Strings.successType) {
                this.setState({
                    drivingLicense: res.data
                });
                this.showingMessage(Strings.successType, res.message, Strings.profileTitle);
                this.setState({ loading: false });
            } else {
                this.showingMessage(Strings.errorType, res.message, Strings.profileTitle)
                this.setState({ loading: false });
            }
        })
    }

    // upload formw9 file
    onUploadW9 = (info) => {
        this.setState({ loading: true });
        const form = new FormData();
        form.append('file', info);
        this.props.uploadSecureFiles(form).then(res => {
            if (res.type == Strings.successType) {
                this.setState({
                    taxIdentificationForm: res.data
                });
                this.showingMessage(Strings.successType, res.message, Strings.profileTitle);
                this.setState({ loading: false });
            } else {
                this.showingMessage(Strings.errorType, res.message, Strings.profileTitle)
                this.setState({ loading: false });
            }
        })
    }

    // upload file
    onProfileUpload = (info) => {

        this.setState({ loading: true });
        const form = new FormData();
        form.append('file', info);
        this.props.uploadImage(form).then(res => {
            if (res.type == Strings.successType) {
                this.state.user.profilePicture = res.data;
                this.setState({
                    profilePicture: res.data,
                    user: this.state.user
                });
                this.showingMessage(Strings.successType, res.message, Strings.profileTitle);
                this.setState({ loading: false });
            } else {
                this.showingMessage(Strings.errorType, res.message, Strings.profileTitle)
                this.setState({ loading: false });
            }
        })
    }

    // getSignedUrl
    getSignedUrl(val) {
        console.log(val)
        this.setState({ loading: true });
        this.props.getSignedUrls({
            key: val,
            from: "user"
        }).then((res) => {
            if (res.type == Strings.successType) {
                this.setState({ loading: false });
                window.open(res.data, '_blank')
            } else {
                this.setState({ loading: false });
            }
        })
    }


    render() {
        return (
            <div className="edit-profile-sec-main">
                <div className="profile-main" key={this.state.user ? this.state.user : null} id="profile-main-section">
                    {this.state.loading ? <Loading></Loading> : null}
                    <div className="header-main" key={this.state.user ? this.state.user : null}>
                        <AppHeader history={this.props.history} user={this.state.actualUser} />
                    </div>
                    <div className="container">
                        <h1 className="page-main-heading">Edit Profile</h1>
                        <div className="profile-section" >
                            <Form layout="horizantal" initialValues={this.state.user} onFinish={this.handleSubmit.bind(this)} ref={this.formRef} onValuesChange={this.onValuesChange.bind(this)}>
                                <div className="edit-profile-pic">
                                    {/* {this.state.profilePicture && this.state.profilePicture.orginalUrl ? <img src={this.state.profilePicture.orginalUrl} className="profile-pic" />
                                        :
                                        <img src={userImage} className="profile-pic" />}
                                    <Upload action={this.onProfileUpload} multiple={false}
                                        accept={".png,.jpg,.jpeg"} showUploadList={false}>
                                        <img src={camera} className="camera-pic" />
                                    </Upload> */}
                                </div>
                                <Row gutter={[16]}>
                                    <Col offset={2} xsm={24} sm={24} md={10} lg={10}>
                                        <Form.Item
                                            name="fullName"
                                            label={Strings.fullName}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: Strings.fullNameInputMessage
                                                },
                                                {
                                                    min: 3,
                                                    message: Strings.fiullNameInputMinLengthMessage,
                                                },
                                                {
                                                    max: 30,
                                                    message: Strings.fullNameInputMaxLengthMessage,
                                                },
                                            ]}
                                        >
                                            <Input disabled
                                                prefix={<MailOutlined className="" />}
                                                placeholder={Strings.fullNamePlaceholder}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col sm={24} md={10} lg={10} xsm={24} className="city-select profile-add-contact">
                                        <div className='phone-number-label-col'>
                                            <div className="phone-number"> {Strings.phoneNumberTitle}</div>
                                        </div>
                                        <div className="country-code-input">
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
                                            <Col sm={24} md={14} lg={14} xsm={24} className="number-col-sec">
                                                <Form.Item
                                                    className="number-section profile-number-section"
                                                    name="phoneNumber"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: Strings.phoneNumberInputMessage
                                                        },
                                                        {
                                                            pattern: new RegExp("^[0-9]{10,10}$"),
                                                            message: Strings.phoneNumberInputMinLengthMessage,
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
                                {/* <Row gutter={[16]}>
                                    <Col offset={2} sm={24} md={10} lg={10} xsm={24}>
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
                                            <Input
                                                prefix={<MailOutlined className="" />}
                                                placeholder={Strings.taxIdPlaceholder}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row> */}
                                <Row>
                                    <Col offset={2} sm={24} md={10} lg={10} xsm={24} className='mailing-address-col'><label className="primary-label">Primary Address</label></Col>
                                </Row>
                                <Row gutter={[16]}>
                                    <Col offset={2} sm={24} md={10} lg={10} xsm={24}>
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
                                    <Col sm={24} md={10} lg={10} xsm={24} className="street-two-label">
                                        <Form.Item
                                            name="primaryStreetTwo"
                                            label={Strings.streetTitleTwo}
                                            rules={[
                                            ]}
                                        >
                                            <Input
                                                prefix={<MailOutlined className="" />}
                                                placeholder={Strings.streetPlaceholder}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={[16]}>
                                    <Col offset={2} sm={24} md={10} lg={10} xsm={24} className="city-select">
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
                                    <Col sm={24} md={10} lg={10} xsm={24}>
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
                                    <Col offset={2} sm={24} md={10} lg={10} xsm={24} className="country-select" >
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
                                                {Strings.Countries.map((item, index) => {
                                                    return <Option key={index} value={item}>{item}</Option>
                                                })}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col sm={24} md={10} lg={10} xsm={24} className="city-select state-province" >
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
                                <Row gutter={[16]}>
                                    <Col offset={2} sm={22} md={22} lg={24} xsm={24} className="mailing-address-col">
                                        <Checkbox value={this.state.checkBoxStatus} checked={this.state.checkBoxStatus} disabled={this.state.disableCheckBox} onChange={(e) => this.onChangeCheckBox(e)}>Mailing Address if different from Primary Address</Checkbox>
                                    </Col>
                                </Row>
                                {this.state.mailingFormDisable ? null :
                                    <>

                                        <Row gutter={[16]}>
                                            <Col offset={2} sm={24} md={10} lg={10} xsm={24}>
                                                <Form.Item
                                                    name="mailingStreetOne"
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
                                            <Col sm={24} md={10} lg={10} xsm={24} className="street-two-label">
                                                <Form.Item 
                                                    name="mailingStreetTwo"
                                                    label={Strings.streetTitleTwo}
                                                    rules={[
                                                        {
                                                            required: false,
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
                                        </Row>
                                        <Row gutter={[16]}>
                                            <Col offset={2} sm={24} md={10} lg={10} xsm={24} className="country-select">
                                                <Form.Item
                                                    name="mailingCity"
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
                                            <Col sm={24} md={10} lg={10} xsm={24}>
                                                <Form.Item
                                                    name="mailingZipcode"
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
                                            <Col offset={2} sm={24} md={10} lg={10} xsm={24} className="country-select" >
                                                <Form.Item
                                                    name="mailingCountry"
                                                    label={Strings.countryTitle}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: Strings.countryInputMessage,
                                                        },
                                                    ]}>
                                                    <Select disabled={this.state.mailingFormDisable}
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
                                                        onChange={this.countryOnChange.bind(this, '2')}
                                                    >
                                                        {Strings.Countries.map((item, index) => {
                                                            return <Option key={index} value={item}>{item}</Option>
                                                        })}
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col sm={24} md={10} lg={10} xsm={24} className="city-select" >
                                                <Form.Item
                                                    name="mailingState"
                                                    label={Strings.stateTitle}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: Strings.stateInputMessage,
                                                        },
                                                    ]}>
                                                    {this.state.showMailingSelect ?
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
                                                            {this.formRef.current && Strings.States[this.formRef.current.getFieldValue("mailingCountry")] && Strings.States[this.formRef.current.getFieldValue("mailingCountry")].map((item, index) => {
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

                                    </>
                                }
                                {/* <Row gutter={[16]}>
                                <Col offset={2} sm={24} md={10} lg={10} className="id-select">
                                    <Form.Item
                                        name="idProofType"
                                        label="Id Proof Type"
                                        rules={[
                                            {
                                                required: true,
                                                message: "proof type required!",
                                            },
                                        ]}>
                                        <Select placeholder="Proof Type">
                                            <Option value="DrivingLicense">Driving License</Option>
                                            <Option value="pan">Pan Card</Option>
                                            <Option value="Aadhar">Adhar Card</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row> */}
                                {/* <Row gutter={[16]} className="documents-row"> */}

                                {/* <Col offset={2} sm={24} md={10} lg={10} className="city-select">
                                    {this.state.drivingLicense ?
                                        <>

                                            <label className="document-label">Id Proof</label>
                                            <div className="pdf-icon-sec"> <FilePdfFilled onClick={() => {
                                                this.getSignedUrl(this.state.drivingLicense)
                                            }} /> <CloseCircleOutlined className="delete-icon" onClick={() => { this.removeDrivingLicense() }} /></div>

                                        </>
                                        : <Form.Item
                                            name="drivingLicense"
                                            label={Strings.uploadDrivingLicenseTitle}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: Strings.uploadDrivingLicenseInputMessage,
                                                },
                                            ]}
                                        >
                                            <Upload action={this.onUpload} multiple={false}
                                                accept={".png,.jpg,.jpeg,.pdf"} showUploadList={false}>
                                                <Button icon={<UploadOutlined />}>{Strings.uploadDrivingLicenseTitle}</Button>
                                            </Upload>
                                        </Form.Item>}

                                </Col> */}

                                {/* <Col offset={2} sm={24} md={10} lg={10} className="id-select">
                                        <Form.Item
                                            name="taxIdentificationType"
                                            label="Tax Form Type"
                                            rules={[
                                                {
                                                    required: false,
                                                    message: "Form type required!",
                                                },
                                            ]}>
                                            <Select placeholder="Form Type">
                                                <Option value="W-9">W-9</Option>
                                                <Option value="W-8BEN">W-8BEN</Option>
                                                <Option value="W-8BEN-E">W-8BEN-E</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>

                                    <Col md={10} lg={10} sm={24} xsm={24} className="city-select">
                                        {this.state.taxIdentificationForm ?
                                            <>
                                                <label className="document-label">Tax Form</label>
                                                <div className="pdf-icon-sec"> <FilePdfFilled onClick={() => {
                                                    this.getSignedUrl(this.state.taxIdentificationForm)
                                                }} /> <CloseCircleOutlined className="delete-icon" onClick={() => { this.removeW9Form() }} /></div>

                                            </>

                                            : <Form.Item
                                                name="taxIdentificationForm"
                                                label={Strings.uploadw9Title}
                                                rules={[
                                                    {
                                                        required: false,
                                                        message: Strings.uploadw9InputMessage,
                                                    },
                                                ]}
                                            >
                                                <Upload action={this.onUploadW9} multiple={false}
                                                    accept={".pdf"} showUploadList={false}>
                                                    <Button icon={<UploadOutlined />}>{Strings.uploadw9Title}</Button>
                                                </Upload>
                                            </Form.Item>}
                                    </Col>

                                </Row> */}
                                <Col sm={24} xsm={24} md={22} lg={22}>
                                    <div className="save-btn-sec">

                                        {this.state.fromLogin ? null : <Button type="primary" onClick={() => { this.handleCancel() }} className="cancel-button">Cancel</Button>}
                                        <Button type="primary" htmlType="submit" className="primary-button">{Strings.saveButtonTitle}</Button>
                                    </div>
                                </Col>
                            </Form>
                        </div>
                    </div>
                </div>
                 <Footer history={this.props.history} />
            </div>
        )
    }

}
export default connect(null, { updateProfile, getUserDataLean, uploadImage, uploadSecureFiles, getSignedUrls })(EditProfile)
