<?php

require_once "alias.map.php";

function headerHashmapToArray($inh) {
    $result = array();
    foreach ($inh as $key => $value) {
        array_push($result, $key.": ".$inh[$key]);
    }
    return $result;
}

class BengProxyHandler {
    var $ignore_headers = array('transfer-encoding');
    var $headers;

    function __construct($browserRequest, $requestUri = false) {
        global $config, $aliasData;

        $this->_isInitialized = FALSE;
        $this->requestUri = ($requestUri ? $requestUri : $browserRequest->requestUri());
        $this->curlHandle = curl_init();

        $host = (isset($aliasData) ?
                 (isset($config["backend-server"]) ? $config["backend-server"] : "cm4all-backend.local") :
                 (isset($config["hosting-backend-server"]) ? $config["hosting-backend-server"] : "cm4all-hosting-backend.local"));

        $reqUri = $this->createBackendUri($host);

        $method = $browserRequest->method();
        $inh = $browserRequest->headers();
        $inh['host'] = $inh["x-cm4all-lookup-host"];

        // handled by createBackendUri, e.g. redirects
        if ($reqUri === TRUE) {
            return;
        } else if ($reqUri === FALSE) {
            // not handled by createBackendUri
            $reqUri = "http://" . $host . $this->requestUri;
        }

        $curlConnectTimeout = isset($config["curlconnecttimeout"]) ? $config["curlconnecttimeout"] : 3;
        $curlTimeout = isset($config["curltimeout"]) ? $config["curltimeout"] : 30;

        curl_setopt($this->curlHandle, CURLOPT_URL, $reqUri);

        if ($method == 'POST') {
            curl_setopt($this->curlHandle, CURLOPT_POST, true);
            if (strstr(@$_SERVER['CONTENT_TYPE'], 'multipart/form-data;')) {
                unset($inh['content-type']);
                unset($inh['content-length']);
                $payload = array();

                foreach($_POST as $key => $value) {
                    $this->addvalue($payload, $key, $value);
                }

                foreach($_FILES as $key => $file_info) {
                    $tmp_name = $file_info['tmp_name'];
                    $type = $file_info['type'];
                    $name = $file_info['name'];

                    if (is_array($tmp_name)) {
                        foreach(array_keys($tmp_name) as $pos) {
                            $payload[$key . '[' . $pos . ']'] = $this->upload($tmp_name[$pos], $type[$pos], $name[$pos]);
                        }
                    } else {
                        $payload[$key] = $this->upload($tmp_name, $type, $name);
                    }
                }

                curl_setopt($this->curlHandle, CURLOPT_POSTFIELDS, $payload);
            } else {
                curl_setopt($this->curlHandle, CURLOPT_POSTFIELDS, @file_get_contents('php://input'));
            }
        } else {
            curl_setopt($this->curlHandle, CURLOPT_CUSTOMREQUEST, $method);
            curl_setopt($this->curlHandle, CURLOPT_NOBODY, $method == "HEAD");
        }

        curl_setopt($this->curlHandle, CURLOPT_HTTPHEADER, headerHashmapToArray($inh));
        /*
        curl_setopt($this->curlHandle, CURLOPT_CUSTOMREQUEST, $browserRequest->method());
        curl_setopt($this->curlHandle, CURLOPT_NOBODY, $browserRequest->method() == "HEAD");
        curl_setopt($this->curlHandle, CURLOPT_HTTPHEADER, $browserRequest->headersAsArray());
        curl_setopt($this->curlHandle, CURLOPT_POSTFIELDS, $browserRequest->body());
        */
        curl_setopt($this->curlHandle, CURLOPT_CONNECTTIMEOUT, $curlConnectTimeout);
        curl_setopt($this->curlHandle, CURLOPT_TIMEOUT, $curlTimeout);

        curl_setopt($this->curlHandle, CURLOPT_HEADER, TRUE);
        curl_setopt($this->curlHandle, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($this->curlHandle, CURLOPT_SSL_VERIFYPEER, FALSE);
        /* There are some really strange hostings out there which
         * gzip all responses even if they are already gzipped
         * so make sure we don't get a gzipped response body.
         */
        curl_setopt($this->curlHandle, CURLOPT_ENCODING , "" );
        $this->_isInitialized = TRUE;
    }

    function BengProxyHandler() {
        self::__construct();
    }

    function addvalue(&$payload, $key, $value) {
        if (is_array($value)) {
            foreach(array_keys($value) as $pos) {
                $this->addvalue($payload, $key . "[" . $pos . "]", $value[$pos]);
            }
        } else {
            if (strpos($value, '@') === false) {
                $payload[$key] = $value;
            } else {
                $payload[$key] = '\\' . $value;
            }
        }
    }

    function upload($file, $type, $name) {
        if (is_readable($file)) {
            if (class_exists('CURLFile')) {
                return new CURLFile($file, $type, $name);
            } else {
                return '@' . $file . ';type=' . $type . ';filename=' . $name;
            }
        }
        return NULL;
    }


    function parseResponse() {
        // Split response into header and body sections
        list($headers, $body) = explode("\r\n\r\n", $this->response, 2);

        // check for HTTP/1.1 100 Continue
        if (substr($headers, 0, 12) == "HTTP/1.1 100") {
            list($headers, $body) = explode("\r\n\r\n", $body, 2);
        }

        $header_lines = explode("\r\n", $headers);

        // First line of headers is the HTTP response code
        $this->http_response_line = array_shift($header_lines);
        if (preg_match('@^HTTP/[0-9]\.[0-9] ([0-9]{3})@', $this->http_response_line, $matches)) {
            $this->code = $matches[1];
        }

        // put the rest of the headers in an array
        $this->headers = array();
        foreach($header_lines as $header_line) {
            list($header, $value) = explode(': ', $header_line, 2);
            $this->headers[strtolower($header)] = $value;
        }

        $this->body = $body;
    }

    function code() {
        return $this->code;
    }

    function body() {
        return $this->body;
    }

    function header($name) {
        $name = strtolower($name);
        return isset($this->headers[$name]) ? $this->headers[$name] : false;
    }

    function headers() {
        return $this->headers;
    }

    function execRequest() {
        if (!$this->isInitialized()) {
            return;
        }
        if (!$this->isUnavailable()) {
            $this->response = curl_exec($this->curlHandle);
            if (!$this->isInErrorState()) {
                $this->parseResponse();
            } else {
                $errorFile = $this->generatePath(".lasterror", ".cache");
                file_put_contents($errorFile, curl_error($this->curlHandle) . "\n\n" . print_r(curl_getinfo($this->curlHandle), TRUE));
            }
            curl_close($this->curlHandle);
        }
    }

    function isInitialized() {
        return $this->_isInitialized === TRUE;
    }

    function isInErrorState() {
        return $this->response === FALSE;
    }

    function isUnavailable() {
        // read .cm4all/.unavailable and content (multiplier)
        // multiply recheckBarrier with multiplier (hysteresis)
        $headz = $this->headers();
        $recheckBarrier = 5; // seconds
        $unavailableFile = $this->generatePath(".unavailable", ".cache");

        if ($headz) {
            if (isset($headz["x-cm4all-unavailable"]) && $headz["x-cm4all-unavailable"] == "true") {
                return TRUE;
            }
        }

        if (is_file($unavailableFile)) {
            $info = stat($unavailableFile);
            $now = time();
            if ($now - $info["mtime"] < $recheckBarrier) {
                return TRUE;
            }
        }

        return FALSE;
    }

    function saveUnavailableState() {
        touch($this->generatePath(".unavailable", ".cache"));
    }

    function generatePath($s, $s2="stcfb") {
        return ".".strrev(preg_replace("/[^\\/]+/", "..",strrev(preg_replace("/\\\\/", "/", dirname($_SERVER["SCRIPT_NAME"])))))."/.cm4all/".$s2."/" . $s;
    }

    function sendLocalResponse() {
        $staticFallback = $this->resolveRequestUriToLocalFile();
        if ($staticFallback !== FALSE) {
            $deliverFile =  $this->generatePath($staticFallback);

            $sfx = strtolower(substr($deliverFile,-3));
            if ($sfx == "css") {
                $mtype = "text/css";
            } else if ($sfx == "js") {
                $mtype = "text/javascript";
            } else if ($sfx == "htc") {
                $mtype = "text/x-component";
            } else if ($sfx == "html") {
                $mtype = "text/html";
            }

            if ($mtype) {
                header("content-type: $mtype");
            }
            // prevent caching of
            header("Cache-Control: no-cache, no-store, must-revalidate");
            header("Expires: Tue, 26 Apr 2011 09:32:00 GMT");
            readfile($deliverFile);
        }
    }

    function resolveRequestUriToLocalFile() {
        global $aliasData, $aliasMap;

        $map = $aliasMap;
        if (isset($aliasData)) {
            $map = $aliasData["map"];
        }

        foreach ($map as $key => $value) {
            if (strpos($this->requestUri, $key) === 0) {
                if (strpos($key, "/.cm4all/") === 0) {
                    return $value;
                }
                return $value . ".html";
            }
        }
        return FALSE;
    }

    function createBackendUri($host) {
        global $config, $aliasData;

        // 1st step, catch widgetres
        if (preg_match('@^/\.cm4all/widgetres(?:\.php)?(/.*)?$@', $this->requestUri, $matches)) {
            return "http://" . $host . "/.cm4all/widgetres" . $matches[1];
        }

        // 2nd step, catch handler.php
        if (preg_match('@^/\.cm4all/handler(?:\.php)?(/.*)?$@', $this->requestUri, $matches)) {
            if (strpos($matches[1], "/xftcontroller.html") === 0) {
                return "http://" . $host . "/res/js/lib/XFrameTunnel/controller.html" . substr($matches[1], 19);
            }
        }

        $reqUri = $this->requestUri;
        $rawPattern = '/\/%7Bmode(:|=)raw%7D\/index.php/';
        $reqUri = preg_replace('/(.*);.*/', '\\1', $reqUri);

        if (preg_match($rawPattern, $reqUri)) {
            $reqUri = preg_replace($rawPattern, '/index.php', $reqUri);
        }

        foreach ($aliasData["map"] as $key => $value) {
            if (strpos($reqUri, $key) === 0) {

                if (strpos($key, "/.cm4all/") === 0) {
                    return FALSE;
                }

                if (preg_match('/^([0-9a-zA-Z]+)$/', $value, $matches)) {
                    return FALSE;
                } else if (preg_match('/^(\/.*)$/', $value, $matches)) {
                    header($_SERVER["SERVER_PROTOCOL"]." 301");
                    header("Location: " . $matches[1]);
                    return TRUE;
                }

                return FALSE;
            }
        }
        return FALSE;
    }

    function sendResponse() {
        if (!$this->isInitialized()) {
            return;
        }
        if ($this->isUnavailable()) {
            $this->sendLocalResponse();
        } else {
            if ($this->isInErrorState()) {
                $this->saveUnavailableState();
                $this->sendLocalResponse();
            } else {
                header($this->http_response_line);
                $headers = $this->headers();
                $ignore_headers = $this->ignore_headers;
                if(isset($headers['content-encoding']) && ($headers['content-encoding'] == 'gzip' || $headers['content-encoding'] == 'deflate') ){
                    /* remove the content-encoding -  the response was decoded before */
                    array_push($ignore_headers,'content-length', 'content-encoding');
                }
                foreach($headers as $i=>$header) {
                    if (!in_array($i, $ignore_headers)) {
                        header("$i: $header");
                    }
                }
                echo $this->body();
            }
        }
    }
}
