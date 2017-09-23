# \<svg-textarea\>

A Polymer 2 element for converting any SVG <text> element into an editable multi-line textarea.

## Usage

Add `<svg-textarea>` element as a sibling to the `svg` container. Pass the ID of the SVG `<text>` element to `svg-textarea` to make it editable.

```
<svg width="100%" style="border: 1px solid red">
    <text id="svgtext"></text>
</svg>

<svg-textarea svg-text-id="svgtext"></svg-textarea>
```

## Properties

* `svg-text-id`: The id of the svg `<text>` element.
* `content`: returns the text content
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
