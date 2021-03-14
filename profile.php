<?php
  /**
  * Page that contains profile settings and information.
  */
  session_start();
  include_once "configuration.php";
  include_once "includes/class.inc.php";
  newClass();
  if($U->userHaspermission("Profile")){
?>
  <!DOCTYPE html>
  <html lang="<?php echo $U->getSetting("site.lang"); ?>" dir="ltr">
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
      <meta name="google-signin-client_id" content="<?php echo $U->getSetting("oAuth.google.client_id"); ?>.apps.googleusercontent.com">
      <script src="https://apis.google.com/js/platform.js" async defer></script>
    </head>
    <body>
      <?php
        include_once "siteelements/header.php"
      ?>
      <article>
        <h1><?php echo $U->getLang("profile.settings"); ?></h1>
        <?php
          include_once 'login/src/FixedBitNotation.php';
          include_once 'login/src/GoogleAuthenticatorInterface.php';
          include_once 'login/src/GoogleAuthenticator.php';
          include_once 'login/src/GoogleQrUrl.php';
          $g = new \Sonata\GoogleAuthenticator\GoogleAuthenticator();
          if(isset($_SESSION["User_ID"])){
        ?>
            <h2><?php echo $_SESSION["User_Name"];?></h2>
        <?php
            if($U->userHasPermission("Profile","Change_password")){
        ?>
              <a href="changepassword.php"><?php echo $U->getLang("login.changepass"); ?></a><br />
        <?php
            }
            if($U->userHasPermission("Profile","Show_profile_picture")){
              echo $U->getProfilePicture($_SESSION["User_Name"]);
        ?>
          <br><a target="_blank" href="https://gravatar.com"><button><?php echo $U->getLang("profile.changePP"); ?></button></a><br />
        <?php
            }
            $sql = "SELECT * FROM User WHERE Username='".$_SESSION["User_Name"]."'";
            $db_erg = mysqli_query($U->db_link, $sql);
            while ($row = mysqli_fetch_array($db_erg, MYSQLI_ASSOC)){
              if($row["google_token"] == "" && file_exists("login/client_string.json") && $U->userHasPermission("Profile","Add_google_login")){
        ?>
                <b><?php echo str_replace("%a",$U->getLang("login.oAuth.google"),$U->getLang("login.oAuth.connect")); ?></b>
                <form action="login/googletoken.php" method="post" style="display:none;">
                  <input type="hidden" name="token" />
                  <input type="submit" name="bsubmit" />
                </form>
                <div class="g-signin2" data-onsuccess="onSignIn"></div>
        <?php
              }elseif(file_exists("login/client_string.json")&& $U->userHasPermission("Profile","Add_google_login")){ 
        ?>
                <b><?php echo str_replace("%a",$U->getLang("login.oAuth.google"),$U->getLang("login.oAuth.connect")); ?></b>
                <p><?php echo str_replace("%a",$U->getLang("login.oAuth.google"),$U->getLang("login.oAuth.fail")); ?></p>
        <?php
              }
              if($row["google_2fa"] == "" && $U->getSetting("2fa.enabled") == 1){
                $secret = $g->generateSecret();
                echo $U->getLang("login.2fa.google_authenticator.manual");
        ?>
                <img src="<?php echo \Sonata\GoogleAuthenticator\GoogleQrUrl::generate($_SESSION["User_Name"], $secret, getSetting("2fa.name"));?>">
                <form action="login/2fa.php" method="post">
                  <input type="hidden" name="secret" value="<?php echo $secret;?>" />
                  <input name="register" type="submit" value="<?php echo $U->getLang("login.2fa.google_authenticator.scanned");?>" />
                </form>
        <?php
              }elseif($U->getSetting("2fa.enabled") == 1 && $U->userHasPermission("Profile", "Add_2FA")){
        ?>
          <b><?php echo str_replace("%a",$U->getLang("login.2fa.google_authenticator"),$U->getLang("login.2fa.with")); ?></b>
          <p><?php echo $U->getLang("login.2fa.already"); ?></p>
          <form action="login/2fa.php" method="post">
            <input name="delete" type="submit" value="<?php echo $U->getLang("login.2fa.disconnect");?>" />
          </form>
        <?php
              }
              if($U->userHasPermission("Profile", "Delete_account")){
        ?>
                <br /><br /><a style="color:red" onClick='return confirm("<?php echo $U->getLang("profile.delete.confirm");?>")' href="login/deleteUser.php"><?php echo $U->getLang("profile.delete"); ?></a>
        <?php
              }
            }
          }else{
        ?>
            <p><?php echo $U->getLang("login.not_logged_in"); ?></p>
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
<?php
  }else{
?>
  <!DOCTYPE html>
  <html lang="<?php echo $U->getSetting("site.lang"); ?>" dir="ltr">
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
        <p><?php echo $U->getLang("rights.error"); ?></p>
      </article>
      <?php
        include_once "siteelements/footer.php";
      ?>
    </body>
<?php
  }
?>