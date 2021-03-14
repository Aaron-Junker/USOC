<!DOCTYPE html>
<html lang="<?php echo $U->getSetting("site.lang"); ?>" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title><?php echo $U->getLang("admin"); ?></title>
    <link rel="stylesheet" href="../images/icofont/icofont.min.css" />
  </head>
  <body>
    <h1><?php echo $U->getLang("admin.welcome") ?></h1>
    <?php
      if(file_exists($USOC["SITE_PATH"]."/install/index.php")){
    ?>
        <p style="background-color:red"><?php echo $U->getLang("admin.installFolder"); ?></p>
    <?php
      }
    ?>
    <?php
      if($U->userHasPermission("Backend", "Settings", "Standard")){
    ?>
    <i class="icofont-settings"></i><a href="<?php echo $_SERVER['PHP_SELF']; ?>?URL=settingsoverview"><?php echo $U->getLang("admin.settings.edit"); ?></a><br />
    <?php
      }
      if($U->userHasPermission("Backend", "User")){
    ?>
    <i class="icofont-ui-user"></i><a href="<?php echo $_SERVER['PHP_SELF']; ?>?URL=useredit"><?php echo $U->getLang("admin.user.edit"); ?></a><br />
    <?php
      }
    ?>
    <form action="<?php echo $_SERVER['PHP_SELF']; ?>" method="get">
      <i class="icofont-page"></i><span><?php echo $U->getLang("admin.edit.new.create"); ?></span>
      <select name="Type">
        <?php
          foreach($U->contentHandlers as $mainkey => $mainvalue){
            if($mainvalue["CreateNewContent"]){
              echo "<option value='".$mainkey."'>".$mainvalue["DisplayName"]."</option>";
            }
          }
        ?>
      </select>
      <input type="hidden" name="URL" value="editor">
      <button><?php echo $U->getLang("admin.edit.new.create.action"); ?></button>
    </form>
    <form action="<?php echo $_SERVER['PHP_SELF']; ?>" method="get">
      <i class="icofont-ui-delete"></i><span><?php echo $U->getLang("admin.delete.content"); ?></span>
      <select name="Type">
        <?php
          foreach($U->contentHandlers as $mainkey => $mainvalue){
            if($mainvalue["CreateNewContent"]){
              echo "<option value='".$mainkey."'>".$mainvalue["DisplayName"]."</option>";
            }
          }
        ?>
      </select>
      <input type="hidden" name="URL" value="deletepage">
      <button><?php echo $U->getLang("admin.delete.content.action"); ?></button>
    </form>
    <?php
      if($U->userHasPermission("Backend", "About")){
    ?>
        <i class="icofont-card"></i><a href="<?php echo $_SERVER['PHP_SELF']; ?>?URL=about"><?php echo $U->getLang("admin.about"); ?></a><br />
    <?php
      }
      if($U->userHasPermission("Backend", "Settings", "Advanced")){
    ?>
        <i class="icofont-ui-settings"></i><a href="<?php echo $_SERVER['PHP_SELF']; ?>?URL=settingseditor"><?php echo $U->getLang("admin.settingsadvanced.edit"); ?></a><br />
    <?php
      }
      foreach($U->contentHandlers as $mainkey => $mainvalue){
        if($mainvalue["CreateNewContent"]){
          echo "<form action='".$_SERVER['PHP_SELF']."'>";
          echo "<select name='SiteName'>";
          $sql = "SELECT * FROM ".$mainvalue["Name"];
          $db_erg = mysqli_query($U->db_link, $sql);
          while($row = mysqli_fetch_array($db_erg, MYSQLI_ASSOC)){
            echo "<option value='".$row["Name"]."'>".$row["Name"]."</option>";
          }
          echo "</select>";
          echo "<input type='hidden' name=Type value='".$mainkey."' />";
          echo "<input type='hidden' name='URL' value='editor' />";
          echo "<button type='submit'>".str_replace("%a",$mainvalue["DisplayName"],$U->getLang("admin.edit"))."</button>";
          echo "</form>";
        }
      }
    ?>
  </body>
</html>
