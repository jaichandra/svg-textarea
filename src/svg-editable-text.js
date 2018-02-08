import { NativeElement } from './native-element.js';
import { LinebreakMixin } from './linebreak-mixin.js';
import { getBrowser } from './utils.js';

// const _instance = Symbol();
// const __svgEditableText_ = Symbol();
export default class SvgEditableText extends LinebreakMixin(NativeElement) {
  constructor(container = document.body) {
    // if (instance !== __svgEditableText_) {
    //   throw new Error('Cannot construct singleton');
    // }
    super();
    this.tagName = 'text';
    this.attribute = 'editable';
    this._spacer = '      ';
    this._browser = getBrowser();
    this.register(container);
  }

  // static get instance() {
  //   if (!this[_instance]) {
  //     this[_instance] = new SvgEditableText(__svgEditableText_);
  //     this[_instance].register();
  //   }
  //   return this[_instance];
  // }

  register(container = document.body) {
    this.elements = this.getAll(container);
    const len = this.elements.length;
    for (let i = 0; i < len; i++) {
      console.log(this.elements[i]);
      this.init(this.elements[i]);
    }
  }

  init(element) {
    const prop = '__component_' + this.tagName;
    if (element[prop] !== undefined) {
      return false;
    }
    element[prop] = true;

    this.addProperty(element, 'content', '');
    this.addProperty(element, 'height', null);
    this.addProperty(element, 'width', null);
    this.addProperty(element, 'scaleFactor', 0);
    this.addProperty(element, 'rotation', 0);
    this.addProperty(element, '_svgTextElProperties', {});
    this.addProperty(element, '_textareaProperties', {});
    this.addProperty(element, 'lineHeight', 1.2);
    this.addProperty(element, 'adjustments', {});
    this.maxHeight = 1000;

    // prepare the viewbox based on the svgTextID reference
    // this.svgTextEl = this.getViewboxFromId();
    if (element) {
      // this.initialize(element);

      // element.addEventListener('click', () => {
      //   console.log('text element clicked');
      // });

      // if (this._initialized) {
      //   return;
      // }
      // this._initialized = true;

      this.initializeSVGText(element);

      // element.addEventListener('click', this.makeEditable.bind(this));
      element.addEventListener('click', () => {
        this.makeEditable(element);
      });
    } // else svgTextEl is not set yet. call initialize from _svgTextElChanged setter method
  }

  getAll(container = document.body) {
    return container.querySelectorAll(
      this.tagName + '[' + this.attribute + ']'
    );
  }

  ///////////////////////
  invalidate() {
    if (!this._invalidated) {
      this._invalidated = true;
      setTimeout(() => {
        this._invalidated = false;
        this._validate();
      }, 500);
    }
  }

  // initialize(element) {}

  _validate(element) {
    this.resetProperties(element);
    this.initializeSVGText(element);
  }

  /**
   * _svgTextElProperties calc
   */
  initializeSVGText(element) {
    // add dummy content incase content is not set or text element is empty.
    // Required to make the element clickable
    element.content = element.content || element.textContent;
    if (element.content == '') {
      this.addText(element, this._spacer);
    }

    // set default width of the text element to match the SVG container width
    let elem =
      element.closest('[transform^="scale"]') || element.ownerSVGElement;
    if (!elem) {
      return;
    }
    let ownerSvgStyles = getComputedStyle(elem);
    Object.assign(element._textareaProperties, {
      width: element.width || ownerSvgStyles.width
    });

    // empty text node and create tspan elements
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }

    let _textlines = this.getTextLines(
      element.content,
      parseFloat(element._textareaProperties.width)
    );

    this.computeSVGInitialLineHeight(element, _textlines.shift(), () => {
      this.createSVGText(element, _textlines);
    });
  }

  computeSVGInitialLineHeight(element, text, callback) {
    this.addText(element, text);
    setTimeout(() => {
      let viewboxBBox = element.getBBox();
      Object.assign(element._textareaProperties, {
        // height: viewboxBBox.height,
        topOffset: viewboxBBox.y,
        initialHeight: viewboxBBox.height
      });

      // if (this._browser === 'Chrome') {
      //   Object.assign(this._textareaProperties, {
      //     initialHeight: viewboxBBox.height
      //   });
      // }
      callback();
    }, 10);
  }

  getTextLines(text, width) {
    let str = this.getMultilineText(text, width);
    return str.split('\n');
  }
  /**
   * get svgTextEl properties after initial value has been set
   */
  computeSVGTextProperties(element) {
    element._svgTextElProperties = this.getElementClientRect(element);
  }

  /**
   * _textareaProperties calc
   */
  computeTextareaProperties(element) {
    this.computeSVGTextProperties(element);

    let viewboxStyles = getComputedStyle(element);
    let viewboxBBox = element.getBBox();
    let elem =
      element.closest('[transform^="scale"]') || element.ownerSVGElement;
    if (!elem) {
      return;
    }

    let ownerSvgStyles = getComputedStyle(elem);

    let _transform = '';
    if (element.scaleFactor) {
      _transform = 'scale(' + element.scaleFactor + ')';
    } else {
      _transform = ownerSvgStyles.transform;
    }

    if (element.rotation) {
      if (_transform === 'none') {
        _transform = '';
      } else {
        _transform += ' ';
      }
      _transform += 'rotate(' + element.rotation + 'deg)';
    }

    // _textareaProperties calc
    // **************************
    Object.assign(element._textareaProperties, {
      fontStyle: viewboxStyles.fontStyle,
      fontVariant: viewboxStyles.fontVariant,
      fontWeight: viewboxStyles.fontWeight,
      fontStretch: viewboxStyles.fontStretch,
      fontSize: viewboxStyles.fontSize,
      fontFamily: viewboxStyles.fontFamily,
      color: viewboxStyles.fill,
      transform: _transform,
      width: element.width || ownerSvgStyles.width,
      lineHeight: 'normal',
      height: viewboxBBox.height,
      topOffset: viewboxBBox.y,
      top: element._svgTextElProperties.top,
      left: element._svgTextElProperties.left,

      tempHeight: viewboxBBox.height // will be overridden after textarea is added to DOM with adjustments
    });

    // handle transform separately for Firefox
    // getComputedStyle doesn't return the inherited `transform` object in Firefox.
    if (this._browser === 'Firefox') {
      let baseVal = elem.transform.baseVal[0];
      if (baseVal) {
        Object.assign(this._textareaProperties, {
          transform: elem.transform.baseVal[0].matrix
        });
      }
    }
  }

  /**
   * clear values
   */
  resetProperties(element) {
    element._textareaProperties = {};
    element._svgTextElProperties = {};
    element._isTextareaPositionCaptured = false;
  }

  handleBlur(element, e) {
    this.parseText(element);
  }

  /**
   * Handler for the click event on the SVG text element
   * This is the entry point for making the text editable
   * Begin by initializing the properties required to position the textarea
   */
  makeEditable(element) {
    let range = this.getSelectionRange(element);
    this.showTextarea(element, true, range);

    // clear svg only after all initialization values are fetched
    this.clearSVG(element);
  }

  resizeTextarea(element) {
    this._textarea.style.height = '';
    let h = Math.min(this._textarea.scrollHeight, this.maxHeight) + 'px';
    this._textarea.style.height = element._textareaProperties.height = h;

    if (!this._isTextareaPositionCaptured) {
      this._isTextareaPositionCaptured = true;
    }
  }

  // getViewboxFromId(element) {
  //   if (element) {
  //     return element;
  //   }

  //   let elem;
  //   if (this.svgTextId) {
  //     elem = document.querySelector('#' + this.svgTextId);
  //     if (elem == null) {
  //       throw "Invalid Reference: `svgTextId` must refer to a valid SVG Text element";
  //     }
  //   }
  //   return elem;
  // }

  showTextarea(element, flag, range) {
    if (flag) {
      let ta = this.getTextarea(element);

      this.computeTextareaProperties(element);

      this.applyElementStyles(element);
      document.body.appendChild(ta);
      // this.applyBrowserAdjustments(element, ta);
      ta.focus();
      if (range) {
        ta.setSelectionRange(range.startOffset, range.endOffset);
      }
    } else {
      let styles = { top: -9999 + 'px', left: -9999 + 'px', display: 'none' };
      Object.assign(this._textarea.style, styles);
    }
  }

  getTextarea(element) {
    if (!this._textarea) {
      this._textarea = document.createElement('textarea');
      this._textarea.rows = '1';
      this._textarea.id = 'textarea';
      this._textarea.value = element.content || '';
      this._textarea.addEventListener('blur', e => this.handleBlur(element, e));
      this._textarea.addEventListener('input', e =>
        this.resizeTextarea(element, e)
      );
    }
    return this._textarea;
  }

  applyElementStyles(element) {
    Object.assign(
      this._textarea.style,
      this.convertToCSS(Object.assign({}, element._textareaProperties))
    );
  }

  applyBrowserAdjustments(element, textarea) {
    switch (this._browser) {
      case 'Chrome':
        Object.assign(element._textareaProperties, {
          height: element._textareaProperties.tempHeight
        });
        break;

      case 'Firefox':
        let o = this.getElementClientRect(textarea);
        Object.assign(element._textareaProperties, {
          top:
            element._textareaProperties.top -
            Math.abs(element._textareaProperties.tempHeight - o.height) / 2 +
            'px',
          left: element._textareaProperties.left - 1,
          height: element._textareaProperties.tempHeight
        });
        this.applyElementStyles(element);
        break;

      case 'Safari':
        break;

      case 'MSIE':
        break;

      default:
        break;
    }
  }

  // if user specific offsets are set, add those in.
  applyUserAdjustments(element) {
    if (!element.adjustments) return;

    switch (this._browser) {
      case 'Chrome':
        if (element.adjustments['Chrome']) {
          element._textareaProperties.top +=
            parseFloat(element.adjustments['Chrome'].top) || 0;
          element._textareaProperties.left +=
            parseFloat(element.adjustments['Chrome'].left) || 0;
        }
        break;

      case 'Firefox':
        if (element.adjustments['Firefox']) {
          element._textareaProperties.top +=
            parseFloat(element.adjustments['Firefox'].top) || 0;
          element._textareaProperties.left +=
            parseFloat(element.adjustments['Firefox'].left) || 0;
        }
        break;

      case 'Safari':
        if (element.adjustments['Safari']) {
          element._textareaProperties.top +=
            parseFloat(element.adjustments['Safari'].top) || 0;
          element._textareaProperties.left +=
            parseFloat(element.adjustments['Safari'].left) || 0;
        }
        break;

      case 'MSIE':
        if (element.adjustments['MSIE']) {
          element._textareaProperties.top +=
            parseFloat(element.adjustments['MSIE'].top) || 0;
          element._textareaProperties.left +=
            parseFloat(element.adjustments['MSIE'].left) || 0;
        }
        break;

      default:
        break;
    }
  }

  clearSVG(element) {
    while (element.lastChild) {
      element.removeChild(element.lastChild);
    }
  }

  parseText(element) {
    this.clearSVG(element);
    element.content = this._textarea.value;

    // if textarea is empty, set spacer text and exit
    if (element.content.trim() === '') {
      element.content = '';
      this.addText(element, this._spacer);
      return;
    }

    let _textlines = this.getTextLines(
      element.content,
      parseFloat(element._textareaProperties.width)
    );
    this.createSVGText(element, _textlines);

    // destroy the textarea
    if (this._textarea) {
      // document.body.removeChild(this._textarea);
      // this._textarea = null;
    }
  }

  /**
   * Returns the svg text element with multiline text as per width specified
   */
  createSVGText(element, textLines) {
    textLines.map(key => {
      this.addText(element, key);
    });
  }

  applyBrowserRounding(val) {
    let num, suffix;
    if (typeof val === 'string') {
      num = parseFloat(val) || 0;
      suffix = val.split(num)[1];
    } else {
      num = val;
      suffix = 0;
    }
    switch (this._browser) {
      case 'Chrome':
        num = Math.ceil(num);
        break;
      case 'MSIE':
        num = Math.ceil(num);
        break;

      default:
        break;
    }
    return num + suffix;
  }

  // get user selected text position
  getSelectionRange(element) {
    if (!element.content) {
      return null;
    }

    // get selection range from svg on which user actually clicked
    let selObj = window.getSelection();
    let range = selObj.getRangeAt(0);

    // identify offsets on the textarea content based on above data
    let o = { startOffset: 0, endOffset: 0 };
    let charCount = 0;
    let nodes = element.childNodes;
    for (var i = 0; i < nodes.length; i++) {
      var elem = nodes[i];
      let textNode;
      switch (elem.nodeType) {
        case 1:
          textNode = elem.firstChild;
          break;

        case 3:
          textNode = elem;
          break;

        default:
          break;
      }

      if (textNode === range.startContainer) {
        o.startOffset = charCount + range.startOffset;
      }
      if (textNode === range.endContainer) {
        o.endOffset = charCount + range.endOffset;
      }
      charCount += textNode.nodeValue.length;
      // add extra index for new lines
      if (element.content.charAt(charCount) === '\n') {
        charCount++;
      }
    }
    return o;
  }

  // get position of the element
  getElementClientRect(el) {
    el = el.getBoundingClientRect();
    return {
      left: el.left + window.pageXOffset,
      top: el.top + window.pageYOffset,
      right: el.right + window.pageXOffset,
      bottom: el.bottom + window.pageYOffset,
      height: el.height,
      width: el.width
    };
  }

  addText(element, text) {
    // preserve empty lines. Without extra space, SVG ignores the tspan and won't render it
    if (text === '') text = ' ';

    // create a new tspan node to add to the SVG text block
    var newText = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'tspan'
    );
    newText.appendChild(document.createTextNode(text));
    newText.setAttributeNS(null, 'x', '0');
    newText.setAttributeNS(null, 'style', 'white-space: pre');

    element.appendChild(newText);
    newText.setAttributeNS(
      null,
      'dy',
      element.childNodes.length == 1
        ? 0
        : Math.round(parseFloat(element._textareaProperties.initialHeight))
    );
  }

  convertToCSS(o) {
    Object.keys(o).map((e, index) => {
      // properties to exclude from adding 'px'
      if (e === 'lineHeight') return;

      if (typeof o[e] === 'number') {
        o[e] += 'px';
      } else if (typeof o[e] === 'SVGMatrix') {
        o[e] = o[e].toString();
      }
    });
    return o;
  }
}
