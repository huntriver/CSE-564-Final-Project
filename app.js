var express = require('express');
var fs = require('fs');
var $ = jQuery = require('jquery');
require('jquery-csv');
var app = express();
var open = require("open");
var bodyParser = require('body-parser')


app.set('port', (process.env.PORT || 5000));

app.use("/bower_components",express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/app'));
app.use(bodyParser());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.text());
app.use(bodyParser.json());

// views is directory for all template files
// app.set('views', __dirname + '/views');
// app.set('view engine', 'ejs');

var ccData;
fs.readFile('cc_data.csv','UTF-8',function(err,csv){
    $.csv.toObjects(csv,{},function(err,data){
       ccData=data;
    })
})


var people=[];
app.get('/getData',function(req,res){

	//var data = $.csv.toArrays("cc_data.csv");
   // console.log(ccData);
    ccData.forEach(function(d){
        d['name']=d['FirstName']+' '+d['LastName'];
        if (people.indexOf(d['name'])<0)
            people.push(d['name']);
        delete d['FirstName'];
        delete d['LastName'];
    });
    ccData.sort(function(a,b){
        return a.name<b.name?-1:1;
    })
    people.sort(function(a,b){
        return a<b?-1:1;
    })
    ccData.filter(function(d){

    })
	res.array(people);

});

app.post('/selectPeople',function(req,res){
    console.log(req.body);
    res.json(req.body);
})



app.get('/', function(request, response) {
    response.render('index.html');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});



