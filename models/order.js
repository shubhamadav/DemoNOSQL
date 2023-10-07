const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const orderSchema = new Schema ({
    products : [{product:{
      type:String,
      required: true
 },
 quantity:{
      type:String,
      required: true
 }
}],
     user :{
        name:{
           type :String,
           required: true
        },
        userId :{
            type : Schema.Types.ObjectId,
            required: true,
            ref:'User'
        }
     }
});

module.exports = mongoose.model('Order' , orderSchema)
