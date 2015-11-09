function updateScale(flag){

      if (flag == "us")
      {
      svg.selectAll("g.axis")
         .call(d3.svg.axis()
                    .scale(scale)
                    .orient("bottom")
                    .tickFormat(function(d){return d + "us"}));
      }else if (flag == "ms"){
      svg.selectAll("g.axis")
         .call(d3.svg.axis()
                    .scale(scale)
                    .orient("bottom")
                    .tickFormat(function(d){return d/1000 + "ms"}));
      }
}