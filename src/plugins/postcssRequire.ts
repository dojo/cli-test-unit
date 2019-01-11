import Node from 'intern/lib/executors/Node';

declare const intern: Node;

const PLUGIN_NAME = 'postcss-node';

intern.registerPlugin(PLUGIN_NAME, (options: any = {}) => {
	const hook = require('css-modules-require-hook');
	hook(options);
});
