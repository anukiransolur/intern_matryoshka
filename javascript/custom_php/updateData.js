//update the data on change of iteration
    function updateData(nodes,default_val,iter_value,min,max){

      /*if(newdata != 1){
         workflow.nodes(nodes);
         workflow.layout();
      }*/

      var setRange_data = "";

      if ( updateNodeData != 1){
         setRange_data = setRange(nodes,0,0);
      }else{
         //setRange_data = updateNodeRange(min,max,nodes);
         
         setRange_data = setRange(nodes,min,max);
        
      }

      var dataRange = setRange_data.dataRange;
        
      //Set scale to generate axis  
      setScale(dataRange);

      nodes = setRange_data.nodes;

      //Array of node types
      var count = 0;

      types = [];
 
      for(var i=0;i<nodes.length;i++){
        var temp = nodes[i].type;
          if(($.inArray(temp,types) == -1)){
            types[count] = nodes[i].type;
          count++; 
          }
      }

      $.map(types,function(n,i){
        type[n] = i+1;
      });

      axis =  d3.svg.axis()
       .scale(scale)
       .orient("bottom")
       .ticks(10)
       .tickFormat(function(d){return d/1000 + "ms"});

      svg.append("g")
        .attr("class","axis");

      var it_v = 1;

      if(default_val == 1){
         iterval = it_v; 
      } 
      else{
         iterval = iter_value;
      }
       
     links = data_links;

    

     linknodes = [];

      nodes.forEach(function(d){

        var lnode = {};
        lnode.corr = d.correlator;
        lnode.index = d.index;
        lnode.type = d.type;

        linknodes.push(lnode);

      });

       links.forEach(function(d){

         for(var i=0;i<linknodes.length;i++)
         {
             tempCorr = $.trim(d.pcorr);
             templink  =  $.trim(linknodes[i].corr);   
 
             if(tempCorr == templink){
               d.source = linknodes[i].index;
               d.type = linknodes[i].type;
               break;
             }else{
               d.source = "";
             }

         }

       });

       links.forEach(function(d){

         for(var i=0;i<linknodes.length;i++)
         {
             tempCorr = $.trim(d.corr);
             templink  =  $.trim(linknodes[i].corr);   
            
             if(tempCorr == templink){
               d.target = linknodes[i].index;
               break;
             }
           
         }

       });

       gNodes = nodes;

       if (default_val == 1)
       {
         setDefault(nodes,view);
         displayLinks(nodes,iterval);        
       }else{

         updateSvg(nodes,view,iterval);
 
         if( view != "Stacked"){
            displayLinks(nodes,iterval);
         }
          
       }
      
    } 
