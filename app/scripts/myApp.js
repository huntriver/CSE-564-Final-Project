/**
 * Created by XinheHuang on 2016/4/26.
 */
'use strict';
angular.module('myComponents', []);
var app = angular.module('myApp', ['myComponents']);


app.controller('myAppCtrl', ['$scope', function ($scope) {

    var names;
    $scope.people = [];
    $scope.selectedPeople = "";
    $scope.barChartCtrl={};
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
            success: function (data) {
                $scope.selectedPeopleData=data;

                var locations = [];
                // console.log(scope.data)
                data.forEach(function (d) {
                    if (locations.indexOf(d.location)<0)
                        locations.push(d.location)
                })
                // console.log(locations.length);
                var dataset = locations.map(function (d) {
                    var x = data.filter(function (d1) {
                        return d1.location == d
                    });
                    return {'location': d, 'freq': x.length};

                })
                console.log(dataset);
                $scope.barChartCtrl.data = dataset;
                
                $scope.barChartCtrl.status='ready';
                $scope.$apply();
            }
        })

    }

}]);

app.controller('barChartCtrl', ['$scope', function ($scope) {

    $scope.$parent.barChartCtrl=$scope;
    $scope.data=[];
    $scope.status='loading';
    $scope.config = {
        width: "100%",
        height: 800,
        padding: 0.5,
        margin: {top: 70, right: 40, bottom: 30, left: 40},
        legendSpacing: 5,
        legendRectSize: 20,
        tipHeight: 40
    }

}]);
