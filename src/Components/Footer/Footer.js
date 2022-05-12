import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout, Row, Col } from 'antd';
import 'antd/dist/antd.css';
import '../../App.css';
import './Footer.css';
import logo from '../../assets/images/logo.png';


class Footer extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className='footer-main'>
                <div className='footer-sub-main'>
                    <div className='footer-privacy-text'>
                        <label> &copy; TopShelf Equity Partners, LLC</label>
                        <p>This website is operated by TopShelf Equity Partners LLC (“TopShelf”).
                            The material and information provided on the site is for information purposes
                            and does not constitute an offer to purchase or sell securities.
                            Certain information on our site is only accessible by sophisticated investors.
                            Neither TopShelf nor any of its affiliates are registered investment advisers or broker dealers.
                            Nothing on our site constitutes a recommendation to purchase a particular security or that any investment
                            is suitable for any investor. The use of this site is subject to your agreement to be bound by our <a  onClick={() => {this.props.history.push('/terms') }} class=" "> Terms. </a>
                            We use personal information in a manner consistent with our <a class=" "  href="/privacy" target="_blank">Privacy Policy. </a></p>
                    </div>
                </div>
            </div>
        )
    }
}


export default connect(null, {})(Footer);
