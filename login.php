<?php
  session_start();
  include_once "configuration.php";
  include_once "includes/class.inc.php";
  newClass();
?>
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
    <meta name="google-signin-client_id" content="<?php echo $U->getSetting("oAuth.google.client_id"); ?>.apps.googleusercontent.com">
    <script src="https://apis.google.com/js/platform.js" async defer></script>
  </head>
  <body>
    <?php
      include_once "siteelements/header.php"
    ?>
    <article>
      <?php
        if(isset($_SESSION['temp_User_ID'])){
      ?>
          <form action="login/2fa.php" method="post">
          <label for="code"><?php echo $U->getLang("login.2fa.google_authenticator.code"); ?></label>
            <input name="code" />
            <input type="submit" name="login"/>
          </form>
      <?php
        }else{
          if(isset($_GET["ERROR"])){
            echo "<p id='error'>False Password or Username</p>";
          }
          if(isset($_SESSION["User_ID"])) {
            echo $U->getLang("login.already");
          }elseif($U->getSetting("login.login_open")==0){
            echo "<h3>".$U->getLang("login.login_closed")."</h3>";
          }else{
            $HTML = <<<HEREDOC
            <form action="login/login.php" method="post">
              <label for="B">%a</label>
              <input type="text" name="B" />
              <label for="P">%b</label>
              <input type="password" name="P" />
              <input type="submit" name="button"/>
            </form>
            HEREDOC;
            if(file_exists("login/client_string.json")){
              $HTML .= <<<HEREDOC
              <h5>%c</h5>
              <div class="g-signin2" data-onsuccess="onSignIn"></div>
              HEREDOC;
            }
            $HTML = str_replace("%a",$U->getLang("login.username.g"),$HTML);
            $HTML = str_replace("%b",$U->getLang("login.password.g"),$HTML);
            $HTML = str_replace("%c",$U->getLang("login.oAuth.login"),$HTML);
            $HTML = str_replace("%a",$U->getLang("login.oAuth.google"),$HTML);
            echo $HTML;
          }
        ?>
        <form style="display:none;" action="login/googlelogintoken.php" method="post">
          <input type="text" name="token" />
          <input type="submit" name="bsubmit"/>
        </form>
      <?php
        }
      ?>
    </article>
      <?php
        include_once "siteelements/footer.php"
      ?>
  </body>
</html>
