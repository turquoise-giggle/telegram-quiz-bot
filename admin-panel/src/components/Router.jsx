import React from 'react';
import { Redirect, Switch } from 'react-router';
import ProtectedRoute from './ProtectedRoute';
import Dashboard from './Dashboard';
import Quizzes from './Quizzes';
import Polls from './Polls';
import TextsEdit from './TextsEdit';
import CreateQuiz from './CreateQuiz';
import CreatePoll from './CreatePoll';
import { Route } from 'react-router-dom';
import Login from './Login';
import NotFound from './NotFound';

class Router extends React.Component {
  render() {
	return (
		<Switch>
		  <ProtectedRoute exact path="/" authorized={this.props.authorized} component={() => (
			  <Redirect to="/quizzes"/>
		  )}/>
		  <ProtectedRoute exact path="/quizzes" authorized={this.props.authorized} component={() =>
			  <Dashboard>
				<Quizzes />
			  </Dashboard>
		  }/>
		  <ProtectedRoute exact path="/polls" authorized={this.props.authorized} component={() =>
			  <Dashboard>
				<Polls />
			  </Dashboard>
		  }/>
		  <ProtectedRoute exact path="/texts" authorized={this.props.authorized} component={() =>
			  <Dashboard>
				<TextsEdit />
			  </Dashboard>
		  }/>
		  <ProtectedRoute exact path="/createquiz" authorized={this.props.authorized} component={() =>
			  <Dashboard>
				<CreateQuiz />
			  </Dashboard>
		  }/>
		  <ProtectedRoute exact path="/createpoll" authorized={this.props.authorized} component={() =>
			  <Dashboard>
				<CreatePoll />
			  </Dashboard>
		  }/>
		  <Route exact path="/login" component={Login}/>
		  <Route component={NotFound}/>
		</Switch>
	);
  }
}

export default Router;
