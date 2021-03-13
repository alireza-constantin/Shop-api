const Product = require('../models/product');

exports.getAddProducts = (req, res, next) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    isActive: true,
    path: '/admin/add-product',
  });
};

exports.postAddProducts = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
  const products = new Product(title, imageUrl, price, description);
  products.save();
  res.redirect('/');
};

exports.getAdminProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('admin/products', {
      pageTitle: 'Admin Products',
      prods: products,
      isActive: true,
      path: '/admin/products',
    });
  });
};
