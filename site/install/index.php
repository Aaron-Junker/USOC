<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>Install USOC</title>
  </head>
  <body>
    <h1>Install USOC</h1>
    <h2>Experimantal feature. Sometimes doesn't work</h2>
    <ul>
      <li>Version: Pa1.8Bfx0</li>
      <li>You need PHP 7: <?php if (PHP_VERSION_ID > 69999){echo "Yes!";}else{echo "You must update!";} ?></li>
      <li>You need Mysql: Can't check</li>
      <form action="step2.php" method="post">
        <label for="Name">Name of the site:</label>
        <input name="Name" /><br />
        <label for="Author">Author of content:</label>
        <input name="Author" /><br />
        <label for="Lang">Language:</label>
        <select name="Lang">
          <option value="en-en">en-en (English)</option>
          <option value="de-de">de-de (German)</option>
          <option value="de-ch">de-ch (Swiss German)</option>
          <option value="es-es">es-es (Spanish)</option>
          <option value="fr-fr">fr-fr (French)</option>
          <option value="nl-nl">nl-nl (Dutch)</option>
        </select>
      <br />
      <h4>Admin Login</h4>
      <label for="UserName">Username:</label>
      <input name="UserName" /><br />
      <label for="Pass">Password:</label>
      <input type="password" name="Pass" /><br />
      <h4>Database Login</h4>
      <label for="DBHost">Hostname:</label>
      <input name="DBHost" /><br />
       <label for="DBName">Database Name:</label>
      <input name="DBName" /><br />
      <label for="DBUserName">Username:</label>
      <input name="DBUserName" /><br />
      <label for="DBPass">Password:</label>
      <input type="password" name="DBPass" /><br />
      <input type="submit" />
      </form>
  </body>
</html>
