const Product = require('../models/product');
const asyncHandler = require('../util/asyncHandler');

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

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      return req.user
        .createOrder()
        .then((order) => {
          return order.addProducts(
            products.map((product) => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .catch((err) => console.log(err));
    })
    .then((result) => {
      return fetchedCart.setProducts(null);
    })
    .then((result) => {
      res.redirect('/orders');
    })
    .catch((err) => console.log(err));
};

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
