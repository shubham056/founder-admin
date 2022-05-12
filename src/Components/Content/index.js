import React from 'react'
import AllocationInfo from '../AllocationInfo'
import CompanyInfo from '../CompanyInfo'
import Investors from '../Investors/DashboardInvestortable'
import Orders from '../Orders'
import RoundInfo from '../RoundInfo'

export default function Content({ companyInfo, roundInfo, allocationInfoData, investorsData, ordersData }) {

  const { investors, isInvestorsError, isInvestorsLoading } = investorsData;
  const { orders, isOdersError, isOdersLoading } = ordersData;
  const { allocationInfo, isAllocationInfoError, isAllocationInfoLoading } = allocationInfoData;

  return (
    <section className="tablesec">
      <div className="container">
        <div className="row">
          <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 pr-2">
            <div className="card h-100">
              <div className="card-body">
                <form className="d-flex justify-content-start">
                  <div className="form-group">
                    <select className="form-control">
                      <option>Monsoon Creditech</option>
                      <option>Monsoon Creditech</option>
                      <option>Monsoon Creditech</option>
                      <option>Monsoon Creditech</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <select className="form-control">
                      <option>Series I</option>
                      <option>Series I</option>
                      <option>Series I</option>
                      <option />
                    </select>
                  </div>
                  <a href="/" className="view_">View →</a>
                </form>

                <div className="row">

                  <CompanyInfo companyInfo={companyInfo} />

                  <RoundInfo roundInfo={roundInfo} />

                </div>

                <AllocationInfo
                  isError={isAllocationInfoError}
                  isLoading={isAllocationInfoLoading}
                  allocationInfo={allocationInfo}
                />

              </div>
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 pl-2 mobview">

            <Investors
              isError={isInvestorsError}
              isLoading={isInvestorsLoading}
              investors={investors}
            />

            <Orders
              isError={isOdersError}
              isLoading={isOdersLoading}
              orders={orders}
            />

          </div>
        </div>
      </div>
    </section>

  )
}
