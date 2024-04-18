const express = require('express');
const controller = require('../controllers/newController');
const router = express.Router();
const { upload } = require('../middleware/fileUpload');
const {isLoggedIn, isSeller} = require('../middleware/auth');
const { validateId } = require('../middleware/validator');

router.get('/', controller.index);

router.get('/new', isLoggedIn, controller.new);

router.post('/', upload, isLoggedIn, controller.create);

router.get('/:id', validateId, controller.showItem);

router.get('/:id/edit', isLoggedIn, isSeller, validateId, controller.edit);

router.put('/:id', upload, isLoggedIn, isSeller, validateId, controller.update);

router.delete('/:id', isLoggedIn, isSeller, validateId, controller.delete);

module.exports = router;

// (1) renders index page 
// (2) renders items page 
// (3) creating new items 'post'
// (4) showing items 
// (5) editting items
// (6) updating items
// (7) deleting items 



