import React from 'react'
import Helmet from 'react-helmet'
import Header from '../../Components/Header'
import SideBar from '../../Components/SideBar'

export default function AddOpportunities() {
    return (
        <>
            <Helmet>
                <title>Add Opportunities | Founder</title>
                <meta name="description" content="Add Opportunities" />
            </Helmet>


            <SideBar />

            <div className="main">

                <Header
                    heading="Opportunities"
                    isBreadcrumb={true}
                    linkText="Add Oppotunity"
                    link="add-oppotunity"
                />

                <section className="topsec">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 pr-2">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="addoppotunity_wraper">
                                            <div className="head_section">
                                                <h2>Add Opportunity</h2>
                                                <p>Basic info</p>
                                            </div>
                                            <div className="opportunity_form row">
                                                <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                                    <div className="form_add">
                                                        <label>Company Name</label>
                                                        <select className="form-control">
                                                            <option>Select Company</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                                    <div className="form_add">
                                                        <label>Round</label>
                                                        <select className="form-control">
                                                            <option>Seed</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                                    <div className="form_add">
                                                        <label>Transaction Type</label>
                                                        <select className="form-control">
                                                            <option>Primary ( Shares brought from Company )", "Secondary ( Shares brought from Existing Share holders )</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                                    <div className="form_add">
                                                        <label>Round Size</label>
                                                        <input type="text" name placeholder="$" className="form-control" />
                                                    </div>
                                                </div>
                                                <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                                    <div className="form_add">
                                                        <label>Instrument</label>
                                                        <select className="form-control">
                                                            <option>Equity</option>
                                                            <option>Convertible Note</option>
                                                            <option>Safe</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                                    <div className="form_add">
                                                        <label>Valuation</label>
                                                        <input type="text" name placeholder="$" className="form-control" />
                                                    </div>
                                                </div>
                                                <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                                    <div className="form_add">
                                                        <label>Your Allocation</label>
                                                        <input type="text" name placeholder="$" className="form-control" />
                                                    </div>
                                                </div>
                                                <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                                    <div className="form_add">
                                                        <label>Pro RATA rights</label>
                                                        <div className="form-check">
                                                            <input type="radio" className="form-check-input" id="radio1" name="optradio" defaultValue="option1" defaultChecked />yes
                                                            <label className="form-check-label" htmlFor="radio1" />
                                                        </div>
                                                        <div className="form-check">
                                                            <input type="radio" className="form-check-input" id="radio2" name="optradio" defaultValue="option2" />No
                                                            <label className="form-check-label" htmlFor="radio2" />
                                                        </div>
                                                        <div className="form-check">
                                                            <input type="radio" className="form-check-input" disabled />Other
                                                            <label className="form-check-label" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                                    <div className="form_add">
                                                        <label>Target Closing Date</label>
                                                        <input type="Date" name placeholder="04/31/2022" className="form-control" />
                                                    </div>
                                                </div>
                                                <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                                    <div className="form_add">
                                                        <label>Minimum Investment</label>
                                                        <input type="text" name placeholder="$" className="form-control" />
                                                    </div>
                                                </div>
                                                <div className="investors_other">
                                                    <div className="head_section inves_head">
                                                        <p>Other Investors</p>
                                                        <h6>Co-Investors</h6>
                                                        <span>Who else is investing in this round?</span>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                                            <div className="form_add">
                                                                <label>Investor</label>
                                                                <input type="text" name placeholder="john@email.com" className="form-control" />
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-12 col-md-6 col-lg-3 col-xl-3">
                                                            <div className="form_add">
                                                                <label>Amount</label>
                                                                <input type="text" name placeholder="$" className="form-control" />
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-12 col-md-6 col-lg-3 col-xl-3">
                                                            <div className="form_add">
                                                                <div className="form-check">
                                                                    <input className="form-check-input" type="checkbox" id="check1" name="option1" defaultValue="something" defaultChecked />
                                                                    <label className="form-check-label">Lead</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="button_add">
                                                            <button>+ Add Co-Investor</button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="investors_other">
                                                    <div className="head_section inves_head">
                                                        <p>Memo</p>
                                                        <h6>Deal Memo</h6>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                                            <div className="form_add">
                                                                <div className="memo_box">
                                                                    <input type="text" name />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                                            <div className="form_add">
                                                                <label>Pitch Deck</label>
                                                                <div className="upload-btn-wrapper">
                                                                    <button className="btn">+ Upload</button>
                                                                    <input type="file" name="myfile" />
                                                                    <p className="format_file">*Max 30MB Size ( PDF, PPT )</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="investors_other">
                                                    <div className="head_section inves_head">
                                                        <p>Company Info</p>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6">
                                                            <div className="form_add">
                                                                <label>Select Company</label>
                                                                <select className="form-control">
                                                                    <option>Select Company</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-12 col-md-12 col-lg-1 col-xl-1">
                                                            <div className="form_add or_Bx">
                                                                <label>Or</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-12 col-md-12 col-lg-5 col-xl-5">
                                                            <div className="form_add">
                                                                <button className="create_button">+ Create</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="down_button">
                                                    <button className="cancel">Cancel</button>
                                                    <button>Save</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>


        </>
    )
}
