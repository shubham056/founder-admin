import axios from 'axios';
import { Constants } from '../Constants/Constants.js';
import { Strings } from '../Constants/Strings.js';
//import {genSaltSync, hashSync} from 'bcrypt';

const URL = Constants.baseURL;

// login
export function login(queryParams) {

//const bcrypt = require('bcrypt');
//const saltRounds = 10;
//const myPlaintextPassword = queryParams.password;
//const salt = bcrypt.genSaltSync(saltRounds);
//const hash = bcrypt.hashSync(myPlaintextPassword, salt);

//queryParams.password = "Rishik@2021";

//	console.log(hash);
// console.log(queryParams.password);


    return dispatch => {
        return axios.post(`${URL}` + '/users/login', queryParams)
            .then(response => {
                if (response.data) {
                    return response.data;
                } else {
                    return { type: Strings.errorType, message:"My Error" }
                }
            })
            .catch(err => {
                return { type: Strings.errorType, message: Strings.networkErrorMessage }
            })
    }
}

// checkOtp
export function checkOtp(queryParams) {
    return dispatch => {
        return axios.post(`${URL}` + '/users/mobileNumberAuth', queryParams)
            .then(response => {
                if (response.data) {
                    return response.data;
                } else {
                    return { type: Strings.errorType, message: Strings.networkErrorMessage }
                }
            })
            .catch(err => {
                return { type: Strings.errorType, message: Strings.networkErrorMessage }
            })
    }
}

// get user data by email
export function getUserByUserEmail(queryParams) {
    return dispatch => {
        return axios.post(`${URL}` + '/users/getUserByUserEmail', queryParams)
            .then(response => {
                if (response.data) {
                    return response.data;
                } else {
                    return { type: Strings.errorType, message: Strings.networkErrorMessage }
                }
            })
            .catch(err => {
                return { type: Strings.errorType, message: Strings.networkErrorMessage }
            })
    }
}

//signup
export function signUp(queryParams) {
    return dispatch => {
        return axios.post(`${URL}` + '/users/registration', queryParams)
            .then(response => {
                if (response.data) {
                    return response.data;
                } else {
                    return { type: Strings.errorType, message: Strings.networkErrorMessage }
                }
            })
            .catch(err => {
                return { type: Strings.errorType, message: Strings.networkErrorMessage }
            })
    }
}

//forgot password 
export function forgotPassword(queryParams) {
    return dispatch => {
        return axios.post(`${URL}` + '/users/forgotPassword', queryParams)
            .then(response => {
                if (response.data) {
                    return response.data;
                } else {
                    return { type: Strings.errorType, message: Strings.networkErrorMessage }
                }
            })
            .catch(err => {
                return { type: Strings.errorType, message: Strings.networkErrorMessage }
            })
    }
}

// create password
export function setNewPassword(queryParams) {
    return dispatch => {
        return axios.post(`${URL}` + '/users/setNewPassword', queryParams)
            .then(response => {
                if (response.data) {
                    return response.data;
                } else {
                    return { type: Strings.errorType, message: Strings.networkErrorMessage }
                }
            })
            .catch(err => {
                return { type: Strings.errorType, message: Strings.networkErrorMessage }
            })
    }
}

//get Opportunities  
export function getOpportunities(queryParams) {
    const Authorization = { headers: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).accessToken } };
    return dispatch => {
        return axios.post(URL + '/opportunities/getAllOpportunitiesEnhanced', queryParams, Authorization)
            .then(response => {
                if (response.status === 200) {
                    return response.data;
                } else {
                    return dispatch({ type: 'ERROR', payload: { data: [], totalCount: 0 } });
                }
            })
            .catch(err => {
                return dispatch({ type: 'ERROR', payload: { data: [], totalCount: 0 } });
            })
    }
}

//get users  
export function getUsers(queryParams) {
    const Authorization = { headers: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).accessToken } };
    return dispatch => {
        return axios.get(URL + '/users/getAllUsers/' + queryParams.skip + '/' + queryParams.limit, Authorization)
            .then(response => {
                if (response.status === 200) {
                    return dispatch({ type: 'GET_INVESTORS', payload: response.data.data });
                } else {
                    return dispatch({ type: 'ERROR', payload: { data: [], totalCount: 0 } });
                }
            })
            .catch(err => {
                return dispatch({ type: 'ERROR', payload: { data: [] } });
            })
    }
}

//get user data by id
export function getUserData(queryParams) {
    const Authorization = { headers: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).accessToken } };
    return dispatch => {
        return axios.get(`${URL}` + '/users/getUserByUserId/' + queryParams, Authorization)
            .then(response => {
                return response.data;
            })
            .catch(err => {
                return { type: Strings.errorType, message: Strings.networkErrorMessage };
            })
    }
}

//Sateesh added this code
export function getUserDataLean(queryParams) {
    const Authorization = { headers: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).accessToken } };
    return dispatch => {
        return axios.get(`${URL}` + '/users/getUserByUserIdLean/' + queryParams, Authorization)
            .then(response => {
                return response.data;
            })
            .catch(err => {
                return { type: Strings.errorType, message: Strings.networkErrorMessage };
            })
    }

}

export function getUserDataProfile(queryParams) {
    const Authorization = { headers: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).accessToken } };
    return dispatch => {
        return axios.get(`${URL}` + '/users/getUserByIdProfileLean/' + queryParams, Authorization)
            .then(response => {
                return response.data;
            })
            .catch(err => {
                return { type: Strings.errorType, message: Strings.networkErrorMessage };
            })
    }

}




//update user data
export function updateProfile(queryParams) {
    console.log(queryParams, 135)
    const Authorization = { headers: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).accessToken } };
    return dispatch => {
        return axios.post(`${URL}` + '/users/updateUserByUserId', queryParams, Authorization)
            .then(response => {
                return response.data;
            })
            .catch(err => {
                return { type: Strings.errorType, message: Strings.networkErrorMessage };
            })
    }
}

//upload images
export function uploadImage(queryParams) {
    const Authorization = { headers: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).accessToken } };
    return dispatch => {
        return axios.post(`${URL}` + '/uploadImage', queryParams, Authorization)
            .then(response => {
                return response.data;
            })
            .catch(err => {
                return { type: Strings.errorType, message: Strings.networkErrorMessage };
            })
    }
}

//upload files
export function uploadSecureFiles(queryParams) {
    const Authorization = { headers: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).accessToken } };
    return dispatch => {
        return axios.post(`${URL}` + '/uploadSecuredDocuments', queryParams, Authorization)
            .then(response => {
                return response.data;
            })
            .catch(err => {
                return { type: Strings.errorType, message: Strings.networkErrorMessage };
            })
    }
}

//get files
export function getSignedUrls(queryParams) {
    const Authorization = { headers: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).accessToken } };
    return dispatch => {
        return axios.post(`${URL}` + '/getSignedUrl', queryParams, Authorization)
            .then(response => {
                return response.data;
            })
            .catch(err => {
                return { type: Strings.errorType, message: Strings.networkErrorMessage };
            })
    }
}

//add express intrest
export function addExpressInterest(queryParams) {
    const Authorization = { headers: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).accessToken } };
    return dispatch => {
        return axios.post(`${URL}` + '/express-interests/addNewExpressInterest', queryParams, Authorization)
            .then(response => {
                return response.data;
            })
            .catch(err => {
                return { type: Strings.errorType, message: Strings.networkErrorMessage };
            })
    }
}

// get all express intrests
export function getAllOrders(queryParams) {
    const Authorization = { headers: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).accessToken } };
    return dispatch => {
        return axios.post(URL + '/express-interests/getAllExpressInterests', queryParams, Authorization)
            .then(response => {
                if (response.status === 200) {
                    if (response.data) {
                        return dispatch({ type: 'GET_ORDERS', payload: response.data.data });

                    } else {
                        return dispatch({ type: 'ERROR', payload: { data: [], totalCount: 0 } });
                    }
                } else {
                    return dispatch({ type: 'ERROR', payload: { data: [], totalCount: 0 } });
                }
            })
            .catch(err => {
                return dispatch({ type: 'ERROR', payload: { data: [], totalCount: 0 } });
            })
    }
}

// get particular investor express intrests
export function getInvestorsOrders(queryParams) {
    const Authorization = { headers: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).accessToken } };
    return dispatch => {
        return axios.post(URL + '/express-interests/getByInvestorId', queryParams, Authorization)
            .then(response => {
                if (response.status === 200) {
                    if (response.data) {
                        return dispatch({ type: 'GET_ORDERS', payload: response.data.data });

                    } else {
                        return dispatch({ type: 'ERROR', payload: { data: [], totalCount: 0 } });
                    }
                } else {
                    return dispatch({ type: 'ERROR', payload: { data: [], totalCount: 0 } });
                }
            })
            .catch(err => {
                return dispatch({ type: 'ERROR', payload: { data: [], totalCount: 0 } });
            })
    }
}

//add opportunity
export function addOpportunity(queryParams) {
    const Authorization = { headers: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).accessToken } };
    return dispatch => {
        return axios.post(`${URL}` + '/opportunities/addNewOpportunity', queryParams, Authorization)
            .then(response => {
                return response.data;
            })
            .catch(err => {
                return { type: Strings.errorType, message: Strings.networkErrorMessage };
            })
    }
}

//edit opportunity
export function editOpportunity(queryParams) {
    const Authorization = { headers: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).accessToken } };
    return dispatch => {
        return axios.post(`${URL}` + '/opportunities/updateDataByOpportunityId', queryParams, Authorization)
            .then(response => {
                return response.data;
            })
            .catch(err => {
                return { type: Strings.errorType, message: Strings.networkErrorMessage };
            })
    }
}

//get companies data
export function getExpressIntrestDataOfAnOpportunity(queryParams) {
    const Authorization = { headers: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).accessToken } };
    return dispatch => {
        return axios.post(`${URL}` + '/express-interests/getByOpportunityId', queryParams, Authorization)
            .then(response => {
                return response.data;
            })
            .catch(err => {
                return { type: Strings.errorType, message: Strings.networkErrorMessage, data: [] };
            })
    }
}

//update password
export function resetUserPassword(queryParams) {
    return dispatch => {
        return axios.post(`${URL}` + '/users/resetPassword', queryParams)
            .then(response => {
                return response.data;
            })
            .catch(err => {
                return { type: Strings.errorType, message: Strings.networkErrorMessage, data: [] };
            })
    }
}


// get all companies
export function getPortfolioCompanies(queryParams) {
    const Authorization = { headers: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).accessToken } };
    return dispatch => {
        return axios.get(`${URL}` + '/opportunities/getPortfolioCompanies', Authorization)
            .then(response => {
                return response.data;
            })
            .catch(err => {
                return { type: Strings.errorType, message: Strings.networkErrorMessage, data: [] };
            })
    }
}

// add new investor entity
export function addNewInvestorEntity(queryParams) {
    const Authorization = { headers: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).accessToken } };
    return dispatch => {
        return axios.post(`${URL}` + '/investor-entities/addNewInvestorEntity', queryParams, Authorization)
            .then(response => {
                return response.data;
            })
            .catch(err => {
                return { type: Strings.errorType, message: Strings.networkErrorMessage, data: [] };
            })
    }
}

// update investor entity
export function updateDataByInvestorEntityId(queryParams) {
    const Authorization = { headers: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).accessToken } };
    return dispatch => {
        return axios.post(`${URL}` + '/investor-entities/updateDataByInvestorEntityId', queryParams, Authorization)
            .then(response => {
                return response.data;
            })
            .catch(err => {
                return { type: Strings.errorType, message: Strings.networkErrorMessage, data: [] };
            })
    }
}

// get particular investor data
export function getParticularUserHoldings(queryParams) {
    const Authorization = { headers: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).accessToken } };
    return dispatch => {
        return axios.post(`${URL}` + '/express-interests/getByInvestorId', queryParams, Authorization)
            .then(response => {
                return dispatch({ type: 'GET_MY_HOLDINGS', payload: response.data.data });
            })
            .catch(err => {
                return { type: Strings.errorType, message: Strings.networkErrorMessage, data: [] };
            })
    }
}

// get particular investor data
export function getParticularUserHoldingswithStatus(queryParams) {
    const Authorization = { headers: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).accessToken } };
    return dispatch => {
        return axios.post(`${URL}` + '/express-interests/getByParticularInvestorId', queryParams, Authorization)
            .then(response => {
                return dispatch({ type: 'GET_MY_HOLDINGS', payload: response.data.data });
            })
            .catch(err => {
                return { type: Strings.errorType, message: Strings.networkErrorMessage, data: [] };
            })
    }
}

//get all entitys by investor Id
export function getAllByInvestorId(queryParams) {
    const Authorization = { headers: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).accessToken } };
    return dispatch => {
        return axios.post(`${URL}` + '/investor-entities/getAllByInvestorId', queryParams, Authorization)
            .then(response => {
                return response.data;
            })
            .catch(err => {
                return { type: Strings.errorType, message: Strings.networkErrorMessage, data: [] };
            })
    }
}

// create notification
export function addNewNotification(queryParams) {
    const Authorization = { headers: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).accessToken } };
    return dispatch => {
        return axios.post(`${URL}` + '/notifications/addNewNotification', queryParams, Authorization)
            .then(response => {
                return response.data;
            })
            .catch(err => {
                return { type: Strings.errorType, message: Strings.networkErrorMessage, data: [] };
            })
    }
}

// get all notifications by receiverId
export function getAllNotificationsByReceiverId(queryParams) {
    const Authorization = { headers: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).accessToken } };
    return dispatch => {
        return axios.post(`${URL}` + '/notifications/getAllByReceiverId', queryParams, Authorization)
            .then(response => {
                return response.data;
            })
            .catch(err => {
                return { type: Strings.errorType, message: Strings.networkErrorMessage, data: [] };
            })
    }
}

// check email link expiry
export function checkMailLinkExpiry(queryParams) {
    return dispatch => {
        return axios.post(`${URL}` + '/users/checkMailLinkExpiry', queryParams)
            .then(response => {
                return response.data;
            })
            .catch(err => {
                return { type: Strings.errorType, message: Strings.networkErrorMessage, data: [] };
            })
    }
}

// update notifications
export function updateNotificationsById(queryParams) {
    const Authorization = { headers: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).accessToken } };
    return dispatch => {
        return axios.post(`${URL}` + '/notifications/updateDataByNotificationId', queryParams, Authorization)
            .then(response => {
                return response.data;
            })
            .catch(err => {
                return { type: Strings.errorType, message: Strings.networkErrorMessage, data: [] };
            })
    }
}

// get particular express interest by id
export function getByExpressInterestId(id) {
    const Authorization = { headers: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).accessToken } };
    return dispatch => {
        return axios.get(`${URL}` + '/express-interests/getByExpressInterestId/' + id, Authorization)
            .then(response => {
                return response.data;
            })
            .catch(err => {
                return { type: Strings.errorType, message: Strings.networkErrorMessage, data: [] };
            })
    }
}

// get particular express interest by id Lean --Sateesh
export function getByExpressInterestIdLean(id) {
    const Authorization = { headers: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).accessToken } };
    return dispatch => {
        return axios.get(`${URL}` + '/express-interests/getByExpressInterestIdLean/' + id, Authorization)
            .then(response => {
                return response.data;
            })
            .catch(err => {
                return { type: Strings.errorType, message: Strings.networkErrorMessage, data: [] };
            })
    }
}

//update expressInterest data
export function updateDataByExpressInterestId(queryParams) {
    const Authorization = { headers: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).accessToken } };
    return dispatch => {
        return axios.post(`${URL}` + '/express-interests/updateDataByExpressInterestId', queryParams, Authorization)
            .then(response => {
                return response.data;
            })
            .catch(err => {
                return { type: Strings.errorType, message: Strings.networkErrorMessage, data: [] };
            })
    }
}

// Add transaction data
export function addNewTransaction(queryParams) {
    const Authorization = { headers: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).accessToken } };
    return dispatch => {
        return axios.post(`${URL}` + '/transactions/addNewTransaction', queryParams, Authorization)
            .then(response => {
                return response.data;
            })
            .catch(err => {
                return { type: Strings.errorType, message: Strings.networkErrorMessage, data: [] };
            })
    }
}


// add new mail joinings
export function addNewMailJoining(queryParams) {
    const Authorization = { headers: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).accessToken } };
    return dispatch => {
        return axios.post(`${URL}` + '/mail-joinings/addNewMailJoining', queryParams, Authorization)
            .then(response => {
                return response.data;
            })
            .catch(err => {
                return { type: Strings.errorType, message: Strings.networkErrorMessage, data: [] };
            })
    }
}

// add new joint investor
export function addNewJointInvestor(queryParams) {
    const Authorization = { headers: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).accessToken } };
    return dispatch => {
        return axios.post(`${URL}` + '/joint-investors/addNewJointInvestor', queryParams, Authorization)
            .then(response => {
                return response.data;
            })
            .catch(err => {
                return { type: Strings.errorType, message: Strings.networkErrorMessage, data: [] };
            })
    }
}

// update joint investor
export function updateDataByJointInvestorById(queryParams) {
    const Authorization = { headers: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).accessToken } };
    return dispatch => {
        return axios.post (`${URL}` + '/joint-investors/updateDataByJointInvestorId', queryParams, Authorization)
            .then(response => {
                return response.data;
            })
            .catch(err => {
                return { type: Strings.errorType, message: Strings.networkErrorMessage, data: [] };
            })
    }
}

//get all joint investors by investor Id
export function getAllJointInvestorsByInvestorId(queryParams) {
    const Authorization = { headers: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).accessToken } };
    return dispatch => {
        return axios.post(`${URL}` + '/joint-investors/getAllByInvestorId', queryParams, Authorization)
            .then(response => {
                return response.data;
            })
            .catch(err => {
                return { type: Strings.errorType, message: Strings.networkErrorMessage, data: [] };
            })
    }
}

//get all transactions by order Id
export function getAllTransactionssByOrderId(id) {
    const Authorization = { headers: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).accessToken } };
    return dispatch => {
        return axios.get(`${URL}` + '/transactions/getAllByOrderId/' + id, Authorization)
            .then(response => {
                return response.data;
            })
            .catch(err => {
                return { type: Strings.errorType, message: Strings.networkErrorMessage, data: [] };
            })
    }
}

//add notes 
export function addNewNotes(queryParams) {
    const Authorization = { headers: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).accessToken } };
    return dispatch => {
        return axios.post(`${URL}` + '/notes/addNewNote', queryParams, Authorization)
            .then(response => {
                return response.data;
            })
            .catch(err => {
                return { type: Strings.errorType, message: Strings.networkErrorMessage, data: [] };
            })
    }
}

// get notes by query
export function getNotesByQuery(queryParams) {
    const Authorization = { headers: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).accessToken } };
    return dispatch => {
        return axios.post(`${URL}` + '/notes/getAllByFilters', queryParams, Authorization)
            .then(response => {
                return response.data;
            })
            .catch(err => {
                return { type: Strings.errorType, message: Strings.networkErrorMessage, data: [] };
            })
    }
}

// get user data with filters
export function getFilterUsers(queryParams) {
    const Authorization = { headers: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).accessToken } };
    return dispatch => {
        return axios.post(URL + '/users/getAllByFilters', queryParams, Authorization)
            .then(response => {
                if (response.status === 200) {
                    return dispatch({ type: 'GET_INVESTORS', payload: response.data.data });
                } else {
                    return dispatch({ type: 'ERROR', payload: { data: [], totalCount: 0 } });
                }
            })
            .catch(err => {
                return dispatch({ type: 'ERROR', payload: { data: [] } });
            })
    }
}

// get companies with skip limit
export function getCompaniesWithSkipLimit(queryParams) {
    const Authorization = { headers: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).accessToken } };
    return dispatch => {
        return axios.post(`${URL}` + '/companies/getAllCompanies', queryParams, Authorization)
            .then(response => {
                return response.data;
            })
            .catch(err => {
                return { type: Strings.errorType, message: Strings.networkErrorMessage, data: [] };
            })
    }
}

//get all joint investors by investor Id
export function addCompany(queryParams) {
    const Authorization = { headers: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).accessToken } };
    return dispatch => {
        return axios.post(`${URL}` + '/companies/addNewCompany', queryParams, Authorization)
            .then(response => {
                return response.data;
            })
            .catch(err => {
                return { type: Strings.errorType, message: Strings.networkErrorMessage, data: [] };
            })
    }
}

//get all joint investors by investor Id
export function updateCompany(queryParams) {
    const Authorization = { headers: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).accessToken } };
    return dispatch => {
        return axios.post(`${URL}` + '/companies/updateDataByCompanyId', queryParams, Authorization)
            .then(response => {
                return response.data;
            })
            .catch(err => {
                return { type: Strings.errorType, message: Strings.networkErrorMessage, data: [] };
            })
    }
}

// get delete a company data
export function deleteCompanyData(queryParams) {
    const Authorization = { headers: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).accessToken } };
    return dispatch => {
        return axios.get(`${URL}` + '/companies/deleteByCompanyId/' + queryParams, Authorization)
            .then(response => {
                return response.data;
            })
            .catch(err => {
                return { type: Strings.errorType, message: Strings.networkErrorMessage, data: [] };
            })
    }
}

export function getDocusignTemplatesList() {
    const Authorization = { headers: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).accessToken } };
    return dispatch => {
        return axios.get(URL + '/docusign-templates/getDocusignAccountTemplatesList', Authorization)
            .then(response => {
                if (response.status === 200) {
                    return response.data;
                } else {
                    return dispatch({ type: 'ERROR', payload: { data: [], totalCount: 0 } });
                }
            })
            .catch(err => {
                return dispatch({ type: 'ERROR', payload: { data: [], totalCount: 0 } });
            })
    }
}

export function getDocusignStaticFields() {
    const Authorization = { headers: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).accessToken } };
    return dispatch => {
        return axios.get(URL + '/docusign-templates/getDocusignStaticFields', Authorization)
            .then(response => {
                if (response.status === 200) {
                    return response.data;
                } else {
                    return dispatch({ type: 'ERROR', payload: { data: [], totalCount: 0 } });
                }
            })
            .catch(err => {
                return dispatch({ type: 'ERROR', payload: { data: [], totalCount: 0 } });
            })
    }
}

export function DocusignStaticFieldsMapping(queryParams) {
    const Authorization = { headers: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).accessToken } };
    return dispatch => {
        return axios.post(URL + '/docusign-templates/manageDocusignTemplate', queryParams, Authorization)
            .then(response => {
                if (response.status === 200) {
                    return response.data;
                } else {
                    return dispatch({ type: 'ERROR', payload: { data: [], totalCount: 0 } });
                }
            })
            .catch(err => {
                return dispatch({ type: 'ERROR', payload: { data: [], totalCount: 0 } });
            })
    }
}

export function getByTemplateId(queryParams) {
    const Authorization = { headers: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).accessToken } };
    return dispatch => {
        return axios.post(URL + '/docusign-templates/getByTemplateId', queryParams, Authorization)
            .then(response => {
                if (response.status === 200) {
                    return response.data;
                } else {
                    return dispatch({ type: 'ERROR', payload: { data: [], totalCount: 0 } });
                }
            })
            .catch(err => {
                return dispatch({ type: 'ERROR', payload: { data: [], totalCount: 0 } });
            })
    }
}

export function generateCsvFormatData(queryParams) {
    const Authorization = { headers: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).accessToken } };
    return dispatch => {
        return axios.post(URL + '/express-interests/generateCsvFormatData', queryParams, Authorization)
            .then(response => {
                if (response.status === 200) {
                    return response.data;
                } else {
                    return dispatch({ type: 'ERROR', payload: { data: [], totalCount: 0 } });
                }
            })
            .catch(err => {
                return dispatch({ type: 'ERROR', payload: { data: [], totalCount: 0 } });
            })
    }
}

//get Opportunities  
export function getActiveOpportunitiesLean(queryParams) {
    const Authorization = { headers: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).accessToken } };
    return dispatch => {
        return axios.post(URL + '/opportunities/getActiveOpportunitiesLean', queryParams, Authorization)
            .then(response => {
                if (response.status === 200) {
                    return response.data;
                } else {
                    return dispatch({ type: 'ERROR', payload: { data: [], totalCount: 0 } });
                }
            })
            .catch(err => {
                return dispatch({ type: 'ERROR', payload: { data: [], totalCount: 0 } });
            })
    }
}

//get Opportunities  
export function getUserDocuments(queryParams) {
    const Authorization = { headers: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).accessToken } };
    return dispatch => {
        return axios.post(URL + '/user-documents/getByUserId', queryParams, Authorization)
            .then(response => {
                if (response.status === 200) {
                    return response.data;
                } else {
                    return dispatch({ type: 'ERROR', payload: { data: [], totalCount: 0 } });
                }
            })
            .catch(err => {
                return dispatch({ type: 'ERROR', payload: { data: [], totalCount: 0 } });
            })
    }
}

//get all joint investors by investor Id
export function addNewQuestionnaire(queryParams) {
    const Authorization = { headers: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).accessToken } };
    return dispatch => {
        return axios.post(`${URL}` + '/questionnaire/addNewQuestionnaire', queryParams, Authorization)
            .then(response => {
                return response.data;
            })
            .catch(err => {
                return { type: Strings.errorType, message: Strings.networkErrorMessage, data: [] };
            })
    }
}

//
export function updateQuestionnaire(queryParams) {
    const Authorization = { headers: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).accessToken } };
    return dispatch => {
        return axios.post(`${URL}` + '/questionnaire/updateDataById', queryParams, Authorization)
            .then(response => {
                return response.data;
            })
            .catch(err => {
                return { type: Strings.errorType, message: Strings.networkErrorMessage, data: [] };
            })
    }
}

export function getLatestQuestionnaire(id) {
    const Authorization = { headers: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).accessToken } };
    return dispatch => {
        return axios.get(`${URL}` + '/questionnaire/getLatestQuestionnaire/' + id, Authorization)
            .then(response => {
                return response.data;
            })
            .catch(err => {
                return { type: Strings.errorType, message: Strings.networkErrorMessage, data: [] };
            })
    }
}

export function userLogout(id) {
    const Authorization = { headers: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).accessToken } };
    return dispatch => {
        return axios.get(`${URL}` + '/users/logout/' + id, Authorization)
            .then(response => {
                return response.data;
            })
            .catch(err => {
                return { type: Strings.errorType, message: Strings.networkErrorMessage, data: [] };
            })
    }
}

export function getAllQuestionsByFilters(queryParams) {
    const Authorization = { headers: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).accessToken } };
    return dispatch => {
        return axios.post(`${URL}` + '/questions/getAllQuestionsByFilters', queryParams, Authorization)
            .then(response => {
                return response.data;
            })
            .catch(err => {
                return { type: Strings.errorType, message: Strings.networkErrorMessage, data: [] };
            })
    }
}


export function getAllClosingDocumentsProvisions() {
    const Authorization = { headers: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).accessToken } };
    return dispatch => {
        return axios.get(`${URL}` + '/closing-documents-provisions/getAllClosingDocumentsProvisions', Authorization)
            .then(response => {
                return response.data;
            })
            .catch(err => {
                return { type: Strings.errorType, message: Strings.networkErrorMessage, data: [] };
            })
    }
}

