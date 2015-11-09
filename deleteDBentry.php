<?php

include "connection_openDB.php";
include "connection_closeDB.php";
include "getData.php";

$filedata = $_POST['filename'];

//echo $filedata;

$filedata_split = explode("|",$filedata); 

echo $filedata_split[0];

//echo "DB entry delete request";

$db = connectDB();

$file_id = $filedata_split[0]; 

deleteApplication_types($db,$file_id);
deleteFile_ids($db,$file_id);
deleteTransaction_types($db,$file_id);
deleteTransactions($db,$file_id);

closeDB($db);

header("Location: index.php"); 


?> 
