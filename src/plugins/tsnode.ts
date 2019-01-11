import * as tsnode from 'ts-node';

intern.registerPlugin('ts-node', (options?: any) => {
	tsnode.register();
});
