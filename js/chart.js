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
    w = document.getElementById("scatter").offsetWidth - margin.left - margin.right,
    h = w,
    padding = 10;

    // position select and button to line up with top of alignment chart
    document.getElementById("selectDiv").style.marginTop = (h/4) + "px";
    document.getElementById("button").style.marginTop = (h/4) + "px";

    var avatar_size = 60,
    circle_radius = 30,
    text_placement = 35;
}

//create svg elements
var svg_0 = d3.select("#scatter")
    .append("svg")
    .attr("width", w)
    .attr("height", h/4);

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr("class", "scatter")
    .attr("overflow", "visible");

//Read the data
d3.csv("data/data.csv", function(data) {

    // check if any data in saved in local storage
    var saved_data = JSON.parse(sessionStorage.getItem("alignment_chart_data"));
    
    if (saved_data != null){ // they've visited before
        // overwrite data.csv with sessionStorage data
        console.log("Using session storage data");
        data = saved_data;
    }
    else { // first time on page
        // get list of unique show values
        var shows = d3.map(data, function(d){return d.show;}).keys();

        // loop over each show
        for (show=0; show<shows.length; show++){
            // filter data to just one show
            var show_data = data.filter(function(d){ return d.show == shows[show]; })

            // Set starting x coord of each character, considering # of characters in each show and best spread out across svg width
            var space =  2000 / show_data.length;
            for (i=0; i<show_data.length; i++){
                // find characters in this show, space them out evenly
                data[show_data[i].id].x_coord = -1000 + (i * space) + (space/2);
            };
        }

        // save to local storage for future session
        window.sessionStorage.setItem('alignment_chart_data',JSON.stringify(data));
    }

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
            if (d.storedLocally == "0"){
                // if a character hasn't been placed yet, shift into starting location
                return "translate(" + xScale(1200) + "," + (h - (h/8) - yScale(d.y_coord)) + ")"
            }
            else{
                // character was placed in previous session
                return "translate(" + xScale(d.x_coord) + "," + (h - yScale(d.y_coord)) + ")"
            }
        })
        .style('display', function(d){
            if (d.storedLocally == "0"){
                // if a character hasn't been placed yet
                return "inline";
            }
            else{
                // character was placed in previous session
                return "inline";
            }
        })
        .on("mouseover", function(){
            d3.select(this).raise(); // pull to top
            d3.select(this).select('.circle').style("stroke", "rgba(150,255,255)"); // circle gets cyan outline
            d3.select(this).select('.headLabels').style("fill", "black"); // show label (in black)
        })
        .on("mouseout", function(){
            d3.select(this).select('.circle').style("stroke", "whitesmoke"); // return to white outline
            d3.select(this).select('.headLabels').style("fill", "none");
        })
        .call(d3.drag()
            .on("drag", dragged)
            .on("end", dragended));

    nodes.append("circle")
        .attr("id", function(d){ return d.id})
        .attr("class", "circle")
        .style("fill", function(d){ return "url(#grump_avatar" + d.id})
        .attr("r", circle_radius);
        
    nodes.append("text")
        .attr("dx", 0)
        .attr("dy", text_placement)
        .attr("class", "headLabels")
        .html(function(d) { return d.character });

    // define drag behavior
    function dragged(event, d) {

        d3.select(this).attr("transform", "translate(" + (d3.event.x) + "," 
            + (d3.event.y) + ")");
    }
    function dragended(event, d) {

        // get translated x,y coordinates (drag position)
        var transform_string = d3.select(this).attr("transform");
        var translate = transform_string.substring(transform_string.indexOf("(")+1, transform_string.indexOf(")")).split(",");

        // update data
        var data_row = d3.select(this).data()[0];
        data_row.storedLocally = "1"; 

        // if they dropped the circle to left or right of grid, move it back onto the grid
        var x_loc = translate[0];
        if (x_loc < 0){
            x_loc = 0;
            d3.select(this)
            .transition().duration(500)
            .attr("transform", "translate(" + 0 + "," + translate[1] + ")");
        }
        else if (x_loc > w){
            x_loc = w;
            d3.select(this)
            .transition().duration(500)
            .attr("transform", "translate(" + w + "," + translate[1] + ")");
        }

        // if they dropped the circle above the grid, 'reset' it and move it to holding location
        var y_loc = translate[1];
        if (y_loc < 0){
            // this y_loc value ensures that -1000 will be saved in the y_coord value later in this function
            y_loc = yScale(1000);

            // reset storedLocally variable
            var data_row = d3.select(this).data()[0];
            data_row.storedLocally = "0"; 

            // reset circle's location (back to start)
            d3.select(this)
            .transition().duration(500)
            .attr("transform", "translate(" + x_loc + "," + (h - (h/8) - yScale(-1000)) + ")");
        }
        // if they dropped the circle below the grid, move it back onto the grid
        else if (y_loc > h){
            y_loc = h;
            d3.select(this)
            .transition().duration(500)
            .attr("transform", "translate(" + x_loc + "," + h + ")");
        }

        // update coordinates
        // need to scale.invert() so that when the scale is applied in a future page load, they cancel each other out
        // same reason for -yScale, to cancel out circle cy placement being "return h - yScale(d.y_coord)" 
        data_row.x_coord = xScale.invert(x_loc); 
        data_row.y_coord = -yScale.invert(y_loc);
        
        // save to local storage for future session
        window.sessionStorage.setItem('alignment_chart_data',JSON.stringify(data));

        // enable submit answers button
        document.getElementById("button").disabled = false;
    }

    // jQuery listen for button click, use ajax to send data variable to php script
    $("#button").click(function(){

        alert("Submission received; thank you!");

        // remove drag ability
        nodes.call(d3.drag()).on("start", null);

        // update buttons
        document.getElementById("button").disabled = true;
        document.getElementById("button").style.display = "none";
        document.getElementById("everyone_results").innerHTML = "All Ratings";
        document.getElementById("your_results").disabled = false;
        document.getElementById("your_results").style.display = "inline-block";

        // subset data to only characters they rated
        var submission = data.filter(function(value, index){ return data[index].storedLocally == "1";});

        // email they data to me
        $.ajax({
            url: 'php.php', 
            type: "POST",
            dataType:'text', 
            data: ({'user_submission': JSON.stringify(submission)}),
            success: function(data){
                console.log("Submission successful");
            }
        });
        
        // show highlight selector, hide reset button, disable badges' click function
        document.getElementById("highlighter").style.display = 'block';
        document.getElementById("resetButton").style.display = 'none';
        document.querySelectorAll('.badge').forEach(d => {
            d.onclick = null;
            d.style.backgroundColor = 'gray';
        });
    });

    // listen for click of reset button
    $("#resetButton").click(function() {
        window.sessionStorage.removeItem('alignment_chart_data');
        location.reload();
    });

    function skipToResults() {
        // update buttons
        document.getElementById("button").disabled = true;
        document.getElementById("button").style.visibility = "hidden";

        // remove drag behavior
        nodes.call(d3.drag()).on("start", null);

        call_user_data(data);

        // show highlight selector, hide reset button, disable badges' click function
        document.getElementById("highlighter").style.display = 'block';
        document.getElementById("resetButton").style.display = 'none';
        document.querySelectorAll('.badge').forEach(d => {
            d.onclick = null;
            d.style.backgroundColor = 'gray';
        });
    }

    // listen for when "show all results" button is clicked
    $("#everyone_results").click(function() {
        skipToResults();
    });
    $("#skipLink").click(function() {
        skipToResults();
    });

    // listen for when "show your results" button is clicked
    $("#your_results").click(function(){

        // remove drag behavior
        nodes.call(d3.drag()).on("start", null);

        call_current_session_data();
    });

    // load first show's characters
    slideIn('AD');

});

// ANIMATION FUNCTIONS

var select_value = document.getElementById("select").value;

// function to swap out characters when user uses select object
function slideOut() {
    // grab nodes currently displayed: all nodes of show select_value
    // grab all nodes with storedLocally value of 0 (has not been moved by user)
    var nodes = d3.selectAll('.nodes').filter(function(d) { return d.storedLocally == 0; })

    if (nodes.size() == 0){
        return;
    }

    // get y transform value of these nodes
    var transform_string = d3.select(nodes["_groups"][0][0]).attr("transform");
    var translate = transform_string.substring(transform_string.indexOf("(")+1, transform_string.indexOf(")")).split(",");
    var y_loc = translate[1];

    // start transitions
    nodes
        // transition 1: turn off opacity
        .transition()
        .duration(500)
        .ease(d3.easeLinear)
        .style("opacity", 0)
        // transition 2: turn off display
        .transition().duration(0)
        .style('display', 'none')
        // transition 3: return to starting location
        .transition().duration(0).delay(0)
        .attr("transform", function(d){return "translate(" + xScale(1200) + "," + y_loc + ")"});
}

function slideIn(newShow) {

    // grab all nodes of new show and storedLocally value == 0 (has not been moved by user)
    var nodes = d3.selectAll('.nodes').filter(function(d){ return d.show == newShow && d.storedLocally == 0; })

    // get y transform value of these nodes
    var transform_string = d3.select(nodes["_groups"][0][0]).attr("transform");
    var translate = transform_string.substring(transform_string.indexOf("(")+1, transform_string.indexOf(")")).split(",");
    var y_loc = translate[1];

    // turn on display then slide onto svg
    nodes
        .style("opacity", 1)
        .transition().duration(0)
        .style('display', 'inline')
        .transition()
        .duration(function(d,i){return Math.abs(300 * ((i)-nodes.size()))})
        .delay(function(d,i){return 300 * (i+1)})
        .ease(d3.easeLinear)
        .attr("transform", function(d){return "translate(" + xScale(d.x_coord) + "," + y_loc + ")"});
}

function animationSwap(newShow) {
    slideOut(); // remove old characters
    slideIn(newShow); // bring in new characters

    // overwrite select_value var
    select_value = document.getElementById("select").value;
}

function call_user_data(session_data) { // reads csv and updates node positions based on previous submissions

    // import data from csv
    d3.csv("./data/user_submitted_data.csv", function(previously_submitted_data) {

        // filter to characters moved this session
        session_data = session_data.filter(function(d) {return d.storedLocally != "0";});
        // tack the session data on to the user_submitted_data csv so their answers are included in averages
        var data = previously_submitted_data.concat(session_data);

        // group the data
        var sumstat = d3.nest() // nest function allows to average the coordinates of each character
        .key(function(d) { return d.id;})
        .rollup(function(d) {
            return {
                x_coord: d3.mean(d, function(e) { return e.x_coord; }),
                y_coord: d3.mean(d, function(e) { return e.y_coord; })
            };
          })
        .entries(data);

        d3.selectAll(".nodes")
        .each(function() { // loop over each node
            var id = d3.select(this).attr("id"); // save id of node
            d3.select(this).transition()
                .duration(1000)
                .style('display', 'inline')
                .style('visibility', 'visible')
                .style('opacity', '1')
                .attr("transform", function() {
                    // find matching row in sumstat data; return that character's average coords
                    var x_coord = sumstat.filter(function(d) {return d.key == id;})[0].value.x_coord;
                    var y_coord = sumstat.filter(function(d) {return d.key == id;})[0].value.y_coord;
                    return "translate(" + xScale(x_coord) + "," + yScale(-y_coord) + ")"}); 
        })
        // put the characters they know on top
        .filter(function(d, i){
            return d.storedLocally == "1";
        }).raise();
    
    });

    return;
}

function call_current_session_data(){ // return node positions to where user placed them this session

        d3.selectAll(".nodes")
            .transition()
            .duration(1000)
            .style('display', 'inline')
            .style('opacity', function(d){ // hide node if user didn't place them
                if (d.storedLocally == "0"){
                    return '0';
                }
                else if (d.storedLocally == "1"){
                    return '1';
                }
            })
            .filter(function(d, i){ 
                return d.storedLocally == "1";
            })
            .attr("transform", function(d) {
                return "translate(" + xScale(d.x_coord) + "," + yScale(-d.y_coord) + ")";
            }); 

    return;
}

function highlight_nodes_by_show(show) {
    if (show == 'all') {
        d3.selectAll('.nodes').style('opacity', 1);
        return;
    }
    d3.selectAll('.nodes').style('opacity', 0.25);
    d3.selectAll('.nodes').filter(function(d){ return d.show == show }).style('opacity', 1).raise();
}

// instructions currently only sized and optimized for larger screens
if (screen.width > 600){

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