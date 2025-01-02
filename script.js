// Load the network data
d3.json("network.json").then(function(data) {
    const width = window.innerWidth;
    const height = window.innerHeight;
  
    // Create an SVG element to contain the graph
    const svg = d3.select("#graph")
      .append("svg")
      .attr("width", width)
      .attr("height", height);
  
    // Create a simulation for the nodes and edges
    const simulation = d3.forceSimulation(data.nodes)
      .force("link", d3.forceLink(data.edges).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2));
  
    // Add links (edges) to the graph
    const links = svg.append("g")
      .selectAll(".link")
      .data(data.edges)
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("stroke-width", 2)
      .attr("stroke", "#aaa");
  
    // Add nodes to the graph
    const nodes = svg.append("g")
      .selectAll(".node")
      .data(data.nodes)
      .enter()
      .append("circle")
      .attr("class", "node")
      .attr("r", 10)
      .attr("fill", "#1f77b4")
      .call(d3.drag()
        .on("start", dragstart)
        .on("drag", dragging)
        .on("end", dragend));
  
    // Add labels to the nodes
    svg.append("g")
      .selectAll(".label")
      .data(data.nodes)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", 12)
      .attr("y", 4)
      .text(d => d.label);
  
    // Update the simulation at each tick
    simulation.on("tick", function() {
      links
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
  
      nodes
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
  
      svg.selectAll(".label")
        .attr("x", d => d.x)
        .attr("y", d => d.y);
    });
  
    // Drag functions
    function dragstart(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }
  
    function dragging(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }
  
    function dragend(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }
  });
  