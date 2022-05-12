import React from 'react';
import Skeleton from 'react-loading-skeleton';

export default function Orders({ isError, isLoading, orders }) {

  let ordersJsx;
  if (isLoading) {
    ordersJsx = Array(5).fill(0).map(item => (
      <tr>
        <td style={{ display: 'block' }}><Skeleton /></td>
        <td><Skeleton /></td>
        <td><Skeleton /></td>
        <td><Skeleton /></td>
        <td><Skeleton /></td>
      </tr>
    ))
  } else {
    if (typeof orders != "undefined" && orders !== null && orders.length > 0) {
      ordersJsx = orders.map(item => (
        <tr>
          <td>{item.id}</td>
          <td>{item.name}</td>
          <td>{item.amount}</td>
          <td>{item.round}</td>
          <td><img src={(item.status === "1") ? "assets/images/active.png" : "assets/images/pendding.png"} alt="img" /> {(item.status === "1") ? "Active" : "Pending"}</td>
        </tr>
      ))
    } else {
      ordersJsx = (
        <tr>
          <td>No investors found</td>
        </tr>
      )
    }
  }


  return (
    <div className="card mt-2">
      <div className="card-body tablearea2">
        <h4>Orders</h4>
        <a href="/" className="view_">See all</a>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Amount</th>
                <th>Round</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>

              {ordersJsx}

            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
