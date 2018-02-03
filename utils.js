Element.prototype.closest = function(selector) {
  var parentNode = this,
    matches;
  while (
    // document has no .matches
    (matches = parentNode && parentNode.matches) &&
    !parentNode.matches(selector)
  ) {
    parentNode = parentNode.parentNode;
  }
  return matches ? parentNode : null;
};

function getBrowser() {
  let sUsrAg = navigator.userAgent;
  if (sUsrAg.indexOf('Chrome') > -1) {
    return 'Chrome';
  } else if (sUsrAg.indexOf('Safari') > -1) {
    return 'Safari';
  } else if (sUsrAg.indexOf('Opera') > -1) {
    return 'Opera';
  } else if (sUsrAg.indexOf('Firefox') > -1) {
    return 'Firefox';
  } else if (
    sUsrAg.indexOf('MSIE') > -1 ||
    sUsrAg.indexOf('Mozilla/5.0') > -1
  ) {
    return 'MSIE';
  }
}

function getOS() {
  let sAppVer = navigator.appVersion;
  if (sAppVer.indexOf('Win') != -1) {
    return 'Win';
  } else if (sAppVer.indexOf('Mac') != -1) {
    return 'Mac';
  } else if (sAppVer.indexOf('X11') != -1) {
    return 'Unix';
  } else if (sAppVer.indexOf('Linux') != -1) {
    return 'Linux';
  }
}

SVGMatrix.prototype.toString = function() {
  return (
    'matrix(' +
    this.a +
    ', ' +
    this.b +
    ', ' +
    this.c +
    ', ' +
    this.d +
    ', ' +
    this.e +
    ', ' +
    this.f +
    ')'
  );
};
