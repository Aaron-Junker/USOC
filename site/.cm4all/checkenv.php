<?PHP

    // include configuration
    require_once(dirname(__FILE__).DIRECTORY_SEPARATOR."include/config.php");

// Check for minimum required PHP extensions
if (!extension_loaded('gd')) {
    header('HTTP/1.1 500 Internal Server Error');
    $missing_so = array(gd);
}

if (!extension_loaded('curl')) {
    header('HTTP/1.1 500 Internal Server Error');
    $missing_so[] = curl;
}

// DEBUG with some unusual extension
/*if (!extension_loaded('testext')) {
  header('HTTP/1.1 500 Internal Server Error');
  $missing_so[] = testext;
}*/


// check for optional ffmpeg extension
if (!extension_loaded('ffmpeg')) {
    $missing_so_opt = array(ffmpeg);
}


$cache_dir_rw = true;
$cache_dirs_not_writeable = array();
checkDir(".cache");

// check if .cache dir is writable for php
if (!$cache_dir_rw) {
    header('HTTP/1.1 500 Internal Server Error');
}

function new_file($dir, $file) {
    $f = preg_replace("/\/$/", "", preg_replace("/\/$/", "", $dir) . "/" . preg_replace("/^\//", "", $file));
    if (preg_match("/(^|\\/)\\.\\.\\//", $f)) {
        header("HTTP/1.1 400 Bad Request");
        echo "invalid path $f\n";
        exit;
    }
    return $f;
}

function checkDir($dir) {
    global $cache_dir_rw;

    if (is_dir($dir)) {
        $cache_dir_rw = testWrite($dir) && $cache_dir_rw;

        if ($dh = opendir($dir)) {
            while (($file = readdir($dh)) !== false) {
                if ($file == "." || $file == "..") {
                    continue;
                }

                $file = new_file($dir, $file);

                if (is_dir($file)) {
                    checkDir($file);
                }
            }
        }
    }
}

function testWrite($dir) {
    global $cache_dirs_not_writeable;
    // check if .cache dir is writable for php
    if (!mkdir($dir . "/testwrite", 0755, true)) {
        array_push($cache_dirs_not_writeable, $dir);
        return false;
    } else {
        rmdir($dir . "/testwrite");
    }

    return true;
}

function _getBytes($mValue) {
    if (!$mValue) {
        $mValue = "666M";
    }

    $mValue = trim($mValue);
    if (is_numeric($mValue)) {
        $iValue = $mValue;
    } else {
        $sUnit  = strtolower(substr($mValue, -1));
        $iValue = (int) substr($mValue, 0, -1);
        switch ($sUnit) {
            case 'k':
            $iValue *= 1024;
            case 'm':
            $iValue *= 1024;
            case 'g':
            $iValue *= 1024;
        }
    }
    return $iValue;
}



// function definition for hstbe checking
function isHstbeAvailible($domain)
{
    //initialize curl
    $curlInit = curl_init($domain);
    curl_setopt($curlInit,CURLOPT_CONNECTTIMEOUT,10);
    curl_setopt($curlInit,CURLOPT_HEADER,true);
    curl_setopt($curlInit,CURLOPT_NOBODY,true);
    curl_setopt($curlInit,CURLOPT_RETURNTRANSFER,true);

    //get answer
    $response = curl_exec($curlInit);

    curl_close($curlInit);

    if ($response) return true;

    return false;
}

// check if Sites Backend is accessible
if (isset($config["backend-server"]) and extension_loaded('curl')) {
    if (isHstbeAvailible($config["backend-server"]))
    {
        $ret_hstbe_stat = "INFO: Sites Backend Server: Up and running!\n";
    }
    else
    {
        header('HTTP/1.1 500 Internal Server Error');
        $ret_hstbe_stat = "ERROR: Woops, nothing found there. Check Sites Backend Server domain/access\n";
    }
}

// CIDR check function
function ipCIDRCheck ($IP, $CIDR) {
    list ($net, $mask) = explode ("/", $CIDR);
    $ip_net = ip2long ($net);
    $ip_mask = ~((1 << (32 - $mask)) - 1);

    $ip_ip = ip2long ($IP);

    $ip_ip_net = $ip_ip & $ip_mask;

    return ($ip_ip_net == $ip_net);
}

// get and check remote IP
$remote_ip=$_SERVER['REMOTE_ADDR'];

if ( ipCIDRCheck ("$remote_ip", "91.199.241.0/24") ) {
    $verbose=true;
}
else if ( ipCIDRCheck ("$remote_ip", "172.30.0.0/16") ) {
    $verbose=true;
}


// print stuff if in verbose mode
if (isset($verbose)) {
    header("Content-type: text/plain");
    // print Hosting Backend Server
    print "INFO: Sites Backend Server: " . $config["backend-server"] . "\n";

    // print Hosting Backend Server status
    print $ret_hstbe_stat;

    // Print PHP version
    print "INFO: PHP version: " . phpversion() . "\n";

    // Print System OS
    print "INFO: System: " . $_SERVER['SERVER_SOFTWARE'] . "\n";

    // not writable cache dir
    if (!$cache_dir_rw) {
        print "ERROR: the following directory/directories in '.cm4all/.cache' is/are not writeable:\n  ";
        print join("\n  ", $cache_dirs_not_writeable);
        print "\n";
    }

    // Print missing extension(s), if any
    if (isset($missing_so)) {
        echo "ERROR: Missing PHP extension(s): ";
        foreach ($missing_so as $value) {
            echo $value." ";
        }
        echo "\n";
    }

    // print missing optional extension(s), if any
    if (isset($missing_so_opt)) {
        echo "INFO: Missing optional PHP extension(s): ";
        foreach ($missing_so_opt as $value) {
            echo $value." ";
        }
        echo "\n";
    }

    echo "INFO: Calculated available memory (bytes): ";
    if(function_exists('ini_get_all')){
        $iniData = ini_get_all();
        $memoryLimit = min(_getBytes($iniData["memory_limit"]["local_value"]), _getBytes($iniData["memory_limit"]["global_value"]));
    }else{
        $memoryLimit = _getBytes(ini_get("memory_limit"));
    }
    echo "$memoryLimit (Limit for image is: width * heigth * 4 + 1024)\n";


    // Print all loaded extensions
    echo "INFO: Loaded PHP extension(s):\n";
    foreach(get_loaded_extensions() as $value) {
        echo "  ".$value."\n";
    }
    echo "\n";
}


// EOF