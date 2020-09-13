<?php session_start() ?>
<!DOCTYPE html>
<html lang="<?php echo $U->getSetting("site.lang") ?>" dir="ltr">
  <head>
  <?php
      include_once "siteelements/head.php"
    ?>

    <script>
    window.onLoadCallback = function(){
      gapi.load('auth2', function(){
        gapi.signin2.render('g-signin2', {
          'longtitle': true,
          'theme': 'dark'
        });

    })

  }
  function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    var idfield=document.getElementsByName("token")[0];
    var idsubmit = document.getElementsByName("bsubmit")[0];
    idfield.value=id_token;
    idsubmit.click()
}
    </script>
    <meta name="google-signin-client_id" content="756607949092-ruurljso4jm5nqlntni2llfc4g625pl5.apps.googleusercontent.com">
    <script src="https://apis.google.com/js/platform.js" async defer></script>
  </head>
  <body>
    <?php
      include_once "siteelements/header.php"
    ?>
    <article>
      <?php
      if(isset($_GET["ERROR"])){
        echo "<p id='error'>".getError($_GET["ERROR"],"de")."</p>";
      }
      if (isset($_SESSION["User_ID"])) {
        echo "Bereits angemeldet";
      }elseif(getSetting("login.login_open")==0){
        echo <<<HERE
          <h3>Login Geschlossen</h3>
          <p> Bitte melde dies beim Webmaster <a href="mailto:aaron.junker@outlook.com">aaron.junker@outlook.com</a></p>
        HERE;
      }else{
        echo <<<HEREDOC
        <form action="login/login.php" method="post">
        Benutzername:
        <input type="text" name="B" />
        Passwort:
        <input type="password" name="P" />
        <input type="submit" name="button"/>
      </form>
      <h5>Mit Google anmelden</h5>
      <div class="g-signin2" data-onsuccess="onSignIn"></div>
      HEREDOC;
    }
      ?>
      <form style="display:none;" action="login/googlelogintoken.php" method="post">
        <input type="text" name="token" />
        <input type="submit" name="bsubmit"/>
      </form>
    </article>
      <?php
        include_once "siteelements/footer.php"
      ?>
  </body>
</html>
