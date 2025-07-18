import mongoose from 'mongoose';

const JournalEntrySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: {
    type: [String],
    default: []
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.JournalEntry || mongoose.model('JournalEntry', JournalEntrySchema);