const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const cors = require('cors');
const mongodb= require('mongodb');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise ;
const usernames= require('./db');
const dfb = require('./db2');
mongoose.connect(process.env.MLAB_URI,{ useMongoClient: true });

app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
 });



app.get("/api/exercise/log",(req,res) => {
  var user= req.query['userId'] ;
  var from=req.query.from ;
  var to= req.query.to ;
  var f=new Date(from);
  var t= new Date(to);
   if( (isNaN(f.getTime())) || (isNaN(t.getTime())) ){
    dfb.findOne({userId : user},(err,data) => {
    if(err) res.send("Error connnecting to the database");
      else if(data=== null) res.send("The queried user Id is invalid");
      else{
        res.json({
        'userId' : data['userId'],
      'username' : data['username'],
       'count'   : Number(data['count']),
        'logs'   :  data['logs']
        });
      }
    });
  }
  
  else
  {
      dfb.findOne({userId : user},(err,data) => {
    if(err) res.send("Error connnecting to the database");
      else if(data=== null) res.send("The queried user Id is invalid");
      else{
        var fromm = new Date(from);
        let begin = fromm.getTime();
        let too = new Date(to);
        let end = too.getTime();
        var given =data['logs'];
        
        let newArr = given.filter((item) => {
          let act = new Date(item.date);
          let actTime = act.getTime();
          return (begin <= actTime ) && (end => actTime ) ;
        });
        let counter = newArr.length;
        res.json({
        'userId' : data['userId'],
      'username' : data['username'],
       'count'   :  counter,
        'logs'   : newArr
        });
      }
    });
  }
});

var arr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
var genkey = function(){
 var str="";
  for(let i=0 ; i<10 ; i++){
   str+= arr.charAt(Math.floor(Math.random() * arr.length));

 }
  return str;
}


app.post("/api/exercise/new-user",(req,res) => {
  
  const name= req.body.username ;
  usernames.findOne({'username': name},function(err,data){
  if(err) res.send('Error connecting stuff to database');
    else if(data== null)
    {
      const userIdd= genkey();

      var document = new usernames({
     'username': name,
        'userId' : userIdd
    });
  
  document.save(err => {
  if(err) res.send('Error saving data to database');
  });
      
    }
  
  else{
   res.send("The username has already been taken "); 
  }
  });
  
});


app.post("/api/exercise/add",(req,res) => {
  
  usernames.findOne({"userId" : req.body.userId },(err, dataa) => {
  if(err) res.send("Error connnecting to the database");
   
    else if(dataa === null){
      res.send("The user ID provided by you is invalid");      
   }
    else {
      
    var dat= new Date(req.body.date);
     
     dfb.findOne({userId : req.body.userId}, (err,datas) => {
      if(err) res.send("Error connnecting to the database");
       else if(datas===null) {
         const docus= new dfb({
      username : dataa['username'],
      userId : req.body.userId,
    });
    
       docus.logs.push({'description' : req.body.description,
                           'duration' : Number(req.body.duration),
                               'date' : dat.toDateString()               
                       });
      docus.count = docus.logs.length;
      docus.save(err => {
  if(err) res.send('Error saving data to database');
  });
       }
       else{
      
     datas.logs.push({'description' : req.body.description,
                           'duration' : Number(req.body.duration),
                               'date' : dat.toDateString()               
                       });
      datas.count = datas.logs.length;
      datas.save(err => {
  if(err) res.send('Error saving data to database');
  });    
    }
     }); 
      
      
      res.json({
    username : dataa['username'],
 description : req.body.description,
    duration : Number(req.body.duration) ,
      userId : req.body.userId,
        date : dat.toDateString()
    });
      
    }
  }); 
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
}) ;
