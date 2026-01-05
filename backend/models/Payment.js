const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    currency: {
        type: String,
        default: 'usd',
        uppercase: true
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'cash', 'online'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    stripePaymentIntentId: {
        type: String,
        sparse: true
    },
    transactionId: {
        type: String,
        unique: true,
        sparse: true
    },
    receiptUrl: String,
    refundReason: String,
    refundedAt: Date,
    metadata: {
        type: Map,
        of: String
    }
}, {
    timestamps: true
});

// Generate transaction ID before saving
paymentSchema.pre('save', function (next) {
    if (!this.transactionId && this.status === 'completed') {
        this.transactionId = 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
    }
    next();
});

// Index for faster queries
paymentSchema.index({ customer: 1, createdAt: -1 });
paymentSchema.index({ order: 1 });
paymentSchema.index({ status: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
