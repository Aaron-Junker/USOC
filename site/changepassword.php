<?php
  session_start();
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
        if($U->getSetting("login.changepassword") == 0){
          echo "<p>".$U->getLang("login.changepass.blocked")."</p>";
        }else{
          $code = <<<HEREDOC
            <form action="login/changepass.php" method="post">
              <label for="oldpass">%a</label><input type="password" name="oldpass" /><br />
              <label for="newpass1">%b</label><input type="password" name="newpass1" /><br />
              <label for="newpass2">%c</label><input type="password" name="newpass2" /><br />
              <input type="submit" />
            </form>
          HEREDOC;
          $code = str_replace("%a",$U->getLang("login.changepass.old"),$code);
          $code = str_replace("%b",$U->getLang("login.changepass.new"),$code);
          $code = str_replace("%c",$U->getLang("login.changepass.new_twice"),$code);
          echo $code;
        }
      ?>

    </article>
      <?php
        include_once "siteelements/footer.php";
      ?>
  </body>
</html>
