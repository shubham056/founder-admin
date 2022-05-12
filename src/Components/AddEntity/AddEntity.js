import React, { Component } from 'react'
import { Row, Col, Radio, Input, Form, Button, Dropdown, Menu, Upload, message, Select, notification, Image, Checkbox, Tabs, Modal } from 'antd';
import { CloseCircleOutlined, DeleteOutlined, MailOutlined, UploadOutlined, AddOutlined, PlusSquareFilled, EditOutlined, FilePdfFilled } from "@ant-design/icons";
import { connect } from 'react-redux';
import { Strings } from '../../Constants/Strings';
import { addNewInvestorEntity, getAllByInvestorId, updateDataByInvestorEntityId, uploadImage, uploadSecureFiles, getSignedUrls } from '../../Redux/Crud';
import MaskedInput from 'antd-mask-input';

const { Option } = Select;

class AddEntity extends Component {
    formRef = React.createRef();

    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            user: null,
            showAddEntity: false,
            disableCheckBox: false,
            checkBoxStatus: false,
            mailingFormDisable: true,
            showMailingSelect: false,
            showPrimarySelect: false,
            entitys: [],
            checkedEntity: null,
            editEntityValue: null,
            initialValues: null,
            shareData: null
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.getAllEntitys();
        this.setState({
            user: this.props.user
        })
        if(this.props.shareData) {
            this.setState({
                shareData: this.props.shareData
            })
        }
    }

    // submit express intrest
    formSubmit() {
        if (this.state.checkedEntity) {
            let obj = {
                "investAsDetails": {
                    firstName: this.state.checkedEntity.firstName,
                    middleName: this.state.checkedEntity.middleName,
                    lastName: this.state.checkedEntity.lastName,
                    address: this.state.checkedEntity.mailingAddress,
                    countryCode: this.state.checkedEntity.countryCode,
                    email: this.state.checkedEntity.email,
                    entityName: this.state.checkedEntity.entityName,
                    taxId: this.state.checkedEntity.taxId,
                    phoneNumber: this.state.checkedEntity.phoneNumber
                },
                id: 2,
                entityId: this.state.checkedEntity.id
            }
            this.props.submitForm(obj)
        } else {
            this.showingMessage(Strings.errorType, Strings.entityNotSelectedError);
        }
    }

    // get user entitys list
    getAllEntitys() {
        let user = JSON.parse(localStorage.getItem('userData'));
        this.props.getAllByInvestorId({
            "investorId": user.id,
            "skip": 0,
            "limit": 0
        }).then(res => {
            if (res.type == Strings.successType) {
                this.setState({
                    entitys: res.data.data
                },()=>{
                    if(this.state.entitys[0]){
                    this.state.entitys[0].checked = true;
                    }
                    this.setState({
                        entitys: this.state.entitys,
                        checkedEntity: this.state.entitys[0]
                    })
                });
            }
        })
    }

    
    //showing notification message
    showingMessage(type, message, title) {
        notification[type]({
            description: message,
        });
    }

    // change event for select entity
    handleRadioButtonChange(ind) {
        this.state.entitys.map(item => {
            item.checked = false;
        })
        this.state.entitys[ind].checked = true;
        this.setState({
            entitys: this.state.entitys,
            checkedEntity: this.state.entitys[ind]
        })
    }

    // edit entity
    editEntity(item) {
        this.props.history.push('/edit-entity', {editEntityValue: item, initialValues: item, shareData: this.state.shareData})
    }


    // add entity
    AddEntityForm() {
        this.props.history.push('/edit-entity', {editEntityValue: null, initialValues: null, shareData: this.state.shareData})
    }

    render() {
        const { express, user } = this.props;
        this.state.user = user;
        return (
            
            <div className="profile-main" key={this.props.user ? this.props.user : null}>
                  <h2 className="join-investor-heading" id="entity-heading-label">Entites <span>(Optional)</span></h2> 
                        <div className="profile-section">
                            <Row gutter={[16]} className="entity-section">
                                {this.state.entitys && this.state.entitys.length > 0 ? this.state.entitys.map((item, ind) => {
                                    return <Col sm={24} md={12} lg={8}>
                                        <div className="entity-main">
                                            <div className="entity-id" id="entity-id">
                                                {/* Entity:{ind + 1} */}
                                                
                                            <div className="entity-investor-name">{item.entityName}</div>
                                                {express ? <div className="entity-check-radio-sec"><Radio checked={item.checked} onChange={() => { this.handleRadioButtonChange(ind) }}></Radio></div> :
                                                    <p onClick={() => { this.editEntity(item) }}>
                                                        <EditOutlined className="edit-icon" /></p>
                                                }


                                            </div>
                                            <div > {item.firstName + " " + (item.middleName ? item.middleName + " " : "") + item.lastName}</div>
                                           
                                            {/* <div className="">{item.entityName} <span> <span>{item.taxId}</span></span></div> */}
                                             <div>{item.email}</div>
                                            <div> {item.countryCode + " " + item.phoneNumber}</div>
                                        </div>
                                    </Col>


                                }) : null}
                                <Col sm={24} md={12} lg={8} className="add-entity-button">
                                    <Button type="" icon={<PlusSquareFilled />} onClick={() => { this.AddEntityForm() }}>
                                        Add Entity
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                        {express ?
                            <div className="back-complete-btn">
                                {/* <Button type="primary" className="primary-button-back" onClick={() => {
                                    this.props.goBack(0)
                                }}>Back</Button> */}

                                <Button type="primary" onClick={() => { this.formSubmit() }} className="primary-button">PROCEED</Button>
                            </div>
                            : null}

            </div >
        )
    }
}


//exporting page
export default connect(null, { getAllByInvestorId, addNewInvestorEntity, updateDataByInvestorEntityId, uploadImage, uploadSecureFiles, getSignedUrls })(AddEntity);
