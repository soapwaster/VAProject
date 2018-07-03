    var ddMonthsState = []    
    var ddAll = []
    var j_inc = -1;
    var ddAll_std = 0
    var ddAll_mean = 0
    var ddAll_sum =  5674621
    var howmany = 13
    
    function load_files(i){
        if(i==howmany){
            get_dist_delay_all()
            return
        }
        ddMonthsState[i] = []
        d3version4.csv("FDB/deldist_"+i+".csv", function(data) {
            ddMonthsState[i] = []
            data.forEach(function(d){
                state = d.ORIGIN_STATE_NM
                dist = +d.DISTANCE_GROUP
                delay = +d.ARR_DELAY_GROUP
                if(delay < 0){
                    delay = 0
                }
                if(!this.ddMonthsState[i][state]){
                    this.ddMonthsState[i][state] = []
                }
                if(!this.ddMonthsState[i][state][dist]){
                    this.ddMonthsState[i][state][dist] = []
                }
                if(!((this.ddMonthsState[i][state])[dist][delay])){
                    (this.ddMonthsState[i][state])[dist][delay] = 0
                }
                this.ddMonthsState[i][state][dist][delay] +=1

            })
            load_files(i+1)
        })
    }
    
    load_files(1)
    
    function get_dist_delay_all(){
        for(i = 1;i<howmany;i++){
            for(v in ddMonthsState[i]){
                for(dist in ddMonthsState[i][v]){
                    if(!ddAll[dist]){
                        ddAll[dist] = []
                    }
                    for(delay in ddMonthsState[i][v][dist]){
                        if(!ddAll[dist][delay]){
                        ddAll[dist][delay] = 0
                    }
                        
                        ddAll[dist][delay] += ddMonthsState[i][v][dist][delay]
                    }
                }
            }
        }
        set_scatter()
    }    
    
function set_scatter(){
    
    ddAll_std = math.std(ddAll.slice(1,13))
    ddAll_mean = math.mean(ddAll.slice(1,13))
    ddAll_max = math.max(ddAll.slice(1,13))
    ddAll_min = math.min(ddAll.slice(1,13))
    
    var dataa =[
  {sepalLength: "-1", sepalWidth: 3.5, name: "0"},
  {sepalLength: "0", sepalWidth: 3.5, name: "[0,14]"},
  {sepalLength: "1", sepalWidth: 3.0, name: "[15,29]"},
  {sepalLength: "2", sepalWidth: 2.5, name: "[30,44]"},
  {sepalLength: "3", sepalWidth: 2.0, name: "[45,59]"},
  {sepalLength: "4", sepalWidth: 1.5, name: "[60,74]"},
  {sepalLength: "5", sepalWidth: 1.5, name: "[75,89]"},
  {sepalLength: "6", sepalWidth: 1.0, name: "[90,104]"},
  {sepalLength: "7", sepalWidth: 1.0, name: "[105,119]"},
  {sepalLength: "8", sepalWidth: 1.0, name: "[120,134]"},
  {sepalLength: "9", sepalWidth: 1.0, name: "[135,149]"},
  {sepalLength: "10", sepalWidth: 1.0, name: "[150,164]"},
  {sepalLength: "11", sepalWidth: 1.0, name: "[165,179]"},
  {sepalLength: "12", sepalWidth: 1.0, name: "[180+]"},
  {sepalLength: "13", sepalWidth: 1.0, name: "Delay(min)"},
    ]
  
    var dataa2 =[
  {sepalLength: "-1", sepalWidth: 3.5, name: "0"},
  {sepalLength: "0", sepalWidth: 3.5, name: "[<.25]"},
  {sepalLength: "1", sepalWidth: 3.0, name: "[.2,.4]"},
  {sepalLength: "2", sepalWidth: 2.5, name: "[.5,.7]"},
  {sepalLength: "3", sepalWidth: 2.0, name: "[.7,.9]"},
  {sepalLength: "4", sepalWidth: 1.5, name: "[1,1.2]"},
  {sepalLength: "5", sepalWidth: 1.5, name: "[1.2,1.4]"},
  {sepalLength: "6", sepalWidth: 1.0, name: "[1.5,17]"},
  {sepalLength: "7", sepalWidth: 1.0, name: "[1.7,1.9]"},
  {sepalLength: "8", sepalWidth: 1.0, name: "[2,2.2]"},
  {sepalLength: "9", sepalWidth: 1.0, name: "[2.2,2.4]"},
  {sepalLength: "10", sepalWidth: 1.0, name: "[2.5+]"},
  {sepalLength: "11", sepalWidth: 1.0, name: ""},
  {sepalLength: "12", sepalWidth: 1.0, name: "Distance (x1000 miles)"},
    ]  
    
    var margin = {top: 20, right: 40, bottom: 30, left: 60},
        width = 550 - margin.left - margin.right,
        height = 440 - margin.top - margin.bottom;


    var x = d3version4.scaleLinear()
        .range([0, width]);

    var y = d3version4.scaleLinear()
        .range([height, 0]);

    var color = d3version4.scaleQuantile()
          .domain([(ddAll_min - ddAll_mean) / ddAll_std,((ddAll_max - ddAll_mean) / ddAll_std)-6.8]) .range(['#91c1db','#88b9d7','#7eb2d3','#5594c4','#3c86bc','#2c7fb8','#2b74a7','#2a6997','#285e86','#213f58','#1e3549','#1a2b3b','#16222e','#121921','#0b0f14','#000000']);
    var xAxis = d3version4.axisBottom(x).tickFormat(function(d, i) {
      var inData = dataa2.filter(function (v) { return +v.sepalLength === d })
      return inData.length ? inData[0].name : d
    });

    var yAxis = d3version4.axisLeft(y).tickFormat(function(d, i) {
      var inData = dataa.filter(function (v) { return +v.sepalLength === d })
      return inData.length ? inData[0].name : d
    });
    
    x.domain([-0.5,12]).nice();
    y.domain([-0.5,13]).nice();

    var svg = d3version4.select("#scatter-div").append("div").style("display","inline-block").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
      var details = d3version4.select("#scatter-div").append("div").style("display","inline-block").style("width","100px").style("height","300px").style("font-size","14px").attr("id","details").style("vertical-align","top").style("margin-top","30px").append("span")
    
   

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
         .selectAll("text")
    
   // text label for the x axis
/*  svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .text("Date");
    */
    svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
                
    //Legend style

    var legend = svg.selectAll(".legend")
          .data([-0.27, -0.20, -0.1, -0.05, 0, 0.05, 0.1, 0.2, 0.5])
          .enter().append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i) { return "translate(0," + i * 10 + ")"; });

      legend.append("rect")
          .attr("x", width )
          .attr("width", 10)
          .attr("height", 10)
          .style("fill", color);

      legend.append("text")
          .attr("x", width - 10)
          .attr("y", 5)
          .attr("dy", ".35em")
          .style("text-anchor", "end")
          .text(function(d) { if(d==-0.27){return ddAll_min} else if(d == 0.5){return ddAll_max} else if(d == 0){return math.round(ddAll_mean)}return ""});

    //--------------------------------------------------------------------------------------------

          svg.append("g").attr("class", "dot_wrapper")
       f = svg.select(".dot_wrapper")
       v = f.selectAll(".dot")
          .data(ddAll)
          .enter()
    
       l = v.selectAll(".dot")
          .data(function(d,i){
              if(d != undefined){
                  return d;
              }return 0;
          })
          .enter()
          .append("circle")
          .attr("class", "dotdot")
          .attr("r", 7)
                .attr("cx", function(d,i) { 
                                    if(i == 0){
                                        j_inc++;
                                    }
                                    return x(j_inc); })
                .attr("cy", function(d,i) { return y(i); })
                .style("fill", function(d) {return color((d-ddAll_mean)/ddAll_std); });
    
    
          var circles = svg.selectAll("circle")
        
    
            function highlightBrushedCircles() {

                if (d3version4.event.selection != null) {

                    // revert circles to initial style
                    circles.attr("class", "dotdot");

                    circles.attr("r", 7);
					
                    var brush_coords = d3version4.brushSelection(this);

                    // style brushed circles
                    circles.filter(function (){ 
                               var cx = d3version4.select(this).attr("cx"),
                                   cy = d3version4.select(this).attr("cy");

                               return isBrushed(brush_coords, cx, cy);
                           })
                           .attr("class", "brushed");
                }
            }

            function displayTable() {

                // disregard brushes w/o selections  
                // ref: http://bl.ocks.org/mbostock/6232537
                if (!d3version4.event.selection) return;

                // programmed clearing of brush after mouse-up
                // ref: https://github.com/d3/d3-brush/issues/10
                d3version4.select(this).call(brush.move, null);

                var d_brushed =  d3version4.selectAll(".brushed").data();

                d3version4.selectAll(".brushed").attr("r",10);
                // populate table if one or more elements is brushed
                if (d_brushed.length > 0) {
                    s = 0
                    for(i in d_brushed){
                        
                        s = s + d_brushed[i]
                    }
                    details.html("Flights selected: "+s+" <br/> Percentage: "+((s/ddAll_sum)*100).toFixed(3)+"%")
                } else {
                    clearTableRows();
                }
            }

            var brush = d3version4.brush()
                          .on("brush", highlightBrushedCircles)
                          .on("end", displayTable); 

            svg.append("g")
               .call(brush);

        function isBrushed(brush_coords, cx, cy) {

             var x0 = brush_coords[0][0],
                 x1 = brush_coords[1][0],
                 y0 = brush_coords[0][1],
                 y1 = brush_coords[1][1];

            return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
        }

    
   
}