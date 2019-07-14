const express = require('express');
const upload = require('multer');

const Post = require('../models/post');
const loginUsersOnly = require('../middleware/auth');

const router = express.Router();
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
}

const storage = upload.diskStorage({
    destination: (req, file, cb) => {
        const extensionIsValid = MIME_TYPES[file.mimetype];
        let error = null;
        console.log(file.mimetype);
        console.log(extensionIsValid);
        if(!extensionIsValid) {
            error = new Error('Invalid mime-type');
        }
        cb(error, './backend/uploads');
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const extension = MIME_TYPES[file.mimetype];
        cb(null, `${name}-${Date.now()}.${extension}`);
    }
})

router.get('/', async (req, res) => {
    const pageSize = +req.query.ps;
    const page = +req.query.p;
    let dbQuery = Post.find();
    if (page && pageSize) {
        dbQuery.skip(pageSize * (page - 1)).limit(pageSize);
    }
    try {
        const posts = await dbQuery;
        res.status(200).json({
            message: 'All works perfect',
            data: posts
        })
    } catch (ex) {
        res.status(500).send('Something went wrong', ex);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (ex) {
        res.status(500).send('Something went wrong', ex);
    }
});

router.post('/', loginUsersOnly, upload({storage: storage}).single('uploadedFile'), async (req, res) => {
    const url = `${req.protocol}://${req.get('host')}`;
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        filePath: `${url}/images/${req.file.filename}`,
        creator: req.customData.userId
    });
    try {
        const addedPost = await post.save();
        console.log(addedPost);
        res.status(200).send(addedPost);
    } catch (ex) {
        res.status(500).send('Something went wrong', ex);
    }
});

router.put('/:id', loginUsersOnly, upload({storage: storage}).single('uploadedFile'), async (req, res) => {
    let filePath = req.body.filePath;
    if (req.file) {
        const url = `${req.protocol}://${req.get('host')}`;
        filePath = `${url}/images/${req.file.filename}`;
    }

    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        filePath: filePath,
        creator: req.customData.userId
    });

    try {
        const updatedPost = await Post.updateOne({ _id: req.params.id, creator: req.customData.userId }, post);
        if(updatedPost.nModified > 0) {
          res.status(200).json({
              _id: req.body.id,
              title: req.body.title,
              content: req.body.content,
              filePath: filePath,
              creator: req.customData.userId
          });
        } else {
          res.status(401).send('You can not edit other users posts.!');
        }
    } catch (ex) {
        res.status(500).send('Something went wrong', ex);
    }
});

router.delete('/:id', loginUsersOnly, async (req, res) => {
    try {
        const deletedPost = await Post.findByIdAndRemove(req.params.id);
        if(deletedPost.n > 0) {
          res.status(200).send(deletedPost);
        } else {
          res.status(401).send('You can not delete other users posts.!');
        }
    } catch (ex) {
        res.status(500).send('Something went wrong', ex);
    }
});

module.exports = router;
