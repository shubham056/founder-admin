import React, { Component } from 'react';
import { Layout, Menu, List, Drawer, Button, Popover } from 'antd';
import 'antd/dist/antd.css';
import '../../App.css';
import './Header.css';
import logo from '../../assets/images/logo.png';
import logout from '../../assets/images/logout.png';
import headerNotification from '../../assets/images/headerNotification.png';
import headerNotificationun from '../../assets/images/headerNotificationun.png';
import userImage from '../../assets/images/userImage.png';
import { connect } from 'react-redux';
import { Strings } from '../../Constants/Strings';
import Notifications from '../Notifications/Notifications.js';
import * as _ from 'lodash';
import { getAllNotificationsByReceiverId, userLogout } from '../../Redux/Crud';
import { DownOutlined, MenuOutlined } from '@ant-design/icons';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

class AppHeader extends Component {

    constructor(props) {
        super(props)

        this.state = {
            visible: false,
            user: null,
            tab: 1,
            hideHeader: false,
            notifications: [], unreadMessages: false,
            menuVisible: false,
        }
    }

    // handle drawer event
    handleDrawer(type) {
        if (type == 'open') {
            this.setState({
                visible: true
            })
        } else {
            this.setState({
                visible: false
            })
        }
    }

    // Menu Drawer
    menuDrawer = () => {
        this.setState({ menuVisible: true })
    }
    menuClose = () => {
        this.setState({ menuVisible: false })

    }

    componentDidMount() {
        console.log();
        let path = window.location.pathname;
        if (path == '/investor-opportunities') {
            this.state.tab = 1;
        }
        if (path == '/my-holdings' || path == '/holding-details') {
            this.state.tab = 2;
        }
        if (path == '/profile') {
            this.state.tab = 3;
        }
        this.setState({
            tab: this.state.tab,
            user: this.props.user
        }, () => {
            this.getAllNotifications()
        })
    }

    // get notifications
    getAllNotifications() {
        if (this.props.user && this.props.user.id) {
            this.props.getAllNotificationsByReceiverId({
                receiverId: this.props.user ? this.props.user.id : 0,
                skip: 0,
                limit: 0
            }).then((res) => {
                if (res.type == Strings.successType) {
                    if (res.data && res.data.data) {
                        if (res.data.data.length > 0) {
                            let unreadMsg = _.findKey(res.data.data, ['unRead', true]);
                            if (unreadMsg) {
                                this.state.unreadMessages = true
                            } else {
                                this.state.unreadMessages = false
                            }
                            this.setState({
                                unreadMessages: this.state.unreadMessages,
                                notifications: res.data.data
                            });
                        } else {
                            this.setState({ notifications: [], unreadMessages: false });
                        }
                    } else {
                        this.setState({ notifications: [], unreadMessages: false });
                    }
                } else {
                    this.setState({ notifications: [], unreadMessages: false });
                }
            })
        }
    }

    logout() {
        this.props.userLogout(this.props.user.id).then((res) => {
            localStorage.clear(); this.props.history.push('/')
        });
    }


    render() {
        // const content = (
        //     <div className="profile-logout">
        {/* {this.state.user && this.state.user.userType == '1' ?null : 
               (this.state.user && (this.state.user.verifyStatus == 1 || this.state.user.verifyStatus == 2) ?
               <p onClick={() => { this.props.history.push('/profile') }}>Profile</p> : null)
               } */}
        {/* <p onClick={() => { localStorage.clear(); this.props.history.push('/') }}>Logout</p> */ }
        {/* </div>
        ); */}
        const content = (
            <div className="profile-logout">
                <p onClick={() => { localStorage.clear(); this.props.history.push('/') }}>Logout</p>
            </div>
        );
        return (
            <div className="app-header" key={this.state.user ? this.state.user : null}>
                <Layout className="app-header-layout">
                    <Menu mode="horizontal" defaultSelectedKeys={this.state.tab ? this.state.tab : '1'} className="web-only" style={{ position: 'fixed', zIndex: 1, width: '100%' }}>

                        <Menu.Item key="logo" onClick={() => {
                            this.setState({ tab: 1 });
                            if (this.state.user && this.state.user.userType == '2' && (this.state.user.verifyStatus == 2 || this.state.user.verifyStatus == 1)) {
                                this.props.history.push('/investor-opportunities')
                            }
                            if (this.state.user && this.state.user.userType == '1') {
                                this.props.history.push('/admin-opportunities')
                            }
                        }}><img src={logo} className="header-logo" /></Menu.Item>
                        {/* <>
                                <Menu.Item key="1" onClick={() => { this.setState({ tab: 1 }); this.props.history.push('/investor-opportunities') }}>Opportunities</Menu.Item>
                                <Menu.Item key="2" onClick={() => { this.setState({ tab: 2 }); this.props.history.push('/my-holdings') }}>My holdings</Menu.Item>
                            </> */}
                        {this.state.user && this.state.user.userType == '2' && (this.state.user.verifyStatus == 2 || this.state.user.verifyStatus == 1) ?
                            <>
                                <Menu.Item key="1" className={this.state.tab == 1 ? 'tab-active' : null} onClick={() => { this.setState({ tab: 1 }); this.props.history.push('/investor-opportunities') }}>Opportunities</Menu.Item>
                                <Menu.Item key="2" className={this.state.tab == 2 ? 'tab-active' : null} onClick={() => { this.setState({ tab: 2 }); this.props.history.push('/my-holdings') }}>My holdings</Menu.Item>
                                <Menu.Item key="3" className={this.state.tab == 3 ? 'tab-active' : null} onClick={() => { this.setState({ tab: 3 }); this.props.history.push('/profile') }}>Account</Menu.Item>
                            </> : null}
                        {this.state.user && this.state.user.userType == '1' ?
                            <>
                                <Menu.Item key="4" onClick={() => { this.setState({ tab: 4 }); this.props.history.push('/admin-opportunities') }}>Opportunities</Menu.Item>
                                <Menu.Item key="11" onClick={() => { this.setState({ tab: 11 }); this.props.history.push('/admin-company-list') }}>Companies</Menu.Item>
                                <Menu.Item key="5" onClick={() => { this.setState({ tab: 5 }); this.props.history.push('/admin-orders') }}> Orders</Menu.Item>
                                <Menu.Item key="7" onClick={() => { this.setState({ tab: 7 }); this.props.history.push('/investors') }}>Investors</Menu.Item>
                            </> : null}
                        <div className="header-right-section">
                            <Menu.Item key="9" className="header-profile">
                                {/* <Popover content={content} className="user-popover"> */}
                                <div className="profile-user">
                                    {/* {this.state.user && this.state.user.profilePicture && this.state.user.profilePicture.orginalUrl ? */}
                                    {/* <img onClick={() => { this.setState({ tab: 3 }); this.props.history.push('/profile') }} src={this.state.user.profilePicture.orginalUrl} className="header-right-section-images" />
                                        : */}
                                    <img src={userImage} onClick={() => { this.setState({ tab: 3 }); this.props.history.push('/profile') }} className="header-right-section-images" /><div className="user-name">

                                        <Popover content={content} placement="bottom">
                                            <label> {this.state.user ?
                                                ((this.state.user.firstName + " " + (this.state.user.middleName ? this.state.user.middleName + " " : "") + this.state.user.lastName)) : null
                                            }
                                            </label>
                                        </Popover>
                                        {/* <label onClick={() => { this.logout() }}>Logout</label> */}
                                    </div>
                                </div>
                                {/* <img src={userImage} className="header-right-section-images" />}<div className="user-name">{this.state.user ? this.state.user.firstName + " " + this.state.user.lastName : ''}<DownOutlined/></div></div> */}
                                {/* </Popover> */}
                            </Menu.Item>
                            {/* <Menu.Item key="8" className="header-notification" onClick={() => { this.setState({ tab: 8 }); this.handleDrawer('open') }}>
                                {this.state.unreadMessages ?
                                    <img src={headerNotification} className="header-right-section-images" />
                                    :
                                    <img src={headerNotificationun} className="header-right-section-images" />}
                            </Menu.Item> */}
                        </div>
                    </Menu>



                    { /***Mobile only start* */}



                    { /***Mobile only start* */}
                    <Layout className="mobile-only" style={{ position: 'fixed', zIndex: 1111, width: '100%' }}>
                        <span key="logo" onClick={() => {
                            this.setState({ tab: 1 });
                            if (this.state.user && this.state.user.userType == '2') {
                                if ((this.state.user.verifyStatus == 2 || this.state.user.verifyStatus == 1)) {
                                    this.props.history.push('/investor-opportunities')
                                }
                            }
                            else {
                                this.props.history.push('/admin-opportunities')
                            }
                        }}>
                            <img src={logo} className="header-logo" />
                        </span>
                        <span>
                            <MenuOutlined className="menu-icon" onClick={this.menuDrawer} />
                            <Drawer
                                placement="right"
                                closable={false}
                                className="mobile-side-menu"
                                onClose={this.menuClose}
                                visible={this.state.menuVisible}
                            >
                                <Menu mode="inline"
                                    style={{ height: '100%', borderRight: 0 }}>

                                    {this.state.user && this.state.user.userType == '2' && (this.state.user.verifyStatus == 2 || this.state.user.verifyStatus == 1) ?
                                        <>
                                            <Menu.Item key="1" onClick={() => { this.setState({ tab: 1 }); this.props.history.push('/investor-opportunities') }}>Opportunities</Menu.Item>
                                            <Menu.Item key="2" onClick={() => { this.setState({ tab: 2 }); this.props.history.push('/my-holdings') }}>My holdings</Menu.Item>
                                        </> : null}

                                    {this.state.user && this.state.user.userType == '1' ?
                                        <>
                                            <Menu.Item key="4" onClick={() => { this.setState({ tab: 4 }); this.props.history.push('/admin-opportunities') }}>Opportunities</Menu.Item>
                                            <Menu.Item key="11" onClick={() => { this.setState({ tab: 11 }); this.props.history.push('/admin-company-list') }}>Companies</Menu.Item>
                                            <Menu.Item key="5" onClick={() => { this.setState({ tab: 5 }); this.props.history.push('/admin-orders') }}> Orders</Menu.Item>
                                            <Menu.Item key="7" onClick={() => { this.setState({ tab: 7 }); this.props.history.push('/investors') }}>Investors</Menu.Item>
                                        </> : null}

                                    <Menu.Item key="8" className="header-notification" onClick={() => { this.setState({ tab: 8 }); this.handleDrawer('open') }}> {this.state.unreadMessages ?
                                        <img src={headerNotification} className="header-right-section-images" />
                                        :
                                        <img src={headerNotificationun} className="header-right-section-images" />}
                                        <span className="notification-label"> Notifications</span>
                                    </Menu.Item>

                                    {this.state.user && this.state.user.userType == '1' ? null : <Menu.Item key="9" className="header-profile" onClick={() => { this.props.history.push('/profile') }}><div className="profile-user">
                                        {this.state.user && this.state.user.profilePicture && this.state.user.profilePicture.orginalUrl ? <img src={this.state.user.profilePicture.orginalUrl} className="header-right-section-images" />
                                            :
                                            <img src={userImage} className="header-right-section-images" />}<div className="user-name">{this.state.user ? this.state.user.firstName + " " + this.state.user.lastName : ''}</div></div></Menu.Item>}
                                    <Menu.Item key="10" className="header-logout" onClick={() => { this.logout() }}>
                                        Logout
                                    </Menu.Item>

                                </Menu>

                            </Drawer>

                        </span>

                    </Layout>


                    {/****Mobile only ends */}
                    <Drawer
                        title="Notifications"
                        placement="right"
                        closable={true}
                        onClose={() => this.handleDrawer('close')}
                        visible={this.state.visible}
                    >
                        <Notifications user={this.state.user} history={this.props.history} closingDrawer={() => this.handleDrawer('close')} />

                    </Drawer>
                </Layout>
            </div >
        )
    }
}

export default connect(null, { getAllNotificationsByReceiverId, userLogout })(AppHeader);