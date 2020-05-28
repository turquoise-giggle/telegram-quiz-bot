import React from 'react';
import { Button, Col, Form, Input, message, Row } from 'antd';
import '../styles/TextsEdit.css';
import { fetchText, updateTexts } from '../api/texts';

const textIds = [
  'quiz.validAnswer',
  'quiz.invalidAnswer',
  'quiz.timeIsOver',
  'quiz.noAnswerPrevQuestion',
  'quiz.invalidPrevQuestion',
  'poll.timeIsOver',
  'poll.validAnswer',
  'poll.invalidAnswer'
];

class TextsEdit extends React.Component {
  formRef = React.createRef();

  componentDidMount() {
	this.updateData();
  }

  updateData = async () => {
	const data = await Promise.all(textIds.map(id => fetchText(id)));

	const obj = {};

	for (const text of data) {
	  if (text) {
		obj[text.name] = text.value;
	  }
	}

	this.formRef.current.setFieldsValue(obj);
  };

  onSubmit = async (texts) => {
	for (const id in texts) {
	  if (texts.hasOwnProperty(id) && !texts[id]) {
		delete texts[id];
	  }
	}

	try {
	  await updateTexts(texts);
	  message.success('Тексты успешно изменены');
	}
	catch (err) {
	  console.error(err);
	  message.error('Не удалось изменить тексты');
	}
  };

  render() {
	return (
		<div className="TextsEdit">
		  <Form
			  ref={this.formRef}
			  onFinish={this.onSubmit}
		  >
			<Row justify="left">
			  <Col span={24}>
				<h2>Викторины</h2>
				<Form.Item
					name="quiz.validAnswer"
					label="Правильний ответ"
					required
				>
				  <Input/>
				</Form.Item>

				<Form.Item
					name="quiz.invalidAnswer"
					label="Неправильный ответ"
					required
				>
				  <Input/>
				</Form.Item>

				<Form.Item
					name="quiz.timeIsOver"
					label="Время вышло"
					required
				>
				  <Input/>
				</Form.Item>

				<Form.Item
					name="quiz.noAnswerPrevQuestion"
					label="Не ответил на пред. вопрос"
					required
				>
				  <Input/>
				</Form.Item>

				<Form.Item
					name="quiz.invalidPrevQuestion"
					label="Неправильно ответил на пред. вопрос"
					required
				>
				  <Input/>
				</Form.Item>
			  </Col>
			</Row>

			<Row justify="left">
			  <Col span={24}>
				<h2>Опросы</h2>
				<Form.Item
					name="poll.validAnswer"
					label="Правильний ответ"
					required
				>
				  <Input/>
				</Form.Item>

				<Form.Item
					name="poll.invalidAnswer"
					label="Неправильный ответ"
					required
				>
				  <Input/>
				</Form.Item>

				<Form.Item
					name="poll.timeIsOver"
					label="Время вышло"
					required
				>
				  <Input/>
				</Form.Item>

				<Row justify="end">
				  <Form.Item>
					<Button htmlType="submit" type="primary">Сохранить</Button>
				  </Form.Item>
				</Row>
			  </Col>
			</Row>
		  </Form>
		</div>
	);
  }
}

export default TextsEdit;
