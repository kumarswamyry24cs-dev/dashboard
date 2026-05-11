import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const NetworkDependencyGraph = ({ dependencyMatrix, stationOrder, activatedStations = [] }) => {
  const svgRef = useRef();
  const simulationRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 500, height: 500 });

  useEffect(() => {
    if (!svgRef.current) return;

    // Build nodes and links from dependency matrix
    const nodes = stationOrder.map((station, idx) => ({
      id: station,
      index: idx,
      dependencyCount: dependencyMatrix[idx].reduce((a, b) => a + b, 0)
    }));

    const links = [];
    for (let i = 0; i < dependencyMatrix.length; i++) {
      for (let j = 0; j < dependencyMatrix[i].length; j++) {
        if (dependencyMatrix[i][j] === 1) {
          links.push({
            source: stationOrder[i],
            target: stationOrder[j]
          });
        }
      }
    }

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    // Set up SVG
    const svg = d3.select(svgRef.current);
    const { width, height } = dimensions;

    // Create container groups
    const g = svg.append('g');

    // Arrow marker definition
    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('markerWidth', 10)
      .attr('markerHeight', 10)
      .attr('refX', 25)
      .attr('refY', 5)
      .attr('orient', 'auto')
      .append('polygon')
      .attr('points', '0 0, 10 5, 0 10')
      .attr('fill', '#00f5ff');

    // Hover arrow marker
    svg.append('defs').append('marker')
      .attr('id', 'arrowhead-glow')
      .attr('markerWidth', 10)
      .attr('markerHeight', 10)
      .attr('refX', 25)
      .attr('refY', 5)
      .attr('orient', 'auto')
      .append('polygon')
      .attr('points', '0 0, 10 5, 0 10')
      .attr('fill', '#ffff00');

    // Create force simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links)
        .id(d => d.id)
        .distance(100)
        .strength(0.5))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(d => Math.sqrt(d.dependencyCount) * 8 + 20));

    simulationRef.current = simulation;

    // Add edges
    const edges = g.selectAll('.link')
      .data(links)
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('stroke', '#00f5ff')
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrowhead)')
      .attr('opacity', 0.6)
      .style('pointer-events', 'none');

    // Add edge labels on hover
    edges.on('mouseenter', function(event, d) {
      const sourceNode = nodes.find(n => n.id === d.source.id || n.id === d.source);
      const targetNode = nodes.find(n => n.id === d.target.id || n.id === d.target);
      const sourceName = typeof d.source === 'object' ? d.source.id : d.source;
      const targetName = typeof d.target === 'object' ? d.target.id : d.target;

      d3.select(this)
        .transition()
        .duration(200)
        .attr('stroke', '#ffff00')
        .attr('stroke-width', 3)
        .attr('marker-end', 'url(#arrowhead-glow)');

      // Show tooltip
      const tooltip = svg.append('text')
        .attr('class', 'edge-tooltip')
        .attr('x', (event.clientX - svgRef.current.getBoundingClientRect().left) / (dimensions.width / 500))
        .attr('y', (event.clientY - svgRef.current.getBoundingClientRect().top) / (dimensions.height / 500))
        .attr('fill', '#ffff00')
        .attr('font-size', '12px')
        .attr('font-family', 'Share Tech Mono')
        .attr('pointer-events', 'none')
        .text(`${sourceName} → ${targetName}`);

      setTimeout(() => tooltip.remove(), 2000);
    })
    .on('mouseleave', function() {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('stroke', '#00f5ff')
        .attr('stroke-width', 2)
        .attr('marker-end', 'url(#arrowhead)');
    });

    // Add nodes
    const nodeElements = g.selectAll('.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .call(d3.drag()
        .on('start', dragStarted)
        .on('drag', dragged)
        .on('end', dragEnded));

    // Node circles
    nodeElements.append('circle')
      .attr('r', d => Math.sqrt(d.dependencyCount) * 8 + 15)
      .attr('fill', d => activatedStations.includes(d.id) ? '#39ff14' : '#4a5568')
      .attr('stroke', d => activatedStations.includes(d.id) ? '#39ff14' : '#00f5ff')
      .attr('stroke-width', 2)
      .style('filter', d => activatedStations.includes(d.id) 
        ? 'drop-shadow(0 0 10px #39ff14) drop-shadow(0 0 20px #39ff14)' 
        : 'drop-shadow(0 0 5px #00f5ff)')
      .style('transition', 'all 0.3s ease');

    // Node labels
    nodeElements.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.3em')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .attr('font-family', 'Orbitron')
      .attr('fill', '#fff')
      .attr('pointer-events', 'none')
      .text(d => d.id);

    // Update positions on each tick
    simulation.on('tick', () => {
      edges
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      nodeElements
        .attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // Drag functions
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

    // Highlight activated nodes
    nodeElements.selectAll('circle')
      .transition()
      .duration(500)
      .attr('fill', d => activatedStations.includes(d.id) ? '#39ff14' : '#4a5568')
      .attr('stroke', d => activatedStations.includes(d.id) ? '#39ff14' : '#00f5ff')
      .style('filter', d => activatedStations.includes(d.id) 
        ? 'drop-shadow(0 0 10px #39ff14) drop-shadow(0 0 20px #39ff14)' 
        : 'drop-shadow(0 0 5px #00f5ff)');

    // Create ripple effect for newly activated nodes
    if (activatedStations.length > 0) {
      const lastActivated = activatedStations[activatedStations.length - 1];
      const lastNode = nodes.find(n => n.id === lastActivated);
      
      if (lastNode) {
        // Ripple animation
        for (let i = 0; i < 3; i++) {
          svg.append('circle')
            .attr('cx', lastNode.x)
            .attr('cy', lastNode.y)
            .attr('r', 0)
            .attr('fill', 'none')
            .attr('stroke', '#39ff14')
            .attr('stroke-width', 2)
            .attr('opacity', 0.8)
            .transition()
            .duration(600 + i * 150)
            .attr('r', 60 + i * 20)
            .attr('opacity', 0)
            .on('end', function() {
              d3.select(this).remove();
            });
        }
      }
    }

    // Handle window resize
    const handleResize = () => {
      const newWidth = svgRef.current?.parentElement?.clientWidth || 500;
      const newHeight = svgRef.current?.parentElement?.clientHeight || 500;
      setDimensions({ width: newWidth, height: newHeight });
      svg.attr('width', newWidth).attr('height', newHeight);
      simulation.force('center', d3.forceCenter(newWidth / 2, newHeight / 2)).alpha(0.3).restart();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);

  }, [dependencyMatrix, stationOrder, activatedStations, dimensions]);

  return (
    <div className="w-full h-full bg-cyber-card border-2 border-cyber-green rounded-lg p-4 overflow-hidden">
      <div className="mb-3">
        <p className="text-xs text-gray-400 font-tech-mono">NETWORK DEPENDENCY GRAPH</p>
        <p className="text-xs text-cyber-text mt-1">Gray → Green as stations activate. Arrows show dependency flow.</p>
      </div>
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        style={{
          backgroundColor: 'rgba(10, 15, 30, 0.5)',
          borderRadius: '8px',
          border: '1px solid rgba(0, 245, 255, 0.2)'
        }}
      />
    </div>
  );
};

export default NetworkDependencyGraph;
