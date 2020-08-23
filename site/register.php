<?php
  include_once "configuration.php";
  include_once "includes/class.inc.php";
  function register_open(){
    if(getSetting("login.register_open")=="1"){
      return True;
    }
    return False;
  }
?>
<!DOCTYPE html>
<html lang="de" dir="ltr">
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
      <h3><?php echo getLang("content.login.register"); ?></h3>
      <?php
        if(register_open()){
          $HTML =<<<HEREDOC
          <form action="login/register.php" method="post">
            <label for="U">'
          HEREDOC;
          $HTML += getLang("login.username");
          $HTML += <<<HEREDOC
            </label>
            <input type="text" name="U" /><br>
            <label for="M">Mailadresse</label>
            <input type="text" name="M" /><br>
            <label for="P">Passwort</label>
            <input type="password" name="P" /><br>
            <label for="PR">Passwort wiederhohlen</label>
            <input type="password" name="PR" /><br>
            <input type="submit" />
          </form>
          HEREDOC;
          echo $HTML;
      }else{
        echo U.getLang("register.succeeded");
      }
      ?>
    </article>
    <?php
      include_once "siteelements/footer.php";
    ?>
  </body>
</html>
