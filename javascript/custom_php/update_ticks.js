 function updateTicks(tick){
      if (tick == "5")
      {
      svg.selectAll("g.axis")
         .call(d3.svg.axis()
                    .scale(scale)
                    .orient("bottom")
                    .ticks(5) 
                    .tickFormat(function(d){return d + "us"}));
      }else if (tick == "10"){
      svg.selectAll("g.axis")
         .call(d3.svg.axis()
                    .scale(scale)
                    .orient("bottom")
                    .ticks(10)
                    .tickFormat(function(d){return d + "us"}));
      }
  }