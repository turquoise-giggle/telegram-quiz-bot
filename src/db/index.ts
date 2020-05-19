import mongoose from 'mongoose';
import config from '../config';

const DB = {
	isConnected: false,
	url: config.dbUrl,
	connect: async function() {
		if (this.isConnected) {
			return;
		}

		// Устранение deprecations
		mongoose.set('useNewUrlParser', true);
		mongoose.set('useFindAndModify', false);
		mongoose.set('useCreateIndex', true);
		mongoose.set('useUnifiedTopology', true);

		// Подключение к базе данных
		try {
			await mongoose.connect(DB.url);
			this.isConnected = true;
			console.log('=> База данных подключена');
		} catch (err) {
			console.error(`XXX Возникла ошибка при подключении к MongoDB! Текст ошибки: \n${err.message}`);
			process.exit(1); // Выход из приложения
		}
	}
};

export default DB;
