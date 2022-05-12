import React, { Component } from 'react'
import { getAllNotificationsByReceiverId, updateNotificationsById, getByExpressInterestId } from '../../Redux/Crud';
import { connect } from 'react-redux';
import { Strings } from '../../Constants/Strings';
import * as _ from 'lodash';

class Notifications extends Component {

    constructor(props) {
        super(props)

        this.state = {
            user: null,
            tab: 1,
            notifications: [],
            unreadMessages: false
        }
    }

    componentDidMount() {
        this.getAllNotifications()
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

    // return time variation
    returnTimeSince(date) {
        var seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);

        var interval = seconds / 31536000;

        if (interval > 1) {
            return Math.floor(interval) + " years";
        }
        interval = seconds / 2592000;
        if (interval > 1) {
            return Math.floor(interval) + " months";
        }
        interval = seconds / 86400;
        if (interval > 1) {
            return Math.floor(interval) + " days";
        }
        interval = seconds / 3600;
        if (interval > 1) {
            return Math.floor(interval) + " hours";
        }
        interval = seconds / 60;
        if (interval > 1) {
            return Math.floor(interval) + " minutes";
        }
        return Math.floor(seconds) + " seconds";
    }

    // update notifications
    updateNotification(item) {
        if (this.props.user.userType == 1) {
            this.props.updateNotificationsById({
                "notificationId": item.id,
                "data": { "unRead": false }
            })

        } else {
            this.props.getByExpressInterestId(item.orderId).then((res) => {
                if (res.type == Strings.successType) {
                        this.props.updateNotificationsById({
                            "notificationId": item.id,
                            "data": { "unRead": false }
                        })
                    this.props.closingDrawer();
                    this.props.history.push('/holding-details', { data: res.data, form: true })
                    
                } else {
                    this.props.closingDrawer();
                    this.props.history.push('/holding-details', { data: {} })
                }
            })
        }
    }



    render() {
        return (
            <div>
                {this.state.notifications.length > 0 ?
                    <>
                        {this.state.notifications.map((item) => {
                            return (
                                <div className="notification-card" onClick={() => { this.updateNotification(item) }}>
                                    <div>{this.returnTimeSince(item.createdAt)}</div>
                                    <p>{item.content}</p>
                                </div>

                            )
                        })}
                    </>

                    :
                    <p className="no-data-drawer">No Data</p>
                }
            </div>
        )
    }
}

export default connect(null, { getAllNotificationsByReceiverId, updateNotificationsById, getByExpressInterestId })(Notifications);
