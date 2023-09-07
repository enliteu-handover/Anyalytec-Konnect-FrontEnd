import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, theme, ...rest }) => {
    if (!sessionStorage.getItem('userData')) {
        sessionStorage.setItem('redirect', window.location.href)
    }
    return (
        <Route
            {...rest}
            render={(props) =>
                sessionStorage.getItem('userData') ? (
                    <Component {...props} theme={theme} />
                ) : (
                    <Redirect to="/login/signin" />
                )
            }
        />
    );
};

export default PrivateRoute;
