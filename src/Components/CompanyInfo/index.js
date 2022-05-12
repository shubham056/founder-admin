import React from 'react';

export default function CompanyInfo({ companyInfo }) {

  return (
    <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 pr-2">
      <div className="contentborder">
        <div className="d-flex justify-content-between align-items-center">
          <h4>Company Info:</h4>
          <a href="/" className="actbnt">Active</a>
        </div>
        <ul>
          <li>Company: <span>{companyInfo.name}</span></li>
          <li>Round:<span className="btntype">{companyInfo.round}</span></li>
          <li>Instrument Type:<span className="btntype">{companyInfo.instrument_type}</span></li>
          <li>Transaction Type:<span className="btntype">{companyInfo.transaction_type}</span></li>
          <li>Category:<span className="btntype">{companyInfo.category}</span></li>
        </ul>
      </div>
    </div>
  )
}
