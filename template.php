<?php

error_reporting(E_ALL);

include "connection_openDB.php";
include "connection_closeDB.php";
include "getData.php";

$db = connectDB();

$file_id = $_GET['fileid'];

$iteration = 0;

// create the views for bind step and 1st iteration
createTransaction_file($db,$file_id);
//createMisc_details($db,$file_id);

//$db->close();

?> 

<!DOCTYPE html>
  <head>
     <style>

     #div1 {
       position:absolute;
       left:50px;
       top:10px;
       background: rgba(255, 255, 215, 0.5);
       height: 130px;
       width:1400px;
     }
  
     div.tooltip {   
      position: absolute;           
      /*text-align: center;     
      width: 400px;                  
      height: 100px;*/                   
      padding: 2px;             
      font: 12px sans-serif;        
      background: lightsteelblue;   
      border: 0px;      
      border-radius: 8px;           
      pointer-events: none;         
   }


     </style>
    <link rel="stylesheet" type="text/css" href="css/style.css?n=1">
 
    <!-- Standered Libraries-->
    <script type="text/javascript" src="javascript/standard/d3.v3.min.js?n=1"></script>
    <script type="text/javascript" src="javascript/standard/jquery-2.0.3.min.js?n=1"></script>

    <!-- Libraries -->
   
    <script type="text/javascript" src="javascript/custom_php/testflow.js?n=1"></script>
    <script type="text/javascript" src="javascript/custom_php/flowposition.js?n=1"></script>
    <script type="text/javascript" src="javascript/custom_php/callchain.js?n=1"></script>
    <script type="text/javascript" src="javascript/custom_php/histogram.js?n=1"></script>
    <script type="text/javascript" src="javascript/custom_php/range.js?n=1"></script>
    <script type="text/javascript" src="javascript/custom_php/updateView.js?n=1"></script>
    <script type="text/javascript" src="javascript/custom_php/updateData.js?n=1"></script>
    <script type="text/javascript" src="javascript/custom_php/loadDefault.js?n=1"></script>
    <script type="text/javascript" src="javascript/custom_php/updateSVG.js?n=1"></script>
    <script type="text/javascript" src="javascript/custom_php/drawNode.js?n=1"></script>
    <script type="text/javascript" src="javascript/custom_php/update_scale.js?n=1"></script>
    <script type="text/javascript" src="javascript/custom_php/update_ticks.js?n=1"></script>
    
  </head>
  <body>
  
   <div id="div1">
     <center> Runtime of a Testflow of file <?php  

      $file_name = $_GET['filename']; 

      echo $file_name;

      ?></center>

      <form>
   
      <label> Select a view to visualize data:</label>
      <select id = "selectView">
        <option value="Stacked">Stacked</option>
        <option value="Horizontal" selected>Unstack</option>
      </select>      
      <!--<br/>--> 
    
      <!--
      &nbsp; &nbsp; &nbsp;
   
      <label> Choose a unit: </label>
      <input id = "radio1" type="radio" name="radioButton" value="ms" checked/>in ms
      <input id = "radio2" type="radio" name="radioButton" value="us" />in us 

      &nbsp; &nbsp; &nbsp;

      <label> Zoom :</label>
      <input id = "zoom1" type="radio" name="zoomButton" value="enable" />enable
      <input id = "zoom2" type="radio" name="zoomButton" value="disable" checked/>disable
      -->

      Transaction Start time : <input type="text" name="t_start" id="t_start"></input><b>ms</b>   
      Transaction Stop time : <input type="text" name="t_stop" id="t_stop"></input><b>ms</b>
   
      <input type="button" value="update" onclick="update()"/>

      <br/>   
      <br/>   

      <label> Select an iteration to view:</label>
        <select id = "iter_total">
        </select>

      <!--<label> Select a type to view:</label>
        <select id = "type_all">
        </select>-->

      <!--<label> Select a depth to view:</label>
        <select id = "depth_all">
        </select>-->

      </form>

   </div>

   <div id="div2_info">
   </div>

   <div id="div2_svg">
   </div>

   <div id="div_hist">
      <center> Distribution of the Runtime of a Testflow </center>

      <!--<form>
         <label> No of bins:<label>
         <input type="text" name="bins">
         <input type="submit" name="submit_bin" onclick="updateHistBins()" value="update">
         <input type="submit" name="submit_bin" onclick="updateHistBins()" value="default">
      </form>-->

   </div>

  <script>

   /*
    * Gobal variables
    */
    var workflow = d3.layout.workflow(),
        svg,
        vis,
        legend,
        scale,
        axis,
        zoom,
        nodes, 
        links,
        data_nodes_iter,
        data_links_iter,
        nodeLength,
        newdata = 0,
        updateNodeData = 0,
        view = 1,
        data_values,
        data_links,
        hist_created = 0,
        default_val = 1,
        hist_ini = 1,
        link_ini = 1,
        viewChange = 0,
        singleData = 0,
        iter_value,
        transaction_count,
        time_info,
        file_id,
        iter;

    var types = [];
    var type = [];

    var color = d3.scale.category20();

    color = d3.scale.quantile().domain([1,20]).range(["#1f77b4", "#ff7f0e", "#2ca02c","#d62728", "#9467bd",
                                                    "#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf",
                                                    "#008000","#20B2AA","#FF00FF","#BA55D3","#00FA9A",
                                                    "#FF4500","#DB7093","#FA8072","#87CEEB","#9ACD32",]);
    
    //Create svg layout
    var padding = 15;
    var margin = {top: 50, right: 20, bottom: 20, left: 10},
    w = 1500 - margin.left - margin.right,
    h = 900 - margin.top - margin.bottom,
    x = d3.scale.linear().domain([0, w]).range([0, w]),
    y = d3.scale.linear().domain([0, h]).range([0, h]);

    //Range of the scale
    var rangeBegin = 20;
    var rangeEnd =  1200;

    //Node attributes
    var node_height = 15;

    // Overhead  
    var ov_data = [];
   
    svg = d3.select("#div2_svg").append("svg")
      .attr("width", w + margin.left + margin.right)
      .attr("height", h + margin.top + margin.bottom)
      .attr("id","horizontal")
     .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    vis = d3.select("#div_hist").append("svg:svg")
    .attr("width", w + margin.left + margin.right)
      .attr("height", 500)
      .attr("id","histogram")
     .append("g")
      .attr("transform", "translate(10,10)");

    tooltip_div = d3.select("body").append("div")   
    .attr("class", "tooltip")               
    .style("opacity", 0);
        
    //Data processing 
    var dataModel = function(){
      this.processData = function(data){
     
        data_values = data;

        file_id = <?php echo $file_id ?>;

        iter_value = <?php echo $iteration ?>;

        transaction_count  = <?php 
        
        $count =  getTransaction_count_per_iter($db,$iteration); 
  
        echo $count

        ?>;

        time_info = <?php 

        $i = 0;

        $array =  getTransaction_duration($db,$i);
         
        $offset = $array[0];
        
        $this_array=  getTransaction_duration($db,$iteration);
   
        $start = $this_array[0] - $offset;
        $stop = $this_array[1] - $offset;
        $total = $this_array[2];

        $to_js = array();

        array_push($to_js,$start);
        array_push($to_js,$stop);
        array_push($to_js,$total);

        echo json_encode($to_js);

        ?>;

        console.log(time_info);
 
        $("#div2_info").append("<br>");
        $("#div2_info").append( "Iteration "+ iter_value + " has "+ transaction_count + " transactions.");
        $("#div2_info").append("<br>");
        $("#div2_info").append("Starting at " + time_info[0] + " ms"+ " Stopping at " + time_info[1]/1000 + " ms" +" Total duration is " + time_info[2]/1000 + " ms.");

        iter = <?php getIteration_count_javascript($db,$total_iter); ?>;
  
        for ( var i = 0; i < iter+1; i++ ){
             $('#iter_total').append($("<option/>", {
              value:i,
              text: "Iteration " + i
             }));
         }

        //types_array = <?php 

        //getTypesPerIter($db,$iteration,$types_array);  ?>;

        //console.log(types_array);

        /*$('#type_all').append($("<option/>", {
              value:"All",
              text: "All"
             }));

        for ( var i = 0; i < types_array.length; i++ ){
             $('#type_all').append($("<option/>", {
              value:types_array[i].type,
              text: types_array[i].type
             }));
         }*/

        createTestflow(data)
        
      } 
      
    }

    //Fetch the data
    var dataController = function(){
        this.getData = function(){

          console.log("Getting data from database");
          var dataElement = new dataModel();

          data_nodes = <?php getNodes($db,$nodes_array,$iteration,$file_id); 

          //array_splice($nodes,0,100);

          //echo $nodes;

          //echo json_encode($nodes);

          ?>;

          data_links = <?php getLinks($db,$links_array,$iteration); 

          //array_splice($links,0,99);

          //echo json_encode($links);
         
          ?>;

          dataElement.processData(data_nodes);

        }
    }

    //Set Scale 
   function setScale(dataRange){
   
      scale = d3.scale.linear()
         .domain([dataRange[0],dataRange[1]])
         .range([rangeBegin,rangeEnd]);
   }

    //create testflow
   function createTestflow(nodes){
   
     for (i = 0; i < nodes.length; ++i){ 
        nodes[i].index = i;
        o = nodes[i];
        o.prev = [];
        o.next = [];
        o.total = o.stopTime - o.startTime;
     }

     //console.log(nodes);

     if(nodes.length == undefined){
                 
        singleData = 1;
        DrawNode(nodes);

     }else{

        nodeLength = nodes.length;

        var start = new Date().getTime();

        //console.profile(["Initial data load"]);

        updateData(nodes,default_val);  

        //console.profileEnd() ;

        var end = new Date().getTime();
    
        var time = end - start;

        console.log('Execution time: ' + time);      
     }
    
   }

    // creating a new controller for Getting the data from json file
    var cntrl = new dataController();
    cntrl.getData();

     $("#iter_total").change(function() {

       //alert ("Reaching here before iter change")

       iter_value = $(this).val();
          
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

       url_count = "iteration.php";

       $.extend({
          getValues: function(url_link) {
          var result = null;
          $.ajax({
             url: url_count,
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

        transaction_count = $.getValues(url_count);

        console.log(transaction_count);

        url_duration = "duration.php";

        $.extend({
          getValues: function(url_link) {
          var result = null;
          $.ajax({
             url: url_duration,
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

        time_info = $.getValues(url_duration);
   
        //console.profile(["load data"]);

        //data_nodes= data_nodes.slice(0,300);
        //data_links = data_links.slice(0,299);

        loadData(data_nodes,default_val,iter_value,0,0);

        //console.profileEnd();

     });

    function loadData(data_nodes,default_val,iter_value,min,max){

        $("#div2_info").empty();
 
        $("#div2_info").append("<br>");
        $("#div2_info").append( "Iteration "+ iter_value + " has "+ transaction_count + " transactions.");
        $("#div2_info").append("<br>");
        $("#div2_info").append("Starting at " + time_info[0]/1000 + " ms"+ " Stopping at " + time_info[1]/1000 + " ms" +" Total duration is " + time_info[2]/1000 + " ms.");

     if(data_nodes.length == undefined){

         DrawNode(data_nodes); 

     }else if(data_nodes.length != nodeLength){

         //console.log("Reached new data update loop");

         links = [];
        
         workflow.nodes(data_nodes)
                 .links(links);          
 
         workflow.layout();

         newdata = 1;

         default_val = 0;
         link_ini = 0;

         nodeLength = data_nodes.length;

         var start = new Date().getTime();

         //console.profile(["New data with different node length"]);
         
         updateData(data_nodes,default_val,iter_value,min,max);

         //console.profileEnd();

         var end = new Date().getTime();
    
         var time = end - start;

         console.log('Execution time: ' + time);

      }else {

         default_val = 0;
         link_ini = 0;

         for (i = 0; i < data_nodes.length; ++i){ 
           data_nodes[i].index = i;
           o = data_nodes[i];
           o.prev = [];
           o.next = [];
           o.total = o.stopTime - o.startTime;
         }

         //console.log("Reached update loop with " + "min value is "+ min + "max value is " + max);

         var start = new Date().getTime();

         //console.profile(["New data with same node length"]);
     
         updateData(data_nodes,default_val,iter_value,min,max);

         //console.profileEnd();
 
         var end = new Date().getTime();
    
         var time = end - start;

         console.log('Execution time: ' + time);
      
      }

    }

   function update(){
 
       t_start = $("#t_start").val();   
       t_stop  = $("#t_stop").val();  

       t_start = t_start*1000;
       t_stop = t_stop*1000;

       updateNodeData = 1;  

       //console.log(t_start);
       //console.log(t_stop);

       loadData(data_nodes,default_val,iter_value,t_start,t_stop);
       
   }

    //Update svg for different view input
    $('#selectView').change(function(){ 
     view = $(this).val();
 
     viewChange=1;
  
     updateSvgView(gNodes,view,iter_value);
    });

     //Enable or disable zoom
    $("input[name='zoomButton']").change(function(){
      if ($("#zoom1").is(":checked")){
       
       //to enable zoom and pan
       d3.select("svg").call(zoom);

       d3.select("svg").call(pan);
       d3.select("svg").attr("transform", "translate(200,0) scale(2,2)");
      }else{
   
      } 
    });

   
    </script>
  </body>

</html> 

<?php

closeDB($db);

?>