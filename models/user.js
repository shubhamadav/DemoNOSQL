const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

const ObjectId = mongodb.ObjectId;

class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart || { items: [] }; // Default cart to an empty array if not provided
    this._id = id ? new ObjectId(id) : null; // Convert id to ObjectId if provided
  }

  async save() {
    try {
      const db = getDb();
      const result = await db.collection('users').insertOne(this);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async addToCart(product) {
    try {
      const db = getDb();
      const cartProductIndex = this.cart.items.findIndex(cp => cp.productId.toString() === product._id.toString());

      let newQuantity = 1;
      const updatedCartItems = [...this.cart.items];

      if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
      } else {
        updatedCartItems.push({ productId: new ObjectId(product._id), quantity: newQuantity });
      }

      const updatedCart = { items: updatedCartItems };
      const result = await db.collection('users').updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getCart() {
    try {
      const db = getDb();
      const productIds = this.cart.items.map(i => new ObjectId(i.productId));
      const products = await db.collection('products').find({ _id: { $in: productIds } }).toArray();

      return products.map(p => ({
        ...p,
        quantity: this.cart.items.find(i => i.productId.toString() === p._id.toString()).quantity
      }));
    } catch (error) {
      throw error;
    }
  }

  async deleteItemFromCart(productId) {
    const updatedCartItems = this.cart.items.filter(item => {
      return item.productId.toString() !== productId.toString();
    });
    const db = getDb();
    return db
      .collection('users') // Corrected collection name to 'users'
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: { items: updatedCartItems } } } // Corrected field name 'item' to 'items'
      );
  }

  static async findById(userId) {
    try {
      const db = getDb();
      const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
      return user;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
 