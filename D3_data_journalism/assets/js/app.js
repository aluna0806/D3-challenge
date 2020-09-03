//Obesity Rate to Income


// Set Chart Area
var svgWidth = 960;
var svgHeight = 660;

var margin = {
  top: 40,
  right: 40,
  bottom: 120,
  left: 120
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Import Data
d3.csv("assets/data/data.csv").then(function(healthData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    healthData.forEach(function(data) {
      data.obesity = +data.obesity;
      data.income = +data.income;
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([15, d3.max(healthData, d => d.obesity)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(healthData, d => d.income)])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter();

    circlesGroup
    .append("circle")
    .attr("cx", d => xLinearScale(d.obesity))
    .attr("cy", d => yLinearScale(d.income))
    .attr("r", "15")
    .attr("fill", "pink")
    .attr("opacity", ".75");
    
    //Adding State Abbreviations --- Play w/ pixels... plus/minus w/i function
    circlesGroup
    .append("text")
    .text (d => d.abbr)
    .attr("x", d => xLinearScale(d.obesity))
    .attr("y", d => yLinearScale(d.income))
    
    //Tool Tip Activation - Per advice from tutor
    .on("click", function(data) {
        toolTip.show(data, this)})
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    })

    // Step 6: Initialize tool tip
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      //How do you use the formatting function when there are multiple items within it. I.e. I want to dollar format the income
      .html(function(d) {
        return (`${d.state}<br>Income: ${d.income}<br>Obesity: ${d.obesity}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Create axes labels // Why aren't axis labels loading? Is this due to my margins? I need how to calc margins re-explained
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - 100)
      .attr("x", 0 - height/2)
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Avg Income");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Obesity Rate");
  }).catch(function(error) {
    console.log(error);
  });
