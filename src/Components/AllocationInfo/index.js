import React from 'react';

export default function AllocationInfo({ allocationInfo }) {
  

  return (
    <div className="contentborder mt-3">
      <h4>Allocation Info:</h4>
      <div className="table-responsive">
        <table className="table">
          <tbody>
            <tr>
              <td>Total Allocation:</td>
              <td>{allocationInfo.total_allocation}</td>
              <td />
              <td />
            </tr>
            <tr>
              <td>Total Subscribed:</td>
              <td>{allocationInfo.tot_subscribed}</td>
              <td>Total Subscribed:</td>
              <td>{allocationInfo.total_subscribed}</td>
            </tr>
            <tr>
              <td>Total Paid:</td>
              <td>{allocationInfo.tot_paid}</td>
              <td>Total Paid:</td>
              <td>{allocationInfo.total_paid}</td>
            </tr>
            <tr>
              <td>Remaining: </td>
              <td>{allocationInfo.remaning}</td>
              <td>Remaining: </td>
              <td>{allocationInfo.remanings}</td>
            </tr>
            <tr>
              <td />
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td />
            </tr>
            <tr>
              <td><a href="/" className="actbnt">Completed: {allocationInfo.completed}</a></td>
              <td><a href="/" className="progbnt">In Progress: {allocationInfo.in_process}</a></td>
              <td />
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
