const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); 
const {
    getSavings, 
    addSaving,
    updateSaving,
    deleteSaving
} = require('../controllers/savingController');

router.get('/', auth, getSavings);
router.post('/', auth, addSaving);
router.put('/:id', auth, updateSaving);
router.delete('/:id', auth, deleteSaving);

module.exports = router;