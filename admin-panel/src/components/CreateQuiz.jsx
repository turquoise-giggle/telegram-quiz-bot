import React from 'react';
import { Button, Collapse, Form, Input, InputNumber, message, PageHeader, Radio, Result, Row, Upload } from 'antd';
import '../styles/CreateQuiz.css';
import { DeleteFilled, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { uploadFile } from '../api/files';
import { createQuiz, postQuiz } from '../api/quizzes';
import { generateKey } from '../helpers/functions';
import { withRouter } from 'react-router';

const initialState = {
  questions: [{
	key: '0',
	image: undefined,
	fileList: [],
	answers: [
	  {
		key: 0,
		text: '',
		isValid: false
	  },
	  {
		key: 1,
		text: '',
		isValid: true
	  }
	],
	texts: {
	  validAnswer: 'Правильно ✅',
	  invalidAnswer: 'Неправильно ❌'
	}
  }],
  showSuccess: false
};

class CreateQuiz extends React.Component {
  state = JSON.parse(JSON.stringify(initialState));

  onBackClicked = () => {
	this.props.history.push('/quizzes');
  };

  onReloadClicked = () => {
	window.location.reload();
  };

  onAddQuestionClicked = () => {
	const { questions } = this.state;

	questions.push({
	  key: generateKey(),
	  image: undefined,
	  answers: [
		{
		  key: 0,
		  text: '',
		  isValid: false
		},
		{
		  key: 1,
		  text: '',
		  isValid: true
		}
	  ],
	  texts: {
		validAnswer: 'Правильно ✅',
		invalidAnswer: 'Неправильно ❌'
	  }
	});

	this.setState({ questions });
  };

  getCorrectAnswer = question => {
	return question.answers.find(question => question.isValid);
  };

  onAddAnswerClicked = (questionKey) => {
	const { questions } = this.state;
	const question = questions.find(q => q.key === questionKey);

	question.answers.push({
	  key: generateKey(),
	  text: `Ответ ${question.answers.length + 1}`,
	  isValid: false
	});

	this.setState({ questions });
  };

  onDeleteAnswerClicked = (questionKey, answerKey) => {
	const { questions } = this.state;
	const question = questions.find(q => q.key === questionKey);
	const answerIndex = question.answers.findIndex(a => a.key === answerKey);

	question.answers.splice(answerIndex, 1);

	this.setState({ questions });
  };

  onAnswerTextChanged = (questionKey, answerKey, text) => {
	const { questions } = this.state;
	const question = questions.find(q => q.key === questionKey);
	const answer = question.answers.find(a => a.key === answerKey);

	answer.text = text;

	this.setState({ questions });
  };

  onAnswerSwitched = (questionKey, answerKey, checked) => {
	if (checked) {
	  const { questions } = this.state;

	  const question = questions.find(q => q.key === questionKey);
	  const answer = question.answers.find(a => a.key === answerKey);

	  question.answers.forEach(answer => answer.isValid = false);

	  answer.isValid = true;

	  this.setState({ questions });
	}
  };

  onNotificationTextChanged = (questionKey, textKey, value) => {
	const { questions } = this.state;
	const question = questions.find(q => q.key === questionKey);

	question.texts[textKey] = value;

	this.setState({ questions });
  };

  uploadFile = async ({ questionKey, file, onSuccess, onError }) => {
	const sizeLimit = 5e+6;

	if (file.size > sizeLimit) {
	  return message.error('Максимальный размер 5MB');
	}

	try {
	  const imageUrl = await uploadFile(file);

	  const { questions } = this.state;
	  const question = questions.find(q => q.key === questionKey);

	  question.image = imageUrl;
	  question.fileList = [file];

	  this.setState({ questions });
	  onSuccess();
	}
	catch (err) {
	  console.error(err);
	  message.error('Не удалось загрузить картинку');
	  onError();
	}
  };

  onFileRemove = key => {
	const { questions } = this.state;
	const question = questions.find(q => q.key === key);

	question.image = undefined;
	question.fileList = [];

	this.setState({ questions });
  };

  onQuestionRemove = (e, key) => {
	e.stopPropagation();
	const { questions } = this.state;
	const questionIndex = questions.findIndex(q => q.key === key);
	questions.splice(questionIndex, 1);

	this.setState({ questions });
  };

  onFormSubmit = async ({ name, prize, answerTime, interval }) => {
	const formIsValid = this.validateEntireForm();

	if (!formIsValid) {
	  return message.warn('Допущены ошибки при составлении виторины');
	}

	const { questions } = this.state;

	try {
	  interval *= 60;
	  const id = await createQuiz({ name, answerTime, prize, questions, interval });
	  await postQuiz(id);

	  this.setState({ ...initialState, showSuccess: true });
	}
	catch (err) {
	  console.error(err);
	  message.error('Не удалось создать викторину');
	}
  };

  validateEntireForm = () => {
	const { questions } = this.state;
	return (
		questions.length > 0 &&
		questions.every(q => q.image && q.answers.length > 1 &&
			q.answers.every(a => a.text && a.text.length) &&
			q.answers.some(a => a.isValid) &&
			Object.keys(q.texts).every(key => q.texts[key] && q.texts[key].length)
		)
	);
  };

  render() {
	const { questions } = this.state;

	return (
		<div>
		  <div style={{ display: this.state.showSuccess ? 'none' : 'block' }}>
			<PageHeader
				className="PageHeader"
				title="Создание викторины"
				onBack={this.onBackClicked}
			/>

			<Form
				className="CreateQuizForm"
				onFinish={this.onFormSubmit}
				initialValues={{
				  'answerTime': 30,
				  'interval': 0,
				  'texts.validAnswer': 'Правильно ✅',
				  'texts.invalidAnswer': 'Неправильно ❌'
				}}
				visible={this.state.showSuccess.toString()}
			>
			  <Form.Item
				  label="Название"
				  name="name"
				  rules={[
					{
					  required: true,
					  message: 'Вы должны присвоить викторине название'
					}
				  ]}
			  >
				<Input placeholder="Введите название викторины..."/>
			  </Form.Item>
			  <Form.Item
				  label="Приз"
				  name="prize"
				  rules={[
					{
					  required: true,
					  message: 'Вы должны установить приз викторины'
					}
				  ]}
			  >
				<Input placeholder="Введите приз викторины..."/>
			  </Form.Item>
			  <Form.Item
				  label="Время на ответ"
				  name="answerTime"
				  rules={[
					{
					  required: true,
					  message: 'Вы должны установить время на ответ'
					}
				  ]}
			  >
			  <span>
			  	<InputNumber defaultValue={30} style={{ width: 60 }} min={1}/>
			  	<span style={{ marginLeft: 10 }}>сек.</span>
			  </span>
			  </Form.Item>

			  <Form.Item
				  label="Интервал отправки вопросов"
				  name="interval"
				  rules={[
					{
					  required: true,
					  message: 'Вы должны установить интервал между вопросами'
					}
				  ]}
			  >
				<span>
				  <InputNumber
					  min={0}
					  defaultValue={0}
					  style={{ width: 60 }}
				  />
				  <span style={{ marginLeft: 10 }}>мин.</span>
				</span>
			  </Form.Item>

			  <Button type="dashed" icon={<PlusOutlined/>} onClick={this.onAddQuestionClicked}>
				Вопрос
			  </Button>

			  <Collapse
				  accordion
				  defaultActiveKey="0"
				  style={{ marginTop: 10, display: !!questions.length ? 'block' : 'none' }}>
				{questions.map((question, i) => {
				  return (
					  <Collapse.Panel
						  key={question.key}
						  header={`Вопрос ${i + 1}`}
						  extra={
							<DeleteFilled
								onClick={e => this.onQuestionRemove(e, question.key)}
								style={{ color: '#ed4d50' }}
							/>}
					  >
						<label className="questionLabel">Картинка:</label>
						<Upload
							className="upload-list-inline"
							listType="picture"
							accept=".png,.jpg,.jpeg"
							defaultFileList={[]}
							fileList={questions.find(q => q.key === question.key).fileList}
							customRequest={({ file, onSuccess, onError }) =>
								this.uploadFile({ questionKey: question.key, file, onSuccess, onError })}
							onRemove={(_) => this.onFileRemove(question.key)}
						>
						  <Button type="dashed">
							<UploadOutlined/> Загрузить
						  </Button>
						</Upload>

						<div style={{ marginTop: 10 }}>
						  <label>Варианты ответа:</label>
						  <Button
							  type="link"
							  style={{ padding: 7 }}
							  onClick={() => this.onAddAnswerClicked(question.key)}>
							<PlusOutlined/>
						  </Button>
						</div>

						<Radio.Group defaultValue={this.getCorrectAnswer(question)?.key ?? 0}>
						  {question.answers.map(answer => {
							return (
								<div key={answer.key} style={{ marginBottom: 10 }}>
								  <Radio
									  onChange={e => this.onAnswerSwitched(question.key, answer.key, e.target.checked)}
									  value={answer.key}
									  style={{ lineHeight: 3, height: 3, width: '80%' }}
								  >
									<Input
										placeholder="Ответ..."
										onChange={e => this.onAnswerTextChanged(question.key, answer.key, e.target.value)}
									/>
									<Button
										icon={<DeleteFilled/>}
										style={{ marginLeft: -10 }}
										onClick={() => this.onDeleteAnswerClicked(question.key, answer.key)}
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
					  </Collapse.Panel>
				  );
				})}
			  </Collapse>

			  <Form.Item style={{ marginTop: 10 }}>
				<Row align="end">
				  <Button htmlType="submit" type="primary">Сохранить</Button>
				</Row>
			  </Form.Item>
			</Form>
		  </div>

		  <Result
			  status="success"
			  title="Викторина успешно создана!"
			  subTitle="Викторина была создана и отправлена в канал"
			  extra={[
				<Button key="back" type="primary" onClick={this.onBackClicked}>
				  Вернуться к списку
				</Button>,
				<Button key="again" onClick={this.onReloadClicked}>Создать ещё одну викторину</Button>
			  ]}
			  style={{ display: this.state.showSuccess ? 'block' : 'none' }}
		  />
		</div>
	);
  }
}

export default withRouter(CreateQuiz);
