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
      <h3> Registrieren </h3>
      <?php
      if (register_open()){
        echo <<<HEREDOC
        <form action="login/register.php" method="post">
          <label for="U">Benutzername</label>
          <input type="text" name="U" /><br>
          <label for="M">Mailadresse</label>
          <input type="text" name="M" /><br>
          <label for="P">Passwort</label>
          <input type="password" name="P" /><br>
          <label for="PR">Passwort wiederhohlen</label>
          <input type="password" name="PR" /><br>
          <input type="checkbox" name="D" /><label for="D">Ich bestätige die <a href="Datenschutzerklärung.php">Datenschutzerklärung</a> gelesen und verstanden zu haben</label><br />
          <input type="submit" value="Abschicken" />
        </form>
        HEREDOC;
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
