import React from 'react';
import '../styles/CreatePoll.css';
import {
  Button,
  Checkbox,
  Col,
  Input,
  InputNumber,
  message,
  PageHeader,
  Radio,
  Result,
  Row,
  Upload
} from 'antd';
import { withRouter } from 'react-router';
import { DeleteFilled, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { uploadFile } from '../api/files';
import { generateKey } from '../helpers/functions';
import { createPoll } from '../api/polls';

const initialState = {
  question: {
	image: undefined,
	fileList: [],
	unlimitedAnswerTime: false,
	answerTime: 5,
	answers: [
	  {
		key: generateKey(),
		text: '',
		isValid: false
	  },
	  {
		key: generateKey(),
		text: '',
		isValid: true
	  }
	],
	texts: {
	  validAnswer: 'Правильно ✅',
	  invalidAnswer: 'Неправильно ❌'
	}
  },
  showSuccess: false
};

class CreatePoll extends React.Component {
  state = JSON.parse(JSON.stringify(initialState));

  onBackClicked = () => {
	this.props.history.push('/polls');
  };

  onReloadClicked = () => {
	window.location.reload();
  };

  getCorrectAnswer = () => {
	return this.state.question.answers.find(question => question.isValid);
  };

  onAnswerTimeChanged = time => {
	const { question } = this.state;
	question.answerTime = +time;

	this.setState({ question });
  };

  onAnswerTimeSwitched = e => {
	const { question } = this.state;
	question.unlimitedAnswerTime = e.target.checked;

	this.setState({ question });
  };

  onAddAnswerClicked = () => {
	const { question } = this.state;

	question.answers.push({
	  key: generateKey(),
	  text: `Ответ ${question.answers.length + 1}`,
	  isValid: false
	});

	this.setState({ question });
  };

  onDeleteAnswerClicked = answerKey => {
	const { question } = this.state;
	const answerIndex = question.answers.findIndex(a => a.key === answerKey);

	question.answers.splice(answerIndex, 1);

	this.setState({ question });
  };

  onAnswerTextChanged = (answerKey, text) => {
	const { question } = this.state;
	const answer = question.answers.find(a => a.key === answerKey);

	answer.text = text;

	this.setState({ question });
  };

  onAnswerSwitched = (answerKey, checked) => {
	if (checked) {
	  const { question } = this.state;

	  const answer = question.answers.find(a => a.key === answerKey);
	  question.answers.forEach(answer => answer.isValid = false);

	  answer.isValid = true;

	  this.setState({ question });
	}
  };

  onNotificationTextChanged = (questionKey, textKey, value) => {
	const { question } = this.state;

	question.texts[textKey] = value;

	this.setState({ question });
  };

  uploadFile = async ({ file, onSuccess, onError }) => {
	const sizeLimit = 5e+6;

	if (file.size > sizeLimit) {
	  return message.error('Максимальный размер 5MB');
	}

	try {
	  const imageUrl = await uploadFile(file);

	  const { question } = this.state;
	  question.image = imageUrl;
	  question.fileList = [file];

	  this.setState({ question });
	  onSuccess();
	}
	catch (err) {
	  console.error(err);
	  onError();
	}
  };

  onFileRemove = () => {
	const { question } = this.state;

	question.image = undefined;
	question.fileList = [];

	this.setState({ question });
  };

  onSubmit = async () => {
	const formIsValid = this.validateEntireForm();

	if (!formIsValid) {
	  return message.warn('Допущены ошибки при составлении опроса');
	}

	const { question } = this.state;

	delete question.fileList;

	if (question.unlimitedAnswerTime)
	  delete question.answerTime;
	else
	  question.answerTime *= 60;

	try {
	  await createPoll(question);
	  this.setState({ ...initialState, showSuccess: true });
	}
	catch (err) {
	  console.error(err);
	  message.error('Не удалось создать опрос');
	}
  };

  validateEntireForm = () => {
	const { question } = this.state;

	return (
		question.image &&
		question.answerTime &&
		question.answers.length > 1 &&
		question.answers.some(a => a.isValid) &&
		question.answers.every(a => a.text && a.text.length)
	);
  };

  render() {
    const { question } = this.state;

	return (
		<div>
		  <div style={{ display: this.state.showSuccess ? 'none' : 'block' }}>
			<PageHeader
				className="PageHeader"
				title="Создание опроса"
				onBack={this.onBackClicked}
			/>

			<Row justify="center" align="middle" style={{ marginTop: 15 }}>
			  <Col xs={20} lg={8}>
				<label className="formLabel">Картинка:</label>
				<Upload
					className="upload-list-inline"
					listType="picture"
					accept=".png,.jpg,.jpeg"
					defaultFileList={[]}
					fileList={question.fileList}
					customRequest={this.uploadFile}
					onRemove={this.onFileRemove}
				>
				  <Button type="dashed">
					<UploadOutlined/> Загрузить
				  </Button>
				</Upload>

				<div style={{ marginTop: 15 }}>
				  <label className="formLabel">Время на ответ:</label>
				  <InputNumber
					  min={1}
					  value={question.answerTime}
					  onChange={this.onAnswerTimeChanged}
					  disabled={question.unlimitedAnswerTime}
					  style={{ width: 60 }}
				  />
				  <span style={{ marginLeft: 10 }}>мин.</span>
				</div>

				<div style={{ marginTop: 15 }}>
				  <Checkbox checked={question.unlimitedAnswerTime} onChange={this.onAnswerTimeSwitched}>
					Неограниченное время ответа
				  </Checkbox>
				</div>

				<div style={{ marginTop: 15 }}>
				  <label>Варианты ответа:</label>
				  <Button
					  type="link"
					  onClick={this.onAddAnswerClicked}>
					<PlusOutlined/>
				  </Button>
				</div>

				<Row>
				  <Col span={24}>
					<Radio.Group style={{ width: '100%', overflow: 'hidden' }}
								 defaultValue={this.getCorrectAnswer()?.key ?? 0}>
					  {question.answers.map(answer => {
						return (
							<div key={answer.key} style={{ marginBottom: 10 }}>
							  <Radio
								  onChange={e => this.onAnswerSwitched(answer.key, e.target.checked)}
								  value={answer.key}
								  style={{ lineHeight: 3, height: 3, width: '100%' }}>
								<Input
									placeholder="Ответ..."
									onChange={e => this.onAnswerTextChanged(answer.key, e.target.value)}
								/>
								<Button
									icon={<DeleteFilled/>}
									style={{ marginLeft: -56 }}
									onClick={() => this.onDeleteAnswerClicked(answer.key)}
								/>
							  </Radio>
							</div>
						);
					  })}
					</Radio.Group>

					<div className="NotificationTexts" style={{ marginTop: 10 }}>
					  <div style={{ marginBottom: 10 }}>
						<label>После прав. ответа: </label>
						<Input value={question.texts.validAnswer} onChange={
						  (e) => this.onNotificationTextChanged(question.key, 'validAnswer', e.target.value)}
						/>
					  </div>
					  <div>
						<label>После неправ. ответа: </label>
						<Input value={question.texts.invalidAnswer} onChange={
						  (e) => this.onNotificationTextChanged(question.key, 'invalidAnswer', e.target.value)}
						/>
					  </div>
					</div>
				  </Col>
				</Row>
				<Row style={{ marginTop: 15 }}>
				  <Button block type="primary" onClick={this.onSubmit}>Сохранить</Button>
				</Row>
			  </Col>
			</Row>
		  </div>

		  <Result
			  status="success"
			  title="Опрос успешно создан!"
			  extra={[
				<Button key="back" type="primary" onClick={this.onBackClicked}>
				  Вернуться к списку
				</Button>,
				<Button key="again" onClick={this.onReloadClicked}>Создать ещё один опрос</Button>
			  ]}
			  style={{ display: this.state.showSuccess ? 'block' : 'none' }}
		  />
		</div>
	);
  }
}

export default withRouter(CreatePoll);
