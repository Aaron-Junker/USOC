<?php
  include_once "configuration.php";
  include_once $USOC["SITE_PATH"]."/includes/class.inc.php";
  newClass();
?>
<!DOCTYPE html>
<html lang="<?php echo $U->getSetting("site.lang") ?>" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title><?php echo $U->getLang("admin") ?> - <?php echo $U->getLang("admin.about"); ?></title>
  </head>
  <body>
    <a href="<?php echo $_SERVER['PHP_SELF']; ?>?URL=mainpage"><?php echo $U->getLang("admin.back") ?></a>
    <h1>USOC</h1>
    <h2>Useful Simple Open-source CMS</h2>
    <p><b><?php echo $U->getLang("admin.about.version").": ".$U->version; ?></b></p>
    <?php
      $newestVersion = $U->getNewestVersion();
      if(!isset($newestVersion["Code"]) || $newestVersion["Code"] === False){
        echo $U->getLang("admin.about.version.error");
      }elseif($newestVersion["Code"] > $U->versionCode){
        echo $U->getLang("admin.about.version.new").": "."<a href=\"".$newestVersion["URL"]."\">".$newestVersion["Name"]."</a>" ;
      }elseif($newestVersion["Code"] < $U->versionCode){
        echo $U->getLang("admin.about.version.developer");
      }elseif($newestVersion["Code"] == $U->versionCode){
        echo $U->getLang("admin.about.version.least");
      }else{
        echo $U->getLang("admin.about.version.error");
      }
    ?>
    <h3><?php echo $U->getLang("admin.about.plugins"); ?></h3>
    <ul>
      <?php
        foreach($U->contentHandlers as $key => $value){
          echo "<li><a href=\"".$value["InfoURL"]."\">".$value["DisplayName"]."</a> ".$U->getLang("admin.about.by")." ".$value["Author"]."</li>";
        }
      ?>
    </ul>
    <br /><p><?php echo $U->getLang("admin.about.license"); ?></p>
    <p>By Case Games 2020</p>
    <img src="<?php echo $USOC["SITE_PATH"]."/images/caselogo.png"; ?>" height="200" />
    <p>Icons by Icofont. <a href="https://icofont.com/icons">Website from Icofont</a></p>
    <p><?php echo $U->getLang("admin.about.developed_by"); ?></p>
    <ul>
      <li>Aaron Junker</li>
    </ul>
  </body>
</html>
