import React from 'react';
import '../styles/Dashboard.css';
import { Button, Col, Layout, Menu, message, Row } from 'antd';
import { QuestionCircleOutlined, ContainerOutlined } from '@ant-design/icons';
import { signOut } from '../api/auth';
import { withRouter } from 'react-router';

const { Header, Content, Sider } = Layout;

const menu = [
  {
	text: 'Викторины',
	icon: <QuestionCircleOutlined/>,
	url: '/quizzes'
  },
  {
	text: 'Опросы',
	icon: <ContainerOutlined />,
	url: '/polls'
  }
];

class Dashboard extends React.Component {
  state = {
	menuCollapsed: false
  };

  onMenuCollapsed = menuCollapsed => {
	this.setState({ menuCollapsed });
  };

  onMenuSelected = ({ key }) => {
	this.props.history.push(key);
  };

  onSignOutClicked = async e => {
	try {
	  const success = await signOut();

	  if (success) {
		window.location.replace('/login');
	  }
	}
	catch (err) {
	  console.error(err);
	  message.error('Ошибка при запросе к серверу');
	}
  };

  render() {
	return (
		<Layout style={{ minHeight: '100vh' }}>
		  {/* Menu */}
		  <Sider breakpoint="sm"
				 collapsible
				 collapsed={this.state.menuCollapsed}
				 onCollapse={this.onMenuCollapsed}
		  >
			<div className="Logo">
			  <Row justify="middle">
				<Col span={this.state.menuCollapsed ? 24 : 'auto'}>
				  <img src="logo.png" alt="Logo"/>
				</Col>
				<Col span={this.state.menuCollapsed ? 0 : 'auto'}>
				  <h1>Quiz Bot Admin</h1>
				</Col>
			  </Row>
			</div>

			<Menu theme="dark"
				  selectedKeys={[this.props.location.pathname]}
				  onSelect={this.onMenuSelected}
				  mode="inline">
			  {menu.map((item, i) =>
				  (
					  <Menu.Item key={item.url} icon={item.icon}>
						<span>{item.text}</span>
					  </Menu.Item>
				  )
			  )}
			</Menu>
		  </Sider>

		  <Layout>
			{/* Header */}
			<Header style={{ padding: 0 }}>
			  <Row align="end">
				<Col>
				  <Button className="SignOutButton" type="danger" onClick={this.onSignOutClicked}>
					Выйти
				  </Button>
				</Col>
			  </Row>
			</Header>

			{/* Content */}
			<Content style={{ margin: '15px' }}>
			  {this.props.children}
			</Content>
		  </Layout>
		</Layout>
	);
  }
}

export default withRouter(Dashboard);
