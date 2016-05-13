/**
 * Created by XinheHuang on 2016/4/26.
 */

angular.module('myComponents')
    .directive("lineChart", function ($timeout) {
        var link = function (scope, element, attrs) {
            var durationTime = 1000;
            var color = d3.scale.category20();
            var formatDate = d3.time.format(scope.config.timeformat);

            console.log('init');
            var config = scope.config;
            var margin = config.margin;
            var data = scope.data;
            var xDomain = config.xDomain;
            var yDomain = config.yDomain;
            var width = (config.width == "100%" ? $('.barChart').width() : config.width) - margin.left - margin.right;
            console.log(width);
            var height = config.height - margin.top - margin.bottom;
            // var x = d3.scale.ordinal()
            //     .rangeRoundBands([0, width], config.padding);
            var x = d3.time.scale()
                .range([0, width]);

            var y = d3.scale.linear()
                .range([height, 0]);

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")

            var line = d3.svg.line();

            var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function (d) {
                    return d[xDomain] + ": <span style='color:orangered'>" + d[yDomain] + "</span>";

                })

            var svg = d3.select(".lineChart").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


            svg.call(tip);
            //
            // x.domain(data.map(function (d) {
            //     return d.location;
            // }));
            // y.domain([0, d3.max(data, function (d) {
            //     return d.freq;
            // })]);
            // console.log(x.domain());
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")");

            svg.append("g")
                .attr("class", "y axis")
                .append("text")

                .attr("y", -20)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .style("font-size", "14px")
                .text(yDomain);


            function updateChart() {
                console.log(data);
                // x.domain(data.map(function (d) {
                //     return d[xDomain];
                // }));
                data.forEach(function(d){
                    console.log(d[xDomain]);
                    d[xDomain]=formatDate.parse(d[xDomain]);
                });
                data.sort(function(a,b){
                    if (a[xDomain]>b[xDomain])
                    {
                        return 1
                    }
                    return -1;
                })

                console.log(data);
                x.domain(d3.extent(data, function(d) { return d[xDomain]; }));
                y.domain(d3.extent(data, function(d) { return d[yDomain]; }));

                line.x(function(d) { return x(d[xDomain]); });
                 line.y(function(d) { return y(d[yDomain]); });

                // y.domain([0, d3.max(data, function (d) {
                //     return d[yDomain];
                // })]);
                console.log(xDomain);
                console.log(yDomain);
                console.log(y.domain());

                svg.select(".x.axis").transition().duration(durationTime).call(xAxis);
                svg.select(".y.axis").transition().duration(durationTime).call(yAxis);
                // var update = svg.selectAll(".bar").data(data);
                // update.enter().append("rect")
                //     .attr("class", "bar")
                //     .attr("x", null)
                //     .attr("y", height)
                //     .attr("height", 0)
                //     .attr("width", null)
                // ;
                // console.log(update.exit())
                // update.exit().remove();
               svg.selectAll(".line").remove();
                console.log(line);
                svg.append("path")
                    .datum(data)
                    .attr("class", "line")
                    .attr("d", line);

            }

            scope.$watch('data', function () {
                // if (scope.status=='ready')
                console.log('update');
                data = scope.data;
                updateChart();
            });
            // scope.$watch('status',function(){
            //     if (scope.status=='ready')
            //         initChart();
            // });


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