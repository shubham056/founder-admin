import React, { Component } from "react";
import "antd/dist/antd.css";
import { Loading } from '../../Components';

/* Antd library components */
import { Typography, Input, Form, Button, Row, Col, notification, Tabs, Radio, Space, Select } from "antd";


import { UserOutlined, PhoneOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import logo from '../../assets/images/logo.png';
import "./LoginRegister.css";
import { Strings } from "../../Constants/Strings";
import { connect } from "react-redux";
import { forgotPassword } from '../../Redux/Crud';


import "./LoginRegister.css";

const { Title } = Typography;

//Declaring the StageModel component
class ForgotPassword extends Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      value: "hello",
    };
    // window.FreshworksWidget('hide')
  }

  // forgot password form submit event
  handleSubmit(values) {
    if (values) {
      this.setState({ loading: true });
      this.props.forgotPassword({ email: values.email, url: window.location.origin }).then(res => {
        if (true) {
      //  if (res.type == Strings.successType) {
          
          this.formRef.current.resetFields();
          // this.showingMessage(Strings.successType, res.message, Strings.signUpTitle)
          this.props.history.push('/forgot-password-success',{ email: values.email });
          this.setState({ loading: false });
        } else {
          this.showingMessage(Strings.errorType, res.message, Strings.signUpTitle)
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


  render() {
    return (
      // -------Sign Up page-------//
      <div className="login-register" id="login-register">
        <div className="logo-mobile">
          <img src={logo} />
        </div>
        <section className="login-register-section">
          <h1 className="login-register-title-h">Choose <span className="">TopShelf</span> today <br />Make The Right Investment</h1>
          <div className="login-register-main">
          <Row gutter={[16, 48]} justify="center" className="login-sec-main">
          <Col xs={22} md={12} lg={12} className="login-sec-main-col login-sec-main-col-reset">
          <h2 className="reset-password-h">Forgot password?</h2>
              <p className="reset-password-success-text">Please enter your registered email address.<span className="minimum-label"></span>.</p>
              <Form initialValues={{ remember: true }} spellCheck="false" layout="horizantal" ref={this.formRef} onFinish={this.handleSubmit.bind(this)}>
              <div className="form-section-only reset-password-form">
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    {
                      type: "email",
                      message: "Please Enter Valid Email",
                    },
                    {
                      required: true,
                      message: "Please Enter Email",
                    },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined className="" />}
                   
                  />
                </Form.Item>
                  </div>
                  <div className="btn-section">
                <Button type="primary" htmlType="submit" className="login-btn">
                  Continue
                </Button>
                </div>
              </Form>
              {/* -----Single sign on section */}
              {/* <p className="forgot-hint">Resetting your password signifles that you have read and agreed o our Terms of Services and Privacy Policy</p> */}
            </Col>
            <Col xs={22} md={12} lg={12} className="login-sec-main-col-img">
                <div className="login-signup-card-text">
                  <div className="">
                    <h2>Discover opportunities <br />and Track your holdings.</h2>
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

export default connect(null, { forgotPassword })(ForgotPassword);
