function drawHeatmap() {

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

        // on page load, start by showing Andy Bernard's data
        updateHeatmap(22);
    
        // pass this data onto superlatives() function, which will find the top good, evil, lawful, chaotic characters
        superlatives(data);

        // todo: add a function which will measure agreement/disagreement/variation among user submissions
    });
}

function updateHeatmap(id) {

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

function superlatives(data) {
    // group user submitted data by character name and find each character's average coordinate scores
    const dict = d3.nest()
        .key(function(d) { return d.id; })
        .rollup(function(v) { return {
                'lawfulChaotic': d3.mean(v, function(d) { return d.x_coord; }),
                'goodEvil': d3.mean(v, function(d) { return d.y_coord; }), 
            }
        })
        .entries(data);

    // Create characters array
    var characters = Object.keys(dict).map(function(key) {
        return [key, dict[key]];
    });
    
    // 5 most evil characters
    characters.sort(function(first, second) {
        return second[1].value.goodEvil - first[1].value.goodEvil;
    });
    const evilCharacters = characters.slice(0, 5);
    const mostEvil = evilCharacters.map(x => x[1].key);
    mostEvil.forEach((id, i) => {
        document.getElementById("evilCharacter" + i).src = "img/" + id + ".png";
    });

    // 5 most good characters
    characters.sort(function(first, second) {
        return first[1].value.goodEvil - second[1].value.goodEvil;
    });
    const goodCharacters = characters.slice(0, 5);
    const mostGood = goodCharacters.map(x => x[1].key);
    mostGood.forEach((id, i) => {
        document.getElementById("goodCharacter" + i).src = "img/" + id + ".png";
    });

    // 5 most chaotic characters
    characters.sort(function(first, second) {
        return second[1].value.lawfulChaotic - first[1].value.lawfulChaotic;
    });
    const mostChaotic = characters.slice(0, 5).map(x => x[1].key);
    mostChaotic.forEach((id, i) => {
        document.getElementById("chaoticCharacter" + i).src = "img/" + id + ".png";
    });

    // 5 most lawful characters
    characters.sort(function(first, second) {
        return first[1].value.lawfulChaotic - second[1].value.lawfulChaotic;
    });
    const lawfulCharacters = characters.slice(0, 5).map(x => x[1].key);
    lawfulCharacters.forEach((id, i) => {
        document.getElementById("lawfulCharacter" + i).src = "img/" + id + ".png";
    });

    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

    // combine the most good and most evil characters. Use reverse to make sure the 'most' characters are on top.
    const goodEvilData = goodCharacters.reverse().concat(evilCharacters.reverse());
    console.log(goodEvilData);

    // append the svg object to the body of the page
    var svg = d3.select("#evilGoodAxis")
    .append("svg")
    .attr("class", "summary")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    var x = d3.scaleLinear()
        .domain([-1000, 1000])
        .range([ 0, width ]);
        svg.append("g")
        .attr("transform", "translate(" + 0 + "," + height + ")")
        .call(d3.axisBottom(x));

    // defs and pictures
    var  defs = svg.append('svg:defs');
    var config = {
      "avatar_size": 48 // define the size of the circle radius
    }
    goodEvilData.forEach(function(d, i) {
      defs.append("svg:pattern")
        .attr("id", "grump_avatar" + d[1].key)
        .attr("width", "100%") 
        .attr("height", "100%")
        .attr("patternUnits", "objectBoundingBox")
        .append("svg:image")
        .attr("xlink:href", "img/" + d[0] + ".png")
        .attr("width", config.avatar_size)
        .attr("height", config.avatar_size)
        .attr("preserveAspectRatio", "none")
        .attr("x", 0)
        .attr("y", 0);   
    });

    defs.append("svg:pattern")
        .attr("id", "grump_avatar")
        .attr("width", config.avatar_size)
        .attr("height", config.avatar_size)
        .attr("patternUnits", "userSpaceOnUse")
        .append("svg:image")
        .attr("xlink:href", 'img/81.png')
        .attr("width", config.avatar_size)
        .attr("height", config.avatar_size)
        .attr("x", 0)
        .attr("y", 0);

    // Add dots
    var circles = svg.append('g')
        .selectAll("dot")
        .data(goodEvilData)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d[1].value.goodEvil); } )
        .attr("cy", function (d) { return height / 2 } )
        .attr("r", config.avatar_size / 2)
        .attr("class", "summaryDot")
        .style("fill", function(d){ console.log(d); return "url(#grump_avatar" + d[1].key})
        .on('mouseover', function() { d3.select(this).raise(); });


}

function variance(data) {
    // console.log(d3.deviation(data, d => d.y_coord));
    // console.log(d3.deviation(data, d => d.x_coord));
}
