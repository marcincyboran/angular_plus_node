const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    filePath: {
        type: String
    }
});

const Post = mongoose.model('Post', postSchema);

module.exports = postSchema;
module.exports = Post;