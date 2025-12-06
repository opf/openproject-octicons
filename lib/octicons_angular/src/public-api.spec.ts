import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  PlusIconComponent,
  plusIconData,
  OpBcfIconComponent,
  opBcfIconData,
  LogIconComponent,
  logIconData,

  toDOMString,
} from './public-api';

describe('Github native icon', () => {
  let component: PlusIconComponent;
  let fixture: ComponentFixture<PlusIconComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({imports: [PlusIconComponent]}).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlusIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should render the svg', () => {
    const iconElement: HTMLElement = fixture.nativeElement;
    expect(iconElement.children[0].tagName.toLowerCase()).toEqual('path');
    expect(iconElement.children[0].getAttribute('d')).toBeTruthy();
  });

  it('should render the title', () => {
    const iconElement: HTMLElement = fixture.nativeElement;
    expect(iconElement.children[0].tagName.toLowerCase()).toEqual('path');

    fixture.componentRef.setInput('title', 'Some title');
    fixture.detectChanges();

    expect(iconElement.children[0].tagName.toLowerCase()).toEqual('title');
    expect(iconElement.children[1].tagName.toLowerCase()).toEqual('path');
    expect(iconElement.children[1].getAttribute('d')).toBeTruthy();
  });

  it('should export the SVG data', () => {
    expect(plusIconData).toBeDefined();
    expect(plusIconData['24']).toBeDefined();
    expect(plusIconData['24'].paths.length).toEqual(1);
  });
});

describe('OpenProject extension icon', () => {
  let component: OpBcfIconComponent;
  let fixture: ComponentFixture<OpBcfIconComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({imports: [OpBcfIconComponent]}).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpBcfIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should render the svg', () => {
    const iconElement: HTMLElement = fixture.nativeElement;
    expect(iconElement.children[0].tagName.toLowerCase()).toEqual('path');
    expect(iconElement.children[0].getAttribute('d')).toBeTruthy();
    expect(iconElement.children[1].tagName.toLowerCase()).toEqual('path');
    expect(iconElement.children[1].getAttribute('d')).toBeTruthy();
    expect(iconElement.children[2].tagName.toLowerCase()).toEqual('path');
    expect(iconElement.children[2].getAttribute('d')).toBeTruthy();
  });

  it('should export the SVG data', () => {
    expect(opBcfIconData).toBeDefined();
    expect(opBcfIconData['16']).toBeDefined();
    expect(opBcfIconData['16'].paths.length).toEqual(3);
  });
});

describe('rendering without Angular', () => {
  it('should render the SVG', () => {
    const rendered = toDOMString(logIconData);
    expect(rendered).toContain('<svg');
    expect(rendered).toContain(`<path d="${logIconData[24].paths[0]}"></path>`);
    expect(rendered).toContain('</svg>');
  });

  it('should render the small SVG', () => {
    const rendered = toDOMString(logIconData, 'small');
    expect(rendered).toContain('<svg');
    expect(rendered).toContain(`<path d="${logIconData[16].paths[0]}"></path>`);
    expect(rendered).toContain('</svg>');
  });

  it('should render the SVG attributes', () => {
    const rendered = toDOMString(logIconData, 'medium', { extra: '1' });
    expect(rendered).toContain('<svg');
    expect(rendered).toContain('extra="1"');
    expect(rendered).toContain(`<path d="${logIconData[24].paths[0]}"></path>`);
    expect(rendered).toContain('</svg>');
  });
});

describe('ARIA attributes', () => {
  let component: PlusIconComponent;
  let fixture: ComponentFixture<PlusIconComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({imports: [PlusIconComponent]}).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlusIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should not render aria-label when undefined', () => {
    fixture.detectChanges();

    const iconElement: HTMLElement = fixture.nativeElement;
    expect(iconElement.getAttribute('aria-label')).toBeNull();
  });

  it('should render aria-label when set to non-empty value', () => {
    fixture.componentRef.setInput('aria-label', 'Add item');
    fixture.detectChanges();

    const iconElement: HTMLElement = fixture.nativeElement;
    expect(iconElement.getAttribute('aria-label')).toEqual('Add item');
  });

  it('should not render aria-labelledby when undefined', () => {
    fixture.detectChanges();

    const iconElement: HTMLElement = fixture.nativeElement;
    expect(iconElement.getAttribute('aria-labelledby')).toBeNull();
  });

  it('should render aria-labelledby when set to non-empty value', () => {
    fixture.componentRef.setInput('aria-labelledby', 'my-label-id');
    fixture.detectChanges();

    const iconElement: HTMLElement = fixture.nativeElement;
    expect(iconElement.getAttribute('aria-labelledby')).toEqual('my-label-id');
  });

  it('should not render id when undefined', () => {
    fixture.detectChanges();

    const iconElement: HTMLElement = fixture.nativeElement;
    expect(iconElement.getAttribute('id')).toBeNull();
  });

  it('should render id when set to non-empty value', () => {
    fixture.componentRef.setInput('id', 'my-icon-id');
    fixture.detectChanges();

    const iconElement: HTMLElement = fixture.nativeElement;
    expect(iconElement.getAttribute('id')).toEqual('my-icon-id');
  });

  it('should set aria-hidden to false when aria-label is set', () => {
    fixture.componentRef.setInput('aria-label', 'Add item');
    fixture.detectChanges();

    const iconElement: HTMLElement = fixture.nativeElement;
    expect(iconElement.getAttribute('aria-hidden')).toEqual('false');
  });

  it('should set aria-hidden to true when neither aria-label nor aria-labelledby is set', () => {
    fixture.detectChanges();

    const iconElement: HTMLElement = fixture.nativeElement;
    expect(iconElement.getAttribute('aria-hidden')).toEqual('true');
  });

  it('should set aria-hidden to false when aria-labelledby is set', () => {
    fixture.componentRef.setInput('aria-labelledby', 'my-label-id');
    fixture.detectChanges();

    const iconElement: HTMLElement = fixture.nativeElement;
    expect(iconElement.getAttribute('aria-hidden')).toEqual('false');
  });

  it('should prefer aria-labelledby over aria-label when both are provided', () => {
    fixture.componentRef.setInput('aria-label', 'Add item');
    fixture.componentRef.setInput('aria-labelledby', 'my-label-id');
    fixture.detectChanges();

    const iconElement: HTMLElement = fixture.nativeElement;
    expect(iconElement.getAttribute('aria-labelledby')).toEqual('my-label-id');
    expect(iconElement.getAttribute('aria-label')).toBeNull();
    expect(iconElement.getAttribute('aria-hidden')).toEqual('false');
  });

  it('should not render aria-label or aria-labelledby when aria-hidden is true', () => {
    // aria-hidden is true when both aria-label and aria-labelledby are not set
    fixture.detectChanges();

    const iconElement: HTMLElement = fixture.nativeElement;
    expect(iconElement.getAttribute('aria-hidden')).toEqual('true');
    expect(iconElement.getAttribute('aria-label')).toBeNull();
    expect(iconElement.getAttribute('aria-labelledby')).toBeNull();
  });

  it('should not render aria-label when set to empty string', () => {
    fixture.componentRef.setInput('aria-label', '');
    fixture.detectChanges();

    const iconElement: HTMLElement = fixture.nativeElement;
    expect(iconElement.getAttribute('aria-label')).toBeNull();
    expect(iconElement.getAttribute('aria-hidden')).toEqual('true');
  });

  it('should not render aria-labelledby when set to empty string', () => {
    fixture.componentRef.setInput('aria-labelledby', '');
    fixture.detectChanges();

    const iconElement: HTMLElement = fixture.nativeElement;
    expect(iconElement.getAttribute('aria-labelledby')).toBeNull();
    expect(iconElement.getAttribute('aria-hidden')).toEqual('true');
  });

  it('should treat empty string aria-label same as undefined', () => {
    fixture.componentRef.setInput('aria-label', '');
    fixture.detectChanges();

    const iconElement: HTMLElement = fixture.nativeElement;
    expect(iconElement.getAttribute('aria-label')).toBeNull();
    expect(iconElement.getAttribute('aria-hidden')).toEqual('true');
  });

  it('should treat empty string aria-labelledby same as undefined', () => {
    fixture.componentRef.setInput('aria-labelledby', '');
    fixture.detectChanges();

    const iconElement: HTMLElement = fixture.nativeElement;
    expect(iconElement.getAttribute('aria-labelledby')).toBeNull();
    expect(iconElement.getAttribute('aria-hidden')).toEqual('true');
  });
});

describe('tabindex attribute', () => {
  let component: PlusIconComponent;
  let fixture: ComponentFixture<PlusIconComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({imports: [PlusIconComponent]}).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlusIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should not render tabindex when undefined', () => {
    fixture.detectChanges();

    const iconElement: HTMLElement = fixture.nativeElement;
    expect(iconElement.getAttribute('tabindex')).toBeNull();
  });

  it('should render tabindex when set using tabindex alias', () => {
    fixture.componentRef.setInput('tabindex', 0);
    fixture.detectChanges();

    const iconElement: HTMLElement = fixture.nativeElement;
    expect(iconElement.getAttribute('tabindex')).toEqual('0');
  });

  it('should render tabindex when set to positive value', () => {
    fixture.componentRef.setInput('tabindex', 1);
    fixture.detectChanges();

    const iconElement: HTMLElement = fixture.nativeElement;
    expect(iconElement.getAttribute('tabindex')).toEqual('1');
  });

  it('should render tabindex when set to negative value', () => {
    fixture.componentRef.setInput('tabindex', -1);
    fixture.detectChanges();

    const iconElement: HTMLElement = fixture.nativeElement;
    expect(iconElement.getAttribute('tabindex')).toEqual('-1');
  });
});
