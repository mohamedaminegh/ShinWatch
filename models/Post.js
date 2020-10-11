const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref:'users'
    },
    description:{
        type: String,
        require:true
    },
    content:{
        type: String,
        require:true
    },
    type:{
        type: String,
        require:true
    },
    handle:{
        type: String,
    },
    title:{
        type: String,
    },
    avatar:{
        type: String
    },
    likes:[
        {
            user:{
                type: Schema.Types.ObjectId,
                ref:'users'
            }    
        }
    ],
    reactions:[
        {
            user:{
                type: Schema.Types.ObjectId,
                ref:'users'
            },
            type:{
              type: String  
            },   
        }
    ],
    nbr_reactions:{
        love:{
            type: Number,
            default:0
        },
        angry:{
            type: Number,
            default:0
        },
        wow:{
            type: Number,
            default:0
        },
        stars:{
            type: Number,
            default:0
        },
        sad:{
            type: Number,
            default:0
        },
    },
    comments:[
        {
        user:{
                type: Schema.Types.ObjectId,
                ref:'users'
            }, 
        text:{
                type:String
            },
        handle:{
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
module.exports= Post= mongoose.model('posts',PostSchema);