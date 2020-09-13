<?php
  include_once "configuration.php";
  include_once "includes/class.inc.php";
  newClass();
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
            $db_link = mysqli_connect(MYSQL_HOST,MYSQL_USER,MYSQL_PASSWORD,MYSQL_DATABASE);
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
            $db_link = mysqli_connect(MYSQL_HOST,MYSQL_USER,MYSQL_PASSWORD,MYSQL_DATABASE);
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
          $db_link = mysqli_connect(MYSQL_HOST,MYSQL_USER,MYSQL_PASSWORD,MYSQL_DATABASE);
          $sql = "SELECT * FROM Sites WHERE Name='index'";
          $db_erg = mysqli_query( $db_link, $sql );
          while ($zeile = mysqli_fetch_array( $db_erg, MYSQLI_ASSOC)){
            $site = $zeile["Code"];
            $sitehere = True;
          }
        }elseif($_SERVER["REQUEST_URI"].lower() == "error"){
          if(isset($_GET["E"])){
            if(!($_GET["E"] == "400" || $_GET["E"] == "403" || $_GET["E"] == "404" || $_GET["E"] == "405" || $_GET["E"] == "410" || $_GET["E"] == "414" || $_GET["E"] == "418" || $_GET["E"] == "423")){
              echo "unknown Error";
            }else{
              $U->getErrorSite($_GET["E"]);
            }
          }
        }elseif($_SERVER["REQUEST_URI"].lower() == "blogsite" || $_SERVER["REQUEST_URI"].lower() == "blogsite.php"){
          echo "<h1>".$U->getLang("blog.overwiew")."</h1>";
          $db_link = mysqli_connect(MYSQL_HOST,MYSQL_USER,MYSQL_PASSWORD,MYSQL_DATABASE);
          $sql = "SELECT * FROM Blog ORDER BY ID DESC;";
          $db_erg = mysqli_query( $db_link, $sql );
          while ($zeile = mysqli_fetch_array($db_erg, MYSQLI_ASSOC)){
            if($zeile["Online"]==1){
              echo "<h2 style='color:black;border-top: 1px;border-top-style:solid;border-top-color:black;'><a style='color:black;' href='/blog/".$zeile["Name"]."'>".$zeile["Name"]."</a></h2>";
              echo substr($zeile["Code"],0,100)."...";
              echo "<br /><br /><a href='/blog/".$zeile["Name"]."'><button class='readmore'>".$U->getLang("blog.readmore")."</button></a>";
            }
          }
        }else{
          header("HTTP/1.1 404 Not found");
          header('Location: error?E=404');
        }
        if($sitehere){
          echo $site;
        }else{
          header("HTTP/1.1 404 Not found");
          header('Location: error?E=404');
        }
       ?>
    </article>
    <?php
      include_once "siteelements/footer.php"
    ?>
  </body>
</html>
