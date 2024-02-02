---
layout: post
title: Modular Design Patterns in JavaScript
tags : [JavaScript]
category : JavaScript
---

* auto-gen TOC:
{:toc}

In this article, I’ll be describing the structure and benefits of an extended modular design patterns, that includes **four principal member types**:

-   **public**: members that can be accessed from anywhere
-   **private**: members that can only be accessed from inside the object
-   **privileged**: members that can only be _directly_ accessed from inside the object, but which can be _indirectly_ accessed from outside via a public method
-   **protected**: members that can only be accessed from inside the object or any of its modules.

This article is not about object-orientation, because the structure we’re going to create is a kind of **singleton**, which is a single-instance structure that cannot be instantiated more than once. In fact, it isn’t instantiated at all (in the sense of having a constructor), so it’s an **object-based** rather than object-oriented pattern.<span id="more-63898"></span>

<cite>For more about the difference between object-based and object-oriented programming, and an introduction to object-orientated programming in JavaScript, I’d recommend Ryan Frishberg’s article: [JavaScript Object-Oriented Programming](http://www.sitepoint.com/oriented-programming-1/).</cite>

<!--more-->

## Modular Design Patterns

The basic design pattern I’ll be using here is the **Revealing Module Pattern**, which is a variation of the classic **Module Pattern**, but with more control. Although there are already quite a few articles that describe these patterns, very few take the time to actually explain how they work, and even fewer have such a complete set of features!

### The Basic Module Pattern

The classic **Module Pattern** wraps all the code for a script in an anonymous function literal, which is assigned to a single variable when it returns. A **function-literal** is simply a function which calls itself, so the eventual assignment of a function-literal is not a function, it’s whatever value the function returns.

To take a simple example, a function-literal encloses a calculation, and so the final value assigned to `sum` is the result of that calculation:

    var sum = (function() { return 6 * 7; })();

To illustrate what that syntax means, here’s the same code abstracted into a named function:

    function calculate() { return 6 * 7; }
    var sum = (calculate)();

In that case we don’t actually need the brackets around `calculate`, but we do when using an anonymous function, so that it’s evaluated as a single expression without having to be pre-assigned.

### Public and Private Members

So within the function-literal we can put any other code — such as variables, properties and functions — and it’s the _different kinds of syntax_ used to define the internal data that determines the split between public and private members.

Here’s an example:

    var MyModule = (function() {
      var myPrivateData = 303;
      function myPrivateFunction() {
        alert('private');
      }
      return {
        myPublicData : 42,
        myPublicFunction : function() {
          alert('public');
        }
      };
    })();

Since we returned an object of properties, and that’s assigned to `MyModule`, the properties can be accessed from outside the object as `MyModule.myPublicData` and `MyModule.myPublicFunction`. But we can’t access `myPrivateData` or `myPrivateFunction` at all, because variables are only accessible within their original scope. The **scope** of a variable is the context in which it’s defined, determined by using the `var` statement. In this example the scope of the private variables is the `MyModule` object, and therefore they can only be accessed from inside that object.

### The Revealing Module Pattern

With the module pattern we’ve used two different kinds of syntax, to create the difference between public and private members. The **Revealing Module Pattern** is a variation of that, which allows us to use the same kind of syntax for all our internal constructs, only deferring to object-literal notation at the end, to return (or reveal) the public members.

Let’s see that object again, but this time using the revealing module pattern:

    var MyModule = (function() {
      var myPrivateData = 303;
      function myPrivateFunction() {
        alert('private');
      }
      var myPublicData = 42;
      function myPublicFunction() {
        alert('public');
      }
      return {
        myPublicData : myPublicData,
        myPublicFunction : myPublicFunction
      };
    })();

The split between public and private members is still the same, but this time it’s implemented not by the original syntax used to define those members, but simply by what’s returned. This makes the revealing module pattern a useful variant, because it allows for an internally consistent style of coding. It also means you can change the names of public members when they’re returned, and even change at any time which members will be public at all.

<cite>This pattern was innovated by Christian Heilmann, who provides an excellent explanation of it, and the module pattern it’s based on, in his article: [Again with the Module Pattern — Reveal Something to the World](http://christianheilmann.com/2007/08/22/again-with-the-module-pattern-reveal-something-to-the-world/).</cite>

### The Benefits of Different Syntax

Sometimes though, a difference in syntax and coding style can be helpful, simply to remind yourself and others of which members are public or private. The syntax you use can be a kind of self-documentation, to indicate, for example, that functions declared using the `function foo` syntax will always be private.

The kind of syntax you use for a function also affects the kind of syntax you can use _inside_ it. In the example below, the use of `this.foo` syntax for the public function, means it can use the same syntax to refer to other public properties (if they’re also defined with that syntax). And if **all** the public members are defined with that same syntax, then all you eventually need to return is `this`:

    var MyModule = (function() {
      var myPrivateData = 303;
      function myPrivateFunction() {
        alert('private');
      }
      this.myPublicData = 42;
      this.myPublicFunction = function() {
        alert(this.myPublicData);
      }
      return this;
    })();

Now that isn’t a revealing module pattern any more, it’s just a normal module pattern with a different syntax. But it’s important to understand both patterns and their variations, because the final pattern I’m going to show you will be using features from all of them.

### Adding Privileged Members

Although private members can only be accessed from inside the object, public members which refer to them can effectively make them public too. For example, a public function could return the value of a private variable, like this:

    var MyModule = (function() {
      var myPrivateData = 303;
      this.myPublicFunction = function() {
        return myPrivateData;
      }
      return this;
    })();
    alert(MyModule.myPublicFunction()); //alerts 303

When a public function allows private data to be accessed from outside the object, this is known as **privileged**. In strict programming parlance it’s the function itself that’s privileged, but personally I find it much more helpful to think of the _variables they access_ as the privileged ones; they’re the ones that are different.

The private variable in question still can’t be _directly_ accessed from outside the object, it only be _indirectly_ accessed via the public function. This means the function can control **what kind of access is allowed**, as loosely or precisely as required. It might limit access to a maximum number of calls, for example, or parse the value before it’s returned for conversion or normalization; the example above allows the variable to be returned but not to be modified, but conversely, we might want it to be modified but not returned.

For me, the most useful thing to do with privileged members is to use them for a **library’s global configuration**. For example, an animation library would have individual public methods, each with their own settings passed as arguments. But it could also have a configuration object that defines global settings, such as a resolution value that determines how coarse or fine the animations are. Using a privileged object we can validate any changes to those settings — for example, converting input values to numbers then rejecting those that fail:

    var MyLibrary = (function() {
      var config = { resolution : 10 };
      this.define = function(key, value) {
        if(typeof config[key] == 'undefined') {
          alert('There is no config option "' + key + '"');
        } else {
            if(isNaN(value = parseInt(value, 10))) {
              alert('The value defined for "' + key + '" is not a number');
            } else {
              config[key] = value;
            }
        }
      };
      return this;
    })();
    MyLibrary.define('fail', 20); //alerts the first failure
    MyLibrary.define('resolution', 'fail'); //alerts the second failure
    MyLibrary.define('resolution', 20); //resolution is now 20

In this way, the config values are effectively **shielded**; since the library user can’t modify them _directly_, it’s impossible for them to inadvertently break the library’s functionality, by using settings that won’t work.

## Creating Additional Modules

Now we’ve created a design pattern with public, private and privileged members. But remember that we’re calling it a **module** pattern, so it must be able to have **additional modules in the same object context** (ie, that share the same public data and have the same concept of `this`).

There are several ways of achieving this, but the one I prefer is to use `apply()`. The **apply method** allows you to specify the object context in which a function is evaluated, effectively overriding the meaning of `this`. So to bind additional modules into the `MyModule` context, we simply modify the function-literal syntax to pass it through `apply`:

var MyModule = (function() {
  this.version = '1.0';
  return this;
})();
var MyModule = (function() {
  this.getVersion = function() {
    return this.version;
  };
  return this;
}).apply(MyModule);
alert(MyModule.getVersion()); //alerts "1.0"

Binding additional modules in this way is sometimes known as **augmentation**. You might also hear it described as **strict augmentation** or **loose augmentation** — where **strict augmentation** means the modules must load in _synchronous order_, as opposed to **loose augmentation** where they can load in _any order_. (Normal `<script>` tags load their content in synchronous source-order, whereas dynamically generated scripts that are added later will load asynchronously.)

    // loose augmentation example.
    var MyModule = (function(my) {
      my.version = '1.0';
      return my;
    })(MyModule || {});

In my experience, it’s rare for an application to be able to work with loose augmentation. Modules inevitably have **dependencies** on one another, and therefore have to load in a specific order. Our examples are all like this.

### Adding Protected Members

Splitting a script into multiple modules is a common and convenient practice. It makes a large codebase much easier to manage, and allows for bandwidth savings to be made when modules aren’t always required.

But what if we want to **share data** between different modules? If we make that data public then we’ll lose the benefits of privacy, but if we make it private it will only be available to one module. What we really need are _shared private members_, and these are known as **protected**.

JavaScript doesn’t have protected members as such, but we can effectively create them by making data **temporarily public**. To achieve this, let me first introduce you to two key functions — `extend` and `privatise` — which we’ll define as part of a utility-functions object:

    var utils = {
      extend : function(root, props) {
        for(var key in props) {
          if(props.hasOwnProperty(key)) {
            root[key] = props[key];
          }
        } return root;
      },
      privatise : function(root, prop) {
        var data = root[prop];
        try { delete root[prop]; } catch(ex) { root[prop] = null; }
        return data;
      }
    };

The **extend function** simply adds new properties to an object, while the **privatise function** copies a property and then deletes the original. We can use `extend` in one module to create a public reference to a private variable, and then use `privatise` in another module to copy it back to a private variable and delete the public reference.

So here’s an example of the **first module** which has two protected members (including the `utils` object itself), and one public member. To keep the code example short, the utility functions are just empty shells, but they would be identical to the functions I showed you a moment ago:

    var MyModule = (function() {
      var myProtectedData = 909;
      var utils = {
        extend : function(root, props) { },
        privatise : function(root, prop) { }
      };
      this.myPublicData = 42;
      return utils.extend(this, { myProtectedData : myProtectedData, utils : utils });
    })();

You can see how we’re using a variant of the revealing module pattern, to return not just the public members, but the protected members as well. So at this point we have _three_ public members: `MyModule.myProtectedData`, `MyModule.utils` and `MyModule.myPublicData`.

Now here’s an example of the **last module** which uses the `privatise` function to copy the specified public members back to private variables, and then delete their public references:

    var MyModule = (function() {
      var myProtectedData = this.utils.privatise(this, 'myProtectedData');
      var utils = this.utils.privatise(this, 'utils');
      return this;
    }).apply(MyModule);

And once that’s done the protected members are <q>locked</q> inside their objects, privately available to both the modules, but no longer available from outside them.

Note that the `privatise` function relies on having _separate arguments_ for the object and the property-key, because objects in JavaScript are **passed by reference**. So `root` is a reference to `MyModule`, and when we delete a property from it that’s specified by `key`, we’re deleting that property from the referenced object.

But if it was like this:

    privatise : function(root) {
      var data = root;
      try { delete root; } catch(ex) { root = null; } return data;
    }

And called like this:

    var myProtectedData = this.utils.privatise(this.myProtectedData);

Then the public members **would not be deleted** — the function would simply delete the _reference_, not the property it refers to.

The `try ... catch` construct is also necessary for older <abbr title="Internet Explorer">IE</abbr> versions, in which `delete` is not supported. In that case we nullify the public property rather than deleting it, which is obviously not the same, but has an equivalent end result of negating the member’s public reference.

### Extending Protected Members

With that framework in place we can add any number of additional modules, and have them all share the protected members, simply by adding them **between the first and last modules**. In these intervening modules the members are not privatised, they’re simply passed through:

    var MyModule = (function() {
      var myProtectedData = this.myProtectedData;
      var utils = this.utils;
      return this;
    }).apply(MyModule);

In fact, it isn’t strictly necessary to copy the protected members to private variables at all, but doing so means we have a consistent form of reference in every module.

We can also **extend** protected objects on a module-specific basis, for example, to define additional utility functions that only certain modules need. Such extensions will obviously also be available to later modules:

    var MyModule = (function() {
      var myProtectedData = this.myProtectedData;
      var utils = this.utils.extend(this.utils, { extraStuff : function() { } });
      return this;
    }).apply(MyModule);

One final thing to note is that **protected members can also be privileged**. The example I showed you earlier, of a privileged `config` object, is a prime candidate for data that could usefully be protected. The end result would be configuration settings that all the modules can use, but that the user still can’t modify without going through the public `define` function.

## The Final Extended Module Pattern

I’ve prepared a download file that includes all the features covered in this article, and is split into **three separate files**: `Master.js` is the root object that declares the original members, `Extension.js` is the optional intervening module (of which any number of instances can be used), then `Runtime.js` is the final module that seals the protected members:

* **[Extended Module Pattern Example](https://github.com/jsprodotcom/source/blob/master/extended-module-pattern.zip)**

Copied from [here](http://www.sitepoint.com/modular-design-patterns-in-javascript/)
