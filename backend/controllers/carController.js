const Car = require('../models/Car');
const { cache, getCacheKey, TTL } = require('../utils/cache');

// @desc    Get all cars
// @route   GET /api/cars
exports.getCars = async (req, res) => {
    try {
        const cacheKey = getCacheKey('cars', req.query);
        const cachedData = cache.get(cacheKey);

        if (cachedData) {
            console.log('⚡ Cache Hit: Car Listings');
            return res.json(cachedData);
        }

        const cars = await Car.find();
        cache.set(cacheKey, cars, TTL.MEDIUM);
        console.log('💾 Cache Miss: Car Listings (Stored)');
        res.json(cars);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single car
// @route   GET /api/cars/:id
exports.getCar = async (req, res) => {
    try {
        const cacheKey = `car:${req.params.id}`;
        const cachedData = cache.get(cacheKey);

        if (cachedData) {
            console.log(`⚡ Cache Hit: Car Details (${req.params.id})`);
            return res.json(cachedData);
        }

        const car = await Car.findById(req.params.id);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        cache.set(cacheKey, car, TTL.MEDIUM);
        console.log(`💾 Cache Miss: Car Details (${req.params.id})`);
        res.json(car);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add new car
// @route   POST /api/cars
exports.addCar = async (req, res) => {
    try {
        const car = await Car.create(req.body);

        // Invalidate car list cache
        const keys = cache.keys();
        const carListKeys = keys.filter(k => k.startsWith('cars:'));
        cache.del(carListKeys);
        console.log('🗑️ Cache Purged: all-cars-list');

        res.status(201).json(car);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update car
// @route   PUT /api/cars/:id
exports.updateCar = async (req, res) => {
    try {
        const car = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!car) return res.status(404).json({ message: 'Car not found' });

        // Invalidate both detail and list cache
        const keys = cache.keys();
        const carListKeys = keys.filter(k => k.startsWith('cars:'));
        cache.del([...carListKeys, `car:${req.params.id}`]);
        console.log(`🗑️ Cache Purged: car:${req.params.id} and list`);

        res.json(car);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete car
// @route   DELETE /api/cars/:id
exports.deleteCar = async (req, res) => {
    try {
        const car = await Car.findByIdAndDelete(req.params.id);
        if (!car) return res.status(404).json({ message: 'Car not found' });

        // Invalidate both detail and list cache
        const keys = cache.keys();
        const carListKeys = keys.filter(k => k.startsWith('cars:'));
        cache.del([...carListKeys, `car:${req.params.id}`]);
        console.log(`🗑️ Cache Purged: car:${req.params.id} and list`);

        res.json({ message: 'Car removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
