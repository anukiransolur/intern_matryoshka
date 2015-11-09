    var no_of_bins;

    // Adds histogram to the svg upon click of specific node
    function displayHist(hist_data,hist_ini){

     console.log(hist_data);

     var axis_text = hist_data.name;
// 
//      if (hist_data.pname){
//       
//           var searchString = hist_data.pname+"*"+hist_data.name ;
//       
//      }else{
//         
//           var searchString = hist_data.name ; 
//      }
//    
//      var hist_values = data_values[searchString];

     url = "histData.php";

     $.extend({
          getValues: function(url) {
          var result = null;
          $.ajax({
             url: url,
             type: 'POST',
             data: {"itervalue":iter_value, "file_id":file_id,"name":axis_text},
             dataType: 'json',
             async: false,
             success: function(data) {
                 result = data;
             }
          });
          return result;
          }
        });

     total = $.getValues(url);

     console.log(total)

     generateHistogram(total,hist_data.type,axis_text);
           
    }

  function generateHistogram(total,h_type,axis_text){

     var temp = total;

     if(temp.length != 1) {

     var values = [];

     temp.forEach(function(d){
        //d = d.split(' ').join('');
        tmp = parseInt(d.total);
        tmp = tmp/1000;
        values.push(tmp);
      });

     // A formatter for counts.
     var formatCount = d3.format(",.0f");

     var x1 = d3.scale.linear()
       .domain([ (d3.min(values)), d3.max(values)])
       .range([20, 1300]);

     var xAxis1 = d3.svg.axis()
      .scale(x1)
      .orient("bottom")
      .tickFormat(function(d){return d3.round(d,2) + "ms"});

     no_of_bins = x1.ticks(10);
    
     //no_of_bins = 5;

     // Generate a histogram using twenty uniformly-spaced bins.
     var data1 = d3.layout.histogram()
      .bins(no_of_bins)
      (values);

      var y1 = d3.scale.linear()
      .domain([0, (d3.max(data1, function(d) { return d.y; }))*2]) 
      .range([400, 0]);

      var tickCount = xAxis1.ticks()[0];

      var first = x1(x1.ticks(tickCount)[0]);
      var second = x1(x1.ticks(tickCount)[1]);

      //console.log(first);
      //console.log(second);
 
      var columnwidth = second - first;

    if(hist_ini == 0 && hist_created == 0 || hist_ini == 1){

    hist_created = 1;

    var bar = vis.append("svg:g")
     .attr("class","histogram")
     .selectAll(".bar")
      .data(data1)
    .enter().append("g")
     .attr("class", "bar")
     .attr("transform", function(d) { 
      return "translate(" + x1(d.x) + ", " + y1(d.y) + ")"; });
     
     bar.append("rect")
      .attr("x", 0)
      .attr("width", (columnwidth-1))
      .attr("height", function(d) { return 400 - y1(d.y); })
      .style("fill",color(type[h_type]))
      .style("opacity", 0.5);

     bar.append("text")
      .attr("dy", ".75em")
      .attr("y", -15)
      .attr("x", (columnwidth-1)/2)
      .style("fill","black")
      .attr("text-anchor", "middle")
      .text(function(d) { 
       if(formatCount(d.y)!="0"){
          return formatCount(d.y);
        }
        });

     vis.append("g")
      .attr("class", "xaxis1")
      .attr("transform", "translate(0,400)")
      .call(xAxis1);
    
      //Text for the axis
     vis.append("g")
       .append("svg:text")
       .attr("class","hist_text")
       .attr("x", w/2.5)                          //To place the text in the center
       .attr("y", 450)                            //To place the text above the aixs
       .style("text-anchor", "middle")
       .text(axis_text);
  
     }

    else {

     var initBar =  vis.selectAll("g.bar");
     var initAxisText = vis.selectAll("text.hist_text"); 
                   
     initBar.remove();
     initAxisText.remove();

     var bar = vis.append("svg:g")
      .attr("class","histogram")
      .selectAll(".bar")
      .data(data1)
    .enter().append("g")
     .attr("class", "bar")
     .attr("transform", function(d) { return "translate(" + x1(d.x) + "," + y1(d.y) + ")"; });
     
     bar.append("rect")
      .attr("x", 0)
      .attr("width", (columnwidth-1))
      .transition()
      .duration(2000)
      .attr("height", function(d) { 
       return 400 - y1(d.y); })
      .style("fill",color(type[h_type]))
      .style("opacity", 0.5);

     bar.append("text")
      .attr("dy", ".75em")
      .attr("y", -15)
      .attr("x", (columnwidth-1)/2)
      .style("fill","black")
      .attr("text-anchor", "middle")
      .text(function(d) { 
       
       if(formatCount(d.y)!="0"){
          return formatCount(d.y);
        }
        });

     vis.selectAll("g.xaxis1")
      .transition()
      .duration(2000)
      .call(xAxis1); 

      //Text for the axis
      vis.append("g")
       .append("svg:text")
       .attr("class","hist_text")
       .attr("x", w/2.5)                          //To place the text in the center
       .attr("y", 450)                            //To place the text above the aixs
       .style("text-anchor", "middle")
       .text(axis_text);
     
      }

    }
  
  }
