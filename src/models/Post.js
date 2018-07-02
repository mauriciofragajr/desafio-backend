import mongoose from '../database';

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    body: {
        type: String,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        index: true
    }]
},
    {
        timestamps: {}
    });

const Post = mongoose.model('Post', PostSchema);

export default Post;