// Update svg for default view
    function setDefault(nodes,view){

    console.log("Loading default view")

     svg.select("g.singleNode").remove();
     svg.select("g.axisSingle").remove();

    workflow.nodes(nodes)
        .links(links);
      
    workflow.layout();

    temp_tree_data = nodes;

    nodes.forEach(function(d){

          if(d.next.length != 0){

            d.children = [];

            for(var i = 0;i<d.next.length;i++){
               d.children.push(temp_tree_data[d.next[i]]);
            }  
          } 

     })

    position(nodes);
 
    //Scale of the axis 

    svg.selectAll("g.axis")
       .call(axis);

    //Text for the axis
    svg.append("g")
       .attr("class","axistext")
       .append("svg:text")
       .attr("x", w/2.5)                          //To place the text in the center
       .attr("y", -10)                            //To place the text above the aixs
       .style("text-anchor", "middle")
       .text("Runtime of a TestFlow");

    svg.append("svg:g")
       .attr("class","nodes")
       .selectAll("rect")
      .data(nodes)
       .enter().append("svg:rect")
       .attr("class", "node")
       .style("fill", function(d) { return color(type[d.type]); })
       .style("opacity",0.5)
       .attr("width",function(d) { 
        //console.log("The total length" + d.dTotal);
        return (d.dTotal); })
       .attr("height", node_height)
       .on("mousemove", function(d) { 
          tooltip_div.transition()        
                .duration(200)      
                .style("opacity", .9);      
          tooltip_div .html("Name: " + d.name + "<br>" + "Type: " + d.type + "<br>" + "Start Time: " +d.astartTime + "us"
            + "<br>" + "Stop Time: " +d.astopTime + "us" + "<br>" + "Total Time: " + d.total + "us" + "/" +  d.total/1000 + "ms" + "<br> "+ "Iteration: " + d.iter)  
                .style("left", (d3.event.pageX) + "px")     
                .style("top", (d3.event.pageY + 20) + "px")
                .style("width",400)
                .style("height",8*10);    
            })                  
       .on("mouseout", function(d) {       
          tooltip_div.transition()        
                .duration(500)      
                .style("opacity", 0);   
        })
       .on("click",function(d){

          var selectedNode = d;
        
          if (this.style.stroke == "black")
            {
                //this.style.fill = color(d.type);
                svg.selectAll("rect.node")
                   .style("stroke", function(d) { 
                         return color(d.type);
                     });
        
            }else
            {
                //this.style.fill = "pink";
                this.style.stroke = "black";
                 
                svg.selectAll("rect.node")
                   .style("stoke-width","5")
                   .style("stroke", function(d) { 
                     if (d.name == selectedNode.name){ 
                         return "black";
                     } else {
                         return color(d.type);
                     } });

                if(hist_ini == 1){
                  displayHist(d,hist_ini);
                  hist_ini = 0;
                }else{
                  displayHist(d,hist_ini);
                }

                displayChain(d,nodes);

            }
           })
         .attr("x",function(d) { 
          //console.log("The x value" + d.x)
          return d.x; })
         .transition()
         .duration(2000)
         .attr("y",function(d){ 
            var t = d.type;
            //console.log(d.index + " " +d.depth + " " + d.type + " " + d.name);
            //return (40 * d.depth);
            //return (40 * type[t]);
              return d.y;
           });

      /*if(nodes[0].children != undefined){
         for(var j=0;j<nodes.length;j++){
            nodes[j].childTotal = 0;
            if(nodes[j].children != undefined){
               for (var k= 0 ; k< nodes[j].children.length;k++){
                    nodes[j].childTotal = nodes[j].childTotal + nodes[j].children[k].total/1000;
               }
            }
         } 
 
      }*/

      svg.selectAll(".smallnode").remove();

      /*nodes.forEach(function(dnode){

      if(dnode.dTotal < 1){

      svg.append("svg:circle")
         .attr("class", "smallnode")
         .style("fill", function(d) { return color(dnode.type); })
         .style("opacity",0.5)
         .attr("r" ,"5")
         .attr("cx",function(d) { return dnode.x; })
         .transition()
         .duration(2000)
         .attr("cy",function(d){ 
            var t = dnode.type;
         
            //return (40 * type[t]);
            return dnode.y;
           });
 
      svg.selectAll("circle").append("title")
         .classed("tooltip", true)
         .text("Name: " + dnode.name + "\n" + "Type: " + dnode.type + "\n" + "Start Time: " +dnode.astartTime + "us"
            + "\n" + "Stop Time: " +dnode.astopTime + "us" + "\n" + "Total Time: " + dnode.total + "us" + "/" +  dnode.total/1000 + "ms" + "\n "+ "Iteration: " + dnode.iter + "\n" + "Total Time of children: " + dnode.childTotal);

       }

      });*/

     
         
      /*var tooltips = svg.selectAll("rect")
         .append("title")
         .classed("tooltip", true)
         .text(function(d){ 
            return "Name: " + d.name + "\n" + "Type: " + d.type + "\n" + "Start Time: " +d.astartTime + "us"
            + "\n" + "Stop Time: " +d.astopTime + "us" + "\n" + "Total Time: " + d.total + "us" + "/" +  d.total/1000 + "ms" + "\n "+ "Iteration: " + d.iter + "\n" + "Total Time of children: " + d.childTotal;
         });*/

      
     // add legend   
     legend = svg.append("g")
       .attr("class", "legend")
       .attr("h", 100)
       .attr("w", 100)
       .attr('transform', 'translate(-20,50)');   
      
     legend.selectAll('rect')
       .data(types)
       .enter()
       .append("rect")
       .attr("x", rangeEnd + 50)
       .attr("y", function(d, i){ return i *  20;})
       .attr("width", 10)
       .attr("height", 10)
       .style("fill", function(d) { return color(type[d]);})
       .style("opacity","0.5");
      
      legend.selectAll('text')
        .data(types)
        .enter()
        .append("text")
        .attr("x", rangeEnd + 80)
        .attr("y", function(d, i){ return i *  20 + 9})
        .text(function(d) {
          if( d == "HW") return "Measurement Run";
          else return d;});

}