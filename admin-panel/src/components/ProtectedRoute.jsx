import { Route, Redirect } from 'react-router';
import React from 'react';

const ProtectedRoute = ({ component: Component, authorized, ...rest }) => (
	<Route {...rest} render={(props) => (
		authorized === true
			? <Component {...props} />
			: <Redirect to='/login'/>
	)}/>
);

export default ProtectedRoute;
