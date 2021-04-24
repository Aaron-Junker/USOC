<?php
    const UUpage = 1;
    const UUser = 2;
    const UPlugin = 3;
    const UContentPlugin = 4;
    interface UClass{
        public function getType():string;
    }
    abstract class UPage implements Uclass{
        public string $Name;
        public string $Code;
        public int $Author;
        public string $Date;
        public int $Online;
        public int $Id;
        public final function getType():string{
            return UUPage;
        }
    }
    abstract class UUser implements Uclass{ 
        public string $Name;
        public string $Mail;
        public int $Blocked;
        public int $Permission;
        public int $Id;
        public final function getType():string{
            return UUser;
        }
    }
    abstract class UPlugin implements Uclass{
        public string $Name;
        public string $DisplayName;
        public string $Author;
        public string $InfoURL;
        public int $PackageVersion;
        public function getType():string{
            return UPlugin;
        }
    }
    abstract class UContentPlugin extends UPlugin{
        public abstract function AddHandler(int $Id, array $data):bool;
        public abstract function DeleteHandler(int $Id):bool;
        public abstract function EditHandler(int $Id, array $data):bool;
        public abstract function ShowHandler(string $code, array $data):string;
        public function getType():string{
            return UContentPlugin;
        }
    }
?>