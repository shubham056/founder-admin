import React from 'react'

export default function AddInvestors() {
  return (
    <div className="card">
      <div className="card-body">
        <h3>Add an Investor</h3>
        <form>
          <div className="form-group">
            <label>Name</label>
            <input type="text" name="Iname" className="form-control" placeholder="Investor Name" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="Iname" className="form-control" placeholder="Email Address" />
          </div>
          <div className="form-group text-right">
            <button type="button" className="btn btn-primary">+ Add</button>
          </div>
        </form>
      </div>
    </div>
  )
}
