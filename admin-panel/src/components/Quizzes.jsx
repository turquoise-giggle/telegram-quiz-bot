import React from 'react';
import { Badge, Button, message, Table } from 'antd';
import { DeleteFilled, DownloadOutlined, PlusCircleFilled } from '@ant-design/icons';
import { deleteQuizzes, fetchQuizzes } from '../api/quizzes';
import { withRouter } from 'react-router';

const columns = [
  {
	title: 'Название',
	dataIndex: 'name',
	sorter: (a, b) => a.name - b.name,
	sortDirections: ['descend', 'ascend'],
	showSorterTooltip: false,
	responsive: ['md']
  },
  {
	title: 'Приз',
	dataIndex: 'prize',
	sorter: (a, b) => a.prize - b.prize,
	sortDirections: ['descend', 'ascend'],
	showSorterTooltip: false
  },
  {
	title: 'Статус',
	dataIndex: 'statusText',
	sorter: (a, b) => a.status - b.status,
	sortDirections: ['descend', 'ascend'],
	showSorterTooltip: false,
	defaultSortOrder: 'ascend',
	responsive: ['md']
  },
  {
	title: 'Отчёт',
	dataIndex: 'report'
  }
];

class Quizzes extends React.Component {
  state = {
	selectedRowKeys: [],
	loading: true,
	data: []
  };

  componentDidMount() {
	this.updateData()
		.then(() => this.setState({ loading: false }));
  }

  async updateData() {
	try {
	  const data = await fetchQuizzes();
	  this.setState({
		data: data.map((item) => {
		  return {
			...item,
			statusText: item.status === 0
				? <Badge status="processing" text="Проходит"/>
				: <Badge status="success" text="Завершена"/>,
			report: <Button type="dashed" icon={<DownloadOutlined/>} onClick={this.onDownloadReportClicked}/>,
			key: item.id
		  };
		})
	  });
	}
	catch (err) {
	  message.error('Не удалось загрузить данные');
	}
  }

  onDownloadReportClicked = () => {
	console.log('Downloading report...');
  };

  onCreateClicked = () => {
	this.props.history.push('/createquiz');
  };

  onDeleteClicked = async () => {
	try {
	  await deleteQuizzes(this.state.selectedRowKeys);

	  this.setState({
		selectedRowKeys: []
	  });

	  message.success('Викторины успешно удалены!');
	  this.updateData();
	}
	catch (err) {
	  console.error(err);
	  message.error('Не удалось удалить викторины');
	}
  };

  /* Selection */
  onSelectChange = selectedRowKeys => {
	this.setState({ selectedRowKeys });
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
		  <div style={{ marginBottom: 16, display: !hasSelected ? 'block' : 'none' }}>
			<Button type="primary" icon={<PlusCircleFilled/>} onClick={this.onCreateClicked}>
			  Создать
			</Button>
		  </div>
		  <div style={{ marginBottom: 16, display: hasSelected ? 'block' : 'none' }}>
			<Button type="danger" icon={<DeleteFilled/>} onClick={this.onDeleteClicked}>
			  Удалить
			</Button>
			<span style={{ marginLeft: 8 }}>
		  	{hasSelected ? `Выбрано ${selectedRowKeys.length} викторин(а)` : ''}
		  </span>
		  </div>
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

export default withRouter(Quizzes);
