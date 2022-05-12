import React, { Suspense } from 'react';
import { withRouter } from 'react-router-dom';
import { PrivateRoute, AuthRoute } from './PrivateRoute';
// import {  Route } from 'react-router-dom';


//importing all pages
import {
    Login, Register,  ForgotPassword, SecurityCode, InvesterOpportunities,
    AdminOrders, AdminInvestorPortfolio, InvesterIndividual, Profile,
    DealInvestmentOpportunity, AdminInvestors, HoldingDetails, ExpressIntrest,OpportunitySuccess,
    ResetPassword, AdminOpportunities, AddOpportunity, ViewOpportunity, MyHoldings, DocumentPermissions,
    AdminCompanyList, AdminCompanyAddEdit, AdminOrderDetails, EditProfile, EditEntity, AddJoinInvester, LegelData, SignupSuccess, PasswordSuccess, Terms, Privacy, ForgotPasswordSuccess
} from '../Pages';

import Dashboard from '../Pages/Dashboard';
import Investors from '../Pages/Invertors';
import Opportunities from '../Pages/Opportunities';
import Orders from '../Pages/Orders';
import AddOpportunities from '../Pages/Opportunities/AddOpportunities';

//initializing routes 
const Routes = () => {
    return (
        <Suspense >
            <AuthRoute exact path='/' component={Login} ></AuthRoute>
            <AuthRoute exact path='/signup-success' component={SignupSuccess} ></AuthRoute>
            {/* <AuthRoute exact path='/password-success' component={PasswordSuccess} ></AuthRoute>             */}
            
            <PrivateRoute exact path='/password-success' component={PasswordSuccess} ></PrivateRoute>            
            <AuthRoute path='/forgot-password-success' component={ForgotPasswordSuccess} ></AuthRoute>
            <AuthRoute path='/register' component={Register} ></AuthRoute>
            <AuthRoute path='/forgot' component={ForgotPassword} ></AuthRoute>
            <AuthRoute path="/resetPassword:id" component={ResetPassword}></AuthRoute>
            <AuthRoute path="/createPassword:email" component={ResetPassword}></AuthRoute>
            <AuthRoute path="/security" component={SecurityCode}></AuthRoute>
            <PrivateRoute path="/profile" component={Profile}></PrivateRoute>
            <PrivateRoute path="/basic-info" component={LegelData} ></PrivateRoute>
            <PrivateRoute path="/edit-profile" component={EditProfile}></PrivateRoute>
            <PrivateRoute path="/edit-joint-investor" component={AddJoinInvester}></PrivateRoute>
            <PrivateRoute path="/edit-entity" component={EditEntity}></PrivateRoute>
            {/* investor */}
            <PrivateRoute path='/investor-opportunities' component={InvesterOpportunities} ></PrivateRoute>
            <PrivateRoute path='/my-holdings' component={MyHoldings}></PrivateRoute>
            <PrivateRoute path='/holding-details' component={HoldingDetails}></PrivateRoute>
            <PrivateRoute path='/verify' component={ExpressIntrest}></PrivateRoute>
            <PrivateRoute path='/success' component={OpportunitySuccess}></PrivateRoute>
            <PrivateRoute path="/investor-individual" component={InvesterIndividual}></PrivateRoute>
            <PrivateRoute path="/deal-investment" component={DealInvestmentOpportunity}></PrivateRoute>  
            <PrivateRoute path="/document-permissions" component={DocumentPermissions}></PrivateRoute>
            <PrivateRoute path="/terms" component={Terms}></PrivateRoute>
            <PrivateRoute path="/privacy" component={Privacy}></PrivateRoute>

            <PrivateRoute path="/dashboard" component={Dashboard}></PrivateRoute>
            <PrivateRoute path="/investor" component={Investors}></PrivateRoute>
            <PrivateRoute path="/opportunities" component={Opportunities}></PrivateRoute>
            <PrivateRoute path="/add-oppotunity" component={AddOpportunities}></PrivateRoute>
            <PrivateRoute path="/orders" component={Orders}></PrivateRoute>
            {/* <Route component={NotFound} /> */}
        </Suspense>
    )
}

//exporting all routes
export default withRouter(Routes);
