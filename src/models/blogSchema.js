import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  jsxcode: {
    type: String,
    required: true,
    trim: true,
  },
  author:{
    type:mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
  category:{
    type:String,
    default:''
  }
}, { timestamps: true });

// Middleware to update `updatedAt` on each save
blogSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog; 
