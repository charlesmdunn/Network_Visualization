d3.json("network.json").then(function(data) {
  console.log("Loaded data:", data);

  if (!data || !data.nodes || !data.edges) {
    console.error("Error: Invalid data structure. Please ensure the JSON contains 'nodes' and 'edges' arrays.");
    return;
  }

  // Set up the width and height for the graph
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Create an SVG container for D3.js
  const svg = d3.select("#graph")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // Create links (edges) first
  const link = svg.append("g")
    .selectAll(".link")
    .data(data.edges)
    .enter().append("line")
    .attr("class", "link")
    .attr("stroke", "#aaa")
    .attr("stroke-width", 2);

  // Create nodes with static positions (for debugging)
  const node = svg.append("g")
    .selectAll(".node")
    .data(data.nodes)
    .enter().append("circle")
    .attr("class", "node")
    .attr("r", 20)  // Increase radius for visibility
    .attr("fill", "#69b3a2")
    .attr("stroke", "#333")
    .attr("stroke-width", 2)  // Add stroke for better visibility
    .call(d3.drag()
      .on("start", dragStarted)
      .on("drag", dragged)
      .on("end", dragEnded));

  // Add labels to nodes
  const label = svg.append("g")
    .selectAll(".label")
    .data(data.nodes)
    .enter().append("text")
    .attr("class", "label")
    .attr("x", 12)
    .attr("y", 4)
    .text(d => d.label);

  // Create the force simulation and link it with nodes
  const simulation = d3.forceSimulation(data.nodes)
    .force("link", d3.forceLink(data.edges).id(function(d) { return d.id; }).distance(100))
    .force("charge", d3.forceManyBody().strength(-200))
    .force("center", d3.forceCenter(width / 2, height / 2));

  // Update positions after simulation
  simulation.on("tick", function() {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);

    label
      .attr("x", d => d.x)
      .attr("y", d => d.y);
  });

  // Functions for dragging nodes
  function dragStarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragEnded(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
});
