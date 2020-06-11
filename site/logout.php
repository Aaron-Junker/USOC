<?php session_start();session_destroy(); ?>
<!DOCTYPE html>
<html lang="de" dir="ltr">
  <head>
    <meta charset="utf-8">
<title>Case Games</title>
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
      <h1>Sie wurden ausgeloggt</h1>
    </article>
    <?php
      include_once "siteelements/footer.php"
    ?>
  </body>
</html>
