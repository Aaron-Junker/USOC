<?php
if(isset($_POST["C"])){
$to = "newsletter@casegames.ch";
$subject = "Neuer Blogbeitrag";
$txt =$_POST["C"];

$header[] = 'MIME-Version: 1.0';
$header[] = 'Content-type: text/html; charset=iso-8859-1';
$header[] = "From: noreply@casegames.ch";
try{
mail($to,$subject,$txt,implode("\r\n", $header));

}catch (Exception $e){
  echo 'Exception abgefangen: ',  $e->getMessage(), "\n";
}
echo "gesendet!";
	}
?>
