# \<svg-textarea\>

SVG textarea element with support for multi-line editing.

## Usage

Add `<svg-textarea>` element as a sibling to the `svg` container. Pass the ID of the SVG Text element to `svg-textarea` to make it the `<text>` element editable

```
<svg width="100%" style="border: 1px solid red">
    <text id="svgtext"></text>
</svg>

<svg-textarea svg-text-id="svgtext" adjust-baseline="true"></svg-textarea>
```

## Properties

* `svg-text-id`: The id of the svg `<text>` element.
* `adjust-baseline`: (default `false`) Text in SVG by default uses the font baseline for positioning causing it to shift to the top of the svg container. Set it to `true` to let the component auto-adjust the postion.
* `content`: returns the text content
* `top-offset`: The component is adjusted to `Open Sans` Google font and works pretty well for font sizes between 10-50px. However depending on your `font-family` and `font-size`, you might notice some shift in text when edit mode is enabled. Use `top-offset` to adjust the top position. You can pass `+ve` or `-ve` values. These values are relative to the current position of textarea.
* `left-offset`: Use `left-offset` to adjust the left position. You can pass `+ve` or `-ve` values. These values are relative to the current position of textarea.

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
