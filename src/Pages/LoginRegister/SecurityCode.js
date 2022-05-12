import React, { Component } from "react";
import "antd/dist/antd.css";
import { Loading } from '../../Components';

/* Antd library components */
import { Typography, Input, Form, Button, Row, Col, notification } from "antd";
import { connect } from "react-redux";
import { checkOtp } from '../../Redux/Crud';
/* Relative imports */
  import { Strings } from "../../Constants/Strings";
import logo from '../../assets/images/logo.png';
import {
  MailOutlined,
  LockOutlined,
} from "@ant-design/icons";

import "./LoginRegister.css";

const { Title } = Typography;

//Declaring the StageModel component
class SecurityCode extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: "hello",
      userData: null,
      loading: false
    };
    // window.FreshworksWidget('hide')
  }

  componentDidMount(){
    this.setState({
      userData: this.props.location.state.userData
    })
  }

  //handling form submit
  handleSubmit(values) {
    if(values){
      this.setState({loading: true});
      this.props.checkOtp({phoneNumber: this.state.userData.phoneNumber,
        countryCode: this.state.userData.countryCode,
      "activity": "verify",
      "receivedOtp": values.code}).then(res => {
        if (res.type === Strings.successType) {
          this.showingMessage('success', 'Login completed successfully')
          localStorage.setItem('userData', JSON.stringify({
            id: this.state.userData.id,
            accessToken: this.state.userData.accessToken,
          }))
            this.props.history.push('/admin-opportunities')
            this.setState({loading: false});
        }
        else {
          this.showingMessage('error', res.message)
          this.setState({loading: false});
        }
      })
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
      // -------Sign Up page-------//
      <div className="login-register" id="login-register">
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
            <Col xs={16} md={10} lg={7}>
              <Title className="login-register-title">Enter Security Code </Title>
              <p className="welcome-text">Enter 6-didgit code we sent to your mobile number ending {this.state.userData ? this.state.userData.phoneNumber.substr(this.state.userData.phoneNumber.length -4) : ''} to finish setting up the two-factor authentication.</p>
              <Form initialValues={{ remember: true }} spellCheck="false" layout="vertical" onFinish={this.handleSubmit.bind(this)}>

                <Form.Item
                  name="code"
                  label="Security Code"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Code!",
                    },
                  ]}
                >
                  <Input
                    type="number"
                    prefix={<LockOutlined className="" />}
                    placeholder="Enter Your Code"
                  />
                </Form.Item>

                <Button type="primary" htmlType="submit">
                  Continue
                </Button>
              </Form>
              {/* -----Single sign on section */}
            </Col>
          </Row>
        </section>
      </div>
    );
  }
}

export default connect(null, { checkOtp })(SecurityCode)

