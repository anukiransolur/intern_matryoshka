<?php

include "connection_openDB.php";
include "connection_closeDB.php";
include "getData.php";

$filedata = $_POST['filename'];

$vis = $_POST['vis'];

$filedata_split = explode("|",$filedata); 

//echo $filedata_split[0];
//echo $filedata_split[1];

$file_name =  explode("/",$filedata_split[1]); 

//echo $file_name[1];

$displayName = $file_name[count($file_name)-1];

//echo $displayName;

//echo $vis;

//header("Location:template.php?fileid=".$filedata_split[0]."&filename=".$displayName."&filedesc=".$filedata_split[2]);

if ($vis == "all"){

  header("Location:template.php?fileid=".$filedata_split[0]."&filename=".$displayName."&filedesc=".$filedata_split[2]);

}else if($vis == "tree"){

  header("Location:template_calltree.php?fileid=".$filedata_split[0]."&filename=".$displayName."&filedesc=".$filedata_split[2]);

}else if($vis == "concurrent"){

  header("Location:template_concurrent.php?fileid=".$filedata_split[0]."&filename=".$displayName."&filedesc=".$filedata_split[2]);

}


// $file_id = $filedata_split[0];
// 
// echo "File id:".$file_id;
// echo "</br>";
// 
// $db = connectDB();
// 
// createTransaction_file($db,$file_id);
// 
// $total_iter = getIteration_count($db,$total_iter);
// 
// echo "Total iterations are:". $total_iter;
// echo "</br>";
// 
// $i=0;
// 
// $offset =0;
// 
// while($i < $total_iter + 1){
// 
//    $array = array();
// 
//    $count =  getTransaction_count_per_iter($db,$i);
// 
//    $array =  getTransaction_duration($db,$i);
// 
//    if($i == 0){
//       $offset = $array[0];
//    }
// 
//    echo "</br>";
// 
//    $start = $array[0] - $offset;
//    $stop = $array[1]-$offset;
// 
//    echo "Iteration ". $i." has " .$count." transactions";
//    echo "</br>";
//    echo "Starting at ".$start." Stopping at ".$stop." Total duration is ".$array[2]."us";
//    echo "</br>";
//    echo "</br>";
// 
//    $i=$i+1;
// 
// }
// 
// $iteration = 1;
// 
// $root = getRootNodes($db,$file_id,$iteration,$rootnodes);
// 
// print_r($root);
// 
// 
// closeDB($db);

?>