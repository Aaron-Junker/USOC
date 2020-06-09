<?php
  $register = False;
  if(isset($_POST["U"])&&isset($_POST["M"])&&isset($_POST["P"])&&isset($_POST["PR"])&&isset($_POST["D"])&&$_POST["D"]=="on"){
    if($_POST["P"]==$_POST["PR"]){
      if(preg_match('/^[^\x00-\x20()<>@,;:\\".[\]\x7f-\xff]+(?:\.[^\x00-\x20()<>@,;:\\".[\]\x7f-\xff]+)*\@[^\x00-\x20()<>@,;:\\".[\]\x7f-\xff]+(?:\.[^\x00-\x20()<>@,;:\\".[\]\x7f-\xff]+)+$/i', $_POST["M"])){
        if(preg_match('/^[a-z0-9A-Z.]{3,15}$/',$_POST["U"])){
          if(preg_match('/^[a-z0-9A-Z.:,;]{8,25}$/',$_POST["P"])){
            $register = True;
            require_once ('../configuration.php');
            $db_link = mysqli_connect (MYSQL_HOST,MYSQL_BENUTZER,MYSQL_KENNWORT,MYSQL_DATENBANK);
            $sql = "SELECT * FROM User";
            $db_erg = mysqli_query( $db_link, $sql );
            while ($zeile = mysqli_fetch_array( $db_erg, MYSQLI_ASSOC))
            {
              if(strtolower($zeile["Username"]) == strtolower($_POST["U"])){
                $register=False;
              }
              if(strtolower($zeile["Mail"])==strtolower($_POST["M"])){
                  $register = False;
              }

            }
          }else{
            echo "ungültiges Passwort";
          }
        }else{
          echo "ungültiger Benutzername";
        }
      }else{
        echo "Ungültige Mailadresse";
      }
    }else{
      echo "Passwort nicht gleich.";
    }
  }else{
    echo "Bitte alles ausfüllen";
  }
  include "../phpapi/getsettings.php";
  if(getSetting("login.register_open")=="0"){
    echo "registrierung geschlossen";
    $register = False;
  }
  if($register){
    $sql = 'INSERT INTO User (Username, Mail, Password, Type) VALUES ('."'".$_POST["U"]."'".','."'".$_POST["M"]."'".','."'".password_hash($_POST["P"],PASSWORD_DEFAULT,["salt"=>getSetting("login.salt")])."'".',0);';
    if($db_erg = mysqli_query( $db_link, $sql )){
      echo "geglückt";
      header("Location: "+$USOC["DOMAIN"]);
    }else{
      echo mysqli_error($db_link);
    }
  }else{
    echo "Benutzername bereits vergeben oder Mailadresse bereits vergeben.";
  }

?>
