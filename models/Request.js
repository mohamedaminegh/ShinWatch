const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RequestSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref:'users'
    },
    object:{
        type: String,
        require:true
    },
    name:{
        type: String,
    },
    avatar:{
        type: String
    },
    upvotes:[
        {
            user:{
                type: Schema.Types.ObjectId,
                ref:'users'
            }    
        }
    ],
    comments:[
        {
        user:{
                type: Schema.Types.ObjectId,
                ref:'users'
            }, 
        text:{
                type:String
            },
        name:{
                type: String
            },
        avatar:{
                type: String
            },
        date:{
                type:Date,
                default:Date.now
        }
        }
    ],
    date:{
        type:Date,
        default:Date.now
    }
});
module.exports= Request= mongoose.model('requests',RequestSchema);