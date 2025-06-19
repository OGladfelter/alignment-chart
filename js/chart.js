// set the dimensions and margins of the graph
if (screen.width < 600){
    var margin = {top: 10, right: 10, bottom: 10, left: 10},
    w = window.innerWidth - margin.left - margin.right,
    h = w,
    padding = 10,
    avatar_size = 30,
    circle_radius = 15,
    text_placement = 20;
}
else {
    var margin = {top: 10, right: 10, bottom: 10, left: 10},
    w = (window.innerHeight * .8) - margin.left - margin.right,
    h = w,
    padding = 10;

    var avatar_size = 60,
    circle_radius = 30,
    text_placement = 35;
}

//create svg element
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr("class", "scatter")
    .attr("overflow", "visible");

//Read the data
d3.csv("data/final.csv", function(data) {
  
    //scale functions
    xScale = d3.scaleLinear()
        .domain([-1000, 1000])
        .range([padding, w - padding]);
    yScale = d3.scaleLinear()
        .domain([-1000, 1000])
        .range([h - padding, padding]);

    // define axes
    var xAxis = d3.axisBottom().scale(xScale).ticks(0).tickSize(0);
    var yAxis = d3.axisLeft().scale(yScale).ticks(0).tickSize(0);

    // draw arrow tips on axes
    svg.append("path")
        .attr("transform", "translate(0," + ((h/2) + 0) + ") rotate(180)")
        .attr("d", "M-5,0 L-10,5 L-10,-5 Z")
    svg.append("path")
        .attr("transform", "translate(" + (w - 0) + "," + ((h/2) + 0) + ") rotate(0)")
        .attr("d", "M-5,0 L-10,5 L-10,-5 Z")
    svg.append("path")
        .attr("transform", "translate(" + ((w/2) - 0) + ", 0) rotate(270)")
        .attr("d", "M-5,0 L-10,5 L-10,-5 Z")
    svg.append("path")
        .attr("transform", "translate(" + ((w/2) - 0) + "," + (h) + ") rotate(90)")
        .attr("d", "M-5,0 L-10,5 L-10,-5 Z")

    // draw x axis
    svg.append("g")
        .attr("class", "axis")	
        .attr("transform", "translate(0," + ((h/2) + 0) + ")")
        .call(xAxis);
    // draw y axis
    ya = svg.append("g")
        .attr("class", "axis")	
        .attr("transform", "translate(" + ((w/2) - 0) + ", 0)")
        .call(yAxis)

    // create a clipping region 
    var clip = svg.append("defs").append("SVG:clipPath")
      .attr("id", "clip")
      .append("SVG:rect")
      .attr("width", w )
      .attr("height", h + (h/4) )
      .attr("x", 0)
      .attr("y", -(h/4));

    var scatter = svg.append('g')
      .attr("clip-path", "url(#clip)");

    ya.select('path').attr('id', "y_axis");

    // add axis labels
    label_1 = scatter.append("text")
        .attr("x", ((w/2) - 0))
        .attr("y", yScale(750))
        .text("Good")
        .attr("class", "y-axis-label");
    label_2 = scatter.append("text")
        .attr("x", xScale(750))
        .attr("y", ((h/2) + 0))
        .text("Chaotic")
        .attr("class", "x-axis-label");
    label_3 = scatter.append("text")
        .attr("x", ((w/2) - 0))
        .attr("y", yScale(-750))
        .text("Evil")
        .attr("class", "y-axis-label");
    label_4 = scatter.append("text")
        .attr("x", xScale(-750))
        .attr("y", ((h/2) + 0))
        .text("Lawful")
        .attr("class", "x-axis-label");
    label_5 = scatter.append("text")
        .attr("x", ((w/2) - 0))
        .attr("y", ((h/2) + 0))
        .text("Neutral")
        .attr("class", "x-axis-label");

    // obtain the text element's bounding box and Current Transformation Matrix
    bbox_1 = label_1["_groups"][0][0].getBBox()
    bbox_2 = label_2["_groups"][0][0].getBBox()
    bbox_3 = label_3["_groups"][0][0].getBBox()
    bbox_4 = label_4["_groups"][0][0].getBBox()
    bbox_5 = label_5["_groups"][0][0].getBBox()

    // insert a rect beneath the text, to represent the bounding box
    scatter.append('rect')
        .attr('x', bbox_1.x - 5)
        .attr('y', bbox_1.y - 5)
        .attr('width', bbox_1.width + 10)
        .attr('height', bbox_1.height + 10)
        .attr("class", "halo")
    scatter.append('rect')
        .attr('x', bbox_2.x - 5)
        .attr('y', bbox_2.y - 5)
        .attr('width', bbox_2.width + 10)
        .attr('height', bbox_2.height + 10)
        .attr("class", "halo")
    scatter.append('rect')
        .attr('x', bbox_3.x - 5)
        .attr('y', bbox_3.y - 5)
        .attr('width', bbox_3.width + 10)
        .attr('height', bbox_3.height + 10)
        .attr("class", "halo")
    scatter.append('rect')
        .attr('x', bbox_4.x - 5)
        .attr('y', bbox_4.y - 5)
        .attr('width', bbox_4.width + 10)
        .attr('height', bbox_4.height + 10)
        .attr("class", "halo")
    scatter.append('rect')
        .attr('x', bbox_5.x - 5)
        .attr('y', bbox_5.y - 5)
        .attr('width', bbox_5.width + 10)
        .attr('height', bbox_5.height + 10)
        .attr("class", "halo")

    // pull labels above the rectangles
    label_1.raise();
    label_2.raise();
    label_3.raise();
    label_4.raise();
    label_5.raise();


    // defs and pictures
    defs = svg.append('svg:defs');
    var config = {
      "avatar_size": avatar_size //define the size of the circle radius
    }
    data.forEach(function(d, i) {
      defs.append("svg:pattern")
        .attr("id", "grump_avatar" + d.id)
        .attr("width", "100%") 
        .attr("height", "100%")
        .attr("patternUnits", "objectBoundingBox")
        .append("svg:image")
        .attr("xlink:href", "img/" + d.id + ".png")
        .attr("width", config.avatar_size)
        .attr("height", config.avatar_size)
        .attr("preserveAspectRatio", "none")
        .attr("x", 0)
        .attr("y", 0);   
    });

    var nodes = scatter.selectAll('.g')
        .data(data)
        .enter()
        .append('g')
        .attr("class", "nodes")
        .attr("id", function(d){ return d.id})
        .attr("transform", function(d){
                return "translate(" + xScale(d.x_coord) + "," + (h - yScale(d.y_coord)) + ")"
        })
        .style('display', 'inline')
        .on("mouseover", function(){
            d3.select(this).raise(); // pull to top
            d3.select(this).select('.circle').style("stroke", "rgba(150,255,255)"); // circle gets cyan outline
            d3.select(this).select('.headLabels').style("fill", "black"); // show label (in black)
        })
        .on("mouseout", function(){
            d3.select(this).select('.circle').style("stroke", "whitesmoke"); // return to white outline
            d3.select(this).select('.headLabels').style("fill", "none");
        });
        

    nodes.append("circle")
        .attr("id", function(d){ return d.id})
        .attr("class", "circle")
        .style("fill", function(d){ return "url(#grump_avatar" + d.id})
        .attr("r", circle_radius);
        
    nodes.append("text")
        .attr("dx", 0)
        .attr("dy", text_placement)
        .attr("class", "headLabels")
        .html(function(d) { return d.character_space });
});

function highlight_nodes_by_show(show) {
    if (show == 'all') {
        d3.selectAll('.nodes').style('opacity', 1);
        return;
    }
    d3.selectAll('.nodes').style('opacity', 0.25);
    d3.selectAll('.nodes').filter(function(d){ return d.show == show }).style('opacity', 1).raise();
}

// instructions currently only sized and optimized for larger screens
if (screen.width > 600) {
    // drop shadow effect
    var shadow_defs = svg.append("defs");
    var filter = shadow_defs.append("filter")
        .attr("id", "drop-shadow")
        .attr("height", "120%");
    var feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode")
        .attr("in", "offsetBlur")
    feMerge.append("feMergeNode")
        .attr("in", "SourceGraphic");
}