<?php
    session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Install USOC</title>
    <link href="css.css" rel="stylesheet" />
</head>
<body>
    <?php
        if(isset($_POST["Field"])){
            $_SESSION["site.name"] = $_POST["Field"];
        }elseif(!isset($_SESSION["site.name"])){
            header("Location: step2.php");
        }
    ?>   
    <form action="step4.php" method="post" id="form">
        <label for="Field" id="p1">Admin password:</label>
        <input name="Field" id="p2" type="password" required value="<?php echo isset($_SESSION["password"]) ? $_SESSION["password"]:"";?>" />
    </form>
    <div id="p3">
        <button onClick="location.href = 'step2.php'">← Back</button>
        <input type="submit" form="form" style="top:55%;" value="Next step →" />
    </div>
</body>
</html>