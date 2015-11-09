
<?php

$dbname = "visualization";

function connectDB(){

   $db= new mysqli('localhost','matryoshka','matrypw','visualization');

   if ( mysqli_connect_errno() )
   {

     //echo("Problem in connecting to db\n"); 
     exit();

   }
   else
   {
       //echo("Connection sucessful\n"); 

    }

   return $db;
}

?>
