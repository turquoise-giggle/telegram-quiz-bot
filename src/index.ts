import DB from './db';
import Server from './server';
import Telegram from './telegram';
// import Daemon from './daemon/daemon';

async function main() {
	await DB.connect();
	// await Daemon.init();

	await Server.init();
	await Telegram.init();
}

main();