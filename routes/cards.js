const router = require('express').Router();

const {
    getAllCards,
    createCard,
    deleteCard,
    likeCard,
    dislikeCard,
} = require('../controllers/cards');

router.get('/', getAllCards);
router.post('/', createCard);
router.delete('/:id', deleteCard);
router.put(':id/likes', likeCard);
router.delete('/:id/likes', dislikeCard);

module.exports = router;