import {
  Directive,
  Input,
  HostBinding,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { closestNaturalHeight, SVGData, SVGSize, sizeMap } from './helpers';

@Directive({
  standalone: false
})
export class OpOcticonComponentBase implements AfterViewInit {
  @Input() size:SVGSize = 'medium';
  @Input() verticalAlign = 'text-bottom';
  @Input() title = '';
  @Input() tabIndex?: number;

  private _ariaLabel = '';
  private _ariaLabelledBy = '';
  private _id = '';

  @Input('aria-label')
  set ariaLabel(value: string) {
    this._ariaLabel = value;
    this.updateAriaAttributes();
  }
  get ariaLabel(): string {
    return this._ariaLabel;
  }

  @Input('aria-labelledby')
  set ariaLabelledBy(value: string) {
    this._ariaLabelledBy = value;
    this.updateAriaAttributes();
  }
  get ariaLabelledBy(): string {
    return this._ariaLabelledBy;
  }

  @Input()
  set id(value: string) {
    this._id = value;
    this.updateAriaAttributes();
  }
  get id(): string {
    return this._id;
  }

  @HostBinding('attr.role') role = 'img';
  @HostBinding('attr.fill') @Input() fill = 'currentColor';

  @HostBinding('class.octicon') baseClassName = true;
  @HostBinding('attr.aria-hidden') get ariaHidden() {
    return !this._ariaLabel && !this._ariaLabelledBy;
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
  protected elementRef: ElementRef;

  constructor(protected sanitizer:DomSanitizer, elementRef: ElementRef) {
    this.elementRef = elementRef;
  }

  ngAfterViewInit() {
    this.updateAriaAttributes();
  }

  /**
   * Manages aria-label, aria-labelledby, and id attributes directly on the DOM element.
   * This ensures empty attributes are removed rather than rendered as empty strings.
   * aria-labelledby takes precedence over aria-label when both are provided.
   */
  private updateAriaAttributes() {
    const el = this.elementRef?.nativeElement;
    if (!el) return;

    // Handle id attribute
    if (this._id) {
      el.setAttribute('id', this._id);
    } else {
      el.removeAttribute('id');
    }

    // Handle aria-label and aria-labelledby (mutually exclusive, aria-labelledby takes precedence)
    if (this._ariaLabelledBy) {
      el.setAttribute('aria-labelledby', this._ariaLabelledBy);
      el.removeAttribute('aria-label');
    } else if (this._ariaLabel) {
      el.setAttribute('aria-label', this._ariaLabel);
      el.removeAttribute('aria-labelledby');
    } else {
      el.removeAttribute('aria-label');
      el.removeAttribute('aria-labelledby');
    }
  }
}
