import mongoose, { mongo } from 'mongoose';

const channelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  members: [{ type: mongoose.Schema.ObjectId, ref: 'User', required: true }],
  admin: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  messages:[ {
    type: mongoose.Schema.ObjectId,
    ref: 'Messages',
    required: false,
  }],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

channelSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});
channelSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

const Channel =
  mongoose.models.Channels || mongoose.model('Channels', channelSchema);


  export default Channel