const Product = require('../models/product');
const asyncHandler = require('../util/asyncHandler');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

//  @Method   Get Admin Products Page
//  @Route    /admin/products
exports.getAdminProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find({ userId: req.user._id });
  res.render('admin/products', {
    pageTitle: 'Admin Products',
    prods: products,
    isActive: true,
    path: '/admin/products',
  });
});

//  @Method   Get Add Products Page
//  @Route    /admin/add-product
exports.getAddProducts = asyncHandler(async (req, res, next) => {
  await res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    isActive: true,
    path: '/admin/add-product',
    editing: false,
    hasErr: null,
    errMsg: [],
    valErr: [],
  });
});

//  @Method   POST Add Products
//  @Route    /admin/add-products
exports.postAddProducts = asyncHandler(async (req, res, next) => {
  const { title, price, description } = req.body;
  const image = req.file;
  console.log(image);
  const user = req.user._id;

  if (!image) {
    return await res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      isActive: true,
      path: '/admin/add-product',
      editing: false,
      hasErr: true,
      errMsg: 'Attached file is not an image.',
      product: {
        title,
        price,
        description,
      },
      valErr: [],
    });
  }

  const error = validationResult(req);
  if (!error.isEmpty()) {
    return await res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      isActive: true,
      path: '/admin/add-product',
      editing: false,
      hasErr: true,
      errMsg: error.array()[0].msg,
      product: {
        title,
        price,
        description,
      },
      valErr: error.array(),
    });
  }

  const imageUrl = image.path;
  const product = await new Product({
    title,
    imageUrl,
    price,
    description,
    userId: user,
  });
  await product.save();
  await res.redirect('/admin/products');
});

//  @Method   Get Edit Products Page
//  @Route    /admin/edit-product/:produtId
exports.getEditProducts = asyncHandler(async (req, res, next) => {
  const prodId = req.params.productId;
  const editing = req.query.edit;
  if (!editing) {
    return res.redirect('/');
  }
  const product = await Product.findById(prodId);
  if (!product) {
    return res.redirect('/');
  }
  if (product.userId.toString() !== req.user._id.toString()) {
    return res.redirect('/');
  }
  res.render('admin/edit-product', {
    product: product,
    pageTitle: 'Edit Product',
    path: 'admin/edit-product',
    editing,
    hasErr: null,
    errMsg: [],
    valErr: [],
  });
});

//  @Method   POST Edit Products
//  @Route    /admin/edit-product
exports.postEditProduct = asyncHandler(async (req, res, next) => {
  const { productId, title, price, description } = req.body;
  const image = req.file;

  const error = validationResult(req);
  if (!error.isEmpty()) {
    return await res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      isActive: true,
      path: '/admin/add-product',
      editing: true,
      hasErr: true,
      errMsg: error.array()[0].msg,
      product: {
        title,
        price,
        description,
        _id: productId,
      },
      valErr: error.array(),
    });
  }

  const product = await Product.findById(productId);
  product.title = title;

  // check if image is not undefined
  if (image) {
    product.imageUrl = image.path;
  }
  product.price = price;
  product.description = description;
  await product.save();
  await res.redirect('/admin/products');
});

//  @Method   POST Delete Products
//  @Route    /admin/delete-product
exports.deleteProducts = asyncHandler(async (req, res, next) => {
  prodId = req.body.productId;
  const product = await Product.deleteOne({
    _id: prodId,
    userId: req.user._id,
  });
  await res.redirect('/admin/products');
});
