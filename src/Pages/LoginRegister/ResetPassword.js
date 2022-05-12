import React, { Component } from "react";
import "antd/dist/antd.css";
import { connect } from "react-redux";
import { Loading } from '../../Components';

/* Antd library components */
import { Typography, Input, Form, Button, Row, Col, notification, Tabs, Radio, Space, Select } from "antd";
import { UserOutlined, PhoneOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import { resetUserPassword, getUserByUserEmail, setNewPassword, checkMailLinkExpiry } from '../../Redux/Crud';

import "./LoginRegister.css";
import logo from '../../assets/images/logo.png';
/* Relative imports */
import { Strings } from "../../Constants/Strings";

import "./LoginRegister.css";

const { Title } = Typography;


//Reset Password component declaration
class ResetPassword extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      reset: true,
      userId: null,
      loading: false,
      oldPassword: null,
      email: null,
      data: {}
    }
    // window.FreshworksWidget('hide')
  }

  componentDidMount() {
    if (this.props.location && this.props.location.pathname) {
      let values = this.props.location.pathname.split('&');
      if (values[0] == "/createPassword") {
        if (values[1]) {
          this.state.email = values[1];
          this.state.data = {
            email: values[1]
          }

        }
        if (values[2]) {
          this.state.securityId = values[2];
        }
        this.setState({
          reset: false, email: this.state.email,
          securityId: this.state.securityId,
          data: this.state.data
        })
      } else {
        if (values[1]) {
          this.state.userId = values[1];

        }
        if (values[2]) {
          this.state.oldPassword = values[2];
        }
        if (values[3]) {
          this.state.securityId = values[3];
        }
        if(values[4]){
          this.state.email = values[4];
          this.state.data = {
            email: values[4]
          }

        }
        this.setState({
          email: this.state.email,
          userId: this.state.userId,
          securityId: this.state.securityId,
          oldPassword: this.state.oldPassword,
          data: this.state.data
        })
      }

      if (values[0] == "/createPassword") {
        this.checkUserverification();
      } else {
        this.checkLinkExpiry()
      }
    }
  }


  //check email expiry
  checkLinkExpiry() {
    this.props.checkMailLinkExpiry({
      userId: JSON.parse(this.state.userId),
      generatedValue: JSON.parse(this.state.securityId)
    }).then((res) => {
      if (res.type == Strings.successType) {
      } else {
        this.showingMessage(Strings.errorType, Strings.linkExpiredMessage)
        this.props.history.push("/")
      }
    }, (err) => {
      this.showingMessage(Strings.errorType, Strings.linkExpiredMessage)
      this.props.history.push("/")
    })

  }

  //check user verification
  checkUserverification() {
    this.props.getUserByUserEmail({
      email: this.state.email,
      generatedValue: JSON.parse(this.state.securityId)
    }).then((res) => {
      if (res.type == Strings.successType) {
        this.setState({ userId: res.data });
      } else {
        this.showingMessage(Strings.errorType, Strings.linkExpiredMessage)
        this.props.history.push("/")

      }

    }, (err) => {
      this.showingMessage(Strings.errorType, Strings.linkExpiredMessage)
      this.props.history.push("/")

    })

  }

  // submit data for create passeorrd
  handleSubmit = async (values) => {
    if (values) {
      this.setState({ loading: true });
      if (this.state.reset) {
        let obj = {
          userId: JSON.parse(this.state.userId),
          temporaryPassword: this.state.oldPassword,
          changedPassword: values.password
        }
        this.props.resetUserPassword(obj).then(data => {
          if (data.type == Strings.errorType) {
            this.showingMessage(Strings.errorType, data.message);
            this.setState({ loading: false });
          } else if (data.type == Strings.successType) {
            this.formRef.current.resetFields();
            // this.showingMessage(Strings.successType, data.message)
            localStorage.setItem('userData', JSON.stringify({
              id: data.data.id,
              accessToken: data.data.accessToken,
            }))
            this.props.history.push("/password-success", { verifyStatus: data.data.verifyStatus, userType: data.data.userType });

            // if (data.data.verifyStatus) {
            //   if (data.data.verifyStatus == 1) {
            //     this.props.history.push('/profile');
            //   } else if (data.data.verifyStatus == 2) {
            //     if (data.data.userType == "1") {
            //       this.props.history.push('/admin-opportunities');
            //     } else {
            //       this.props.history.push('/investor-opportunities');
            //     }
            //   } else {
            //     this.props.history.push("/edit-profile", { fromLogin: true });
            //   }
            // } else {
            //   this.props.history.push("/edit-profile", { fromLogin: true });
            // }
            this.setState({ loading: false });
          }
        })
      } else {
        let obj = {
          userId: JSON.parse(this.state.userId),
          password: values.password
        }
        this.props.setNewPassword(obj).then(data => {
          if (data.type == Strings.errorType) {
            this.showingMessage(Strings.errorType, data.message);
            this.setState({ loading: false });
          } else if (data.type == Strings.successType) {
            this.formRef.current.resetFields();
            // this.showingMessage(Strings.successType, data.message)
            localStorage.setItem('userData', JSON.stringify({
              id: data.data.id,
              accessToken: data.data.accessToken,
            }))
            this.props.history.push("/password-success", { verifyStatus: data.data.verifyStatus, userType: data.data.userType });

            // if (data.data.verifyStatus) {
            //   if (data.data.verifyStatus == 1) {
            //     this.props.history.push('/profile');
            //   } else if (data.data.verifyStatus == 2) {
            //     if (data.data.userType == "1") {
            //       this.props.history.push('/admin-opportunities');
            //     } else {
            //       this.props.history.push('/investor-opportunities');
            //     }
            //   } else {
            //     this.props.history.push("/edit-profile", {fromLogin: true});
            //   }
            // } else {
            //   this.props.history.push("/edit-profile", {fromLogin: true});
            // }
            this.setState({ loading: false });
          }
        })

      }
    }
  };

  //showing notification message
  showingMessage(type, message) {
    notification[type]({
      description: message,
    });
  }


  render() {
    return (
      <div className="login-register" id="login-register">
        <div className="logo-mobile">
          <img src={logo} />
        </div>
        <section className="login-register-section">
          <h1 className="login-register-title-h">Choose <span className="">TopShelf</span> today <br />Make The Right Investment</h1>
          <div className="login-register-main">
            <Row gutter={[16, 48]} justify="center" className="login-sec-main" >
              <Col xs={22} md={12} lg={12} className="login-sec-main-col login-sec-main-col-reset">
                <h2 className="reset-password-h">Reset your password</h2>
                {/* {this.state.reset ?
                <Title className="login-register-title">Reset your password</Title> :
                <p className="welcome-text-forgot">Your password must contain a <span className="minimum-label">minimum of 8 characters</span>.</p>} */}
                <Form ref={this.formRef} initialValues={this.state.data} spellCheck="false" layout="vertical" onFinish={this.handleSubmit.bind(this)}>
                  <div className="form-section-only reset-password-form">
                  <Form.Item
                      name="email"
                      label="Email"
                    >
                      <Input          disabled={true}
         placeholder={this.state.email}

                        prefix={<LockOutlined className="" />}

                      />
                    </Form.Item>

                    <Form.Item
                      name="password"
                      label={Strings.newPasswordTitle}
                      rules={[
                        {
                          required: true,
                          message: Strings.newPasswordInputMessage,
                        },
                         {
                           pattern: /^(?!.* )(?=.*[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
                           message: "Password must be at least 8 characters, a digit and a special character -  #?!@$%^&*"
                         }
                      ]}
                    >
                      <Input.Password
                        prefix={<LockOutlined className="" />}

                      />
                    </Form.Item>

                    <Form.Item
                      name="confirmPassword"
                      label={Strings.confirmPasswordTitle}
                      rules={[
                        {
                          required: true,
                          message: Strings.confirmPasswordInputMessage,
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error(Strings.passwordsNotMatchedErrorMessage));
                          },
                        }),
                      ]}
                    >
                      <Input.Password
                        prefix={<LockOutlined className="" />}

                      />
                    </Form.Item>
                    <div className="password-requir">
                      <h4>Password Requirements:</h4>
                      <p>Must contain at least 8 characters (12+ recommended)</p>
                      <p>Must contain at least one uppercase letter</p>
                      <p>Must contain at least one lowercase letter </p>
                      <p>Must contain at least one number</p>
                      <p>Must contain at least one special character</p>
                    </div>
                  </div>
                  <div className="btn-section">
                    <Button type="primary" htmlType="submit" className="login-btn"> {Strings.loginButtonTitle}</Button>
                  </div>
                </Form>
                {/* <p className="forgot-hint">Resetting your password signifles that you have read and agreed o our Terms of Services and Privacy Policy</p> */}
              </Col>
              <Col xs={22} md={12} lg={12} className="login-sec-main-col-img">
                <div className="login-signup-card-text">
                  <div className="">
                    <h2>Discover Opportunities and<br />Track your holdings.</h2>
                    <h6>Explore the best investment opportunities.</h6>
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

//methods calling from this component & exporting component
export default connect(null, { resetUserPassword, getUserByUserEmail, setNewPassword, checkMailLinkExpiry })(ResetPassword);
