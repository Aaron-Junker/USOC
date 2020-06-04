<?php
header ("Content-Type:text/xml");
include_once "configuration.php"
?>
<?xml version="1.0" encoding="UTF-8"?>

<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
   <url>

      <loc><?php echo $USOC["Domain"] ?></loc>

      <changefreq>weekly</changefreq>

   </url>
   <url>

      <loc><?php echo $USOC["Domain"] ?>login.php</loc>

      <changefreq>never</changefreq>

   </url>
<?php
$db_link = mysqli_connect (MYSQL_HOST,MYSQL_BENUTZER,MYSQL_KENNWORT,MYSQL_DATENBANK);
$sql = "SELECT * FROM Sites";
$db_erg = mysqli_query( $db_link, $sql );
while ($zeile = mysqli_fetch_array( $db_erg, MYSQLI_ASSOC))
{
  echo "<url><loc>".$USOC["Domain"]."/page.php?URL=".$zeile["Name"]."</loc><changefreq>weekly</changefreq></url>";
}
$sql = "SELECT * FROM Blog";
$db_erg = mysqli_query( $db_link, $sql );
while ($zeile = mysqli_fetch_array( $db_erg, MYSQLI_ASSOC))
{
  echo "<url><loc>".$USOC["Domain"]."/blog.php?URL=".$zeile["Name"]."</loc><changefreq>weekly</changefreq></url>";
}
?>
</urlset>
