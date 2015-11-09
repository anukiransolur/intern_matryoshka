<?php

error_reporting(E_ALL);

include "connection_openDB.php";
include "connection_closeDB.php";
include "getData.php";

$db = connectDB();

$file_id = $_GET['fileid'];

$iteration = 0;

createTransaction_file($db,$file_id);

?>
 
<html>
  <head>
    <title></title>
    <meta content="">
    <style>

     #div1 {
       position:absolute;
       left:50px;
       top:10px;
       background: rgba(255, 255, 215, 0.5);
       height: 130px;
       width:1400px;
     }

    </style>
      <link rel="stylesheet" type="text/css" href="css/style.css?n=1">
 
    <!-- Standered Libraries-->
    <script type="text/javascript" src="javascript/standard/d3.v3.min.js?n=1"></script>
    <script type="text/javascript" src="javascript/standard/jquery-2.0.3.min.js?n=1"></script>
    
    <!-- Libraries -->
    <!--<script type="text/javascript" src="javascript/custom/testflow.js?n=1"></script>-->
    <script type="text/javascript" src="javascript/custom_php/flowposition.js?n=1"></script>
    <script type="text/javascript" src="javascript/custom_php/concurrency.js?n=1"></script>
    <script type="text/javascript" src="javascript/custom_php/range.js?n=1"></script>
    <script type="text/javascript" src="javascript/custom_php/concurrency_pos.js?n=1"></script>
                              
  </head>
  <body>

  <div id="div1"><center> Concurrency </center>

  <form>

     <label> Select an iteration to view:</label>
        <select id = "iter_total">
        </select>

     <a href="images/async_example.png" target="_blank">Example</a>

  </form>

  </div>
  <div id="div2">

  </div>

  <script>

    /*
     * Global Variables
     */
    
    var padding = 15;
    var margin = {top: 50, right: 20, bottom: 20, left: 10},
    w = 1500 - margin.left - margin.right,
    h = 900 - margin.top - margin.bottom,
    x = d3.scale.linear().domain([0, w]).range([0, w]),
    y = d3.scale.linear().domain([0, h]).range([0, h]);
 
    var color = d3.scale.category10();
  
    var rangeBegin = 20;
    var rangeEnd =  1200;
   
    var svg_ini,
        svg,
        file_id,
        view,
        axis,
        legend,
        types = [],
        type = [];

    /*
     * Model
     */

     var ModelData = function(data_nodes,data_links){
   
        this.nodes = data_nodes;
        this.links = data_links;
     
        return this;
     }
   
    /*
     * View
     */
      
    // View object constructor 
    var ViewData = function( model ){
      this.nodes = model.nodes;
      this.links = model.links;
      this.workflow = null;
      this.svg = null;
      this.chart = null;
           
      return this;
    }

     ViewData.prototype.init = function(iter_nodes,iter_links,iter_val){

      svg_ini = d3.select(this.chart).append("svg:svg")
    .attr("width", w + margin.left + margin.right)
      .attr("height", h + margin.top + margin.bottom)
      .attr("id","concurrency")
     .append("g")
       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      //var data_val = this.model;

      iter = <?php getIteration_count_javascript($db,$total_iter); ?>;
  
      for ( var i = 1; i < iter+1; i++){
         $('#iter_total').append($("<option/>", {
            value:i,
            text: "Iteration " + i
         }));
      }

      this.render(iter_nodes,iter_links,iter_val);

     } 

    //Renderer 
 
    ViewData.prototype.render = function(iter_nodes,iter_links,iter_val){

      var data_val = this.model;

       if (iter_val == 0){

      var default_nodes = this.nodes;
      var defalut_links = this.links;

      } else {

      var default_nodes = iter_nodes;
      var defalut_links = iter_links;

      }
        
      var nodes = processNodes(default_nodes,defalut_links);

       //Array of node types
      var count = 0;
 
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

      svg_ini.append("g")
        .attr("class","axis")
        .call(axis);

      //Text for the axis
      svg_ini.append("g")
       .attr("class","axistext")
       .append("svg:text")
       .attr("x", w/2.5)                          //To place the text in the center
       .attr("y", -10)                            //To place the text above the aixs
       .style("text-anchor", "middle")
       .text("Runtime of a TestFlow");

       // add legend   
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
        .text(function(d) {return d;});


       concurrency(nodes);
    }
    
    /*
     * Controller
     */
      
    var Controller = function(){
        return this;
    };

    Controller.prototype.loadView = function(chart,iter_nodes,iter_links){
  
        //Get data from json
     
        data_nodes = <?php getNodes($db,$nodes_array,$iteration,$file_id); ?>;
        data_links = <?php getLinks($db,$links_array,$iteration); ?>;
        file_id = <?php echo $file_id ?>;
      
        var model = new ModelData(data_nodes,data_links);
      
        view = new ViewData(model);

        view.chart = chart;

        view.init(iter_nodes,iter_links,"0");
      
    }

     Controller.prototype.update = function(iter_nodes,iter_links,iter_val){

      var default_nodes = iter_nodes;
      var defalut_links = iter_links;
        
      var nodes = processNodes(default_nodes,defalut_links);

      concurrency(nodes);

    }

    //Set Scale 
    function setScale(dataRange){
   
      scale = d3.scale.linear()
         .domain([dataRange[0],dataRange[1]])
         .range([rangeBegin,rangeEnd]);
    }

    //Process the data
    function processNodes(display_nodes,display_links){

       var nodes = display_nodes;

       var setRange_data = setRange(nodes);
       var dataRange = setRange_data.dataRange;
        
      //Set scale to generate axis  
      setScale(dataRange);

      nodes = setRange_data.nodes;

      for (i = 0; i < nodes.length; ++i){ 
        nodes[i].index = i;
        o = nodes[i];
        o.prev = [];
        o.next = [];
        o.total = o.stopTime - o.startTime;
       }

       var links = display_links;

       linknodes = [];

       //console.log(nodes);
 
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

       links_length = links.length;

       while(links_length--) {

        o = links[links_length];

        if (typeof o.source == "number") o.source = nodes[o.source];
        if (typeof o.target == "number") o.target = nodes[o.target];
        {
          nodes[o.source.index].next.push(o.target.index);
          nodes[o.target.index].prev.push(o.source.index);
        }

        }

       temp_tree_data = nodes;

       nodes.forEach(function(d){

          if(d.next.length != 0){

            d.children = [];

            for(var i = 0;i<d.next.length;i++){
               d.children.push(temp_tree_data[d.next[i]]);
            }  
          } 

       })

       //workflow.nodes(nodes)
       //workflow.layout();

       position(nodes);
       
       return nodes;
    }
  
    cntrl = new Controller();
  
    cntrl.loadView("#div2",0,0);
    

    //Select differnet iteration to view
     $("#iter_total").change(function(){ 

        var iter_value = $(this).val();

        url = "iteration_nodes.php";

        $.extend({
          getValues: function(url) {
          var result = null;
          $.ajax({
             url: url,
             type: 'POST',
             data: {"itervalue":iter_value, "file_id":file_id},
             dataType: 'json',
             async: false,
             success: function(data) {
                 result = data;
             }
          });
          return result;
          }
        });

        data_nodes = $.getValues(url);

        url_link = "iteration_links.php";

        $.extend({
          getValues: function(url_link) {
          var result = null;
          $.ajax({
             url: url_link,
             type: 'POST',
             data: {"itervalue":iter_value, "file_id":file_id},
             dataType: 'json',
             async: false,
             success: function(data) {
                result = data;
             }
           });
           return result;
           }
        });

        data_links = $.getValues(url_link);

        cntrl.update(data_nodes,data_links,iter_value);
      
     });
    
  </script>  

  </body>

</html>
<?php

closeDB($db);

?>