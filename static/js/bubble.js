

// set the dimensions and margins of the graph
var margin = {top: 150, right: 150, bottom: 150, left: 150},
    width = 1200 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
  d3.json("/get10YearData", data => {

  console.log(data)
  // Add Title to chart
  svg.append("text")
   .attr("transform", "translate(100,0)")
   .attr("x", 1)
   .attr("y", 0)
   .text("Plot by Decade")
   .style("font", "36px Helvetica");; 

  //Add X axis
  var NewArray =["Before 1900"]
  data.map(d=> NewArray.push(d.Year))
  
  var x = d3.scaleBand()
    //.domain(data.map(function(d) { return d.Year; }))
    .domain(NewArray)
    .range([0,width ]);
  svg.append("g")
    .attr("transform", "translate(0," + (height+10) + ")")
    .call(d3.axisBottom(x))
    .style("font", "20px Helvetica")
    .selectAll("text")  
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".5em")
    .attr("transform", "rotate(-90)" );
  
  // Add X axis label:
  svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height +100 )
      .text("Decade")
      .style("font", "24px Helvetica");

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 675])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y))
    .style("font", "20px Helvetica")
    svg.append("g")
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -75)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Average Number of Deaths per 100k")
      .style("font", "24px Helvetica");;   



  // Add a scale for bubble size
  var z = d3.scaleSqrt()
    .domain([0, 750])
    .range([ 2, 20]);

  // Add a scale for bubble color
  var myColor = d3.scaleOrdinal()
    .domain(["Stroke", "Cancer", "Accident", "Heart_Disease", "Influenza_and_Pneumonia"])
    .range(d3.schemeSet1)

// ***** Tooltip***** //

  // -1- Create a tooltip div that is hidden by default:
  var tooltip = d3.select("#my_dataviz")
    .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "black")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("color", "white")

  // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
  var showTooltip = function(d) {
    tooltip
      .transition()
      .duration(200)
    tooltip
      .style("opacity", 1)
      .html("Year: " + d.Year + "<br/>"  + "Cause: " + d.Cause + "<br/>" + "Numbers of Deaths /100k: " + d.DeathRate)
      .style("left", (d3.event.pageX+20) + "px")
      .style("top", (d3.event.pageY-30) + "px")
  }
  var moveTooltip = function(d) {
    tooltip
    .style("left", (d3.event.pageX+20) + "px")
    .style("top", (d3.event.pageY-30) + "px")
  }
  var hideTooltip = function(d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0)
  }

  // What to do when one group is hovered
  var highlight = function(d){
    // reduce opacity of all groups
    d3.selectAll(".bubbles").style("opacity", .05)
    
    // except the one that is hovered
    d3.selectAll("."+d).style("opacity", 1)
    console.log(d)
  }

  // And when it is not hovered anymore
  var noHighlight = function(d){
    d3.selectAll(".bubbles").style("opacity", 1)
  }

  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("class", function(d) { return "bubbles " + d.Cause })
      //.attr("class", "bubbles")
      .attr("cx", function (d) { return (x(d.Year) + x.bandwidth()/2); } )
      .attr ("z", d=>console.log(x.bandwidth()))
      .attr("cy", function (d) { return y(d.DeathRate); } )
      .attr("r", function (d) { return z(d.DeathRate); } )
      .style("fill", function (d) { return myColor(d.Cause); } )
   
  // -3- Trigger the functions for hover
    .on("mouseover", showTooltip )
    .on("mousemove", moveTooltip )
    .on("mouseleave", hideTooltip )

//  ****** Legend ***** //

    // Add one dot in the legend for each name.
    var size = 30
    var allgroups = ["Stroke", "Cancer", "Accident", "Heart_Disease", "Influenza_and_Pneumonia"]
    svg.selectAll("myrect")
      .data(allgroups)
      .enter()
      .append("circle")
        .attr("cx", 750)
        .attr("cy", function(d,i){ return 75 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("r", 7)
        .style("fill", function(d){ return myColor(d)})
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)

    // Add labels beside legend dots
    svg.selectAll("mylabels")
      .data(allgroups)
      .enter()
      .append("text")
        .attr("x", 750 + size*.5)
        .attr("y", function(d,i){ return 60 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function(d){ return myColor(d)})
        .style("font", "22px Helvetica")
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)
   })
