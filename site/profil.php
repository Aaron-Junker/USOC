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
          gapi.auth2.init();
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
      <h3>Profileinstellungen</h3>
      <?php
        include_once "phpapi/getsettings.php";
        include_once 'login/src/FixedBitNotation.php';
        include_once 'login/src/GoogleAuthenticatorInterface.php';
        include_once 'login/src/GoogleAuthenticator.php';

        include_once 'login/src/GoogleQrUrl.php';
        $g = new \Sonata\GoogleAuthenticator\GoogleAuthenticator();
        if(isset($_SESSION["User_ID"])){
        ?>
        <h1><?php echo $_SESSION["User_Name"];?></h1>
        <?php
          echo $U->getPP();
        ?>
        <br><a target="_blank" href="https://de.gravatar.com"><button>Profilbild ändern auf Gravatar.com</button></a><br />
        <?php
        $db_link = mysqli_connect(MYSQL_HOST,MYSQL_USER,MYSQL_PASSWORD,MYSQL_DATABASE);
        $sql = "SELECT * FROM User WHERE Username='".$_SESSION["User_Name"]."'";
        $db_erg = mysqli_query( $db_link, $sql );
        while ($zeile = mysqli_fetch_array( $db_erg, MYSQLI_ASSOC)){
          if($zeile["google_token"] ==""){
        ?>
        <b>Google account verknüpfen</b>
        <div class="g-signin2" data-onsuccess="onSignIn"></div>
        <?php
          }else{
        ?>
        <p>Google account bereits verknüpft</p>
        <?php
          }
          if($zeile["google_2fa"] == ""){
            $secret = $g->generateSecret();
        ?>
        <b>Zweifaktorauthentifizierung mit Google Authenticator</b>
        <p>Folgenden Code einscannen mit Google Authenticator</p>
        <p>Achtung! Wenn man mit Google einloggt, wird die 2fa nicht aktiv</p>
        <img src="<?php echo \Sonata\GoogleAuthenticator\GoogleQrUrl::generate($_SESSION["User_Name"], $secret, getSetting("2fa.name"));?>">
        <form action="login/2fa.php" method="post">
          <input type="hidden" name="secret" value="<?php echo $secret;?>" />
          <input name="register" type="submit" value="Den Code habe ich gescannt" />
        </form>
        <?php
          }else{
        ?>
        <b>Zweifaktorauthentifizierung mit Google Authenticator</b>
        <p>Bereits verknüpft</p>
        <form action="login/2fa.php" method="post">
          <input name="delete" type="submit" value="entknüpfen" />
        </form>
        <?php
          }}}else{
        ?>
          <p>Du bist nicht eingeloggt.</p>
        <?php
          }
        ?>
        <?php
          include_once "siteelements/footer.php";
        ?>
        <form style="display:none;" action="login/googletoken.php" method="post">
          <input type="text" name="token" />
          <input type="submit" name="bsubmit"/>
        </form>
    </article>
  </body>
</html>
