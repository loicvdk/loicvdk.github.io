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

  // console.log('NODES!');
  // console.log('LINKS!');
  // console.log(links);
  function getCount(perso) {
    var count = 0;
    for (var i = 0; i < links.length; i++) {
        if (links[i].source == perso || links[i].target == perso) {
            count++;
        }
    }
    return count;
}

  // const colors = [0, "#e0aaff", "#c77dff", "#9d4edd", "#7b2cbf", "#5a189a"]; 
  // const colors = [0, "#fff6cc", "#ffee99", "#ffe97f", "#ffe14c", "#ffd819"]; 
  // const colors = [0, "#ffea00", "#ffd000", "#ffb700", "#ffa200", "#ff8800"]; 
  // const colors = [0, "#0091ad", "#1780a1", "#2e6f95", "#455e89", "#5c4d7d"];  
  // FAVORITE PALETTE FOR NOW --> GREEN BLUE 
  // const colors = [0, "#d9ed92", "#99d98c", "#52b69a", "#168aad", "#1e6091"]; 
  // DATA ROBOT COLOR PALETTE --> from blue to red
  const colors = [0, "#e83830", "#f67f6c", "#f1f1f1", "#8abfeb", "#3ca7e8"];

  const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id))
      .force("charge", d3.forceManyBody().strength(-900))
      .force("center", d3.forceCenter(width / 2, height / 2));

  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height]);

  const link = svg.append("g")
      .attr("stroke-opacity", 0.7)
    .selectAll("line")
    .data(links)
    .join("line")
      .attr("stroke", d => colors[d.eff_grp])
      .attr("stroke-width", 4.5
      // d => Math.sqrt(getCount(d.source))
      );

  const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 3)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
      .attr("r", d => Math.sqrt(getCount(nodes[d.id])) + 10)
      .attr("fill", d => {
        if(d.function == "Montør L")
          {return "#b7094c"} 
        else if(d.function == "Laerling")
          {return "#5c4d7d"}
        else 
          {return "#0091ad"};})
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
800
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
