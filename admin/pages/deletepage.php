<?php
    /**
    * This is a file that gets included by admin/index.php
    * Here you can delete pages
    * @see admin/index.php
    * @license https://standards.casegames.ch/cgs/0003/v1.txt Case Games Open-Source license
    */
?>
<!DOCTYPE html>
    <html lang="<?php echo $U->getSetting("site.lang"); ?>" dir="ltr">
    <head>
    <meta charset="utf-8">
    <title><?php echo $U->getLang("admin"); ?> - <?php echo $U->getLang("admin.delete"); ?></title>
    </head>
    <body>
    <a href="<?php echo $_SERVER['PHP_SELF']; ?>?URL=mainpage"><?php echo $U->getLang("admin.back"); ?></a><br />
        <?php
            if(isset($_GET["Type"])){
                // If the form got submitet and how or not
                if(isset($_GET["submit"])){
                    if(isset($_GET["SiteName"])){
                        if($U->deletePage($_GET["Type"], $_GET["SiteName"])){
                            echo str_replace("%a", $U->getLang("admin.site"), $U->getLang("admin.delete.success"));
                        }else{
                            // Checks if the error happend because the user tried to delete index
                            if($_GET["SiteName"]=="index" && $_GET["Type"] == "Sites"){
                                echo $U->getLang("errors.unable.delete");
                            }else{
                                echo $U->getLang("errors.unknown");
                            }
                        }
                    }else{
                        echo $U->getLang("admin.fillout");
                    }
                }else{
                    ?>
                    <form method="get" action="<?php echo $_SERVER['PHP_SELF']; ?>">
                        <h3><?php echo str_replace("%a", $U->contentHandlers[$_GET["Type"]]["DisplayName"], $U->getLang("admin.delete.select")); ?></h3>
                        <select name="SiteName">
                            <?php
                            $sql = "SELECT * FROM ".$U->contentHandlers[$_GET["Type"]]["Name"];
                            $db_erg = mysqli_query($U->db_link, $sql);
                            while ($row = mysqli_fetch_array($db_erg, MYSQLI_ASSOC))
                            {
                                echo "<option value='".$row["Name"]."'>".$row["Name"]."</option>";
                            }
                            ?>
                        </select>
                        <input type="hidden" name="URL" value="deletepage" />
                        <input type="hidden" name="Type" value="<?php echo $_GET["Type"]; ?>" />
                        <button type="submit" name="submit"><?php echo $U->getLang("admin.send.delete"); ?></button>
                    </form>
            <?php
                    }
                }else{
                    header("Location: ".$_SERVER["PHP_SELF"]);
                }
            ?>
    </body>
</html>