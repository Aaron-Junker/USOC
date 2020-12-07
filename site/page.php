<?php
  /** 
  * This file includes pages, error pages, blog overview page and blogpages.
  * This is the fallback page if the page don't exists.
  * @license https://standards.casegames.ch/cgs/0003/v1.txt Case Games Open-Source license
  */
  include_once "configuration.php";
  include_once "includes/class.inc.php";
  newClass();
?>
<!DOCTYPE html>
<html lang="<?php echo $U->getSetting("site.lang"); ?>" dir="ltr">
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
        $sitehere = False;
        if(isset($_GET["URL"])){
          if(strpos($_GET["URL"], '/blog/') !== false){
            $sql = "SELECT * FROM Blog";
            $db_erg = mysqli_query( $U->db_link, $sql );
            while ($zeile = mysqli_fetch_array( $db_erg, MYSQLI_ASSOC)){
              if($zeile["Name"] == $_GET["URL"]){
                $sitehere = True;
                if($zeile["Online"]==1){
                  $site = $zeile["Code"];
                }else{
                  $site = $U->getLang("error.offline");
                }
              }
            }
          }else{
            $sql = "SELECT * FROM Sites";
            $db_erg = mysqli_query( $U->db_link, $sql );
            while ($zeile = mysqli_fetch_array( $db_erg, MYSQLI_ASSOC)){
              if($zeile["Name"] == $_GET["URL"]){
                $sitehere = True;
                if($zeile["Online"]==1){
                  $site = $zeile["Code"];
                }else{
                  $site = $U->getLang("error.offline");
                }
              }
            }
          }
        }elseif(strtolower($_SERVER["REQUEST_URI"]) == "/index.php" || strtolower($_SERVER["REQUEST_URI"]) == "/index.html"|| strtolower($_SERVER["REQUEST_URI"]) == "/"){
          $sql = "SELECT * FROM Sites WHERE Name='index'";
          $db_erg = mysqli_query( $U->db_link, $sql );
          while ($zeile = mysqli_fetch_array( $db_erg, MYSQLI_ASSOC)){
            $site = $zeile["Code"];
            $sitehere = True;
          }
        }elseif(strpos(strtolower($_SERVER["REQUEST_URI"]),"/error") !== false){
          if(isset($_GET["E"])){
            if(!($_GET["E"] == "400" || $_GET["E"] == "403" || $_GET["E"] == "404" || $_GET["E"] == "405" || $_GET["E"] == "410" || $_GET["E"] == "414" || $_GET["E"] == "418" || $_GET["E"] == "423")){
              $site = "<p>".$U->getLang("errors.unknown")."</p>";
            }else{
              $site = $U->getErrorSite($_GET["E"]);
            }
          }else{
            $site = "<p>".$U->getLang("errors.unknown")."</p>";
          }
          $sitehere = True;
        }elseif(strtolower($_SERVER["REQUEST_URI"]) == "/blogsite" || strtolower($_SERVER["REQUEST_URI"]) == "/blogsite.php"){
          // If the URL is "/blogsite" or "/blogsite.php" a overview of all blog pages appear
          $site = "<h1>".$U->getLang("blog.overwiew")."</h1>";
          $sql = "SELECT * FROM Blog ORDER BY ID DESC;";
          $db_erg = mysqli_query($U->db_link, $sql);
          /**
          * This variable is for counting the amount of blogarticles
          * @var int
          */
          $blogarticles = 0;
          while ($zeile = mysqli_fetch_array($db_erg, MYSQLI_ASSOC)){
            if($zeile["Online"]==1){
              $site .= "<h2 style='color:black;border-top: 1px;border-top-style:solid;border-top-color:black;'><a style='color:black;' href='/blog/".$zeile["Name"]."'>".$zeile["Name"]."</a></h2>";
              $site .= substr($zeile["Code"],0,100)."...";
              $site .= "<br /><br /><a href='/blog/".$zeile["Name"]."'><button class='readmore'>".$U->getLang("blog.readmore")."</button></a>";
              $blogarticles += 1;
            }
          }
          // Fallback if no blogarticles are saved
          if($blogarticles == 0){
            $site .= "<p><b>".$U->getLang("blog.no_saved")."</b></p>";
          }
          $sitehere = True;
        }elseif(strpos(strtolower($_SERVER["REQUEST_URI"]),"/blog/") !== false){
          $URL = str_replace('/blog/', "", $_SERVER["REQUEST_URI"]);
          $URL = str_replace("/Blog/", "", $URL);
          $URL = str_replace("/BLOG/", "", $URL);
          $URL = str_replace("%20", " ", $URL);
          $sql = "SELECT * FROM Blog";
          $db_erg = mysqli_query($U->db_link, $sql);
          while ($zeile = mysqli_fetch_array($db_erg, MYSQLI_ASSOC)){
            if($zeile["Name"] == $URL){
              $sitehere = True;
              if($zeile["Online"]==1){
                $site = $zeile["Code"];
              }else{
                $site = $U->getLang("error.offline");
              }
            }
          }
        }else{
          $sql = "SELECT * FROM Sites";
          $db_erg = mysqli_query( $U->db_link, $sql );
          while ($zeile = mysqli_fetch_array($db_erg, MYSQLI_ASSOC)){
            if($zeile["Name"] == str_replace('/', "", $_SERVER["REQUEST_URI"])){
              $sitehere = True;
              if($zeile["Online"]==1){
                $site = $zeile["Code"];
              }else{
                $site = $U->getLang("error.offline");
              }
            }
          }
        }
        if($sitehere){
          echo $site;
        }else{
          header("HTTP/1.1 404 Not found");
          header('Location: '.$USOC["DOMAIN"].'/error?E=404');
        }
       ?>
    </article>
    <?php
      include_once "siteelements/footer.php"
    ?>
  </body>
</html>

