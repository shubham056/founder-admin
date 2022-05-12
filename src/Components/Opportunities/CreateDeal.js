import React from 'react'

export default function CreateDeal() {
    return (
        <div className="card">
            <div className="card-body">
                <h3>Create a Deal</h3>
                <span className="short_text">It takes 2 min to create a deal and to publish on topshelf</span>
                <form className="right_bar">
                    <div className="form-group">
                        <label>Company</label>
                        <select className="form-control">
                            <option>Select Company</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Round Name</label>
                        <input type="email" name="Iname" className="form-control" placeholder="Round Name" />
                    </div>
                    <div className="form-group text-right">
                        <button type="button" className="btn btn-primary">+ Create</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
