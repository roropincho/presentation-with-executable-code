---
title: Gambit Scheme Web App Tutorial
author: Marc Feeley
date: July 29, 2020
---

-------------------------------------------------------------------------------

## Hello world

~~~{.scm runable=}
(alert "Hello world!")

(alert (string-append
         "Hello "
         (prompt "What's your name?")
         "!"))
~~~

- When this code is run, the browser's `alert` and `prompt` JS functions
are called to do basic I/O through dialog boxes

- More elaborate interfacing to JS code is explained later in this
presentation

-------------------------------------------------------------------------------

## Is CodeBoot working?

~~~{.js .cb-vm data-cb-lang=js-novice data-trim=true}
var x = 3;

for (var i = 0; i < x; i++)
    alert(i);

alert(x);
~~~

-------------------------------------------------------------------------------

## et le dessin aussi?

~~~{.js .cb-vm data-cb-lang=js-novice data-trim=true}
cs();
lt(45);
var nbPointes = 7;

for (var i = 0; i < nbPointes; i++) {
  for (var j = 0; j < 4; j++) {
    fd(50);
    lt(90);
  }

  rt(360 / nbPointes);
}
~~~
