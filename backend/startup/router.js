const express = require('express');
const path =  require('path');

const postsRouter = require('../routes/posts');
const userRouter = require('../routes/user');

module.exports = function(app) {

    app.use('/api/posts', postsRouter);
    app.use('/api/users', userRouter);

    app.use('/images', express.static(path.join('backend/uploads')));
}
