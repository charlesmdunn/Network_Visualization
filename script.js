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
    .attr("stroke-width", 2);  // Add stroke for better visibility

  // Add labels to nodes
  const label = svg.append("g")
    .selectAll(".label")
    .data(data.nodes)
    .enter().append("text")
    .attr("class", "label")
    .attr("x", 12)
    .attr("y", 4)
    .text(d => d.label);

  // Create the force simulation
  const simulation = d3.forceSimulation(data.nodes)
    .force("link", d3.forceLink(data.edges).id(function(d) { return d.id; }).distance(100))
    .force("charge", d3.forceManyBody().strength(-2
