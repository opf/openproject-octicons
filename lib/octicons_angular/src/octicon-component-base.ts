import {
  Directive,
  Input,
  HostBinding
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { closestNaturalHeight, SVGData, SVGSize, sizeMap } from './helpers';

@Directive({
  standalone: false
})
export class OpOcticonComponentBase {
  @Input() size:SVGSize = 'medium';
  @Input() verticalAlign = 'text-bottom';
  @Input() title = '';
  @Input() tabIndex?: number;
  @Input('aria-label') ariaLabel = '';
  @Input('aria-labelledby') ariaLabelledBy = '';
  @Input() id = '';

  @HostBinding('attr.role') role = 'img';
  @HostBinding('attr.fill') @Input() fill = 'currentColor';

  @HostBinding('attr.id') get idAttr() {
    return this.id || null;
  }

  /**
   * aria-labelledby takes precedence over aria-label when both are provided.
   * Neither is set when aria-hidden is true (no accessible label provided).
   */
  @HostBinding('attr.aria-label') get ariaLabelAttr() {
    // Don't set aria-label when aria-hidden is true or when aria-labelledby is set
    if (this.ariaHidden || this.ariaLabelledBy) {
      return null;
    }
    return this.ariaLabel || null;
  }

  @HostBinding('attr.aria-labelledby') get ariaLabelledByAttr() {
    // Don't set aria-labelledby when aria-hidden is true
    if (this.ariaHidden) {
      return null;
    }
    return this.ariaLabelledBy || null;
  }

  @HostBinding('class.octicon') baseClassName = true;
  @HostBinding('attr.aria-hidden') get ariaHidden() {
    return !this.ariaLabel && !this.ariaLabelledBy;
  }
  @HostBinding('attr.tabindex') get tabIndexAttr() {
    return this.tabIndex;
  }
  @HostBinding('attr.focusable') get focusable() {
    return (this.tabIndex && this.tabIndex >= 0);
  }
  @HostBinding('style') get style () {
    return {
      display: 'inline-block',
      'user-select': 'none',
      'vertical-align': this.verticalAlign,
      overflow: 'visible',
      height: `${this.height}px`,
      width: `${this.width}px`
    };
  };
  @HostBinding('attr.viewBox')
  get viewBox() {
    return `0 0 ${this.naturalWidth} ${this.naturalHeight}`;
  }

  get naturalHeight() {
    return closestNaturalHeight(Object.keys(this.SVGData), this.height)
  }

  get height() {
    return sizeMap[this.size];
  }

  get naturalWidth() {
    return this.SVGData[this.naturalHeight].width;
  }

  get width() {
     return this.height * (this.naturalWidth / this.naturalHeight);
  }

  get paths() {
    return this.SVGData[this.naturalHeight].paths;
  }

  protected SVGData:SVGData = {};

   constructor(protected sanitizer:DomSanitizer) {}
}
