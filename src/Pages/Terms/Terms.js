import React, { Component } from 'react';
import { notification } from 'antd';
import { connect } from 'react-redux';
import { getUserData } from '../../Redux/Crud';
import { AppHeader, Footer } from '../../Components';
import './Terms.css';
import { Strings } from '../../Constants/Strings';
class Terms extends Component {
    constructor(props) {
        super(props)

        this.state = {
            user: null,
        }
    }
 // ***** NO NEED TO PULL UserData for Privacy and Terms 
 componentDidMount() {
    // this.getUserDetails()
 }
 //showing notification message
 showingMessage(type, message, title) {
    notification[type]({
        description: message,
    });
}
 getUserDetails() {
    if (localStorage.getItem('userData')) {
        let user = JSON.parse(localStorage.getItem('userData'));
        this.props.getUserData(user.id)
            .then(res => {
                if (res.type == Strings.successType) {
                    this.setState({
                        user: res.data
                    })
                    if (res.data && res.data.isVerified) {
                        // this.loadData(0);
                    } else {
                        this.props.history.push('/profile');
                        this.showingMessage(Strings.errorType, Strings.profileNotVerificationError, Strings.profileTitle)
                    }
                } else {
                    localStorage.clear();
                    this.props.history.push('/');
                }
            })
    } else {
        localStorage.clear();
        this.props.history.push('/');
    }
}
    render() {
        return (
            <div className='terms-conditions-main'>
                 <div key={this.state.user ? this.state.user : null}>
                    <AppHeader history={this.props.history} user={this.state.user} />
                </div>
                <div className='container'>
                    <div className='terms-content'>
                        <p className='about-company'>
<div class=" ">
		<h1> Terms and Conditions:</h1>
  <p>These Terms and Conditions of Use (this "<em><strong>Agreement</strong></em>") is a legal agreement between you and TopShelf Equity Partners LLC, a Delaware limited liability company (hereinafter referred to as "<em><strong>Website Owner</strong></em>"), the owner and developer of [https://www.topshelfequitypartners.com] (the “<em><strong>Site</strong></em>”). By registering for any service provided on the Site you become a user ("<em><strong>User</strong></em>") and you agree to be bound by all of the terms (the "<em><strong>Terms</strong></em>") set forth in this Agreement as long as you remain a User. IF YOU DO NOT AGREE TO THE TERMS, PLEASE DO NOT REGISTER FOR ANY SERVICE ON THE SITE. The Terms are subject to change at any time, effective upon notice to you.</p>
  <p>BY CLICKING THE "I AGREE" BUTTON, YOU AGREE THAT YOU HAVE READ, UNDERSTAND AND AGREE TO BE BOUND BY THE TERMS. THE MOST CURRENT VERSION OF THE TERMS, WHICH SUPERSEDES ALL PREVIOUS VERSIONS, CAN BE REVIEWED BY GOING TO [web address/link]. THE SITE RESERVES THE RIGHT TO CHANGE THE TERMS AT ANY TIME AND WITHOUT NOTICE TO YOU.</p>
  <h3 id="limitations-of-liability-and-indemnification">Limitations of Liability and Indemnification.</h3>
  <p>USER AGREES THAT THE SITE AND THE WEBSITE OWNER, ITS SUBSIDIARIES, AFFILIATES, LICENSORS, LICENSEES, SERVICE PROVIDERS, EMPLOYEES, AGENTS, OFFICERS, AND DIRECTORS WILL NOT BE LIABLE FOR ANY INCIDENTAL, DIRECT, INDIRECT, PUNITIVE, ACTUAL, CONSEQUENTIAL, SPECIAL, EXEMPLARY, OR OTHER DAMAGES, INCLUDING LOSS OF REVENUE OR INCOME, PAIN AND SUFFERING, EMOTIONAL DISTRESS, OR SIMILAR DAMAGES, EVEN IF THE SITE OR THE WEBSITE OWNER HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES, SUCH DAMAGES WERE REASONABLY FORESEEABLE OR WEBSITE OWNER WAS GROSSLY NEGLIGENT. IN NO EVENT WILL THE COLLECTIVE LIABILITY OF WEBSITE OWNER AND ITS SUBSIDIARIES, AFFILIATES, LICENSORS, SERVICE PROVIDERS, CONTENT PROVIDERS, EMPLOYEES, AGENTS, OFFICERS, AND DIRECTORS, REGARDLESS OF THE FORM OF ACTION (WHETHER IN CONTRACT, TORT, OR OTHERWISE), EXCEED THE FEES PAID BY CLIENT TO WEBSITE OWNER FOR THE APPLICABLE SERVICE OUT OF WHICH SUCH LIABILITY AROSE. To the extent any of the foregoing is unenforceable, the liability of Website Owner, its Subsidiaries, Affiliates, Licensors, Licensees, Service Providers, Employees, Agents, Officers, and Directors will be limited to the greatest extent permitted by applicable law.</p>
  <h3 id="responsibility-for-use-of-website">Responsibility for Use of Website.</h3>
  <p>You understand and agree that you are solely responsible for your actions and decisions to meet other people who you meet online by virtue of the services provided on the Site. You understand that the Site and Website Owner do not perform psychological testing or background checks on the individuals who may use the Site’s services. You understand and agree that you must take all reasonable precautions before meeting others through the service provided by the Site, which includes, but is not limited to: exchanging e-mail first before giving out any personal information and meeting in a public place.</p>
  <h3 id="do-not-rely-on-the-site">Do Not Rely on the Site.</h3>
  <p>Opinions, advice, statements or other comments should not necessarily be relied upon and are not to be construed as professional advice from the Site or Website Owner. the Site and Website Owner do not guarantee the accuracy or completeness of any of the information provided, and are not responsible for any loss resulting from your reliance on such information.</p>
  <h3 id="right-to-monitor">Right to Monitor.</h3>
  <p>the Site and Website Owner reserve the right, but are not obligated, to monitor materials posted in any public area and shall have the right to remove any information deemed offensive by our staff. Notwithstanding the foregoing, you remain solely responsible for your use of any information contained on the site. You understand and agree that if your use of the website’s services is determined by the Site, in its sole and reasonable discretion, to be offensive, obscene or otherwise improper, the Site can terminate your use of the website immediately without prior notice and without any right of refund, set-off or a hearing.</p>
  <h3 id="confidentiality">Confidentiality.</h3>
  <p>It is agreed that all personal information given to the Site or Website Owner, will be kept confidential by the Site and Website Owner, with the following exceptions: (1) basic biographical information (i.e. age, sex, race) will be posted with your user ID for others to view; (2) you actively chose to post your personal information for others to see; (3) you send a message to another client, which will disclose your e-mail address to that client or (4) you have harassed another person via any service provided by the Site, in which case the confidentiality clause contained in this Agreement is rendered null and void.</p>
  <h3 id="intellectual-property">Intellectual Property.</h3>
  <p>the Site and Website Owner own and retain all proprietary rights to the Site service, its trademarks and copyrights. Except for any information that is in the public domain, you are not authorized to reproduce, transmit or distribute the proprietary information of the Site and Website Owner. By posting information to the Site and Website Owner you represent that you have the right to grant permission for use by the Site and Website Owner.</p>
  <p>You acknowledge and agree that the website and any software or programs used with respect to any of the Site’s services contain proprietary and confidential information that is the property of Website Owner and is protected by applicable intellectual property and other laws. No rights or title of to any of the proprietary and confidential information on the Site or any software used in connection with any of its services is provided, transferred or assigned to you. You agree not to modify, rent, lease, loan, sell, distribute or create derivative works based on any of the Site’s services or software, in whole or in part. Trademarks, service marks, logos, and copyrighted works appearing in the Site are the property of the Website Owner. the Site retains all rights with respect to any intellectual property appearing on the website, and no rights in such materials are transferred or assigned to you.</p>
  <h3 id="no-warranties">No Warranties.</h3>
  <p>THE USE OF the Site AND ANY SERVICE IT PROVIDES IS AT YOUR SOLE RISK. THE WEBSITE SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. the Site EXPRESSLY DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. the Site MAKES NO WARRANTY THAT (1) THE SERVICES WILL MEET YOUR REQUIREMENTS, (2) THE SERVICES WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE, (3) THE RESULTS OF USING THE SERVICES WILL BE ACCURATE OR RELIABLE, (4) THE QUALITY OF SERVICES WILL MEET YOUR EXPECTATIONS, OR (5) THAT ANY ERRORS IN THE SOFTWARE UTILIZED BY THE SERVICES WILL BE CORRECTED.</p>
  <h3 id="jurisdiction">Jurisdiction.</h3>
  <p>This Agreement or any dispute arising from this Agreement is governed by the laws of Delaware, without regard to provisions of conflicts of law. Any lawsuit arising from or related to this Agreement shall be brought exclusively in the State Courts or Federal District Courts located in the State of Texas, city of Dallas, and you hereby consent to the jurisdiction of any such court.</p>
  <p>YOU AGREE THAT REGARDLESS OF ANY STATUTE OR LAW TO THE CONTRARY, ANY CLAIM OR CAUSE OF ACTION ARISING OUT OF OR RELATED TO USE OF THIS WEBSITE OR THIS AGREEMENT MUST BE FILED WITHIN ONE (1) YEAR AFTER SUCH CLAIM OR CAUSE OF ACTION AROSE OR BE FOREVER BARRED.</p>
  <h3 id="severability">Severability.</h3>
  <p>If any part of this Agreement is found by a court of competent jurisdiction to be unlawful, void or unenforceable, that part will be deemed severable and will not affect the validity and enforceability of any remaining provisions. In addition, in such event the unenforceable or invalid provision shall be deemed to be modified to the extent necessary to (i) render it valid and enforceable and (ii) give the fullest effect possible to the original intent of the provision.</p>
  <h3 id="certification">Certification.</h3>
  <p>You certify that you are at least 18 years of age and that your answers to the registration materials on the Site will be truthful. In accessing and using the Site, you understand and agree that basic information concerning you, given to the Site, will be published on the web-site for others to view along with your User ID. Your name, address and e-mail address are kept confidential, except where provided above.</p>
  <h3 id="entire-agreement">Entire Agreement.</h3>
  <p>This Agreement constitutes your entire Agreement with the Site and Website Owner with respect to any services.</p>
  <h3 id="waiver">Waiver.</h3>
  <p>The failure of Website or Website Owner to exercise or enforce any right or provision of this Agreement shall not operate as a waiver of such right or provision. Any waiver of this Agreement by Website or Website Owner must be in writing and signed by an authorized representative of the Website Owner.</p>
  <p>You further understand and agree that clicking or pressing on the "I agree" is the electronic equivalent of a written signature on this document.</p>
</div>
		
                        </p>
                    </div>
                </div>
                <Footer history={this.props.history} />
            </div>
        )
    }
}
export default connect(null, {getUserData})(Terms);
