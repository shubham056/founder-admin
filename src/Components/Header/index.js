import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { getAllNotificationsByReceiverId, userLogout } from '../../Redux/Crud';
import { connect } from 'react-redux';

const Header = ({ isBreadcrumb, linkText, link, heading }) => {
  console.log(getAllNotificationsByReceiverId)
  const history = useHistory();
  const [showLogout, setShowLogout] = useState(false);
  // const toggleLogout = ()=>{
  //   setShowLogout(!showLogout);
  // }
  //   const logout = ()=> {
  //     this.props.userLogout(this.props.user.id).then((res) => {
  //         localStorage.clear(); this.props.history.push('/')
  //     });
  // }
  return (
    <header className="tophdr">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <div className="navicon">
              <a href="/" onclick="openmenu()" className="icons">
                <img src="assets/images/menuicon.png" alt="navicon" />
              </a>
            </div>
            <div className="pagetitle">
              <h2>{(heading !== undefined) ? heading : null}</h2>
              {
                isBreadcrumb
                  ?
                  <p>{(heading !== undefined) ? heading : null} / <Link to={`/${link}`}>{linkText}</Link></p>
                  :
                  null
              }
            </div>
          </div>
          <div className="col-md-6" onMouseLeave={() => setShowLogout(false)}>
            <div className="userimg text-right left_user">
              <ul onMouseEnter={() => setShowLogout(true)} >
                <li className="frame">
                  <a href><span className="round" /> John Mathew</a>
                  <ul className="sub_menu" style={{ display: showLogout ? 'block' : 'none' }} >
                    <li><a href style={{ textAlign: 'center' }} onClick={() => { localStorage.clear(); history.push('/') }}>Logout</a></li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default connect(null, { getAllNotificationsByReceiverId, userLogout })(Header);
