function DrawNode(nodes){
     
     var rangeStart;
     var rangeStop;

     rangeStart = parseInt(nodes.startTime);
     rangeStop = parseInt(nodes.stopTime);
     
     var offset = rangeStart; 

     rangeStart = rangeStart - offset; 
     rangeStop  = rangeStop -  offset;
       
     nodes.astartTime = rangeStart;
     nodes.astopTime = rangeStop;
      
     dataRange = [rangeStart,rangeStop];

     //console.log(dataRange);

     var temp_scale = d3.scale.linear()
       .domain([dataRange[0],dataRange[1]])
       .range([rangeBegin,rangeEnd]);

     rangeStop = temp_scale(rangeStop);
     rangeStart= temp_scale(rangeStart);
        
     nodes.dstartTime = rangeStart;
     nodes.dstopTime = rangeStop;
     nodes.dTotal = rangeStop - rangeStart;
     nodes.ratio = parseInt(nodes.ratio);
        
 
     //Set scale to generate axis  
     setScale(dataRange);

     svg.select("g.nodes").remove();
     svg.select("g.links").remove();
   
     svg.select("g.axis").remove(); 
 
     svg.select("g.singleNode").remove();
     svg.select("g.axisSingle").remove();

     var drawnode = [];
    
     drawnode.push(nodes); 

     //Scale of the axis 

     var axisSingle =  d3.svg.axis()
         .scale(scale)
         .orient("bottom")
         .ticks(10)
         .tickFormat(function(d){return d/1000 + "ms"});

     svg.append("g")
        .attr("class","axisSingle")
        .call(axisSingle);

     svg.append("svg:g")
         .attr("class","singleNode")
         .selectAll("rect")
        .data(drawnode)
         .enter().append("svg:rect")
         .attr("class", "node")
         .style("fill", function(d) { return color(type[d.type]); })
         .style("opacity",0.5)
         .attr("width",function(d) {  return (d.dTotal); })
         .attr("height", node_height)
         .attr("x",function(d) { return 20; })
         .transition()
         .duration(2000)
         .attr("y",function(d){ 
            return (40);
           });
         
      var tooltips = svg.selectAll("rect")
         .append("title")
         .classed("tooltip", true)
         .text(function(d){ 
            return "Name: " + d.name + "\n" + "Type: " + d.type + "\n" + "Start Time: " +d.astartTime + "us"
            + "\n" + "Stop Time: " +d.astopTime + "us" + "\n" + "Total Time: " + d.astopTime/1000 + "ms" + "\n "+ "Iteration: " + d.iter;
         });
    
}