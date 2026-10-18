import { parseDateSpans, delimiters, visibleEra, type HoloceneTimestampParserOptions, type TextEdit } from 'holocene-timestamp-parser';
import { createTimestamp } from './render';

const blocks = new Set(['ADDRESS', 'ARTICLE', 'ASIDE', 'BLOCKQUOTE', 'BODY', 'DD', 'DETAILS', 'DIV', 'DL', 'DT', 'FIGCAPTION', 'FIGURE', 'FOOTER', 'FORM', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'HEADER', 'HR', 'LI', 'MAIN', 'NAV', 'OL', 'P', 'PRE', 'SECTION', 'TABLE', 'TBODY', 'TD', 'TH', 'THEAD', 'TIME', 'TR', 'UL']);
const excluded = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'TEXTAREA', 'INPUT', 'SELECT', 'OPTION', 'BUTTON', 'CODE', 'PRE', 'KBD', 'SAMP', 'SVG', 'MATH', 'CANVAS', 'IFRAME', 'OBJECT']);
interface Source { node: Text; start: number; end: number; text: string }
interface Operation { start: number; end: number; make: () => Node; priority?: number }
interface Segment { start: number; end: number; sourceStart: number; sourceEnd: number; identity: boolean }
interface Rendered { source: Text; text: string; output: HTMLElement; visible?: string; segments?: Segment[] }

/** Incremental processing with original-text bookkeeping; page-owned elements stay in place. */
export class PageConverter {
  private pending = new Set<Element>();
  private generated = new WeakMap<Node, Rendered>();
  private original = new WeakMap<Text, Rendered>();
  private observer: MutationObserver;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private stopped = false;
  private document: Document;

  constructor(private root: HTMLElement, private options: HoloceneTimestampParserOptions) {
    this.document = root.ownerDocument;
    this.observer = new this.document.defaultView!.MutationObserver(records => this.changes(records));
  }

  start(): void { this.stopped = false; this.observe(); this.enqueue(this.root); }
  stop(): void { this.stopped = true; this.observer.disconnect(); clearTimeout(this.timer); this.timer = undefined; this.pending.clear(); }
  private observe(): void { if (!this.stopped) this.observer.observe(this.root, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['hidden', 'style', 'class', 'contenteditable', 'role', 'aria-hidden', 'datetime'] }); }

  private boundary(element: Element): Element {
    let node = element;
    while (node.parentElement && node !== this.root && !blocks.has(node.tagName)) node = node.parentElement;
    return node;
  }

  private changes(records: MutationRecord[]): void {
    for (const record of records) {
      let element = record.target.nodeType === 1 ? record.target as Element : record.target.parentElement;
      // Frameworks may update text inside our output instead of their original text node.
      for (let ancestor = element; ancestor && ancestor !== this.root; ancestor = ancestor.parentElement) {
        const rendered = this.generated.get(ancestor);
        if (rendered) {
          if (record.type === 'attributes' || rendered.output.textContent === rendered.visible) { element = null; break; }
          // Keep the untouched source dates when a framework edits another part of our text.
          if (rendered.source.data === '') rendered.source.data = this.updatedSource(rendered);
          this.original.delete(rendered.source);
          this.generated.delete(rendered.output);
          element = rendered.source.parentElement;
          rendered.output.remove();
          break;
        }
      }
      if (element) this.enqueue(this.boundary(element));
    }
  }

  private updatedSource(rendered: Rendered): string {
    const current = rendered.output.textContent ?? '', previous = rendered.visible;
    if (previous === undefined || !rendered.segments?.length) return current;
    let start = 0, end = previous.length, currentEnd = current.length;
    while (start < end && start < currentEnd && previous[start] === current[start]) start++;
    while (end > start && currentEnd > start && previous[end - 1] === current[currentEnd - 1]) { end--; currentEnd--; }
    const first = rendered.segments.find(segment => start < segment.end) ?? rendered.segments[rendered.segments.length - 1];
    const last = [...rendered.segments].reverse().find(segment => end > segment.start) ?? first;
    const sourceStart = first.identity ? first.sourceStart + Math.max(0, start - first.start) : first.sourceStart;
    const sourceEnd = last.identity ? last.sourceStart + Math.max(0, end - last.start) : last.sourceEnd;
    const visibleStart = first.identity ? start : first.start, visibleEnd = last.identity ? end : last.end;
    const replacement = current.slice(visibleStart, current.length - (previous.length - visibleEnd));
    return rendered.text.slice(0, sourceStart) + replacement + rendered.text.slice(sourceEnd);
  }

  private enqueue(element: Element): void {
    if (this.stopped || !this.root.contains(element) && element !== this.root) return;
    this.pending.add(element);
    this.timer ??= setTimeout(() => this.flush(), 0);
  }

  /** Flush a bounded batch. Exposed for deterministic integration tests. */
  flush(): void {
    clearTimeout(this.timer); this.timer = undefined;
    if (this.stopped) return;
    this.changes(this.observer.takeRecords());
    this.observer.disconnect();
    const started = performance.now();
    try {
      while (this.pending.size && performance.now() - started < 8) {
        const element = this.pending.values().next().value as Element;
        this.pending.delete(element);
        if (element === this.root || this.root.contains(element)) this.process(element);
      }
    } finally {
      this.observe();
      if (this.pending.size) this.timer ??= setTimeout(() => this.flush(), 0);
    }
  }

  private hidden(element: Element): boolean {
    if (excluded.has(element.tagName) || element.hasAttribute('hidden') || element.getAttribute('aria-hidden') === 'true'
      || element.matches('[contenteditable]:not([contenteditable="false"]), [role="textbox"], .bday, .dday, .dtstart, .dtend')) return true;
    const style = this.document.defaultView!.getComputedStyle(element);
    return style.display === 'none' || style.visibility === 'hidden' || style.visibility === 'collapse';
  }

  private process(root: Element): void {
    // Return page-owned source text before a region is edited or hidden.
    for (let parent: Element | null = root; parent; parent = parent.parentElement) if (this.hidden(parent)) { this.restore(root); return; }
    let run: Text[] = [];
    const finish = () => { if (run.length) this.convert(run, root.closest('time') !== null); run = []; };
    const visit = (parent: Element) => {
      for (const child of Array.from(parent.childNodes)) {
        const output = this.generated.get(child);
        if (output) { child.parentNode?.removeChild(child); continue; }
        if (child.nodeType === 3) {
          const text = child as Text, previous = this.original.get(text);
          if (previous) {
            if (text.data === '') text.data = previous.text;
            this.original.delete(text);
          }
          if (text.data) run.push(text);
        } else if (child.nodeType === 1) {
          const element = child as Element;
          // Citation numbers are preserved in the page, but are not part of the date expression.
          if (element.matches('sup.reference, sup.mw-ref')) { this.restore(element); continue; }
          // Defer known blocks before querying styles, so discovering a large article stays cheap.
          if (blocks.has(element.tagName)) { finish(); this.enqueue(element); continue; }
          if (this.hidden(element) || element.tagName === 'BR') { finish(); this.restore(element); continue; }
          const display = this.document.defaultView!.getComputedStyle(element).display;
          if (/^(block|flex|grid|table|list-item)/.test(display)) {
            finish(); this.enqueue(element);
          } else visit(element);
        }
      }
    };
    visit(root); finish();
  }

  private restore(root: Element): void {
    for (const child of Array.from(root.childNodes)) {
      if (this.generated.has(child)) {
        this.generated.delete(child); child.parentNode?.removeChild(child);
      } else if (child.nodeType === 3) {
        const text = child as Text, previous = this.original.get(text);
        if (previous) { if (text.data === '') text.data = previous.text; this.original.delete(text); }
      } else if (child.nodeType === 1) this.restore(child as Element);
    }
  }

  private convert(nodes: Text[], dateContext: boolean): void {
    let text = '';
    const sources: Source[] = nodes.map(node => {
      const start = text.length; text += node.data;
      return { node, start, end: text.length, text: node.data };
    });
    const dates = parseDateSpans(text, { dateContext });
    if (!dates.length) return;
    const operations = new Map<Text, Operation[]>();
    const external: Array<{ anchor: Element; source: Source; make: () => Node; before: boolean }> = [];
    const add = (node: Text, op: Operation) => operations.set(node, [...(operations.get(node) ?? []), op]);
    const plain = (value: string, italic = false): Node => {
      if (!italic) return this.document.createTextNode(value);
      const element = this.document.createElement('i'); element.textContent = value; return element;
    };
    const insert = (at: number, make: () => Node, priority = 0) => {
      const source = sources.find(s => at > s.start && at <= s.end) ?? sources.find(s => at === s.start);
      if (source) add(source.node, { start: at - source.start, end: at - source.start, make, priority });
    };
    const edit = (replacement: TextEdit) => {
      let first = true;
      for (const source of sources) {
        if (replacement.start >= source.end || replacement.end <= source.start) continue;
        const value = first ? (this.options.removeHE ? replacement.text.replace(/ HE\b/g, '') : replacement.text) : '';
        add(source.node, {
          start: Math.max(replacement.start, source.start) - source.start,
          end: Math.min(replacement.end, source.end) - source.start,
          make: () => /\b(?:BHE|HE)\b/.test(value)
            ? createTimestamp(this.document, { holocene: value, era: null }, { ...this.options, insertBetween: 'NOTHING' }, !source.node.parentElement?.closest('a'))
            : plain(value, !!value && this.options.styleHETimestamp === 'ITALIC'),
        });
        first = false;
      }
    };
    for (const date of dates) {
      if (!this.options.replaceTimestamp) {
        const before = this.options.insertLocation === 'BEFORE';
        const at = before ? date.start : date.end;
        const source = sources.find(s => at > s.start && at <= s.end) ?? sources[0];
        const anchor = source.node.parentElement?.closest('a');
        const make = () => {
          const fragment = this.document.createDocumentFragment();
          if (!before) fragment.append(' ');
          fragment.append(createTimestamp(this.document, date, this.options));
          if (before) fragment.append(' ');
          return fragment;
        };
        // Put annotations beside existing links so the HE link keeps its own destination.
        if (anchor) external.push({ anchor, source, make, before });
        else insert(at, make, before ? -2 : 2);
      } else {
        for (const replacement of date.edits) edit(replacement);
        const [open, close] = delimiters(this.options), era = visibleEra(date.era, this.options);
        if (open) insert(date.start, () => plain(open, this.options.styleHETimestamp === 'ITALIC'), -2);
        if (close || era) {
          const source = sources.find(s => date.end > s.start && date.end <= s.end)!;
          const anchor = source.node.parentElement?.closest('a');
          const make = () => {
            const fragment = this.document.createDocumentFragment();
            if (era) fragment.append(createTimestamp(this.document, { ...date, holocene: '', era: date.era }, { ...this.options, insertBetween: 'NOTHING' }));
            if (close) fragment.append(plain(close, this.options.styleHETimestamp === 'ITALIC'));
            return fragment;
          };
          if (anchor && era && this.options.linkHE) external.push({ anchor, source, make, before: false });
          else insert(date.end, make, 2);
        }
      }
    }
    for (const source of sources) {
      const list = operations.get(source.node);
      if (!list) continue;
      const output = this.document.createElement('span');
      output.setAttribute('data-het', '');
      let cursor = 0, position = 0;
      const segments: Segment[] = [];
      const append = (value: Node | string, sourceStart: number, sourceEnd: number, identity: boolean) => {
        const length = typeof value === 'string' ? value.length : (value.textContent?.length ?? 0);
        if (length) segments.push({ start: position, end: position + length, sourceStart, sourceEnd, identity });
        output.append(value); position += length;
      };
      const appendOriginal = (start: number, end: number) => {
        if (start === end) return;
        const italic = this.options.replaceTimestamp && this.options.styleHETimestamp === 'ITALIC';
        const cuts = italic ? [...new Set([start, end, ...dates.flatMap(date => [date.start - source.start, date.end - source.start]).filter(at => at > start && at < end)])].sort((a, b) => a - b) : [start, end];
        for (let index = 1; index < cuts.length; index++) {
          const a = cuts[index - 1], b = cuts[index];
          const styled = italic && dates.some(date => a + source.start >= date.start && b + source.start <= date.end);
          append(plain(source.text.slice(a, b), styled), a, b, true);
        }
      };
      for (const op of list.sort((a, b) => a.start - b.start || (a.priority ?? 0) - (b.priority ?? 0))) {
        appendOriginal(cursor, op.start);
        append(op.make(), op.start, op.end, false); cursor = op.end;
      }
      appendOriginal(cursor, source.text.length);
      const rendered: Rendered = { source: source.node, text: source.text, output, visible: output.textContent ?? '', segments };
      this.original.set(source.node, rendered); this.generated.set(output, rendered);
      source.node.data = '';
      source.node.after(output);
    }
    const lastAfter = new Map<Element, Node>();
    for (const operation of external) {
      const output = this.document.createElement('span'); output.setAttribute('data-het', ''); output.append(operation.make());
      this.generated.set(output, { source: operation.source.node, text: operation.source.text, output, visible: output.textContent ?? '' });
      if (operation.before) operation.anchor.before(output);
      else { (lastAfter.get(operation.anchor) ?? operation.anchor).parentNode!.insertBefore(output, (lastAfter.get(operation.anchor) ?? operation.anchor).nextSibling); lastAfter.set(operation.anchor, output); }
    }
  }
}
