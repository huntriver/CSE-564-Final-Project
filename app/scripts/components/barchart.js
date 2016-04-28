/**
 * Created by XinheHuang on 2016/4/26.
 */

angular.module('myComponents')
    .directive("barChart", function ($timeout) {
    var link = function (scope, element, attrs) {
        var config = scope.config;
        var margin = config.margin;


        var width = (config.width == "100%" ? $('.barChart').width() : config.width) - margin.left - margin.right;
        var height = config.height - margin.top - margin.bottom;
        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")

        var svg = d3.select(".barChart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        if (scope.data.length!=0) {

            updateChart();
        }
       function updateChart() {

           var locations=[];
           scope.data.forEach(function(d){
               locations.push(d.location)
           })

           var dataset=locations.map(function(d){
               var x=scope.data.filter(function(d1){
                   return d1.location== d
               });
               return {'location':d,'freq':x.length};

           })
           console.log(dataset);
           var data=dataset;

            svg=d3.select(".barChart svg");

               x.domain(data.map(function(d) { return d.location; }));
               y.domain([0, d3.max(data, function(d) { return d.freq; })]);

               svg.append("g")
                   .attr("class", "x axis")
                   .attr("transform", "translate(0," + height + ")")
                   .call(xAxis);

               svg.append("g")
                   .attr("class", "y axis")
                   .call(yAxis)
                   .append("text")
                   .attr("transform", "rotate(-90)")
                   .attr("y", 6)
                   .attr("dy", ".71em")
                   .style("text-anchor", "end")
                   .text("Frequency");

               svg.selectAll(".bar")
                   .data(data)
                   .enter().append("rect")
                   .attr("class", "bar")
                   .attr("x", function(d) { return x(d.location); })
                   .attr("width", x.rangeBand())
                   .attr("y", function(d) { return y(d.freq); })
                   .attr("height", function(d) { return height - y(d.freq); });


       }
        scope.$watch('data', function () {

            console.log('update');
            updateChart();
        })



    }

    var controller = function ($scope) {

    }
    return {
        restrict: 'AE',
        scope: {
            "data": "=",
            "config": "=",
        },
        link: link,
        controller: controller,
        template: ""
    };
})