const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    date: {
        type: Date, 
        default: Date.now
    },
    theme: {
        type: String
    },
    text: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }
   
}, { toJSON: { virtuals: true } }); //https://mongoosejs.com/docs/populate.html

// schema.virtual('id').get(function(){
//     return this._id;
// })


const New = module.exports = mongoose.model('New', schema);