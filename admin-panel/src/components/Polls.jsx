import React from 'react';
import { Button, Col, InputNumber, message, Popconfirm, Row, Table, Dropdown, Menu } from 'antd';
import {
  DeleteFilled,
  DownloadOutlined,
  DownOutlined,
  PlusCircleFilled,
  QuestionCircleOutlined
} from '@ant-design/icons';
import { withRouter } from 'react-router';
import { deletePolls, fetchPolls } from '../api/polls';
import { fetchInterval, updateInterval } from '../api/pollsInterval';
import api, { apiURL } from '../api/api';

const columns = [
  {
	title: 'Вопрос',
	dataIndex: 'image',
	render: (text, record, i) => (
		<a key={i} href={record.image} target="_blank" rel="noopener noreferrer">
		  <img key={i} alt="Фото с вопросом" src={record.image} width={100}/>
		</a>
	)
  },
  {
	title: 'Варианты ответа',
	dataIndex: 'answers',
	render: (text, record) => (
		record.answers.map((a, i) => <div key={i} style={{ color: a.isValid ? '#327926' : '#ef4949' }}>{i + 1}) {a.text}</div>)
	)
  },
  {
	title: 'Время на ответ',
	dataIndex: 'answerTime',
	render: (text, record) => `${record.answerTime / 60} мин`,
	responsive: ['md']
  }
];

const ratingActions = (
	<Menu>
	  <Menu.Item key="day">
		<a href={`${apiURL}/poll/results/day/read`}>За день</a>
	  </Menu.Item>
	  <Menu.Item key="week">
		<a href={`${apiURL}/poll/results/week/read`}>За неделю</a>
	  </Menu.Item>
	</Menu>
);

class Polls extends React.Component {
  state = {
	selectedRowKeys: [],
	postingInterval: undefined,
	intervalSavingTimeout: null,
	loading: true,
	data: []
  };

  componentDidMount = async () => {
	await this.updateData();
	this.setState({ loading: false });
  };

  updateData = async () => {
	try {
	  const [data, postingIntervalInSec] = await Promise.all([fetchPolls(), fetchInterval()]);

	  this.setState({
		postingInterval: postingIntervalInSec / 60,
		data: data.map((item) => {
		  return { ...item, key: item.id };
		})
	  });
	}
	catch (err) {
	  message.error('Не удалось загрузить данные');
	}
  };

  onCreateClicked = () => {
	this.props.history.push('/createpoll');
  };

  onDeleteClicked = async () => {
	try {
	  await deletePolls(this.state.selectedRowKeys);

	  this.setState({
		selectedRowKeys: []
	  });

	  message.success('Опросы успешно удалены!');
	  this.updateData();
	}
	catch (err) {
	  console.error(err);
	  message.error('Не удалось удалить опросы');
	}
  };

  /* Selection */
  onSelectChange = selectedRowKeys => {
	this.setState({ selectedRowKeys });
  };

  onIntervalChanged = interval => {
	clearTimeout(this.state.intervalSavingTimeout);

	if (interval > 0) {
	  this.setState({ postingInterval: interval });

	  const timeout = setTimeout(() => {
		if (interval > 0) {
		  updateInterval(this.state.postingInterval * 60)
		}
	  }, 2000);

	  this.setState({ intervalSavingTimeout: timeout });
	}
  };

  render() {
	const { selectedRowKeys } = this.state;
	const rowSelection = {
	  selectedRowKeys,
	  onChange: this.onSelectChange
	};
	const hasSelected = selectedRowKeys.length > 0;

	return (
		<div>
		  <Row>
			<Col span={12}>
			  <Row justify="start">
				<div style={{ marginBottom: 16, display: !hasSelected ? 'block' : 'none' }}>
				  <Button type="primary" icon={<PlusCircleFilled/>} onClick={this.onCreateClicked}>
					Создать
				  </Button>
				</div>
				<div style={{ marginBottom: 16, display: hasSelected ? 'block' : 'none' }}>
				  <Popconfirm
					  title="Вы действительно хотите удалить выбранные опросы?"
					  okText="Да"
					  cancelText="Отменить"
					  onConfirm={this.onDeleteClicked}
					  onEnterPressed={this.onDeleteClicked}
					  icon={<QuestionCircleOutlined style={{ color: 'red' }}/>}
				  >
					<Button type="danger" icon={<DeleteFilled/>}>
					  Удалить
					</Button>
				  </Popconfirm>
				  <span style={{ marginLeft: 8 }}>
		  			{hasSelected ? `Выбрано ${selectedRowKeys.length} викторин(а)` : ''}
		  		</span>
				</div>
			  </Row>
			</Col>

			<Col span={12}>
			  <Row justify="end" align="middle">
				<Dropdown overlay={ratingActions}>
				  <Button type="primary">
					<DownloadOutlined />Рейтинг <DownOutlined />
				  </Button>
				</Dropdown>
			  </Row>
			</Col>
		  </Row>

		  <Row align="middle" style={{ marginTop: -5, marginBottom: 5 }}>
			<label>Интервал отправки:</label>
			<InputNumber
				min={1}
				value={this.state.postingInterval}
				style={{ width: 50, marginLeft: 5, marginRight: 5 }}
				onChange={this.onIntervalChanged}
			/>
			<span style={{ marginRight: 20 }}>мин.</span>
		  </Row>

		  <h1 style={{ marginTop: 15 }}>Будущие опросы</h1>
		  <Table loading={this.state.loading}
				 rowSelection={rowSelection}
				 columns={columns}
				 dataSource={this.state.data}
				 locale={{ emptyText: 'Ничего не найдено' }}
		  />
		</div>
	);
  }
}

export default withRouter(Polls);
