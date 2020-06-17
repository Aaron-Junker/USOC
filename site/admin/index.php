<?php
  include "phpapi/getdomain.php";
  session_start();
  if(isset($_SESSION["User_ID"])){
    //Login überprüfen
    $logina = 0;
    require_once ('konfiguration.php');
    $db_link = mysqli_connect (MYSQL_HOST,MYSQL_BENUTZER,MYSQL_KENNWORT,MYSQL_DATENBANK);
    $sql = "SELECT * FROM User Where Username = '".$_SESSION["User_Name"]."'";
    $db_erg = mysqli_query( $db_link, $sql );
    while ($zeile = mysqli_fetch_array( $db_erg, MYSQLI_ASSOC))
    {
      if (md5($zeile["Id"]) == $_SESSION["User_ID"] && $zeile["Type"] == 1){
        //AND  md5($zeile["Id"]) == $_SESSION["User_ID"]
        $logina = 1;}
    }
    if ($logina == 1){
      if(isset($_GET["URL"])&&file_exists("pages/".$_GET["URL"].".php")){
        include "pages/".$_GET["URL"].".php";
      }else{
      include "pages/mainpage.php";
    }
    }else{
      header("HTTP/1.1 403 Forbidden");
      header('Location: '.getDomain().'/Errors/403.html');
    }
  }else{
    echo <<<HTML
      <form action="login.php" method="post">
        <label for="B">Benutzername</label>
        <input name="B" type="text" />
        <label for="P">Passwort</label>
        <input name="P" type="password" />
        <input type="submit" />
      </form>
    HTML;

  }
 ?>
