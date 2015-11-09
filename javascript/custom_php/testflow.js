//Workflow layout for the front end visualization of the Workflow Editor
 d3.layout.workflow = function() {
  var workflow = {},
    event = d3.dispatch("start"),
    size = [1, 1],
    nodes = [],
    links = [],
    types = [];
      
 workflow.nodes = function(x) {
  if (!arguments.length) return nodes;
    nodes = x;
    return workflow;
  };
  
 workflow.links = function(x) {
    if (!arguments.length) return links;
    links = x;
    return workflow;
  };

 workflow.size = function(x) {
    if (!arguments.length) return size;
    size = x;
    return workflow;
  };
  
  workflow.types = function(x) {
    if (!arguments.length) return types;
    types = x;
    return workflow;
  };
  
  //Starts the simulation
  workflow.layout = function() {
    var i,
        j,
        o,
        width_testflow = size[0],
        height_testflow = size[1],
        row_height,
        n = nodes.length,
        m = links.length,
        t = types.length;

  // Sets the next and the prev fields of each node as empty initially and depth as -1 
  for (i = 0; i < n; ++i) {
  (o = nodes[i]).index = i;
      o = nodes[i];
      o.prev = [];
      o.next = [];
      o.depth = -1;
      o.total = o.stopTime - o.startTime;
    }
  
 /* var type = [];
  $.map(types,function(n,i){
  type[n] = i+1;
  });*/
  
  //Generates the neighbors of the node from links
  while(m--) {
      o = links[m];

      if (typeof o.source == "number") o.source = nodes[o.source];
      if (typeof o.target == "number") o.target = nodes[o.target];
      {
         nodes[o.source.index].next.push(o.target.index);
         nodes[o.target.index].prev.push(o.source.index);
      }

}
   
  //Function to find root nodes
  function findRootNodes(){
    var rootNodes = [];
    for (var r=0;r<n;r++)
    {
    if(nodes[r].prev.length < 1)
      {
        rootNodes.push(nodes[r]);
      }
    }
  return rootNodes;
  } 

  //for assigning depth based on dfs
  
//   var root_n = [];
//   root_n = findRootNodes();
//   
//   //Traverse child nodes for each root node 
//   for (var rn = 0; rn <root_n.length; rn++)
//   {
//     dfs(root_n[rn],rn);
//   }
//   
//   //Function to traverse all the child nodes in depth first order
//   function dfs(node,depth) 
//   {
//   
//    //check if depth is lesser than the current node, return if depth is less
//     if (depth < node.depth)
//       return
//   
//     node.depth = depth;
//     
//     if(node.next != undefined)  
//     {
//       var l = node.next.length;
//       while (l--)
//       {
//         dfs(nodes[node.next[l]],depth+1) 
//       } 
//     }
//    }

  position (nodes);

  /*
 
  //Fix position of each node
  function position(vis_node)
  {
      j = vis_node.length;
 
      col_height = height_testflow/j;
    
      var c_w = [];
    
      for(var x_t=0;x_t<types.length;x_t++){
         c_w[x_t] = 0;           
      }

      for(var x_t=0;x_t<types.length;x_t++){
         var cnt = 1;
         for(var n=0;n<vis_node.length;n++){
            if(vis_node[n].type == types[x_t]){
                c_w[x_t] = c_w[x_t] + 1; 
                vis_node[n].typeCount = cnt;
                cnt++;
            }
         }
      }

      var c_wid = [];

      for(var x_t=0;x_t<c_w.length;x_t++){
          c_wid[x_t] = col_height * c_w[x_t]; 
      }
       
      var c_wid_f = [];

      for(var x_t=0;x_t<types.length;x_t++){
         c_wid_f[x_t] = 0;           
      }

      c_wid_f[0] = 40;

      for(var x_t=1;x_t<c_wid.length;x_t++){
          c_wid_f[x_t] = c_wid_f[x_t - 1] + c_wid[x_t]; 
      }

      console.log(c_wid_f);

      for(var x_t=0;x_t<vis_node.length;x_t++){
          var z = type[vis_node[x_t].type];
          if(z == 1) {
             vis_node[x_t].position = 40;
          }else{
             var c =c_wid_f[z-2];
             vis_node[x_t].position = c + 40;
          }
      }
     
      console.log(vis_node);
             
      while(j--){   
               
         // with each block placed in different position

         vis_node[j].y = vis_node[j].position + (vis_node[j].typeCount * 10);
         vis_node[j].x = (vis_node[j].dstartTime);   
                        
      }
  }*/

  //Fix position of each node
  function position(vis_node){

        if (vis_node.length == undefined){
            vis_node.y = 40;
         }else {
            vis_node[0].y = 40;

             if(vis_node[0].children != undefined){
        
             for(var j=0;j<vis_node.length;j++){
                if(vis_node[j].children != undefined){
                  for (var k= 0 ; k< vis_node[j].children.length;k++){
                     vis_node[j].children[k].y = vis_node[j].y + 40;
                  }
                }
 
                vis_node[j].x = (vis_node[j].dstartTime);
               
             }
           }
        }

  }
    
  };

  return d3.rebind(workflow, event, "on");
};

 
