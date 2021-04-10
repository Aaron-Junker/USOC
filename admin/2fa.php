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
  if(isset($_POST["code"]) && isset($_POST["login"]) && $U->getSetting("2fa.enabled") == "1"){
    $code = $_POST["code"];
    $sql = "SELECT * FROM User WHERE Username='".$_SESSION['temp_User_Name']."';";
    $dbRes = mysqli_query($U->db_link, $sql);
    while ($row = mysqli_fetch_array( $dbRes, MYSQLI_ASSOC)){
      if($g->checkCode($row["google_2fa"], $code)){
        $_SESSION["code"] = True;
        header("Location: login.php");
      }else{
        echo $U->getLang("login.2fa.false_code");
      }
    }
  }
?>
