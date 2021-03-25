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
  const products = await req.user.cart.items.map((p) => {
    return {
      quantity: p.quantity,
      product: p.productId,
    };
  });
  const order = new Order({
    user: {
      name: req.user.name,
      userId: req.user,
    },
    products: products,
  });

  await order.save();
  await res.redirect('/orders');
});

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ['products'] })
    .then((orders) => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,
      });
    })
    .catch((err) => console.log(err));
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
  });
};
