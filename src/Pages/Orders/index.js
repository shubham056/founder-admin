import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddInvestors from '../../Components/Investors/AddInvestors';
import InviteInvestors from '../../Components/Investors/InviteInvestors';
import { JSON_API } from '../../utils/Constants';
import { Helmet } from "react-helmet";
import OrdersTable from '../../Components/Orders/OrdersTable';
import SideBar from '../../Components/SideBar';
import Header from '../../Components/Header';

export default function Orders() {
  const [isLoading, setisLoading] = useState(true);
  const [isError, setisError] = useState(false);
  const [ordersData, setOrdersData] = useState([]);

  const getOrdersData = async () => {
    axios.get(`${JSON_API}/orders`)
      .then(function (response) {
        setTimeout(() => {
          setisLoading(false)
          setOrdersData(response.data)
        }, 1000);
      })
      .catch(function (error) {
        setisError(true)
        console.log(error);
      })
  };

  useEffect(() => {
    getOrdersData();
  }, [ordersData])


  return (
    <>
      <Helmet>
        <title>Investors |Founder</title>
        <meta name="description" content="Investors" />
      </Helmet>

      <SideBar/>

      <div className="main">

      <Header 
        heading="Orders"
        isBreadcrumb={true}
        linkText="List"
        link="orders"
      />

        <section className="topsec">
          <div className="container">
            <div className="row">
              <div className="col-12 col-sm-12 col-md-9 col-lg-9 col-xl-9 pr-2">

                <OrdersTable
                  isError={isError}
                  isLoading={isLoading}
                  orders={ordersData}
                />

              </div>
              <div className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 pl-2">

                <AddInvestors />

                <InviteInvestors />

              </div>
            </div>
          </div>
        </section>
      </div>

    </>
  )
}
