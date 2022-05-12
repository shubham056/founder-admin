import React, { Component } from 'react'
import { AppHeader, Loading } from '../../Components';
import { Row, Col, Radio, Space, Input, Form, Button, Select, notification, InputNumber, Switch } from 'antd';
import {
    UserOutlined,
    PhoneOutlined,
    MailOutlined, PlusOutlined,
    LockOutlined, MinusCircleOutlined
} from "@ant-design/icons";
import './AddOpportunity.css';
import { Strings } from '../../Constants/Strings';
import { connect } from 'react-redux';
import * as _ from 'lodash';
import { addOpportunity, editOpportunity, getPortfolioCompanies, getCompaniesWithSkipLimit } from '../../Redux/Crud';

const { Option } = Select;

class AddOpportunity extends Component {
    constructor(props) {
        super(props)

        this.state = {
            user: null,
            opportunityData: null,
            templates: [],
            loading: false,
            companyNames: [{ id: "1", name: "bajaj" }, { id: "2", name: 'tata' }],
            securityTypes: ["Common type", "Common Type1"],
            primaryDetails: [],
            minimumShares: { "key": null, "value": null }
        }
    }

    componentDidMount() {
        this.state.user = this.props.location.state.user;
        if (this.props.location.state.opportunityData) {
            this.state.opportunityData = this.props.location.state.opportunityData;
            // this.state.opportunityData["offerPrice"] = JSON.stringify(this.state.opportunityData.offerPrice);
            this.state.opportunityData["pricePerShare"] = JSON.stringify(this.state.opportunityData.pricePerShare);
            this.state.opportunityData["pricePerUnit"] = JSON.stringify(this.state.opportunityData.pricePerUnit);
            this.state.opportunityData["totalShares"] = JSON.stringify(this.state.opportunityData.totalShares);
            this.state.opportunityData["dealImpliedValuation"] = JSON.stringify(this.state.opportunityData.dealImpliedValuation);
            this.state.opportunityData["lastRoundValuation"] = JSON.stringify(this.state.opportunityData.lastRoundValuation);
            this.state.opportunityData = this.state.opportunityData;

            this.state.primaryDetails = this.state.opportunityData && this.state.opportunityData.primaryDetails ? this.state.opportunityData.primaryDetails : [];
        }
        this.props.getCompaniesWithSkipLimit({
            searchValue: "",
            skip: 0,
            limit: 0
        }).then((res) => {
            console.log(res)
            if (res.type == Strings.successType) {
                this.setState({ companyNames: res.data.data });
            } else {
                this.setState({ companyNames: [] });
            }
        })
        this.setState({
            user: this.state.user,
            opportunityData: this.state.opportunityData,
            primaryDetails: this.state.opportunityData && this.state.opportunityData.primaryDetails ? this.state.opportunityData.primaryDetails : []
        })
    }

    addPrimaryDetails() {
        this.state.primaryDetails.push({ key: "", value: "" });
        this.setState({
            primaryDetails: this.state.primaryDetails
        })
    }


    //handling form submit for add opportunity
    handleSubmit(values) {
        console.log(values, this.state.minimumShares)
        let index = _.findIndex(this.state.companyNames, { id: values.companyId })
        if (index > -1) {
            values.portfolioCompanyName = this.state.companyNames[index].portfolioCompanyName
            values.logo = {
                orginalUrl: this.state.companyNames[index].logo.orginalUrl,
                thumbnailUrl: this.state.companyNames[index].logo.thumbnailUrl
            }
            values.about = this.state.companyNames[index].about
        }

        let obj = {
            "about": values.about,
            "portfolioCompanyName": values.portfolioCompanyName,
            "logo": values.logo,
            "companyId": values.companyId,
            // "offerPrice": JSON.parse(values.offerPrice),
            "securityType": values.securityType,
            "totalShares": JSON.parse(values.totalShares),
            "dealImpliedValuation": JSON.parse(values.dealImpliedValuation),
            "lastRound": values.lastRound,
            "lastRoundValuation": JSON.parse(values.lastRoundValuation),
            "availableShares": JSON.parse(values.totalShares),
            "isActive": values.isActive ? values.isActive : false,
            "isFullySubscribed": values.isFullySubscribed ? values.isFullySubscribed : false,
            "primaryDetails": values.primaryDetails,
            "minimumShares": values.minimumShares

        };
        if (values.pricePerShare) {
            obj["pricePerShare"] = JSON.parse(values.pricePerShare);
        }else {
            obj["pricePerShare"] = 0;

        }
        if (values.pricePerUnit) {
            obj["pricePerUnit"] = JSON.parse(values.pricePerUnit);

        }else {
            obj["pricePerUnit"] = 0;

        }
        console.log(obj)
        if (values.fund) {
            obj.fund = values.fund
        }
        if (this.state.opportunityData && this.state.opportunityData.id) {
            this.props.editOpportunity({ opportunityId: this.state.opportunityData.id, data: obj }).then(res => {
                if (res.type == Strings.successType) {
                    this.showingMessage(Strings.successType, res.message, Strings.profileTitle);
                    this.props.history.push('/admin-opportunities');
                    this.setState({ loading: false });
                } else {
                    this.showingMessage(Strings.errorType, res.message, Strings.profileTitle);
                    this.setState({ loading: false });
                }
            })
        } else {
            obj.availableShares = obj.totalShares;
            this.props.addOpportunity(obj).then(res => {
                if (res.type == Strings.successType) {
                    this.showingMessage(Strings.successType, res.message, Strings.profileTitle);
                    this.props.history.push('/admin-opportunities');
                    this.setState({ loading: false });
                } else {
                    this.showingMessage(Strings.errorType, res.message, Strings.profileTitle);
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

    render() {
        const itemInputs = this.state.primaryDetails && this.state.primaryDetails.length > 0 ? this.state.primaryDetails.map((item) => {
            return {
                key: item.key,
                value: item.value
            };
        }) : [];


        return (
            <div className="add-opportunity-main">
                {this.state.loading ? <Loading></Loading> : null}
                <div key={this.state.user ? this.state.user : null}>
                    <AppHeader history={this.props.history} user={this.state.user} />
                </div>
                <div className="container">
                    <h1 className="page-main-heading">{this.state.opportunityData && this.state.opportunityData.id ? Strings.opportunityEditTitle : Strings.opportunityAddTitle}</h1>
                    <div className="document-type-card">
                        <div className="card-main">
                            <div className="form-section" key={this.state.opportunityData ? this.state.opportunityData : null}>
                                <Form layout="vertical" onFinish={this.handleSubmit.bind(this)} initialValues={this.state.opportunityData}>
                                    <Row
                                        justify="start" gutter={16}>
                                        <Col md={12} lg={12} sm={24}>
                                            <Form.Item
                                                name="companyId"
                                                label={Strings.companyNameTitle}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: Strings.companyNameInputMessage,
                                                    },
                                                ]}
                                            >
                                                <Select placeholder={Strings.companyNamePlaceholder}>
                                                    {this.state.companyNames.map((item, index) => {
                                                        return <Option value={item.id} key={index}>{item.portfolioCompanyName}</Option>
                                                    })}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row
                                        justify="center" gutter={16}>
                                        <Col md={12} lg={12} sm={24}>
                                            <Form.Item
                                                name="fund"
                                                label={Strings.fundTitle}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: Strings.fundInputMessage,
                                                    },
                                                ]}
                                            >
                                                <Input
                                                    prefix={<MailOutlined className="" />}
                                                    placeholder={Strings.fundPlaceholder}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col md={12} lg={12} sm={24}>
                                            <Form.Item
                                                name="lastRound"
                                                label={Strings.lastRoundTitle}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: Strings.lastRoundInputMessage,
                                                    }, {
                                                        min: 1,
                                                        message: Strings.lastRoundInputMinLengthMessage,
                                                    },
                                                    {
                                                        max: 30,
                                                        message: Strings.lastRoundInputMaxLengthMessage,
                                                    },
                                                ]}
                                            >
                                                <Input
                                                    prefix={<MailOutlined className="" />}
                                                    placeholder={Strings.lastRoundPlaceholder}
                                                />
                                            </Form.Item>
                                        </Col>
                                        {/* <Col md={12} lg={12} sm={24}>
                                            <Form.Item
                                                name="offerPrice"
                                                label={Strings.offerPriceTitle}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: Strings.offerPriceInputMessage,
                                                    },
                                                    {
                                                        pattern: /(\d+(?:\.\d+)?)/,
                                                        message: Strings.onlyNumbersMessage
                                                    }
                                                ]}
                                            >
                                                <InputNumber
                                                    min={0}
                                                    onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                                                    onWheel={(e) => { e.currentTarget.blur() }}
                                                    prefix={<MailOutlined className="" />}
                                                    placeholder={Strings.offerPricePlaceholder}
                                                />
                                            </Form.Item>
                                        </Col> */}
                                        <Col md={12} lg={12} sm={24}>
                                            <Form.Item
                                                name="lastRoundValuation"
                                                label={Strings.lastRoundVTitle}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: Strings.lastRoundVInputMessage,
                                                    },
                                                    {
                                                        pattern: /(\d+(?:\.\d+)?)/,
                                                        message: Strings.onlyNumbersMessage
                                                    }

                                                ]}
                                            >
                                                <InputNumber min={0}
                                                    onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                                                    onWheel={(e) => { e.currentTarget.blur() }}
                                                    prefix={<MailOutlined className="" />}
                                                    placeholder={Strings.lastRoundVPlaceholder}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col md={12} lg={12} sm={24}>
                                            <Form.Item
                                                name="dealImpliedValuation"
                                                label={Strings.dealImpliedValuationTitle}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: Strings.dealImpliedValuationInputMessage
                                                    }
                                                ]}
                                            >
                                                <InputNumber
                                                    min={0}
                                                    prefix={<MailOutlined className="" />}
                                                    placeholder={Strings.dealImpliedValuationPlaceholder}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col md={12} lg={12} sm={24}>
                                            <Form.Item
                                                name="pricePerShare"
                                                label={Strings.pricePerShareTitle}
                                                rules={[
                                                    {
                                                        pattern: /(\d+(?:\.\d+)?)/,
                                                        message: Strings.onlyNumbersMessage
                                                    }
                                                ]}
                                            >
                                                <InputNumber
                                                    min={0}
                                                    onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                                                    onWheel={(e) => { e.currentTarget.blur() }}
                                                    prefix={<MailOutlined className="" />}
                                                    placeholder={Strings.pricePerSharePlaceholder}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col md={12} lg={12} sm={24}>
                                            <Form.Item
                                                name="pricePerUnit"
                                                label={Strings.pricePerUnitTitle}
                                                rules={[
                                                    {
                                                        pattern: /(\d+(?:\.\d+)?)/,
                                                        message: Strings.onlyNumbersMessage
                                                    }
                                                ]}
                                            >
                                                <InputNumber
                                                    min={0}
                                                    onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                                                    onWheel={(e) => { e.currentTarget.blur() }}
                                                    prefix={<MailOutlined className="" />}
                                                    placeholder={Strings.pricePerUnitPlaceholder}
                                                />
                                            </Form.Item>
                                        </Col>

                                        <Col md={12} lg={12} sm={24}>
                                            <Form.Item
                                                name='securityType'
                                                label={Strings.securityTypeTitle}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: Strings.securityTypeInputMessage,
                                                    }
                                                ]}
                                            >
                                                <Select placeholder={Strings.securityTypePlaceholder}>
                                                    {this.state.securityTypes.map((item, index) => {
                                                        return <Option value={item} key={index}>{item}</Option>
                                                    })}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col md={12} lg={12} sm={24}>
                                            <Form.Item
                                                name="totalShares"
                                                label={Strings.numberOfSharesTitle}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: Strings.numberOfSharesInputMessage,
                                                    },
                                                    {
                                                        pattern: /(\d+(?:\.\d+)?)/,
                                                        message: Strings.onlyNumbersMessage
                                                    }
                                                ]}
                                            >
                                                <InputNumber
                                                    min={0}
                                                    onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                                                    onWheel={(e) => { e.currentTarget.blur() }}
                                                    prefix={<MailOutlined className="" />}
                                                    placeholder={Strings.numberOfSharesPlaceholder}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col md={12} lg={12} sm={24}>
                                            <Form.Item
                                                name="isActive"
                                                label="is Active"
                                            >
                                                <Switch defaultChecked={this.state.opportunityData && this.state.opportunityData.isActive ? this.state.opportunityData.isActive : false} />
                                            </Form.Item>
                                        </Col>
                                        <Col md={12} lg={12} sm={24}>
                                            <Form.Item
                                                name="isFullySubscribed"
                                                label="is FullySubscribed"
                                            >
                                                <Switch defaultChecked={this.state.opportunityData && this.state.opportunityData.isFullySubscribed ? this.state.opportunityData.isFullySubscribed : false} />
                                            </Form.Item>
                                        </Col>
                                        <Col md={12} lg={12} sm={24} >
                                            {/* <label className="primary-details-label">Minimum Shares</label> */}
                                            <Form.Item label="Minimum Shares">
                                                <Input.Group compact>
                                                    <Form.Item
                                                        name={['minimumShares', 'key']}
                                                        noStyle
                                                    >
                                                        <Input style={{ width: '50%' }} placeholder="key" />
                                                    </Form.Item>
                                                    <Form.Item
                                                        name={['minimumShares', 'value']}
                                                        noStyle
                                                    >
                                                        <Input style={{ width: '50%' }} placeholder="value" />
                                                    </Form.Item>

                                                </Input.Group>
                                            </Form.Item>

                                            {/* <Form.List name="minimumShares" initialValue={this.state.minimumShares} > */}
                                            {/* <Space
                                                style={{ display: "flex", marginBottom: 8 }}
                                                align="center"
                                                className="primary-details-form"
                                            >
                                                <Form.Item
                                                    name={this.state.minimumShares.key}
                                                >
                                                    <Input placeholder="Key" />
                                                </Form.Item>
                                                <Form.Item
                                                    name={this.state.minimumShares.value}
                                                >
                                                    <Input placeholder="Value" />
                                                </Form.Item>
                                            </Space> */}
                                            {/* </Form.List> */}
                                        </Col>

                                        <Col md={12} lg={12} sm={24} key={this.state.primaryDetails ? this.state.primaryDetails : null}>
                                            <label className="primary-details-label">Primary Details</label>
                                            <Form.List name="primaryDetails" initialValue={this.state.primaryDetails} >
                                                {(fields, { add, remove }) => (
                                                    <>
                                                        {fields.map((field) => (
                                                            <Space
                                                                key={field.key}
                                                                style={{ display: "flex", marginBottom: 8 }}
                                                                align="center"
                                                                className="primary-details-form"
                                                            >
                                                                <Form.Item
                                                                    {...field}
                                                                    name={[field.name, "key"]}
                                                                    fieldKey={[field.fieldKey, "key"]}
                                                                >
                                                                    <Input placeholder="Key" />
                                                                </Form.Item>
                                                                <Form.Item
                                                                    {...field}
                                                                    name={[field.name, "value"]}
                                                                    fieldKey={[field.fieldKey, "value"]}
                                                                >
                                                                    <Input placeholder="Value" />
                                                                </Form.Item>
                                                                <MinusCircleOutlined onClick={() => remove(field.name)} />
                                                            </Space>
                                                        ))}
                                                        <Form.Item>
                                                            <Button
                                                                type="dashed"
                                                                onClick={() => add()}
                                                                block
                                                                icon={<PlusOutlined />}
                                                            >
                                                                Add item
                                                            </Button>
                                                        </Form.Item>
                                                    </>
                                                )}
                                            </Form.List>
                                        </Col>


                                        <Col sm={24} md={24} lg={24} className="save-section">
                                            <Button className="primary-button" htmlType="submit">{this.state.opportunityData && this.state.opportunityData.id ? Strings.saveButtonTitle : Strings.addButtonTitle}</Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(null, { addOpportunity, editOpportunity, getPortfolioCompanies, getCompaniesWithSkipLimit })(AddOpportunity);
