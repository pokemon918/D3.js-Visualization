   
var newState = "ALL";
var newyear = 2015
    
    function updateClicked(){
        d3.selectAll('svg').remove();
        d3.select('.list-inline').remove();
        var selState = document.getElementById('selectBox1');
        var selYear = document.getElementById('selectBox2');
        newState = selState.options[selState.selectedIndex].innerHTML;
        newyear = selYear.options[selYear.selectedIndex].innerHTML;  
        var title = newyear+" Bubble chart with AD numbers and cost per state"
        document.getElementById("bubble-title").innerHTML= title;
        MyBubble(newState, newyear);
        MyMap(newState);
        console.log(newState+"test"+newyear);
    }
function MyBubble(newState, newyear){

    var margin = { top: 50, right: 300, bottom: 50, left: 50 },
    outerWidth = 816,
    outerHeight = 390,
    width = outerWidth - margin.left - margin.right,
    height = outerHeight - margin.top - margin.bottom;
    
var x = d3.scale.linear()
    .range([0, width]).nice();

var y = d3.scale.linear()
    .range([height, 0]).nice();

d3.csv("data/bubble/"+newyear+".csv", function(data) {

  data.forEach(function(d) {
    d.AD = +d.AD;
    d.cost = +d.cost;
    d.classification=+d.classification;
    d.medicare=+d.medicare;
  });

    x.domain([0, 1200]).nice;
    y.domain([0, 9000]).nice();
  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickSize(-height);

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickSize(-width);

  var color = d3.scale.category10();

  var tip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(function(d) {
        return "AD numbers"+ ": " + d.AD + "<br>" + "Cost in AD" + ": " + d.cost+ "<br>" + 
        "Slope: "+ (d.AD/d.cost).toFixed(4)+"<br>"+"Total Health Spending: "+ d.medicare;
      });

  var zoomBeh = d3.behavior.zoom()
      .x(x)
      .y(y)
      .scaleExtent([0, 500])
      .on("zoom", zoom);

  var svg = d3.select("#inter-bubble")
    .append("svg")
      .attr("width", outerWidth)
      .attr("height", outerHeight)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(zoomBeh);

  svg.call(tip);

  svg.append("rect")
      .attr("width", width)
      .attr("height", height);

  svg.append("g")
      .classed("x axis", true)
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .classed("label", true)
      .attr("x", width)
      .attr("y", margin.bottom - 10)
      .style("text-anchor", "end")
      .text("AD Numbers of Americans Age over 65+ (in thousands)");

  svg.append("g")
      .classed("y axis", true)
      .call(yAxis)
    .append("text")
      .classed("label", true)
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Cost in AD(in millions)");

  var objects = svg.append("svg")
      .classed("objects", true)
      .attr("width", width)
      .attr("height", height);

  objects.append("svg:line")
      .classed("axisLine hAxisLine", true)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", width)
      .attr("y2", 0)
      .attr("transform", "translate(0," + height + ")");

  objects.append("svg:line")
      .classed("axisLine vAxisLine", true)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", height);

  objects.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .classed("dot", true)
      .attr("r", function (d) { 
            var result;
                if(d.State ==newState){
                    result = d.medicare*0.0005;
                }else if(newState == "ALL"){
                    result = d.medicare*0.0005;
                }
            return result; })
      .attr("transform", transform)
      .style("fill", function(d) { return color(d.classification); })
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide);

    var legend = svg.append("g")
                    .attr("trandform","translate(0,"+(height-50)+")");
    
  legend.append("svg:image")
        .attr("x", 320)
        .attr("y", 180)
        .attr("width", "115")
        .attr("height", "101")
        .attr("style", "outline: thin solid black;")  
        .attr("xlink:href", "data/legend.png");

        d3.select("input").on("click", change);

  d3.select("input").on("click", change);

  function change() {
    var svg = d3.select("#inter-bubble").transition();

    svg.select(".x.axis").duration(750).call(xAxis).select(".label").text("AD");

    objects.selectAll(".dot").transition().duration(1000).attr("transform", transform);
  }

  function zoom() {
    svg.select(".x.axis").call(xAxis);
    svg.select(".y.axis").call(yAxis);

    svg.selectAll(".dot")
        .attr("transform", transform);
  }

  function transform(d) {
    return "translate(" + x(d.AD) + "," + y(d.cost) + ")";
  }
});
    
}
function MyMap(newState){
var width=482;
var height=250;
var legendRectSize = 18;                                  // NEW
var legendSpacing = 4;                                    // NEW
Projection = d3.geo.albersUsa()
                .translate([width/2,height/2])
                .scale([550]);

var svg = d3.select("#map-vis")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

var path = d3.geo.path()
            .projection(Projection);

var color = d3.scale.quantile()
            .range(["rgb(239,243,255)","rgb(189,215,231)","rgb(107,174,214)","rgb(49,130,189)","rgb(8,81,156)"]);
var legendText = ["legend1", "legend2", "legend3", "legend4","legend5"];


d3.csv("data/state65.csv", function(data){

    d3.json("data/us-states.json", function(json){
        
        var domainArray = [];
        for(var i=0;i<data.length;i++){
            var dataState = data[i].State;
            var dataValue = data[i].PercentageChange;
            domainArray.push(dataValue);
            for(var j = 0; j<json.features.length;j++){
                var jsonState = json.features[j].properties.name;
                if(newState=="ALL"){
                    if(dataState == jsonState){
                    json.features[j].properties.PercentageChange = dataValue;
                    break;
                    }
                }else if(dataState == newState){
                    if(dataState == jsonState){
                    json.features[j].properties.PercentageChange = dataValue;
                    break;
                    }
                }
                
            }
        }
        color.domain(domainArray);
        
        svg.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d",path)
            .style("stroke","#fff")
            .style("stroke-width","1")
            .style("fill",function(d){
            var value = d.properties.PercentageChange;
            if(value){
                return color(value);
            }else{
                return "rgb(37,37,37)";
            }
        })
        
            .on("mouseover", function(d){
                var xPosition = d3.select(this).attr("x");
                var yPosition = d3.select(this).attr("y");
                
                d3.select("#tooltip")
                    .style("left", (d3.event.pageX)+"px")
                    .style("top", (d3.event.pageY - 28) + "px")
                    .select("#states-label")
                    .html("<strong>" + d.properties.name + "</strong>" + "<br/>" + "Percentage Change: " + d.properties.PercentageChange)			
                d3.select("#tooltip")
                .classed("hidden", false);
            })
                .on("mouseout", function(){
                    d3.select("#tooltip").classed("hidden", true);
            })
                
                var legend = d3.select("#legend")
                            .append("ul")
                            .attr("class","list-inline");

                var keys = legend.selectAll("li.key")   
                                .data(color.range());

                keys.enter().append('li')
                            .attr('class', 'key')
                            .style('border-top-color', String)
                            .text(function(d) {
                                var r = color.invertExtent(d);
                                return parseInt(r[0])+" - "+parseInt(r[1]);
                });   
    });
});
  
}
MyMap(newState);
MyBubble(newState, newyear);

