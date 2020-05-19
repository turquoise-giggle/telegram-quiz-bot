import path from 'path';
import koaMulter from '@koa/multer';

export const DEST_PATH = path.join(__dirname, '../../../assets');

const upload = koaMulter({
	storage: koaMulter.diskStorage({
		destination: (req, file, callback) => {
			const dest = DEST_PATH;
			callback(null, dest);
		},
		filename: (req, file, callback) => {
			const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
			const fileSplitArr = file.originalname.split('.');
			const extension = fileSplitArr[fileSplitArr.length - 1] || 'jpg';
			const fileName = `${file.fieldname}-${uniqueSuffix}.${extension}`;
			callback(null, fileName);
		}
	}),
	fileFilter: (req, file, callback) => {
		const ext = path.extname(file.originalname).toLowerCase();
		const err = ['.jpg', '.jpeg', '.png'].includes(ext) ? null : new Error('Only JPG, PNG are allowed');
		callback(err, true);
	},
	limits: {
		files: 1,
		fileSize: 1024 * 1024 * 5 // 5MB
	}
}).fields([
	{
		name: 'image'
	}
]);

export default upload;
