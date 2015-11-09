<?php

// Global variables
//$file_id = "5";

$types_array = array();
$nodes_array = array();
$links_array = array();
$files_array = array();
$hist_array = array();
$rootnodes = array();

$offset = "" ;
$total_iter = "";

global $iteration;

// Class definations
class transaction_types
{
   public $type = "";
   public $transaction_id = "";

   function createObject( $temp_type, $temp_transaction_type){

        $this->type = $temp_type;
        $this->transaction_id = $temp_transaction_type;
        return $this;
   }
}

class nodes
{
  public $name = "";
  public $type = "";
  public $startTime = "";
  public $totalTime = "";
  public $correlator = "";
  public $pcorr = "";
  public $iter = "";

  function createNode( $t_name, $t_type, $t_start, $t_stop,$t_total, $t_corr, $t_pcorr, $t_iter){

        $this->name = $t_name;
        $this->type = $t_type;
        $this->startTime = $t_start;
        $this->stopTime = $t_stop;
        $this->totalTime = $t_total;
        $this->correlator = $t_corr;
        $this->pcorr = $t_pcorr;
        $this->iter = $t_iter;
        
        return $this;
   }

}

class links
{
  //public $origin = "";
  //public $destination = "";
  public $corr = "";
  public $pcorr = "";

  function createLink($l_corr,$l_pcorr){

        //$this->origin = $l_origin;
        //$this->destination = $l_dest;
        $this->corr = $l_corr;
        $this->pcorr = $l_pcorr;
       
        return $this;
   }

}

class files
{
  public $file_id = "";
  public $filename = "";
  public $desc = "";

  function createFileObj( $file_id, $filename, $desc){

        $this->file_id = $file_id;
        $this->filename = $filename;
        $this->desc = $desc;
       
        return $this;
   }
}

class iterRange
{
  public $min = "";
  public $range_min = "";
  public $range_max = "";

  function createRangeObj( $min, $range_min, $range_max){

        $this->min = $min;
        $this->range_min = $range_min;
        $this->range_max = $range_max;
       
        return $this;
   }

}

class histData
{
  public $total = "";

  function createHistObj($t_total){

        $this->total = $t_total;

        return $this;
   }

}

//Create views

function createTransaction_file($db,$file_id){
    
      $sql = "CREATE TEMPORARY TABLE transaction_file (context VARCHAR(511),transaction_type binary(16), starttime bigint(20) unsigned,stoptime bigint(20) unsigned,correlator binary(16),parent_correlator binary(16),iteration int(10) unsigned);";

      //echo $sql;

      if($stmt = $db->prepare($sql)){

         /* execute query */
         $stmt->execute();
      }else{
 
       echo "File id is ". $file_id;

       echo "Error code ({$db->errno}): {$db->error}";
       
       die("Could not create transaction_file table");
    }

    /* close statement */
    $stmt->close();

    $sql = "INSERT INTO transaction_file (context,transaction_type,starttime,stoptime,correlator,parent_correlator,iteration) SELECT context,transaction_type,starttime,stoptime,correlator,parent_correlator,iteration FROM transactions WHERE file_id = " .$file_id.";";

      //echo $sql;

      if($stmt = $db->prepare($sql)){

         /* execute query */
         $stmt->execute();
      }else{
 
       echo "File id is ". $file_id;

       echo "Error code ({$db->errno}): {$db->error}";
       
       die("Could not create transaction_file view");
    }

    /* close statement */
    $stmt->close();

}

function createTransaction_temp($db,$file_id){
    
      $sql = "CREATE TEMPORARY TABLE transaction_temp (context VARCHAR(511),transaction_type binary(16), starttime bigint(20) unsigned,stoptime bigint(20) unsigned,correlator binary(16),parent_correlator binary(16),iteration int(10) unsigned);";

      //echo $sql;

      if($stmt = $db->prepare($sql)){

         /* execute query */
         $stmt->execute();
      }else{
 
       echo "File id is ". $file_id;

       echo "Error code ({$db->errno}): {$db->error}";
       
       die("Could not create transaction_file table");
    }

    /* close statement */
    $stmt->close();

    $sql = "INSERT INTO transaction_temp (context,transaction_type,starttime,stoptime,correlator,parent_correlator,iteration) SELECT context,transaction_type,starttime,stoptime,correlator,parent_correlator,iteration FROM transactions WHERE file_id = " .$file_id.";";

      //echo $sql;

      if($stmt = $db->prepare($sql)){

         /* execute query */
         $stmt->execute();
      }else{
 
       echo "File id is ". $file_id;

       echo "Error code ({$db->errno}): {$db->error}";
       
       die("Could not create transaction_file view");
    }

    /* close statement */
    $stmt->close();

}

function createTransaction_iter($db,$iteration){
    
      $sql = "CREATE VIEW transaction_iter AS SELECT context,transaction_type,starttime,stoptime,stoptime - starttime AS runtime,correlator,parent_correlator,iteration FROM transaction_file WHERE iteration = ".$iteration." ORDER BY starttime LIMIT 500;";

      //echo $sql;

      if($stmt = $db->prepare($sql)){

         //echo "Entered here";
   
         /* execute query */
         if ($stmt->execute()) {
          echo "Execute sucess";
        }else{

          //printf("Error: %s.\n", $stmt->error);

          echo "Error code ({$stmt->errno}): {$stmt->error}";
          
          echo "Execute no sucess";

        }

      }else{
 
       echo "File id is ". $file_id;

       echo "Error code ({$db->errno}): {$db->error}";
       
       die("Could not create transaction_iter view");
    }

    /* close statement */
    $stmt->close();

}

function createMisc_details($db,$file_id){
 
     $sql = "CREATE VIEW misc_details AS SELECT file_id,min(starttime) AS offset, max(iteration) AS total_iterations FROM transactions WHERE file_id=" . $file_id . ";" ;

     if($stmt = $db->prepare($sql)){
         /* execute query */
         $stmt->execute();
     }else{
     
       //echo "Error code ({$db->errno}): {$db->error}";

       die("Could not alter misc_details view");
    }

    /* close statement */
    $stmt->close();

}

// Drop views

function dropTransaction_file($db){
    
       if ($stmt = $db->prepare("DROP VIEW transaction_file;")) {

         /* execute query */
         $stmt->execute();

         /* close statement */
         $stmt->close();
    } else{
         die("Could not drop view");
    }
}

function dropTransaction_iter($db){
    
       if ($stmt = $db->prepare("DROP VIEW transaction_iter;")) {

         /* execute query */
         $stmt->execute();

         /* close statement */
         $stmt->close();
    } else{
         die("Could not drop view");
    }
}

function dropMisc_details($db){

if ($stmt = $db->prepare("DROP VIEW misc_details;")) {

         /* execute query */
         $stmt->execute();

         /* close statement */
         $stmt->close();
    } else{
         die("Could not drop view");
    }

}
    
function getTransaction_types($db,$file_id,$types_array){

   /* create a prepared statement */
   if ($stmt = $db->prepare("SELECT name,HEX(transaction_uid) FROM transaction_types WHERE file_id=?")) {

       /* bind parameters for markers */
       $stmt->bind_param("s", $file_id);

        /* execute query */
        $stmt->execute();

        /* bind result variables */
        $stmt->bind_result($types,$transaction_id);

        /* fetch value */
        //$stmt->fetch();

        /* fetch values */
        while ($stmt->fetch()) {
        
           //printf("File_id %s has type %s transaction_id %s\n", $file_id, $types,$transaction_id);

           $temp_object = new transaction_types;

           $object = $temp_object->createObject($types,$transaction_id);

           array_push($types_array,$object);
         }

         echo json_encode($types_array);

         /* close statement */
          $stmt->close();
     }

}

function getTypesPerIter($db,$iteration,$types_array){

   /* create a prepared statement */
   if ($stmt = $db->prepare("SELECT DISTINCT name,HEX(transaction_uid) FROM transaction_file T INNER JOIN transaction_types TT ON T.transaction_type = TT.transaction_uid AND iteration = ". $iteration .";")) {

       /* bind parameters for markers */
       //$stmt->bind_param("s", $file_id);

        /* execute query */
        $stmt->execute();

        /* bind result variables */
        $stmt->bind_result($types,$transaction_id);

        /* fetch value */
        //$stmt->fetch();

        /* fetch values */
        while ($stmt->fetch()) {
        
           //printf("File_id %s has type %s transaction_id %s\n", $file_id, $types,$transaction_id);

           $temp_object = new transaction_types;

           $object = $temp_object->createObject($types,$transaction_id);

           array_push($types_array,$object);
         }

         echo json_encode($types_array);

         /* close statement */
          $stmt->close();
     }

}

function getNodes($db,$nodes_array,$iteration,$file_id){

     $sql = "SELECT context,name,starttime,stoptime,stoptime - starttime AS runtime,HEX(correlator),HEX(parent_correlator),iteration FROM transaction_file T INNER JOIN transaction_types TT ON T.transaction_type = TT.transaction_uid AND TT.file_id =" . $file_id ." AND T.iteration =".$iteration." ORDER BY starttime LIMIT 5000;";

     //echo $sql;

     if($stmt = $db->prepare($sql)){

      /* execute query */
      //$stmt->execute();

      if ( $stmt->execute()){
        
      /* bind result variables */
      $stmt->bind_result($t_name, $t_type, $t_start, $t_stop,$t_total, $t_corr, $t_pcorr, $t_iter);

      /* fetch values */
      while ($stmt->fetch()) {
        
          $temp_object = new nodes;

          $object = $temp_object->createNode($t_name, $t_type, $t_start, $t_stop,$t_total, $t_corr, $t_pcorr, $t_iter);

          array_push($nodes_array,$object);
       }

       //echo json_encode($nodes_array);

       

       }else{
 
           echo "Error code ({$stmt->errno}): {$stmt->error}";
      
       }

       /* close statement */
       $stmt->close();

       //array_splice($nodes_array,0,100);

       echo json_encode($nodes_array);

     }else{

       echo "File id is ". $file_id;

       echo "Error code ({$db->errno}): {$db->error}";
       
       die("Could not execute select prep statement");
      
     }
}

function getLinks($db,$links_array,$iteration){

    $sql = "SELECT HEX(correlator) AS corr, HEX(parent_correlator) AS pcorr FROM transaction_file WHERE iteration =" .$iteration." AND HEX(parent_correlator) IS NOT NULL ORDER BY starttime LIMIT 4999;";

    //echo $sql;

     if($stmt = $db->prepare($sql)){

    /* create a prepared statement */
    //if ($stmt = $db->prepare("SELECT s.context AS 'origin', d.context AS 'destination',HEX(d.correlator) AS corr,HEX(d.parent_correlator) AS pcorr FROM transaction_iter d INNER JOIN transaction_iter s ON d.parent_correlator = s.correlator")) {

        /* execute query */
      if ( $stmt->execute()){
        /* bind result variables */
        $stmt->bind_result($l_corr, $l_pcorr);

        /* fetch values */
        while ($stmt->fetch()) {
        
          $temp_object = new links;

          $object = $temp_object->createLink($l_corr, $l_pcorr);
  
          //echo json_encode($object);

          array_push($links_array,$object);
        }

        //echo json_encode($links_array);

      }else{
        echo "Error code ({$stmt->errno}): {$stmt->error}";
      }

        /* close statement */
        $stmt->close();

        //array_splice($links_array,0,100);
 
        echo json_encode($links_array);

        //return $links_array;

     }else{
        echo "Error code ({$db->errno}): {$db->error}";
      
     }

}

function getTotal_iteration($db,$offset,$total_iter){

    /* create a prepared statement */
    if ($stmt = $db->prepare("SELECT offset,total_iterations FROM misc_details")) {

        /* execute query */
        $stmt->execute();

        /* bind result variables */
        $stmt->bind_result($offset,$total_iter);

        /* fetch value */
        $stmt->fetch();
      
        echo $total_iter;

        /* close statement */
        $stmt->close();
     }

}

function getfiles($db,$files_array){

       $sql = "SELECT * from file_ids";

     if($stmt = $db->prepare($sql)){

        /* execute query */
        $stmt->execute();

        /* bind result variables */
        $stmt->bind_result($f_file_id, $f_filename, $f_desc);

        /* fetch values */
        while ($stmt->fetch()) {
        
          $temp_object = new files;

          $object = $temp_object->createFileObj($f_file_id, $f_filename, $f_desc);

          array_push($files_array,$object);
        }

        echo json_encode($files_array);

        //echo $files_array;

        /* close statement */
        $stmt->close();
     }


}

function getIterRange($db,$iteration){
   
     $sql = "SELECT min(starttime)as min ,starttime-min(starttime) as range_min ,stoptime-min(starttime) as range_max FROM transaction_file WHERE iteration=".$iteration.";";

     $object = "";

     if($stmt = $db->prepare($sql)){

        /* execute query */
        $stmt->execute();

        /* bind result variables */
        $stmt->bind_result($r_min, $r_range_min, $r_range_max);

        /* fetch values */
        while ($stmt->fetch()) {
        
          $temp_object = new iterRange;

          $object = $temp_object->createRangeObj($r_min, $r_range_min, $r_range_max);

        }

        echo json_encode($object);

        //echo $object;
       
        /* close statement */
        $stmt->close();
     }

}

function getNodesForRange($db,$file_id,$min,$iteration,$start_range,$stop_range,$nodes_array){

     $sql = "SELECT context,name,(starttime-".$min.")/1000,(stoptime-".$min.")/1000, runtime/1000,HEX(correlator),HEX(parent_correlator),iteration FROM transaction_file T INNER JOIN transaction_types TT ON T.transaction_type = TT.transaction_uid AND TT.file_id=".$file_id." AND iteration=" .$iteration ." AND (starttime-".$min.")/1000 > ".$start_range." AND (stoptime-".$min.")/1000 < ".$stop_range;

     //$sql = "SELECT context,name,(starttime-".$min.")/1000,(stoptime-".$min.")/1000, runtime/1000,HEX(correlator),HEX(parent_correlator),iteration FROM transaction_iter T INNER JOIN transaction_types TT ON T.transaction_type = TT.transaction_uid AND (starttime-".$min.")/1000 > ".$start_range." AND (stoptime-".$min.")/1000 < ".$stop_range;

     //echo $sql;

     if($stmt = $db->prepare($sql)){

     /* execute query */
      $stmt->execute();

      /* bind result variables */
      $stmt->bind_result($t_name, $t_type, $t_start, $t_stop,$t_total, $t_corr, $t_pcorr, $t_iter);

       /* fetch values */
      while ($stmt->fetch()) {
        
          $temp_object = new nodes;

          $object = $temp_object->createNode($t_name, $t_type, $t_start, $t_stop,$t_total, $t_corr, $t_pcorr, $t_iter);

          array_push($nodes_array,$object);
       }

       echo json_encode($nodes_array);

       /* close statement */
       $stmt->close();

    }else{
       
       echo "File id is ". $file_id;
       echo "iteration is ". $iteration;
       echo "Min is ". $min;
       echo "Start is ". $start_range;
       echo "Stop is ". $stop_range;

       echo "Error code ({$db->errno}): {$db->error}";
       
       die("Could not create transaction_iter view");
 
    }

}

function getHistData($db,$context,$hist_array){
   
     $sql = "SELECT T.stoptime - T.starttime AS total FROM transaction_file T INNER JOIN transaction_temp TT ON T.parent_correlator= TT.correlator AND T.context = " ."'". $context ."'" ." ORDER BY T.starttime;";

  
     if($stmt = $db->prepare($sql)){

        /* execute query */
        $stmt->execute();

        /* bind result variables */
        $stmt->bind_result($t_total);

        /* fetch values */
        while ($stmt->fetch()) {

          $temp_object = new histData;

          $object = $temp_object->createHistObj($t_total);

          array_push($hist_array,$object);

        }

        echo json_encode($hist_array);

        /* close statement */
        $stmt->close();

     }

}


function getIteration_count_javascript($db,$total_iter){

    /* create a prepared statement */
    if ($stmt = $db->prepare("SELECT max(iteration) FROM transaction_file")) {

        /* execute query */
        $stmt->execute();

        /* bind result variables */
        $stmt->bind_result($total_iter);

        /* fetch value */
        $stmt->fetch();
      
        echo $total_iter;

        /* close statement */
        $stmt->close();

        //return $total_iter;
     }

}

function getIteration_count($db,$total_iter){

    /* create a prepared statement */
    if ($stmt = $db->prepare("SELECT max(iteration) FROM transaction_file")) {

        /* execute query */
        $stmt->execute();

        /* bind result variables */
        $stmt->bind_result($total_iter);

        /* fetch value */
        $stmt->fetch();
      
        //echo $total_iter;

        /* close statement */
        $stmt->close();

        return $total_iter;
     }

}

function getTransaction_duration($db,$iteration){

    $array = array();

    /* create a prepared statement */
    if ($stmt = $db->prepare("SELECT min(starttime),max(stoptime),max(stoptime-starttime) AS runtime FROM transaction_file where iteration=".$iteration.";")) {

        /* execute query */
        $stmt->execute();

        /* bind result variables */
        $stmt->bind_result($start,$stop,$total);

        /* fetch value */
        $stmt->fetch();
      
        //echo $total_iter;

        array_push($array,$start);
        array_push($array,$stop);
        array_push($array,$total);

        /* close statement */
        $stmt->close();

        return $array;
     }

}

function getTransaction_count_per_iter($db,$iteration){

    /* create a prepared statement */
    if ($stmt = $db->prepare("SELECT COUNT(*) FROM transaction_file where iteration=".$iteration.";")) {

        /* execute query */
        $stmt->execute();

        /* bind result variables */
        $stmt->bind_result($count);

        /* fetch value */
        $stmt->fetch();
      
        /* close statement */
        $stmt->close();

        return $count;
     }
}


function getRootNodes($db,$file_id,$iteration,$rootnodes){

    $sql ="SELECT context,name,starttime,stoptime,stoptime - starttime AS runtime,HEX(correlator),HEX(parent_correlator),iteration FROM transaction_file T INNER JOIN transaction_types TT ON T.transaction_type = TT.transaction_uid AND TT.file_id = ".$file_id." AND T.iteration = ".$iteration." AND HEX(parent_correlator) IS NULL ORDER BY starttime;";

    /* create a prepared statement */
    if ($stmt = $db->prepare($sql)) {

        /* execute query */
        $stmt->execute();

        /* bind result variables */
        $stmt->bind_result($t_name, $t_type, $t_start, $t_stop,$t_total, $t_corr, $t_pcorr, $t_iter);

        /* fetch value */
        $stmt->fetch();
      
        //echo $total_iter;
      
        while ($stmt->fetch()) {
        
          $temp_object = new nodes;

          $object = $temp_object->createNode($t_name, $t_type, $t_start, $t_stop,$t_total, $t_corr, $t_pcorr, $t_iter);

          array_push($rootnodes,$object);
        }
        

        /* close statement */
        $stmt->close();

        return $rootnodes;
     }

}

function deleteApplication_types($db,$file_id){

    /* create a prepared statement */
    if ($stmt = $db->prepare("DELETE FROM application_types WHERE file_id=".$file_id.";")) {

        /* execute query */
        $stmt->execute();

        /* close statement */
        $stmt->close();

     }
}

function deleteFile_ids($db,$file_id){
   
    /* create a prepared statement */
    if ($stmt = $db->prepare("DELETE FROM file_ids WHERE file_id=".$file_id.";")) {

        /* execute query */
        $stmt->execute();

        /* close statement */
        $stmt->close();

     } 
 
}

function deleteTransaction_types($db,$file_id){
   
    /* create a prepared statement */
    if ($stmt = $db->prepare("DELETE FROM transaction_types WHERE file_id=".$file_id.";")) {

        /* execute query */
        $stmt->execute();

        /* close statement */
        $stmt->close();

     } 
 
}

function deleteTransactions($db,$file_id){
   
    /* create a prepared statement */
    if ($stmt = $db->prepare("DELETE FROM transactions WHERE file_id=".$file_id.";")) {

        /* execute query */
        $stmt->execute();

        /* close statement */
        $stmt->close();

     } 
 
}

?>