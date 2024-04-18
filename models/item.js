const mongoose = require('mongoose');
const Schema = mongoose.Schema; 
// seller: {type: String, required: [true, 'seller is required']},

const itemSchema = new Schema({
    title: {type: String, required: [true, 'title is required']},
    seller: {type: Schema.Types.ObjectId, ref:'User',required: [true, 'seller is required']},
    condition: {type: String, required: [true, 'condition is required'], enum: ['New', 'Used Like New', 'Used - Good', 'Used - Acceptable', 'Old']},
    price: {type: Number, required: [true, 'price is required'], min: [0.01, 'Price must be at least 0.01']},
    details: {type: String, required:[true, 'details are required'], minLength: [5, 'the details should be more than 5 characters']},
    image: {type: String, required: [true, 'image is required']},
    totalOffers: {type: Number, default: 0},
    active: {type: Boolean, default: true}
});


module.exports = mongoose.model('Item', itemSchema);

