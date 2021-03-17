const e = require('express');
const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([row]) => {
      res.render('shop/product-list', {
        pageTitle: 'Products',
        prods: row,
        isActive: true,
        path: '/products',
      });
    })
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(([row]) => {
      res.render('shop/product-detail', {
        product: row[0],
        path: '/products',
        pageTitle: row[0].title,
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(([row]) => {
      res.render('shop/index', {
        pageTitle: 'Shop',
        prods: row,
        isActive: true,
        path: '/',
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  Cart.getProduct((cart) => {
    Product.fetchAll((products) => {
      const prodList = [];
      for (product of products) {
        const prod = cart.products.find((p) => p.id === product.id);
        if (prod) {
          prodList.push({
            productData: product,
            qty: prod.qty,
            totalPrice: cart.totalPrice,
          });
        }
      }
      res.render('shop/cart', {
        pageTitle: 'Your Cart',
        path: '/cart',
        product: prodList,
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price);
    res.redirect('/cart');
  });
};

exports.postCartDeleteItem = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.deleteProduct(prodId, product);
  });
  res.redirect('/cart');
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    pageTitle: 'Your Orders',
    path: '/orders',
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
  });
};
