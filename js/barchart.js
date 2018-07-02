var bar_margin = {top: 40, right: 20, bottom: 30, left: 40},
    bar_width = 950  - bar_margin.left - bar_margin.right,
    bar_height = 575 - bar_margin.top - bar_margin.bottom;
    
var selectedBarHeight = 0;

var bar_x = d3version4.scaleBand()
    .range([0, bar_width], .1);

var bar_y = d3version4.scaleLinear()
    .range([bar_height, 0]);

var bar_xAxis = d3version4.axisBottom(bar_x)
    //.scale(x)
    //.orient("bottom");

var bar_yAxis = d3version4.axisLeft(bar_y)
    .tickFormat(d3version4.formatPrefix(".1", 1e3));

var svgg = d3version4.select("#barchart_div").append("svg")
    .attr("width", bar_width + bar_margin.left + bar_margin.right)
    .attr("height", bar_height + bar_margin.top + bar_margin.bottom)
  .append("g")
    .attr("transform", "translate(" + bar_margin.left + "," + bar_margin.top + ")");
    
var bar_div = d3version4.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

d3version4.csv("FDB/state_pair_month.csv", type, function(error, data) {
    
  dat = []
  for(var el in data){
      if(el%12 == 0)
        dat.push(data[el])
  }
    
  data = dat
  bar_x.domain(data.map(function(d) { return d.s; }));
  bar_y.domain([0, d3version4.max(data, function(d) { return d.n; })]);


  svgg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + bar_height + ")")
      .call(bar_xAxis);

  svgg.append("g")
      .attr("class", "y axis")
      .call(bar_yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("# of flights");

    
  svgg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return bar_x(d.s); })
      .attr("width", bar_x.bandwidth)
      .attr("y", function(d) { return bar_y(d.n); })
      .attr("height", function(d) { return bar_height - bar_y(d.n); })
      .on("mouseover", function(d) {
       bar_div.transition()
         .duration(200)
         .style("opacity", .9);
       bar_div.html(d.n - selectedBarHeight)
         .style("left", (d3version4.event.pageX) + "px")
         .style("top", (d3version4.event.pageY - 28) + "px");
       })
     .on("mouseout", function(d) {
       bar_div.transition()
         .duration(500)
         .style("opacity", 0);
       });

});
    
function loadDataMonth(month){
    
    svgg.selectAll("line").remove()
    svgg.selectAll("rect")
      .style("fill", function(d){
        return "#6394ba"
    })
    
    
    svgg.selectAll(".bar")
       .each(function(d){
        d.n = statesStats[jsonStates[d.s]][month]
    })
    .attr("y", function(d) { return bar_y(d.n); })
    .attr("height", function(d) { return bar_height - bar_y(d.n); })
    .on("mouseover", function(d) {
       bar_div.transition()
         .duration(200)
         .style("opacity", .9);
       bar_div.html(d.n - selectedBarHeight)
         .style("left", (d3version4.event.pageX) + "px")
         .style("top", (d3version4.event.pageY - 28) + "px");
       })
     .on("mouseout", function(d) {
       bar_div.transition()
         .duration(500)
         .style("opacity", 0);
       });
    
}

$(document).ready(function() {
 $("rect").click(function(e){
     
    svgg.selectAll("line").remove()
    svgg.selectAll("rect")
      .style("fill", function(d){
        return "#6394ba"
    })
    
    var lineEnd = $(e.target).prop("height")
    
    lineEnd = bar_height - lineEnd.baseVal.value
    
    selectedBarHeight = $(e.target).prop("__data__").n

    var line = svgg.append("line")
      .attr("x1", 0)
      .attr("x2", bar_width)
      .attr("y1", lineEnd)
      .attr("y2", lineEnd)
      .attr("stroke-width", 1)
      .attr("stroke", "black")
    
    d3version4.select(e.target)
      .style("fill", function(d){
        return "rgb(202, 75, 65)"
    })
    
})  
    
$("rect").mouseover(function(e){
     
    if(selectedBarHeight <= 0) return 
    
    var barVal = $(e.target).prop("__data__").n
    
    var theSelectedBarHeight = barVal - selectedBarHeight
    
    
})  
    
$("#usa_svg path").on("mouseover",function(e){
    console.log("Ddd")
    })
});
    

function type(d) {
  d.n = +d.n;
  return d;
}
