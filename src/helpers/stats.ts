import User from '../models/user';

/**
 * Возвращает количество пользователей
 * @async
 * @function getAllUsersCount
 * @returns { Promise<number> }
 */
export const getAllUsersCount = async () => {
    let users = await User.find({});
    return users.length;
};
