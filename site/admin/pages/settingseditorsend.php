<!DOCTYPE html>
<html lang="de" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>Adminbereich - Einstellungseditor</title>
  </head>
  <body>
    <a href="<?php echo $_SERVER['PHP_SELF']; ?>?URL=mainpage">Zurück</a>
    <?php
      if(isset($_GET["N"])&&isset($_GET["V"])){
        require_once ('konfiguration.php');
        $db_link = mysqli_connect (MYSQL_HOST,MYSQL_BENUTZER,MYSQL_KENNWORT,MYSQL_DATENBANK);
        $sql = "UPDATE Settings SET Value='".$_GET["V"]."' WHERE Name ='".$_GET["N"]."';";
        $db_erg = mysqli_query( $db_link, $sql );
        echo "Einstellung geändert";
      }
    ?>
  </body>
</html>
