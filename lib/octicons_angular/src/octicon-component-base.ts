import { computed, Directive, input, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { closestNaturalHeight, SVGData, SVGSize, sizeMap } from './helpers';

@Directive({
  host: {
    'role': 'img',
    '[attr.fill]': 'fill()',
    '[attr.id]': 'id()',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.aria-labelledby]': 'ariaLabelledBy()',
    '[attr.aria-hidden]': 'ariaHidden()',
    '[attr.tabindex]': 'tabIndex()',
    '[attr.focusable]': 'focusable()',
    '[attr.viewBox]': 'viewBox()',
    '[class.octicon]': 'baseClassName',
    '[style]': 'style()'
  },
})
export class OpOcticonComponentBase {
  protected sanitizer = inject(DomSanitizer);

  readonly size = input<SVGSize>('medium');
  readonly verticalAlign = input('text-bottom');
  readonly title = input<string>();
  readonly tabIndex = input<number>();
  readonly fill = input('currentColor');
  readonly id = input<string>();
  readonly ariaLabel = input<string>(undefined, { alias: 'aria-label' });
  readonly ariaLabelledBy = input<string>(undefined, { alias: 'aria-labelledby' });

  readonly baseClassName = true;

  readonly ariaHidden = computed(() => !this.ariaLabel());

  readonly focusable = computed(() => {
    const ti = this.tabIndex();
    return ti !== undefined && ti >= 0;
  });

  readonly style = computed(() => ({
    display: 'inline-block',
    'user-select': 'none',
    'vertical-align': this.verticalAlign(),
    overflow: 'visible',
    height: `${this.height()}px`,
    width: `${this.width()}px`,
  }));

  readonly viewBox = computed(() =>
    `0 0 ${this.naturalWidth()} ${this.naturalHeight()}`
  );

  readonly naturalHeight = computed(() =>
    closestNaturalHeight(Object.keys(this.SVGData), this.height())
  );

  readonly height = computed(() =>
    sizeMap[this.size()]
  );

  readonly naturalWidth = computed(() =>
    this.SVGData[this.naturalHeight()].width
  );

  readonly width = computed(() =>
    this.height() * (this.naturalWidth() / this.naturalHeight())
  );

  readonly paths = computed(() =>
    this.SVGData[this.naturalHeight()].paths
  );

  protected SVGData:SVGData = {};
}
