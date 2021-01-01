<?php
    /**
    * File with function getLang()
    * @license https://standards.casegames.ch/cgs/0003/v1.txt Case Games Open-Source license
    */
    /**
    * This is a function for the class U.
    * This function returns the code of the menu items in the database tabel "menu"
    * @see U For more informations about U.
    * @version Pb2.4Bfx0
    * @since Pb2.4Bfx0
    * @return string The code
    */
    function getMenuHTML():string{
        global $USOC;
        global $U;
        $HTML = "";
        $sql = "SELECT * FROM menu WHERE";
        $db_erg = mysqli_query($U->db_link, $sql);
        $meuitems = [];
        while($row = mysqli_fetch_array($db_erg, MYSQLI_ASSOC)){
            $menuitems[$row["Id"]]["Name"] = $row["Name"];
            $menuitems[$row["Id"]]["URL"] = $row["URL"];
            $menuitems[$row["Id"]]["Under"] = $row["Under"];
            
        }

    }
?>