var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
  name: {type: String, required: true, max: 100},
  price: {type: Number, required: true},
});

ProductSchema.methods.toJSON = function() {
  var obj = this.toObject();

  Object.keys(obj).forEach(function(element, key, _array) {
    if (['_id', 'price', 'name'].includes(element) == false) {
      delete obj[element];
    }
  });

  return obj;
};

// Export the model
module.exports = mongoose.model('Product', ProductSchema);
