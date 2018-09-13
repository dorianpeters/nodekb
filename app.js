const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect("mongodb://localhost:27017/nodekb", { useNewUrlParser: true });
let db = mongoose.connection;

// Check connection
db.once('open', function() {
  console.log('Connected to MongoDB');
});

// Check for DB errors
db.on('error', function(err){
  console.log(err);
});

// Init app
const app = express();

// Bring in models
let Article = require('./models/article.js');

// Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set public folder
app.use(express.static(path.join(__dirname, 'public')));

// Home route
app.get('/', function(req, res) {
  Article.find({}, function(err, articles){
    if(err) {
      console.log(err);
    } else { 
      res.render('index', {
        title:'Articles',
        articles:articles
      });
    }
  });
});

// Add route
app.get('/articles/add', function(req, res) {
  res.render('add_article', {
    title:'Add article'
  });
});

// Add submit post route
app.post('/articles/add', function(req, res) {
  let article = new Article();
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;
  
  article.save(function(err){
    if(err) {
      console.log(err);
      return;
    } else {
    res.redirect('/'); 
    }
  });
});

// Get single article
app.get('/articles/:id', function(req, res) {
  Article.findById(req.params.id, function(err, article) {
    res.render('article', {article:article});
  });
});

// Load edit form
app.get('/articles/edit/:id', function(req, res) {
  Article.findById(req.params.id, function(err, article) {
    res.render('edit_article', {
      title:'Edit Article',
      article:article
    });
  });
});

// Update submit post route
app.post('/articles/edit/:id', function(req, res) {
  console.log("post route working");
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;
  console.log(req.params.id);
  console.log(article);
  
  Article.findByIdAndUpdate(req.params.id, article, function(err){
    if(err) {
      console.log(err);
      return;
    } else {
    res.redirect('/'); 
    }
  });
});

// Delete post route
app.post('/articles/delete/:id', function(req, res) {
  Article.findByIdAndRemove(req.params.id, function(err){
    if(err) {
      console.log(err);
      res.redirect('/');
    } else {
      res.redirect('/'); 
    }
  });
});

// Start server
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The Nodekb server has started!");
});