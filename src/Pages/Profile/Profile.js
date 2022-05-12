import React, { Component } from 'react'
import { Row, Col, Radio, Input, Form, Button, Dropdown, Menu, Upload, Popover, Select, notification, Image, Checkbox, Tabs, Breadcrumb, Steps, Table, Space } from 'antd';
import { CloseCircleOutlined, FilePdfFilled, MailOutlined, UploadOutlined, AddOutlined, PlusCircleOutlined, EditOutlined, InfoCircleFilled } from "@ant-design/icons";

import { AppHeader, Loading, AddEntity, JointInvestors, Footer } from '../../Components';
import successProfile from '../../assets/images/successProfile.png';
import editIcon from '../../assets/images/editIcon.png';
import errorProfile from '../../assets/images/errorProfile.png';
import headerProfile from '../../assets/images/headerProfile.png';
import userImage from '../../assets/images/userImage.png';
import '../../App.css';
import './Profile.css';
import '../InvesterIndividual/InvesterIndividual.css';
import { connect } from 'react-redux';
import { Strings } from '../../Constants/Strings';
import { updateProfile, getUserData, getUserDataProfile, getUserDataLean, uploadImage, uploadSecureFiles, getSignedUrls, getUserDocuments } from '../../Redux/Crud';
import MaskedInput from 'antd-mask-input';
import Persona from 'persona';


const { Option } = Select;

const { TabPane } = Tabs;


const { Step } = Steps;
class Profile extends Component {
    formRef = React.createRef();
    formRef1 = React.createRef();

    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            user: null,
            actualUser: null,
            profilePicture: null,
            hideHeader: false,
            disableCheckBox: false,
            checkBoxStatus: false,
            mailingFormDisable: false,
            showMailingSelect: false,
            showPrimarySelect: false,
            step: 0,
            taxIdentificationForm: null,
            documentsList: []
        }
    }


    componentDidMount() {
        window.scrollTo(0, 0);
        if (this.props.location.state && this.props.location.state.hideHeader) {
            this.setState({ hideHeader: false })
        }
        if (this.props.location.state && this.props.location.state.step) {
            this.setState({ step: this.props.location.state.step })
        }
        this.getUserDetails()
    }

    //getting user data
    getUserDetails() {
        if (localStorage.getItem('userData')) {
            let user = JSON.parse(localStorage.getItem('userData'));
            this.props.getUserDataProfile(user.id)
                .then(res => {
                    if (res.type == Strings.successType) {
                        this.setState({
                            profilePicture: res.data.profilePicture,
                            taxIdentificationForm: res.data.taxIdentificationForm,
                            actualUser: res.data
                        });
                        this.getdocumentsList();
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

    // get user documents
    getdocumentsList() {
        let user = JSON.parse(localStorage.getItem('userData'));
        this.props.getUserDocuments({
            userId: user.id
        }).then((res) => {
            if (res.type == Strings.successType) {
                if (res.data && res.data.data) {
                    this.setState({ documentsList: res.data.data });
                } else {
                    this.setState({ documentsList: [] });
                }
            } else {
                this.setState({ documentsList: [] });
            }
        })
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
            userType: user.userType,
            id: user.id,
            idProofType: user.idProofType
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

    // upload formw9 file
    onUploadW9 = (info) => {
        console.log(this.formRef1.current.getFieldValue("taxIdentificationType"));
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

    // remove w9form
    removeW9Form() {
        this.setState({
            taxIdentificationForm: null
        });
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

    //showing notification message
    showingMessage(type, message, title) {
        notification[type]({
            description: message,
        });
    }

    //handling form submit
    handleSubmit(values) {
        this.setState({ loading: true });
        let user = JSON.parse(localStorage.getItem('userData'));
        let obj = {
        }
        if (this.state.taxIdentificationForm) {
            obj.taxIdentificationType = values.taxIdentificationType;
            obj.taxIdentificationForm = this.state.taxIdentificationForm;
        }
        this.props.updateProfile({ userId: user.id, data: obj }).then(res => {
            if (res.type == Strings.successType) {
                this.showingMessage(Strings.successType, res.message, Strings.profileTitle);
                this.bindValues(res.data);
                // if (this.state.fromLogin) {
                //     this.props.history.push('/verify');
                // } else {
                this.props.history.push('/profile');
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

    handleDocuments(val) {
        this.setState({ loading: true });
        this.props.getSignedUrls({
            key: val,
            from: "documents"
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

        const columns = [
            {
                title: 'Document Name',
                key: 'id',
                render: (text, record) => {
                    // return record.documentPath
                    if (record.documentPath) {
                        let value = record.documentPath.split("/")
                        return value[value.length - 1]
                    }
                }
            },
            {
                title: 'Action',
                key: 'action',
                render: (text, record) => (
                    <Space size="middle" onClick={() => { this.handleDocuments(record.documentPath) }}>
                        {/* <a>Invite {record.name}</a> */}
                        <a>Download</a>
                    </Space>
                ),
            },
            {
                title: 'Document Type',
                key: 'id',
                render: (text, record) => {
                    // return record.documentPath
                    if (record.documentPath) {
                        let value = record.documentPath.split("/")
                        if (value.documentPath) {
                            let value2 = value.documentPath.split("_")
                            return value2[value2.length - 1]

                        }
                    }
                }
            },

        ]

        const data = [
            {
                key: '1',
                name: 'W3 FORM',
            },
            {
                key: '2',
                name: 'Driving License',
            },
            {
                key: '3',
                name: 'TAX FORM',
            },
        ]
        const content = (
            <div className="profile-logout-main">
                <p>By law it is required that we verify your identity to do any transactions with us. We will take you to a 3rd party service to verify. <span className="span-success" onClick={() => { this.props.history.push('/verify') }}>Please click here</span> to start the process. It will take 1-2 minutes.</p>
            </div>
        );
        return (

            <div className="profile-main" key={this.state.user ? this.state.user : null} id="profile-main-section">
                {this.state.loading ? <Loading></Loading> : null}
                <div className="header-main" key={this.state.user ? this.state.user : null}>
                    <AppHeader history={this.props.history} user={this.state.actualUser} />
                </div>
                <div className="container">
                    <h1 className="login-register-title-h profile-title-h">Hello <span className="">{this.state.user ? (this.state.user.firstName + " " + this.state.user.lastName) : null}</span><br />Make The Right Investment</h1>

                    <Breadcrumb separator=">">
                        <Breadcrumb.Item >Account  {`/`} </Breadcrumb.Item>
                        {this.state.step == 0 ?
                            <span >Personal details</span> : null}
                        {this.state.step == 1 ?
                            <span>Documents</span> : null}
                        {this.state.step == 2 ?
                            <span>Entities</span> : null}
                    </Breadcrumb>

                    <h1 className="page-main-heading">Profile </h1>
                    <Row gutter={[16]} className="invest-main-row-sec" justify="center">
                        <Col sm={24} md={14} lg={19}>
                            <div>
                                <div className="document-type-card">
                                    <div className="card-main" id="steps-investor-individual">
                                        <Steps size="small" type="navigation"
                                            current={this.state.step}  >
                                            <Step title="Personal details" onClick={() => { this.setState({ step: 0 }) }} value={0} />
                                            <Step title="Documents" onClick={() => { this.setState({ step: 1 }) }} value={1} />
                                            <Step title="Entities" onClick={() => { this.setState({ step: 2 }) }} value={2} />
                                        </Steps>
                                        {this.state.step == 0 ?
                                            <>
                                                <div className="profile-card">
                                                    <h1 className="dummy">hai</h1>
                                                    {this.state.actualUser && this.state.actualUser.firstName ? <>

                                                        <div className={this.state.actualUser.verifyStatus == 2 ? 'profile-box' : 'profile-unBox'} key={this.state.actualUser ? this.state.actualUser : null}>
                                                            {/* {this.state.actualUser && this.state.actualUser.profilePicture && this.state.actualUser.profilePicture.orginalUrl ? <img src={this.state.actualUser.profilePicture.orginalUrl} className="profile-pic-img" />
                                                                :
                                                                <img src={userImage} className="profile-pic-img" />}

                                                            {this.state.actualUser.verifyStatus ==2 ? <img src={successProfile} className="profile-success" /> :
                                                            null
                                                                 <Popover content={content} className="user-popover" placement="leftTop">
                                                                    <img src={errorProfile} className="profile-success" />
                                                                </Popover>
                                                                } */}
                                                            <div className="eidt-section">
                                                                {/* <div onClick={() => { this.props.history.push('/basic-info') }} className="label-info">Legal Info</div> */}
                                                                <img src={editIcon} onClick={() => {
                                                                    this.props.history.push('/edit-profile');
                                                                }} className="edit-icon" />
                                                            </div>
                                                            <div className="basic-sec">
                                                                <div className="investor-name"> {this.state.actualUser.firstName} {this.state.actualUser.middleName} {this.state.actualUser.lastName}</div>

                                                                <div className="investor-email">{this.state.actualUser.email}</div>

                                                                <div>{this.state.actualUser.countryCode + " " + this.state.actualUser.phoneNumber}</div>
                                                            </div>
                                                            <Row gutter={[16]} className="primary-details" justify='center'>
                                                                <Col sm={24} md={12} lg={12}>
                                                                    <div className="parimary-address-label"> Address</div>
                                                                    <div className="security-section">
                                                                        <label>{this.state.actualUser.primaryAddress.streetOne},
                                                                            {this.state.actualUser.primaryAddress.streetTwo ? this.state.actualUser.primaryAddress.streetTwo + "," : null}</label>

                                                                        <label> {this.state.actualUser.primaryAddress.city}, {this.state.actualUser.primaryAddress.state}, {this.state.actualUser.primaryAddress.country}:{this.state.actualUser.primaryAddress.zipcode}

                                                                        </label>
                                                                    </div>
                                                                </Col>
                                                                {/* <Col sm={24} md={12} lg={12}>
                                                                    {this.state.actualUser.mailingAddressIsDifferAsPrimary ?
                                                                        <>
                                                                            <div className="parimary-address-label">Mailing Address</div>
                                                                            <div className="security-section">
                                                                                <label>{this.state.actualUser.mailingAddress.country}, {this.state.actualUser.mailingAddress.state}, {this.state.actualUser.mailingAddress.streetOne}
                                                                                    {this.state.actualUser.mailingAddress.streetTwo ?
                                                                                        <label> {this.state.actualUser.mailingAddress.streetTwo}, {this.state.actualUser.mailingAddress.city}, {this.state.actualUser.mailingAddress.zipcode}</label>
                                                                                        : null}
                                                                                </label>
                                                                            </div>
                                                                        </>
                                                                        : null
                                                                    }
                                                                </Col> */}
                                                            </Row>

                                                        </div>
                                                        <div onClick={() => { this.props.history.push('/basic-info') }} className="legal-info">
                                                            Investor Eligibility Questionnaire
                                                        </div>
                                                        <div className="joint-investor">
                                                            <JointInvestors user={this.state.actualUser} history={this.props.history} />


                                                        </div>

                                                    </> : null}

                                                </div>
                                            </>
                                            : null
                                        }
                                        {this.state.step == 1 ?
                                            <>
                                                <Form layout="horizantal" className="documents-form-profile" initialValues={this.state.actualUser} ref={this.formRef1} onFinish={this.handleSubmit.bind(this)} >

                                                    <Row gutter={[16]} className="documents-row">
                                                        {/* <Col sm={24} md={12} lg={12} xsm={24} className="id-select">
                                                            <Form.Item
                                                                name="taxIdentificationType"
                                                                label="Tax Form Type"
                                                                rules={[
                                                                    {
                                                                        required: true,
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
                                                                            required: true,
                                                                            message: Strings.uploadw9InputMessage,
                                                                        },
                                                                    ]}
                                                                >
                                                                    <Upload action={this.onUploadW9} multiple={false}
                                                                        accept={".pdf"} showUploadList={false}>
                                                                        <Button icon={<UploadOutlined />}>{Strings.uploadw9Title}</Button>
                                                                    </Upload>
                                                                </Form.Item>}
                                                        </Col> */}
                                                        {/* <p className="no-documents">Documents Will be added soon.</p> */}
                                                        <Table columns={columns} dataSource={this.state.documentsList} />
                                                    </Row>
                                                    {/* <div className="save-btn-sec">

                                                        <Button type="primary" htmlType="submit" className="primary-button">{Strings.saveButtonTitle}</Button>
                                                    </div> */}
                                                </Form>
                                            </>
                                            : null
                                        }
                                        {this.state.step == 2 ?
                                            <>
                                                <div className="joint-investor">
                                                    <AddEntity user={this.state.actualUser} history={this.props.history} />
                                                </div>
                                            </>
                                            : null
                                        }
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col sm={24} md={10} lg={5} className="kyc-col">
                            {/* {this.state.actualUser && this.state.actualUser.verifyStatus != 2 ?
                            <div className="kyc-sec" >
                                <InfoCircleFilled />
                                <h4>Just a few minutes away!</h4>
                                <p>
                                    By law it is required that we are verify your identity to do any transactions with us.
                                    we will take you to a 3rd party service for verification.
                                </p>
                                <Button className="primary-button" onClick={() => { this.props.history.push('/verify') }}>START KYC</Button>
                            </div> : null} */}
                            {this.state.actualUser && this.state.actualUser.verifyStatus != 2 ?
                                <div className="kyc-sec" >

                                    <p>
                                        TopShelf team will get back to you with verification steps
                                    </p>
                                </div> : null}
                        </Col>
                    </Row>
                </div >
                 <Footer history={this.props.history} />
            </div >
        )
    }
}

//in this state we have all data which disptched functions called & mapping to props
const mapStateToProps = state => {
    return {
        user: state.investors.loggedUserDetails ? state.investors.loggedUserDetails : {},
    }
};

//exporting profile page
export default connect(mapStateToProps, { updateProfile, getUserData, uploadImage, uploadSecureFiles, getSignedUrls, getUserDocuments,getUserDataProfile })(Profile);
