import React, { Component } from 'react';
import { Row, Col, Radio, Input, Form, Button, Dropdown, Menu, Upload, message, Select, notification, Image, Checkbox, Tabs, Modal } from 'antd';
import { CloseCircleOutlined, DeleteOutlined, MailOutlined, UploadOutlined, AddOutlined, PlusSquareFilled, EditOutlined } from "@ant-design/icons";
import { connect } from 'react-redux';
import { Strings } from '../../Constants/Strings';
import { addNewJointInvestor, getAllJointInvestorsByInvestorId, updateDataByJointInvestorById } from '../../Redux/Crud';

const { Option } = Select;
class JointInvestors extends Component {

    formRef = React.createRef();

    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            user: null,
            initialValues: null,
            JointInvestors: [],
            checkedInvestor: null,
            editInvestorValue: null,
            initialValue: null,
            showAddInvestor: false,
            shareData: null
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.setState({
            user: this.props.user
        },()=>{
            console.log(this.props)
            if(this.props.shareData) {
                this.setState({
                    shareData: this.props.shareData
                })
            }
            this.getAllJointInvestors()
        })
    }

    //get user joint investors
    getAllJointInvestors() {
         let user = JSON.parse(localStorage.getItem('userData'));
         this.props.getAllJointInvestorsByInvestorId({
            "investorId": user.id,
            "skip": 0,
            "limit": 0
        }).then(res => {
            if (res.type == Strings.successType) {
                this.setState({
                    JointInvestors: res.data.data
                });
            }else {
                 this.setState({
                    JointInvestors: []
                });
            }
        })
    }

    //handling form submit
    handleSubmit(values) {
        this.setState({ loading: true });
        let user = JSON.parse(localStorage.getItem('userData'));
        let obj = {
            "firstName": values.firstName,
            "middleName": values.middleName,
            "lastName": values.lastName,
            investorId: user.id,
            countryCode: values.countryCode,
            phoneNumber: values.phoneNumber,
            taxId: values.taxId,
            email: values.email           
        }
        if (this.state.editInvestorValue && this.state.editInvestorValue.id) {
            this.props.updateDataByJointInvestorById({
                jointInvestorId: this.state.editInvestorValue.id,
                data: obj
            }).then(res => {
                if (res.type == Strings.successType) {
                    this.showingMessage(Strings.successType, res.message, Strings.profileTitle);
                    this.getAllJointInvestors();
                    this.formRef.current.resetFields();
                    this.setState({ loading: false, showAddInvestor: false });
                } else {
                    this.showingMessage(Strings.errorType, res.message, Strings.profileTitle)
                    this.setState({ loading: false });
                }
            })
        } else {
            this.props.addNewJointInvestor(obj).then(res => {
                if (res.type == Strings.successType) {
                    this.showingMessage(Strings.successType, res.message, Strings.profileTitle);
                    this.getAllJointInvestors();
                    this.formRef.current.resetFields();
                    this.setState({ loading: false, showAddInvestor: false });
                } else {
                    this.showingMessage(Strings.errorType, res.message, Strings.profileTitle)
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

    // change event for select entity
    handleRadioButtonChange(ind) {
        this.state.JointInvestors.map(item => {
            item.checked = false;
        })
        this.state.JointInvestors[ind].checked = true;
        this.setState({
            JointInvestors: this.state.JointInvestors,
            checkedInvestor: this.state.JointInvestors[ind]
        })
        
        this.props.SelectInvestor(this.state.JointInvestors[ind])
    }

    // edit investor
    editInvestor(item) {
        this.props.history.push('/edit-joint-investor', {editInvestorValue: item, initialValues: item, shareData: this.state.shareData})
    }

    // add investor
    AddInvestor() {
        this.props.history.push('/edit-joint-investor', {editInvestorValue: null, initialValues: null, shareData: this.state.shareData})
    }

    


    render() {
        const { express, user } = this.props;
        this.state.user = user; 

        return (

            <div className="profile-main" key={this.props.user ? this.props.user : null}>
                
                <div className="profile-section">
                     <h2 className="join-investor-heading">Joint Investor <span>(Optional)</span></h2> 
                    <Row gutter={[16]} className="entity-section">
                        {this.state.JointInvestors && this.state.JointInvestors.length > 0 ? this.state.JointInvestors.map((item, ind) => {
                            return <Col sm={24} md={12} lg={8}>
                                <div className="entity-main">
                                    <div className="entity-id" id="entity-id">
                                        Joint Investor:{ind + 1}
                                        {express ? <div className="entity-check-radio-sec"><Radio checked={item.checked} onChange={() => { this.handleRadioButtonChange(ind) }}></Radio></div> :
                                            <p onClick={() => { this.editInvestor(item) }}>
                                                <EditOutlined className="edit-icon" /></p>
                                        }


                                    </div>
                                    <div className="investor-name-joint">
                                    {item.firstName + " " + (item.middleName ? item.middleName + " " : "") + item.lastName}
                                    </div>
                                    {/* <div className="">
                                     <span>{item.taxId}</span>
                                    </div> */}
                                  
                                    <div className="email-label">{item.email}</div>
                                    <div>{item.countryCode+" "+item.phoneNumber}</div>
                                </div>
                            </Col>
                        }) : null}
                        
                      
                        <Col sm={24} md={12} lg={8} className="add-entity-button" id="add-Joint">
                        
                            <Button type="" icon={<PlusSquareFilled />} onClick={() => { this.AddInvestor() }}>
                                Add Joint Investor
                            </Button>
                        </Col>
                    </Row>
                </div> 
            </div>
        )
    
    }
}

//exporting page
export default connect(null, { addNewJointInvestor, getAllJointInvestorsByInvestorId, updateDataByJointInvestorById })(JointInvestors);
