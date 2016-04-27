/**
 * Created by XinheHuang on 2016/4/26.
 */
'use strict';

var app = angular.module('myApp', []);



app.controller('myAppCtrl',['$scope',function($scope){

    var names;
    $scope.people=[];
    $scope.selectedPeople="People";
    $.ajax({
        type: 'GET',
        url: '/getData',
        beforeSend: function(){
            $('.fa').show();
        },
        complete: function(){
            $('.fa').hide();
        },
        success: function(data) {
            names=data;
            $scope.people=names;
            $scope.$apply();
        }
    });

    $scope.selectPeople=function(p){
        $scope.selectedPeople=p;
        $.ajax({
            type:'post',
            url: '/selectPeople',
            data:{'name':'abc'},
            dataType: "json",
            success:function(data){
                console.log(data);
            }
        })

    }

}]);
