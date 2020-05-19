import DB from './db';
import { addAdmin } from './helpers/admins';
import Server from './server';
import Telegram from './telegram';
// import Daemon from './daemon/daemon';

async function main() {
	await DB.connect();
	// await Daemon.init();
	await addAdmin('admin', 'admin');
	await Server.init();
	await Telegram.init();
}

main();
