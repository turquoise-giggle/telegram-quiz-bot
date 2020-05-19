import React from 'react';
import { Result } from 'antd';

class NotFound extends React.Component {
  render() {
	return (
		<Result
			status="404"
			title="404"
			subTitle="Страница не найдена"
		/>
	);
  }
}

export default NotFound;
