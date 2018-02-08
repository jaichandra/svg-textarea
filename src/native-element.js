export class NativeElement {
  constructor() {}

  addProperty(component, name, defaultValue) {
    const attrVal = component.getAttribute(name);
    component['_' + name] = attrVal ? attrVal : defaultValue;
    Object.defineProperty(component, name, {
      get() {
        return component['_' + name];
      },
      set(val) {
        component['_' + name] = val;
      }
    });
  }

  log(element) {
    let props = this.getElementClientRect(element);
    let ta = {};
    if (this._textarea) ta = this._textarea.getBoundingClientRect();
    console.log(
      'Yoffset:' +
        window.pageYOffset +
        ', SVG- top:' +
        props.top +
        ', height:' +
        props.height +
        ', Textarea- top:' +
        ta.top +
        ', height:' +
        ta.height
    );
  }
}
