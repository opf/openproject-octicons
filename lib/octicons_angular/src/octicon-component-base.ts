import { Directive, Input} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { closestNaturalHeight, SVGData, SVGSize, sizeMap } from './helpers';

@Directive({
  host: {
    'role': 'img',
    '[attr.fill]': 'fill',
    '[attr.id]': 'id',
    '[attr.aria-label]': 'ariaLabel',
    '[attr.aria-labelledby]': 'ariaLabelledBy',
    '[attr.aria-hidden]': 'ariaHidden',
    '[attr.tabindex]': 'tabIndexAttr',
    '[attr.focusable]': 'focusable',
    '[attr.viewBox]': 'viewBox',
    '[class.octicon]': 'baseClassName',
    '[style]': 'style'
  },
})
export class OpOcticonComponentBase {
  @Input() size:SVGSize = 'medium';
  @Input() verticalAlign = 'text-bottom';
  @Input() title?: string;
  @Input() tabIndex?: number;
  @Input() fill = 'currentColor';
  @Input() id?: string;
  @Input('aria-label') ariaLabel?: string;
  @Input('aria-labelledby') ariaLabelledBy?: string;

  readonly baseClassName = true;

  get ariaHidden() {
    return !this.ariaLabel;
  }
  get tabIndexAttr() {
    return this.tabIndex;
  }
  get focusable() {
    return (this.tabIndex && this.tabIndex >= 0);
  }
  get style () {
    return {
      display: 'inline-block',
      'user-select': 'none',
      'vertical-align': this.verticalAlign,
      overflow: 'visible',
      height: `${this.height}px`,
      width: `${this.width}px`
    };
  };

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
