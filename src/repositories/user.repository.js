class UsersRepository {
    constructor(UserDao) {
        this.UserDao = UserDao
    }

    getUsers = async () => await this.UserDao.getAll()
    getUser = async uid => await this.UserDao.get(uid)
    createUser = async newUser => await this.UserDao.create(newUser)
    deleteUser = async uid => await this.UserDao.delete(uid)
    toggleUserRole = async uid => {
        const user = await this.UserDao.get(uid)
        if (!user) {
            throw new Error('User not found')
        }
        user.role = user.role === 'user' ? 'premium' : 'user'
        return await this.UserDao.update(uid, { role: user.role })
    }
    updateUser = async (uid, updateData) => {
        return await this.UserDao.update(uid, updateData);
      }
}

module.exports = UsersRepository
