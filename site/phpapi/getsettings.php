<?php
  function getSetting($name){
    require_once ('../configuration.php');
    $db_link = mysqli_connect (MYSQL_HOST,MYSQL_BENUTZER,MYSQL_KENNWORT,MYSQL_DATENBANK);
    $sql = "SELECT * FROM Settings WHERE Name='".$name."'";
    $db_erg = mysqli_query( $db_link, $sql );
    while ($zeile = mysqli_fetch_array( $db_erg, MYSQLI_ASSOC)){
      return $zeile["Value"];
    }
  }
  function getPP(){
  	require_once ('../configuration.php');
    $db_link = mysqli_connect (MYSQL_HOST,MYSQL_BENUTZER,MYSQL_KENNWORT,MYSQL_DATENBANK);
    $sql = "SELECT * FROM User WHERE Username='".$_SESSION['User_Name']."'";
    $db_erg = mysqli_query( $db_link, $sql );
    while ($zeile = mysqli_fetch_array( $db_erg, MYSQLI_ASSOC)){
      $mail = $zeile["Mail"];
    }
    $code = md5(strtolower( trim($mail) ) );
  	return "<img src='https://www.gravatar.com/avatar/".$code."' />";
    }
    function getError($code, $lang){
      if($lang == "de"){
        switch ($code) {
          case '0x000000':
            return "Error ".$code.": Benutzername oder Mailadresse passen nicht zu Passwort.";
          case '0x000001':
            return "Error ".$code.": Passwort ist nicht korrekt.";
          case '0x000002':
            return "Error ".$code.": HTTP-Error 404: Seite nicht gefunden";
          case '0x000003':
            return "Error ".$code.":";
          default:
            return "Error ".$code.": Nicht bekannter Fehler aufgetreten.";
        }
      }
    }
    function getLang(string){
      translate = json_decode(file_get_contents("lang/".getSetting("site.lang").".json"));
      try {
        return translate[string];
      } catch (\Exception $e) {
        translate = json_decode(file_get_contents("lang/en-en.json"));
        return translate[string];
      }


    }
 ?>
