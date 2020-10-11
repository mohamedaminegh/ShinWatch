const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');
const product = require('./routes/api/product');


const app = express();

//Public Folder
app.use('/public', express.static('public'));

//Body parser Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//DB Config
const db = require('./config/keys').mongoURI;
//Connect to MongoDB
mongoose
    .connect(db,{useNewUrlParser: true})
    .then(()=>console.log("MongoDB connected"))
    .catch(err => console.log(err))

//Passport Middleware
app.use(passport.initialize());

//Passport Config 
require('./config/passport')(passport); 



//Use Routes
app.use('/api/users',users);
app.use('/api/profile',profile);
app.use('/api/product',product);
app.use('/api/posts',posts);

//Index Route
app.get('/', (req, res)=> {
 res.send('Index Here');
});
//About Route
app.get('/about', (req , res)=>{
res.send('About');    
});



const port = 5000;

app.listen( port  , () => {
console.log(`Server started at port ${port}`);   
});