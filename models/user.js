const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: String,
  resetTokenExpire: Date,
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  const cartIndex = this.cart.items.findIndex((p) => {
    return p.productId.toString() === product._id.toString();
  });
  let newQty = 1;
  const updatedCartItems = [...this.cart.items];
  if (cartIndex >= 0) {
    newQty = this.cart.items[cartIndex].quantity + 1;
    updatedCartItems[cartIndex].quantity = newQty;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQty,
    });
  }
  const updatedCart = {
    items: updatedCartItems,
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.deleteItemFromCart = function (productId) {
  const updatedCart = this.cart.items.filter((p) => {
    return p.productId.toString() !== productId.toString();
  });
  this.cart.items = updatedCart;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};
module.exports = mongoose.model('User', userSchema);
