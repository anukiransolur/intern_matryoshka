<?php

include "connection_openDB.php";
include "connection_closeDB.php";
include "getData.php";

$iterval = $_POST['itervalue'];

$file_id = $_POST['file_id'];

$db = connectDB();

createTransaction_file($db,$file_id);

$count =  getTransaction_count_per_iter($db,$iterval); 
  
echo $count;

closeDB($db);


// $file_id = $_POST['file_id'];
// 
// $flag = $_POST['flag'];
// 
// $db = connectDB();
// 
// createTransaction_file($db,$file_id);
// 
// if ($flag == 0){
// 
//   getIterRange($db,$iterval);
// 
// }else{
// 
// $min = $_POST['min'];
// $start_range = $_POST['start'];
// $stop_range = $_POST['stop'];
// 
// //    echo $file_id;
// //    echo ",";
// //    echo $min;
// //    echo ",";
// //    echo $iterval;
// //    echo ",";
// //    echo $start_range;
// //    echo ",";
// //    echo $stop_range;
// 
//   getNodesForRange($db,$file_id,$min,$iterval,$start_range,$stop_range,$nodes_array);
// 
// }
//closeDB($db);

?>