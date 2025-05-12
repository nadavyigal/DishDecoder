import mongoose from 'mongoose';

const ChallengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  coverImageURL: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  recipeIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe'
  }],
  rewards: {
    type: String
  },
  status: {
    type: String,
    enum: ['upcoming', 'active', 'completed'],
    default: 'upcoming'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  postCount: {
    type: Number,
    default: 0
  },
  rules: {
    type: String
  },
  judging: {
    type: String
  },
  isPublished: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Auto-update status based on date
ChallengeSchema.pre('save', function(next) {
  const now = new Date();
  
  if (now < this.startDate) {
    this.status = 'upcoming';
  } else if (now >= this.startDate && now <= this.endDate) {
    this.status = 'active';
  } else {
    this.status = 'completed';
  }
  
  next();
});

// Indexes for filtering
ChallengeSchema.index({ status: 1 });
ChallengeSchema.index({ featured: 1 });
ChallengeSchema.index({ startDate: 1 });
ChallengeSchema.index({ endDate: 1 });

const Challenge = mongoose.models.Challenge || mongoose.model('Challenge', ChallengeSchema);

export default Challenge; 