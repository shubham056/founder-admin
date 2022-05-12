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
class PasswordSuccess extends Component {
  constructor(props) {
    super(props);

    this.state = {
      verifyStatus: null,
      userType: "2"
    };
    // window.FreshworksWidget('hide')
  }

  componentDidMount() {
    if (this.props.location.state && this.props.location.state.verifyStatus) {
      this.setState({
        verifyStatus: this.props.location.state.verifyStatus
      })
    }
    if (this.props.location.state && this.props.location.state.userType) {
      this.setState({
        userType: this.props.location.state.userType
      })
    }
  }

  goToSubmit() {
    if (this.state.verifyStatus) {
      if (this.state.verifyStatus == 1) {
        this.props.history.push('/profile');
      } else if (this.state.verifyStatus == 2) {
        if (this.state.userType == "1") {
          this.props.history.push('/admin-opportunities');
        } else {
          this.props.history.push('/investor-opportunities');
        }
      } else {
        this.props.history.push("/edit-profile", { fromLogin: true });
      }
    } else {
      this.props.history.push("/edit-profile", { fromLogin: true });
    }
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
               <h2 className="reset-password-h">Password Reset Successful!</h2>
                {/* <p>A verification link has been sent to your mail {this.state.email ? this.state.email : null}, Please check inbox!</p> */}
               <p className="reset-password-success-text">You can now login with your new password </p>
              
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
export default connect(null, {})(PasswordSuccess)

