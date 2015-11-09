<?php

include "connection_openDB.php";
include "connection_closeDB.php";
include "getData.php";

$iterval = $_POST['itervalue'];

$file_id = $_POST['file_id'];

$db = connectDB();

createTransaction_file($db,$file_id);

$i = 0;

$array =  getTransaction_duration($db,$i);
         
$offset = $array[0];
        
$this_array=  getTransaction_duration($db,$iterval);
   
$start = $this_array[0] - $offset;
$stop = $this_array[1] - $offset;
$total = $this_array[2];

$to_js = array();

array_push($to_js,$start);
array_push($to_js,$stop);
array_push($to_js,$total);

echo json_encode($to_js);

closeDB($db);

?>