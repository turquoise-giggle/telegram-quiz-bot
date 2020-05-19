import React from 'react';
import { Row, Col, Spin } from 'antd';

class Loading extends React.Component{
	render() {
	  return (
		  <Row justify="center" align="middle" className="FormContainer">
			<Col>
			  <Spin size="large" />
			</Col>
		  </Row>
	  );
	}
}

export default Loading;
