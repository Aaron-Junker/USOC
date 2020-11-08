<!DOCTYPE html>
<html lang="<?php echo $U->getSetting("site.lang") ?>" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title><?php echo $U->getLang("admin") ?> - <?php echo $U->getLang("admin.settings") ?></title>
  </head>
  <body>
    <a href="<?php echo $U->getLang("admin.back") ?>"></a>
    <?php
      if(isset($_GET["N"])&&isset($_GET["V"])){
        $sql = "UPDATE Settings SET Value='".$_GET["V"]."' WHERE Name ='".$_GET["N"]."';";
        $db_erg = mysqli_query($U->$db_link, $sql );
        echo $U->getLang("admin.settings.edit.end");
      }
    ?>
  </body>
</html>
