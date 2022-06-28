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
else{
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

   //saved_data =[{"show":"UA","character":"Sir Reginald Hargreeves","x_coord":-633.0376940133037,"y_coord":196.52771531489861,"storedLocally":"1","id":"0"},{"show":"UA","character":"Pogo","x_coord":-395.7871396895787,"y_coord":-270.5774809184828,"storedLocally":"1","id":"1"},{"show":"UA","character":"Grace","x_coord":-324.8337028824834,"y_coord":-500.8406388132195,"storedLocally":"1","id":"2"},{"show":"UA","character":"Luther Hargreeves","x_coord":-608.6474501108647,"y_coord":-551.2792353044476,"storedLocally":"1","id":"3"},{"show":"UA","character":"Diego Hargreeves","x_coord":-7.760532150776044,"y_coord":-386.8055510939214,"storedLocally":"1","id":"4"},{"show":"UA","character":"Allison Hargreeves","x_coord":65.4101995565411,"y_coord":-206.98098969041257,"storedLocally":"1","id":"5"},{"show":"UA","character":"Klaus Hargreeves","x_coord":777.161862527716,"y_coord":-628.0336212693599,"storedLocally":"1","id":"6"},{"show":"UA","character":"Number Five","x_coord":630.820399113082,"y_coord":-29.349410743044132,"storedLocally":"1","id":"7"},{"show":"UA","character":"Ben Hargreeves","x_coord":515.5210643015521,"y_coord":-257.4195861816406,"storedLocally":"1","id":"8"},{"show":"UA","character":"Vanya Hargreeves","x_coord":936.8070953436807,"y_coord":-60.051165129009064,"storedLocally":"1","id":"9"},{"show":"UA","character":"The Handler","x_coord":-633.0376940133037,"y_coord":626.3524105674344,"storedLocally":"1","id":"10"},{"show":"C","character":"Jeff Winger","x_coord":-216.18625277161857,"y_coord":-132.41958618164062,"storedLocally":"1","id":"64"},{"show":"C","character":"Britta Perry","x_coord":200.6651884700666,"y_coord":18.89620329204365,"storedLocally":"1","id":"65"},{"show":"C","character":"Abed Nadir","x_coord":384.7006651884701,"y_coord":-307.8581826728687,"storedLocally":"1","id":"66"},{"show":"C","character":"Troy Barnes","x_coord":923.5033259423503,"y_coord":-255.22660372550035,"storedLocally":"1","id":"67"},{"show":"C","character":"Annie Edison","x_coord":171.84035476718418,"y_coord":-312.24414758514945,"storedLocally":"1","id":"68"},{"show":"C","character":"Shirley Bennett","x_coord":-227.27272727272725,"y_coord":-406.5423931991845,"storedLocally":"1","id":"69"},{"show":"C","character":"Pierce Hawthorne","x_coord":-16.629711751662967,"y_coord":420.2120596902412,"storedLocally":"1","id":"70"},{"show":"C","character":"Craig Pelton","x_coord":462.3059866962308,"y_coord":111.00153337445181,"storedLocally":"1","id":"71"},{"show":"C","character":"Ben Chang","x_coord":956.7627494456763,"y_coord":575.9138140762061,"storedLocally":"1","id":"72"},{"show":"LA","character":"Aang","x_coord":586.4745011086475,"y_coord":-792.5073054798862,"storedLocally":"1","id":"73"},{"show":"LA","character":"Katara","x_coord":-1.1086474501108796,"y_coord":-645.5774809184827,"storedLocally":"1","id":"74"},{"show":"LA","character":"Sokka","x_coord":382.48337028824835,"y_coord":-645.5774809184827,"storedLocally":"1","id":"75"},{"show":"LA","character":"Toph","x_coord":-80.93126385809308,"y_coord":-413.12134056760556,"storedLocally":"1","id":"76"},{"show":"LA","character":"Zuko","x_coord":-395.7871396895787,"y_coord":-42.50730547988621,"storedLocally":"1","id":"77"},{"show":"LA","character":"Iroh","x_coord":-593.1263858093126,"y_coord":-737.6827440763775,"storedLocally":"1","id":"78"},{"show":"LA","character":"Azula","x_coord":792.6829268292684,"y_coord":744.7733293499864,"storedLocally":"1","id":"79"},{"show":"LA","character":"Appa","x_coord":-16.629711751662967,"y_coord":16.703220835903267,"storedLocally":"1","id":"80"},{"show":"LA","character":"Momo","x_coord":865.8536585365855,"y_coord":-899.9634458307635,"storedLocally":"1","id":"81"}]  
    
    if (saved_data != null){ // they've visited before
        // overwrite data.csv with sessionStorage data
        console.log("Using session storage data");
        data = saved_data;
    }
    else{ // first time on page
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

    console.log(data);

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
        
        // apply blur filter - remove after they click through instructions with d3.selectAll("circle").style("filter", "none")
        defs.append("filter")
        .attr("id", "blur") //Give it a unique ID
        .append("feGaussianBlur") //Append a filter technique
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
        .on("mouseover", function(d){
            d3.select(this).raise(); // pull to top
            d3.select(this).select('.circle').style("stroke", "rgba(150,255,255)"); // circle gets cyan outline
            d3.select(this).select('.headLabels').style("fill", "black"); // show label (in black)
        })
        .on("mouseout", function(){
            d3.select(this).select('.circle').style("stroke", "whitesmoke"); // return to white outline
            d3.select(this).select('.headLabels').style("fill", "none");
        })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    nodes.append("circle")
        .attr("id", function(d){ return d.id})
        .attr("class", "circle")
        .style("filter", "url(#blur)")
        .style("fill", function(d){ return "url(#grump_avatar" + d.id})
        .attr("r", circle_radius);
        
    nodes.append("text")
        .attr("dx", 0)
        .attr("dy", text_placement)
        .attr("class", "headLabels")
        .html(function(d) { return d.character });

    // define drag behavior
    function dragstarted(event, d) {
        //d3.select(this).select('.circle').style("stroke", "red");
    }
    function dragged(event, d) {

        // if they haven't clicked through instructions yet, no dragging is allowed yet
        if (allow_dragging == 0){
            return;
        }
        d3.select(this).attr("transform", "translate(" + (d3.event.x) + "," 
            + (d3.event.y) + ")");
    }
    function dragended(event, d) {
        
        // if they haven't clicked through instructions yet, no dragging is allowed yet
        if (allow_dragging == 0){
            return;
        }
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
        document.getElementById("button").style.visibility = "hidden";
        document.getElementById("everyone_results").innerHTML = "All Ratings";
        document.getElementById("your_results").disabled = false;
        document.getElementById("your_results").style.visibility = "visible";

        // subset data to only characters they rated
        var submission = data.filter(function(value, index){ return data[index].storedLocally == "1";});

        // email they data to me
        $.ajax({
            url: 'php.php', 
            type: "POST",
            dataType:'text', 
            data: ({'user_submission': JSON.stringify(submission)}),
            success: function(data){
                console.log("POST successful");
            }
        });
        
        // selector now has new purpose
        document.querySelector("select").style.boxShadow = "0px 0px 20px 2.5px cyan";
        document.getElementById("select").onchange = highlight_nodes_by_show;
        document.getElementById("legend").innerHTML = "Highlight A Show";
    });

    // listen for when "show all results" button is clicked
    $("#everyone_results").click(function() {
        d3.select("#instructions").remove(); // remove instructions
        // update buttons
        document.getElementById("button").disabled = true;
        document.getElementById("button").style.visibility = "hidden";

        // remove drag behavior
        nodes.call(d3.drag()).on("start", null);

        call_user_data(data);

        // selector now has new purpose
    });

    // listen for when "show your results" button is clicked
    $("#your_results").click(function(){

        // remove drag behavior
        nodes.call(d3.drag()).on("start", null);

        call_current_session_data();
    });

    // load first show's characters
    slideIn('AD');

    d3.select("#instructions").raise();
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

function call_user_data(session_data){ // reads csv and updates node positions based on previous submissions

    // import data from csv
    d3.csv("./data/user_submitted_data.csv", function(previously_submitted_data){

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
        .each(function(){ // loop over each node
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
    
    })

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

// this variable is checked in the drag functions and is turned 'on' in instructions functions below
allow_dragging = 0;

var g = svg
    .append("g")
    .attr("id", "instructions")
    .attr("transform", function(d) {return "translate(" + 200 + "," + -200 + ")";})
    .on("click", function(){step_2()});

g.append("rect").attr("id","instructionsRect").attr("class","instruction1").style("filter", "url(#drop-shadow)");

g.append("text")
    .attr("id", "instructionsText")
    .attr("class", "instructionText")
    .attr("x", 200)
    .attr("y", 50)
    .html("&uarr; Click on the show names above to see their characters. Ignore shows you haven't seen.")
    .call(wrap, 400);

g.append("text")
    .attr("id", "closeInstructions")
    .attr("class", "instructionText")
    .attr("x", 15)
    .attr("y", 15)
    .html("&#x24E7;");

function step_2(){

    // remove blur
    d3.selectAll("circle").style("filter", "none");

    // add drag behavior (this global variable is checked in the drag functions)
    allow_dragging = 1;

    // move box
    d3.select("#instructions")
    .on("click", function(){step_3()}) // new function on click
    .transition()
    .duration(1000)
    .attr("transform", function(d) {return "translate(" + (xScale(0) - 200) + "," + -30 + ")";});

    // rewrite text
    d3.select("#instructionsText").html("Drag characters onto the chart to categorize them").call(wrap, 400);;
    
}

function step_3(){
    
    // move box
    d3.select("#instructions")
    .on("click", function(){
        d3.select(this).remove();
    })
    .transition()
    .duration(1000)
    .attr("transform", function(d) {return "translate(" + (xScale(1000) - 300) + "," + 10 + ")";});

    // rewrite text
    d3.select("#instructionsText").html("Submit your answers once you've finished arranging for all shows.").call(wrap, 400);
}

function wrap(text, width) {
    text.each(function() {
      var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          y = text.attr("y"),
          dy = 0,
          x = text.attr("x")
          tspan = text.text(null).append("tspan").attr("y", y).attr("dy", dy + "em")
      while (word = words.pop()) {
        line.push(word)
        tspan.text(line.join(" "))
        if (tspan.node().getComputedTextLength() > width) {
          line.pop()
          tspan.text(line.join(" "))
          line = [word]
          tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", `${++lineNumber * lineHeight + dy}em`).text(word)
        }
      }
    })
  }

}
else{
    allow_dragging = 1;
}