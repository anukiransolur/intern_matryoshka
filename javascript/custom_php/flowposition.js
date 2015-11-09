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