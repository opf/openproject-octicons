import {
  Directive,
  Input,
  HostBinding
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { closestNaturalHeight } from './helpers';

@Directive({})
export class OpOcticonComponentBase {
  @Input() className = '';
  @Input() fill = 'currentColor';
  @Input() size: 'small'|'medium'|'large'= 'medium';
  @Input() verticalAlign = 'text-bottom';
  @Input() title = '';

  @HostBinding('attr.role') role = 'img';
  @HostBinding('attr.id') @Input() id = '';
  @HostBinding('attr.tabindex') @Input() tabindex:number = -1;
  @HostBinding('attr.aria-label') @Input('aria-label') ariaLabel = '';
  @HostBinding('attr.aria-labelledby') @Input('aria-labelledby') arialabelledby = '';

  @HostBinding('class.op-octicon') baseClassName = true;
  @HostBinding('attr.aria-hidden') get ariaHidden() {
    return !this.ariaLabel;
  }
  @HostBinding('attr.focusable') get focusable() {
    return this.tabindex >= 0;
  }
  @HostBinding('style') get style () {
    return {
      display: 'inline-block',
      'user-select': 'none',
      'vertical-align': this.verticalAlign,
      overflow: 'visible'
    };
  };
  @HostBinding('attr.viewBox') get viewBox() {
    return `0 0 ${this.naturalWidth} ${this.naturalHeight}`;
  }

  get naturalHeight() {
    return closestNaturalHeight(Object.keys(this.SVGData), this.height)
  }

  @HostBinding('attr.height')
  get height() {
    const sizeMap = {
      small: 16,
      medium: 32,
      large: 64
    }
    return sizeMap[this.size];
  }

  get naturalWidth() {
    return this.SVGData[this.naturalHeight].width;
  }

  @HostBinding('attr.width')
  get width() {
     return this.height * (this.naturalWidth / this.naturalHeight);
  }

  get path() {
    return this.SVGData[this.naturalHeight].path;
  }

  protected SVGData:{
     [key in string]: {
       width: number,
       path: string,
     };
   } = {};

   constructor(protected sanitizer:DomSanitizer) {}
}
