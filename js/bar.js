var width=480;
var height=250;

var svg = d3.select("#Bar")
            .append("svg")
            .attr("width",width)
            .attr("height",height)
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    innerWidth = width - margin.left - margin.right,
    innerHeight = height - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x0 = d3.scaleBand()
    .rangeRound([0, innerWidth])
    .paddingInner(0.1);

var x1 = d3.scaleBand()
    .padding(0.05);

var y = d3.scaleLinear()
    .rangeRound([innerHeight, 0]);

var z = d3.scaleOrdinal()
    .range(["#ed8222","#181c75"]);

d3.csv("data/bar.csv", function(d, i, columns) {
  for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
    
  return d;
}, function(data) {

  var keys = data.columns.slice(1);
    
  x0.domain(data.map(function(d) { return d.Ages; }));
  x1.domain(keys).rangeRound([0, x0.bandwidth()]);
  y.domain([0, d3.max(data, function(d) { return d3.max(keys, function(key) { return d[key]; }); })+0.08]).nice();

  var bar = g.append("g")
            .selectAll("g")
            .data(data)
            .enter().append("g")
            .attr("transform", function(d) { return "translate(" + x0(d.Ages) + ",0)"; });
    
    bar.selectAll("rect")
    .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter().append("rect")
      .attr("x", function(d) { return x1(d.key); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", x1.bandwidth())
      .attr("height", function(d) { return innerHeight - y(d.value); })
      .attr("fill", function(d) { return z(d.key); })
    
    bar.selectAll("text")
    .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter().append("text")
        .text(function(d){ return d.value})
      .attr("x", function(d) { return x1(d.key)+20; })
      .attr("y", function(d) { return y(d.value)+15; })
      .attr("font-family", "sans-serif")
      .attr("font-size", "11px")
      .attr("fill", "white");
    
   
  g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + innerHeight + ")")
      .call(d3.axisBottom(x0))
    .append("text")
      .classed("label", true)
      .attr("x", width)
      .attr("y", margin.bottom - 10)
      .style("text-anchor", "end")
      .text("Age");

  g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(null))
       .append("text")
      .classed("label", true)
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Estimated Risk");


  var legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys.slice().reverse())
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", innerWidth - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z);

  legend.append("text")
      .attr("x", innerWidth - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function(d) { return d; });
});