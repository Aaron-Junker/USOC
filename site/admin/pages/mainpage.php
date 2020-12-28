<!DOCTYPE html>
<html lang="<?php echo $U->getSetting("site.lang"); ?>" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title><?php echo $U->getLang("admin"); ?></title>
    <link rel="stylesheet" href="../images/icofont/icofont.min.css" />
  </head>
  <body>
    <h1><?php echo $U->getLang("admin.welcome") ?></h1>
    <i class="icofont-settings"></i><a href="<?php echo $_SERVER['PHP_SELF']; ?>?URL=settingsoverview"><?php echo $U->getLang("admin.settings.edit"); ?></a><br />    
    <i class="icofont-ui-user"></i><a href="<?php echo $_SERVER['PHP_SELF']; ?>?URL=useredit"><?php echo $U->getLang("admin.user.edit"); ?></a><br />
    <i class="icofont-page"></i><a href="<?php echo $_SERVER['PHP_SELF']; ?>?URL=editor"><?php echo $U->getLang("admin.edit.new.site"); ?></a><br />
    <i class="icofont-page"></i><a href="<?php echo $_SERVER['PHP_SELF']; ?>?URL=blogeditor"><?php echo $U->getLang("admin.edit.new.blogsite"); ?></a><br />
    <i class="icofont-ui-delete"></i><a href="<?php echo $_SERVER['PHP_SELF']; ?>?URL=deletepage"><?php echo $U->getLang("admin.delete"); ?></a><br />
    <i class="icofont-card"></i><a href="<?php echo $_SERVER['PHP_SELF']; ?>?URL=about"><?php echo $U->getLang("admin.about"); ?></a><br />
    <i class="icofont-ui-settings"></i><a href="<?php echo $_SERVER['PHP_SELF']; ?>?URL=settingseditor"><?php echo $U->getLang("admin.settingsadvanced.edit"); ?></a><br />
    <form action="<?php echo $_SERVER['PHP_SELF']; ?>">
      <select name="SiteName">
        <?php
          $sql = "SELECT * FROM Sites";
          $db_erg = mysqli_query($U->db_link, $sql);
          while ($row = mysqli_fetch_array($db_erg, MYSQLI_ASSOC))
          {
            echo "<option value='".$row["Name"]."'>".$row["Name"]."</option>";
          }
        ?>
      </select>
      <input type="hidden" name="URL" value="editor" />
      <button type="submit"><?php echo $U->getLang("admin.edit.site") ?></button>
    </form>
      <form action="<?php echo $_SERVER['PHP_SELF']; ?>">
        <select name="SiteName">
          <?php
            $sql = "SELECT * FROM Blog";
            $db_erg = mysqli_query($U->db_link, $sql);
            while($row = mysqli_fetch_array($db_erg, MYSQLI_ASSOC)){
              echo "<option value='".$row["Name"]."'>".$row["Name"]."</option>";
            }
         ?>
       </select>
        <input type="hidden" name="URL" value="blogeditor" />
        <button type="submit"><?php echo $U->getLang("admin.edit.blogsite"); ?></button>
    </form>
  </body>
</html>
