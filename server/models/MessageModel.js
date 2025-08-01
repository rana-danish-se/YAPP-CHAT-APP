import mongoose, { mongo } from 'mongoose';
const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: 'User',
  },
  messageType: {
    type: String,
    enum: ['text', 'file'],
    required: true,
  },
  content: {
    type: String,
    required: function () {
      return this.messageType === 'text';
    },
  },
  fileUrl: {
    type: String,
    required: function () {
      return this.messageType === 'file';
    },
  },
  timestamp: {
    type: Date,
    default: Date.now(),
  },
});

const Message =
  mongoose.model.Messages || mongoose.model('Messages', messageSchema);

export default Message;
