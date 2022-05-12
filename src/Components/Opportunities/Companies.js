import React from 'react'

export default function Companies() {
    return (
        <div className="card mt-3">
            <div className="card-body">
                <h3>Companies</h3>
                <div className="comboxright">
                    <h3>Monsoon Creditech</h3>
                    <span>Fintech</span>
                    <span>04-02-2022</span>
                    <span>3 Rounds</span>
                    <p className="view_point"><a href>View →</a></p>
                </div>
                <div className="comboxright">
                    <h3>My Jar App</h3>
                    <span>Fintech</span>
                    <span>03-07-2022</span>
                    <span>1 Rounds</span>
                    <p className="view_point"><a href>View →</a></p>
                </div>
                <div className="form-group text-right">
                    <button type="button" className="btn btn-primary">+ Add Company</button>
                </div>
            </div>
        </div>
    )
}
