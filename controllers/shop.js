const Product = require('../models/product');
const asyncHandler = require('../util/asyncHandler');
const Order = require('../models/order');
const fs = require('fs');
const path = require('path');
const pdfDocument = require('pdfkit');
const stripe = require('stripe')(
  'sk_test_51IezTGDy5lK6rdHFdats3OtzrvbdQ9QFNp4N6T8m2MtVLbMm43jQfuWfxLb9JM0SpiTfwa1Lvsv8C4wFiYktmBMX00iHPDIPd5'
);

const itemsPerPage = 1;
//  @Method   GET Products
//  @Route    /
// Home Page
exports.getIndex = asyncHandler(async (req, res, next) => {
  const page = +req.query.page || 1;
  const productCounts = await Product.countDocuments();
  const product = await Product.find()
    .skip((page - 1) * itemsPerPage)
    .limit(itemsPerPage);
  await res.render('shop/index', {
    pageTitle: 'Shop',
    prods: product,
    path: '/',
    currentPage: page,
    hasNextPage: itemsPerPage * page < productCounts,
    hasPreviousPage: page > 1,
    nextPage: page + 1,
    previousPage: page - 1,
    lastPage: Math.ceil(productCounts / itemsPerPage),
  });
});

//  @Method   GET Products
//  @Route    /products
exports.getProducts = asyncHandler(async (req, res, next) => {
  const page = +req.query.page || 1;
  const productCounts = await Product.countDocuments();
  const product = await Product.find()
    .skip((page - 1) * itemsPerPage)
    .limit(itemsPerPage);
  await res.render('shop/product-list', {
    pageTitle: 'Products',
    prods: product,
    path: '/products',
    currentPage: page,
    hasNextPage: itemsPerPage * page < productCounts,
    hasPreviousPage: page > 1,
    nextPage: page + 1,
    previousPage: page - 1,
    lastPage: Math.ceil(productCounts / itemsPerPage),
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

exports.getCheckout = asyncHandler(async (req, res, next) => {
  const product = await req.user
    .populate('cart.items.productId')
    .execPopulate();

  let sum = 0;
  const prodItems = product.cart.items;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: prodItems.map((p) => {
      return {
        name: p.productId.title,
        description: p.productId.description,
        amount: p.productId.price * 100,
        currency: 'usd',
        quantity: p.quantity,
      };
    }),
    success_url: req.protocol + '://' + req.get('host') + '/checkout/success',
    cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel',
  });

  await prodItems.forEach((p) => {
    sum += p.quantity * p.productId.price;
  });
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
    product: prodItems,
    totalSum: sum,
    sessionId: session.id,
  });
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

exports.postOrderDelete = asyncHandler(async (req, res, next) => {
  const orderId = req.body.orderId;
  if (!orderId) {
    return next(new Error('Order not found'));
  }
  await Order.findByIdAndDelete(orderId);
  await res.redirect('/orders');
});

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

  const pdfDoc = new pdfDocument();
  pdfDoc.pipe(fs.createWriteStream(invoicePath));
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    'inline; filename="' + invoiceName + '"'
  );
  pdfDoc.pipe(res);
  pdfDoc.fontSize('25').text('Invoice', 200, 80);
  pdfDoc.text('-------------');
  let sum = 0;
  order.products.forEach((prod) => {
    sum += prod.product.price * prod.quantity;
    pdfDoc
      .fontSize('12')
      .text(
        prod.product.title +
          ' - ' +
          prod.quantity +
          ' x ' +
          ' $' +
          prod.product.price
      );
  });
  pdfDoc.text('------');
  pdfDoc.fontSize('23').text('Total Price: $' + sum.toFixed(2));
  pdfDoc.end();
});
