function drawHeatmap(){

    // set the dimensions and margins of the graph
    if (screen.width < 600){
        var margin = {top: 10, right: 10, bottom: 10, left: 10},
        width = window.innerWidth - margin.left - margin.right,
        height = w,
        padding = 10;
    }
    else{
        var margin = {top: 10, right: 10, bottom: 10, left: 10},
        height = (window.innerHeight / 2) - margin.top - margin.bottom,
        width = height,
        height = width,
        padding = 10;
    }

    d3.csv("data/user_submitted_data.csv", function(error, data) {
        if (error) throw error;

    //data = data.filter(function(d) { return d.id == id });

    //scale functions
    var xScale = d3.scaleLinear()
        .domain([-1000, 1000])
        .range([padding, width - padding]);
    var yScale = d3.scaleLinear()
        .domain([-1000, 1000])
        .range([height - padding, padding]);

    // define axes
    var xAxis = d3.axisBottom().scale(xScale).ticks(0).tickSize(0);
    var yAxis = d3.axisLeft().scale(yScale).ticks(0).tickSize(0);

    var svg = d3.select("#heatmap")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "heatmap_svg");
    
    // draw arrow tips on axes
    svg.append("path")
        .attr("transform", "translate(0," + ((height/2) + 0) + ") rotate(180)")
        .attr("d", "M-5,0 L-10,5 L-10,-5 Z")
    svg.append("path")
        .attr("transform", "translate(" + (width - 0) + "," + ((height/2) + 0) + ") rotate(0)")
        .attr("d", "M-5,0 L-10,5 L-10,-5 Z")
    svg.append("path")
        .attr("transform", "translate(" + ((width/2) - 0) + ", 0) rotate(270)")
        .attr("d", "M-5,0 L-10,5 L-10,-5 Z")
    svg.append("path")
        .attr("transform", "translate(" + ((width/2) - 0) + "," + (height) + ") rotate(90)")
        .attr("d", "M-5,0 L-10,5 L-10,-5 Z")

    // draw x axis
    svg.append("g")
        .attr("class", "axis")	
        .attr("transform", "translate(0," + ((height/2) + 0) + ")")
        .call(xAxis);
    // draw y axis
    svg.append("g")
        .attr("class", "axis")	
        .attr("transform", "translate(" + ((width/2) - 0) + ", 0)")
        .call(yAxis)

    var heatmap = svg.append('g')
    .attr("clip-path", "url(#clip)");

    // add axis labels
    label_1 = heatmap.append("text")
        .attr("x", ((width/2) - 0))
        .attr("y", yScale(750))
        .text("Good")
        .attr("class", "mini-y-axis-label");
    label_2 = heatmap.append("text")
        .attr("x", xScale(750))
        .attr("y", ((height/2) + 0))
        .text("Chaotic")
        .attr("class", "mini-x-axis-label");
    label_3 = heatmap.append("text")
        .attr("x", ((width/2) - 0))
        .attr("y", yScale(-750))
        .text("Evil")
        .attr("class", "mini-y-axis-label");
    label_4 = heatmap.append("text")
        .attr("x", xScale(-750))
        .attr("y", ((height/2) + 0))
        .text("Lawful")
        .attr("class", "mini-x-axis-label");
    label_5 = heatmap.append("text")
        .attr("x", ((width/2) - 0))
        .attr("y", ((height/2) + 0))
        .text("Neutral")
        .attr("class", "mini-x-axis-label");

    // obtain the text element's bounding box and Current Transformation Matrix
    bbox_1 = label_1["_groups"][0][0].getBBox()
    bbox_2 = label_2["_groups"][0][0].getBBox()
    bbox_3 = label_3["_groups"][0][0].getBBox()
    bbox_4 = label_4["_groups"][0][0].getBBox()
    bbox_5 = label_5["_groups"][0][0].getBBox()

    // insert a rect beneath the text, to represent the bounding box
    heatmap.append('rect')
        .attr('x', bbox_1.x - 5)
        .attr('y', bbox_1.y - 5)
        .attr('width', bbox_1.width + 10)
        .attr('height', bbox_1.height + 10)
        .attr("class", "mini-halo")
    heatmap.append('rect')
        .attr('x', bbox_2.x - 5)
        .attr('y', bbox_2.y - 5)
        .attr('width', bbox_2.width + 10)
        .attr('height', bbox_2.height + 10)
        .attr("class", "mini-halo")
    heatmap.append('rect')
        .attr('x', bbox_3.x - 5)
        .attr('y', bbox_3.y - 5)
        .attr('width', bbox_3.width + 10)
        .attr('height', bbox_3.height + 10)
        .attr("class", "mini-halo")
    heatmap.append('rect')
        .attr('x', bbox_4.x - 5)
        .attr('y', bbox_4.y - 5)
        .attr('width', bbox_4.width + 10)
        .attr('height', bbox_4.height + 10)
        .attr("class", "mini-halo")
    heatmap.append('rect')
        .attr('x', bbox_5.x - 5)
        .attr('y', bbox_5.y - 5)
        .attr('width', bbox_5.width + 10)
        .attr('height', bbox_5.height + 10)
        .attr("class", "mini-halo")

    // pull labels above the rectangles
    label_1.raise();
    label_2.raise();
    label_3.raise();
    label_4.raise();
    label_5.raise();
    
    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 8)
        .attr("cx", function(d) { return xScale(d.x_coord); })
        .attr("cy", function(d) { return yScale(-d.y_coord); });

    updateHeatmap(22);
    });
}

function updateHeatmap(id){

    // clear the heatmap
    d3.selectAll(".dot").remove();

    // set the dimensions and margins of the graph
    if (screen.width < 600){
        var margin = {top: 10, right: 10, bottom: 10, left: 10},
        width = window.innerWidth - margin.left - margin.right,
        height = w,
        padding = 10;
    }
    else{
        var margin = {top: 10, right: 10, bottom: 10, left: 10},
        height = (window.innerHeight / 2) - margin.top - margin.bottom,
        width = height,
        height = width,
        padding = 10;
    }
    
    d3.csv("data/user_submitted_data.csv", function(error, data) {
        if (error) throw error;

    data = data.filter(function(d) { return d.id == id });

    //scale functions
    var xScale = d3.scaleLinear()
        .domain([-1000, 1000])
        .range([padding, width - padding]);
    var yScale = d3.scaleLinear()
        .domain([-1000, 1000])
        .range([height - padding, padding]);

    var svg = d3.select(".heatmap_svg");
    
    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 5)
        .attr("cx", function(d) { return xScale(d.x_coord); })
        .attr("cy", function(d) { return yScale(-d.y_coord); });

    });
}

drawHeatmap();

//document.getElementById("names").addEventListener("change", drawHeatmap);
