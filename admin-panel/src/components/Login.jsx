import { Button, Col, Form, Input, Row, message } from 'antd';
import React, { Component } from 'react';
import '../styles/Login.css';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { signIn } from '../api/auth';

class Login extends Component {
  async submitHandler({ username, password }) {
	try {
	  const signedIn = await signIn({ username, password });

	  if (signedIn) {
	    window.location.replace('/');
	  }
	  else {
	    message.error('Неверный логин и/или пароль', 2);
	  }
	}
	catch (err) {
	  console.error(err);
	  message.error('Ошибка при запросе к серверу');
	}
  }

  render() {
	return (
		<Row justify="center" align="middle" className="FormContainer">
		  <Col xs={18} sm={12} lg={5}>
			<h1>Авторизация</h1>

			<Form
				initialValues={{ remember: true }}
				className="LoginForm"
				onFinish={this.submitHandler}
			>
			  <Form.Item
				  name="username"
				  rules={[
					{
					  required: true,
					  message: 'Введите имя пользователя!'
					}
				  ]}
			  >
				<Input
					prefix={<UserOutlined/>}
					placeholder="Имя пользователя"
				/>
			  </Form.Item>
			  <Form.Item
				  name="password"
				  rules={[
					{
					  required: true,
					  message: 'Введите свой пароль!'
					}
				  ]}
			  >
				<Input.Password
					prefix={<LockOutlined/>}
					placeholder="Пароль"
				/>
			  </Form.Item>
			  <Form.Item>
				<Button type="primary" htmlType="submit" className="LoginFormButton">
				  Войти
				</Button>
			  </Form.Item>
			</Form>
		  </Col>
		</Row>
	);
  }
}

export default Login;
