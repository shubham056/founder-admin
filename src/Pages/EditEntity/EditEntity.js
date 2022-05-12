import React, { Component } from 'react'
import { Row, Col, Radio, Input, Form, Button, Dropdown, Menu, Upload, message, Select, notification, Image, Checkbox, Tabs, Modal } from 'antd';
import { CloseCircleOutlined, DeleteOutlined, MailOutlined, UploadOutlined, AddOutlined, PlusCircleOutlined, EditOutlined, FilePdfFilled } from "@ant-design/icons";
import { connect } from 'react-redux';
import { Strings } from '../../Constants/Strings';
import { AppHeader, Loading } from '../../Components';
import { addNewInvestorEntity, getAllByInvestorId, updateDataByInvestorEntityId, uploadImage, uploadSecureFiles, getSignedUrls, getUserDataLean } from '../../Redux/Crud';

const { Option } = Select;


class EditEntity extends Component {
    formRef = React.createRef();

    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            user: null,
            showAddEntity: false,
            disableCheckBox: false,
            checkBoxStatus: false,
            mailingFormDisable: true,
            showMailingSelect: false,
            showPrimarySelect: false,
            entitys: [],
            checkedEntity: null,
            editEntityValue: null,
            initialValues: null,
            taxIdentificationForm: null,
            shareData: null
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.setState({
            editEntityValue: this.props.location.state.editEntityValue ? this.props.location.state.editEntityValue : null,
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

                                this.bindValues(res.data)
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


    // cancle the entity
    handleCancel() {
        this.formRef.current.resetFields();
        if (this.state.shareData) {
            this.props.history.push('/investor-individual', { shareData: this.state.shareData, step: 'entity' })

        } else {
            // this.props.history.goBack();

            this.props.history.push('/profile', { step: 2 })
        }
        // this.props.history.go(-1, { step: 'entity' });
    }

    // check box on change event
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

    // form value change event
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
        }
        if (value == '1') {
            if (Strings.States[type]) {
                this.setState({ showPrimarySelect: true })
            } else {
                this.setState({ showPrimarySelect: false })
            }
            this.formRef.current.setFieldsValue({ "primaryState": null })
        }
    }

    //handling form submit
    handleSubmit(values) {
        this.setState({ loading: true });
        let user = JSON.parse(localStorage.getItem('userData'));
        let obj = {
            "firstName": values.firstName,
            "middleName": values.middleName,
            "lastName": values.lastName,
            investorId: user.id,
            countryCode: values.countryCode,
            phoneNumber: values.phoneNumber,
            taxId: "000000000",
            email: values.email,
            entityName: values.entityName,
            judicial: "",
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
            },

        }
        // if (this.state.taxIdentificationForm) {
        //     obj.taxIdentificationType = values.taxIdentificationType;
        //     obj.taxIdentificationForm = this.state.taxIdentificationForm;
        // }
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
        if (this.state.editEntityValue && this.state.editEntityValue.id) {
            this.props.updateDataByInvestorEntityId({
                investorEntityId: this.state.editEntityValue.id,
                data: obj
            }).then(res => {
                if (res.type == Strings.successType) {
                    this.showingMessage(Strings.successType, res.message, Strings.profileTitle);
                    this.handleCancel();
                    this.setState({ loading: false, showAddEntity: false });
                } else {
                    this.showingMessage(Strings.errorType, res.message, Strings.profileTitle)
                    this.setState({ loading: false });
                }
            })
        } else {
            this.props.addNewInvestorEntity(obj).then(res => {
                if (res.type == Strings.successType) {
                    this.showingMessage(Strings.successType, res.message, Strings.profileTitle);
                    this.handleCancel();
                    this.setState({ loading: false, showAddEntity: false });
                } else {
                    this.showingMessage(Strings.errorType, res.message, Strings.profileTitle)
                    this.setState({ loading: false });
                }
            })
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
        this.state.entitys.map(item => {
            item.checked = false;
        })
        this.state.entitys[ind].checked = true;
        this.setState({
            entitys: this.state.entitys,
            checkedEntity: this.state.entitys[ind]
        })
    }

    // edit entity
    editEntity(item) {
        this.setState({ editEntityValue: item, initialValues: item }, () => {
            this.bindValues(item)
        })
    }


    // add entity
    AddEntityForm() {
        this.setState({ editEntityValue: null, initialValues: this.props.user }, () => {
            this.bindValues(this.props.user)
        })
    }

    // bind entity values
    bindValues(user) {
        let obj = {

            judicial: user.judicial ? user.judicial : "",
            entityName: user.entityName ? user.entityName : "",
            firstName: user.firstName,
            middleName: user.middleName ? user.middleName : "",
            lastName: user.lastName,
            countryCode: user.countryCode,
            phoneNumber: user.phoneNumber,
            email: user.email,
            taxId: user.taxId,
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
            id: user.id,
            taxIdentificationType: user.taxIdentificationType ? user.taxIdentificationType : "",
        }
        if (user.primaryAddress) {
            if (Strings.States[user.primaryAddress.country]) {
                this.setState({ showPrimarySelect: true })
            } else {
                this.setState({ showPrimarySelect: false })
            }
        }
        if (user.mailingAddress) {
            if (Strings.States[user.mailingAddress.country]) {
                this.setState({ showMailingSelect: true })
            } else {
                this.setState({ showMailingSelect: false })
            }
        }
        this.setState({
            checkBoxStatus: user.mailingAddressIsDifferAsPrimary ? user.mailingAddressIsDifferAsPrimary : false,
            mailingFormDisable: user.mailingAddressIsDifferAsPrimary ? false : true,
            // taxIdentificationForm: user.taxIdentificationForm ? user.taxIdentificationForm: null
        })
        this.setState({
            initialValues: obj,
            showAddEntity: true
        }, () => {
            this.formRef.current.setFieldsValue(obj);
        })
    }

    // remove w9form
    removeW9Form() {
        this.setState({
            taxIdentificationForm: null
        });
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

    // getSignedUrl
    getSignedUrl(val) {
        this.setState({ loading: true });
        this.props.getSignedUrls({
            key: val,
            from: "entity"
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
                <div className="profile-main" key={this.props.user ? this.props.user : null}>
                    {this.state.loading ? <Loading></Loading> : null}
                    <div className="header-main" key={this.state.user ? this.state.user : null}>
                        <AppHeader history={this.props.history} user={this.state.user} />
                    </div>
                    <div className="container">
                        <h2 className="page-main-heading-entity">{this.state.editEntityValue ? "Edit Entity" : "Add Entity"}</h2>
                        <div className="edit-entity-section" >
                            <Form layout="horizantal" initialValues={this.state.initialValues} onFinish={this.handleSubmit.bind(this)} ref={this.formRef} onValuesChange={this.onValuesChange.bind(this)}>
                                <Row gutter={[16]}>
                                    <Col sm={24} md={12} lg={12} xsm={24}>
                                        <Form.Item
                                            name="entityName"
                                            label={Strings.entityName}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: Strings.entityInputMessage
                                                },
                                                {
                                                    min: 3,
                                                    message: Strings.entityNameInputMinLengthMessage,
                                                },
                                                {
                                                    max: 30,
                                                    message: Strings.entityNameInputMaxLengthMessage,
                                                },
                                            ]}
                                        >
                                            <Input
                                                prefix={<MailOutlined className="" />}
                                                placeholder={Strings.entityNamePlaceholder}
                                            />
                                        </Form.Item>
                                    </Col>
                                    {/* <Col sm={24} md={12} lg={12} xsm={24}>
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

                            </Col> */}
                                </Row>
                                {/* <Row gutter={[16]}>
                            <Col sm={24} md={12} lg={12}  xsm={24}>
                                <Form.Item
                                    name="judicial"
                                    label={Strings.judicialName}
                                    rules={[
                                        {
                                            required: true,
                                            message: Strings.judicialInputMessage
                                        }
                                    ]}
                                >
                                    <Input
                                        prefix={<MailOutlined className="" />}
                                        placeholder={Strings.judicialPlaceholder}
                                    />
                                </Form.Item>
                            </Col>
                        </Row> */}
                                <h4 className="responsive-label">Representative Details</h4>
                                <Row gutter={[16]}>
                                    <Col md={8} lg={8} sm={24} xsm={24}>
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
                                    <Col md={8} lg={8} sm={24} xsm={24}>
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

                                    <Col md={8} lg={8} sm={24} xsm={24}>
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
                                    <Col sm={24} md={12} lg={12} xsm={24}>
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
                                    <Col sm={24} md={12} lg={12} xsm={24} className="city-select number-select">
                                    <Col sm={24} md={8} lg={8} xsm={24} className='phone-number-label-col'>
                                        <div className="phone-number"> {Strings.phoneNumberTitle} </div>
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
                                                className="number-section"
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
                                <Row gutter={[16]}>
                                    <Col sm={24} md={24} lg={24} xsm={24}  className="section-header">
                                        <Checkbox value={this.state.checkBoxStatus} checked={this.state.checkBoxStatus} disabled={this.state.disableCheckBox} onChange={(e) => this.onChangeCheckBox(e)}>Mailing Address</Checkbox>
                                    </Col>
                                </Row>
                                {this.state.mailingFormDisable ? null :
                                    <>
                                        <Row gutter={[16]} >
                                            <Col sm={24} md={12} lg={12} xsm={24}>
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
                                            <Col sm={24} md={12} lg={12} xsm={24} className="street-two-label">
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
                                            <Col sm={24} md={12} lg={12} xsm={24} className="city-select">
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
                                            <Col sm={24} md={12} lg={12} xsm={24}>
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
                                            <Col sm={24} md={12} lg={12} xsm={24} className="city-select" >
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
                                            <Col sm={24} md={12} lg={12} xsm={24} className="city-select" >
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
                                    </>}
                                {/* <Row gutter={[16]} className="documents-row">
                        <Col xsm={24} sm={24} md={12} lg={12} className="id-select">
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

                            <Col md={12} lg={12} sm={24} xsm={24} className="city-select">
                                {this.state.taxIdentificationForm ?
                                    <>
                                        <label className="document-label">W9 Document</label>
                                        <div className="pdf-icon-sec"> <FilePdfFilled onClick={() => {
                                            this.getSignedUrl(this.state.taxIdentificationForm)
                                        }} /> <CloseCircleOutlined className="delete-icon" onClick={() => { this.removeW9Form() }} /></div>

                                    </>

                                    : <Form.Item
                                        name="w9form"
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

                                <div className="save-btn-sec-profile right-align-buttons">
                                    <Button type="primary" onClick={() => { this.handleCancel() }} className="cancel-button">Cancel</Button>
                                    <Button type="primary" htmlType="submit" className="primary-button">{Strings.saveButtonTitle}</Button>
                                </div>
                            </Form>
                            {/* </Modal > */}
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

export default connect(null, { addNewInvestorEntity, getAllByInvestorId, updateDataByInvestorEntityId, uploadImage, uploadSecureFiles, getSignedUrls, getUserDataLean })(EditEntity)

