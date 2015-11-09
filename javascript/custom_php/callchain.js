//Adds links between the nodes 
    function displayLinks(nodes,lIter){
 
      if (link_ini == 1){

      var path = svg.append("svg:g")
         .attr("class","links")
         .selectAll("path")
       .data(links)
         .enter()
         .append("g")
        .attr("class","link")
        .attr("id",function(d){
            return d.source.index +","+ d.target.index;
         })
        .style("stroke",function(d){
           return color(type[d.source.type]);
         });
     
      path.append("svg:path")
        .attr("d", function(d) {
         //console.log(d);
        var dx = d.target.x - d.source.x,
        dy = d.target.y - d.source.y,
        dr = Math.sqrt(dx * dx + dy * dy);
        var t = d.type;
        //var y_val = (40 * type[t]);
        var y_val = d.source.y;
        //console.log(d);
        return "M" + (d.target.x) + " " + (y_val + 15) + "L" + (d.target.x) + " " + (y_val + 40) + "M" + (d.target.x +d.target.dTotal) + " " + (y_val + 15) + "L" + (d.target.x +d.target.dTotal) + " " + (y_val + 40) ;
    
        })
       .style("stoke-width",5);

      } else
     
      {
       var initLink =  svg.select("links");
       initLink.remove();

       var path = svg.append("svg:g")
         .attr("class","links")
         .selectAll("path")
         .data(links)
         .enter()
         .append("g")
        .attr("class","link")
        .style("stroke",function(d){
           return color(type[d.source.type]);
         });
     
      path.append("svg:path")
        .attr("d", function(d) {
        var dx = d.target.x - d.source.x,
        dy = d.target.y - d.source.y,
        dr = Math.sqrt(dx * dx + dy * dy);
        var t = d.type;
        //var y_val = (40 * type[t]);
        var y_val = d.source.y;
        return "M" + (d.target.x) + " " + (y_val + 15) + "L" + (d.target.x) + " " + (y_val + 40) + "M" + (d.target.x +d.target.dTotal) + " " + (y_val + 15) + "L" + (d.target.x +d.target.dTotal) + " " + (y_val + 40) ;
    
        })
        .style("stoke-width",5);

      }

    }

 // Display the call chain of nodes
    function displayChain(link_data,nodes){

      //console.log(link_data);
      //console.log(nodes);

       var chainArr = [];
       var child = link_data.index;

       while(child){

          var link_line = {};
          var src_type = nodes[child].prev[0];

          if (typeof src_type == 'undefined')
          {
            break;
          }
  
          link_line.source = nodes[child].prev[0];
          link_line.target = nodes[child].index;
          link_line.type   = nodes[src_type].type;
  
          child = nodes[child].prev[0];
          chainArr.push(link_line);
        }

        child = link_data.index;

         while(child){
          
          var link_line = {};
          var tar_type = nodes[child].index;;

          if (typeof tar_type == 'undefined')
          {
            break;
          }
  
          link_line.source = nodes[child].index;
          link_line.target = nodes[child].next[0];
          link_line.type   = nodes[tar_type].type;
  
          child = nodes[child].next[0];
          chainArr.push(link_line);
        }

        chainPath = svg.selectAll("g.link");

        chainPath.style("stroke",function(d){

           d.chain = 0;
           var sl = d.source.index +","+d.target.index;

           for(var i =0; i<chainArr.length;i++){
     
             var searchLink = chainArr[i].source + "," + chainArr[i].target;
             if (sl == searchLink){
                d.chain = 1;
             }
             
           }

         });

        chainPath.style("stroke",function(d){

           if (d.chain){
              return color(type[d.type]);
           }else{
              return "gray";
           }
           
         });  

        chainBlocks = svg.selectAll("rect.node");
 
        chainBlocks.style("fill",function(d){

           d.chain = 0;
 
           if(d.next.length != 0 ){
              var sl = [];
               for(var i=0;i<d.next.length;i++){
                 sl.push(d.index +","+d.next[i]);
               }

           } else{

               var sl = [];
           }

           for(var i =0; i<chainArr.length;i++){
   
              var searchLink = chainArr[i].source + "," + chainArr[i].target;

              if (sl != 'undefined'){
                 for(var j =0; j<sl.length;j++){
                   if(sl[j] == searchLink){
                      d.chain = 1;
                   }
                 }
             }  
           }
            
         });

        chainBlocks.style("fill",function(d){
           
           if (d.chain){
              return color(type[d.type]);
           }else{
              return "gray";
           }        

         });
      
    }