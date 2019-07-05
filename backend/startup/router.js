const postsRouter = require('../routes/posts');
const path =  require('path');
const express = require('express');

module.exports = function(app) {

    app.use('/api/posts', postsRouter);

    app.use('/images', express.static(path.join('backend/uploads')));
}
