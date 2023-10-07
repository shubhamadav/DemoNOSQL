const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const userSchema = new Schema ({
      name :{
           type: String,
           required: true
      },
      email :{
           type : String,
           required:true
      },
      cart :{
          items : [{productId :{type: Schema.Types.ObjectId , ref: 'Product', required:true},
                 quantity:{type:Number , required:true}}]
      }

});

module.exports = mongoose.model('User' , userSchema);









/* const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

const ObjectId = mongodb.ObjectId;

class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart || { items: [] };
    this._id = id ? new ObjectId(id) : null;
  }

  async save() {
    const db = getDb();
    try {
      const result = await db.collection('users').insertOne(this);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async addToCart(product) {
    const db = getDb();
    try {
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
      console.error(error);
      throw error;
    }
  }

  async getCart() {
    const db = getDb();
    try {
      const productIds = this.cart.items.map(i => new ObjectId(i.productId));
      const products = await db.collection('products').find({ _id: { $in: productIds } }).toArray();

      return products.map(p => ({
        ...p,
        quantity: this.cart.items.find(i => i.productId.toString() === p._id.toString()).quantity
      }));
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async deleteItemFromCart(productId) {
    const updatedCartItems = this.cart.items.filter(item => item.productId.toString() !== productId.toString());
    const db = getDb();
    try {
      return await db.collection('users').updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: { items: updatedCartItems } } }
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async addOrder() {
    const db = getDb();
    try {
      const products = await this.getCart();
      const order = {
        items: products,
        user: {
          _id: new ObjectId(this._id),
          name: this.name
        }
      };
      const orderResult = await db.collection('orders').insertOne(order);

      // Clear the user's cart
      await db.collection('users').updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: { items: [] } } }
      );

      return orderResult;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getOrders() {
    const db = getDb();
    try {
      return await db.collection('orders').find({ 'user._id': new ObjectId(this._id) }).toArray();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async findById(userId) {
    const db = getDb();
    try {
      const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
      return user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

module.exports = User;
 */