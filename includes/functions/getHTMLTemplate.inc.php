<?php
  /**
  * File with function getHTMLTemplate()
  * @license https://standards.casegames.ch/cgs/0003/v1.txt Case Games Open-Source license
  */
  /**
  * This is a function for the class U.
  * This function return the HTML template $template from /includes/HTML/$template.html
  * @see U For more informations about U.
  * @version Pb2.5Bfx0
  * @since Pb2.5Bfx0
  * @param string $template name of the HTML template
  * @return string The code
  */
  function getHTMLTemplate(string $template):string{
    return file_get_contents(__DIR__."/../../includes/HTML/$template.html");
  }
?>
