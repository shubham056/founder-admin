import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getUserData, updateProfile } from '../../Redux/Crud';
import { Strings } from '../../Constants/Strings';
import { Constants } from '../../Constants/Constants';
import { AppHeader, Loading } from '../../Components';
import './ExpressIntrest.css';
import Persona from 'persona';
import { LeftOutlined } from '@ant-design/icons';

class ExpressIntrest extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: true
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    updateUser() {
        this.setState({ loading: true })
        if (localStorage.getItem('userData')) {
            let user = JSON.parse(localStorage.getItem('userData'));
            this.props.updateProfile({ userId: user.id, data: { verifyStatus: 2 } })
                .then(res => {
                    if (res.type == Strings.successType) {
                        this.setState({
                            user: res.data,
                        });
                        this.setState({ loading: false })
                        // this.props.history.push('/profile');

                        this.props.history.push('/profile', { step: 0 })
                    } else {
                        this.setState({ loading: false })
                        localStorage.clear();
                        this.props.history.push('/');
                    }
                })
        } else {
            this.setState({ loading: false })
            localStorage.clear();
            this.props.history.push('/');
        }
    }

    render() {

        return (
            <div className="">
                <span className="iframe-span-back" onClick={() => { this.props.history.push('/profile'); }}><LeftOutlined className="iframe-back" />Back</span>
                {this.state.loading ? <Loading></Loading> : null}
                <div className="my-holdings-main invester-opp-main" id="iframe-success">
                    <Persona.Inquiry
                        templateId={Constants.personaTemplateId}
                        environment={Constants.personaEnvironment}
                        onLoad={() => { this.setState({ loading: false }) }}
                        onComplete={({ inquiryId, status, fields }) => {
                            if (status == 'completed') {
                                this.updateUser()
                            }
                            fetch(`/server-handler?inquiry-id=${inquiryId}`);
                        }}
                    />
                </div>
            </div>
        )
    }
}

export default connect(null, { getUserData, updateProfile })(ExpressIntrest)
