<?php
    namespace UInterfaceVariables{
        const UUpage = 1;
        const UUser = 2;
        const UPlugin = 3;
        const UContentPlugin = 4;
        const ULoginPlugin = 5;
        const URegisterPlugin = 6;
        const UUserPagePlugin = 7;
    }
    namespace UInterface{
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
                return UInterfaceVariables\UUPage;
            }
        }
        abstract class UUser implements Uclass{ 
            public string $Name;
            public string $Mail;
            public int $Blocked;
            public int $Permission;
            public int $Id;
            public final function getType():string{
                return UInterfaceVariables\UUser;
            }
        }
        abstract class UPlugin implements Uclass{
            public string $Name;
            public string $DisplayName;
            public string $Author;
            public string $InfoURL;
            public int $PackageVersion;
            public string $CLSID;
            public function getType():string{
                return UInterfaceVariables\UPlugin;
            }
        }
        abstract class UContentPlugin extends UPlugin{
            public abstract function AddHandler(int $Id, UPage $data):bool;
            public abstract function DeleteHandler(int $Id):bool;
            public abstract function EditHandler(int $Id, array $data):bool;
            public abstract function ShowHandler(string $code, array $data):string;
            public function getType():string{
                return UInterfaceVariables\UContentPlugin;
            }
        }

        abstract class ULoginPlugin extends UPlugin{
            public abstract function LoginHandler(string $username, string $password):bool;

            public abstract function ShowHandler():string;

            public function getType():string{
                return UInterfaceVariables\ULoginPlugin;
            }
        }
        abstract class URegisterPlugin extends ULoginPlugin{
            public abstract function RegisterHandler(string $username, string $password, mixed $mail):bool;

            public function getType():string{
                return UInterfaceVariables\URegisterPlugin;
            }
        }

        abstract class UUserPlugin extends UPlugin{
            public abstract function ShowHandler(UUser $user):bool;

            public function getType():string{
                return UInterfaceVariables\UUserPlugin;
            }
        }
    }
?>