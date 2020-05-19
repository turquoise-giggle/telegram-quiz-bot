import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import { checkAuth } from '../api/auth';
import NotFound from './NotFound';
import { Redirect, Switch } from 'react-router';
import '../styles/App.css';
import ProtectedRoute from './ProtectedRoute';
import Loading from './Loading';

class App extends React.Component {
  state = {
	authorized: false,
	loading: true
  };

  async componentDidMount() {
	this.setState({
	  authorized: await checkAuth(),
	  loading: false
	});
  }

  render() {
	if (this.state.loading) return <Loading/>;

	return (
		<BrowserRouter>
		  <div className="App">
			<Switch>
			  <ProtectedRoute exact path="/" authorized={this.state.authorized} component={() => (
				  <Redirect to="/quiz"/>
			  )}/>
			  <ProtectedRoute exact path="/quiz" authorized={this.state.authorized} component={() =>
				  <Dashboard>
				  </Dashboard>
			  }/>
			  <ProtectedRoute exact path="/polls" authorized={this.state.authorized} component={() =>
				  <Dashboard>
				  </Dashboard>
			  }/>
			  <Route exact path="/login" component={Login}/>
			  <Route component={NotFound}/>
			</Switch>
		  </div>
		</BrowserRouter>
	);
  }
}

export default App;
