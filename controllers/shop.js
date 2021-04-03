const Product = require('../models/product');
const asyncHandler = require('../util/asyncHandler');
const Order = require('../models/order');

//  @Method   GET Products
//  @Route    /
// Home Page
exports.getIndex = asyncHandler(async (req, res, next) => {
  const product = await Product.find();
  await res.render('shop/index', {
    pageTitle: 'Shop',
    prods: product,
    path: '/',
    isAuthenticated: req.session.isloggedIn,
  });
});

//  @Method   GET Products
//  @Route    /products
exports.getProducts = asyncHandler(async (req, res, next) => {
  const product = await Product.find();

  await res.render('shop/product-list', {
    pageTitle: 'Products',
    prods: product,
    path: '/products',
    isAuthenticated: req.session.isloggedIn,
  });
});

//  @Method   GET Single Products
//  @Route    /products/productId
exports.getProduct = asyncHandler(async (req, res, next) => {
  const prodId = req.params.productId;
  const product = await Product.findById(prodId);

  await res.render('shop/product-detail', {
    product: product,
    path: '/products',
    pageTitle: product.title,
    isAuthenticated: req.session.isloggedIn,
  });
});

exports.getCart = asyncHandler(async (req, res, next) => {
  const product = await req.user
    .populate('cart.items.productId')
    .execPopulate();
  res.render('shop/cart', {
    pageTitle: 'Your Cart',
    path: '/cart',
    product: product.cart.items,
    isAuthenticated: req.session.isloggedIn,
  });
});

exports.postCart = asyncHandler(async (req, res, next) => {
  const prodId = req.body.productId;
  const product = await Product.findById(prodId);
  await req.user.addToCart(product);
  await res.redirect('/cart');
});

exports.postCartDeleteItem = asyncHandler(async (req, res, next) => {
  const prodId = req.body.productId;
  await req.user.deleteItemFromCart(prodId);
  await res.redirect('/cart');
});

exports.postOrder = asyncHandler(async (req, res, next) => {
  const product = await req.user
    .populate('cart.items.productId')
    .execPopulate();
  const products = await product.cart.items.map((p) => {
    console.log(product.cart.items);
    return {
      quantity: p.quantity,
      product: { ...p.productId._doc },
    };
  });
  const order = new Order({
    user: {
      email: req.user.email,
      userId: req.user,
    },
    products: products,
  });

  await order.save();
  await req.user.clearCart();
  await res.redirect('/orders');
});

exports.getOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ 'user.userId': req.user._id });

  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders',
    orders: orders,
    isAuthenticated: req.session.isloggedIn,
  });
});

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
  });
};
