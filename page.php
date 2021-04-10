<?php
  /** 
  * This file includes pages, error pages, blog overview page and blogpages.
  * This is the fallback page if the page don't exists.
  * @license https://standards.casegames.ch/cgs/0003/v1.txt Case Games Open-Source license
  */
  session_start();
  include_once "configuration.php";
  include_once "includes/class.inc.php";
  newClass();
  if($U->userHasPermission("Pages")){
    $raw = False;
    $amp = False;
    $_SERVER["REQUEST_URI"] = parse_url($_SERVER["REQUEST_URI"])["path"];
    if(str_starts_with($_SERVER["REQUEST_URI"], "/raw/")){
      $raw = True;
      $_SERVER["REQUEST_URI"] = str_replace("/raw", "", $_SERVER["REQUEST_URI"]); 
    }else{
      if(str_starts_with($_SERVER["REQUEST_URI"], "/amp/")){
        $amp = True;
        $_SERVER["REQUEST_URI"] = str_replace("/amp", "", $_SERVER["REQUEST_URI"]); 
      }
?>
    <!DOCTYPE html>
    <html <?php if($amp){echo "amp ";}?>lang="<?php echo $U->getSetting("site.lang"); ?>" dir="ltr">
      <head>
          <?php
            if($amp){
              include_once "includes/amp/head.php";
            }else{
              include_once "siteelements/head.php";
            }
            if(!isset($_COOKIE["Check"])){
          ?>
          <script>
            /*! modernizr 3.6.0 (Custom Build) | MIT * https://modernizr.com/download/?-eventlistener-inputtypes-json-search-video-setclasses !*/
            !function(e,t,n){function a(e,t){return typeof e===t}function o(){var e,t,n,o,i,s,c;for(var p in l)if(l.hasOwnProperty(p)){if(e=[],t=l[p],t.name&&(e.push(t.name.toLowerCase()),t.options&&t.options.aliases&&t.options.aliases.length))for(n=0;n<t.options.aliases.length;n++)e.push(t.options.aliases[n].toLowerCase());for(o=a(t.fn,"function")?t.fn():t.fn,i=0;i<e.length;i++)s=e[i],c=s.split("."),1===c.length?Modernizr[c[0]]=o:(!Modernizr[c[0]]||Modernizr[c[0]]instanceof Boolean||(Modernizr[c[0]]=new Boolean(Modernizr[c[0]])),Modernizr[c[0]][c[1]]=o),r.push((o?"":"no-")+c.join("-"))}}function i(e){var t=p.className,n=Modernizr._config.classPrefix||"";if(u&&(t=t.baseVal),Modernizr._config.enableJSClass){var a=new RegExp("(^|\\s)"+n+"no-js(\\s|$)");t=t.replace(a,"$1"+n+"js$2")}Modernizr._config.enableClasses&&(t+=" "+n+e.join(" "+n),u?p.className.baseVal=t:p.className=t)}function s(){return"function"!=typeof t.createElement?t.createElement(arguments[0]):u?t.createElementNS.call(t,"http://www.w3.org/2000/svg",arguments[0]):t.createElement.apply(t,arguments)}var r=[],l=[],c={_version:"3.6.0",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,t){var n=this;setTimeout(function(){t(n[e])},0)},addTest:function(e,t,n){l.push({name:e,fn:t,options:n})},addAsyncTest:function(e){l.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=c,Modernizr=new Modernizr,Modernizr.addTest("eventlistener","addEventListener"in e),Modernizr.addTest("json","JSON"in e&&"parse"in JSON&&"stringify"in JSON);var p=t.documentElement,u="svg"===p.nodeName.toLowerCase();Modernizr.addTest("video",function(){var e=s("video"),t=!1;try{t=!!e.canPlayType,t&&(t=new Boolean(t),t.ogg=e.canPlayType('video/ogg; codecs="theora"').replace(/^no$/,""),t.h264=e.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/,""),t.webm=e.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/,""),t.vp9=e.canPlayType('video/webm; codecs="vp9"').replace(/^no$/,""),t.hls=e.canPlayType('application/x-mpegURL; codecs="avc1.42E01E"').replace(/^no$/,""))}catch(n){}return t});var d=s("input"),f="search tel url email datetime date month week time datetime-local number range color".split(" "),v={};Modernizr.inputtypes=function(e){for(var a,o,i,s=e.length,r="1)",l=0;s>l;l++)d.setAttribute("type",a=e[l]),i="text"!==d.type&&"style"in d,i&&(d.value=r,d.style.cssText="position:absolute;visibility:hidden;",/^range$/.test(a)&&d.style.WebkitAppearance!==n?(p.appendChild(d),o=t.defaultView,i=o.getComputedStyle&&"textfield"!==o.getComputedStyle(d,null).WebkitAppearance&&0!==d.offsetHeight,p.removeChild(d)):/^(search|tel)$/.test(a)||(i=/^(url|email)$/.test(a)?d.checkValidity&&d.checkValidity()===!1:d.value!=r)),v[e[l]]=!!i;return v}(f);var m=function(){function e(e,t){var o;return e?(t&&"string"!=typeof t||(t=s(t||"div")),e="on"+e,o=e in t,!o&&a&&(t.setAttribute||(t=s("div")),t.setAttribute(e,""),o="function"==typeof t[e],t[e]!==n&&(t[e]=n),t.removeAttribute(e)),o):!1}var a=!("onblur"in t.documentElement);return e}();c.hasEvent=m,Modernizr.addTest("inputsearchevent",m("search")),o(),i(r),delete c.addTest,delete c.addAsyncTest;for(var y=0;y<Modernizr._q.length;y++)Modernizr._q[y]();e.Modernizr=Modernizr}(window,document);
              if(!(Modernizr.inputtypes&&Modernizr.eventlistener&&Modernizr.json&&Modernizr.video)){
                window.alert("<?php echo $U->getLang("errors.notSupported");?>");
                window.location = "https://html5test.com/results/desktop.html";
              }else{
                document.cookie = "Check=1; expires=Thu, 18 Dec 2026 12:00:00 UTC";
              }
          </script>
          <?php
            }
          ?>
      </head>
      <body>
        <?php
          include_once "siteelements/header.php";
        ?>
        <article>
          <?php
            }
            $sitehere = False;
            if(isset($_GET["URL"])){
              // Fallback for old URL'S with `URL` parameter {
              if(str_starts_with($_GET["URL"], '/blog/')){
                // If it is a blog page {
                $sql = "SELECT * FROM Blog";
                $dbRes = mysqli_query($U->db_link, $sql);
                while ($row = mysqli_fetch_array($dbRes, MYSQLI_ASSOC)){
                  if($row["Name"] == $_GET["URL"]){
                    $sitehere = True;
                    if($row["Online"] == 1){
                      $site = htmlspecialchars_decode($row["Code"]);
                    }else{
                      $site = $U->getLang("error.offline");
                    }
                  }
                }
                // }
              }else{
                // If it's a normal page {
                $sql = "SELECT * FROM Sites";
                $dbRes = mysqli_query($U->db_link, $sql);
                while ($row = mysqli_fetch_array($dbRes, MYSQLI_ASSOC)){
                  if($row["Name"] == $_GET["URL"]){
                    $sitehere = True;
                    if($row["Online"] == 1){
                      $site = htmlspecialchars_decode($row["Code"]);
                    }else{
                      $site = $U->getLang("error.offline");
                    }
                  }
                }
                // }
              }
              // }
            }elseif(strtolower($_SERVER["REQUEST_URI"]) == "/index.php" || strtolower($_SERVER["REQUEST_URI"]) == "/index.html"|| strtolower($_SERVER["REQUEST_URI"]) == "/"){
              // Fallback for index pages
              $sql = "SELECT * FROM Sites WHERE Name='index'";
              $dbRes = mysqli_query($U->db_link, $sql);
              while ($row = mysqli_fetch_array($dbRes, MYSQLI_ASSOC)){
                $site = htmlspecialchars_decode($row["Code"]);
                $sitehere = True;
              }
            }elseif(str_starts_with(strtolower($_SERVER["REQUEST_URI"]),"/error")){
              // Fallback for error pages {
              if(isset($_GET["E"])){
                if(!($_GET["E"] == "400" || $_GET["E"] == "403" || $_GET["E"] == "404" || $_GET["E"] == "405" || $_GET["E"] == "410" || $_GET["E"] == "414" || $_GET["E"] == "418" || $_GET["E"] == "423")){
                  $site = "<p>".$U->getLang("errors.unknown")."</p>";
                }else{
                  $site = $U->getErrorSite($_GET["E"]);
                }
              }else{
                $site = "<p>".$U->getLang("errors.unknown")."</p>";
              }
              $sitehere = True;
              // }
            }elseif(strtolower($_SERVER["REQUEST_URI"]) == "/blogsite" || strtolower($_SERVER["REQUEST_URI"]) == "/blogsite.php"){
              // If the URL is "/blogsite" or "/blogsite.php" a overview of all blog pages appear {
              $site = "<h1>".$U->getLang("blog.overwiew")."</h1>";
              $sql = "SELECT * FROM Blog ORDER BY ID DESC;";
              $dbRes = mysqli_query($U->db_link, $sql);
              /**
              * This variable is for counting the amount of blogarticles
              * @var int
              */
              $blogarticles = 0;
              while ($row = mysqli_fetch_array($dbRes, MYSQLI_ASSOC)){
                if($row["Online"]==1){
                  $site .= "<h2 style='color:black;border-top: 1px;border-top-style:solid;border-top-color:black;'><a style='color:black;' href='/blog/".$row["Name"]."'>".$row["Name"]."</a></h2>";
                  $site .= substr($row["Code"],0,100)."...";
                  $site .= "<br /><br /><a href='/blog/".$row["Name"]."'><button class='readmore'>".$U->getLang("blog.readmore")."</button></a>";
                  $blogarticles += 1;
                }
              }
              // Fallback if no blogarticles are saved {
              if($blogarticles == 0){
                $site .= "<p><b>".$U->getLang("blog.no_saved")."</b></p>";
              }
              $sitehere = True;
              // }
              // }
            }else{
              $URL = strtolower($_SERVER["REQUEST_URI"]);
              foreach($U->contentHandlers as $mainkey => $mainvalue){
                foreach($mainvalue as $key => $value){
                  if($key == "URL" && preg_split("/[^\/]+$/", $URL)[0] == $value){
                    $URL = str_replace($value, "", $URL);
                    $contenttype = $mainkey;
                  }
                }
              }
              if(isset($contenttype)){
                $sql = "SELECT * FROM ".$U->contentHandlers[$contenttype]["Name"];
                $dbRes = mysqli_query($U->db_link, $sql);
                while($row = mysqli_fetch_array($dbRes, MYSQLI_ASSOC)){
                  if($row["Name"] == $URL){
                    $sitehere = True;
                    // Checks if the content page is online {
                    if($row["Online"] == 1){
                      if(!isset($U->contentHandlers[$contenttype]["HTML"]) || $U->contentHandlers[$contenttype]["HTML"] == True){
                        $site = htmlspecialchars_decode($U->contentHandlers[$contenttype]["ShowHandler"]($row["Code"], ["Name" => $row["Name"], "Code" => $row["Code"], "Author" => $row["Author"], "Date" => $row["Date"], "Online" => $row["Online"], "Id" => $row["ID"]]));
                      }else{
                        $site = $U->contentHandlers[$contenttype]["ShowHandler"]($row["Code"], ["Name" => $row["Name"], "Code" => $row["Code"], "Author" => $row["Author"], "Date" => $row["Date"], "Online" => $row["Online"], "Id" => $row["ID"]]);
                      }
                    }else{
                      $site = $U->getLang("error.offline");
                    }
                    // }
                  }
                }
              }else{
                $sitehere = False;
              }
            }
            if($sitehere){
              // If the page is here it get's outputed {
              if($amp){
                $site = str_replace("%img src=", "<amp-iframe onload='javascript:(function(o){o.style.height=o.contentWindow.document.body.scrollHeight+\"px\";}(this));' style=\"height:200px;width:100%;border:none;overflow:hidden;\" src=\"", $site);
                $site = str_replace(" img%", "\" ></amp-iframe>", $site);
                $site = str_replace("%\img src=", "%img src=", $site);
                $site = str_replace(" img\%", 'img%', $site);
                $site = str_replace('%\\img src=', '\%img src=', $site);
                $site = str_replace(' img\\%', 'img\%', $site);
              }else{
                $site = str_replace("%img src=", "<iframe onload='javascript:(function(o){o.style.height=o.contentWindow.document.body.scrollHeight+\"px\";}(this));' style=\"height:200px;width:100%;border:none;overflow:hidden;\" src=\"", $site);
                $site = str_replace(" img%", "\" ></iframe>", $site);
                $site = str_replace("%\img src=", "%img src=", $site);
                $site = str_replace(" img\%", 'img%', $site);
                $site = str_replace('%\\img src=', '\%img src=', $site);
                $site = str_replace(' img\\%', 'img\%', $site);
              }
              echo $site;
              // }
            }else{
              // If no content page is found it throws an HTTP 404 error {
              header("HTTP/1.1 404 Not found");
              header('Location: '.$USOC["DOMAIN"].'/error?E=404');
              // }
            }
            if(!$raw && !$amp){
          ?>
        </article>
        <?php
          include_once "siteelements/footer.php"
        ?>
      </body>
    </html> 
<?php 
    }
  }else{
?>
    <!DOCTYPE html>
    <html lang="<?php echo $U->getSetting("site.lang"); ?>" dir="ltr">
      <head>
        <?php
          include_once "siteelements/head.php"
        ?>
      </head>
      <body>
        <?php
          include_once "siteelements/header.php"
        ?>
        <article>
          <p><?php echo $U->getLang("rights.error"); ?></p>
        </article>
        <?php
          include_once "siteelements/footer.php";
        ?>
      </body>
    </html>
<?php
  }
?>