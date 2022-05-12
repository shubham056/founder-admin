import React from 'react';

export default function RoundInfo({ roundInfo }) {

  return (
    <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 pl-2">
      <div className="contentborder">
        <div className="d-flex justify-content-between align-items-center">
          <h4>Round Info:</h4>
          <span style={{ fontSize: 12 }}>{roundInfo.date}</span>
        </div>
        <ul>
          <li>Total Investors: <span>{roundInfo.total_investors}</span></li>
          <li>Allocation:<span>{roundInfo.allocation}</span></li>
          <li>Minimum Investment:<span>{roundInfo.minimum_investment}</span></li>
          <li>Transaction Type:<span>{roundInfo.transaction_type}</span></li>
          <li>End Date:<span>{roundInfo.end_date}</span></li>
        </ul>
      </div>
    </div>
  )
}
