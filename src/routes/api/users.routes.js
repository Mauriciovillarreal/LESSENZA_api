const { Router } = require('express')
const UserController = require('../../controller/users.controller')
const upload = require('../../utils/multerConfig')

const router = Router()
const {
    getUsers,
    getUser,
    createUser,
    toggleUserRole,
    uploadDocuments,
    deleteInactiveUsers,
    deleteUser
} = new UserController()

router.get('/', getUsers)
router.get('/:uid', getUser)
router.post('/', createUser)
router.post('/premium/:uid', toggleUserRole)
router.post('/:uid/documents', upload.fields
    ([
        { name: 'profile', maxCount: 10 },
        { name: 'products', maxCount: 10 },
        { name: 'documents', maxCount: 10 },
    ]), uploadDocuments)
router.delete('/:uid', deleteUser)
router.delete('/inactive', deleteInactiveUsers);

module.exports = router