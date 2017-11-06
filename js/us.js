var width=844;
var height=440;
var legendRectSize = 18;                                  // NEW
var legendSpacing = 4;                                    // NEW

Projection = d3.geoAlbersUsa()
                .translate([width/2,height/2])
                .scale([900]);

var svg = d3.select("#map-vis")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

var path = d3.geoPath()
            .projection(Projection);

var color = d3.scaleQuantile()
            .range(["rgb(239,243,255)","rgb(189,215,231)","rgb(107,174,214)","rgb(49,130,189)","rgb(8,81,156)"]);
var legendText = ["legend1", "legend2", "legend3", "legend4","legend5"];


d3.csv("data/state65.csv", function(data){

    d3.json("data/us-states.json", function(json){
        console.log(json.features); //test
        
        var domainArray = [];
        for(var i=0;i<data.length;i++){
            var dataState = data[i].State;
            var dataValue = data[i].PercentageChange;
            domainArray.push(dataValue);
            for(var j = 0; j<json.features.length;j++){
                var jsonState = json.features[j].properties.name;
                if(dataState == jsonState){
                    json.features[j].properties.PercentageChange = dataValue;
                    break;
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
                    .html("<strong>" + d.properties.name + "</strong>" + "<br/>" + "PercentageChange: " + d.properties.PercentageChange)			
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
