<?php
declare(strict_types=1);
session_start();

include_once 'src/FixedBitNotation.php';
include_once 'src/GoogleAuthenticatorInterface.php';
include_once 'src/GoogleAuthenticator.php';

include_once 'src/GoogleQrUrl.php';
$g = new \Sonata\GoogleAuthenticator\GoogleAuthenticator();
if(isset($_POST["secret"])&&isset($_POST["register"])){
  $secret = $_POST["secret"];
  require_once ('konfiguration.php');
  $db_link = mysqli_connect (MYSQL_HOST,MYSQL_BENUTZER,MYSQL_KENNWORT,MYSQL_DATENBANK);
  $sql = "UPDATE User SET google_2fa='".$secret."' WHERE Username='".$_SESSION["User_Name"]."'";
  $db_erg = mysqli_query( $db_link, $sql );
  echo "Google Authenticator verknüpft";
}elseif(isset($_POST["code"])&&isset($_POST["login"])){
  $code = $_POST["code"];
  require_once ('konfiguration.php');
  $db_link = mysqli_connect (MYSQL_HOST,MYSQL_BENUTZER,MYSQL_KENNWORT,MYSQL_DATENBANK);
  $sql = "SELECT * FROM User WHERE Username='".$_SESSION['temp_User_Name']."';";
  $db_erg = mysqli_query( $db_link, $sql );
  while ($zeile = mysqli_fetch_array( $db_erg, MYSQLI_ASSOC))
    {
      if($g->checkCode($zeile["google_2fa"], $code)){
        $_SESSION["code"] = True;
        header("Location: login.php");
      }else{
        echo "Code nicht korrekt";
      }
    }
}elseif(isset($_POST["delete"])){
  require_once ('konfiguration.php');
  $db_link = mysqli_connect (MYSQL_HOST,MYSQL_BENUTZER,MYSQL_KENNWORT,MYSQL_DATENBANK);
  echo $_SESSION['temp_User_Name'];
  $sql = "UPDATE User SET google_2fa='' WHERE Username='".$_SESSION['User_Name']."';";
  $db_erg = mysqli_query( $db_link, $sql );
  header("Location: /index.php");
}





 ?>
