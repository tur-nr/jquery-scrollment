# Scrollment
* * *
## Read Me
### What is Scrollment
Scrollment is a jQuery plugin that allows CSS manipulation as you scroll. Just set the start and stop values of the scroll bar and the CSS properties and watch the elements transform as you scroll.
### Requirements
jQuery v1.4
*IE support unknown*
### Usage

    $('#element').scrollment({
        start: 0,
        stop: 200,
        css: {
            left: {
                start: 0,
                stop: 200
            }
        }
    })
