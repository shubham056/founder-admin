import React from 'react';
import { Route } from 'react-router-dom';

import { Login } from '../Pages'
import CheckingUser from './CheckingUser';

export const PrivateRoute = ({ component: Component, ...rest }) => {
    return (
        <Route {...rest}
            render={(props) => (
                (localStorage.getItem('userData') ?
                    (props.history.location.pathname === '/') ?
                        <CheckingUser /> :
                        <Component {...props} />
                    : <Route path='/' component={Login} />)
            )} />
    )
}

export const AuthRoute = ({ component: Component, ...rest }) => {
    return (
        <Route {...rest}
            render={(props) => {
                if (localStorage.getItem('userData') &&
                    ((props.history.location.pathname === '/security') ||
                        (props.history.location.pathname === '/forgot') ||
                        (props.history.location.pathname === '/register') ||
                        (props.history.location.pathname === '/signup-success') ||
                        (props.history.location.pathname === '/')
                    )) {
                    return <CheckingUser />
                } else {
                    return <Component {...props} />
                }
            }} />)
}