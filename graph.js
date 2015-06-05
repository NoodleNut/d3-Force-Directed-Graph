var width = 960,
    height = 500;

var color = d3.scale.category20b(); //gets a list of preselected colours

var force = d3.layout.force() //Constructs a new force-directed layout 
    .charge(-120)
    .linkDistance(30)
    .size([width, height]);

var svg = d3.select("body").append("svg") //add container element called <svg>
    .attr("width", width)
    .attr("height", height);

d3.json("miserables.json", function(error, graph) { //starts the graph
    force
        .nodes(graph.nodes) //first element
    .links(graph.links) //second element in each object in the json file
    .start();

    var link = svg.selectAll(".link") //enter the links
        .data(graph.links)
        .enter().append("line")
        .attr("class", "link")
        .style("stroke-width", function(d) { //stroke width based on group attr
            return Math.sqrt(d.value);
        });

    var node = svg.selectAll(".node") //enter the nodes
        .data(graph.nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", 5)
        .style("fill", function(d) {
            return color(d.group);
        })
        .call(force.drag);

    node.append("title") //sets each node's title to be the name attr
    .text(function(d) {
        return d.name;
    });

    //updates x and y coordinates of nodes and links for movement
    force.on("tick", function() {
        link.attr("x1", function(d) {
            return d.source.x;
        })
            .attr("y1", function(d) {
                return d.source.y;
            })
            .attr("x2", function(d) {
                return d.target.x;
            })
            .attr("y2", function(d) {
                return d.target.y;
            });

        node.attr("cx", function(d) {
            return d.x;
        })
            .attr("cy", function(d) {
                return d.y;
            });
    });
});