<?php
  session_start();
  require_once 'google-api-php-client/src/Google/autoload.php';
  $change = False;
  if(file_exists("client_string.json")){
    if(isset($_POST["token"])){
      $client = new Google_Client(['client_id' => $U->getSetting("oAuth.google.client_id").".apps.googleusercontent.com"]);  // Specify the CLIENT_ID of the app that accesses the backend
      $client->setAuthConfigFile('client_string.JSON');
      $token_data = $client->verifyIdToken($_POST["token"])->getAttributes();
      $user_id = $token_data['payload']['sub'];
      if(isset($_SESSION["User_ID"])){
        require_once ('configuration.php');
        $sql = "SELECT * FROM User WHERE Username='".mysqli_real_escape_string ($U->db_link,$_SESSION["User_Name"])."'";
        $db_erg = mysqli_query( $U->db_link, $sql );
        while ($zeile = mysqli_fetch_array( $db_erg, MYSQLI_ASSOC))
        {
          if(md5($zeile["Id"])==$_SESSION["User_ID"]){
            if($zeile["google_token"] == ""){
            $change = True;
          }else{
            echo str_replace("%a",$U->getLang("login.oAuth.google"),$U->getLang("login.oAuth.fail"));
          }
          }else{
            echo $U->getLang("login.oAuth.error_fail");
          }

        }
        if($change){
          $sql = "UPDATE User SET google_token='".mysqli_real_escape_string ($U->db_link,$user_id)."' WHERE Id='".mysqli_real_escape_string ($U->db_link,$_SESSION["User_ID"])."';";
          mysqli_query( $U->db_link, $sql );
        }
      }else{
      echo $U->getLang("login.not_logged_in");
      }
    }else{
      echo $U->getLang("login.oAuth.error_fail");
    }
  }
?>
