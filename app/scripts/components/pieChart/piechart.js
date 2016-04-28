/**
 * Created by XinheHuang on 2016/4/26.
 */

angular.module('myComponents')
    .directive("pieChart", function ($timeout) {
        var link = function (scope, element, attrs) {
            var color = d3.scale.category20b();
            var firstTime = true;
            var durationTime = 1000;
            console.log('init');
            var config = scope.config;
            var margin = config.margin;
            var data = scope.data;

            var xDomain = config.xDomain;
            var yDomain = config.yDomain;


            var width = (config.width == "100%" ? $('.barChart').width() : config.width) - margin.left - margin.right;
            var height = config.height - margin.top - margin.bottom;


            var radius = (width > height ? height : width) / 2 - 20;

            var pie = d3.layout.pie()
                .sort(null).value(function (d) {
                    return d[yDomain]
                });

            var arc = d3.svg.arc()
                .innerRadius(0)
                .outerRadius(radius);

            var harc = d3.svg.arc()
                .innerRadius(0)
                .outerRadius(radius + 10);


            var tip = d3.tip()
                .attr('class', 'tip')
                .direction('n')
                .html(function (d) {

                    return "<span>" + d.value + "</span><br>";
                });


            var svg = d3.select(".pieChart")
                .append("svg")
                .attr("id", 'piechart')
                .attr("width", width)
                .attr("height", height)
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .append('g')
                .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

            svg.call(tip);


            //
            //
            // var legendRectSize = config.legendRectSize;
            // var legendSpacing = config.legendSpacing;
            // var legend = svg
            //     .selectAll('.legend')
            //
            //     .data(lengendarr)
            //     .enter()
            //     .append('g')
            //     .attr('class', 'legend');
            //
            // legend.append('rect')
            //     .attr('width', legendRectSize)
            //     .attr('height', legendRectSize)
            //     .style('fill', function (d) {
            //         ;
            //         return color(d.color)
            //     })
            //     .style('stroke', function (d) {
            //         return color(d.color)
            //     })
            //     .style('');
            // legend.append('text')
            //     .attr('x', legendRectSize + legendSpacing)
            //     .attr('y', legendRectSize - legendSpacing)
            //     .text(function (d) {
            //         return d.text;
            //     });
            //
            // var maxtext = d3.max($('.legend text').map(function () {
            //
            //     return ($(this).width());
            // }));
            // svg
            //     .selectAll('.legend')
            //     .attr('transform', function (d, i) {
            //         var height = legendRectSize + legendSpacing;
            //         var offset = height * color.domain().length;
            //         var horz = -2 * legendRectSize + w / 2 - maxtext;
            //         var vert = i * height - h / 2;
            //         return 'translate(' + horz + ',' + vert + ')';
            //     });


            function updateChart() {
                console.log(svg.selectAll(".pie"))
                var update = svg.selectAll(".pie")
                    .data(pie(data));
                console.log(update);
                update
                    .enter().append("path")
                    .attr("class", 'pie');

                console.log(update.exit())
                update.exit().remove();

                var lengendarr = [];

                if (firstTime) {
                    svg.selectAll("path")
                        .attr("fill", function (d, i) {
                            // lengendarr.push({
                            //     "color": i,
                            //     "text": d3.format(".1f")(d.data.x) + "~" + d3.format(".1f")(d.data.x + d.data.dx)
                            // });
                            return color(i);
                        })
                        .attr("d", arc)
                    firstTime=false;

                }
                svg.selectAll("path")
                    .transition()
                    .duration(durationTime)
                    .attrTween("d", arcTween)
                // .attr("fill", function (d, i) {
                //     // lengendarr.push({
                //     //     "color": i,
                //     //     "text": d3.format(".1f")(d.data.x) + "~" + d3.format(".1f")(d.data.x + d.data.dx)
                //     // });
                //     return color(i);
                // })
                // .attr("d", arc);


                svg.selectAll("path")
                    .on('mouseover', function (d, i) {
                        // d3.select(this).transition().attr("d", harc).style("opacity", 1);
                        // var leg = d3.selectAll(".legend").filter(function (d1) {
                        //     return d1.color == i;
                        // })
                        // leg.select("rect").transition().style("opacity", 1);
                        // leg.select("text").transition().style("font-size", 15).style("font-weight", "bold");


                        tip.show(d);
                    })
                    .on('mouseout', function (d, i) {
                        //   d3.select(this).transition().attr("d", arc).style("opacity", 0.6);
                        // var leg = d3.selectAll(".legend").filter(function (d1) {
                        //
                        //     return d1.color == i;
                        // })
                        // leg.select("rect").transition().style("opacity", 0.6);
                        // leg.select("text").transition().style("font-size", 12).style("font-weight", "bold");

                        tip.hide(d);
                    });

                function arcTween(a) {
                    console.log
                    var i = d3.interpolate(this._current, a);
                    this._current = i(0);
                    return function (t) {
                        return arc(i(t));
                    };
                }

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
            },
            link: link,
            controller: controller,
            template: ""
        };
    })