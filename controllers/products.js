const Product = require('../models/product');

exports.getAddProducts = (req, res, next) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    isActive: true,
    path: '/admin/add-product',
  });
};

exports.postAddProducts = (req, res, next) => {
  const products = new Product(req.body.title);
  products.save();
  res.redirect('/');
};

exports.getProducts = async (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('shop/product-list', {
      pageTitle: 'Shop',
      prods: products,
      isActive: true,
      path: '/',
    });
  });
};
