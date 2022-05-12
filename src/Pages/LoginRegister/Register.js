import React, { Component } from "react";
import "antd/dist/antd.css";
import { Loading } from '../../Components';

/* Antd library components */
import { Typography, Input, Form, Button, Row, Col, notification, Select, Checkbox, Space, Radio } from "antd";

/* Relative imports */
import {
  GooglePlusOutlined,
  FacebookOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  LockOutlined,
} from "@ant-design/icons";
import logo from '../../assets/images/logo.png';
import "./LoginRegister.css";
import { Strings } from "../../Constants/Strings";
import { connect } from "react-redux";
import { signUp } from '../../Redux/Crud';

const { Title } = Typography;
const { Option } = Select;
//Declaring the register component
class Register extends Component {

  formRef = React.createRef();
  formRef1 = React.createRef();

  constructor(props) {
    super(props);

    this.state = {
      value: "hello",
      showSection: 1,
      loading: false,
      showOtp: false,
      countryCodeList: Strings.countryCodeList,
      intialForm: null,
      finalForm: null
    };
    // window.FreshworksWidget('hide')
  }

  componentDidMount() {
    this.setState({ showSection: 1 })
  }

  //handling form submit
  handleSubmit(values) {
    this.setState({ loading: true, finalForm: values });
    let obj ={
      ...values,
      ...this.state.intialForm
    };
    delete obj['agreement'];
    console.log(obj)
    this.props.signUp(obj).then(res => {
      if (res.type == Strings.successType) {
        this.props.history.push('/');
        this.showingMessage(Strings.successType, Strings.signUpSuccessMessage, Strings.signUpTitle)
        this.setState({ loading: false });
      } else {
        this.showingMessage(Strings.errorType, res.message, Strings.signUpTitle)
        this.setState({ loading: false });
      }
    })
  }

  handleNext(values) {
    console.log(values)
    this.setState({ showSection: 2, intialForm: values })
  }

  handleBack() {
    this.setState({ showSection: 1 })
  }

  //showing notification message
  showingMessage(type, message, title) {
    notification[type]({
      description: message,
    });
  }


  render() {
    return (
      // -------Sign Up page-------//
      <div className="login-register" id="signup-register">
        {this.state.loading ? <Loading></Loading> : null}
        <div className="logo-mobile">
          <img src={logo} />
        </div>
        {/*---Sign up Section----- */}
        <section>
          <Row
            gutter={[16, 48]}
            justify="center"
            className="login-register-main"
          >
            <div className="login-sec-main">
              <Title className="login-register-title">Signup</Title>
              <h2 className="create-label">Create Your TopShelf Account</h2>
              {this.state.showSection && this.state.showSection == 1 ? <section>
                <Form spellCheck="false" layout="vertical" initialValues={this.state.intialForm} ref={this.formRef} onFinish={this.handleNext.bind(this)}>
                  <Row>
                    <Col xs={24} md={12} lg={12}>
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
                    <Col xs={22} md={12} lg={12} className="first-name-sec">
                      {/* ----first name----- */}
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
                          prefix={<UserOutlined className="" />}
                          placeholder={Strings.firstNamePlaceholder}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[16]} justify="center" className="fname-row">
                   
                    <Col xs={24} md={12} lg={12}>
                      <Form.Item
                        name="middleName"
                        label={Strings.middleNameTitle}
                        rules={[
                          {
                            required: false,
                            message: Strings.middleNameInputMessage
                          },
                          {
                            min: 3,
                            message: Strings.middleNameInputMinLengthMessage,
                          },
                          {
                            max: 30,
                            message: Strings.middleNameInputMaxLengthMessage,
                          },
                        ]}
                      >
                        <Input
                          prefix={<UserOutlined className="" />}
                          placeholder={Strings.middleNamePlaceholder}
                        />
                      </Form.Item>

                    </Col>
                    <Col xs={24} md={12} lg={12}>
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
                          prefix={<UserOutlined className="" />}
                          placeholder={Strings.lastNamePlaceholder}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

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
                        <Input
                          prefix={<UserOutlined className="unalign-input" />}
                          placeholder="Accredited"
                        />
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
                    <Col offset="12" sm={24} md={12} lg={12}>
                      <Button type="primary" htmlType="submit" className="signup-btn">
                        Next
                      </Button>
                    </Col>
                  </Row>

                </Form>
              </section> : null}
              {this.state.showSection && this.state.showSection == 2 ? <section>
                <Form spellCheck="false" layout="vertical" initialValues={this.state.finalForm} ref={this.formRef1} onFinish={this.handleSubmit.bind(this)}>
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
                        <Input
                          prefix={<UserOutlined className="" />}
                          placeholder="Intend To Invest"
                        />
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
                        <Input
                          prefix={<UserOutlined className="" />}
                          placeholder="Percentage"
                        />
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
                        <Input
                          prefix={<UserOutlined className="" />}
                          placeholder="About Your Investment in Past 12 Months"
                        />
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
                        <Input
                          prefix={<UserOutlined className="" />}
                          placeholder="About Your Investment in Next 12 Months"
                        />
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
                          </Space>
                        </Radio.Group>

                      </Form.Item>

                    </Col>

                  </Row>

                  <Row gutter={[16]} justify="center">
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

                    <Col xs={24} md={12} lg={12} className="signup-check-box">
                      <Form.Item
                        name="agreement"
                        valuePropName="checked"
                        rules={[
                          {
                            validator: (_, value) =>
                              value ? Promise.resolve() : Promise.reject(new Error('Please accept the Privacy Policy')),
                          },
                        ]}
                      >
                        <Checkbox>
                          <label className="privacy-label">I accept the TopShelf <a href="#" className="terms-link">Terms of Use</a>, <a href="#" className="terms-link">Privacy Policy</a>, and <a href="#" className="terms-link">Further Disclosures</a></label>
                        </Checkbox>
                      </Form.Item>
                    </Col>
                  </Row>


                  <Row gutter={[16]} justify="center">
                    <Col offset="12" sm={24} md={12} lg={12}>
                      <Button type="primary" className="signup-back-btn" onClick={() => { this.handleBack() }}>Back</Button>
                      <Button type="primary" htmlType="submit" className="signup-btn">
                        {this.state.showOtp ? Strings.signUpButtonTitle : Strings.sendOtpButtonTitle}
                      </Button>
                    </Col>
                  </Row>

                </Form>
              </section> : null}
            </div>
          </Row>
        </section>
      </div >
    );
  }
}

export default connect(null, { signUp })(Register);
