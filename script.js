d3.json("network.json").then(function(data) {
  console.log("Nodes:", data.nodes);
  console.log("Edges:", data.edges);

  // Create a set of valid node IDs
  const nodeIds = new Set(data.nodes.map(node => node.id));

  // Filter edges to ensure 'from' and 'to' fields are valid
  const validEdges = data.edges.filter(edge => {
    if (!nodeIds.has(edge.from)) {
      console.error(`Edge has invalid 'from' node: ${edge.from}`);
      return false;
    }
    if (!nodeIds.has(edge.to)) {
      console.error(`Edge has invalid 'to' node: ${edge.to}`);
      return false;
    }
    return true;
  });

  // Set up the width and height for the graph
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Create SVG container for D3.js
  const svg = d3.select("#graph")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // Set up the force simulation for nodes and links
  const simulation = d3.forceSimulation(data.nodes)
    .force("link", d3.forceLink(validEdges).id(d => d.id).distance(100))
    .force("charge", d3.forceManyBody().strength(-200))
    .force("center", d3.forceCenter(width / 2, height / 2));

  // Create links (edges)
  const link = svg.append("g")
    .selectAll(".link")
    .data(validEdges)
    .enter().append("line")
    .attr("class", "link")
    .attr("stroke", "#aaa")
    .attr("stroke-width", 2);

  // Create nodes
  const node = svg.append("g")
    .selectAll(".node")
    .data(data.nodes)
    .enter().append("circle")
    .attr("class", "node")
    .attr("r", 10)
    .attr("fill", "#69b3a2")
    .call(d3.drag()
      .on("start", dragStarted)
      .on("drag", dragged)
      .on("end", dragEnded));

  // Create labels for the nodes
  const label = svg.append("g")
    .selectAll(".label")
    .data(data.nodes)
    .enter().append("text")
    .attr("class", "label")
    .attr("x", 12)
    .attr("y", 4)
    .text(d => d.label);

  // Update positions of nodes and links on each tick
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
