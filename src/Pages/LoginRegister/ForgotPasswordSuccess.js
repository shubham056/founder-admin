import React, { Component } from "react";
import "antd/dist/antd.css";
import { Loading } from '../../Components';

/* Antd library components */
import { Typography, Input, Form, Button, Row, Col, notification, Tabs, Radio, Space, Select } from "antd";

/* Relative imports */
import { Strings } from "../../Constants/Strings";
import { connect } from "react-redux";
import logo from '../../assets/images/logo.png';
import "./LoginRegister.css";

//Declaring the PasswordSuccess component
class ForgotPasswordSuccess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null
    };
    // window.FreshworksWidget('hide')
  }

  componentDidMount() {
    if (this.props.location.state && this.props.location.state.email) {
      this.setState({
        email: this.props.location.state.email
      })
    }  
  }

  goToSubmit() {
        this.props.history.push('/');
  }


  render() {
    return (
      <div className="login-register" id="login-register">
        {this.state.loading ? <Loading></Loading> : null}
        <div className="logo-mobile">
          <img src={logo} />
        </div>
        {/*---Sign up Section----- */}
        <section className="login-register-section">
          <h1 className="login-register-title-h">Choose <span className="">TopShelf</span> today <br />Make The Right Investment</h1>
      
          <div className="login-register-main">
            <Row
              gutter={[16, 48]} 
              justify="center"
              className="login-sec-main"
            >
              <Col xs={22} md={12} lg={12} className="login-sec-main-col">
               <div className="form-section-only password-success-only">
               <h2 className="reset-password-h">Password Reset link has been sent to your registered email</h2>
               {/* <p className="reset-password-success-text">You can now login with your new password </p> */}
              
                </div>
                <div className="btn-section"> 
                    <Button onClick={() => { this.goToSubmit() }} type="primary" htmlType="submit" className="login-btn">Proceed</Button>
                  </div>
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

// export default Login
export default connect(null, {})(ForgotPasswordSuccess)

