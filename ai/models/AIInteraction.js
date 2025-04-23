const mongoose = require('mongoose');

const aiInteractionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    provider: {
        type: String,
        enum: ['openai', 'google', 'azure'],
        required: true
    },
    endpoint: {
        type: String,
        required: true
    },
    prompt: {
        type: String,
        required: true
    },
    response: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    tokensUsed: {
        input: Number,
        output: Number,
        total: Number
    },
    cost: {
        type: Number,
        default: 0
    },
    metadata: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        default: {}
    },
    status: {
        type: String,
        enum: ['success', 'error'],
        required: true
    },
    errorMessage: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for efficient querying
aiInteractionSchema.index({ user: 1, createdAt: -1 });
aiInteractionSchema.index({ provider: 1, createdAt: -1 });

// Static method to get total cost for a user
aiInteractionSchema.statics.getTotalCostForUser = async function(userId) {
    const result = await this.aggregate([
        { $match: { user: mongoose.Types.ObjectId(userId) } },
        { $group: { _id: null, totalCost: { $sum: "$cost" } } }
    ]);
    return result[0]?.totalCost || 0;
};

// Static method to get usage statistics
aiInteractionSchema.statics.getUsageStats = async function(userId, timeframe) {
    const match = { user: mongoose.Types.ObjectId(userId) };
    if (timeframe) {
        match.createdAt = { $gte: timeframe };
    }
    
    return await this.aggregate([
        { $match: match },
        { 
            $group: {
                _id: "$provider",
                totalCalls: { $sum: 1 },
                totalCost: { $sum: "$cost" },
                avgTokensUsed: { $avg: "$tokensUsed.total" },
                successRate: {
                    $avg: { $cond: [{ $eq: ["$status", "success"] }, 1, 0] }
                }
            }
        }
    ]);
};

module.exports = mongoose.model('AIInteraction', aiInteractionSchema); 