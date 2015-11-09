function position_concurrency(child_nodes, start_pos){

     var  updated_pos_mat = [];
     
     child_nodes.forEach(function(d){
         updated_pos_mat.push([d.con_id]);
    });
    
   //pass1

      var pass = updated_pos_mat.length - 1;

      while ( pass != 0){

      //console.log( "At " + pass + " pass");
  
      var removed = 0;
  
      for( var i=1;i<updated_pos_mat.length;i++){
      
      temp_ival = updated_pos_mat[i];
      
      //console.log(" Before comaparison, at iteration " + i + " : " + " Updated position matrix is");
      //console.log(updated_pos_mat);
     
      for(var j=0;j<updated_pos_mat.length;j++){
        temp_jval = updated_pos_mat[j];

         if(i != j && i>j && (i-j == 1)){

           if((temp_ival.length == 1) && (temp_jval.length == 1)){
    
              if(child_nodes[temp_ival[0]].dstartTime > child_nodes[temp_jval[0]].dstopTime){

                 //console.log("Push the node " + child_nodes[temp_ival[0]].con_id + " a level above");
        
                 updated_pos_mat[j].push(child_nodes[temp_ival[0]].con_id);

                 //console.log("After pushing the data update matrix is:");
                 //console.log(updated_pos_mat);

                 break;
              }     
           }
         
           if((temp_ival.length != 1) && (temp_jval.length == 1)){

              for(var k = 0; k< temp_ival.length; k++){

                 if(child_nodes[temp_ival[k]].dstartTime > child_nodes[temp_jval[0]].dstopTime){

                    //console.log("Push the node " + child_nodes[temp_ival[k]].con_id + " a level above");

                    updated_pos_mat[j].push(child_nodes[temp_ival[k]].con_id);
                 
                    break;
                 }
               
              }

            } 

            if((temp_ival.length == 1) && (temp_jval.length != 1)){

              temp_arr = [];

              for(var k = 0; k< temp_jval.length; k++){

                 if(child_nodes[temp_ival[0]].dstartTime > child_nodes[temp_jval[k]].dstopTime){

                    temp_arr.push(1);
            
                    //updated_pos_mat[j].push(child_nodes[temp_ival[0]].con_id);
                 
                    //break;
                 }
               
              }

              temp_arr_sum = temp_arr.reduce(function (a, b) {
                  return a + b;
                 }, 0);

                if(temp_arr_sum == temp_jval.length){

                    //console.log("Push the node " + child_nodes[temp_ival[0]].con_id + " a level above");              

                    updated_pos_mat[j].push(child_nodes[temp_ival[0]].con_id);             
                }
             
            } 

            if((temp_ival.length != 1) && (temp_jval.length != 1)){
 
              for(var k = 0; k< temp_ival.length; k++){
 
                 temp_arr = [];

                 for(var l = 0; l< temp_jval.length; l++){

                      if(child_nodes[temp_ival[k]].dstartTime > child_nodes[temp_jval[l]].dstopTime){
            
                        //updated_pos_mat[j].push(child_nodes[temp_ival[k]].con_id);
                 
                        //break;
                     }

                 }
            
                temp_arr_sum = temp_arr.reduce(function (a, b) {
                  return a + b;
                 }, 0);

                if(temp_arr_sum == temp_jval.length){

                    //console.log("Push the node " + child_nodes[temp_ival[k]].con_id + " a level above");
                
                    updated_pos_mat[j].push(child_nodes[temp_ival[k]].con_id);             
                }
                 
              }
            } 
         
         }
      }

      //console.log(" After comparison, at iteration " + i + " : " + " Updated position matrix is");
      //console.log(updated_pos_mat);
    }

    for(var u = 1; u<updated_pos_mat.length; u++){

        var temp_val =  updated_pos_mat[u];
        var temp_valp = updated_pos_mat[u-1];
       
        for(var v = 0; v < temp_val.length; v++){
     
            for(var s = 0; s < temp_valp.length; s++){

               if( temp_val[v] == temp_valp[s]){

                  updated_pos_mat[u].splice(v,1);

               }
               
            }
        }

    }

    for(var i = 0; i<updated_pos_mat.length; i++){

         //console.log(updated_pos_mat[i].length);
 
         if(updated_pos_mat[i].length == 0){

              //console.log("removing the empty array");
     
              updated_pos_mat.splice(i,1);
         
         }
  
    }

    pass--;

    }
 
    //console.log(updated_pos_mat);

    pass1_y = start_pos;

       updated_pos_mat.forEach(function(d){
         
          val = d;  
       
          if(val.length > 1){

             //console.log("reached  if loop");
            
             for(var i=0;i<val.length;i++){
 
               //console.log("reached  for loop");
       
               i_val = val[i];
            
               child_nodes[i_val].y = pass1_y;
             }  
          
          }else {

              //console.log("reached  else  loop");

              child_nodes[val[0]].y = pass1_y;
 
          }

          pass1_y = pass1_y + 40;
 
       })

     //console.log(child_nodes);

     return child_nodes;

}