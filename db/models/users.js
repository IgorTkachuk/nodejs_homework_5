// https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose

const mongoose = require('mongoose');
const bCrypt = require('bcryptjs');

const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    surName: {
        type: String
    },
    firstName: {
        type: String
    },
    middleName: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    permissionId: {
        type: Number,
        default: Math.random()
    },
    permission: {
        chat: {
            C: { type: Boolean, required: true },
            R: { type: Boolean, required: true },
            U: { type: Boolean, required: true },
            D: { type: Boolean, required: true }
        },
        news: {
            C: { type: Boolean, required: true },
            R: { type: Boolean, required: true },
            U: { type: Boolean, required: true },
            D: { type: Boolean, required: true }
        },
        setting: {
            C: { type: Boolean, required: true },
            R: { type: Boolean, required: true },
            U: { type: Boolean, required: true },
            D: { type: Boolean, required: true }
        }
    },
    access_token: {
        type: String
    }
}, { toJSON: { virtuals: true } });

// schema.virtual('id').get(function () {
//     return this._id;
// })

schema.methods.setPassword = function(password) {
    this.password = bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};
  
schema.methods.validPassword = function(password) {
    return bCrypt.compareSync(password, this.password);
};

schema.methods.setToken = function(token) {
    this.access_token = token;
};

const User = module.exports = mongoose.model('User', schema);