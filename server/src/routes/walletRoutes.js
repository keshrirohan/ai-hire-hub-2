const express = require('express');
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  getWallet,
  withdraw,
  fundEscrow,
} = require('../controllers/walletController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getWallet);
router.post('/add-funds', protect, createOrder);
router.post('/verify-payment', protect, verifyPayment);
router.post('/fund-escrow', protect, fundEscrow);
router.post('/withdraw', protect, withdraw);

module.exports = router;
