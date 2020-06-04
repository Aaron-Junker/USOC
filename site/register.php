<?php
  include_once "phpapi/getsettings.php";
  function register_open(){
    if(getSetting("login.register_open")=="1"){
    return True;
  }else{
    return False;
  }
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
      <h3><?php echo getLang("content.login.register") ?></h3>
      <?php
      if (register_open()){
        echo '
        <form action="login/register.php" method="post">
          <label for="U">'.getLang("login.username").'</label>
          <input type="text" name="U" /><br>
          <label for="M">Mailadresse</label>
          <input type="text" name="M" /><br>
          <label for="P">Passwort</label>
          <input type="password" name="P" /><br>
          <label for="PR">Passwort wiederhohlen</label>
          <input type="password" name="PR" /><br>
          <input type="submit" />
        </form>
        '
      }else{
        echo "registrierung geschlossen";
      }
      ?>
    </article>
    <?php
      include_once "siteelements/footer.php"
    ?>
  </body>
</html>
