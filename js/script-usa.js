/*  This visualization was made possible by modifying code provided by:

Scott Murray, Choropleth example from "Interactive Data Visualization for the Web" 
https://github.com/alignedleft/d3-book/blob/master/chapter_12/05_choropleth.html   
		
Malcolm Maclean, tooltips example tutorial
http://www.d3noob.org/2013/01/adding-tooltips-to-d3js-graph.html

Mike Bostock, Pie Chart Legend
http://bl.ocks.org/mbostock/3888852  */

		
//Width and height of map
var width = 850;
var height = 500;

// D3 Projection
var projection = d3version3.geo.albersUsa()
				   .translate([width/2, height/2])    // translate to center of screen
				   .scale([1000]);          // scale things down so see entire US
        
// Define path generator
var path = d3version3.geo.path()               // path generator that will convert GeoJSON to SVG paths
		  	 .projection(projection);  // tell path generator to use albersUsa projection

		
// Define linear scale for output
var color;

var legendText = ["Cities Lived", "States Lived", "States Visited", "Nada"];

//Create SVG element and append map to the SVG
var svg = d3version3.select("#usa_div #usa_svg")
			.attr("width", width)
			.attr("height", height);

// Append Div for tooltip to SVG
var div = d3version3.select("body")
		    .append("div")   
    		.attr("class", "tooltip")               
    		.style("opacity", 0);
    
var n = true;

$("#slider_div input").on("input", function(e){
    //load month data
    
    selectedBarHeight = 0
    loadDataMonth(e.target.value)
    
    //fill it
    svg.selectAll("path")
	.attr("d", path)
	.style("stroke", "#fff")
	.style("stroke-width", "1")
	.style("fill", function(d) {
        
    color = d3version3.scale.quantize()
          .domain([-2*stateStdDev[d.properties.name] , 2*stateStdDev[d.properties.name]])
          .range(virScale)
    if(statesStats[d.properties.name] == null) return "rgb(213,222,217)" 
	// Get data value
	var value = statesStats[d.properties.name][e.target.value] - (+stateMean[d.properties.name])
	if (value) {
	//If value exists…
        if(n){  
            return color(value)
        }
	return color(900);
	} else {
	//If value is undefined…
	return "rgb(213,222,217)";
	}
});
});


var virScale = ['#2166ac','#286db0','#2e74b4','#347cb7','#3983bb','#3e8bbf','#4292c3','#519ac7','#5ea2cb','#6baad0','#78b2d4','#84bbd8','#8fc3dd','#9ac9e0','#a5cee3','#afd3e6','#b9d9e9','#c3deec','#cde3ef','#d5e7f1','#dbeaf2','#e1edf3','#e8f0f4','#eef3f5','#f4f6f6','#f8f5f3','#f9f0eb','#faece3','#fbe7db','#fce2d4','#fddecc','#fdd8c3','#fccfb7','#fbc6ac','#f9bda1','#f8b495','#f6ac8a','#f3a280','#ee9777','#ea8c6e','#e58165','#e0765d','#db6a54','#d55f4c','#d05546','#ca4b41','#c4403b','#be3536','#b82830','#b2182b']
 
var patty;
var statesStats_leave = [];
var statesStats_arrive = [];


// Load in my states data!
d3version3.csv("FDB/results.csv", function(data) {
    
    for (var i = 0; i < data.length; i++) {

        // Grab State Name
        var dataState = jsonStates[data[i].ST];

        // Grab Month Number
        var dataMonth = +data[i].MO;

        // Grab data value 
        var dataValue = +data[i].NO;

        if(statesStats_leave[dataState] == null){
            statesStats_leave[dataState] = []
        }
        statesStats_leave[dataState][dataMonth] = dataValue
        
         switchTo("leave",6)
}
});

d3version3.csv("FDB/results_arrivi.csv", function(data) {
    
    for (var i = 0; i < data.length; i++) {

        // Grab State Name
        var dataState = jsonStates[data[i].ST];

        // Grab Month Number
        var dataMonth = +data[i].MO;

        // Grab data value 
        var dataValue = +data[i].NO;

        if(statesStats_arrive[dataState] == null){
            statesStats_arrive[dataState] = []
        }
        statesStats_arrive[dataState][dataMonth] = dataValue
        
}
        
});

function switchTo(loa,n){
    if(loa == "leave"){
        statesStats = statesStats_leave;
        createStdDev()
    }
    else{
        statesStats = statesStats_arrive;
        createStdDev()
    }
    
    //fill it
    svg.selectAll("path")
	.attr("d", path)
	.style("stroke", "#fff")
	.style("stroke-width", "1")
	.style("fill", function(d) {
            
    color = d3version3.scale.quantize()
          .domain([-2*stateStdDev[d.properties.name] , 2*stateStdDev[d.properties.name]])
          .range(virScale)
    if(statesStats[d.properties.name] == null) return "rgb(213,222,217)" 
	// Get data value
	var value = statesStats[d.properties.name][n] - (+stateMean[d.properties.name])
	if (value) {
	//If value exists…
        if(n){  
            return color(value)
        }
	return color(900);
	} else {
	//If value is undefined…
	return "rgb(213,222,217)";
	}
});
}

// Load GeoJSON data and merge with states data
d3version3.json("js/us-states.json", function(json) {

    
// Bind the data to the SVG and create one path per GeoJSON feature
patty = svg.selectAll("path")
	.data(json.features)
	.enter()
	.append("path")
    .attr("id",function(d){
        return d.properties.name + "_map"
    })
    .attr("d", path)
	.style("stroke", "#fff")
	.style("stroke-width", "1")
    
     switchTo("leave",6)

});
// Modified Legend Code from Mike Bostock: http://bl.ocks.org/mbostock/3888852
/*var legend = d3version3.select("body").append("svg")
      			.attr("class", "legend")
     			.attr("width", 140)
    			.attr("height", 200)
   				.selectAll("g")
   				.data()
   				.enter()
   				.append("g")
     			.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  	legend.append("rect")
   		  .attr("width", 18)
   		  .attr("height", 18)
   		  .style("fill", color);

  	legend.append("text")
  		  .data(legendText)
      	  .attr("x", 24)
      	  .attr("y", 9)
      	  .attr("dy", ".35em")
      	  .text(function(d) { return d; });*/

var stateStateStats=[]
d3version3.csv('FDB/results-pair.csv', function (data) {
    for(var el in data){
        el = data[el]
        nameSt = el.origin + "-" + el.destination
        stateStateStats[nameSt] = el.flights
    }
});

var stateMean=[]

d3version3.csv('FDB/mean_annua.csv', function(data){
    for(var el in data){
        el = data[el]
        stateMean[jsonStates[el.ST]] = +el.AVG
    }
    
})

var stateStdDev = []
function createStdDev(){
    for(i in statesStats){
        stateStdDev[i] = standardDeviation(statesStats[i])
    }
}
