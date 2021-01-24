<?php
  /** 
  * This file logs you out from Google and from the page.
  */
  session_start();
  session_destroy();
  include "configuration.php";
  include "includes/class.inc.php";
  newClass();
?>
<!DOCTYPE html>
<html lang="<?php echo $U->getSetting("site.lang") ?>" dir="ltr">
  <head>
    <meta charset="<?php echo $U->getLang("lang.charset"); ?>">
    <title><?php echo getSetting("site.name") ?></title>
    <link rel="stylesheet" href="styles/css.php" type="text/css" />
    <script>
      document.addEventListener("DOMContentLoaded", function(event) {
        document.getElementsByClassName("noscript")[0].style ="display:none;"
        document.getElementsByTagName("header")[0].style ="display:block;"
        document.getElementsByTagName("footer")[0].style ="display:block;"
        document.getElementsByTagName("article")[0].style ="display:block;"
      })
    </script>
    <script>
      localStorage.setItem('LogOut', '1');
      setTimeout(function(){
        localStorage.setItem('LogOut', '0');
      }, 1000);

      function deleteAllCookies() {
        var cookies = document.cookie.split(";");

        (function () {
    var cookies = document.cookie.split("; ");
    for (var c = 0; c < cookies.length; c++) {
        var d = window.location.hostname.split(".");
        while (d.length > 0) {
            var cookieBase = encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=' + d.join('.') + ' ;path=';
            var p = location.pathname.split('/');
            document.cookie = cookieBase + '/';
            while (p.length > 0) {
                document.cookie = cookieBase + p.join('/');
                p.pop();
            };
            d.shift();
        }
    }
})();
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