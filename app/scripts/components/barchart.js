/**
 * Created by XinheHuang on 2016/4/26.
 */

angular.module('myComponents')
    .directive("barChart", function ($timeout) {
    var link = function (scope, element, attrs) {
        var config = scope.config;
        var margin = config.margin;
        var dataset=scope.data
        console.log(dataset);
        var w = (config.width == "100%" ? $('.cChart').width() : config.width) - margin.left - margin.right;
        var h = config.height - margin.top - margin.bottom;
        var color = d3.scale.category20b();
            var maxheight = d3.max(dataset, function (d) {
                    return d.y
                }) + 1;

            var xdomain = dataset.map(function (d) {
                return d.x;
            });
            xdomain.push(dataset[dataset.length - 1].x + dataset[0].dx);
            //
            var tip = d3.tip()
                .attr('class', 'tip')
                .offset([-5, 0])
                .html(function (d) {
                    return d;
                });


            var x = d3.scale.ordinal()
                .domain(xdomain)
                .rangeBands([0, w]);

            var y = d3.scale.linear()
                .range([h, 0])
                .domain([0, maxheight]);

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom")
                .tickFormat(d3.format(".1f"));
            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");


            var l = x(dataset[1].x) - x(dataset[0].x); //width between two ticks

            var svg = d3.select(".cChart")
                .append("svg")
                .attr("id", 'barchart')
                .attr("width", w + margin.left + margin.right)
                .attr("height", h + margin.top + margin.bottom)
                .append("g")
                .attr("width", w)
                .attr("height", h)
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                ;

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + h + ")")
                .call(xAxis)

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end");

               svg.call(tip);
            var firstX = d3.transform(svg.select(".axis .tick").attr("transform")).translate[0];
            svg.selectAll("rect")
                .data(dataset)
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("x", function (d, i) {
                    return firstX + x(d.x) + (1 - config.padding) / 2 * l;
                })
                .attr("y", function (d) {
                    return h - (d.y * h / maxheight);
                })
                .attr("width", l * config.padding)
                .attr("height", function (d) {
                    return d.y * h / maxheight;
                })
                .attr("fill", function (d, i) {
                    return color(i)
                })
                .on('mouseover', function (d, i) {

                    d3.select(this).transition()
                        .attr("x", firstX + x(d.x) + (1 - config.padding) / 2 * l - l * config.padding * 0.05)
                        .attr("width", l * config.padding + l * config.padding * 0.1)
                        .attr("y", h - (d.y * h / maxheight) - d3.select(this).attr("height") * 0.05)
                        .attr("height", (d.y * h / maxheight) + d3.select(this).attr("height") * 0.05)
                        .style("opacity", 1);

                    var tmp = d3.select(this).attr("height") * 0.05;
                    tip.show(d.y);



                })
                .on('mouseout', function (d, i) {
                    d3.select(this).transition()
                        .attr("x", firstX + x(d.x) + (1 - config.padding) / 2 * l)
                        .attr("width", l * config.padding)
                        .attr("y", h - (d.y * h / maxheight))
                        .attr("height", d.y * h / maxheight)
                        .style("opacity", 0.6);

                      tip.hide(d.y);
                });



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