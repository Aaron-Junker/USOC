# Contributing Guidelines
## Branches
### Branch name guidelines
* ver/* for versions under support
* test/* for tests with the software
* issue/* (* as issue number)for solving a issue
* new/* (* as issue number)for a new idea with a issue
* doc/* for Documentation
### Branch merging
* When releasing a new version: copy of master to ver/*
* doc/* and new/* merging into master
* issue/* to versions with this problem
# Code conventions
## PHP
### Start/End
A Block of php should start with the full `<?php` and at the end `?>`. Don't use `<?` and `?>` or something like that. Also not allowed is `<?=` and `?>`.
### True/False/Null
The statements `True`, `False` and `Null` must be lowercase except the first Letter, which must be uppercase.
### Language constructs
A language construct (like `echo`, `include_once` and so on) must be used without brackets.

False is:
```
echo("Hi","What's going on");
```
Right is:
```
echo "Hi"."What's going on";
```
### Use tabulator
Don't use space as tabulator. Indent code right.

False is:
```
<?php
if($w){
       break;
}
?>
```
Right is:
```
<?php
  if($w){
    break;
  }
?>
```
### Use a dot to connect strings and variables.
Don't use inline variables. (Exexption: Heredoc)

Don't connect strings in a echo with a `,`. You must always use a `.`.

False is:
```
<?php
  echo "Hi","There $test";
?>
```
Right is:
```
<?php
  echo "Hi"."There".$test;
?>
```
### Heredoc
Always use as heredoc name `heredoc`. Exeption: `heredoc;` is in the heredoc code.
## HTML
### Doctype
Use as doctype: `<!DOCTYPE html>`.
### Tag names
Write tag names always with lowercase like `<html>` not `<Html>` or `<HTML>`.
### Attribute names
Write attribute names always with lowercase like `style=""` not `Style=""` or `STYLE=""`.
### HTML 3.0 attributes
Don't use attributes from html 3.0. For attributes like `color=""` or `bgcolor=""` use always the `style=""` tag.
### HTML 4.0(1) Tags
Don't use:
* `<frame>`
* `<frameset>`
* `<noframes>`
* `<basefont>`
* `<big>`
* `<center>`
* `<font>`
* `<strike>`
* `<tt>`
* `<acronym>`
* `<applet>`
* `<isindex>`
* `<dir>`
### Include stylesheets
To include stylesheets use the `<link>` tag. Don't use `@import`.
### Use tabulator
Don't use space as tabulator. Indent code right.
### Encoding
