<?php

include "connection_openDB.php";
include "connection_closeDB.php";
include "getData.php";

$iterval = $_POST['itervalue'];

$context = $_POST['name'];

$file_id = $_POST['file_id'];

$db = connectDB();

createTransaction_file($db,$file_id);
createTransaction_temp($db,$file_id);

getHistData($db,$context,$hist_array);

closeDB($db);

?>