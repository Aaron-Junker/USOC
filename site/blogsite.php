<!DOCTYPE html>
<html lang="<?php echo getSetting("site.lang") ?>" dir="ltr">
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
      <h1>Blogartikel</h1>
      <?php
      require_once ('login/konfiguration.php');
      $db_link = mysqli_connect (MYSQL_HOST,MYSQL_BENUTZER,MYSQL_KENNWORT,MYSQL_DATENBANK);
      $sql = "SELECT * FROM Blog ORDER BY ID DESC;";
      $db_erg = mysqli_query( $db_link, $sql );
      while ($zeile = mysqli_fetch_array($db_erg, MYSQLI_ASSOC))
      {
        if($zeile["Online"]==1){
        echo "<h2 style='color:black;border-top: 1px;border-top-style:solid;border-top-color:black;'><a style='color:black;' href='blog.php?site=".$zeile["Name"]."'>".$zeile["Name"]."</a></h2>";
        echo substr($zeile["Code"],0,100)."...";
        echo "<br /><br /><a href='blog.php?URL=".$zeile["Name"]."'><button class='readmore'>Weiterlesen...</button></a>";
      }
      }
      ?>
  </article>
  <?php
    include_once "siteelements/footer.php"
  ?>
</body>
</html>
