// Set node range
function setRange(nodes,min,max){

    var rangeStart = [];
    var rangeStop = [];

    for(var i=0;i<nodes.length;i++){
       rangeStart[i] = parseInt(nodes[i].startTime);
       rangeStop[i] = parseInt(nodes[i].stopTime);
    }

    var offset = rangeStart[0]; 

    for(var i=0;i<nodes.length;i++){
       rangeStart[i] = rangeStart[i] - offset; 
       rangeStop[i]  = rangeStop[i] -  offset;
    }

    for(var i=0;i<nodes.length;i++){
       nodes[i].astartTime = rangeStart[i];
       nodes[i].astopTime = rangeStop[i];
    }

    
    dataRange = [d3.min(rangeStart),d3.max(rangeStop)];

    if(min){
    if(max){
     
        //console.log ("updating dataRange");
        
        dataRange = [min,max];
      
        //console.log(dataRange);
 
     }

    }

    var temp_scale = d3.scale.linear()
      .domain([dataRange[0],dataRange[1]])
      .range([rangeBegin,rangeEnd]);

    for (var i = 0; i < rangeStart.length; i++) {
        //console.log("Start Range of node " + i + "is " + rangeStart[i]);

        if(rangeStart[i] < dataRange[0])
        {
          rangeStart[i] = dataRange[0];
        }else if(rangeStart[i] > dataRange[1]){
          rangeStart[i] = dataRange[1];
        }
 
        rangeStart[i] = temp_scale(rangeStart[i]);
    }

    for (var i = 0; i < rangeStop.length; i++) {
        

        if(rangeStop[i] > dataRange[1])
        {
          rangeStop[i] = dataRange[1];
        }else if(rangeStop[i] < dataRange[0]){
          rangeStop[i] = dataRange[0];
        }

        //console.log("Stop Range of node " + i + "is " + rangeStop[i]);

       rangeStop[i] = temp_scale(rangeStop[i]);
    }

    for(var i=0;i<nodes.length;i++){
        nodes[i].dstartTime = rangeStart[i];
        nodes[i].dstopTime = rangeStop[i];
        nodes[i].dTotal = rangeStop[i] - rangeStart[i];
        nodes[i].ratio = parseInt(nodes[i].ratio);
    }

    return {
        nodes: nodes,
        dataRange : dataRange
    };
}

function updateNodeRange(min,max,nodes){

   //console.log(min);
   //console.log(max);

   dataRange = [min,max];

   //console.log(dataRange);

   var temp_scale = d3.scale.linear()
      .domain([dataRange[0],dataRange[1]])
      .range([rangeBegin,rangeEnd]);

    console.log(temp_scale(5));

    for(var i=0;i<nodes.length;i++){
        nodes[i].dstartTime = temp_scale(nodes[i].startTime);
        nodes[i].dstopTime = temp_scale(nodes[i].stopTime);
        nodes[i].dTotal = temp_scale(nodes[i].totalTime);
    }

    return {
        nodes: nodes,
        dataRange : dataRange
    };

}

