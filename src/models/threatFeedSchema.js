import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const threatFeedSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  url: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /^(ftp|http|https):\/\/[^ "]+$/.test(v);
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },
}, {
  timestamps: true
});

const ThreatFeed = model('ThreatFeed', threatFeedSchema);

export default ThreatFeed;
