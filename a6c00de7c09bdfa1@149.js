// https://observablehq.com/@d3/force-directed-graph@149
export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["miserables.json",new URL("./files/31d904f6e21d42d4963ece9c8cc4fbd75efcbdc404bf511bc79906f0a1be68b5a01e935f65123670ed04e35ca8cae3c2b943f82bf8db49c5a67c85cbb58db052",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# Visualisation & Network Theory

This network represents the links between different employees of _Alt Installasjon_. This following code is inspired by [Bostock (2017)](https://observablehq.com/@d3/force-directed-graph) and modified by Haugsbo E., Bettum R. and Vanderkelen L. for the visualisation & network theory course by Christoph Lutz and Christian Fieseler (2021) at BI Norwegian Business School, Oslo, Norway.`
)});
  main.variable(observer("chart")).define("chart", ["data","d3","width","height","color","drag","invalidation"], function(data,d3,width,height,color,drag,invalidation)
{
  const links = data.links.map(d => Object.create(d));
  const nodes = data.nodes.map(d => Object.create(d));

  console.log(links.length)
  let range_node_eff = [];
  nodes.map(d=> range_node_eff.push(+d.AvgEfficRateNode));

  function getCount(perso) {
    var count = 0;
    if(perso == undefined) {} else {
      console.log(perso);
    for (var i = 0; i < links.length; i++) {
        if (links[i].source.index == perso.index || links[i].target.index == perso.index) {
            count++;
        }
    }}
    return count;
}

const colors = [
  0,
  d3.interpolateViridis(0.9), 
  d3.interpolateViridis(0.7), 
  d3.interpolateViridis(0.5), 
  d3.interpolateViridis(0.3), 
  d3.interpolateViridis(0.2)
];

  const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id))
      .force("charge", d3.forceManyBody().strength(-2500))
      // .force("charge", d3.forceManyBody().distanceMax(2000))
      .force("center", d3.forceCenter(width / 2, height / 2));

  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height]);

  const link = svg.append("g")
      .attr("stroke-opacity", 1)
    .selectAll("line")
    .data(links)
    .join("line")
      .attr("stroke", d => colors[d.eff_grp])
      .attr("stroke-width", 4.5);

  const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 3)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
      .attr("r", d => Math.sqrt(getCount(nodes[d.index])) * 4 + 5)
      .attr("fill", d => d3.interpolateViridis( Math.max(
                              1 - ((d.AvgEfficRateNode - Math.min(...range_node_eff)) * 
                              (1 / (Math.max(...range_node_eff) - Math.min(...range_node_eff)))),
                              0.2
      )))
      .call(drag(simulation));

  node.append("title")
      .text(
        d => d.id
      );

  simulation.on("tick", () => {
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
  });

  invalidation.then(() => simulation.stop());

  return svg.node();
}
);
  main.variable(observer("data")).define("data", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("miserables.json").json()
)});
  main.variable(observer("height")).define("height", function(){return(
1200
)});
  main.variable(observer("color")).define("color", ["d3"], function(d3)
{
  const scale = d3.scaleOrdinal(d3.schemeCategory10);
  return d => scale(d.group);
}
);
  main.variable(observer("drag")).define("drag", ["d3"], function(d3){return(
simulation => {
  
  function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }
  
  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }
  
  function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }
  
  return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
}
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@6")
)});
  return main;
}
