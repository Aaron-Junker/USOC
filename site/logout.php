<?php session_start();session_destroy(); ?>
<!DOCTYPE html>
<html lang="de" dir="ltr">
  <head>
  <base href="https://casegames.ch">
    <meta charset="utf-8">
<title>Case Games</title>
<link rel="stylesheet" href="css.css" type="text/css" />
      <meta name="google-signin-client_id" content="756607949092-ruurljso4jm5nqlntni2llfc4g625pl5.apps.googleusercontent.com">
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
