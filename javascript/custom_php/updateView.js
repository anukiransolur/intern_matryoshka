//Update svg according to the input view
    function updateSvgView(nodes,view,iterval){
     
     //console.log("Updating the view");

     if (view == "Single Line"){

      svg.selectAll("rect.node")
         .data(nodes)
         .attr("width",function(d) { return (d.dTotal); })
         .attr("height","15")
         .style("fill", function(d) { return color(d.type); })
         .attr("stroke","black")
         .attr("stroke-width","1")
         .attr("x",function(d) { return d.x; })
         .transition()
         .duration(2000)
         .attr("y",function(d){ 
            var t = d.type;
            return (40 * type[t]);
           });
       }else if ( view == "Horizontal") {

        svg.selectAll("rect.node")
        .data(nodes)
         .style("fill", function(d) { return color(d.type); })
         .attr("stroke","black")
         .attr("stroke-width","1")
         .attr("width",function(d) { return (d.dTotal); })
         .attr("height","15")
         .attr("x",function(d) { 
            return d.x; })
         .transition()
         .duration(2000)
         .attr("y",function(d){ 
          return d.y});


      svg.selectAll(".smallnode").remove();

      nodes.forEach(function(dnode){

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
            + "\n" + "Stop Time: " +dnode.astopTime + "us" + "\n" + "Total Time: " + dnode.total + "us" + "/" +  dnode.total/1000 + "ms" + "\n "+ "Iteration: " + dnode.iter);

       }

      });

      if(viewChange == 1){

          svg.selectAll("g.links").remove;

          displayLinks(nodes,iterval);
         
          viewChange = 0;
       }

       }else if ( view == "Stacked") {
 
         //console.log("data has changed");

         var _links =  svg.selectAll("g.links");
         _links.remove();

         var _smallnode =  svg.selectAll(".smallnode");
         _smallnode.remove();

          svg.selectAll("rect.node")
        .data(nodes)
         .style("fill", function(d) { return color(d.type); })
         .attr("width",function(d) { return (d.dTotal); })
         .attr("height","15")
         .attr("stroke","black")
         .attr("stroke-width","1")
         .attr("x",function(d) { 
            return d.x; })
         .transition()
         .duration(2000)
         .attr("y",function(d){ return 40});
       }

       var rect = svg.selectAll("rect.nodes")
           .data(nodes);

       rect.select("title")
         .text(function(d){ 
            return "Name: " + d.name + "\n" + "Type: " + d.type + "\n" + "Start Time: " +d.astartTime + "us"
            + "\n" + "Stop Time: " +d.astopTime + "us" + "\n" + "Total Time: " + d.total + "us" + "/" +  d.total/1000 + "ms" + "\n "+ "Iteration: " +d.iter;
         });

    }