const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const CommentSchema = new Schema(
  {
  content: String,
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
},
{
  timestamps: true,
}
);

const CommentModel = model('Comment', CommentSchema);

module.exports = CommentModel;
