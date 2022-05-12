//initial state of opportunities
export const opportunitiesInitialstate = {
    allData: [],
    loading: true,
    particularOpportunityDetails: {},
    totalCount: 0,
}

//opportunities section
export const opportunities = (state = opportunitiesInitialstate, action) => {
    switch (action.type) {
        //get opportunities
        case 'GET_OPPORTUNITIES':
            state.allData = action.payload.data;
            state.loading = false;
            state.particularOpportunityDetails = {};
            state.totalCount = action.payload.totalCount;
            return { ...state };
        default: return state;
    }
}

//initial state of investors
export const investorsInitialstate = {
    allData: [],
    loading: true,
    particularInvestorDetails: {},
    loggedUserDetails: {},
    totalCount: 0,
}

//investors section
export const investors = (state = investorsInitialstate, action) => {
    switch (action.type) {
        //get investors
        case 'GET_INVESTORS':
            state.allData = action.payload.data;
            state.loading = false;
            state.particularInvestorDetails = {};
            state.totalCount = action.payload.totalCount;
            return { ...state };
        case 'LOGGED_USER':
            state.loggedUserDetails = action.payload.data;
            return { ...state };
        default: return state;
    }
}

//initial state of Orders
export const ordersInitialstate = {
    allData: [],
    loading: true,
    particularOrderDetails: {},
    totalCount: 0,
}

//Orders section
export const orders = (state = ordersInitialstate, action) => {
    switch (action.type) {
        //get Orders
        case 'GET_ORDERS':
            state.allData = action.payload.data;
            state.loading = false;
            state.particularOrderDetails = {};
            state.totalCount = action.payload.totalCount;
            return { ...state };
        default: return state;
    }
}

//initial state of Orders
export const myHoldingsInitialstate = {
    allData: [],
    loading: true,
    particularHoldingDetails: {},
    totalCount: 0,
}

//Orders section
export const myHoldings = (state = myHoldingsInitialstate, action) => {
    switch (action.type) {
        //get Orders
        case 'GET_MY_HOLDINGS':
            state.allData = action.payload.data;
            state.loading = false;
            state.particularHoldingDetails = {};
            state.totalCount = action.payload.totalCount;
            return { ...state };
        default: return state;
    }
}

