<?php
  include_once "configuration.php";
  include_once $USOC["SITE_PATH"]."/includes/class.inc.php";
  newClass();
?>
<!DOCTYPE html>
<html lang="<?php echo $U->getSetting("site.lang") ?>" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <a href="<?php echo $_SERVER['PHP_SELF']; ?>?URL=mainpage"><?php echo $U->getLang("admin.back") ?></a>
    <h1>USOC</h1>
    <h2>Useful Simple Open-source CMS</h2>
    <p><?php echo $U->getLang("admin.about.version").": ".$U->version; ?></p>
    <p><?php echo $U->getLang("admin.about.license"); ?></p>
    <p>By Case Games 2020</p>
    <img src="<?php echo $USOC["SITE_PATH"]."/images/caselogo.png"; ?>" height="250"/>
    <p><?php echo $U->getLang("admin.about.developed_by"); ?></p>
    <ul>
      <li>Aaron Junker</li>
    </ul>
  </body>
</html>
