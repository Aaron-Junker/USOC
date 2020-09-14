<?php
  session_start();
  session_destroy();
  include "configuration.php";
  include "/includes/class.inc.php";
  newClass();
?>
<!DOCTYPE html>
<html lang="<?php echo $U->getSetting("site.lang") ?>" dir="ltr">
  <head>
    <meta charset="<?php echo $U->getLang("lang.charset"); ?>">
    <title><?php echo getSetting("site.name") ?></title>
    <link rel="stylesheet" href="style/css.php" type="text/css" />
    <meta name="google-signin-client_id" content="*.apps.googleusercontent.com">
    <script src="https://apis.google.com/js/platform.js" async defer></script>
    <script async>
      function signOut() {
          onLoad();
          var auth2 = gapi.auth2.getAuthInstance();
          auth2.signOut().then(function () {
            console.log('User signed out.');
        });
      }
      function onLoad() {
        gapi.load('auth2', function() {
          gapi.auth2.init();
        });
      }
      document.addEventListener("DOMContentLoaded", function(){
      setTimeout(function() {
        signOut();
        },1500);
      signOut();})
    </script>
  </head>
  <body>
    <?php
      include_once "siteelements/header.php"
    ?>
    <article>
      <h1><?php echo $U->getLang("login.logout");?></h1>
    </article>
    <?php
      include_once "siteelements/footer.php"
    ?>
  </body>
</html>
