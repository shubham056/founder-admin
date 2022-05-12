import React from 'react'

export default function InvestorsContent() {
  return (
   <div className="main">
  <header className="tophdr">
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <div className="pagetitle">
            <h2>Investors</h2>
            {/* <p>Investors/List</p> */}
          </div>
        </div>
        <div className="col-md-6">
          <div className="userimg text-right">
            <ul>
              <li className="frame1" />
              <li className="frame"><a href="/"><span className="round" /> John Mathew</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </header>  
  <section className="topsec">
    <div className="container">
      <div className="row">
        <div className="col-12 col-sm-12 col-md-9 col-lg-9 col-xl-9 pr-2">
          <div className="card">
            <div className="card-body">
              <div className="table-responsive tablearea2">
                <table className="table">
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
                    <tr>
                      <td>1 <input type="checkbox" name /></td>
                      <td>Mark Cubert</td>
                      <td>mark@email.com</td>
                      <td>+1 3747494046</td>
                      <td><img src="assets/images/pendding.png" alt="img" /> Pending</td>
                    </tr>
                    <tr>
                      <td>2 <input type="checkbox" name /></td>
                      <td>John Depp</td>
                      <td>JD@email.com</td>
                      <td>+1 3747494046</td>
                      <td><img src="assets/images/active.png" alt="img" /> Active</td>
                    </tr>
                    <tr>
                      <td>3 <input type="checkbox" name /></td>
                      <td>Deric Boseman</td>
                      <td>DericB@email.com</td>
                      <td>+1 3747494046</td>
                      <td><img src="assets/images/active.png" alt="img" /> Active</td>
                    </tr>
                    <tr>
                      <td>4 <input type="checkbox" name /></td>
                      <td>Capario Muler</td>
                      <td>cap@email.com</td>
                      <td>+1 3747494046</td>
                      <td><img src="assets/images/active.png" alt="img" /> Active</td>
                    </tr>
                    <tr>
                      <td>5 <input type="checkbox" name /></td>
                      <td>Ikaris Kiijs</td>
                      <td>ik@email.com</td>
                      <td>+1 3747494046</td>
                      <td><img src="assets/images/active.png" alt="img" /> Active</td>
                    </tr>
                    <tr>
                      <td>6 <input type="checkbox" name /></td>
                      <td>Dinesh Kubser</td>
                      <td>dine@email.com</td>
                      <td>+1 3747494046</td>
                      <td><img src="assets/images/pendding.png" alt="img" /> Active</td>
                    </tr>
                    <tr>
                      <td>7 <input type="checkbox" name /></td>
                      <td>Asif Altaf</td>
                      <td>asif@email.com</td>
                      <td>+1 3747494046</td>
                      <td><img src="assets/images/pendding.png" alt="img" /> Active</td>
                    </tr>
                    <tr>
                      <td>8 <input type="checkbox" name /></td>
                      <td>Mark Cubert</td>
                      <td>mark@email.com</td>
                      <td>+1 3747494046</td>
                      <td><img src="assets/images/pendding.png" alt="img" /> Active</td>
                    </tr>
                    <tr>
                      <td>9 <input type="checkbox" name /></td>
                      <td>John Depp</td>
                      <td>JD@email.com</td>
                      <td>+1 3747494046</td>
                      <td><img src="assets/images/active.png" alt="img" /> Active</td>
                    </tr>
                    <tr>
                      <td>10 <input type="checkbox" name /></td>
                      <td>Deric Boseman</td>
                      <td>DericB@email.com</td>
                      <td>+1 3747494046</td>
                      <td><img src="assets/images/active.png" alt="img" /> Active</td>
                    </tr>
                    <tr>
                      <td>11 <input type="checkbox" name /></td>
                      <td>Mark Cubert</td>
                      <td>mark@email.com</td>
                      <td>+1 3747494046</td>
                      <td><img src="assets/images/pendding.png" alt="img" /> Active</td>
                    </tr>
                    <tr>
                      <td>12 <input type="checkbox" name /></td>
                      <td>Ikaris Kiijs</td>
                      <td>ik@email.com</td>
                      <td>+1 3747494046</td>
                      <td><img src="assets/images/active.png" alt="img" /> Active</td>
                    </tr>
                    <tr>
                      <td>13 <input type="checkbox" name /></td>
                      <td>Dinesh Kubser</td>
                      <td>dine@email.com</td>
                      <td>+1 3747494046</td>
                      <td><img src="assets/images/pendding.png" alt="img" /> Active</td>
                    </tr>
                    <tr>
                      <td>14 <input type="checkbox" name /></td>
                      <td>Ikaris Kiijs</td>
                      <td>ik@email.com</td>
                      <td>+1 3747494046</td>
                      <td><img src="assets/images/active.png" alt="img" /> Active</td>
                    </tr>
                    <tr>
                      <td>15 <input type="checkbox" name /></td>
                      <td>Ikaris Kiijs</td>
                      <td>ik@email.com</td>
                      <td>+1 3747494046</td>
                      <td><img src="assets/images/active.png" alt="img" /> Active</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 pl-2">
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
        </div>
      </div>
    </div>
  </section>
</div>

  )
}
