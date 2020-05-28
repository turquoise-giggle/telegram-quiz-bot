import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { checkAuth } from '../api/auth';
import '../styles/App.css';
import Loading from './Loading';
import Router from './Router';

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
			<Router authorized={this.state.authorized}/>
		  </div>
		</BrowserRouter>
	);
  }
}

export default App;
