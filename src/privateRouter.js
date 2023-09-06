import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, theme, ...rest }) => {
    return (
        <Route
            {...rest}
            render={(props) =>
                sessionStorage.getItem('userData') ? (
                    <Component {...props} theme={theme} />
                ) : (
                    <Redirect to="/login" />
                )
            }
        />
    );
};

export default PrivateRoute;
