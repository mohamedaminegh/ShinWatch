const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema= new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    handle: {
        type: String,
        required:true
    },
    about: {
    type: String,
    default:''
    },
    website: {
        type: String,
        default:''
    },
    location: {
        type: String,
        default:''
    },
    status: {
        type: String,
        default:''
    },
    socials: {
        youtube: {
            type:String
        },
        twitter: {
            type:String
        },
        facebook: {
            type:String
        },
        instagram: {
            type:String
        }

    }
});
module.exports = Profile = mongoose.model('profiles',ProfileSchema);