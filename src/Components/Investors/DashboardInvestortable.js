import React from 'react';
import Skeleton from 'react-loading-skeleton';

export default function DashboardInvestortable({ isError, isLoading, investors }) {

  let investorsJsx;
  if (isLoading) {
    investorsJsx = Array(5).fill(0).map(item => (
      <tr>
        <td style={{ display: 'block' }}><Skeleton /></td>
        <td><Skeleton /></td>
        <td><Skeleton /></td>
        <td><Skeleton /></td>
        <td><Skeleton /></td>
      </tr>
    ))
  } else {
    if (typeof investors != "undefined" && investors !== null && investors.length > 0) {
      investorsJsx = investors.map(item => (
        <tr>
          <td>{item.id}</td>
          <td>{item.name}</td>
          <td>{item.email}</td>
          <td>{item.phone}</td>
          <td><img src={(item.status === "true") ? "assets/images/active.png" : "assets/images/pendding.png"} alt="img" /> {(item.status === "true") ? "Active" : "Pending"}</td>
        </tr>
      ))
    } else {
      investorsJsx = (
        <tr>
          <td>No investors found</td>
        </tr>
      )
    }
  }
  if(isError){
    investorsJsx = (
        <tr>
            <td>Internal Server error</td>
        </tr>
    )
}


  return (
    <div className="card">
      <div className="card-body tablearea">
        <h4>Investors</h4>
        <a href="/" className="view_">See all</a>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>

              {investorsJsx}

            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
