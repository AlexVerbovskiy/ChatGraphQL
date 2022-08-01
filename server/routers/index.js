const {Router} = require('express');
const userController = require('../controllers/user');
const chatController = require('../controllers/chat');

const router = new Router();

router.get("/userAvatar/:link", chatController.getAvatar);
router.get("/messageMedia/:type/:link", chatController.getMediaMessage);
router.get("/activate/:link", userController.activate);

module.exports = router;