const Product = require('../models/product');
const asyncHandler = require('../util/asyncHandler');

//  @Method   Get Admin Products
//  @Route    /admin/products
exports.getAdminProducts = (req, res, next) => {
  req.user
    .getProducts()
    .then((products) => {
      res.render('admin/products', {
        pageTitle: 'Admin Products',
        prods: products,
        isActive: true,
        path: '/admin/products',
      });
    })
    .catch((err) => console.log(err));
};

//  @Method   Get Add Products
//  @Route    /admin/add-product
exports.getAddProducts = asyncHandler(async (req, res, next) => {
  await res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    isActive: true,
    path: '/admin/add-product',
    editing: false,
  });
});

//  @Method   POST Add Products
//  @Route    /admin/add-products
exports.postAddProducts = asyncHandler(async (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
  const product = await new Product({
    title,
    imageUrl,
    price,
    description,
  });
  await product.save();
  await res.redirect('admin/products');
});

//  @Method   Get Edit Products
//  @Route    /admin/edit-product/:produtId
exports.getEditProducts = (req, res, next) => {
  const prodId = req.params.productId;
  const editing = req.query.edit;
  if (!editing) {
    return res.redirect('/');
  }
  req.user
    .getProducts({ where: { id: prodId } })
    .then((product) => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        product: product[0],
        pageTitle: 'Edit Product',
        path: 'admin/edit-product',
        editing,
      });
    })
    .catch((err) => console.log(err));
};

//  @Method   POST Edit Products
//  @Route    /admin/edit-product
exports.postEditProduct = (req, res, next) => {
  const { productId, title, imageUrl, price, description } = req.body;
  Product.findByPk(productId)
    .then((product) => {
      product.title = title;
      product.imageUrl = imageUrl;
      product.price = price;
      product.description = description;
      return product.save();
    })
    .then((result) => {
      res.redirect('/admin/products');
    })
    .catch((err) => console.log(err));
};

//  @Method   POST Delete Products
//  @Route    /admin/delete-product
exports.deleteProducts = (req, res, next) => {
  prodId = req.body.productId;
  Product.findByPk(prodId)
    .then((product) => {
      return product.destroy();
    })
    .then((product) => {
      res.redirect('/admin/products');
    })
    .catch((err) => console.log(err));
};
