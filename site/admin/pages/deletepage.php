<!DOCTYPE html>
        <html lang="<?php echo $U->getSetting("site.lang"); ?>" dir="ltr">
        <head>
        <meta charset="utf-8">
        <title><?php echo $U->getLang("admin"); ?> - <?php echo $U->getLang("admin.delete"); ?></title>
        </head>
        <body>
        <a href="<?php echo $_SERVER['PHP_SELF']; ?>?URL=mainpage"><?php echo $U->getLang("admin.back"); ?></a><br />
            <?php
                /**
                * This is a file that gets included by admin/index.php
                * Here you can delete pages
                * @see admin/index.php
                * @license https://standards.casegames.ch/cgs/0003/v1.txt Case Games Open-Source license
                */
                // If the form got submitet and how or not
                if(isset($_POST["site_submit"])){
                    if(isset($_POST["SiteName"])){
                        if($U->deletePage("Sites", $_POST["SiteName"])){
                            echo str_replace("%a", $U->getLang("admin.site"), $U->getLang("admin.delete.success"));
                        }else{
                            // Checks if the error happend because the user tried to delete index
                            if($_POST["SiteName"]=="index"){
                                echo $U->getLang("errors.unable.delete");
                            }else{
                                echo $U->getLang("errors.unknown");
                            }
                        }
                    }else{
                        echo $U->getLang("admin.fillout");
                    }
                }elseif(isset($_POST["blog_submit"])){
                    if(isset($_POST["BlogName"])){
                        if($U->deletePage("Blog", $_POST["BlogName"])){
                            echo str_replace("%a", $U->getLang("admin.blog"), $U->getLang("admin.delete.success"));
                        }else{
                            echo $U->getLang("errors.unknown");
                        }
                    }else{
                        echo $U->getLang("admin.fillout");
                    }
                }else{
                    ?>
                    <form method="post" action="<?php echo $_SERVER['PHP_SELF']; ?>?URL=deletepage">
                        <h3><?php echo str_replace("%a", $U->getLang("admin.site"), $U->getLang("admin.delete.select")); ?></h3>
                        <select name="SiteName">
                            <?php
                            $sql = "SELECT * FROM Sites";
                            $db_erg = mysqli_query($U->db_link, $sql);
                            while ($zeile = mysqli_fetch_array( $db_erg, MYSQLI_ASSOC))
                            {
                                echo "<option value='".$zeile["Name"]."'>".$zeile["Name"]."</option>";
                            }
                            ?>
                        </select>
                        <button type="submit" name="site_submit"><?php echo $U->getLang("admin.send.delete"); ?></button>
                        <h3><?php echo str_replace("%a", $U->getLang("admin.blog"), $U->getLang("admin.delete.select")); ?></h3>
                        <select name="BlogName">
                            <?php
                            $sql = "SELECT * FROM Blog";
                            $db_erg = mysqli_query($U->db_link, $sql);
                            while ($zeile = mysqli_fetch_array( $db_erg, MYSQLI_ASSOC))
                            {
                                echo "<option value='".$zeile["Name"]."'>".$zeile["Name"]."</option>";
                            }
                            ?>
                        </select>
                        <button type="submit" name="blog_submit"><?php echo $U->getLang("admin.send.delete"); ?></button>
                    </form>
            <?php
                }
            ?>
    </body>
</html>