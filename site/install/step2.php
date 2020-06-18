<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>Install USOC</title>
  </head>
  <body>
    <h1>Installing...</h1>
    <?php
      if(isset($_POST["Name"],$_POST["Author"],$_POST["Lang"],$_POST["UserName"],$_POST["Pass"],$_POST["DBHost"],$_POST["DBName"],$_POST["DBUserName"],$_POST["DBPass"])){
        try{
          $db_link = mysqli_connect ($_POST["DBHost"],$_POST["DBUserName"],$_POST["Pass"],$_POST["DBName"]);
        }catch (Exception $e){
          echo "Can't connect to Database.";
          exit("Error!");
        }
        $salt = substr(str_shuffle(str_repeat(implode('', range('!','z')), $length)), 0, 25);
        $pass = password_hash($_POST["Pass"],PASSWORD_DEFAULT,["salt"=>$salt]);
        $Name = $_POST["Name"];
        $Author = $_POST["Author"];
        $lang = $_POST["Lang"];
        $UserName = $_POST["UserName"];
        $sql= <<<HEREDOC
        CREATE TABLE `Settings` (
          `Id` int(20) NOT NULL,  
          `Name` varchar(99) NOT NULL,
          `Value` varchar(99) NOT NULL,
          `Type` varchar(4) NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        INSERT INTO `Settings` (`Id`, `Name`, `Value`, `Type`) VALUES
        (1, 'login.register_open', '0', 'Bool'),
        (2, 'login.login_open', '1', 'Bool'),
        (3, 'test.int', '12', 'Int'),
        (4, 'test.string', 'Hi ', 'Text'),
        (5, 'login.changepassword', '1', 'Bool'),
        (6, 'site.name', '$Name', 'Text'),
        (7, 'site.author', '$Author', 'Text'),
        (8, 'site.description', '', 'Text'),
        (9, 'site.keywords', '', 'Text'),
        (10, 'site.lang', '$lang', 'Text'),
        (11, 'site.robots', 'index, follow', 'Text'),
        (12, '2fa.name', '', 'Text'),
        (13, 'login.salt', '$salt', 'Text');

        ALTER TABLE `Settings`
          ADD PRIMARY KEY (`Id`);

        ALTER TABLE `Settings`
          MODIFY `Id` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
        COMMIT;
        HEREDOC;
        mysqli_multi_query($db_link,$sql);
        $sql = <<<HEREDOC
        CREATE TABLE `User` (
          `Id` int(11) NOT NULL,
          `Username` varchar(20) NOT NULL,
          `Mail` varchar(99) NOT NULL,
          `Password` varchar(70) NOT NULL,
          `Type` int(1) NOT NULL,
          `Change_password` tinyint(1) NOT NULL,
          `google_token` text NOT NULL,
          `google_2fa` mediumtext NOT NULL,
          `blocked` tinyint(1) NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        INSERT INTO `Settings` VALUES
          (0, $UserName, "webmaster@localhost", $pass, 1, 0, "","",0);

        ALTER TABLE `User`
          ADD PRIMARY KEY (`Id`),
          ADD KEY `Id` (`Id`);

        ALTER TABLE `User`
          MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
        COMMIT;
        HEREDOC;
        mysqli_multi_query($db_link,$sql);
        $sql = <<<HEREDOC
        CREATE TABLE Sites (
          ID int(11) NOT NULL,
          Name varchar(33) NOT NULL,
          Date date NOT NULL,
          Author int(11) NOT NULL,
          Code longtext NOT NULL,
          Online tinyint(1) NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        INSERT INTO Sites (ID, `Name`, `Date`, Author, `Code`, Online) VALUES
          (0, "index","11-06-2020",0,"<p>Edit this Page on /admin</p>",1);
        ALTER TABLE Sites
          ADD PRIMARY KEY (ID);

        ALTER TABLE Sites
          MODIFY ID int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
        COMMIT;
        HEREDOC;
        mysqli_multi_query($db_link,$sql);
        $sql = <<<HEREDOC
        CREATE TABLE Blog (
          ID int(11) NOT NULL,
          Name varchar(33) NOT NULL,
          Date date NOT NULL,
          Author int(11) NOT NULL,
          Code longtext NOT NULL,
          Online tinyint(1) NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        INSERT INTO Sites (ID, `Name`, `Date`, Author, `Code`, Online) VALUES
        (0, "First Blog","11-06-2020",0,"<p>Welcome to the Blog</p>",1);
        ALTER TABLE Sites
          ADD PRIMARY KEY (ID);

        ALTER TABLE Sites
          MODIFY ID int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
        COMMIT;
        HEREDOC;
        
        mysqli_multi_query($db_link,$sql);
        //File configuration.php creation
        $file = <<<'HEREDOC'
        <?php
          error_reporting(E_ALL);
          //MYSQL CREDITALS
          define ( 'MYSQL_HOST',      'k1' );
          define ( 'MYSQL_USER',  'k2' );
          define ( 'MYSQL_PASSWORD',  'k3' );
          define ( 'MYSQL_DATABASE', 'k4' );
          //define
          $USOC["SITE_PATH"] = "k5";
          $USOC["ADMIN_PATH"] = "k6";
          $USOC["DOMAIN"] = "k7";
        ?>
        HEREDOC;
        $replace_here = array("k1,"k2","k3","k4","k5","k6","k7");
        $replace_to = array($_POST["DBHost"],$_POST["DBUserName"],$_POST["DBPass"],$_POST["DBName"],str_replace("/install","",getcwd()),str_replace("/install","",getcwd())."/admin",$_SERVER['SERVER_NAME']);
        $file = str_replace($replace_here,$replace_to,$file);
        echo "<p>Replace the Text in configuration.php in the root dictonary and the admin dictonary with the following text:</p>";
        echo "<textarea readonly>".$file."</textarea>"
      ?>

      }else{
        echo "Please fill out all fields.";
        exit("Error!");
      }
    ?>
  </body>
</html>
