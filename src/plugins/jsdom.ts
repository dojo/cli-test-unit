import * as jsdom from 'jsdom';

declare const global: any;

declare global {
	interface Window {
		CustomEvent: typeof CustomEvent;
		CSSStyleDeclaration: typeof CSSStyleDeclaration;
	}
}

intern.registerPlugin('jsdom', () => {
	function createDom() {
		return new jsdom.JSDOM(
			`
<!DOCTYPE html>
<html>
<head></head>
<body></body>
<html>`,
			{
				pretendToBeVisual: true,
				runScripts: 'dangerously'
			} as any
		);
	}

	function globalizeDom(dom: jsdom.JSDOM) {
		global.window = dom.window;
		const doc = (global.document = global.window.document);
		global.DOMParser = global.window.DOMParser;
		global.Element = global.window.Element;

		Object.defineProperty(
			window.CSSStyleDeclaration.prototype,
			'transition',
			Object.getOwnPropertyDescriptor((<any>window).CSSStyleDeclaration.prototype, 'webkitTransition')!
		);

		return doc;
	}

	if (!('document' in global)) {
		const dom = createDom();
		globalizeDom(dom);
	}

	return {
		createDom,
		jsdom,
		globalizeDom
	};
});
