<?php
/**
* File with function getSetting()
* @license https://standards.casegames.ch/cgs/0003/v1.txt Case Games Open-Source license
*/
/**
 * This is a function for the class U.
 * This function gets a value from the "settings" database.
 * @param string $name The name of the setting. (For example: login.name)
 * @return string The value from the database.
 * @throws Exception
 * @version Pb2.0Bfx0RCA
 * @since Pb2.0Bfx0RCA
 */
namespace USOC;
use USOC\Database\Database;
include_once IP.'/includes/Database.inc.php';
include_once IP.'/configuration.php';

function getSetting(string $name): string
{
  $sql = "SELECT * FROM Settings WHERE Name='".$name."'";
  $dbRes = Database::query($sql);
  $row = Database::getRows($dbRes);
  if(!isset($row['Value'])) {
    throw new Exception("The setting ".$name." does not exist.");
  }
  return $row['Value'];
}
