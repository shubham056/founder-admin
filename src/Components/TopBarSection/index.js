import React from 'react';
import Skeleton from 'react-loading-skeleton';

const TopBarSection = ({ isError, isLoading, dashboardStats }) => {
    return (
        <section className="topsec">
            <div className="container">
                <div className="row gy-1">
                    <div className="col-md-2 pr-0">
                        <div className="framecontent text-center">
                            <p>Raised</p>
                            <h3>{dashboardStats.raised || <Skeleton height={20} width={100} /> }</h3>
                        </div>
                    </div>
                    <div className="col-md-2 pr-0">
                        <div className="framecontent text-center">
                            <p>Rounds</p>
                            <h3>{dashboardStats.rounds || <Skeleton height={20} width={100} /> }</h3>
                        </div>
                    </div>
                    <div className="col-md-2 pr-0">
                        <div className="framecontent text-center">
                            <p>Total Investors</p>
                            <h3>{dashboardStats.tot_investors || <Skeleton height={20} width={100} /> }</h3>
                        </div>
                    </div>
                    <div className="col-md-2 pr-0">
                        <div className="framecontent text-center">
                            <p>Total Companies</p>
                            <h3>{dashboardStats.tot_companies || <Skeleton height={20} width={100} /> }</h3>
                        </div>
                    </div>
                    <div className="col-md-2 pr-0">
                        <div className="framecontent text-center">
                            <p>Add Company</p>
                            <h3>+</h3>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="framecontent active text-center">
                            <p>Create a Deal</p>
                            <h3>+</h3>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default TopBarSection;
