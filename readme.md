# Scrollment
* * *

## Read Me

### What is Scrollment

Scrollment is a jQuery plugin that allows CSS manipulation as you scroll. Just set the start and stop values of the scroll bar and the CSS properties and watch the elements transform as you scroll.

* * *

### Requirements

* jQuery v1.4.4

* * *

### Usage

To use Scrollment just include `jquery.scrollment-1.0.js` into your webpage (and jQuery first of course), and use it like any other plugin.

#### Example

    $('#element').scrollment({
        start: 50,
        stop: 150,
        css: {
            left: {
                start: 0,
                stop: 200
            }
        }
    })​

The above example will move `#element` left from `0px` to `200px` when you scroll between `50px` and `150px`.

Try: [http://jsfiddle.net/CLCYx/3/](http://jsfiddle.net/CLCYx/3/)

* * *

### Options

#### Basic

* `start` This is the starting value of the scroll.
* `stop` The stopping value of the scroll.
* `css` Object hash containing a collection of *available* CSS properties.
* `id` *Optional* Scrollment identifier, used for managing []multiple](#multiple-options) options and [methods](#methods).
* `forceStart` *Optional* Forces the element to transform to it's starting properties.

##### CSS Properties

The CSS properties available are basically any that handle numeric values (`width`, `height`, `top`, `left`, etc). It will treat all values as pixels and you can set fraction values like opacity using `1` and `0` also. Each property **must** have a `start` and `stop` value.

**Note:** Use only exact pixels, see [Closure Values](#closure-values) for alternative ways to setting values.

#### Animation

You can also add animation to your Scrollment, just add the `animation` to your options and set the below.

* `duration` The duration of the animation.
* `easing` *Optional* Adds easing to the animation, defaults to `swing`. See http://gsgd.co.uk/sandbox/jquery/easing/.

Example: [http://jsfiddle.net/CLCYx/4/](http://jsfiddle.net/CLCYx/4/)

#### Callbacks (Hooks)

Scrollment can also inform your webpage when scrolling starts, finishes and whilst scrolling is taking place.

* `onStart` When scrolling begins.
* `onStop` When the scrolling is finished.
* `onScroll` Whilst scrolling is taking place.

All callbacks have the following function definition and must be added to the options.

    function (current, last) {
        // current: the current scroll value
        // last: the last scroll value 
    }

Each callback is invoked after the CSS has been set, but be aware that animations wont have finished. You can determine whether the scroll is near the start or end of its Scrollment using the `current` parameter. The `current` value will be `0` at the start, or equal to `last` at the end.

Example: [http://jsfiddle.net/CLCYx/6/](http://jsfiddle.net/CLCYx/6/)

#### Closure Values

Depending on how complex your webpage is you may want values to differ from time to time, but you still want the existing Scrollment to take place. Replacing values as closures gives you great versatility to alter the values but keep the same Scrollment settings.

    $('#element').scrollment({
        start: 0,
        stop: function() {
            return ($('body').height() - $(window).height())
        },
        css: {
            height: {
                start: 75,
                stop: function() {
                    return ($(window).height() * 0.4)
                }
            },
            width: {
                start: 75,
                stop: function() {
                    return ($(window).height() * 0.8)
                }
            }
        }
    })​

Example: [http://jsfiddle.net/CLCYx/7/](http://jsfiddle.net/CLCYx/7/)

#### Multiple Options

You can attach as many as you like to a single element by either chaining the plugin method or passing an *Array* of options. When creating multiple Scrollments make use of the `id` option so that you reference singular instances using [methods](#methods).

* * *

### Methods

Scrollment also has a few methods available for enabling, disabling and removing elements.

#### Enabling

    // Disables all attached Scrollments
    $('#element').scrollment('disable')
    
    // Re-enables Scrollment with the id: demo
    $('#element').scrollment('enable', 'demo')

#### Removing

    // Removes all
    $('#element').scrollment('remove')
    
    // Removes only demo_one, demo_two
    $('#element').scrollment('remove', ['demo_one', 'demo_two'])

#### Scrollment Object

The Scrollment is a single object and set globally on the jQuery object, so you read over the code and hack away.

    $.Scrollment

* * *

### Feedback

If you are using the plugin for anything, have ideas for improving it or simply want to talk out about how and why it works give me a tweet [@tur_nr](http://twitter.com/tur_nr).

This is my first jQuery plugin so I appreciate any feedback whatsoever, issues, praises or criticism I'll take it all onboard.

* * *

### Copyright

Copyright Christopher Turner, 2012 Licensed under the [MIT license](http://www.opensource.org/licenses/mit-license.php).