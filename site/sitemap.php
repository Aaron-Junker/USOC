<?php
  /**
  * This file is a dynamic sitemap for search engines. 
  */
  header ("Content-Type:text/xml");
  include_once "configuration.php";
  /* If this don't get printed it gets a error */
  echo '<?xml version="1.0" encoding="UTF-8" ?>';
?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
   <url>
     <loc><?php echo $USOC["DOMAIN"] ?></loc>
     <changefreq>weekly</changefreq>
   </url>
   <url>
     <loc><?php echo $USOC["DOMAIN"] ?>/login.php</loc>
     <changefreq>never</changefreq>
   </url>
   <url>
     <loc><?php echo $USOC["DOMAIN"] ?>/register.php</loc>
     <changefreq>never</changefreq>
   </url>
  <?php
    /* Prints all sites out */
    $sql = "SELECT * FROM Sites";
    $db_erg = mysqli_query( $U->db_link, $sql );
    while ($row = mysqli_fetch_array( $db_erg, MYSQLI_ASSOC)){
      echo "<url><loc>".$USOC["DOMAIN"]."/".$row["Name"]."</loc><changefreq>weekly</changefreq></url>";
    }
    /* Prints all blogsites out */
    $sql = "SELECT * FROM Blog";
    $db_erg = mysqli_query( $U->db_link, $sql );
    while ($row = mysqli_fetch_array( $db_erg, MYSQLI_ASSOC)){
      echo "<url><loc>".$USOC["DOMAIN"]."/blog/".$row["Name"]."</loc><changefreq>weekly</changefreq></url>";
    }
  ?>
</urlset>
