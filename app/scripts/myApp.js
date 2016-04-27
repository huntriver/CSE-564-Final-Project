/**
 * Created by XinheHuang on 2016/4/26.
 */
'use strict';
angular.module('myComponents', []);
var app = angular.module('myApp', ['myComponents']);


app.controller('myAppCtrl', ['$scope', function ($scope) {

    var names;
    $scope.people = [];
    $scope.selectedPeople = "People";
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
                console.log(data);
            }
        })

    }

}]);

app.controller('barChartCtrl', ['$scope', function ($scope) {

    $scope.config = {
        width: "100%",
        height: 800,
        padding: 0.5,
        margin: {top: 70, right: 40, bottom: 30, left: 40},
        legendSpacing: 5,
        legendRectSize: 20,
        tipHeight: 40
    },
        $scope.data =$scope.$parent.selectedPeopleData;
    console.log($scope.data);

}]);
