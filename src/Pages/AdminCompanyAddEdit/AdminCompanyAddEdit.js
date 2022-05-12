import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';

// relative imports
import { Input, Form, Row, Col, Dropdown, Menu, Button, DatePicker, Space, Select, Table, Empty, Image, Upload, InputNumber, notification } from 'antd';
import { AppHeader, Loading } from '../../Components';
import { Strings } from '../../Constants/Strings';
import { getUserData, uploadImage, addCompany, updateCompany } from '../../Redux/Crud';
import { CloseCircleOutlined, FilePdfFilled, MailOutlined, UploadOutlined, AddOutlined, PlusCircleOutlined, EditOutlined, MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import { EditorState, convertToRaw, convertFromRaw, convertFromHTML, CompositeDecorator, ContentState, compositeDecorator } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

import moment from 'moment';
import TextArea from 'antd/lib/input/TextArea';

import './AdminCompanyAddEdit.css';

const { Option } = Select;

//admin company add/edit component declaration
class AdminCompanyAddEdit extends Component {

    companyForm = React.createRef();

    constructor(props) {
        super(props)

        this.state = {
            companyData: null,
            companyLogo: null,
            editorState1: null,
            editorState2: null,
            editorState3: null,
            primaryDetails: [],
            financials: null,
            people: null,
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.state.user = this.props.location.state.user;
        if (this.props.location.state.companyData) {
            this.state.companyData = this.props.location.state.companyData;
            this.state.companyData.founded = moment(this.props.location.state.companyData.founded);
            this.state.companyLogo = this.props.location.state.companyData.logo;
            this.state.financials = this.props.location.state.companyData.financials;
            this.state.people = this.props.location.state.companyData.people;
            this.state.companyData.fundingToDate = JSON.parse(this.props.location.state.companyData.fundingToDate);
            this.state.companyData.sector = JSON.parse(this.props.location.state.companyData.sector);
            this.state.editorState1 = this.props.location.state.companyData.overview && this.props.location.state.companyData.overview.content ? EditorState.createWithContent(convertFromRaw(JSON.parse(this.props.location.state.companyData.overview.content))) : null;
            this.state.editorState2 = this.props.location.state.companyData.financing && this.props.location.state.companyData.financing.content ? EditorState.createWithContent(convertFromRaw(JSON.parse(this.props.location.state.companyData.financing.content))) : null;
            this.state.editorState3 = this.props.location.state.companyData.valuation && this.props.location.state.companyData.valuation.content ? EditorState.createWithContent(convertFromRaw(JSON.parse(this.props.location.state.companyData.valuation.content))) : null;
            this.state.primaryDetails = this.props.location.state.companyData.primaryDetails;
        }
        this.setState({
            user: this.state.user,
            companyData: this.state.companyData,
            editorState1: this.state.editorState1,
            editorState2: this.state.editorState2,
            editorState3: this.state.editorState3,
            companyLogo: this.state.companyLogo,
            people: this.state.people,
            financials: this.state.financials,
            primaryDetails: this.state.primaryDetails
        })
    }


    // upload file
    onUpload = (info) => {
        this.setState({ loading: true });
        const form = new FormData();
        form.append('file', info);
        this.props.uploadImage(form).then(res => {
            if (res.type == Strings.successType) {
                this.setState({ companyLogo: res.data, loading: false }, () => { this.companyForm.current.setFieldsValue({ logo: res.data }) });
            } else {
                this.showingMessage(Strings.errorType, res.message, Strings.profileTitle)
                this.setState({ loading: false });
            }
        })
    }

    // upload file
    onUploadPeople = (info) => {
        this.setState({ loading: true });
        const form = new FormData();
        form.append('file', info);
        this.props.uploadImage(form).then(res => {
            if (res.type == Strings.successType) {
                this.setState({ people: res.data, loading: false }, () => { this.companyForm.current.setFieldsValue({ people: res.data }) });
            } else {
                this.showingMessage(Strings.errorType, res.message, Strings.profileTitle)
                this.setState({ loading: false });
            }
        })
    }

    // upload file
    onUploadFinancials = (info) => {
        this.setState({ loading: true });
        const form = new FormData();
        form.append('file', info);
        this.props.uploadImage(form).then(res => {
            if (res.type == Strings.successType) {
                this.setState({ financials: res.data, loading: false }, () => { this.companyForm.current.setFieldsValue({ financials: res.data }) });
            } else {
                this.showingMessage(Strings.errorType, res.message, Strings.profileTitle)
                this.setState({ loading: false });
            }
        })
    }

    addPrimaryDetails() {
        this.state.primaryDetails.push({ key: "", value: "" });
        this.setState({
            primaryDetails: this.state.primaryDetails
        })
    }

    //removing company logo
    removingCompanyLogo() {
        this.setState({
            companyLogo: null
        });
    }

    //removing people logo
    removingPeopleLogo() {
        this.setState({
            people: null
        });
    }

    //removing financials logo
    removingFinancialsLogo() {
        this.setState({
            financials: null
        });
    }

    //editor1
    onEditorStateChange1 = (editorState) => {
        this.setState({
            editorState1: editorState,
        });
    };

    //editor2
    onEditorStateChange2 = (editorState) => {
        this.setState({
            editorState2: editorState,
        });
    };

    //editor3
    onEditorStateChange3 = (editorState) => {
        this.setState({
            editorState3: editorState,
        });
    };

    //handling form submit
    handleSubmit(values) {
        console.log(values)
        if (this.state.companyLogo) {
            let obj = {
                "portfolioCompanyName": values.portfolioCompanyName,
                "logo": this.state.companyLogo,
                // "logo":{orginalUrl: "https://topshelfprod.s3.us-west-2.amazonaws.com/Images/1642787184463.png",
                // thumbnailUrl: "https://topshelfprod.s3.us-west-2.amazonaws.com/Images/1642787184463-thumbnail.png"},
                // "people": this.state.people,
                // "financials": this.state.financials,
                // "primaryDetails": values.primaryDetails,
                "companyUrl": values.companyUrl,
                "introOne": values.introOne,
                "introTwo": values.introTwo,
                "founded": ((values.founded)._d),
                "category": values.category,
                "location": values.location,
                "fundingToDate": JSON.stringify(values.fundingToDate),
                "sector": JSON.stringify(values.sector),
                "overview": this.state.editorState1 && this.state.editorState1.getCurrentContent() ? { content: JSON.stringify(convertToRaw(this.state.editorState1.getCurrentContent())) } : {}
            }
            if (this.state.companyData && this.state.companyData.id) {
                this.props.updateCompany({ "companyId": this.state.companyData.id, "data": obj }).then(res => {
                    if (res.type == Strings.successType) {
                        this.showingMessage(Strings.successType, res.message, Strings.companyTitle);
                        this.props.history.push('/admin-company-list')
                    } else {
                        this.showingMessage(Strings.errorType, res.message, Strings.companyTitle);
                    }
                })
            } else {
                this.props.addCompany(obj).then(res => {
                    if (res.type == Strings.successType) {
                        this.showingMessage(Strings.successType, res.message, Strings.companyTitle);
                        this.props.history.push('/admin-company-list')
                    } else {
                        this.showingMessage(Strings.errorType, res.message, Strings.companyTitle);
                    }
                })
            }
        } else {
            this.showingMessage(Strings.errorType, "Please Upload Company Logo", Strings.companyTitle);
        }
    }

    //showing notification message
    showingMessage(type, message, title) {
        notification[type]({
            description: message,
        });
    }

    render() {
        const itemInputs = this.state.primaryDetails && this.state.primaryDetails.length > 0 ? this.state.primaryDetails.map((item) => {
            return {
                key: item.key,
                value: item.value
            };
        }) : [];

        return (
            <div className="company-add-edit-main">
                {this.state.loading ? <Loading></Loading> : null}
                {/* header */}
                <div key={this.state.user ? this.state.user : null}>
                    <AppHeader history={this.props.history} user={this.state.user} />
                </div>
                {/* form */}
                <div className="container">
                    <h1 className="page-main-heading">{this.state.companyData && this.state.companyData.id ? Strings.companyEditTitle : Strings.companyAddTitle}</h1>
                    <div className="document-type-card">
                        <div className="card-main">
                            <div className="form-section" key={this.state.companyData ? this.state.companyData : null}>
                                <Form layout="vertical" onFinish={this.handleSubmit.bind(this)} initialValues={this.state.companyData} ref={this.companyForm}>
                                    <Row justify="start" gutter={16}>
                                        <Col offset={1} md={11} lg={11} sm={24}>
                                            <Form.Item name="portfolioCompanyName" label={Strings.portfolioCompanyNameTitle}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: Strings.portfolioCompanyNameInputMessage,
                                                    },
                                                    {
                                                        min: 3,
                                                        message: Strings.portfolioCompanyNameInputMinLengthMessage,
                                                    },
                                                    {
                                                        max: 30,
                                                        message: Strings.portfolioCompanyNameInputMaxLengthMessage,
                                                    },
                                                ]}
                                            >
                                                <Input prefix={<MailOutlined className="" />} placeholder={Strings.portfolioCompanyNamePlaceholder} />
                                            </Form.Item>
                                        </Col>
                                        <Col offset={1} md={11} lg={11} sm={24}>
                                            <Form.Item name="companyUrl" label={Strings.companyUrlTitle}
                                                rules={[
                                                    {
                                                        required: true,
                                                        type: "url",
                                                        message: Strings.companyUrlInputMessage,
                                                    },
                                                ]}
                                            >
                                                <Input prefix={<MailOutlined className="" />} placeholder={Strings.companyUrlPlaceholder} />
                                            </Form.Item>
                                        </Col>
                                        <Col offset={1} md={11} lg={11} sm={24}>
                                            <Form.Item name="logo" label={Strings.companyLogoTitle}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: Strings.companyLogoInputMessage,
                                                    }
                                                ]}>
                                                {this.state.companyLogo ?
                                                    <>
                                                        <Image width={120} src={this.state.companyLogo.orginalUrl} className="license-image"></Image>
                                                        <CloseCircleOutlined className="delete-icon" onClick={() => { this.removingCompanyLogo() }} />
                                                    </> :
                                                    <Upload action={this.onUpload} multiple={false}
                                                        accept={".png,.jpg,.jpeg"} showUploadList={false}>
                                                        <Button icon={<UploadOutlined />}>{Strings.companyLogoPlaceholder}</Button>
                                                    </Upload>
                                                }
                                            </Form.Item>
                                        </Col>
                                        <Col offset={1} md={11} lg={11} sm={24}>
                                            <Form.Item name="sector" label={Strings.sectorTitle}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: Strings.sectorInputMessage,
                                                    }
                                                ]}>
                                                <Select placeholder={Strings.sectorPlaceholder} >
                                                    {Strings.sectorTypes && Strings.sectorTypes.map((option, index) => {
                                                        return <Option value={option.id}>{option.name}</Option>
                                                    })}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col offset={1} md={11} lg={11} sm={24}>
                                            <Form.Item name="introOne" label={Strings.introOneTitle}>
                                                <TextArea />
                                            </Form.Item>
                                        </Col>
                                        <Col offset={1} md={11} lg={11} sm={24}>
                                            <Form.Item name="introTwo" label={Strings.introTwoTitle}>
                                                <TextArea />
                                            </Form.Item>
                                        </Col>
                                        <Col offset={1} md={11} lg={11} sm={24} >
                                            <Form.Item name="category" label={Strings.companyCategoryTitle}
                                            >
                                                <Input prefix={<MailOutlined className="" />} placeholder={Strings.companyCategoryPlaceholder} />
                                            </Form.Item>
                                        </Col>
                                        <Col offset={1} md={11} lg={11} sm={24}>
                                            <Form.Item name="location" label={Strings.companyLocationTitle}
                                            >
                                                <Input prefix={<MailOutlined className="" />} placeholder={Strings.companyLocationPlaceholder} />
                                            </Form.Item>
                                        </Col>
                                        <Col offset={1} md={11} lg={11} sm={24} >
                                            <Form.Item name="founded" label={Strings.foundedTitle}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: Strings.foundedInputMessage,
                                                    }
                                                ]}>
                                                <DatePicker picker="year" prefix={<MailOutlined className="" />} placeholder={Strings.foundedPlaceholder} />
                                            </Form.Item>
                                        </Col>
                                        <Col offset={1} md={11} lg={11} sm={24} >
                                            <Form.Item name="fundingToDate" label={Strings.fundingToDateTitle}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: Strings.fundingToDateInputMessage,
                                                    },
                                                ]}>
                                                <InputNumber min={0} prefix={<MailOutlined className="" />} placeholder={Strings.fundingToDatePlaceholder} />
                                            </Form.Item>
                                        </Col>
                                        <Col offset={1} md={11} lg={11} sm={24}>
                                            <Form.Item name="people" label={Strings.companyPeopleTitle}>
                                                {this.state.people ?
                                                    <>
                                                        <Image width={120} src={this.state.people.orginalUrl} className="license-image"></Image>
                                                        <CloseCircleOutlined className="delete-icon" onClick={() => { this.removingPeopleLogo() }} />
                                                    </> :
                                                    <Upload action={this.onUploadPeople} multiple={false}
                                                        accept={".png,.jpg,.jpeg"} showUploadList={false}>
                                                        <Button icon={<UploadOutlined />}>{Strings.companyPeoplePlaceholder}</Button>
                                                    </Upload>
                                                }
                                            </Form.Item>
                                        </Col>
                                        <Col offset={1}  md={11} lg={11} sm={24} >
                                            <Form.Item name="financials" label={Strings.companyFinancialsTitle}>
                                                {this.state.financials ?
                                                    <>
                                                        <Image width={120} src={this.state.financials.orginalUrl} className="license-image"></Image>
                                                        <CloseCircleOutlined className="delete-icon" onClick={() => { this.removingFinancialsLogo() }} />
                                                    </> :
                                                    <Upload action={this.onUploadFinancials} multiple={false}
                                                        accept={".png,.jpg,.jpeg"} showUploadList={false}>
                                                        <Button icon={<UploadOutlined />}>{Strings.companyFinancialsPlaceholder}</Button>
                                                    </Upload>
                                                }
                                            </Form.Item>
                                        </Col>

                                        {/* <Col offset={1} md={6} lg={6} sm={24} key={this.state.primaryDetails ? this.state.primaryDetails : null}>
                                            <label className="primary-details-label">Primary Details</label>
                                            <Form.List name="primaryDetails" initialValue={this.state.primaryDetails} >
                                                {(fields, { add, remove }) => (
                                                    <>
                                                        {fields.map((field) => (
                                                            <Space
                                                                key={field.key}
                                                                style={{ display: "flex", marginBottom: 8 }}
                                                                align="center"
                                                                className="primary-details-form"
                                                            >
                                                                <Form.Item
                                                                    {...field}
                                                                    name={[field.name, "key"]}
                                                                    fieldKey={[field.fieldKey, "key"]}
                                                                >
                                                                    <Input placeholder="Key" />
                                                                </Form.Item>
                                                                <Form.Item
                                                                    {...field}
                                                                    name={[field.name, "value"]}
                                                                    fieldKey={[field.fieldKey, "value"]}
                                                                >
                                                                    <Input placeholder="Value" />
                                                                </Form.Item>
                                                                <MinusCircleOutlined onClick={() => remove(field.name)} />
                                                            </Space>
                                                        ))}
                                                        <Form.Item>
                                                            <Button
                                                                type="dashed"
                                                                onClick={() => add()}
                                                                block
                                                                icon={<PlusOutlined />}
                                                            >
                                                                Add item
                                                            </Button>
                                                        </Form.Item>
                                                    </>
                                                )}
                                            </Form.List>
                                        </Col> */}



                                        {/* rich text editor */}
                                        <Col offset={1}  md={23} lg={23} sm={23}>
                                            <Form.Item name="overview" label={Strings.overviewTitle}>
                                                <Editor placeholder={Strings.overviewPlaceholder}
                                                    editorState={this.state.editorState1}
                                                    toolbarClassName="toolbarClassName"
                                                    wrapperClassName="wrapperClassName"
                                                    editorClassName="editorClassName"
                                                    onEditorStateChange={this.onEditorStateChange1}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <div className="save-btn-sec">
                                        <Button type="primary" htmlType="submit" className="primary-button">{Strings.saveButtonTitle}</Button>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

//exporting admin company addd/edit 
export default connect(null, { getUserData, uploadImage, addCompany, updateCompany })(AdminCompanyAddEdit)
