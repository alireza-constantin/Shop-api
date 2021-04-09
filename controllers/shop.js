const Product = require('../models/product');
const asyncHandler = require('../util/asyncHandler');
const Order = require('../models/order');
const fs = require('fs');
const path = require('path');

//  @Method   GET Products
//  @Route    /
// Home Page
exports.getIndex = asyncHandler(async (req, res, next) => {
  const product = await Product.find();
  await res.render('shop/index', {
    pageTitle: 'Shop',
    prods: product,
    path: '/',
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
  });
});

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
  });
};

exports.getInvoices = asyncHandler(async (req, res, next) => {
  const orderId = req.params.orderId;
  const invoiceName = 'invoice-' + orderId + '.pdf';
  const invoicePath = path.join('data', 'invoices', invoiceName);
  const order = await Order.findById(orderId);

  if (!order) {
    return next(new Error('order not found.'));
  }

  if (order.user.userId.toString() !== req.user._id.toString()) {
    return next(new Error('User is not Authorized.'));
  }

  await fs.readFile(invoicePath, (err, data) => {
    if (err) {
      return next(err);
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'inline; filename="' + invoiceName + '"'
    );
    res.status(200).send(data);
  });
});
