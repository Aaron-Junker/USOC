<!DOCTYPE html>
<html lang="de" dir="ltr">
  <head>
      <?php
        include_once "siteelements/head.php";
      ?>
  </head>
  <body>
    <?php
      include_once "siteelements/header.php";
    ?>
    <article>
      <?php
        if(isset($_GET["oldsite"])){
          echo "<p>Hinweis:Wir sind von casegames.internet-box.ch zu casegames.ch umgezogen</p>";
        }
        if(isset($_GET["action"])){
          if($_GET["action"]=="passchange"){
          echo "<h3>Passwort geändert</h3>";
        }elseif($_GET["action"]=="register"){
          echo "<h3>Registriert!</h3>";
        }
        }

      include_once "indexinhalt.php";
      include_once "siteelements/footer.php";
    ?>
  </body>
</html>
