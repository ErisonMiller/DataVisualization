let colorList = ["#fff"];

let city = "Fortaleza" 

let mapPromise = d3.json("https://nominatim.openstreetmap.org/search.php?q="+city+"&polygon_geojson=1&format=json");

let map0;
mapPromise.then(function(success) {
    map0 = success;
    console.log("acabei")
});

const height2 = screen.height*0.9;
const width2 = screen.width*0.6;

console.log(width2)

let dataX = [100, 
  115.45084971874736, 
  129.38926261462365, 
  140.45084971874738, 147.55282581475768, 150, 147.55282581475768, 140.45084971874738, 129.38926261462365, 115.45084971874738, 100, 84.54915028125264, 70.61073738537635, 59.549150281252636, 52.447174185242325, 50, 52.44717418524232, 59.54915028125262, 70.61073738537632, 84.54915028125262, 100, 100, 100, 125.36765284906576, 112.36765284906576, 86.36765284906576, 72.36765284906576]

let dataY = [150, 
  147.55282581475768, 
  140.45084971874738, 129.38926261462365, 115.45084971874738, 100, 84.54915028125264, 70.61073738537635, 59.549150281252636, 52.447174185242325, 50, 52.44717418524232, 59.54915028125263, 70.61073738537634, 84.54915028125262, 99.99999999999999, 115.45084971874736, 129.38926261462365, 140.45084971874735, 147.55282581475768, 100, 116.66666666666667, 133.33333333333334, 79.87592761776506, 89.87592761776506, 88.87592761776506, 79.87592761776506]



let filldata = function sla() {
    var data0 = new Array(100);
    for (var i = 0; i < 100; i++) {
        data0[i] = i;
    }
    return data0;
}

let labels = ["85 million lives taken by the war"];


let data2 = filldata().map(d => {  
    return {
        name: labels[0],
        id: d,
        x: 231.36765284906576,
        y: 186.87592761776506,
        vy: -0.027955765772500005,
        vx: -0.011790278788373071
    }
});


let color2 = d3.scaleOrdinal()
    .domain(labels)
    .range(colorList)


xScale2 = d3.scalePoint()
  .domain(labels)
  .range([0, width2])

xScale2.padding(0.5);


dataX = dataX.map(d => {  
    return (d-100)*2.2 + width2 * 0.5
});


dataY = dataY.map(d => {  
    return (d-100)*2.2 + (height2*0.5)
});


//xScale2.paddingOuter(0.5);
//svg
let svg = d3.select("svg");

//svg width and height2
svg.attr('width', width2)
    .attr('height', height2);


// Let's add some text attributes for each country
let labelsRender = svg.selectAll('text')
    .data(labels)
    .enter()
    .append('text')
    .attr('x', ( d => xScale2(d) ) )
    .attr('y', height2 / 2 + 70)
    .attr('fill', '#aaa')
    .attr("text-anchor", "middle")
    .text(d => d);

let nodes = svg
    .selectAll('circle').data(data2)
    .enter()
    .append('circle')
    .attr('fill', d => color2(d.name))
    .attr('r', 5);

// Make a function that will rerun on each tick of the simulation
let ticked = () => {
  
  var k = simulation.alpha() * 0.25;

  data2.forEach(function(n, i) {
        n.y += (height2*0.5-30 - n.y) * k;
        n.x += (xScale2(n.name) - n.x) * k;
      });

    nodes
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
}

let amount0 = [33, 24, 9, 7, 5, 4, 4, 3, 2, 9];

let ticked1 = () => {
  
  var k = simulation.alpha() * 0.5;

  
  data2.forEach(function(n, i) {
      var id0 = 0;
      var size = amount0[id0];
      while(n.id >= size){
        id0 += 1;
        size += amount0[id0];
      }
      size -= amount0[id0];
      var size2 = (n.id - size)%2 * 10;
      size = (n.id - size)%(Math.ceil(amount0[id0])) * 10;
        n.y += ((height2*0.5+70 + (size2 - size)*0.5) - n.y) * k;
        n.x += (xScale2(n.name) - size2 - n.x) * k;
      });

    nodes
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
}


// Make a function that will rerun on each tick of the simulation
let ticked2 = () => {
  
  var k = simulation.alpha() * 0.4;

  data2.forEach(function(n, i) {
        n.y += (dataY[n.id%27] - n.y) * k;
        n.x += (dataX[n.id%27] - n.x) * k;
      });

    nodes
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
}



// Then, we need some drag event handlers
let dragstarted = (d) => {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

let dragged = (d) => {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

let dragended = (d) => {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}
// Lastly, we attach them
nodes.call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended));

let simulation = d3.forceSimulation(data2)
    .force("charge", d3.forceManyBody() // this pushes points (+together,-apart)
        .strength(250)
        .distanceMax(1))
    .force('collision', d3.forceCollide()
        .radius(6))
    //.force("center", d3.forceCenter(width2*0.5, height2*0.5-30))
    // align clump based on category
    .force('x', d3.forceX().x(d => xScale2(d.name)))
    // we can blind align the y axis to 0 so that things are single file
    .force('y', d3.forceY().y(height2*0.5-30))
    .on('tick', ticked)

let Update = () =>{

  color2 = d3.scaleOrdinal()
    .domain(labels)
    .range(colorList)
    
  xScale2 = d3.scalePoint()
    .domain(labels)
    .range([0, width2])

  xScale2.padding(0.75).align(0.5);


  nodes = svg.selectAll('circle').data(data2)

  nodes.transition()
      .duration(500)
      .attr('fill', d => color2(d.name))

  labelsRender = svg.selectAll('text').data(labels);
  labelsRender.exit().remove();//remove unneeded circles
  labelsRender.enter().append('text')
      .attr('x', width2 * 0.5 )
      .attr('y', height2 + 70);

  d3.selectAll("text").raise();
  labelsRender = svg.selectAll('text').data(labels);
  //update all circles to new positions
  labelsRender.transition()
      .duration(500)
      .attr('x', 0 )
      .attr('y', 0)
      .attr('fill', '#aaa')
      .attr("transform", function(d) {
        return 'translate( '+(xScale2(d))+' , '+(height2 *0.5 + 70)+'), '+"rotate(0)" 
      })
      //.attr('transform', 'translate( '+(d => xScale2(d))+' , '+(height2 *0.5 + 70)+'), ' + "rotate(-65)")
      .attr("text-anchor", "middle")
      .text(d => d);
  

      //simulation.alpha(0.228);
      //simulation.restart();

  simulation.stop();

  simulation = d3.forceSimulation(data2)
      //.nodes(circles)
      .force("charge", d3.forceManyBody() // this pushes points (+together,-apart)
          .strength(500)
          .distanceMax(1))
      .force('collide', d3.forceCollide()
          .radius(6))
      //.force("center", d3.forceCenter(width2*0.5, height2*0.5-30))
      // align clump based on category
      //.force('x', d3.forceX().x(d => xScale2(d.name)))
      // we can blind align the y axis to 0 so that things are single file
      //.force('y', d3.forceY().y(height2*0.5-30).strength(0.1))
      //.alphaDecay(0.01)
      .on('tick', ticked)

  simulation.alpha(0.4);
  simulation.alphaTarget(0);
  simulation.restart();

}

//waypoints scroll constructor
function scroll(n, offset, func1, func2){
  return new Waypoint({
    element: document.getElementById(n),
    handler: function(direction) {
       direction == 'down' ? func1() : func2();
    },
    //start 75% from the top of the div
    offset: offset
  });
};


// ------------------------------------------------------------- ##### --------------------------------------------------------



let grid0 = () =>{
  labels = ["85 million lives taken by the war"];
  data2 = data2.map(d => { 
      d.name = labels[0];
      return d;
  });

  colorList = ["#fff"];

  Update();
}


let grid1 = () =>{

  labels = ["Civilians", "Military"];
  const amount = [69, 31];
  
  var id1 = 0;
  var ax1 = amount[id1];
  data2 = data2.map(d => {  
    d.name = labels[id1];
    if(d.id >= ax1){
      id1 += 1;
      ax1 += amount[id1];
      d.name = labels[id1];
    }
    return d;
  });

  colorList = ["#ddd","#677821"];

  Update();
}


let grid2 = () =>{

  labels = ["Allied Civilians", "Allied Military", "Axis Military", "Axis Civilians"];
  const amount = [63, 21, 11, 5];
  
  var id1 = 0;
  var ax1 = amount[id1];
  data2 = data2.map(d => {  
    d.name = labels[id1];
    if(d.id >= ax1){
      id1 += 1;
      ax1 += amount[id1];
      d.name = labels[id1];
    }
    return d;
  });

  colorList = ["#99D3FA", "#3AABE9", "#E0B237", "#FFE256"];

  Update();
}


let Update2 = () =>{

  color2 = d3.scaleOrdinal()
    .domain(labels)
    .range(colorList)
    
  xScale2 = d3.scalePoint()
    .domain(labels)
    .range([0, width2])

  
  xScale2.padding(0.75).align(0.5);



  nodes = svg.selectAll('circle').data(data2)

  nodes.transition()
      .duration(500)
      .attr('fill', d => color2(d.name))

  labelsRender = svg.selectAll('text').data(labels);
  labelsRender.exit().remove();//remove unneeded circles
  labelsRender.enter().append('text')
      .attr('x', 0 )
      .attr('y', height2);

  labelsRender = svg.selectAll('text').data(labels);
  //update all circles to new positions
  
  labelsRender.transition()
      .duration(500)
      .attr('x', 0 )
      .attr('y', 0)
      .attr('fill', '#aaa')
      .attr("transform", function(d) {
        return 'translate( '+(xScale2(d))+' , '+(height2 *0.5 + 85)+'), '+"rotate(-90)" 
      })
      //.attr('transform', 'translate( '+(d => xScale2(d))+' , '+(height2 *0.5 + 70)+'), ' + "rotate(-65)")
      .attr("text-anchor", "end")
      .text(d => d);
  

  simulation.stop();

  simulation = d3.forceSimulation(data2)
      .force("charge", d3.forceManyBody() // this pushes points (+together,-apart)
          .strength(500)
          .distanceMax(1))
      .force('collide', d3.forceCollide()
          .radius(1))
      //.force("center", d3.forceCenter(width2*0.5, height2*0.5-30))
      // align clump based on category
      //.force('x', d3.forceX().x(d => xScale2(d.name)).strength(0.5))
      // we can blind align the y axis to 0 so that things are single file
      //.force('y', d3.forceY().y(height2*0.5-30).strength(0.2))
      .on('tick', ticked1)

      simulation.alpha(0.98);
  simulation.alphaTarget(0);
  simulation.restart();

}



let grid3 = () =>{

  labels = ["USSR", "Germany", "China", "Japan", "Yugoslavia", "EUA", "UK", "Italy", "Romania", "Others"];
  
  colorList = ["#820000", "#E0B237", "#FC0000", "#FFD800", "#C6363C", "#0026FF", "#00247d", "#008C45", "#fcd116", "#7A7979" ];
  const amount = [44, 20, 14, 9, 2, 2, 2, 1, 1, 5];
  amount0 = amount;

  var id1 = 0;
  var ax1 = amount[id1];
  data2 = data2.map(d => {  
    d.name = labels[id1];
    if(d.id >= ax1){
      id1 += 1;
      ax1 += amount[id1];
      d.name = labels[id1];
    }
    return d;
  });


  Update2();
}




let grid4 = () =>{

  labels = ["USSR", "China", "Germany", "Poland", "Dutch East Indies", "Japan", "India", "French Indochina", "Yugoslavia", "Others"];
  const amount = [33, 24, 9, 7, 5, 4, 4, 3, 2, 9];
  amount0 = amount;

  var id1 = 0;
  var ax1 = amount[id1];
  data2 = data2.map(d => {  
    d.name = labels[id1];
    if(d.id >= ax1){
      id1 += 1;
      ax1 += amount[id1];
      d.name = labels[id1];
    }
    return d;
  });

  colorList = ["#820000", "#FC0000", "#E0B237", "#57007F", "#00FFFF", "#FFD800", "#FF6A00", "#FF7FED", "#C6363C", "#7A7979" ];

  Update2();
}


let grid5 = () =>{

  labels = ["Stalingrad Deaths", "Leningrad Deaths", "Other Deaths"];
  const amount = [3, 2,100];
  //2,5 years
  var id1 = 0;
  var ax1 = amount[id1];
  data2 = data2.map(d => {  
    d.name = labels[id1];
    if(d.id >= ax1){
      id1 += 1;
      ax1 += amount[id1];
      d.name = labels[id1];
    }
    return d;
  });

  colorList = ["#820000", "#FC0000", "#555"];

  Update();
}


let grid6 = () =>{

  labels = ["Polish Survivors", "Polish Deaths"];
  const amount = [83, 100];

  var id1 = 0;
  var ax1 = amount[id1];
  data2 = data2.map(d => {  
    d.name = labels[id1];
    if(d.id >= ax1){
      id1 += 1;
      ax1 += amount[id1];
      d.name = labels[id1];
    }
    return d;
  });

  colorList = ["#FFF", "#555" ];

  Update();
}

let grid7 = () =>{

  labels = ["Belarusians Survivors", "Belarusians Deaths"];
  const amount = [75, 100];

  var id1 = 0;
  var ax1 = amount[id1];
  data2 = data2.map(d => {  
    d.name = labels[id1];
    if(d.id >= ax1){
      id1 += 1;
      ax1 += amount[id1];
      d.name = labels[id1];
    }
    return d;
  });

  colorList = ["#FFF", "#555" ];

  Update();
}


let RemoveMap = () =>{  
  svg.selectAll("polygon").remove();
}


let grid8 = () =>{

  labels = ["Holocaust  Deaths", "Other Deaths"];
  const amount = [7,100];
  //2,5 years
  var id1 = 0;
  var ax1 = amount[id1];
  data2 = data2.map(d => {  
    d.name = labels[id1];
    if(d.id >= ax1){
      id1 += 1;
      ax1 += amount[id1];
      d.name = labels[id1];
    }
    return d;
  });

  colorList = ["#3363AD", "#555"];
  RemoveMap();
  Update();
}

console.log(map0);



function calcCrow(lon1, lat1, lon2, lat2) 
{
  var R = 6371; // km
  var dLat = toRad(lat2-lat1);
  var dLon = toRad(lon2-lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c;
  return d;
}

// Converts numeric degrees to radians
function toRad(Value) 
{
    return Value * Math.PI / 180;
}

let DrawMap = () =>{  
  const centerY = (map0[0].boundingbox[0] - map0[0].boundingbox[1])*0.5;
  const centerX = (map0[0].boundingbox[2] - map0[0].boundingbox[3])*0.5
  let sla = (centerY)/(centerX);

  const distKmX = calcCrow(map0[0].boundingbox[2], map0[0].boundingbox[0], map0[0].boundingbox[3], map0[0].boundingbox[0]);
  const distKmY = calcCrow(map0[0].boundingbox[3], map0[0].boundingbox[1], map0[0].boundingbox[3], map0[0].boundingbox[0]);

  const pixSizenInKm = (0.73561/5.0);
  const distPixX = distKmX/pixSizenInKm;
  const distPixY = distKmY/pixSizenInKm;

  const xs = d3.scaleLinear().range([0, distPixX]);
  const ys = d3.scaleLinear().range([distPixY, 0]);
  
  
  ys.domain([map0[0].boundingbox[0], map0[0].boundingbox[1]]);
  xs.domain([map0[0].boundingbox[2], map0[0].boundingbox[3]]);

  svg.selectAll("polygon")
    .data(map0[0].geojson.coordinates)
  .enter().append("polygon")
    .attr("fill", "#00F5")
    .attr("stroke-width", 2)
    .attr("stroke","#00A")  
    .attr("points",function(d) { 
        return d.map(function(d) {
            return [xs(d[0]) + (width2 - distPixX)*0.5, ys(d[1]) - 30 + (height2 - distPixY)*0.5].join(",");
        }).join(" ");
    });  

}

let grid9 = () =>{
  labels = [city];
  data2 = data2.map(d => { 
      d.name = labels[0];
      return d;
  });

  colorList = ["#fff"];

  DrawMap();
  Update();
}


let Update3 = () =>{

  color2 = d3.scaleOrdinal()
    .domain(labels)
    .range(colorList)
    
  xScale2 = d3.scalePoint()
    .domain(labels)
    .range([0, width2])

  xScale2.padding(1);


  nodes = svg.selectAll('circle').data(data2)

  nodes.transition()
      .duration(500)
      .attr('fill', d => color2(d.name))

  labelsRender = svg.selectAll('text').data(labels);
  labelsRender.exit().remove();//remove unneeded circles
  labelsRender.enter().append('text')
      .attr('x', 0 )
      .attr('y', height2);

  labelsRender = svg.selectAll('text').data(labels);
  //update all circles to new positions
  
  labelsRender.transition()
      .duration(500)
      .attr('x', 0 )
      .attr('y', 0)
      .attr('fill', '#000')
      .attr("transform", function(d) {
        return 'translate( '+(xScale2(d))+' , '+(height2 *1.1)+'), '+"rotate(0)" 
      })
      //.attr('transform', 'translate( '+(d => xScale2(d))+' , '+(height2 *0.5 + 70)+'), ' + "rotate(-65)")
      .attr("text-anchor", "end")
      .text(d => d);
  

  simulation.stop();

  simulation = d3.forceSimulation(data2)
      .force("charge", d3.forceManyBody() // this pushes points (+together,-apart)
          .strength(500)
          .distanceMax(2))
      .force('collide', d3.forceCollide()
          .radius(6))
      //.force("center", d3.forceCenter(width2*0.5, height2*0.5-30))
      // align clump based on category
      //.force('x', d3.forceX().x(d => xScale2(d.name)).strength(0.5))
      // we can blind align the y axis to 0 so that things are single file
      //.force('y', d3.forceY().y(height2*0.5-30).strength(0.2))
      .on('tick', ticked2)

  simulation.alpha(2);
  simulation.alphaTarget(0);
  simulation.restart();
}

let grid10 = () =>{
  labels = ["Peace"]
  data2 = data2.map(d => {  
    d.name = labels[0]
    return d;
  });

  colorList = ["#FFF"];
  RemoveMap();
  Update3();
}

new scroll('div1', '50%', grid1, grid0);
new scroll('div2', '50%', grid2, grid1);
new scroll('div3', '50%', grid3, grid2);
new scroll('div4', '50%', grid4, grid3);
new scroll('div5', '50%', grid5, grid4);
new scroll('div6', '50%', grid6, grid5);
new scroll('div7', '50%', grid7, grid6);
new scroll('div8', '50%', grid8, grid7);
new scroll('div9', '50%', grid9, grid8);
new scroll('div10','50%', grid10, grid9);


//5px == 0.368km

//grid0();
//return svg.node()
