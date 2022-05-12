import React from 'react'

export default function InviteInvestors() {
  return (
    <div className="card mt-3">
                  <div className="card-body">
                    <h3>Invite Investors</h3>
                    <form>
                      <div className="form-group">
                        <label>Email</label>
                        <input type="text" name="sname" className="form-control" placeholder="Search Name Here" />
                        <input type="text" name="Iname" className="form-control" placeholder="Email" />
                      </div>
                      <div className="form-group">
                        <label>Select Round</label>
                        <select className="form-control">
                          <option>Monsoon Creditech</option>
                          <option>Monsoon Creditech</option>
                          <option>Monsoon Creditech</option>
                        </select>
                        <select className="form-control">
                          <option>Series I</option>
                          <option>Series I</option>
                          <option>Series I</option>
                        </select>
                      </div>
                      <div className="form-group text-right">
                        <button type="button" className="btn btn-primary">+ Add</button>
                      </div>
                    </form>
                  </div>
                </div>
  )
}
