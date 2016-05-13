/**
 * Created by XinheHuang on 2016/4/26.
 */

angular.module('myComponents')
    .directive("pieChart", function ($timeout) {
        var link = function (scope, element, attrs) {
            var color = d3.scale.category20();
            var firstTime = true;
            var durationTime = 1000;
            console.log('init');
            var config = scope.config;
            var margin = config.margin;
            var data = scope.data;

            var xDomain = config.xDomain;
            var yDomain = config.yDomain;

            var enterAntiClockwise = {
                startAngle: Math.PI * 2,
                endAngle: Math.PI * 2
            };


            var width = (config.width == "100%" ? $('.pieChart').width() : config.width) - margin.left - margin.right;
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
                .attr('class', 'd3-tip')
                .offset([0, 0])
                .html(function(d) {
                    return d.data[xDomain] + ": <span style='color:orangered'>" + d.data[yDomain] + "</span>";
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
            var path;

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

                var selected=false;
                if (firstTime) {
                    console.log(2);
                    console.log(data);
                    path = svg.selectAll("path")
                        .data(pie(data))
                        .enter().append("path")
                        .attr("fill", function (d, i) {
                            // lengendarr.push({
                            //     "color": i,
                            //     "text": d3.format(".1f")(d.data.x) + "~" + d3.format(".1f")(d.data.x + d.data.dx)
                            // });
                            return color(i);
                        })
                        .attr("d", arc)
                        .style("opacity", 0.8)
                        .each(function (d) {
                            this._current = d;
                        })
                    firstTime = false;
                }


                else {
                    console.log(1);  console.log(data);

                    path = path.data(pie(data)); // update the data
                    // set the start and end angles to Math.PI * 2 so we can transition
                    // anticlockwise to the actual values later
                    path.enter().append("path")
                        .attr("fill", function (d, i) {
                            return color(i);
                        })
                        .attr("d", arc(enterAntiClockwise))
                        .style("opacity", 0.8)
                        .each(function (d) {
                            this._current = {
                                data: d.data,
                                value: d.value,
                                startAngle: enterAntiClockwise.startAngle,
                                endAngle: enterAntiClockwise.endAngle
                            };
                        }); // store the initial values

                    path.exit()
                        .transition()
                        .duration(750)
                        .attrTween('d', arcTweenOut)
                        .remove() // now remove the exiting arcs

                    path.transition().duration(750).attrTween("d", arcTween); // redraw the arcs
                }

// Store the displayed angles in _current.
// Then, interpolate from _current to the new angles.
// During the transition, _current is updated in-place by d3.interpolate.
                function arcTween(a) {
                    var i = d3.interpolate(this._current, a);
                    this._current = i(0);
                    return function (t) {
                        return arc(i(t));
                    };
                }

// Interpolate exiting arcs start and end angles to Math.PI * 2
// so that they 'exit' at the end of the data
                function arcTweenOut(a) {
                    var i = d3.interpolate(this._current, {startAngle: Math.PI * 2, endAngle: Math.PI * 2, value: 0});
                    this._current = i(0);
                    return function (t) {
                        return arc(i(t));
                    };
                }


                svg.selectAll("path")
                    .on('mouseover', function (d, i) {
                        if (scope.selected) return;
                        d3.select(this).transition().attr("d", harc).style("opacity", 1);
                        // var leg = d3.selectAll(".legend").filter(function (d1) {
                        //     return d1.color == i;
                        // })
                        // leg.select("rect").transition().style("opacity", 1);
                        // leg.select("text").transition().style("font-size", 15).style("font-weight", "bold");


                        tip.show(d);
                    })
                    .on('mouseout', function (d, i) {
                        if (scope.selected) return;
                        //d3.select(this).transition().attr("d", harc).style("opacity", 0);
                        d3.select(this).transition().attr("d", arc).style("opacity", 0.8);
                        // var leg = d3.selectAll(".legend").filter(function (d1) {
                        //
                        //     return d1.color == i;
                        // })
                        // leg.select("rect").transition().style("opacity", 0.6);
                        // leg.select("text").transition().style("font-size", 12).style("font-weight", "bold");

                        tip.hide(d);
                    })
                    .on('click', function (d) {
                        if (config.onClick) {
                            if (d3.select(this).classed("selected"))
                            {
                                d3.select(this).classed("selected",false);
                                d3.select(this).transition().attr("d", arc).style("opacity", 0.8);
                                scope.selected=false;

                            }
                            else {
                                //scope.selected=!scope.selected;
                                svg.selectAll("path")
                                    .classed("selected",false)
                                    .transition().attr("d", arc).style("opacity", 0.8);
                                d3.select(this).classed("selected",true);
                                d3.select(this).transition().attr("d", harc).style("opacity", 1);
                                scope.selected=true;

                                config.onClick(d.data[xDomain]);
                            }
                            scope.$apply();
                        }
                        //     if (config.highlight) {
                        //
                        //         focus.selectAll('.bar')
                        //             .selectAll('rect').
                        //         style('opacity', 0.6);
                        //         $(this).css('opacity', '1');
                        //     }
                        // }
                        // d3.event.stopPropagation();

                    });


            }

            scope.$watch('data', function () {
                // if (scope.status=='ready')
                if (scope.data.length!=0) {
                    data = scope.data
                    updateChart();
                }
            });

            //scope.$watch('selected', function () {
            //    // if (scope.status=='ready')
            //    if (scope.selected)
            //        $(".lineChart") .scrollIntoView();
            //});
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
                "selected":"=",
                "data": "=",
                "config": "=",
            },
            link: link,
            controller: controller,
            template: ""
        };
    })