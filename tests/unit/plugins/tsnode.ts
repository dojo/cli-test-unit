import { SinonStub, sandbox, SinonSandbox } from 'sinon';
import * as mockery from 'mockery';
import MockModule from '../../support/MockModule';

const { beforeEach, afterEach, describe, it } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');

describe('plugins/tsnode', () => {
	let mockModule: MockModule;
	let registerStub: SinonStub;
	let registerPluginStub: SinonStub;
	let sinon: SinonSandbox;

	function assertRegisterPlugin() {
		assert.strictEqual(registerPluginStub.callCount, 1);
		const callback = registerPluginStub.lastCall.args[1];
		assert.strictEqual(registerStub.callCount, 0);
		assert.isFunction(callback);

		return callback;
	}

	beforeEach((test) => {
		if (intern.environment !== 'node') {
			test.skip('postcssRequirePlugin only runs in a node environment');
		} else {
			sinon = sandbox.create();

			registerStub = sinon.stub();
			mockModule = new MockModule('../../../src/plugins/tsnode', require);
			mockery.registerMock('ts-node', { register: registerStub });
			registerPluginStub = sinon.stub(intern, 'registerPlugin');
			mockModule.getModuleUnderTest();
		}
	});

	afterEach(() => {
		sinon.restore();
		mockModule.destroy();
	});

	it('plugin loads without options', () => {
		const callback = assertRegisterPlugin();

		callback();

		assert.strictEqual(registerStub.callCount, 1);
		assert.lengthOf(registerStub.lastCall.args, 0);
	});
});
