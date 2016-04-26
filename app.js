var express = require('express');
var app = express();
var open = require("open");

app.set('port', (process.env.PORT || 5000));

app.use("/bower_components",express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/app'));
// views is directory for all template files
// app.set('views', __dirname + '/views');
// app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('index.html');
});




app.get('/getData',function(req,res){
	//var data = $.csv.toObjects(csv):
	res.send('test');
});



app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

open("http://localhost:5000");

