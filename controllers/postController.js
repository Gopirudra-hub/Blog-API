const Post = require('../models/Post');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const path = require('path');

const createPost = async (req, res) => {
  req.body.user = req.user.userId;
  //const userId = req.user.userId;

  const newPost = await Post.create(req.body);
  //const post = await Post.create({ ...req.body, user: userId });

  res.status(StatusCodes.CREATED).json({ newPost });
};

const getAllPosts = async (req, res) => {
  const Posts = await Post.find({});

  res.status(StatusCodes.OK).json({ Posts, count: Posts.length });
};

const getSinglePost = async (req, res) => {
  const { id: PostId } = req.params;

  const Post = await Post.findOne({ _id: PostId }).populate('reviews');

  if (!Post) {
    throw new CustomError.NotFoundError(`No Post with id : ${PostId}`);
  }

  res.status(StatusCodes.OK).json({ Post });
};

const updatePost = async (req, res) => {
  const { id: PostId } = req.params;

  const Post = await Post.findOneAndUpdate({ _id: PostId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!Post) {
    throw new CustomError.NotFoundError(`No Post with id : ${PostId}`);
  }

  res.status(StatusCodes.OK).json({ Post });
};

const deletePost = async (req, res) => {
  const { id: PostId } = req.params;

  const Post = await Post.findOne({ _id: PostId });

  if (!Post) {
    throw new CustomError.NotFoundError(`No Post with id : ${PostId}`);
  }

  await Post.remove();
  res.status(StatusCodes.OK).json({ msg: 'Success! Post removed.' });
};

const uploadImage = async (req, res) => {
  if (!req.files) {
    throw new CustomError.BadRequestError('No File Uploaded');
  }
  const PostImage = req.files.image;

  if (!PostImage.mimetype.startsWith('image')) {
    throw new CustomError.BadRequestError('Please Upload Image');
  }

  const maxSize = 1024 * 1024;

  if (PostImage.size > maxSize) {
    throw new CustomError.BadRequestError(
      'Please upload image smaller than 1MB'
    );
  }

  const imagePath = path.join(
    __dirname,
    '../public/uploads/' + `${PostImage.name}`
  );
  await PostImage.mv(imagePath);
  res.status(StatusCodes.OK).json({ image: `/uploads/${PostImage.name}` });
};


module.exports = {
  createPost,
  getAllPosts,
  getSinglePost,
  updatePost,
  deletePost,
  uploadImage
};
