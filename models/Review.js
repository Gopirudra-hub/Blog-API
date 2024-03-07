const mongoose = require('mongoose');

const ReviewSchema = mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Please provide rating'],
    },

    comment: {
      type: String,
      required: [true, 'Please provide review text'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: 'post',
      required: true,
    },
  },
  { timestamps: true }
);
ReviewSchema.index({ post: 1, user: 1 }, { unique: true });

ReviewSchema.statics.calculateAverageRating = async function (postId) {
  const result = await this.aggregate([
    { $match: { post: postId } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);

  try {
    await this.model('post').findOneAndUpdate(
      { _id: postId },
      {
        averageRating: Math.ceil(result[0]?.averageRating || 0),
        numOfReviews: result[0]?.numOfReviews || 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

ReviewSchema.post('save', async function () {
  await this.constructor.calculateAverageRating(this.post);
});

ReviewSchema.post('remove', async function () {
  await this.constructor.calculateAverageRating(this.post);
});

module.exports = mongoose.model('Review', ReviewSchema);
