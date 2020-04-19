<?php
include "phpapi/getdomain.php";
?>
<!DOCTYPE html>
<html lang="de" dir="ltr">
  <head>
      <?php
        include_once "siteelements/head.php"
      ?>
  </head>
  <body>
    <?php
      include_once "siteelements/header.php"
    ?>
    <article>
      <?php
        $sitehere = False;
        if(isset($_GET["URL"])){
          require_once ('konfiguration.php');
          $db_link = mysqli_connect (MYSQL_HOST,MYSQL_BENUTZER,MYSQL_KENNWORT,MYSQL_DATENBANK);
          $sql = "SELECT * FROM Blog";
          $db_erg = mysqli_query( $db_link, $sql );
          while ($zeile = mysqli_fetch_array( $db_erg, MYSQLI_ASSOC)){
            if($zeile["Name"] == $_GET["URL"]){
              $sitehere = True;
            if($zeile["Online"]==1){
              $site = $zeile["Code"];
              $name = $zeile["Name"];
              $author = $zeile["Author"];
            }else{
              $site = <<<HEREDOC
                <h1>Seite offline</h1>
                <p>Diese Seite ist nicht mehr verfügbar.</p>
                <p>Sollte sie das sein oder brauchst du sie melde dich bei support@casegames.ch</p>
              HEREDOC;
            }
            $sql = "SELECT * FROM User";
            $db_erg = mysqli_query( $db_link, $sql );
            while ($zeile = mysqli_fetch_array( $db_erg, MYSQLI_ASSOC)){
              if($zeile["Id"] == $author){
                $author = $zeile["Username"];
                break;
              }
            }
          }
        }
      }else{
        header("Location: https://casegames.ch/blogsite.php");
      }
        if($sitehere){
          echo "<h1>".$name."</h1>";
          echo "erstellt von: ".$author;
          echo $site;

        }else{
          header("HTTP/1.1 404 Not found");
          header('Location: '.getDomain().'/Errors/404.html');
        }
       ?>
    </article>
    <?php
      include_once "siteelements/footer.php"
    ?>
  </body>
</html>
