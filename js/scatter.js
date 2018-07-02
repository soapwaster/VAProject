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
  {sepalLength: "0", sepalWidth: 3.5, name: "[<250]"},
  {sepalLength: "1", sepalWidth: 3.0, name: "[250,499]"},
  {sepalLength: "2", sepalWidth: 2.5, name: "[500,749]"},
  {sepalLength: "3", sepalWidth: 2.0, name: "[750,999]"},
  {sepalLength: "4", sepalWidth: 1.5, name: "[1000,1249]"},
  {sepalLength: "5", sepalWidth: 1.5, name: "[1250,1499]"},
  {sepalLength: "6", sepalWidth: 1.0, name: "[1500,1749]"},
  {sepalLength: "7", sepalWidth: 1.0, name: "[1750,1999]"},
  {sepalLength: "8", sepalWidth: 1.0, name: "[2000,2249]"},
  {sepalLength: "9", sepalWidth: 1.0, name: "[2250,2499]"},
  {sepalLength: "10", sepalWidth: 1.0, name: "[2500+]"},
  {sepalLength: "11", sepalWidth: 1.0, name: "Distance (miles)"},
    ]  
    
    var margin = {top: 20, right: 40, bottom: 30, left: 60},
        width = 900 - margin.left - margin.right,
        height = 350 - margin.top - margin.bottom;

    var x = d3version4.scaleLinear()
        .range([0, width]);

    var y = d3version4.scaleLinear()
        .range([height, 0]);

    var color = d3version4.scaleQuantize()
          .domain([(ddAll_min - ddAll_mean) / ddAll_std,((ddAll_max - ddAll_mean) / ddAll_std)-6.8]) .range(['#2166ac','#2368ad','#256aae','#276daf','#296fb1','#2b71b2','#2d73b3','#2f75b4','#3178b5','#327ab6','#347cb7','#367eb9','#3781ba','#3983bb','#3a85bc','#3c87bd','#3d8abe','#3f8cbf','#408ec1','#4190c2','#4393c3','#4795c4','#4c98c6','#519ac7','#559cc8','#599fca','#5da1cb','#61a4cc','#65a6ce','#69a9cf','#6dabd0','#71aed2','#75b0d3','#78b3d4','#7cb5d6','#7fb8d7','#83bad8','#87bdda','#8abfdb','#8ec2dc','#91c4de','#94c6df','#98c8e0','#9bc9e0','#9ecbe1','#a1cce2','#a5cee3','#a8d0e4','#abd1e5','#aed3e6','#b1d4e7','#b4d6e8','#b7d8e9','#bbd9e9','#bedbea','#c1dceb','#c4deec','#c7e0ed','#cae1ee','#cde3ef','#d0e4f0','#d2e6f0','#d4e6f1','#d6e7f1','#d8e8f1','#dae9f2','#dceaf2','#deebf2','#e0ecf3','#e1edf3','#e3eef3','#e5eef4','#e7eff4','#e9f0f4','#ebf1f5','#edf2f5','#eff3f5','#f0f4f6','#f2f5f6','#f4f6f6','#f6f7f7','#f7f6f6','#f8f5f3','#f8f4f1','#f8f2ef','#f9f1ec','#f9efea','#faeee7','#faede5','#faebe3','#fbeae0','#fbe8de','#fbe7db','#fbe6d9','#fce4d7','#fce3d4','#fce1d2','#fce0d0','#fddfcd','#fdddcb','#fddcc8','#fddac6','#fdd7c2','#fcd5bf','#fcd2bb','#fccfb8','#fccdb4','#fbcab1','#fbc7ad','#fac4aa','#fac2a6','#fabfa3','#f9bca0','#f9ba9c','#f8b799','#f8b495','#f7b292','#f6af8f','#f6ac8b','#f5aa88','#f5a785','#f4a481','#f2a17f','#f19d7c','#f09a79','#ee9776','#ed9374','#eb9071','#ea8d6e','#e8896c','#e78669','#e68266','#e47f64','#e27c61','#e1785f','#df755c','#de7159','#dc6e57','#db6a54','#d96752','#d7634f','#d6604d','#d45d4b','#d25a49','#d15747','#cf5446','#cd5144','#cb4e42','#ca4a41','#c8473f','#c6443d','#c4413b','#c23d3a','#c13a38','#bf3736','#bd3335','#bb2f33','#b92b31','#b82730','#b6222e','#b41e2d','#b2182b']);
    var xAxis = d3version4.axisBottom(x).tickFormat(function(d, i) {
      var inData = dataa2.filter(function (v) { return +v.sepalLength === d })
      return inData.length ? inData[0].name : d
    });

    var yAxis = d3version4.axisLeft(y).tickFormat(function(d, i) {
      var inData = dataa.filter(function (v) { return +v.sepalLength === d })
      return inData.length ? inData[0].name : d
    });
    
    x.domain([-0.5,11]).nice();
    y.domain([-0.5,13]).nice();

    var svg = d3version4.select("#scatter-div").append("div").style("display","inline-block").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
      var details = d3version4.select("#scatter-div").append("div").style("display","inline-block").style("width","200px").style("height","300px").style("font-size","17.5px").attr("id","details").style("vertical-align","top").style("margin-top","30px").append("span")
    
   

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
    
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
          .attr("x", width - 8)
          .attr("width", 10)
          .attr("height", 10)
          .style("fill", color);

      legend.append("text")
          .attr("x", width - 24)
          .attr("y", 5)
          .attr("dy", ".35em")
          .style("text-anchor", "end")
          .text(function(d) { if(d==-0.27){return "low"} else if(d == 0.5){return "high"} return ""});
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
          .attr("r", 4.5)
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
                    circles.attr("r", 4.5);

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
                d3version4.selectAll(".brushed").attr("r",7);
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