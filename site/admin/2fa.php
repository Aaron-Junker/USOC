<?php
  session_start();

  include_once "configuration.php";
  include_once $USOC["SITE_PATH"]."/includes/class.inc.php";
  include_once "src/FixedBitNotation.php";
  include_once "src/GoogleAuthenticatorInterface.php";
  include_once "src/GoogleAuthenticator.php";
  include_once 'src/GoogleQrUrl.php';

  newClass();

  $g = new \Sonata\GoogleAuthenticator\GoogleAuthenticator();
  if(isset($_POST["secret"])&&isset($_POST["register"])){
    $secret = $_POST["secret"];
    $sql = "UPDATE User SET google_2fa='".$secret."' WHERE Username='".$_SESSION["User_Name"]."'";
    $db_erg = mysqli_query( $U->$db_link, $sql );
    echo str_replace("%a",$U->getLang("login.2fa.google_authenticator"),$U->getLang("login.2fa.succeed"));
  }elseif(isset($_POST["code"])&&isset($_POST["login"])){
    $code = $_POST["code"];
    $sql = "SELECT * FROM User WHERE Username='".$_SESSION['temp_User_Name']."';";
    $db_erg = mysqli_query( $U->$db_link, $sql );
    while ($zeile = mysqli_fetch_array( $db_erg, MYSQLI_ASSOC))
      {
        if($g->checkCode($zeile["google_2fa"], $code)){
          $_SESSION["code"] = True;
          header("Location: login.php");
        }else{
          echo $U->getLang("login.2fa.false_code");
        }
      }
  }elseif(isset($_POST["delete"])){
    echo $_SESSION['temp_User_Name'];
    $sql = "UPDATE User SET google_2fa='' WHERE Username='".$_SESSION['User_Name']."';";
    $db_erg = mysqli_query( $U->$db_link, $sql );
    header("Location: /index.php");
  }
?>
