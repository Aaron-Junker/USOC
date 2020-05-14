<?php
session_start();
  include_once "../phpapi/getsettings.php";
  if(isset($_POST["oldpass"])&&isset($_POST["newpass1"])&&isset($_POST["newpass2"])&&isset($_SESSION['User_Name'])){
    if($_POST["newpass1"]==$_POST["newpass2"]&&preg_match('/^[a-z0-9A-Z.:,;]{8,25}$/',$_POST["newpass1"])){
      $passc = False;
      require_once ('konfiguration.php');
      $db_link = mysqli_connect (MYSQL_HOST,MYSQL_BENUTZER,MYSQL_KENNWORT,MYSQL_DATENBANK);
      $sql = "SELECT * FROM User WHERE Username='".$_SESSION['User_Name']."';";
      $db_erg = mysqli_query( $db_link, $sql );
      while ($zeile = mysqli_fetch_array( $db_erg, MYSQLI_ASSOC))
        {
          if(md5($zeile["Id"]) == $_SESSION['User_ID']&&$zeile["Password"]==password_hash($_POST["oldpass"],PASSWORD_DEFAULT,["salt"=>getSetting("login.salt")])){
            $passc = True;
          }
        }
    }else{
      echo "Bitte zweimal gleiches Passwort eingeben. Oder ein gültiges Passwort";
    }
  }else{
    echo "Nicht alles ausgefüllt oder nicht eingeloggt";
  }
  if(getSetting("login.changepassword") == 0){
    $passc = False;
    echo "Passwortänderung konnte nicht erfolgen";
  }
  echo $passc;
  if($passc){

    $sql = "UPDATE User SET password='".password_hash($_POST["oldpass"],PASSWORD_DEFAULT,["salt"=>getSetting("login.salt")])."' WHERE Id='".$_SESSION['User_ID']."';";
    echo $sql;
    $db_erg = mysqli_query( $db_link, $sql );
    header("Location: https://casegames.ch/index.php?action=passchange");
  }
?>
