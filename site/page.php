<?php
  include_once "configuration.php";
  include_once "includes/class.inc.php";
  $U = new U();
?>
<!DOCTYPE html>
<html lang="<?php echo $U->getSetting("site.lang") ?>" dir="ltr">
  <head>
      <?php
        include_once "siteelements/head.php";
      ?>
  </head>
  <body>
    <?php
      include_once "siteelements/header.php";
    ?>
    <article>
      <?php
        $sitehere = False;
        if(isset($_GET["URL"])){
          if(strpos($_GET["URL"], '/blog/') !== false){
            $db_link = mysqli_connect (MYSQL_HOST,MYSQL_USER,MYSQL_PASSWORD,MYSQL_DATABASE);
            $sql = "SELECT * FROM Blog";
            $db_erg = mysqli_query( $db_link, $sql );
            while ($zeile = mysqli_fetch_array( $db_erg, MYSQLI_ASSOC)){
              if($zeile["Name"] == $_GET["URL"]){
                $sitehere = True;
                if($zeile["Online"]==1){
                  $site = $zeile["Code"];
                }else{
                  $site = $U->getLang("error.offline");
                }
              }
            }
          }else{
            $db_link = mysqli_connect (MYSQL_HOST,MYSQL_USER,MYSQL_PASSWORD,MYSQL_DATABASE);
            $sql = "SELECT * FROM Sites";
            $db_erg = mysqli_query( $db_link, $sql );
            while ($zeile = mysqli_fetch_array( $db_erg, MYSQLI_ASSOC)){
              if($zeile["Name"] == $_GET["URL"]){
                $sitehere = True;
                if($zeile["Online"]==1){
                  $site = $zeile["Code"];
                }else{
                  $site = $U->getLang("error.offline");
                }
              }
            }}
        }elseif($_SERVER["REQUEST_URI"].lower() == "index.php" || $_SERVER["REQUEST_URI"].lower() == "index.html"){
          $db_link = mysqli_connect (MYSQL_HOST,MYSQL_USER,MYSQL_PASSWORD,MYSQL_DATABASE);
          $sql = "SELECT * FROM Sites WHERE Name='index'";
          $db_erg = mysqli_query( $db_link, $sql );
          while ($zeile = mysqli_fetch_array( $db_erg, MYSQLI_ASSOC)){
            $site = $zeile["Code"];
            $sitehere = True;
          }
        }elseif($_SERVER["REQUEST_URI"].lower() == "error"){
          
        }
        if($sitehere){
          echo $site;
        }else{
          header("HTTP/1.1 404 Not found");

          header('Location: Errors/404.html');
        }
       ?>
    </article>
    <?php
      include_once "siteelements/footer.php"
    ?>
  </body>
</html>
