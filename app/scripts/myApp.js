/**
 * Created by XinheHuang on 2016/4/26.
 */
'use strict';
angular.module('myComponents', []);
var app = angular.module('myApp', ['myComponents','ngAnimate']);


app.controller('myAppCtrl', ['$scope', function ($scope) {

    var names;
    $scope.people = [];
    $scope.selectedPeople = "";
    $scope.barChartCtrl={};
    $scope.lineChartCtrl={};
    $.ajax({
        type: 'GET',
        url: '/getData',
        beforeSend: function () {
            $('.fa').show();
        },
        complete: function () {
            $('.fa').hide();

        },
        success: function (data) {
            names = data;
            $scope.people = names;
            $scope.selectPeople(names[0]);
            $scope.$apply();
        }
    });

    $scope.selectPeople = function (p) {
        $scope.selectedPeople = p;
        $.ajax({
            type: 'post',
            url: '/selectPeople',
            data: {'name': p},
            dataType: "json",
            success: function (rec) {
                var data=rec['ccdata'];
                var routedata=rec['routedata'];
                $scope.selectedPeopleData=data;

                // var locations = [];
                // // console.log(scope.data)
                // data.forEach(function (d) {
                //     if (locations.indexOf(d.location)<0)
                //         locations.push(d.location)
                // })
                // // console.log(locations.length);
                // var dataset = locations.map(function (d) {
                //     var x = data.filter(function (d1) {
                //         return d1.location == d
                //     });
                //     return {'location': d, 'freq': x.length};
                //
                // })
                console.log(data);

                var locations = [];
                // console.log(scope.data)
                data.forEach(function (d) {
                    if (locations.indexOf(d.location)<0)
                        locations.push(d.location)
                })


                // console.log(locations.length);
                var price = locations.map(function (d) {
                    var x=0;
                    data.forEach(function (d1) {
                        if (d1.location==d)
                            x+=+d1.price;
                    });
                    return {'location': d, 'price': parseFloat(x.toFixed(2))};

                })
                var times = locations.map(function (d) {
                    var x = data.filter(function (d1) {
                        return d1.location == d
                    });
                    return {'location': d, 'times': x.length};

                })
                var line= locations.map(function (d) {
                    var x = data.filter(function (d1) {
                        return d1.location == d
                    });
                    return {'time': d, 'times': x.length};

                })

                var routelocations = [];
                // console.log(scope.data)
                routedata.forEach(function (d) {
                    if (routelocations.indexOf(d.start)<0)
                        routelocations.push(d.start)
                    if (routelocations.indexOf(d.end)<0)
                        routelocations.push(d.end)
                })



                var routetimes = routelocations.map(function (d) {
                    var x=0;
                    routedata.forEach(function(d1){
                        if (d1.start==d)
                            x++;
                        if (d1.end==d)
                            x++;
                    })

                    return {'location': d, 'times': x};

                });
                $scope.barChartCtrl.data = price;
                $scope.pieChartCtrl.data=times;
                console.log(routetimes);
                if ($scope.pieChartCtrl1)
                     $scope.pieChartCtrl1.data=routetimes;
                $scope.$apply();
            }
        })

    }

}]);

app.controller('barChartCtrl', ['$scope', function ($scope) {

    $scope.$parent.barChartCtrl=$scope;
    $scope.data=[];
    $scope.config = {
        width: "100%",
        height: 450,
        padding: 0.6,
        margin: {top: 70, right: 40, bottom: 30, left: 40},
        // legendSpacing: 5,
        // legendRectSize: 20,
        // tipHeight: 40,
        yDomain: 'price',
        xDomain: 'location'
    }

}]);

app.controller('pieChartCtrl', ['$scope', function ($scope) {

    $scope.$parent.pieChartCtrl=$scope;
    $scope.data=[];
    $scope.selected=false;
    $scope.config = {
        width: "100%",
        height: 500,
        // padding: 0.6,
        margin: {top: 30, right: 40, bottom: 30, left: 40},
        legendSpacing: 5,
        legendRectSize: 20,
        // tipHeight: 40,
        yDomain: 'times',
        xDomain: 'location',
        onClick:function(d){
            var selectedLocation=d;
            var data=$scope.$parent.selectedPeopleData;
            console.log(data);
            console.log(selectedLocation);
            var linedata=data.filter(function(d){
                return d.location==selectedLocation;
            }).map(function(d){
                console.log(d.price);
                return {'time': d.timestamp, 'price': +d.price}
            });
            console.log(linedata);

            $scope.$parent.lineChartCtrl.data=linedata;
            $scope.$apply();
           // console.log(  $scope.$parent.lineChartCtrl);
        }


    }

}]);

app.controller('pieChartCtrl1', ['$scope', function ($scope) {

    $scope.$parent.pieChartCtrl1=$scope;
    $scope.data=[];
    $scope.selected=false;
    $scope.config = {
        width: "100%",
        height: 500,
        // padding: 0.6,
        margin: {top: 30, right: 40, bottom: 30, left: 40},
        legendSpacing: 5,
        legendRectSize: 20,
        // tipHeight: 40,
        yDomain: 'times',
        xDomain: 'location',
        //onClick:function(d){
        //    var selectedLocation=d;
        //    var data=$scope.$parent.selectedPeopleData;
        //    console.log(data);
        //    console.log(selectedLocation);
        //    var linedata=data.filter(function(d){
        //        return d.location==selectedLocation;
        //    }).map(function(d){
        //        console.log(d.price);
        //        return {'time': d.timestamp, 'price': +d.price}
        //    });
        //    console.log(linedata);
        //
        //    $scope.$parent.lineChartCtrl.data=linedata;
        //    $scope.$apply();
        //    // console.log(  $scope.$parent.lineChartCtrl);
        //}


    }

}]);




app.controller('lineChartCtrl', ['$scope', function ($scope) {

    $scope.$parent.lineChartCtrl=$scope;
    $scope.data=[];
    $scope.config = {
        width: "100%",
        height: 400,
        // padding: 0.6,
        margin: {top: 70, right: 40, bottom: 30, left: 40},
        legendSpacing: 5,
        legendRectSize: 20,
        // tipHeight: 40,
        xDomain: 'time',
        yDomain: 'price',
        timeformat: "%m/%d/%Y %H:%M"
    }

}]);



