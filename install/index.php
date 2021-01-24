<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>Install USOC</title>
  </head>
  <body>
    <input type="number" style="display:none" id="text" />
    <p>We're checking some things.</p>
    <p>Please wait!</p>
    <p>Found problems:</p><br />
    <?php
      print_r(ini_set("browscap", "full_asp_browscap.ini"));
      $succed = True;
      if(version_compare(PHP_VERSION, '7.4.0') < 0){
        $succed = False;
        echo "<p>Too low PHP Version! You need PHP 7.4 or higher</p>";
      }
      try{
        file_put_contents("../test.php", "");
      }catch(exception $e){
        $succed = False;
        echo "<p>We don't have the permission to write files in the parent dictionairy!</p>";
      }finally{
        unlink("../test.php");
      }
      try{
        file_put_contents("../admin/test.php", "");
      }catch(exception $e){
        $succed = False;
        echo "<p>We don't have the permission to write files in the admin dictionairy!</p>";
      }finally{
        unlink("../admin/test.php");
      }
      if(!function_exists("mysqli_connect")){
        $succed = False;
        echo "<p>Can't find MySQLi!</p>";
      }
      if(file_exists("../configuration.php")){
        $succed = False;
        echo "<p>Configuration.php already exists.</p>";
      }
      ?>
      <p id="HTML"></p>
      <script>
        <?php
          if($succed){
            echo "var succed = true;";
          }else{
            echo "var succed = false;";
          }
        ?>
      if(succed){
        var element = document.getElementById("text");
        var element2 = document.getElementById("HTML");
        if(element.type==="text"){
          element2.innerHTML = "Your browser isn't supported! You need HTML5";
          succed = false;
        }
      }
      if(succed){
        location.href="step1.php"
      }
    </script>
  </body>
</html>