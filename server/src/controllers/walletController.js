const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Project = require('../models/Project');

let razorpay;
const getRazorpay = () => {
  if (!razorpay) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpay;
};

// @desc    Create Razorpay order
// @route   POST /api/wallet/add-funds
exports.createOrder = async (req, res, next) => {
  try {
    const { amount } = req.body;

    if (!amount || amount < 100) {
      return res.status(400).json({
        success: false,
        message: 'Minimum amount is ₹100',
      });
    }

    const order = await getRazorpay().orders.create({
      amount: Math.round(amount * 100), // paise
      currency: 'INR',
      receipt: `receipt_${req.user.id}_${Date.now()}`,
    });

    // Create pending transaction
    await Transaction.create({
      userId: req.user.id,
      amount,
      type: 'deposit',
      status: 'pending',
      paymentMethod: 'razorpay',
      razorpayOrderId: order.id,
      description: 'Wallet top-up via Razorpay',
    });

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/wallet/verify-payment
exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest('hex');

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    // Update transaction and wallet
    const transaction = await Transaction.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        status: 'completed',
        razorpayPaymentId: razorpay_payment_id,
      },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $inc: { walletBalance: transaction.amount } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: `₹${transaction.amount} added to your wallet!`,
      walletBalance: user.walletBalance,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Fund project escrow
// @route   POST /api/wallet/fund-escrow
exports.fundEscrow = async (req, res, next) => {
  try {
    const { projectId } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.clientId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const user = await User.findById(req.user.id);

    if (user.walletBalance < project.budget) {
      return res.status(400).json({
        success: false,
        message: `Insufficient balance. Required: ₹${project.budget}, Available: ₹${user.walletBalance}`,
      });
    }

    user.walletBalance -= project.budget;
    project.escrowAmount += project.budget;
    project.status = 'in_progress';

    // Activate first milestone
    if (project.milestones.length > 0) {
      project.milestones[0].status = 'active';
    }

    await user.save();
    await project.save();

    await Transaction.create({
      userId: req.user.id,
      projectId: project._id,
      amount: project.budget,
      type: 'escrow',
      status: 'completed',
      paymentMethod: 'wallet',
      description: `Escrow funded for project: ${project.title}`,
    });

    res.status(200).json({
      success: true,
      message: 'Project funded successfully!',
      walletBalance: user.walletBalance,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get wallet balance and transactions
// @route   GET /api/wallet
exports.getWallet = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('walletBalance name');
    const transactions = await Transaction.find({ userId: req.user.id })
      .populate('projectId', 'title')
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      walletBalance: user.walletBalance,
      transactions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Withdraw funds
// @route   POST /api/wallet/withdraw
exports.withdraw = async (req, res, next) => {
  try {
    const { amount, bankDetails } = req.body;

    const user = await User.findById(req.user.id);

    if (!amount || amount < 100) {
      return res.status(400).json({ success: false, message: 'Minimum withdrawal is ₹100' });
    }

    if (user.walletBalance < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient wallet balance' });
    }

    user.walletBalance -= amount;
    await user.save();

    await Transaction.create({
      userId: req.user.id,
      amount,
      type: 'withdrawal',
      status: 'pending',
      paymentMethod: 'bank_transfer',
      description: 'Withdrawal request',
      metadata: { bankDetails },
    });

    res.status(200).json({
      success: true,
      message: 'Withdrawal request submitted. Processing within 2-3 business days.',
      walletBalance: user.walletBalance,
    });
  } catch (error) {
    next(error);
  }
};
