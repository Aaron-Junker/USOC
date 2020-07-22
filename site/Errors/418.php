<?php
  include "../phpapi/getsettings.php"
?>
<!DOCTYPE html>
<html lang="de" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>418-Error</title>
  </head>
  <body>
    <h1><?php echo getLang("errors.418", lang) ?></h1>
    <a href="/index.php"><?php echo sprintf(getLang("errors.mainpage", lang),getLang("page.mainpage", lang)) ?></a>
  </body>
</html>
