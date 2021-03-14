<?php
  /** 
  * This file includes pages, error pages, blog overview page and blogpages.
  * This is the fallback page if the page don't exists.
  * @license https://standards.casegames.ch/cgs/0003/v1.txt Case Games Open-Source license
  */
  session_start();
  include_once "configuration.php";
  include_once "includes/class.inc.php";
  newClass();
  if($U->userHasPermission("Pages")){
    $raw = False;
    $amp = False;
    $_SERVER["REQUEST_URI"] = parse_url($_SERVER["REQUEST_URI"])["path"];
    if(str_starts_with($_SERVER["REQUEST_URI"], "/raw/")){
      $raw = True;
      $_SERVER["REQUEST_URI"] = str_replace("/raw", "", $_SERVER["REQUEST_URI"]); 
    }else{
      if(str_starts_with($_SERVER["REQUEST_URI"], "/amp/")){
        $amp = True;
        $_SERVER["REQUEST_URI"] = str_replace("/amp", "", $_SERVER["REQUEST_URI"]); 
      }
?>
    <!DOCTYPE html>
    <html <?php if($amp){echo "amp ";}?>lang="<?php echo $U->getSetting("site.lang"); ?>" dir="ltr">
      <head>
          <?php
            if($amp){
              include_once "includes/amp/head.php";
            }else{
              include_once "siteelements/head.php";
            }
          ?>
      </head>
      <body>
        <?php
          include_once "siteelements/header.php";
        ?>
        <article>
          <?php
            }
            $sitehere = False;
            if(isset($_GET["URL"])){
              // Fallback for old URL'S with `URL` parameter {
              if(str_starts_with($_GET["URL"], '/blog/')){
                // If it is a blog page {
                $sql = "SELECT * FROM Blog";
                $db_erg = mysqli_query($U->db_link, $sql);
                while ($row = mysqli_fetch_array($db_erg, MYSQLI_ASSOC)){
                  if($row["Name"] == $_GET["URL"]){
                    $sitehere = True;
                    if($row["Online"] == 1){
                      $site = htmlspecialchars_decode($row["Code"]);
                    }else{
                      $site = $U->getLang("error.offline");
                    }
                  }
                }
                // }
              }else{
                // If it's a normal page {
                $sql = "SELECT * FROM Sites";
                $db_erg = mysqli_query($U->db_link, $sql);
                while ($row = mysqli_fetch_array($db_erg, MYSQLI_ASSOC)){
                  if($row["Name"] == $_GET["URL"]){
                    $sitehere = True;
                    if($row["Online"] == 1){
                      $site = htmlspecialchars_decode($row["Code"]);
                    }else{
                      $site = $U->getLang("error.offline");
                    }
                  }
                }
                // }
              }
              // }
            }elseif(strtolower($_SERVER["REQUEST_URI"]) == "/index.php" || strtolower($_SERVER["REQUEST_URI"]) == "/index.html"|| strtolower($_SERVER["REQUEST_URI"]) == "/"){
              // Fallback for index pages
              $sql = "SELECT * FROM Sites WHERE Name='index'";
              $db_erg = mysqli_query($U->db_link, $sql);
              while ($row = mysqli_fetch_array($db_erg, MYSQLI_ASSOC)){
                $site = htmlspecialchars_decode($row["Code"]);
                $sitehere = True;
              }
            }elseif(str_starts_with(strtolower($_SERVER["REQUEST_URI"]),"/error")){
              // Fallback for error pages {
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
              // }
            }elseif(strtolower($_SERVER["REQUEST_URI"]) == "/blogsite" || strtolower($_SERVER["REQUEST_URI"]) == "/blogsite.php"){
              // If the URL is "/blogsite" or "/blogsite.php" a overview of all blog pages appear {
              $site = "<h1>".$U->getLang("blog.overwiew")."</h1>";
              $sql = "SELECT * FROM Blog ORDER BY ID DESC;";
              $db_erg = mysqli_query($U->db_link, $sql);
              /**
              * This variable is for counting the amount of blogarticles
              * @var int
              */
              $blogarticles = 0;
              while ($row = mysqli_fetch_array($db_erg, MYSQLI_ASSOC)){
                if($row["Online"]==1){
                  $site .= "<h2 style='color:black;border-top: 1px;border-top-style:solid;border-top-color:black;'><a style='color:black;' href='/blog/".$row["Name"]."'>".$row["Name"]."</a></h2>";
                  $site .= substr($row["Code"],0,100)."...";
                  $site .= "<br /><br /><a href='/blog/".$row["Name"]."'><button class='readmore'>".$U->getLang("blog.readmore")."</button></a>";
                  $blogarticles += 1;
                }
              }
              // Fallback if no blogarticles are saved {
              if($blogarticles == 0){
                $site .= "<p><b>".$U->getLang("blog.no_saved")."</b></p>";
              }
              $sitehere = True;
              // }
              // }
            }else{
              $URL = strtolower($_SERVER["REQUEST_URI"]);
              foreach($U->contentHandlers as $mainkey => $mainvalue){
                foreach($mainvalue as $key => $value){
                  if($key == "URL" && preg_split("/[^\/]+$/", $URL)[0] == $value){
                    $URL = str_replace($value, "", $URL);
                    $contenttype = $mainkey;
                  }
                }
              }
              if(isset($contenttype)){
                $sql = "SELECT * FROM ".$U->contentHandlers[$contenttype]["Name"];
                $db_erg = mysqli_query($U->db_link, $sql);
                while($row = mysqli_fetch_array($db_erg, MYSQLI_ASSOC)){
                  if($row["Name"] == $URL){
                    $sitehere = True;
                    // Checks if the content page is online {
                    if($row["Online"] == 1){
                      if(!isset($U->contentHandlers[$contenttype]["HTML"]) || $U->contentHandlers[$contenttype]["HTML"] == True){
                        $site = htmlspecialchars_decode($U->contentHandlers[$contenttype]["ShowHandler"]($row["Code"], ["Name" => $row["Name"], "Code" => $row["Code"], "Author" => $row["Author"], "Date" => $row["Date"], "Online" => $row["Online"], "Id" => $row["ID"]]));
                      }else{
                        $site = $U->contentHandlers[$contenttype]["ShowHandler"]($row["Code"], ["Name" => $row["Name"], "Code" => $row["Code"], "Author" => $row["Author"], "Date" => $row["Date"], "Online" => $row["Online"], "Id" => $row["ID"]]);
                      }
                    }else{
                      $site = $U->getLang("error.offline");
                    }
                    // }
                  }
                }
              }else{
                $sitehere = False;
              }
            }
            if($sitehere){
              // If the page is here it get's outputed {
              if($amp){
                $site = str_replace("%img src=", "<amp-iframe onload='javascript:(function(o){o.style.height=o.contentWindow.document.body.scrollHeight+\"px\";}(this));' style=\"height:200px;width:100%;border:none;overflow:hidden;\" src=\"", $site);
                $site = str_replace(" img%", "\" ></amp-iframe>", $site);
                $site = str_replace("%\img src=", "%img src=", $site);
                $site = str_replace(" img\%", 'img%', $site);
                $site = str_replace('%\\img src=', '\%img src=', $site);
                $site = str_replace(' img\\%', 'img\%', $site);
              }else{
                $site = str_replace("%img src=", "<iframe onload='javascript:(function(o){o.style.height=o.contentWindow.document.body.scrollHeight+\"px\";}(this));' style=\"height:200px;width:100%;border:none;overflow:hidden;\" src=\"", $site);
                $site = str_replace(" img%", "\" ></iframe>", $site);
                $site = str_replace("%\img src=", "%img src=", $site);
                $site = str_replace(" img\%", 'img%', $site);
                $site = str_replace('%\\img src=', '\%img src=', $site);
                $site = str_replace(' img\\%', 'img\%', $site);
              }
              echo $site;
              // }
            }else{
              // If no content page is found it throws an HTTP 404 error {
              header("HTTP/1.1 404 Not found");
              header('Location: '.$USOC["DOMAIN"].'/error?E=404');
              // }
            }
            if(!$raw && !$amp){
          ?>
        </article>
        <?php
          include_once "siteelements/footer.php"
        ?>
      </body>
    </html> 
<?php 
    }
  }else{
?>
    <!DOCTYPE html>
    <html lang="<?php echo $U->getSetting("site.lang"); ?>" dir="ltr">
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
          <p><?php echo $U->getLang("rights.error"); ?></p>
        </article>
        <?php
          include_once "siteelements/footer.php";
        ?>
      </body>
    </html>
<?php
  }
?>