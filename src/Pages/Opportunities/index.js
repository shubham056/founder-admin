import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { JSON_API } from '../../utils/Constants';
import { Helmet } from "react-helmet";
import OpportunitiesTable from '../../Components/Opportunities';
import Companies from '../../Components/Opportunities/Companies';
import CreateDeal from '../../Components/Opportunities/CreateDeal';
import SideBar from '../../Components/SideBar';
import Header from '../../Components/Header';

export default function Opportunities() {
    const [isLoading, setisLoading] = useState(true);
    const [isError, setisError] = useState(false);
    const [opportunitiesData, setOpportunitiesData] = useState([]);

    const getOpportunitiesData = async () => {
        axios.get(`${JSON_API}/opportunities_data`)
            .then(function (response) {
                setTimeout(() => {
                    setisLoading(false)
                    setOpportunitiesData(response.data)
                }, 1000);
            })
            .catch(function (error) {
                setisError(true)
                setisLoading(false)
                console.log(error);
            })
    };

    useEffect(() => {
        getOpportunitiesData();
    }, [])



    return (
        <>
            <Helmet>
                <title>Opportunities |Founder</title>
                <meta name="description" content="Opportunities" />
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
                            <div className="col-12 col-sm-12 col-md-9 col-lg-9 col-xl-9 pr-2">

                                <OpportunitiesTable
                                    isError={isError}
                                    isLoading={isLoading}
                                    opportunities={opportunitiesData}
                                />

                            </div>
                            <div className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 pl-2">

                                <CreateDeal />

                                <Companies />

                            </div>

                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}
