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
       width:1200px;
     }

    </style>
    <link rel="stylesheet" type="text/css" href="css/style.css?n=1">
   
    <!-- Standered Libraries-->
    <script type="text/javascript" src="javascript/standard/d3.v3.min.js?n=1"></script>
    <script type="text/javascript" src="javascript/standard/jquery-2.0.3.min.js?n=1"></script>
    
  </head>
  <body>

  <div id="div1"><center> Call tree of file <?php  

      $file_name = $_GET['filename']; 

      echo $file_name;

      ?> </center>

  <form>

     <label> Select an iteration to view:</label>
        <select id = "iter_total">
        </select>

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
    w = 2000 - margin.left - margin.right,
    h = 900 - margin.top - margin.bottom,
    x = d3.scale.linear().domain([0, w]).range([0, w]),
    y = d3.scale.linear().domain([0, h]).range([0, h]);
 
    var color = d3.scale.category10();

    var tree = d3.layout.tree()
          .size([h, w]);
 
    var diagonal = d3.svg.diagonal()
          .projection(function(d) { return [d.y, d.x]; });

    var i=0,
        vis,
        root,
        file_id,
        view;   

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

       vis = d3.select(this.chart).append("svg:svg")
    .attr("width", w + margin.left + margin.right)
      .attr("height", h + margin.top + margin.bottom)
      .attr("id","callTree")
     .append("g")
      .attr("transform", "translate(120,20)");

      //var data_val = this.model;

      iter = <?php getIteration_count_javascript($db,$total_iter); ?>;
  
      for ( var i = 0; i < iter+1; i++){
         $('#iter_total').append($("<option/>", {
            value:i,
            text: "Iteration " + i
         }));
      }

      this.render(iter_nodes,iter_links,iter_val);

     } 

    //Renderer 
 
    ViewData.prototype.render = function(iter_nodes,iter_links,iter_val){

      if (iter_val == 0){

      var default_nodes =  this.nodes;
      var defalut_links =  this.links;
      } else {

      var default_nodes = iter_nodes;
      var defalut_links = iter_links;

      }
        
      if(default_nodes.length == null || default_nodes.length ==1 ){
          document.getElementById("div2").textContent = "No call tree generated for this iteration/file";
      }else {
          var nodes = processNodes(default_nodes,defalut_links);
          init(nodes[0]);  
       } 

    }
    
    /*
     * Controller
     */
      
    var Controller = function(){
        return this;
    };

    Controller.prototype.loadView = function(chart,iter_nodes,iter_links){
  
        //Get data from database
     
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
        
      if(default_nodes.length == null || default_nodes.length ==1){
          document.getElementById("div2").textContent = "No call tree generated for this iteration/file";
      }else {
          var nodes = processNodes(default_nodes,defalut_links);
          init(nodes[0]);  
      }
    
    }

    function processNodes(display_nodes,display_links){

       var nodes = display_nodes;

       for (i = 0; i < nodes.length; ++i){ 
        nodes[i].index = i;
        o = nodes[i];
        o.prev = [];
        o.next = [];
        o.total = o.stopTime - o.startTime;
       }
        
       var links = display_links;

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

       nodes.forEach(function(d){

          var s = d.pname;
          var ch = d.name;    

          if(ch.indexOf(s) != -1){
             d.treename = ch.slice(s.length);
          }else if(s == "actml.FunctionalTest"){
             d.treename = ch.substring(ch.lastIndexOf(".") + 1);;
          }else {
             d.treename = ch;
          }

        })

       return nodes;

    }

    function init(data_val){
      root = data_val;
      root.x0 = h / 2;
      root.y0 = 100;

      function toggleAll(d) {
        if (d.children) {
          d.children.forEach(toggleAll);
          toggle(d);
        }
      }

      // Initialize the display to show a few nodes.
      root.children.forEach(toggleAll);
      toggle(root.children[1]);

      update(root);

    }
 
    function update(source) {
      var duration = d3.event && d3.event.altKey ? 5000 : 500;
  
      // Compute the new tree layout.
      var t_nodes = tree.nodes(root).reverse();
  
      // Normalize for fixed-depth.
      t_nodes.forEach(function(d) { d.y = d.depth * 180; });

      // Update the nodes
      var node = vis.selectAll("g.node")
       .data(t_nodes, function(d) { return d.id || (d.id = ++i); });

      // Enter any new nodes at the parent's previous position.

     var nodeEnter = node.enter().append("svg:g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
        .on("click", function(d) { toggle(d); update(d); });
  
     nodeEnter.append("svg:circle")
        .attr("r", 4.5)
        .style("fill", function(d) { return d._children ? "lightsteelblue" : "#000"; });
       

     nodeEnter.append("svg:text")
        .attr("x", function(d) { return d.children || d._children ? 10 : -10 ; })
        .attr("dy", "-0.5em")
        .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
        .text(function(d) { return d.treename; })
        .style("fill-opacity", 1e-6);

     nodeEnter.append("svg:title")
        .attr("x", function(d) { return d.children || d._children ? -10 : -10 ; })
        .attr("dy", "-0.5em")
        .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
        .text(function(d) { return d.name + "\n" + d.type; })
        .style("fill-opacity", 0.5);

     // Transition nodes to their new position.
     var nodeUpdate = node.transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

     nodeUpdate.select("circle")
        .attr("r", 4.5)
        .style("fill", function(d) { return d._children ? "lightsteelblue" : "#000"; });
        
     nodeUpdate.select("text")
        .style("fill-opacity", 1);

     // Transition exiting nodes to the parent's new position.
     var nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
        .remove();

     nodeExit.select("circle")
        .attr("r", 4.5);

     nodeExit.select("text")
        .style("fill-opacity", 1e-6);

     // Update the links
     var link = vis.selectAll("path.link")
        .data(tree.links(t_nodes), function(d) { return d.target.id; });

     // Enter any new links at the parent's previous position.
     link.enter().insert("svg:path", "g")
        .attr("class", "link")
        .attr("d", function(d) {
           var o = {x: source.x0, y: source.y0};
           return diagonal({source: o, target: o});
        })
      .transition()
      .duration(duration)
      .attr("d", diagonal);

    // Transition links to their new position.
    link.transition()
       .duration(duration)
       .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
       .duration(duration)
       .attr("d", function(d) {
          var o = {x: source.x, y: source.y};
          return diagonal({source: o, target: o});
        })
     .remove();

     // Stash the old positions for transition.
     t_nodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
     });

   }

   // Toggle children.
   function toggle(d) {
      if (d.children) {
         d._children = d.children;
         d.children = null;
      } else {
         d.children = d._children;
         d._children = null;
       }
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