// set up out app ///////

//we need to use express to make our lives easier

var express = require('express');
//use express to make an app that will make our lives easier
var app = express();
// other dependencies
//we use body-parser to extract information out of a form
var bodyParser = require('body-parser');
// multi comps can use your directory names without issue
var path = require('path');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mongoosedash');
// mongoose.connection.on('error', function(err) {});

var TigersSchema = new mongoose.Schema({
  name: {type: String, required: true},
  color: {type: String, required: true},
  gender: {type: String, required: true}
});


mongoose.model('Tigers', TigersSchema);
var Tigers = mongoose.model('Tigers');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "/client/static")));
app.set('views', path.join(__dirname, '/client/views'));
app.set('view engine', 'ejs');


app.get('/', function(req,res){
  Tigers.find({}, function(err, tiger){
    if(err){
      res.json(err);
    }
    else{
      res.render('index', {tigers: tiger});
    }
  })
});

// var route = require()(app, Quotes);
app.post('/addnew', function(req, res) {
  var tiger = new Tigers({name: req.body.name, color: req.body.color, gender: req.body.gender});
  tiger.save(function(err){
    if(err){
      res.json(err);
    }
    else{
      res.redirect('/');
    }
  })
 });

 app.post('/confirm/:id', function(req, res) {
   console.log(req.body);
   Tigers.update({_id:req.params.id}, req.body, function(err){
     if(err){
       res.json(err);
     }
     else{
       res.redirect('/');
     }
        });

  });
 app.get('/view/:id', function(req,res){
   Tigers.findOne({_id: req.params.id}, function(err, tiger){
     res.render('view', {tiger: tiger});
   })
 })

app.get('/view/:id/edit', function(req, res){
  Tigers.findOne({_id: req.params.id}, function(err, tiger){
    res.render('edit', {tiger: tiger});
  })
})
app.get('/addnew', function(req,res){
  res.render('addnew');
});
app.post('/destroy/:id', function(req,res){
  console.log("destroy route");
  Tigers.remove({_id: req.params.id} , function(err, tiger){
    res.redirect('/');
  })
});

///// start server/////
app.listen(8000, function(){
  console.log("port 8000");
});
