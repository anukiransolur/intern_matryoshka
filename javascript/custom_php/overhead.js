function overhead(ov_data_val){

      svg_ov = d3.select("#div2").append("svg")
      .attr("width", w + margin.left + margin.right)
      .attr("height", h + margin.top + margin.bottom)
      .attr("id","overhead")
     .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
     
      axis_ov =  d3.svg.axis()
         .scale(scale)
         .orient("bottom")
         .ticks(10)
         .tickFormat(function(d){return d/1000 + "ms"});

      svg_ov.append("g")
        .attr("class","axis")
        .call(axis_ov);

      svg_ov.append("g")
       .attr("class","axistext")
       .append("svg:text")
       .attr("x", w/2.5)                          //To place the text in the center
       .attr("y", -10)                            //To place the text above the aixs
       .style("text-anchor", "middle")
       .text("Runtime of a TestFlow");

      //console.log(data_values);

      /*ov_data_all = ov_data_val;

      ov_data = [];

      //console.log(type);

      function ov_obj() {
         this.type = null;
         this.children = [];
		     this.sum = null;
       }

      ov_array = [];
	  
	  var f = new Array();
	  
	  for(var i=0;i<types.length;i++){
	   
	    ovobj = new ov_obj();	
	    ovobj.type = types[i];
	  
	    ov_array.push(ovobj);
		}
	  
	  //console.log(ov_array);
 
      ov_data_1 = [];
      ov_data_2 = [];
      ov_data_3 = [];
      ov_data_4 = [];
      ov_data_5 = [];

      ov_link_all = data_values["links2"];

      function ov_disp_obj(){
         this.type = null;
         this.parent = null;
         this.parentTime = null;
         this.children = null;
         this.childrenTime = null;
         this.sum = null;
      }

      ov_link_all.forEach(function(d){

         //console.log(d);

         ovdisp = new ov_disp_obj(); 
         ovdisp.type = d.target.type;
         ovdisp.parent = d.source.index;
         ovdisp.parentTime = d.source.dTotal;
         ovdisp.children = d.target.index;
         ovdisp.childrenTime = d.target.dTotal;

      });

      ov_data_all.forEach(function(d){
	  
	      ov_array.forEach(function(ovd){
		       if(d.type == ovd.type){
			        ovd.children.push(d.dTotal)
			     }
		    });
 
      });
	   
	  //console.log(ov_array);
	  
	  ov_array.forEach(function(ovd){
	  
	    ovd.sum = ovd.children.reduce(function (a, b) {
           return a + b;
        }, 0);
	   
	  });
	  
	  ov_array[0].offset = 0;
	  
	  for( var i=1;i<ov_array.length;i++){
	    
		ov_array[i].offset = ov_array[i-1].sum - ov_array[i].sum;
	  
	  }
	  
	  //console.log(ov_array);

      /*offset_2 = ov_data_1[0]- ov_data_2_sum;
      offset_3 = offset_2 + ov_data_2_sum - ov_data_3_sum;
      offset_4 = offset_3 + ov_data_3_sum - ov_data_4_sum;*/
	  
	 /* var offset_y = 20;
	  
	  ov_array.forEach(function(ovd){
	    
		svg_ov.append("rect")
       .attr("class","ovnodes")
         .attr("width", ovd.offset)
         .attr("height","30")
         .attr("x",20)
         .attr("y",offset_y)
         //.style("fill","rgb(31, 119, 180)")
		 .style("fill",color(ovd.type))
         .style("opacity","0.5");
		 
		 offset_y = offset_y + 40;
	   
	   });*/

     ov_data_all = data_values["overhead"];

     var offset_y = 20;

     ov_data_all.forEach(function(d){

       d.y = offset_y
    
       offset_y = offset_y + 40;  
  
     })
 
     //console.log(ov_data_all);

     svg_ov.selectAll("rect")
          .data(ov_data_all)
          .enter()
          .append("svg:rect")
       .attr("class","overhead")
         .attr("name",function(d) { return d.name; })
         .attr("width",function(d) { return (d.average/1000); })
         .attr("height", 30)
         .attr("x", "20")
         .attr("y", function(d) { return (d.y); } )
         .style("fill",color(30))
         .style("opacity","0.5");
 
           
    }

function overheadUnstack(){
    
    console.log(ov_data);   
    
    ov_scale = d3.scale.linear()
      .domain([0,450])
    .range([200,600]);
    
    ov_axis =  d3.svg.axis()
         .scale(ov_scale)
         .orient("left");
     
    svg_ov = d3.select("#overhead");

    console.log(svg_ov);
    
      svg_ov.selectAll("rect.ovnodes")
       .transition()
     .duration(2000)
     .attr("y",function (d){
         console.log(d);
         return type[d.type] * 40 ;
       })
         .attr ("x",function(d){
        return 20;
      });      
} 


function overheadStack(){

}

function overheadHist(){

}
