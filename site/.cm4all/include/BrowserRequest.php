<?php

class BrowserRequest {
 
    /** additional HTTP headers not prefixed with HTTP_ in $_SERVER superglobal */
    var $add_headers = array('CONTENT_TYPE', 'CONTENT_LENGTH');
    var $ignore_headers = array();
 
    /**
    * Construtor
    * Retrieve HTTP Body
    * @param Array Additional Headers to retrieve
    */
    function __construct($add_headers = false, $ignore_headers = false) {
        global $config;
    
        $this->retrieve_headers($add_headers, $ignore_headers);
        $this->pathinfo = (isset($_SERVER["PATH_INFO"]) ? $_SERVER["PATH_INFO"] : "");
        $this->requestUri = $_SERVER["REQUEST_URI"];
        $this->scriptName = $_SERVER["SCRIPT_NAME"];
        $this->queryString = $_SERVER["QUERY_STRING"];
        #$this->body = @file_get_contents('php://input');
        
        if (isset($config["host"])) {
            $this->headers["x-cm4all-lookup-host"] = $config["host"];
        } else if (isset($config["accountid"])) {
            $this->headers["x-cm4all-lookup-host"] = strtolower($config["accountid"]) . ".sites.hosting";
        }

        if (isset($config["viewurl"]) && !$_SERVER["HTTP_HOST"]) {
            $this->headers["X-CM4all-AltHost"] = $config["viewurl"];
        } else {
            if (strtolower($_SERVER['HTTPS']) == 'on' || strtolower($_SERVER['REQUEST_SCHEME']) == 'https') {
                $this->headers["X-CM4all-AltHost"] = "https://" . $_SERVER["HTTP_HOST"];
            } else {
                $this->headers["X-CM4all-AltHost"] = "http://" . $_SERVER["HTTP_HOST"];
            }
        }
    }

    function BrowserRequest() {
        self::__construct();
    }
 
    /**
    * Retrieve the HTTP request headers from the $_SERVER superglobal
    * @param Array Additional Headers to retrieve
    */
    function retrieve_headers($add_headers = false, $ignore_headers = false) {
         if ($add_headers) {
            $this->add_headers = array_merge($this->add_headers, $add_headers);
        }
        if ($ignore_headers) {
            $this->ignore_headers = array_merge($this->ignore_headers, $ignore_headers);
        }
 
        if (isset($_SERVER['HTTP_METHOD'])) {
            $this->method = $_SERVER['HTTP_METHOD'];
            unset($_SERVER['HTTP_METHOD']);
        } else {
            $this->method = isset($_SERVER['REQUEST_METHOD']) ? $_SERVER['REQUEST_METHOD'] : false;
        }
        
        $this->protocol = isset($_SERVER['SERVER_PROTOCOL']) ? $_SERVER['SERVER_PROTOCOL'] : false;
        $this->request_method = isset($_SERVER['REQUEST_METHOD']) ? $_SERVER['REQUEST_METHOD'] : false;
        $this->headers = array();
        
        foreach($_SERVER as $i=>$val) {
            if ((strpos($i, 'HTTP_') === 0 || in_array($i, $this->add_headers)) && !in_array($i, $this->ignore_headers)) {
                $name = strtolower(str_replace(array('HTTP_', '_'), array('', '-'), $i));
                $this->headers[$name] = $val;
            }
        }
    }
 
    /** 
    * Retrieve HTTP Method
    */
    function method() {
        return $this->method;
    }
 
    function pathinfo() {
        return $this->pathinfo;
    }
    
    function scriptName() {
        return $this->scriptName;
    }
 
 
    function requestUri() {
        // we use pathinfo because IIS lacks the path_info
        $url = $this->scriptName() . ($this->pathinfo ? $this->pathinfo : "/");        
        /* therefore we have to encode some special characters  */
        $url = str_replace("{", "%7B", $url);
        $url = str_replace("}", "%7D", $url);
        return $url . ($this->queryString ? "?" . $this->queryString : "");
    }
 
    
    /** 
    * Retrieve HTTP Body
    */
	/*
    function body() {
        return $this->body;
    }
	*/
 
    /** 
    * Retrieve an HTTP Header
    * @param string Case-Insensitive HTTP Header Name (eg: "User-Agent")
    */
    function header($name) {
        $name = strtolower($name);
        return isset($this->headers[$name]) ? $this->headers[$name] : false;
    }
 
    /**
    * Retrieve all HTTP Headers 
    * @return array HTTP Headers
    */
    function headers() {
        return $this->headers;
    }
 
    function headersAsArray() {
        $result = array();
        $headers = $this->headers();
        foreach($headers as $i=>$header) {
            array_push($result, "$i: $header");
        }
        return $result;
    }
    
    /**
    * Return Raw HTTP Request (note: This is incomplete)
    * @param bool ReBuild the Raw HTTP Request
    */
	/*
    function raw($refresh = false) {
        if (isset($this->raw) && !$refresh) {
            return $this->raw; // return cached
        }
 
        $headers = $this->headers();
        $this->raw = "{$this->method} {$this->requestUri}\r\n";
 
        foreach($headers as $i=>$header) {
            $this->raw .= "$i: $header\r\n";
        }
 
        $this->raw .= "\r\n{$http_request->body}";
 
        return $this->raw;
    }
	*/
}
