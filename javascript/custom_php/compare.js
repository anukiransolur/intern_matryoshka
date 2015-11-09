function compareFiles(nodes1,nodes2){

    refNodesLength = nodes1.length;
    comNodesLength = nodes2.length;

    comTypeFlow = [];
    refTypeFlow = [];
    
    nodes2.forEach(function(d){
      
       if (d.type == "Flow"){
          comTypeFlow.push(d);
       }
     
    })

    nodes1.forEach(function(d){
      
       if (d.type == "Flow"){
          refTypeFlow.push(d);
       }
    })

    data_units = [];

    data_units[0] = [];
    data_units[1] = []; 

    if(comTypeFlow.length > 1){
       for(var i = 0; i<comTypeFlow.length; i++){
          data_units[0].push(comTypeFlow[i]);
       }
    }else{
        data_units[0].push(comTypeFlow[0]);
    }

    if(refTypeFlow.length > 1){
       for(var i = 0; i<refTypeFlow.length; i++){
          data_units[1].push(refTypeFlow[i]);
       }
    }else{
        data_units[1].push(refTypeFlow[0]);
    }

    /*data_units = [[ {"name":"a","time":20}, {"name":"b","time":40},{"name":"c","time":40}],
                  [ {"name":"a","time":30}, {"name":"b","time":20},{"name":"c","time":45}]];*/

     var n = data_units[0].length, // number of samples
         m = 2; // number of series
    
    var max = d3.max(data_units.map(function(array) {
 
      //console.log(array)
       
      temp_array = [];

     for(var i=0;i<array.length;i++){
        temp_array.push(array[i].totalTime);
     }
  
      return d3.max(temp_array);
    }));

    //console.log(max);

    diff_val = [];

    var i = 0;

    var temp_1 =  data_units[0];
    var temp_2 =  data_units[1];

    var formatRatio = d3.format('.2f');

    while(i<data_units[0].length){
       
      diff_object = new Object();

      diff_object.name = temp_1[i].name;
      diff_object.time = temp_2[i].totalTime - temp_1[i].totalTime;
      diff_object.ratio = (diff_object.time/temp_2[i].totalTime) * 100;
      diff_object.ratio = formatRatio(diff_object.ratio);

      diff_val.push(diff_object);

      i++;
    
    }
   
    //diff_val = [{"name":"a","time":10,"ratio":33}, {"name":"b","time":-20, "ratio": 100},{"name":"c","time":5, "ratio": 10}];
        if(n == 1){
           var c_height = 200 * (n*2);
        }else{
           var c_height = 50 * n;
        }

  var  c_width = 1200,   
        xdiff = d3.scale.linear().domain([0, max]).range([0,c_width - 200]),
        c_y0 = d3.scale.ordinal().domain(d3.range(n)).rangeBands([0, c_height - 300], .2),
        c_y1 = d3.scale.ordinal().domain(d3.range(m)).rangeBands([0, c_y0.rangeBand()]),
        z = d3.scale.category20();

    scale = d3.scale.linear().domain([0, max]).range([0,1000]);

    var vis = d3.select("#div2").append("svg:svg")
       .attr("width", c_width + 20 )
       .attr("height", c_height + 40)
       .attr("id","compare")
      .append("g")
       .attr("transform", "translate(200,100)");

    console.log(data_units);
    
    var g = vis.selectAll("g")
       .data(data_units)
      .enter().append("svg:g")
       .attr("fill", function(d, i) { return z(i); })
       //.attr("opacity","0.5")
       .attr("transform", function(d, i) { return "translate( 0," + c_y1(i) + ")"; });

    var rect = g.selectAll("rect")
       .data(function(d){ return d;})
      .enter().append("svg:rect")
       .attr("class","compared")
       .attr("transform", function(d, i) { return "translate( 0 ," + c_y0(i) + ")"; })
       .attr("width", function(d){ return xdiff(d.totalTime)} )
       .attr("height", c_y1.rangeBand());
      
     diff_offset = [];
     diff_offset_ref = [];

     data_units[0].forEach(function(d){
        diff_offset.push(d.totalTime);
     })

     data_units[1].forEach(function(d){
        diff_offset_ref.push(d.totalTime);
     })

   console.log(diff_val);

  vis.append("svg:g").selectAll("rect")
      .data(diff_val)
    .enter().append("svg:rect")
      .attr("class","diff")
      .attr("transform", function(d, i) { return "translate(0, " + c_y0(i) + " )"; })
      .attr("width", function(d,i){  if (d.time > 0){ return xdiff(d.time); }else { d = -d.time; return xdiff(d);} ;})
      .attr("height", c_y1.rangeBand())
      .attr("x", function(d,i) { 
         if (d.time > 0){ return (xdiff(diff_offset[i])); }else { d = -d.time; return (xdiff(diff_offset_ref[i]));}
       })
      .attr("fill", function(d) { if (d.time > 0){ return "green"; }else{ return "red";} })
     .attr("opacity",0.5)

    var text = vis.selectAll("text")
      .data(data_units[0])
     .enter().append("svg:text")
      .attr("class", "group")
       //.attr("transform", function(d, i) { return "translate(0," + c_y0(i) + ")"; })
       //.attr("x", 5)
      .attr("y",500)
      .attr("dy", ".71em")
      .attr("text-anchor", "middle")
      //.text(function(d, i) { return String.fromCharCode(65 + i); })
      .text(function(d) { return d.name; })
      .attr("transform", function(d,i) { return "translate(-100," + (c_y0(i)-470) + ")" });

   var ratio = vis.append("g")
       .selectAll("text")
      .data(diff_val)
     .enter().append("svg:text")
      .attr("class", "group1")
      .attr("y",500)
      .attr("dy", ".71em")
      .attr("text-anchor", "middle")
      .text(function(d) { if (d.time > 0) { return d.ratio + "%" } else{ return d.ratio + "%"}; })
      .attr("fill", function(d) { if (d.time > 0){ return "green"; }else{ return "red";}})
      .attr("transform", function(d,i) { return "translate(1000," + (c_y0(i)-470) + ")" });

    var files = ["Filename","Reference"]

    legend = vis.append("g")
       .attr("class", "legend")
       .attr("h", 100)
       .attr("w", 100)
       .attr('transform', 'translate(-150,-50)');   
      
     legend.selectAll('rect')
       .data(files)
       .enter()
       .append("rect")
       .attr("x", 5)
       .attr("y", function(d, i){ return i * 20;})
       .attr("width", 10)
       .attr("height", 10)
       .style("fill", function(d,i) { return z(i);});
       //.style("opacity","0.5");
      
      legend.selectAll('text')
        .data(files)
        .enter()
        .append("text")
        .attr("x", 20)
        .attr("y", function(d, i){ return i *  20 + 9})
        .text(function(d) {return d;});

      axis =  d3.svg.axis()
         .scale(scale)
         .orient("bottom")
         .ticks(10)
         .tickFormat(function(d){return d/1000 + "ms"});

      vis.append("g")
        .attr("class","axis")
        .attr("transform", "translate(0,-10)")
        .call(axis);

      //Text for the axis
      vis.append("g")
       .attr("class","axistext")
       .append("svg:text")
       .attr("x", w/3)                          //To place the text in the center
       .attr("y", -20)                            //To place the text above the aixs
       .style("text-anchor", "middle")
       .text("Runtime of a TestFlow");
 
}