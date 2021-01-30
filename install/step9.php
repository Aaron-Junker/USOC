<?php
    session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Install USOC</title>
    <link href="css.css" rel="stylesheet" />
</head>
<body>
    <?php
        $succed = False;
        if(isset($_POST["db_name"],$_POST["db_username"],$_POST["db_password"],$_POST["db_db"])){
            $_SESSION["db.name"] = $_POST["db_name"];
            $_SESSION["db.username"] = $_POST["db_username"];
            $_SESSION["db.password"] = $_POST["db_password"]==""?$_POST["db_password"]:null;
            $_SESSION["db.db"] = $_POST["db_db"];
        }elseif(!isset($_SESSION["db.name"])){
            header("Location: step8.php");
        }
    ?>   
    <form action="step99.php" method="post" id="form">
        <?php
            $db_link = @mysqli_connect($_SESSION["db.name"], $_SESSION["db.username"], $_SESSION["db.password"], $_SESSION["db.db"]);
            if(!$db_link){
                echo "<p id=\"p1\">Failed to connect</p>";
                echo "<p id=\"p2\">".mysqli_connect_error()."</p>";
            }else{
                if(!mysqli_query($db_link, "CREATE TABLE test (id INT(6))")){
                    echo "<p id=\"p1\">Failed to connect</p>";
                    echo "<p id=\"p2\">User has not the right permission</p>";
                    mysqli_query($db_link, "DROP TABLE test");
                }else{
                    $succed = True;
                    mysqli_query($db_link, "DROP TABKE test IF EXISTS");
                }
            }
            if($succed){
                echo "<p id=\"p1\">Connection is standing!</p>";
                echo "<p id=\"p2\">You can proceed</p>";
            }
        ?>
    </form>
    <div id="p3">
        <button onClick="location.href = 'step8.php'">← Back</button>
        <?php
            if($succed){
        ?>
                <input type="submit" form="form" style="top:55%;" value="Next step →" />
        <?php
            }
        ?>
    </div>
</body>
</html>