var dataPath = "/data/bubble/"+2015+".csv";
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 900 - margin.left - margin.right,
    height = 482 - margin.top - margin.bottom;
  d3.select(self.frameElement).style("height", "1900px"); 

var x = d3.scaleLinear()
    .range([0, width-50]);

var y = d3.scaleLinear()
    .range([height, 0]);

var color = d3.scaleOrdinal(d3.schemeCategory10);

var xAxis = d3.axisBottom(x);

var yAxis = d3.axisLeft(y);

// gridlines in x axis function
function make_x_gridlines() {		
    return d3.axisBottom(x)
        .ticks(5)
}

// gridlines in y axis function
function make_y_gridlines() {		
    return d3.axisLeft(y)
        .ticks(5)
}
 
    var svg = d3.select("#bubble-chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("/data/bubble/2015.csv", function(error, data) {
  if (error) throw error;

  data.forEach(function(d) {
      d.AD = +d.AD;
      d.cost = +d.cost;
      d.classification=+d.classification;
      d.medicare=+d.medicare;
      console.log(d.pop65+","+d.classification);
  });

  x.domain(d3.extent(data, function(d) { return d.AD; })).nice();
    y.domain(d3.extent(data, function(d) { return d.cost; })).nice();
//  y.domain(d3.extent(data, function(d) { return d.pop65; })).nice();
//    y.domain(d3.extent(data, function(d) { return d.medicare; })).nice();
    
    // add the X gridlines
  svg.append("g")			
      .attr("class", "grid")
      .attr("transform", "translate(0," + height + ")")
      .call(make_x_gridlines()
          .tickSize(-height)
          .tickFormat("")
      )

  // add the Y gridlines
  svg.append("g")			
      .attr("class", "grid")
      .call(make_y_gridlines()
          .tickSize(-width)
          .tickFormat("")
      )

  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("text")             
      .attr("transform",
            "translate(" + (width-220) + " ," + 
                           (height-5) + ")")
      .style("text-anchor", "middle")
      .text("AD Numbers of Americans Age over 65 (in thousands)");

  svg.append("g")
      .call(yAxis);

  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0)
      .attr("x",-60)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Cost (in millions)"); 

  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
    .attr("r", function(d){ return d.medicare*0.0006;})
//      .attr("r", function(d){ return d.pop65*0.7;})
      .attr("cx", function(d) { return x(d.AD); })
      .attr("cy", function(d) { return y(d.cost); })
//      .attr("cy", function(d) { return y(d.pop65); })
//    .attr("cy", function(d) { return y(d.medicare); })
    .style("fill", function(d){ return color(d.classification);})

    .on("mouseover", function(d){
      var xPosition = d3.select(this).attr("x");
      var yPosition = d3.select(this).attr("y");
      
      d3.select("#tooltip")
            .style("left", (d3.event.pageX)+"px")
            .style("top", (d3.event.pageY - 28) + "px")
            .select("#states-label")
            .html("<strong>" + d.State + "</strong>" + 
                  "<br/>" + "AD numbers: "+d.AD+"<br/>"+
                  "cost: "+d.cost+"<br/>"+
                 "Health spending: "+d.medicare)			
      d3.select("#tooltip")
        .classed("hidden", false);
  })
    .on("mouseout", function(){
                    d3.select("#tooltip").classed("hidden", true);
            });
    
    var legend = svg.append("g")
                    .attr("trandform","translate(0,"+(height-50)+")");

//  legend.append("text")
//      .attr("x", width - 50)
//      .attr("y", height-50)
//      .attr("dy", "1em")
//      .style("text-anchor", "middle")
//      .text("Size by population percentage over 65");
    
  legend.append("svg:image")
        .attr("x", 620)
        .attr("y", 265)
        .attr("width", "184")
        .attr("height", "145")
        .attr("style", "outline: thin solid black;")  
        .attr("xlink:href", "data/legend.png");

});
    