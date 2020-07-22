<?php
  session_start();
  $logina = 0;
  require_once ('configuration.php');
  $db_link = mysqli_connect (MYSQL_HOST,MYSQL_BENUTZER,MYSQL_KENNWORT,MYSQL_DATENBANK);
  $sql = "SELECT * FROM User Where Username = '".$_SESSION["User_Name"]."'";
  $db_erg = mysqli_query( $db_link, $sql );
  while ($zeile = mysqli_fetch_array( $db_erg, MYSQLI_ASSOC))
  {
    if (md5($zeile["Id"]) == $_SESSION["User_ID"] && $zeile["Type"] == 1){
      $logina = 1;
    }
  }
  $edit = False;
  if(isset($_POST["edit"])){
    $edit = True;
  }
  if(isset($_POST["N"])&&isset($_POST["C"])&&$logina==1&&(!$edit)){
    $sql = "INSERT INTO Blog (Name, Code, Author, Date, Online) VALUES ('".$_POST["N"]."','".addslashes($_POST["C"])."','".$_SESSION["User_Name"]."','".date("Y-m-d")."','".$_POST["online"]."');";
    $db_erg = mysqli_query( $db_link, $sql );
    // fix path https://github.com/Case-Games/USOC/issues/13
    header("Location:?URL=".$_POST["N"]);
  }
  if(isset($_POST["N"])&&isset($_POST["C"])&&$logina==1&&$edit){
    $sql = "UPDATE Blog SET Code='".addslashes($_POST["C"])."', Online='".$_POST["online"]."' WHERE Name='".$_POST["N"]."';";
    $db_erg = mysqli_query( $db_link, $sql );
    // fix path https://github.com/Case-Games/USOC/issues/13
    header("Location: /blog/".$_POST["N"]);
  }

?>
