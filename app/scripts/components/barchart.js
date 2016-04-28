/**
 * Created by XinheHuang on 2016/4/26.
 */

angular.module('myComponents')
    .directive("barChart", function ($timeout) {
        var link = function (scope, element, attrs) {
            var durationTime = 1000;


            console.log('init');
            var config = scope.config;
            var margin = config.margin;
            var data = scope.data;

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

            var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function (d) {
                    console.log(1);
                    return "<strong>Frequency:</strong> <span style='color:red'>" + d.freq + "</span>";
                })

            var svg = d3.select(".barChart").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


            svg.call(tip);
            //
            x.domain(data.map(function (d) {
                return d.location;
            }));
            y.domain([0, d3.max(data, function (d) {
                return d.freq;
            })]);
            // console.log(x.domain());
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")");

            svg.append("g")
                .attr("class", "y axis")
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Frequency");
            


            function updateChart() {
                console.log('update');
                x.domain(data.map(function (d) {
                    return d.location;
                }));
                y.domain([0, d3.max(data, function (d) {
                    return d.freq;
                })]);

                svg.select(".x.axis").transition().duration(durationTime).call(xAxis);
                svg.select(".y.axis").transition().duration(durationTime).call(yAxis);
                var update = svg.selectAll(".bar").data(data);
                update.enter().append("rect")
                    .attr("class", "bar")
                    .attr("x", null)
                    .attr("y", height)
                    .attr("height", 0)
                    .attr("width", null)
                ;
                update.exit().remove();

                svg.selectAll('.bar')
                    .transition()
                    .duration(durationTime)
                    .attr("x", function (d) {
                        return x(d.location);
                    })
                    .attr("y", function (d) {
                        return y(d.freq);
                    })
                    .attr("height", function (d) {
                        return height - y(d.freq);
                    })
                    .attr("width", x.rangeBand());
                svg.selectAll('.bar')
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide);

            }

            scope.$watch('data', function () {
                // if (scope.status=='ready')
                data = scope.data
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
                "status": "="
            },
            link: link,
            controller: controller,
            template: ""
        };
    })