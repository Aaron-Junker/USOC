<?php
require_once 'google-api-php-client/src/Google/autoload.php';
  session_start();
  $change = False;
  if(isset($_POST["token"])){

    $client = new Google_Client(['client_id' => "*.apps.googleusercontent.com"]);  // Specify the CLIENT_ID of the app that accesses the backend
    $client->setAuthConfigFile('client_string.JSON');
  $token_data = $client->verifyIdToken($_POST["token"])->getAttributes();
$user_id = $token_data['payload']['sub'];
    if(isset($_SESSION["User_ID"])){
      require_once ('konfiguration.php');
      $db_link = mysqli_connect (MYSQL_HOST,MYSQL_BENUTZER,MYSQL_KENNWORT,MYSQL_DATENBANK);
      $sql = "SELECT * FROM User WHERE Username='".mysqli_real_escape_string ($db_link,$_SESSION["User_Name"])."'";
      $db_erg = mysqli_query( $db_link, $sql );
      while ($zeile = mysqli_fetch_array( $db_erg, MYSQLI_ASSOC))
      {
        if(md5($zeile["Id"])==$_SESSION["User_ID"]){
          if($zeile["google_token"] == ""){
          $change = True;
        }else{
          echo "Bereits einen Google account verknüpft";
        }
        }else{
          echo "Fehler";
        }

      }
      if($change){
        $sql = "UPDATE User SET google_token='".mysqli_real_escape_string ($db_link,$user_id)."' WHERE Id='".mysqli_real_escape_string ($db_link,$_SESSION["User_ID"])."';";
        mysqli_query( $db_link, $sql );
      }
    }else{
    echo "Nicht eingeloggt";
    }
  }else{
    echo "Fehler";
  }


 ?>
