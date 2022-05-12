import React, { Component } from "react";
import "antd/dist/antd.css";
import { Loading } from '../../Components';

/* Antd library components */
import { Typography, Input, Form, Button, Row, Col, notification, Tabs, Radio, Space, Select } from "antd";

/* Relative imports */
import { Strings } from "../../Constants/Strings";
import { connect } from "react-redux";
import { login, signUp } from '../../Redux/Crud';
import { UserOutlined, PhoneOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import logo from '../../assets/images/logo.jpg';
import "./LoginRegister.css";
import * as _ from 'lodash';

const { TabPane } = Tabs;
const { Title } = Typography;
const { Option } = Select;
//Declaring the Login component
class Login extends Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      phoneNumberObj: null,
      value: "hello",
      loading: false,
      showPassword: false
    };
    // window.FreshworksWidget('hide')
  }

  // login form submit event
  handleSubmit(values) {
    if (values) {
      // if (this.state.showPassword) {
      this.setState({ loading: true });
      this.props.login(values).then(res => {
        if (res.type === Strings.successType) {
          if (res.data.userType == "1") {
            this.showingMessage('success', Strings.loginSuccessMessage)
            localStorage.setItem('userData', JSON.stringify({
              id: res.data.id,
              accessToken: res.data.accessToken,
            }))
            this.props.history.push('/admin-opportunities')
            this.setState({ loading: false, showPassword: false });
          } else {
            this.showingMessage('success', Strings.loginSuccessMessage)
            localStorage.setItem('userData', JSON.stringify({
              id: res.data.id,
              accessToken: res.data.accessToken,
            }))
            if (res.data.verifyStatus) {
              if (res.data.verifyStatus === 1) {
                //this.props.history.push('/profile');
                this.props.history.push('/dashboard');
              } else if (res.data.verifyStatus === 2) {
                this.props.history.push('/dashboard');
              } else {
                //this.props.history.push("/edit-profile", { fromLogin: true });
                this.props.history.push('/dashboard');
              }
            } else {
              //this.props.history.push("/edit-profile", { fromLogin: true });
              this.props.history.push('/dashboard');
            }
            this.setState({ loading: false, showPassword: false });
          }
        }
        else {
          this.showingMessage('error', res.message);
          this.setState({ loading: false });
        }
      })
      // } else {
      //   this.setState({ showPassword: true });
      // }
    }
  };

  //handling form submit
  handleSignupSubmit(values) {
    this.setState({ loading: true, finalForm: values });
    values.url = window.location.origin;
    values.countryCode = this.state.phoneNumberObj.code;
    console.log(values)
    this.props.signUp(values).then(res => {
      if (res.type == Strings.successType) { 
        this.formRef.current.resetFields();        
        this.props.history.push('/signup-success',{email: values.email});
    //     this.showingMessage(Strings.successType, Strings.signUpSuccessMessage, Strings.signUpTitle)
        this.setState({ loading: false });
      } else {
        this.showingMessage(Strings.errorType, res.message, Strings.signUpTitle)
        this.setState({ loading: false });
      }
    })
  }

  //showing notification message
  showingMessage(type, message) {
    notification[type]({
      description: message,
    });
  }

  onChangeInput(event){
    this.setState({show: false});
    let i = (Strings.countrysList).indexOf(event);
    if(i > -1){
      let obj = Strings.countrysNubesr[i];
      console.log(obj)
      this.setState({phoneNumberObj: obj}, ()=>{
        
    this.setState({show: true});
      })
    }
  }

  render() {
    return (
      <div className="login-register" id="login-register">
        {this.state.loading ? <Loading></Loading> : null}
        <div className="logo-mobile">
          <img src={logo} alt="img" />
        </div>
        {/*---Sign up Section----- */}
        <section className="login-register-section">
          <h1 className="login-register-title-h"> <span className="">Founder</span> Admin </h1>

          <div className="login-register-main">
            <Row
              gutter={[16, 48]}
              justify="center"
              className="login-sec-main"
            >
              <Col xs={24} md={12} lg={12} className="login-sec-main-col">
                <Tabs defaultActiveKey="1" centered>
                  <TabPane tab="Sign in" key="1">
                    <Form initialValues={{ remember: true }} spellCheck="false" layout="horizantal" onFinish={this.handleSubmit.bind(this)}>
                      <div className="form-section-only">
                      
                        <Form.Item
                          name="email"
                          className="label-align"
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
                          />
                        </Form.Item>
                        {/* {this.state.showPassword ? */}
                        <Form.Item
                          className="login-pssword ani-bottom-to-top"
                          name="password"
                          className="label-align"
                          label={Strings.passwordTitle}
                          rules={[
                            {
                              required: true,
                              message: Strings.passwordInputMessage
                            },
                            {
                              min: 8,
                              message: Strings.passwordMinLength,
                            },
                            {
                              max: 16,
                              message: Strings.passwordMaxLength,
                            }
                          ]}
                        >
                          <Input
                            type="password"
                            prefix={<LockOutlined className="" />}
                          />
                        </Form.Item>
                        {/* : null} */}
                        <p className="welcome-text forgot-text" onClick={() => { this.props.history.push('/forgot') }}><a >Forgot password?</a></p>

                      </div>
                      <div className="btn-section">
                        {/* <Button type="primary"  className="login-btn" onClick={() => { this.props.history.push('/holdings')}}>
                              Sign in
                        </Button>    */}
                        <Button type="primary" htmlType="submit" className="login-btn">
                          Sign in
                        </Button>
                      </div>
                    </Form>
                  </TabPane>
                  <TabPane tab="Sign up" key="2">
                    <Form spellCheck="false" layout="horizantal" ref={this.formRef} onFinish={this.handleSignupSubmit.bind(this)}>
                      <Row >

                        <Col xs={24} md={24} lg={24}>
                          {/* ----first name----- */}
                          <Form.Item
                            name="firstName"
                            label={Strings.firstNameTitle}                            
                            normalize={(value) => value.trim()}
                            rules={[
                              {
                                required: true,
                                message: Strings.firstNameInputMessage
                              },
                              {
                                min: 1,
                                message: Strings.firstNameInputMinLengthMessage,
                              },
                              {
                                max: 30,
                                message: Strings.firstNameInputMaxLengthMessage,
                              },
                            ]}
                          >
                            <Input
                              prefix={<UserOutlined className=""/>} 

                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} md={24} lg={24}>
                          <Form.Item
                            name="middleName"
                            label={Strings.middleNameTitle}                       
                            normalize={(value) => value.trim()}
                            rules={[
                              {
                                required: false,
                                message: Strings.middleNameInputMessage
                              },
                              {
                                min: 1,
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

                            />
                          </Form.Item>

                        </Col>
                        <Col xs={24} md={24} lg={24}>
                          <Form.Item
                            name="lastName"
                            label={Strings.lastNameTitle}                       
                            normalize={(value) => value.trim()}
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

                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={24}>
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

                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={24}>
                          <Form.Item
                            name="countryOfResidence"
                            label="Country of Residence"
                            rules={[
                              {
                                required: true,
                                message: "Please Enter Country of Residence"
                              }
                            ]}
                          >
                            {/* <Input
                              prefix={<UserOutlined className="" />}
                            /> */}
                            <Select
                                    showSearch
                                    placeholder="Country of Residence"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    filterSort={(optionA, optionB) =>
                                      optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                    }
                                    onChange={this.onChangeInput.bind(this)}
                                  >
                                    {Strings.countrysList.map((item, index) => {
                                      return <Option key={index} value={item}>{item}</Option>
                                    })}
                                  </Select>
                          </Form.Item>

                        </Col>
                        {/* <Col xs={24} md={24} lg={24}>
                          <Form.Item
                            name="accredited"
                            label="Phone Number"
                            rules={[
                              {
                                required: true,
                                message: "Please Enter Your Number"
                              }
                            ]}
                          >
                            <Input
                              prefix={<UserOutlined className="unalign-input" />}
                            />
                          </Form.Item>

                        </Col> */}
                            {/* <Col sm={24} md={7} lg={7} xsm={24}>
                              <div className="phone-number-login">Phone Number :</div>
                            </Col> */}
                            {/* <div className="country-select-phone"> */}
                              {/* <Col sm={24} md={5} lg={5} xsm={8}>
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
                              </Col> */}
                              <Col sm={24} md={24} lg={24} xs={24}>
                               { this.state.show ? <Form.Item 
                                  className="number-section"
                                  name="phoneNumber"
                                  label="Phone Number"
                                  rules={[
                                    {
                                      required: true,
                                      message: Strings.phoneNumberInputMessage
                                    },
                                    {
                                      pattern: new RegExp("^[0-9]{"+this.state.phoneNumberObj.length+"}$"),
                                      message: "Phone Number must contain "+this.state.phoneNumberObj.length+" digits"
                          
                                    }
                                  ]}
                                >
                                  <Input
                                    prefix={<MailOutlined className="" />}
                                  />
                                </Form.Item> : 
                                  <div />                                                                  
                                }
                              </Col>
                              {/* </div> */}
                        {/* <Row gutter={[16]}  className="city-select mobile-only-login">
                            <Col sm={24} md={6} lg={6} xsm={24}>
                              <div className="phone-number-login">Phone Number :</div>
                            </Col>
                            <div className="country-select-phone">
                              {/* <Col sm={24} md={6} lg={6} xsm={8}>
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
                              <Col sm={24} md={12} lg={12} xsm={16} className="number-inpt">
                                <Form.Item
                                  className="number-section"
                                  name="phoneNumber"
                                  rules={[
                                    {
                                      required: true,
                                      message: Strings.phoneNumberInputMessage
                                    },
                                    {
                                      min: 10,
                                      message: Strings.phoneNumberInputMinLengthMessage,
                                    },
                                    {
                                      max: 10,
                                      message: Strings.phoneNumberInputMinLengthMessage,
                                    }
                                  ]}
                                >
                                  <Input
                                    prefix={<MailOutlined className="" />}
                                  />
                                </Form.Item>
                              </Col>
                              </div>
                              
                        </Row> */}
                      </Row>


                      <div className="btn-section">
                        <Button type="primary" htmlType="submit" className="login-btn">
                          Sign up
                        </Button>
                      </div>

                    </Form>
                  </TabPane>
                </Tabs>

              </Col>
              <Col xs={22} md={12} lg={12} className="login-sec-main-col-img">
                <div className="login-signup-card-text">
                  <div className="">
                    <h2>Founder Admin</h2>
                    <h6>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</h6>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </section>
      </div>
    );
  }
}

// export default Login
export default connect(null, { login, signUp })(Login)

