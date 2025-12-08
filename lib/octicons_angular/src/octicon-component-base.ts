import { computed, Directive, input, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { closestNaturalHeight, SVGData, SVGSize, sizeMap } from './helpers';

@Directive({
  host: {
    '[attr.role]': 'role()',
    '[attr.fill]': 'fill()',
    '[attr.id]': 'id()',
    '[attr.aria-label]': 'ariaLabelAttr()',
    '[attr.aria-labelledby]': 'ariaLabelledByAttr()',
    '[attr.aria-hidden]': 'ariaHidden()',
    '[attr.tabindex]': 'tabIndex()',
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

  /**
   * role="img" should only be set when the icon has an accessible label.
   * Setting both role="img" and aria-hidden="true" is an accessibility error.
   */
  readonly role = computed(() => {
    return (this.ariaLabel() || this.ariaLabelledBy()) ? 'img' : null;
  });

  /**
   * aria-hidden is true when neither aria-label nor aria-labelledby is provided
   */
  readonly ariaHidden = computed(() => !this.ariaLabel() && !this.ariaLabelledBy());

  /**
   * aria-labelledby takes precedence over aria-label when both are provided.
   * This follows the ARIA specification where aria-labelledby overrides all other naming sources.
   * Neither is set when aria-hidden is true (no accessible label provided).
   */
  readonly ariaLabelAttr = computed(() => {
    // Don't set aria-label when aria-labelledby is set (mutual exclusivity)
    if (this.ariaLabelledBy()) {
      return null;
    }
    return this.ariaLabel() || null;
  });

  readonly ariaLabelledByAttr = computed(() => {
    return this.ariaLabelledBy() || null;
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
