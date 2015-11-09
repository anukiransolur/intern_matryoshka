function generateHeatmap(data){

      console.log(data);

      iter = data.iteration;
    
      //colors = d3.scale.category10();
      
      //alternatively colorbrewer.YlGnBu[9]
      //days = ["Flow", "TestSuite", "TestMethod", "Java TestMethod", "mesurementRun", "Pattern"];

      //times = [1,2,3,4,5];
  
      times = [];

      for(var i=0;i<iter-1;i++){
        times[i]= i+2;
      }

      var count = 0;
      types = [];

       typeNodes = data["Refnodes2"];
 
      for(var i=0;i<typeNodes.length;i++){
        var temp = typeNodes[i].type;
          if(($.inArray(temp,types) == -1)){
            types[count] = typeNodes[i].type;
          count++; 
          }
      }

      $.map(types,function(n,i){
        type[n] = i+1;
      });
      
      days = types;

      var heatData = [];
 
      var temp_heatData = [];

      //for(var i=0;i<types.length;i++){
         for(var j=0;j<times.length;j++){
           temp_ref_nodes = "Refnodes" + times[j];
           temp_com_nodes = "Comnodes" + times[j];
           heatmaparray = createHeatmapObj(data[temp_ref_nodes],data[temp_com_nodes],times[j]);
           temp_heatData.push(heatmaparray);
         }
      //}

      //heatmapobj = createHeatmapObj(data["Refnodes2"],data["Comnodes2"],"Flow","2");
     
      console.log(temp_heatData);

      temp_days = [];

      temp_days_array = temp_heatData[0];

       for(var j=0;j<temp_heatData[0].length;j++){
            temp_days.push(temp_days_array[j].name);
         }

      days = temp_days;

      console.log(days.length);

      console.log(temp_heatData.length);

      for(var i=0;i<temp_heatData.length;i++){
         temp_obj = temp_heatData[i];
         for(var j=0;j<temp_heatData[i].length;j++){
            heatData.push(temp_obj[j])
         }
      }

      console.log(heatData);

      //data = [{ day:1,hour:1,value:16},{ day:1, hour:2, value:20},{ day:1, hour:3, value:0},{ day:1, hour:4, value:0},{ day:1, hour:5, value:0},{ day:2, hour:1, value:6},{ day:2, hour:2, value:2},{ day:2, hour:3, value:0},{ day:2, hour:4, value:0},{ day:2, hour:5, value:0},{ day:3, hour:1, value:5},{ day:3, hour:2, value:8},{ day:3, hour:3, value:8},{ day:3, hour:4, value:0},{ day:3, hour:5, value:0},{ day:4, hour:1, value:0},{ day:4, hour:2, value:0}, { day:4, hour:3, value:0},{ day:4, hour:4, value:0},{ day:4, hour:5, value:0},{ day:5, hour:1, value:2},{ day:5, hour:2, value:0},{ day:5, hour:3, value:8},{ day:5, hour:4, value:2},{ day:5, hour:5, value:0},{ day:6, hour:1, value:2},{ day:6, hour:2, value:0},{ day:6, hour:3, value:2},{ day:6, hour:4, value:0},{ day:6, hour:5, value:0},{ day:7, hour:1, value:7},{ day:7, hour:2, value:6},{ day:7, hour:3, value:0},{ day:7, hour:4, value:0},{ day:7, hour:5, value:0}];

      data = [{ day:1,hour:1,value:16},{ day:2, hour:1, value:6},{ day:3, hour:1, value:5},{ day:1, hour:3, value:0},{ day:1, hour:4, value:0},{ day:1, hour:5, value:0},{ day:1, hour:2, value:20},{ day:2, hour:2, value:2},{ day:2, hour:3, value:0},{ day:2, hour:4, value:0},{ day:2, hour:5, value:0},{ day:3, hour:2, value:8},{ day:3, hour:3, value:8},{ day:3, hour:4, value:0},{ day:3, hour:5, value:0},{ day:4, hour:1, value:0},{ day:4, hour:2, value:0}, { day:4, hour:3, value:0},{ day:4, hour:4, value:0},{ day:4, hour:5, value:0},{ day:5, hour:1, value:2},{ day:5, hour:2, value:0},{ day:5, hour:3, value:8},{ day:5, hour:4, value:2},{ day:5, hour:5, value:0},{ day:6, hour:1, value:2},{ day:6, hour:2, value:0},{ day:6, hour:3, value:2},{ day:6, hour:4, value:0},{ day:6, hour:5, value:0},{ day:7, hour:1, value:7},{ day:7, hour:2, value:6},{ day:7, hour:3, value:0},{ day:7, hour:4, value:0},{ day:7, hour:5, value:0}]
      
      //createHeatmap(data);

      height = 18 * days.length,

      createHeatmap(heatData);
}

function createHeatmapObj(heatRefNodes,heatComNodes,heatIter){
 
      //console.log(heatRefNodes);
      //console.log(heatComNodes);
      //console.log(heatType);

       var i = 0;
       heatmapArray = [];
    
       while(i<heatRefNodes.length){

          heatObj = {};

          heatObj.name  = heatRefNodes[i].name;
          heatObj.day  = i+1;
          heatObj.hour = heatIter;
          heatObj.value = (heatRefNodes[i].totalTime - heatComNodes[i].totalTime)/1000;

          heatmapArray.push(heatObj);
          
          i++;
       }

      return heatmapArray;    
}

function  createHeatmap(data){

          colors = [];

          var colors_neg = ["#E62E00","#FF3300","#FF4719","#FF5C33","#FF704D","#FF8566","#FFEFEB"];

          var colors_pos = ["#E0FFE0","#CCFFCC","#B2FFB2","#99FF99","#66FF66","#33FF33","#00FF00"];

          console.log(d3.min(data, function (d) { return d.value; }));        

          if (d3.min(data, function (d) { return d.value; }) <= -5 && d3.max(data, function (d) { return d.value; }) >= 1){
               colors_neg.forEach(function(d){
                   colors.push(d);
               })
               colors_pos.forEach(function(d){
                   colors.push(d);
               })
   
               buckets = colors.length;

           }else if(d3.max(data, function (d) { return d.value; }) <= 1){
              colors = colors_neg;
              buckets = colors.length;
           }else{
              colors = colors_pos;
              buckets = colors.length;
           }
    
          var colorScale = d3.scale.quantile()
              .domain([d3.min(data, function (d) { return d.value; }), buckets - 1, d3.max(data, function (d) { return d.value; })])
              .range(colors);

          var svg = d3.select("#div2").append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(600," + margin.top + ")");

          var dayLabels = svg.selectAll(".dayLabel")
              .data(days)
              .enter().append("text")
                .text(function (d) { return d; })
                .attr("x", 0)
                .attr("y", function (d, i) { return i * gridSize; })
                .style("text-anchor", "end")
                .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
                .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

          var timeLabels = svg.selectAll(".timeLabel")
              .data(times)
              .enter().append("text")
                .text(function(d) { return d; })
                .attr("x", function(d, i) { return i * gridSize; })
                .attr("y", 0)
                .style("text-anchor", "middle")
                .attr("transform", "translate(" + gridSize / 2 + ", -6)")
                .attr("class","timeLabel mono axis axis-worktime");

          var heatMap = svg.selectAll(".hour")
              .data(data)
              .enter().append("rect")
              .attr("x", function(d) { return (d.hour - 2) * gridSize; })
              .attr("y", function(d,i) { return (d.day - 1) * gridSize; })
              .attr("rx", 4)
              .attr("ry", 4)
              .attr("class", "hour bordered")
              .attr("width", gridSize)
              .attr("height", gridSize)
              .style("fill", colors[0]);

          heatMap.transition().duration(1000)
              .style("fill", function(d) { return colorScale(d.value); });

          heatMap.append("title").text(function(d) { return d.value; });
              
          var legend = svg.selectAll(".legend")
              .data([0].concat(colorScale.quantiles()), function(d) { return d; })
              .enter().append("g")
              .attr("class", "legend");

          legend.append("rect")
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height)
            .attr("width", legendElementWidth)
            .attr("height", gridSize / 2)
            .style("fill", function(d, i) { return colors[i]; });

          legend.append("text")
            .attr("class", "mono")
            .text(function(d) { return ">=" + Math.round(d); })
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height + gridSize)
            
      }