<?php

include "connection_openDB.php";
include "connection_closeDB.php";
include "getData.php";

$iterval = $_POST['itervalue'];
$file_id = $_POST['file_id'];

$db = connectDB();

createTransaction_file($db,$file_id);

getNodes($db,$nodes_array,$iterval,$file_id);

closeDB($db);

?>
