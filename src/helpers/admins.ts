import argon2 from 'argon2';
import Admin, { IAdmin } from '../models/admin';

export async function addAdmin(username: string, password: string) {
	const hash = await argon2.hash(password);
	const admin = new Admin({
		username,
		password: hash
	});
	return admin.save();
}

export async function getAdmins(filter = {}) {
	return Admin.find(filter);
}

export async function getAdmin(username: string) {
	return Admin.findOne({ username });
}

export async function checkPassword(username: string, password: string): Promise<boolean> {
	const admin = await getAdmin(username);
	return admin ? argon2.verify(admin.password, password) : false;
}