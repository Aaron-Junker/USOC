<?php

namespace USOC\Plugin;

use Closure;

class ContentPlugin
{
    /**
     * @param string $name
     * @param string $DisplayName
     * @param string $Author
     * @param string $infoUrl
     * @param string $Url
     * @param $addHandler
     * @param $editHandler
     * @param $deleteHandler
     * @param \Closure $viewHandler
     * @param bool $html
     */
    public function __construct(
        /**
         * Name of the database table
         */
        public string $name,
        /**
         * Name of the plugin shown for the user.
         * In the best case it's a translated string.
         * (It should match to "Create/Upload new ..."
         * (for example "Create/Upload new blog page"))
         */
        public string   $DisplayName,
        public string   $Author,
        public string   $infoUrl,
        public string   $Url,
        public ?Closure $addHandler,
        public ?Closure $editHandler,
        public ?Closure $deleteHandler,
        public ?Closure $viewHandler,
        public bool     $html = true
    )
    {}
}

$a = new ContentPlugin("Test", "Test", "Test", "Test", "Test", function(){return "a";}, function(){}, function(){}, function(){});

$contentPlugins[] = $a;
echo ($contentPlugins[0]->addHandler)();
echo $contentPlugins[0]->addHandler->__invoke();