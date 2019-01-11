import { sandbox, SinonSandbox, SinonStub } from 'sinon';
import MockModule from '../../support/MockModule';
import global from '@dojo/framework/shim/global';
import * as mockery from 'mockery';

const { beforeEach, afterEach, describe, it } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');

describe('plugins/jsdom', () => {
	let mockModule: MockModule;
	let registerPluginStub: SinonStub;
	let hasAddStub: SinonStub;
	let hasExistsStub: SinonStub;
	let sinon: SinonSandbox;

	function assertRegisterPlugin() {
		assert.strictEqual(registerPluginStub.callCount, 1);
		const callback = registerPluginStub.lastCall.args[1];
		assert.isFunction(callback);

		return callback;
	}

	beforeEach((test) => {
		if (global.window) {
			delete global.window;
		}
		if (intern.environment !== 'node') {
			test.skip('postcssRequirePlugin only runs in a node environment');
		} else {
			sinon = sandbox.create();

			hasAddStub = sinon.stub();
			hasExistsStub = sinon.stub();
			mockModule = new MockModule('../../../src/plugins/jsdom', require);
			mockery.registerMock('@dojo/framework/has/has', { add: hasAddStub, exists: hasExistsStub });
			registerPluginStub = sinon.stub(intern, 'registerPlugin');
			mockModule.getModuleUnderTest();
		}
	});

	afterEach(() => {
		sinon.restore();
		mockModule.destroy();
	});

	it('returns jsdom properties', () => {
		const callback = assertRegisterPlugin();
		const artifacts = callback();

		assert.isFunction(artifacts.createDom);
		assert.isFunction(artifacts.globalizeDom);
		assert(artifacts.jsdom);
	});

	describe('createDom', () => {
		it('creates a new Dom', () => {
			const callback = assertRegisterPlugin();
			const { createDom } = callback();
			const dom: any = createDom();

			assert.isDefined(dom);
			assert.isDefined(dom.window);
		});
	});
});
