import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { AdminOpportunities, InvesterOpportunities, Profile, EditProfile } from '../Pages';

import { getUserData } from '../Redux/Crud';
import { Strings } from '../Constants/Strings';

class CheckingUser extends Component {

    constructor(props) {
        super(props)

        this.state = {
            admin: null,
        }
    }


    componentDidMount() {
        this.getUserDetails();
    }

    //getting user data
    getUserDetails() {
        if (localStorage.getItem('userData')) {
            let user = JSON.parse(localStorage.getItem('userData'));
            this.props.getUserData(user.id)
                .then(res => {
                    if (res.type === Strings.successType) {
                        if (res.data.userType === 1) {
                            this.setState({
                                admin: true,
                                user: res.data
                            })
                        } else {
                            this.setState({
                                admin: false,
                                user: res.data
                            })
                        }
                    } else {
                        localStorage.clear();
                        this.props.history.push('/');
                    }
                })
        } else {
            localStorage.clear();
            this.props.history.push('/');
        }
    }



    render() {
        return (
            <div key={this.state.admin ? this.state.admin : null}>
                {this.state.admin === true ?
                    <Redirect to={{ pathname: '/admin-opportunities', Component: AdminOpportunities }} /> :
                    null
                }
                {/* {this.state.admin === false && this.state.user ?(
                    this.state.user.verifyStatus ?(
                    (this.state.user.verifyStatus == 2) ? <Redirect to={{ pathname: '/investor-opportunities', Component: InvesterOpportunities }} /> :(
                        (this.state.user.verifyStatus == 1) ? <Redirect to={{ pathname: '/profile', Component: Profile }} /> : <Redirect to={{ pathname: '/edit-profile', Component: EditProfile, state:{fromLogin: true} }} />
                    )) : <Redirect to={{ pathname: '/edit-profile', Component: EditProfile, state:{fromLogin: true} }} />
                ): null} */}
                {this.state.admin === false && this.state.user ?(
                    this.state.user.verifyStatus ?(
                    (this.state.user.verifyStatus == 2) ? <Redirect to={{ pathname: '/dashboard', Component: InvesterOpportunities }} /> :(
                        (this.state.user.verifyStatus == 1) ? <Redirect to={{ pathname: '/dashboard', Component: Profile }} /> : <Redirect to={{ pathname: '/edit-profile', Component: EditProfile, state:{fromLogin: true} }} />
                    )) : <Redirect to={{ pathname: '/edit-profile', Component: EditProfile, state:{fromLogin: true} }} />
                ): null}
            </div>
        )
    }
}

//exporting navigation routes for admin & investers 
export default connect(null, { getUserData })(CheckingUser)