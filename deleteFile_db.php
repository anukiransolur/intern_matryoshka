<?php

  $file = $_POST['filename'];

  unlink($file);
 
  header("Location: index.php"); 
  exit();

?> 
