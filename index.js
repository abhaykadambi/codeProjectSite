const express = require('express');
var session = require("express-session");
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();
const user = require('./models/user');
const post = require('./models/post');
const passport = require('passport'),LocalStrategy = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
app.use(express.static(__dirname + '/static_files'));
app.set('view engine', 'ejs');
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

const port = 3000;

require('dotenv').config();

mongoose.connect(process.env.DB_URL, {useNewUrlParser: true}).then((err)=>{
    console.log(err);
});

app.get('/', (req, res) => {
    var q = {};
    post.find().limit(10).then((docs)=>{
        console.log("posts: ",docs);
        q=docs;
    }).then(()=>{
        res.render('index', {'session':req.session, 'posts':q});
    })
})

app.get('/sign-in', (req, res) =>{
    res.render('signIn', {'session': req.session});
})

app.post('/sign-in', (req, res, next)=>{
    var bonk = {};
    user.findOne({ email: req.body.email}, function (err, docs) {
        if (err){
            console.log(err);
        }
        else{
            bonk = docs;
        }
    }).then(()=>{
        if(bonk.pwd === req.body.pwd){
            //this is where you use sessions or whatever other bullshit to make the cookies be used haha I'm to cookie monster nom nom nom
            req.session.loggedin = true;
            req.session.username = bonk.username;
            req.session.email = req.body.email;
            req.session.userId = bonk.id;
            console.log(req.session);
            res.redirect('/');
        } else {
            res.redirect('/sign-in');
        }
    })
})

app.get('/sign-up', (req, res)=>{
    res.render('signUp', {'session':req.session});
})

app.post('/sign-up', (req, res)=>{
    var tosave = new user({email: req.body.email, pwd: req.body.pwd, username: req.body.usern});
    tosave.save().then((err)=>{
        console.log(err);
        res.redirect('/sign-in')
    })
})

app.get('/secret', (req, res)=>{
    res.render('secret');
})

app.get('/logout', (req, res)=>{
    req.session.destroy((err)=>{
        console.log('the logout ran', err, req.session);
        res.redirect('/sign-in')
    });
})

app.get('/profile', (req, res)=>{
    if(req.session.loggedin){res.render('profile', {'session':req.session});}else{res.redirect('/sign-in');}  
})

app.get('/u/:username', (req, res)=>{
    //make a new page for every user
    var storeUserToFind = {};
    user.findOne({username: req.params.username}, function (err, docs) {
        if (err){
            console.log(err);
        }
        else{
            storeUserToFind = docs;
        }
    }).then(()=>{ 
            console.log(storeUserToFind, req.session)
            if(storeUserToFind === null){
                res.render('index', {'session':req.session});
            }else{
            res.render('viewOtherAccounts', {'person':storeUserToFind, 'session':req.session});
            }
    })
    
})

app.get('/post', (req, res)=>{
    if(req.session.loggedin){
        res.render('post', {'session':req.session});
    }else{
        res.redirect('/sign-in', {'session':req.session});
    }
    
})

app.post('/post', (req, res)=>{
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    var newPost = new post({title:req.body.title, author:req.session.id, postContent:req.body.content, views:0, likes:0, datePosted:today, langCon:req.body.tags, discription:req.body.discription});
    newPost.save().then((err)=>{
        console.log("posted", err);
    })
    res.redirect('/');
})

app.listen(process.env.PORT, () => {
  console.log(`Example app listening at http://localhost:${process.env.PORT}`)
})