const Product = require('../models/product');
const asyncHandler = require('../util/asyncHandler');

//  @Method   Get Admin Products Page
//  @Route    /admin/products
exports.getAdminProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find();
  res.render('admin/products', {
    pageTitle: 'Admin Products',
    prods: products,
    isActive: true,
    path: '/admin/products',
    isAuthenticated: req.session.isloggedIn,
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
    isAuthenticated: req.session.isloggedIn,
  });
});

//  @Method   POST Add Products
//  @Route    /admin/add-products
exports.postAddProducts = asyncHandler(async (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
  const user = req.user._id;
  console.log(user);
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
  res.render('admin/edit-product', {
    product: product,
    pageTitle: 'Edit Product',
    path: 'admin/edit-product',
    editing,
    isAuthenticated: req.session.isloggedIn,
  });
});

//  @Method   POST Edit Products
//  @Route    /admin/edit-product
exports.postEditProduct = asyncHandler(async (req, res, next) => {
  const { productId, title, imageUrl, price, description } = req.body;
  const product = await Product.findById(productId);
  product.title = title;
  product.imageUrl = imageUrl;
  product.price = price;
  product.description = description;
  await product.save();
  await res.redirect('/admin/products');
});

//  @Method   POST Delete Products
//  @Route    /admin/delete-product
exports.deleteProducts = asyncHandler(async (req, res, next) => {
  prodId = req.body.productId;
  const product = await Product.findById(prodId);
  await product.delete();
  await res.redirect('/admin/products');
});
