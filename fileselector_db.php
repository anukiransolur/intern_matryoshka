<?php

error_reporting(E_ALL & ~E_NOTICE);

session_start();

ini_set('display_errors', '1');

$ses_id = session_id(); 

$submit = $_POST['submit_button'];

// if($submit){
// 
//   $desc = $_POST['desc'];
//     
//   //$vis = $_POST['vis'];
//  
// }else{
// 
//   $reffile = $_POST['refFilename'];
//   $comfile = $_POST['compfilename'];
//   $comparevis = $_POST['comparevis'];
// }


if ($submit == "Parse")
{  
  $desc = $_POST['desc'];
  $file = $_POST['filename'];

  //$cmd = './fillDB.py ' . $file . ' ' . '-m \'This is the description\'';

  //echo $cmd;

  $cmd = './fillDB.py ' . $file . ' -m \'' . $desc . '\'';

  //echo $cmd;
  
  $html_output = shell_exec($cmd);

  echo "$html_output";
}

header("Location:index.php");

?>




