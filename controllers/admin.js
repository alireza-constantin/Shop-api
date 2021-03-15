const Product = require('../models/product');

exports.getAddProducts = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    isActive: true,
    path: '/admin/add-product',
    editing: false,
  });
};

exports.postAddProducts = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
  const products = new Product(null, title, imageUrl, description, price);
  products.save();
  res.redirect('/');
};

exports.getEditProducts = (req, res, next) => {
  const prodId = req.params.productId;
  const editing = req.query.edit;
  if (!editing) {
    return res.redirect('/');
  }
  Product.findById(prodId, (product) => {
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      product: product,
      pageTitle: 'Edit Product',
      path: 'admin/edit-product',
      editing,
    });
  });
};
exports.postEditProduct = (req, res, next) => {
  const { productId, title, imageUrl, price, description } = req.body;
  const products = new Product(productId, title, imageUrl, description, price);
  products.save();
  res.redirect('/admin/products');
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

exports.deleteProducts = (req, res, next) => {
  prodId = req.body.productId;
  Product.deleteById(prodId);
  res.redirect('/admin/products');
};
