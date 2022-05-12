import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TopBarSection from '../../Components/TopBarSection';
import Content from '../../Components/Content';
import { JSON_API } from '../../utils/Constants';
import { Helmet } from "react-helmet";
import SideBar from '../../Components/SideBar';
import Header from '../../Components/Header';
import { connect } from 'react-redux';
import { updateProfile, getUserData, getUserDataProfile, getUserDataLean, uploadImage, uploadSecureFiles, getSignedUrls, getUserDocuments } from '../../Redux/Crud';


const Dashboard = ()=> {
    const [isdashboardStatsLoading, setisdashboardStatsLoading] = useState(true);
    const [isdashboardStatsError, setisdashboardStatsError] = useState(false);
    const [dashboardStats, setDashboardStats] = useState([]);

    const [companyInfo, setCompanyInfo] = useState([]);
    const [roundInfo, setRoundInfo] = useState([]);

    const [isAllocationInfoLoading, setIsAllocationInfoLoading] = useState(true);
    const [isAllocationInfoError, setIsAllocationInfoError] = useState(false);
    const [allocationInfo, setAllocationInfo] = useState([]);

    const [isInvestorsLoading, setIsInvestorsLoading] = useState(true);
    const [isInvestorsError, setIsInvestorsError] = useState(false);
    const [investors, setInvestors] = useState([]);

    const [isOdersLoading, setIsOdersLoading] = useState(true);
    const [isOdersError, setIsOdersError] = useState(false);
    const [orders, setOrders] = useState([]);

    const getDashboardStats = async () => {

        axios.get(`${JSON_API}/dashboard_stats`)
            .then(function (response) {
                setisdashboardStatsLoading(false)
                setDashboardStats(response.data[0])
            })
            .catch(function (error) {
                setisdashboardStatsError(true)
                console.log(error);
            })
    };

    const getCompanyInfo = async () => {
        axios.get(`${JSON_API}/company_info`)
            .then(function (response) {
                setCompanyInfo(response.data[0])
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
    };

    const getRoundInfo = async () => {
        axios.get(`${JSON_API}/round_info`)
            .then(function (response) {
                setRoundInfo(response.data[0])
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
    };

    const getAllocationInfo = async () => {
        axios.get(`${JSON_API}/allocation_info`)
            .then(function (response) {
                setAllocationInfo(response.data[0]);
                setIsAllocationInfoLoading(false)
            })
            .catch(function (error) {
                setIsAllocationInfoError(true)
                console.log(error);
            })
    };

    const getInvestorsData = async () => {
        axios.get(`${JSON_API}/investors`)
            .then(function (response) {
                setInvestors(response.data)
                setIsInvestorsLoading(false)
            })
            .catch(function (error) {
                setIsInvestorsError(true)
                console.log(error);
            })
    };

    const getOrdersData = async () => {
        axios.get(`${JSON_API}/orders`)
            .then(function (response) {
                setOrders(response.data)
                setIsOdersLoading(false)
            })
            .catch(function (error) {
                setIsOdersError(true)
                console.log(error);
            })
    };


    useEffect(() => {
        getDashboardStats();
        getCompanyInfo();
        getRoundInfo();
        getAllocationInfo();
        getInvestorsData();
        getOrdersData();
    }, [])

    return (
        <>
            <Helmet>
                <title>Dashboard |Founder</title>
                <meta name="description" content="Dashboard" />
            </Helmet>


            <SideBar />

            <div className='main'>

                <Header heading={"Dashboard"} />

                <TopBarSection
                    isError={isdashboardStatsError}
                    isLoading={isdashboardStatsLoading}
                    dashboardStats={dashboardStats}
                />

                <Content
                    companyInfo={companyInfo}
                    roundInfo={roundInfo}
                    allocationInfo={allocationInfo}
                    isInvestorsError={isInvestorsError}
                    isInvestorsLoading={isInvestorsLoading}
                    allocationInfoData={{
                        isAllocationInfoError,
                        isAllocationInfoLoading,
                        allocationInfo
                    }}
                    ordersData={{
                        isOdersError,
                        isOdersLoading,
                        orders
                    }}
                    investorsData={{
                        isInvestorsError,
                        isInvestorsLoading,
                        investors
                    }}
                />

            </div>

        </>
    )
}

const mapStateToProps = state => {
    return {
        user: state.investors.loggedUserDetails ? state.investors.loggedUserDetails : {},
    }
};
export default connect(mapStateToProps, { updateProfile, getUserData, uploadImage, uploadSecureFiles, getSignedUrls, getUserDocuments,getUserDataProfile })(Dashboard);