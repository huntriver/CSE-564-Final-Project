/**
 * Created by XinheHuang on 2016/4/26.
 */
'use strict';

var app = angular.module('myApp', []);



$.get("/getData", function(result) {
    console.log(result);
})