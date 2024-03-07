const express = require('express');
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication');

const {
  createPost,
  getAllPosts,
  getSinglePost,
  updatePost,
  deletePost,
  uploadImage
} = require('../controllers/postController');


router
  .route('/')
  .post([authenticateUser, authorizePermissions('admin')], createPost)
  .get(getAllPosts);

router
  .route('/uploadImage')
  .post([authenticateUser, authorizePermissions('admin')], uploadImage);

router
  .route('/:id')
  .get(getSinglePost)
  .patch([authenticateUser, authorizePermissions('admin')], updatePost)
  .delete([authenticateUser, authorizePermissions('admin')], deletePost);



module.exports = router;
