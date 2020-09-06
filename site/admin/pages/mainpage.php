<!DOCTYPE html>
<html lang="de" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>Adminbereich</title>
  </head>
  <body>
    <h1>Willkommen</h1>
    <a href="<?php echo $_SERVER['PHP_SELF']; ?>?URL=settingseditor">Einstellungen bearbeiten</a><br />
    <a href="<?php echo $_SERVER['PHP_SELF']; ?>?URL=useredit">Benutzer editieren</a><br />
    <a href="<?php echo $_SERVER['PHP_SELF']; ?>?URL=Newsletter">Newsletter verfassen</a><br />
    <a href="<?php echo $_SERVER['PHP_SELF']; ?>?URL=mainpageedit">Hauptseite editieren</a><br />
    <a href="<?php echo $_SERVER['PHP_SELF']; ?>?URL=editor">Neue Seite erstellen</a><br />
    <a href="<?php echo $_SERVER['PHP_SELF']; ?>?URL=blogeditor">Neue Blogseite erstellen</a><br />
    <form action="<?php echo $_SERVER['PHP_SELF']; ?>">
      <select name="SiteName">
      <?php
      $db_link = mysqli_connect(MYSQL_HOST,MYSQL_USER,MYSQL_PASSWORD,MYSQL_DATABASE);
      $sql = "SELECT * FROM Sites";
      $db_erg = mysqli_query( $db_link, $sql );
      while ($zeile = mysqli_fetch_array( $db_erg, MYSQLI_ASSOC))
      {
        echo "<option value='".$zeile["Name"]."'>".$zeile["Name"]."</option>";
      }
       ?>
     </select>
    <input type="hidden" name="URL" value="editor" />
      <button type="submit">Seite Editieren</button></form>
      <form action="<?php echo $_SERVER['PHP_SELF']; ?>">
        <select name="SiteName">
        <?php
        $db_link = mysqli_connect(MYSQL_HOST,MYSQL_USER,MYSQL_PASSWORD,MYSQL_DATABASE);
        $sql = "SELECT * FROM Blog";
        $db_erg = mysqli_query( $db_link, $sql );
        while ($zeile = mysqli_fetch_array( $db_erg, MYSQLI_ASSOC))
        {
          echo "<option value='".$zeile["Name"]."'>".$zeile["Name"]."</option>";
        }
         ?>
       </select>
        <input type="hidden" name="URL" value="blogeditor" />
        <button type="submit">Blogseite Editieren</button>
    </form>
  </body>
</html>
