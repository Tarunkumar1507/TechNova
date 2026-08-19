const express = require('express');
const router = express.Router();
const { getAdminOrders } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, admin, getAdminOrders);

module.exports = router;
