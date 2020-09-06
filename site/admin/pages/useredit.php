<!DOCTYPE html>
<html lang="de" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>Adminbereich - Benutzer editieren</title>
  </head>
  <body>
    <a href="<?php echo $_SERVER['PHP_SELF']; ?>?URL=mainpage">Zurück</a>
    <?php
      if(isset($_POST["N"])&& !isset($_POST["Submit"])){
        $text = <<<'HEREDOC'
        <form action="$_SERVER["PHP_SELF"]?URL=useredit" method="post">
          <label for="A">Admin?</label><input name="A" type="checkbox" />
          <label for="G">Gesperrt?</label><input name="G" type="checkbox" />
          <input type="submit" name="Submit"/>
        HEREDOC;
        $text = $text."<input type='hidden' name='N' value='".$_POST["N"]."' /></form>";
        echo str_replace('$_SERVER["PHP_SELF"]',$_SERVER['PHP_SELF'],$text);
      }elseif(isset($_POST["Submit"])){
        if(isset($_POST["A"])){
          $admin = 1;
        }else{
          $admin = 0;
        }
        if(isset($_POST["G"])){
          $b = 1;
        }else{
          $b = 0;
        }
        $db_link = mysqli_connect(MYSQL_HOST,MYSQL_BENUTZER,MYSQL_KENNWORT,MYSQL_DATENBANK);
        $sql = "UPDATE User SET Type='".$admin."', blocked ='".$b."' WHERE Id='".$_POST["N"]."';";
        $db_erg = mysqli_query( $db_link, $sql );
      }else{
        $text = <<<'HEREDOC'
        <form action="$_SERVER["PHP_SELF"]?URL=useredit" method="post">
          <label for="N">ID:</label><input name="N" type="number" />
          <input type="submit" />
        </form>
        HEREDOC;
        echo str_replace('$_SERVER["PHP_SELF"]',$_SERVER['PHP_SELF'],$text);
      }
    ?>
  </body>
</html>
