<?php
  session_start();

  include_once "../configuration.php";
  include_once "../includes/class.inc.php";
  include_once "src/FixedBitNotation.php";
  include_once "src/GoogleAuthenticatorInterface.php";
  include_once "src/GoogleAuthenticator.php";
  include_once 'src/GoogleQrUrl.php';

  newClass();

  $g = new \Sonata\GoogleAuthenticator\GoogleAuthenticator();
  if(isset($_POST["abort"]) && isset($_SESSION['temp_User_ID'])){
    unset($_SESSION['temp_User_ID'],$_SESSION['temp_User_Name']);
    header("Location: ../login.php");
  }elseif(isset($_POST["secret"])&&isset($_POST["register"]) && $U->getSetting("2fa.enabled") == "1"){
    $secret = $_POST["secret"];
    $sql = "UPDATE User SET google_2fa='".$secret."' WHERE Username='".$_SESSION["User_Name"]."'";
    $db_erg = mysqli_query($U->db_link, $sql);
    echo str_replace("%a",$U->getLang("login.2fa.google_authenticator"),$U->getLang("login.2fa.succeed"));
  }elseif(isset($_POST["code"])&&isset($_POST["login"]) && $U->getSetting("2fa.enabled") == "1"){
    $code = $_POST["code"];
    $sql = "SELECT * FROM User WHERE Username='".$_SESSION['temp_User_Name']."';";
    $db_erg = mysqli_query($U->db_link, $sql);
    while ($row = mysqli_fetch_array( $db_erg, MYSQLI_ASSOC))
      {
        if($g->checkCode($row["google_2fa"], $code)){
          $_SESSION["code"] = True;
          header("Location: login.php");
        }else{
          header("Location: login.php?ERROR");
        }
      }
  }elseif(isset($_POST["delete"]) && $U->getSetting("2fa.enabled") == "1"){
    echo $_SESSION['temp_User_Name'];
    $sql = "UPDATE User SET google_2fa='' WHERE Username='".$_SESSION['User_Name']."';";
    $db_erg = mysqli_query($U->db_link, $sql);
    header("Location: /index.php");
  }
?>
