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
        if(isset($_POST["Field"])){
            $_SESSION["site.robots"] = $_POST["Field"];
        }elseif(!isset($_SESSION["site.robots"])){
            header("Location: step6.php");
        }
    ?>   
    <form action="step8.php" method="post" id="form">
        <label for="Field" id="p1" style="top:35%">Language:</label>
        <p>Some languages aren't fully supported</p>
        <select id="p2" name="Field" type="text" required value="<?php echo isset($_SESSION["site.lang"]) ? $_SESSION["site.lang"]:"";?>">
            <option value="de-ch">de-ch</option>
            <option value="de-de">de-de</option>
            <option value="en-en">en-en</option>
            <option value="es-es">es-es</option>
            <option value="fr-fr">fr-fr</option>
            <option value="nl-nl">nl-nl</option>
        </select>
    </form>
    <div id="p3">
        <button onClick="location.href = 'step6.php'">← Back</button>
        <input type="submit" form="form" style="top:55%;" value="Next step →" />
    </div>
</body>
</html>