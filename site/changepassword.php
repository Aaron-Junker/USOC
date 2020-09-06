<?php
  session_start();
  include_once "configuration.php";
  include_once "includes/class.inc.php";
  $U = new U();
?>
<!DOCTYPE html>
<html lang="<?php echo getSetting("site.lang"); ?> dir="ltr">
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
          echo "<p>Zur Zeit kann kein Passwort geändert werden.</p>";
        }else{
          echo <<<HEREDOC
            <form action="login/changepass.php" method="post">
              <label for="oldpass">Altes Passwort:</label><input type="password" name="oldpass" /><br />
              <label for="newpass1">Neues Passwort:</label><input type="password" name="newpass1" /><br />
              <label for="newpass2">Neues Passwort wiederhohlen:</label><input type="password" name="newpass2" /><br />
              <input type="submit" />
            </form>
          HEREDOC;
        }
      ?>

    </article>
      <?php
        include_once "siteelements/footer.php";
      ?>
  </body>
</html>
