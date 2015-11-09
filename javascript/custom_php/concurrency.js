var ini = 1;
var start_pos = 30;
var level = 1;

function concurrency(nodes_con){

    d3.selectAll("rect.conodes_parent").remove(); 
    d3.selectAll("rect.conodes_child").remove(); 
    //d3.selectAll("text.conodes_child").remove(); 
    d3.selectAll("rect.conodes_root").remove(); 
    //d3.selectAll("text.conodes_root").remove(); 

   //console.log(nodes_con);

    //Array of node types
      var count = 0;
 
      for(var i=0;i<nodes_con.length;i++){
        var temp = nodes_con[i].type;
          if(($.inArray(temp,types) == -1)){
            types[count] = nodes_con[i].type;
          count++; 
          }
      }

      $.map(types,function(n,i){
        type[n] = i+1;
      });

      d3.selectAll("g.legend").remove();
 
      legend = svg_ini.append("g")
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
       .style("fill", function(d) { return color(d);})
       .style("opacity","0.5");
      
      legend.selectAll('text')
        .data(types)
        .enter()
        .append("text")
        .attr("x", rangeEnd + 80)
        .attr("y", function(d, i){ return i *  20 + 9})
        .text(function(d) {if( d == "HW") return "Measurement Run";
          else return d;});

   temp_nodes_con = nodes_con;

    //Scale of the axis 
   svg_ini.selectAll("g.axis")
      .call(d3.svg.axis()
      .scale(scale)
      .orient("bottom")
      .tickFormat(function(d){return d/1000 + "ms"}));

   svg_ini.append("svg:g")
      .attr("class","root");

    data_val = [];
         
    data_val.push(temp_nodes_con[0]);

    svg =  d3.select(".root")
      
    svg.selectAll("rect")
       .data(data_val)
       .enter()
       .append("svg:rect")
       .attr("class","conodes_root")
       .attr("width",function(d) { return (d.dTotal); })
       .attr("height", 15)
       .attr("x", function(d) { return d.x} )
       .attr("y", function(d) { return d.y} )
       .style("fill", function(d){   return color(d.type)})
       .style("opacity","0.5")
       .on("click",function(d){
 
        d3.selectAll("rect.conodes_parent").remove(); 
        d3.selectAll("rect.conodes_child").remove(); 
        d3.selectAll("text.conodes_child").remove(); 

        d3.selectAll(".levels").remove(); 

        svg_ini.append("svg:g")
         .attr("class","levels");

         if(d.next.length != 0){
           con_child(d.next, start_pos,level);
         }
     });

     /*svg.append("svg:g")
          .selectAll("text")
          .data(data_val)
          .enter()
          .append("svg:text")
          .attr("class","conodes_root")
          .attr("x",function(d) { return d.x +  d.dTotal/3 })
          .attr("y",function(d) { return d.y + 20})
          .text( function(d) { return  d.name + " " + " (" + d.next.length + " ) " });*/

     svg.selectAll("rect")
          .append("title")
          .attr("class","conodes_root")
         .classed("tooltip", true)
         .text(function(d){ 
            return "Name: " + d.name + " (" + d.next.length + " ) " + "\n" + "Type: " + d.type + "\n" + "Start Time: " +d.astartTime + "us" + "\n" + "Stop Time: " +d.astopTime + "us" + "\n" + "Total Time: " + d.total + "us" + "/" +  d.total/1000 + "ms" + "\n "+ "Iteration: " + d.iter;
         });
}

function con_child(child_arr, start_pos,level){

    svg = svg_ini.select(".levels");
 
    svg.append("svg:g")
       .attr("class","level"+ level)
       .attr("transform","translate(0," + start_pos + ")");

    /*d3.select(".level"+level)
     .append("svg:text")
      .attr("x",10)
      .attr("y",40)
      .text("Level" + " " + level);   */   

    var temp_child_nodes = [];

    child_arr.forEach(function(d){

       temp_child_nodes.push(temp_nodes_con[d]);

    });

   con_count = 3;

   while(con_count != 0){
     for(var i = 0, swapping;i<temp_child_nodes.length - 1; i++){
     
        if(temp_child_nodes[i].dstartTime > temp_child_nodes[i+1].dstartTime){
           //swap
           swapping = temp_child_nodes[i+1];
      
           temp_child_nodes[i+1] = temp_child_nodes[i];
           temp_child_nodes[i] = swapping;
       
         } 
     } 
      
     con_count--;
   }      
         
    for(var i=0;i<temp_child_nodes.length;i++){
        
       temp_child_nodes[i].con_id = i;

    }

    temp_child_nodes = position_concurrency(temp_child_nodes, 50);

       if(level > 1){

         svg_shrink = svg.selectAll(".level" + (level-1));

         parent_node = svg_shrink.select("rect.conodes_parent");
 
         parent_node.attr("y",50);

       }
         
       svg= d3.select(".level" + level);

       svg.attr("transform","translate(0," + start_pos + ")");
      
       svg.selectAll("rect")
          .data(temp_child_nodes)
          .enter()
          .append("svg:rect")
       .attr("class","conodes_child")
         .attr("width",function(d) { return (d.dTotal); })
         .attr("height", 15)
         .attr("x", function(d) { return d.x} )
         .attr("y", function(d) { return d.y} )
         .attr("clicked",0)
         .attr("con_id",function(d) { return d.con_id})
         .style("fill", function(d){   return color(d.type)})
         .style("opacity","0.5")
         .on("click",function(d){
              if(d.next.length != 0){
              level++;

              chng_class =  $(this).attr("con_id");
              
              $(this).attr("class","conodes_parent");
             
              svg.selectAll("text.conodes_child")
                 .attr("class",function(d_chng){
                
                    if(d_chng.con_id == chng_class){

                       return "conodes_parent" ;
       
                    }else {

                       return "conodes_child" ;
                    }
                     
                 })
                 .attr("y",function(d_chng){
                
                    if(d_chng.con_id == chng_class){

                       return 70;
       
                    }
                     
                 })
                
          
              var clicked = $(this).attr("clicked");
 
              //console.log(clicked);
         
                  if( clicked == 0){
                      $(this).attr("clicked",1);
 
                      start_pos = start_pos + 30;

                      svg.selectAll("rect.conodes_child").remove();
                      svg.selectAll("text.conodes_child").remove();
  
                      con_child(d.next, start_pos,level);
                   }

//                   if(clicked == 1){
//  
//                     $(this).attr("clicked",0);
// 
//                     //start_pos = start_pos - 50;
// 
//                     svg.selectAll("rect.conodes_child").remove();
//                     svg.selectAll("text.conodes_child").remove();
//   
//                     //con_child(d.next, start_pos,level);
// 
//                   }
                   
             }
           })

    
      /*svg.append("svg:g")
          .selectAll("text")
          .data(temp_child_nodes)
          .enter()
          .append("svg:text")
       .attr("class","conodes_child")
         .attr("con_id",function(d) { return d.con_id})
         .attr("x",function(d) { return d.x +  d.dTotal/4 })
         .attr("y",function(d) { return d.y + 20})
         .text( function(d) { return  d.name + " " + " (" + d.next.length + " ) " });*/

       svg.selectAll("rect")
          .append("title")
          .attr("class","conodes_root")
         .classed("tooltip", true)
         .text(function(d){ 
          return "Name: " + d.name + " (" + d.next.length + " ) " + "\n" + "Type: " + d.type + "\n" + "Start Time: " +d.astartTime + "us" + "\n" + "Stop Time: " +d.astopTime + "us" + "\n" + "Total Time: " + d.total + "us" + "/" +  d.total/1000 + "ms" + "\n "+ "Iteration: " + d.iter;
         });


}
