<?php
  /**
  * Page where you can register a new account. Deactivated if login.register_open is 0.
  */
  include_once "configuration.php";
  include_once "includes/class.inc.php";
  newClass();
  /**
  * Returns true if login.register_open is 1 otherwise it returns false.
  * @return bool
  */
  function register_open(){
    if(getSetting("login.register_open")=="1"){
      return True;
    }
    return False;
  }
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
      <h3><?php echo $U->getLang("register.g"); ?></h3>
      <?php
        if(register_open()){
          $HTML =<<<HEREDOC
          <form action="login/register.php" method="post">
            <label for="U">
          HEREDOC;
          $HTML .= $U->getLang("login.username.g");
          $HTML .= <<<HEREDOC
            </label>
            <input type="text" name="U" /><br>
            <label for="M">%a</label>
            <input type="text" name="M" /><br>
            <label for="P">%b</label>
            <input type="password" name="P" /><br>
            <label for="PR">%c</label>
            <input type="password" name="PR" /><br>
            <input type="submit" />
          </form>
          HEREDOC;
          $HTML = str_replace("%a",$U->getLang("login.mail.g"),$HTML);
          $HTML = str_replace("%b",$U->getLang("login.password.g"),$HTML);
          $HTML = str_replace("%c",$U->getLang("login.password.repeat.g"),$HTML);
          echo $HTML;
      }else{
        echo $U->getLang("register.succeed");
      }
      ?>
    </article>
    <?php
      include_once "siteelements/footer.php";
    ?>
  </body>
</html>
