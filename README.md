# \<svg-textarea\>

A library for making any SVG <text> element into an editable multi-line text.

## Usage

Include below `css` and `javascript` files to the html page

```
<link rel="stylesheet" href="./dist/svg-editable-text.min.css">
<script src="./dist/svg-editable-text.min.js"></script>
```

Initialize the plugin at the end of the `body` tag. This ensures that the DOM is ready.

```
var o = new SvgEditableText();
```

Add `editable` attributes to the SVG Text elements that need to be made editable.

Example:

```
<svg width="100%">
    <text editable>Simple Text</text>
</svg>

<script>
  var o = new SvgEditableText();
</script>
```

## Properties

* `adjustments`: The component is adjusted to `Open Sans` Google font and works pretty well for font sizes between 10-50px. However depending on your `font-family` and `font-size`, you might notice some shift in text when edit mode is enabled. Use the `adjustments` property to pass the `top` and `left` position for each browser (`Chrome`, `Firefox`, `MSIE`, `Safari`). You can pass `+ve` or `-ve` values. These values are relative to the current position of textarea.

```
  {
    'Firefox': {
      left: 0.4
    },
    'Safari': {
      top: 0.3
    }
  }
```

Checkout the demo for examples.

## Browser compatibility

Latest versions of Chrome, Safari, Firefox and IE11+

## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `polymer serve` to serve your element locally.

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.
