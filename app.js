var express = require('express');
var fs = require('fs');
var $ = jQuery = require('jquery');
require('jquery-csv');

var Converter=require("csvtojson").Converter;

//converter.on('end_parsed',function(jsonArray){
//    console.log(jsonArray);
//})
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


var csvConverter =new Converter({});


// views is directory for all template files
// app.set('views', __dirname + '/views');
// app.set('view engine', 'ejs');
//var gpsCsv;
//var gpsData;
//var readerStream=fs.createReadStream('gps.csv');
//readerStream.setEncoding('UTF8');
//readerStream.on('data', function(chunk) {
//    gpsCsv += chunk;
//});
//readerStream.on('end',function(){
//    console.log(gpsCsv);
//
//});
//readerStream.on('error', function(err){
//    console.log(err.stack);
//});

//csvConverter.on('end_parsed',function(json){
//    console.log(json);
//})
//fs.createReadStream('gps.csv').pipe(csvConverter);



var ccData,carData,routeData;
fs.readFile('cc_data.csv','UTF-8',function(err,csv){
    $.csv.toObjects(csv,{},function(err,data){
       ccData=data;
    })
})

fs.readFile('car-assignments.csv','UTF-8',function(err,csv){
    $.csv.toObjects(csv,{},function(err,data){
        carData=data;
    })
})

fs.readFile('route.csv','UTF-8',function(err,csv){
    $.csv.toObjects(csv,{},function(err,data){
        routeData=data;
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
        //delete d['FirstName'];
        //delete d['LastName'];
    });

    carData.forEach(function(d){
        d['name']=d['FirstName']+' '+d['LastName'];
        if (people.indexOf(d['name'])<0)
            people.push(d['name']);
        //delete d['FirstName'];
        //delete d['LastName'];
    });

    carData=carData.filter(function(d){
        return d["CarID"]!=""
    });
    var carPeople=carData.map(function(d){
        return d["name"];
    })

    ccData.sort(function(a,b){
        return a.name<b.name?-1:1;
    });
    people.sort(function(a,b){
        return a<b?-1:1;
    })

    var deleteperson = []
    var location_sum = 0
    var location_list = []
    for (var i = 0; i < people.length; i++){
        var person  = people[i]
        console.log(carPeople);
        console.log(person);
        if (carPeople.indexOf(person)<0)
        {
            deleteperson.push(j)
            continue;
        }

        location_sum = 0
        location_list = []
        ccData.forEach(function(d){
          //  d['name']=d['FirstName']+' '+d['LastName'];
            if (d['name'] == person){
                // console.log(d['location'])
                // console.log(location_list.indexOf(d['location']))
                if(location_list.indexOf(d['location']) < 0){
                    var loc = d['location']
                    // location_sum += 1
                    // // console.log(location_sum)
                    location_list.push(loc)
                    // console.log(location_list)
                }
            }
        })
        location_sum = location_list.length
        // console.log(location_sum)
        // console.log(location_list)
        if (location_sum < 4){
            var j = people.indexOf(person)
            deleteperson.push(j)
        }


    }

    for (var i = 0; i < deleteperson.length; i++){
     //   console.log(deleteperson[i])
        people.splice(deleteperson[i]-i,1)
    }


   // console.log(people);

    res.send(people);

});

app.post('/selectPeople',function(req,res){
   // console.log(req.body);
    var name=req.body.name;
    var ccdata=ccData.filter(function(d){
        return d.name==name;
    });

    var carid=carData.filter(function(d){
        return d.name==name;
    })[0]["CarID"];

    var routedata=routeData.filter(function(d){
        return d.car==carid;
    })

    var ret= {'routedata':routedata,'ccdata':ccdata};

    res.json(ret);
});



app.get('/', function(request, response) {
    response.render('index.html');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});



