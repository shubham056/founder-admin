import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateQuestionnaire, addNewQuestionnaire, getUserDataLean, getLatestQuestionnaire, getAllQuestionsByFilters } from '../../Redux/Crud';
import { Strings } from '../../Constants/Strings';
import { AppHeader, Loading, Footer } from '../../Components';
import { Row, Col, Radio, Input, Form, Button, Dropdown, Menu, Upload, message, Select, notification, Image, Checkbox, Space } from 'antd';
import { CloseCircleOutlined, FilePdfFilled, MailOutlined, UploadOutlined, UserOutlined } from "@ant-design/icons";

import camera from "../../assets/images/camera.png";
import moment from 'moment';


const { Option } = Select;

class LegelData extends Component {
    formRef = React.createRef();
    constructor(props) {
        super(props)

        this.state = {
            oldId: null,
            loading: false,
            finaluser: null,
            user: null,
            actualUser: null,
            hideHeader: false,
            disableCheckBox: false,
            checkBoxStatus: false,
            mailingFormDisable: false,
            showMailingSelect: false,
            showPrimarySelect: false,
            fromLogin: false,
            q1List: [],
            q2List: [],
            q3List: [],
            q4List: [],
            q5List: [],
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.getQuestionsByFilters(1);
        this.getQuestionsByFilters(2);
        this.getQuestionsByFilters(3);
        this.getQuestionsByFilters(4);
        this.getQuestionsByFilters(5);
        this.getUserDetails();
    }

    //getting user data
    getUserDetails() {
        if (localStorage.getItem('userData')) {
            let user = JSON.parse(localStorage.getItem('userData'));
            this.props.getUserDataLean(user.id).then(res => {
                if (res.type == Strings.successType) {
                    console.log(res)
                    this.setState({
                        finaluser: res.data
                    });
                    // this.bindValues(res.data)

                } else {
                    // localStorage.clear();
                    // this.props.history.push('/');
                }
            })
            this.props.getLatestQuestionnaire(user.id)
                .then(res => {
                    if (res.type == Strings.successType) {
                        console.log(res)
                        this.setState({
                            oldId: res.data.id
                        });
                        this.bindValues(res.data)

                    } else {
                        // localStorage.clear();
                        // this.props.history.push('/');
                    }
                })
        } else {
            localStorage.clear();
            this.props.history.push('/');
        }
    }

    getQuestionsByFilters(id) {
        this.props.getAllQuestionsByFilters({
            questionId: id
        }).then(res => {
            if (res.type == Strings.successType) {
                if (id == 1) {
                    this.state.q1List = res.data;
                    this.setState({
                        q1List: this.state.q1List
                    });
                }
                if (id == 2) {
                    this.state.q2List = res.data;
                    this.setState({
                        q2List: this.state.q2List
                    });
                }
                if (id == 3) {
                    this.state.q3List = res.data;
                    this.setState({
                        q3List: this.state.q3List
                    });
                }
                if (id == 4) {
                    this.state.q4List = res.data;
                    this.setState({
                        q4List: this.state.q4List
                    });
                }
                if (id == 5) {
                    this.state.q5List = res.data;
                    this.setState({
                        q5List: this.state.q5List
                    });
                }
            } else {
            }
        })
    }

    //bind user data in form
    bindValues(user) {
        let obj = {
            countryOfResidence: user.countryOfResidence ? user.countryOfResidence : "",
            accredited: user.accredited ? user.accredited : "",
            investmentStrategy: user.investmentStrategy ? user.investmentStrategy : "",
            intendToInvest: user.intendToInvest ? user.intendToInvest : "",
            percentage: user.percentage ? user.percentage : "",
            goals: user.goals ? user.goals : "",
            linkedInProfile: user.linkedInProfile ? user.linkedInProfile : "",
            experience: user.experience ? user.experience : "",
            past12Months: user.past12Months ? user.past12Months : "",
            next12Months: user.next12Months ? user.next12Months : "",
            experienceWorking: user.experienceWorking ? user.experienceWorking : "",
            aboutInvestment: user.aboutInvestment ? user.aboutInvestment : "",

        }
        this.setState({
            user: obj
        })
    }

    //handling form submit
    handleSubmit(values) {
        this.setState({ loading: true });
        let user = JSON.parse(localStorage.getItem('userData'));
        let obj = values;
        obj.userId = user.id;
        this.props.addNewQuestionnaire(obj).then(res => {
            if (res.type == Strings.successType) {
                this.props.updateQuestionnaire({ id: this.state.oldId, data: { endDate: new Date().toISOString() } })
                this.showingMessage(Strings.successType, res.message, Strings.profileTitle);
                this.bindValues(res.data);
                // this.props.history.push('/profile');                    
                this.props.history.push('/profile', { step: 0 })
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


    // cancle the entity
    handleCancel() {
        // this.state.actualUser.isProfileDetailsFilled = true;
        // this.setState({ actualUser: this.state.actualUser });
        // this.props.history.push('/profile');

        this.props.history.push('/profile', { step: 0 })
    }

    render() {
        return (
            <div className="edit-profile-sec-main">
                <div className="profile-main" key={this.state.user ? this.state.user : null} id="profile-main-section">
                    {this.state.loading ? <Loading></Loading> : null}
                    <div className="header-main" key={this.state.finaluser ? this.state.finaluser : null}>
                        <AppHeader history={this.props.history} user={this.state.finaluser} />
                    </div>
                    <div className="container">
                        <h1 className="page-main-heading">Investor's Eligibility Questionnaire</h1>
                        <div className="profile-section legal-profile-section" >
                            <Form layout="vertical" className="legal-profile-section-form" initialValues={this.state.user} onFinish={this.handleSubmit.bind(this)} ref={this.formRef} >
                                <Row gutter={[16]} justify="center">
                                    <Col xs={24} md={12} lg={12}>
                                        <Form.Item
                                            name="countryOfResidence"
                                            label="Country of Residence/Principal Country of Business"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please Enter Country of Residence"
                                                }
                                            ]}
                                        >
                                            <Input
                                                prefix={<UserOutlined className="" />}
                                                placeholder="Country of Residence"
                                            />
                                        </Form.Item>

                                    </Col>
                                    <Col xs={24} md={12} lg={12}>
                                        <Form.Item
                                            name="accredited"
                                            label="How are you accredited?"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please Enter Accredited"
                                                }
                                            ]}
                                        >

                                            <Select placeholder="Accredited">
                                                {this.state.q1List.map((item, index) => {
                                                    return <Option value={item.optionText} key={index}>{item.optionText}</Option>
                                                })}
                                            </Select>
                                            {/* <Input
                                                prefix={<UserOutlined className="unalign-input" />}
                                                placeholder="Accredited"
                                            /> */}
                                        </Form.Item>

                                    </Col>
                                </Row>


                                <Row gutter={[16]}>
                                    <Col xs={24} md={12} lg={12}>
                                        <Form.Item
                                            name="investmentStrategy"
                                            label="Which Investment Strategy Suits your preferences?"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please Select Investment Strategy"
                                                }
                                            ]}
                                        >
                                            <Radio.Group >
                                                <Space direction="vertical">
                                                    <Radio value="SPV">SPV</Radio>
                                                    <Radio value="Fund">Fund</Radio>
                                                    <Radio value="Mix">Mix</Radio>
                                                </Space>
                                            </Radio.Group>

                                        </Form.Item>

                                    </Col>
                                </Row>
                                <Row gutter={[16]} justify="center">
                                    <Col xs={24} md={12} lg={12}>
                                        <Form.Item
                                            name="intendToInvest"
                                            label="How much do you intend to invest with TS over the next 12 months?
                        "
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please Enter Intend To Invest"
                                                }
                                            ]}
                                        >
                                            <Select placeholder="Intend To Invest">
                                                {this.state.q2List.map((item, index) => {
                                                    return <Option value={item.optionText} key={index}>{item.optionText}</Option>
                                                })}
                                            </Select>
                                            {/* <Input
                                                prefix={<UserOutlined className="" />}
                                                placeholder="Intend To Invest"
                                            /> */}
                                        </Form.Item>

                                    </Col>
                                    <Col xs={24} md={12} lg={12}>
                                        <Form.Item
                                            name="percentage"
                                            label="What percentage of your net worth will you invest in [startups/pre-ipo/etc.]"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please Enter Percentage"
                                                }
                                            ]}
                                        >
                                            <Select placeholder="Percentage">
                                                {this.state.q3List.map((item, index) => {
                                                    return <Option value={item.optionText} key={index}>{item.optionText}</Option>
                                                })}
                                            </Select>
                                            {/* <Input
                                                prefix={<UserOutlined className="" />}
                                                placeholder="Percentage"
                                            /> */}
                                        </Form.Item>

                                    </Col>

                                </Row>

                                <Row gutter={[16]} justify="center">
                                    <Col xs={24} md={12} lg={12}>
                                        <Form.Item
                                            name="goals"
                                            label="What are your goals by joining TS"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please Select Goals"
                                                }
                                            ]}
                                        >
                                            <Radio.Group >
                                                <Space direction="vertical">
                                                    <Radio value="Accessing deal flow">Accessing deal flow</Radio>
                                                </Space>
                                            </Radio.Group>

                                        </Form.Item>

                                    </Col>
                                    <Col xs={24} md={12} lg={12}>
                                        <Form.Item
                                            name="linkedInProfile"
                                            label="LinkedIn Profile"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please Enter LinkedIn Profile"
                                                }
                                            ]}
                                        >
                                            <Input
                                                prefix={<UserOutlined className="" />}
                                                placeholder="LinkedIn Profile"
                                            />
                                        </Form.Item>

                                    </Col>

                                </Row>
                                <Row gutter={[16]} justify="center">
                                    <Col xs={24} md={12} lg={12}>
                                        <Form.Item
                                            name="experience"
                                            label="Experience in the private securities markets"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please Select Experience"
                                                }
                                            ]}
                                        >
                                            <Radio.Group >
                                                <Space direction="vertical">
                                                    <Radio value="I invested directly in early stage startups or through an SPV">I invested directly in early stage startups or through an SPV</Radio>
                                                    <Radio value="I have invested in Venture Capital funds">I have invested in Venture Capital funds </Radio>
                                                    <Radio value="I have invested in pre-IPO Funds">I have invested in pre-IPO Funds </Radio>
                                                    <Radio value="I have invested (either directly or through a fund or SPV) in Series C and later rounds">I have invested (either directly or through a fund or SPV) in Series C and later rounds</Radio>
                                                    <Radio value="I work at a vc or PE firm">I work at a vc or PE firm </Radio>
                                                    <Radio value="I represent a family office or registered investment adviser">I represent a family office or registered investment adviser </Radio>
                                                    <Radio value="None">None</Radio>

                                                </Space>
                                            </Radio.Group>

                                        </Form.Item>

                                    </Col>
                                    <Col xs={24} md={12} lg={12}>
                                        <Form.Item
                                            name="past12Months"
                                            label="How many investments in any of the above have you made in the past 12 months?"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please Enter About Your Investment in Past 12 Months"
                                                }
                                            ]}
                                        >
                                            <Select placeholder="About Your Investment in Past 12 Months">
                                                {this.state.q4List.map((item, index) => {
                                                    return <Option value={item.optionText} key={index}>{item.optionText}</Option>
                                                })}
                                            </Select>
                                            {/* <Input
                                                prefix={<UserOutlined className="" />}
                                                placeholder="About Your Investment in Past 12 Months"
                                            /> */}
                                        </Form.Item>

                                    </Col>

                                </Row>

                                <Row gutter={[16]} justify="center">
                                    <Col xs={24} md={12} lg={12}>
                                        <Form.Item
                                            name="next12Months"
                                            label="How many investments in the above do you expect to make in the next 12 months?"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please Enter About Your Investment in Next 12 Months"
                                                }
                                            ]}
                                        >
                                            <Select placeholder="About Your Investment in Next 12 Months">
                                                {this.state.q5List.map((item, index) => {
                                                    return <Option value={item.optionText} key={index}>{item.optionText}</Option>
                                                })}
                                            </Select>
                                            {/* <Input
                                                prefix={<UserOutlined className="" />}
                                                placeholder="About Your Investment in Next 12 Months"
                                            /> */}
                                        </Form.Item>

                                    </Col>

                                    <Col xs={24} md={12} lg={12}>
                                        <Form.Item
                                            name="experienceWorking"
                                            label="Do you have experience working at or with a startup or tech company?
                        "
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please Select Experience Working"
                                                }
                                            ]}
                                        >
                                            <Radio.Group >
                                                <Space direction="vertical">
                                                    <Radio value="I am a founder">I am a founder</Radio>
                                                    <Radio value="I have worked at a startup or tech company">I have worked at a startup or tech company</Radio>
                                                    <Radio value="I have been on the board of a startup or tech company">I have been on the board of a startup or tech company</Radio>
                                                    <Radio value="I have been an adviser to a startup or tech company">I have been an adviser to a startup or tech company</Radio>
                                                    <Radio value="None">None</Radio>
                                                </Space>
                                            </Radio.Group>

                                        </Form.Item>

                                    </Col>

                                </Row>

                                <Row gutter={[16]}>
                                    <Col xs={24} md={12} lg={12}>
                                        <Form.Item
                                            name="aboutInvestment"
                                            label="Is there anything else we should know about your investment experience to help review and approve your application?"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please Enter About Your Investment"
                                                }
                                            ]}
                                        >
                                            <Input
                                                prefix={<UserOutlined className="" />}
                                                placeholder="About Your Investment"
                                            />
                                        </Form.Item>

                                    </Col>
                                </Row>

                                <div className="save-btn-sec">

                                    {this.state.fromLogin ? null : <Button type="primary" onClick={() => { this.handleCancel() }} className="cancel-button">Cancel</Button>}
                                    <Button type="primary" htmlType="submit" className="primary-button">{Strings.saveButtonTitle}</Button>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
                 <Footer history={this.props.history} />
            </div>
        )
    }

}
export default connect(null, { updateQuestionnaire, addNewQuestionnaire, getUserDataLean, getLatestQuestionnaire, getAllQuestionsByFilters })(LegelData)

