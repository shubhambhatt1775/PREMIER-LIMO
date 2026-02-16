const express = require('express');
const router = express.Router();
const { getCars, addCar, updateCar, deleteCar } = require('../controllers/carController');

router.route('/')
    .get(getCars)
    .post(addCar);

router.route('/:id')
    .put(updateCar)
    .delete(deleteCar);

module.exports = router;
