
import Queue from './_queue';

import { assert } from 'chai';

describe('_queue', () => {
	it('queue works', () => {
		const queue = Queue();

		assert(queue.length() === 0);
		queue.push(1);
		assert(queue.length() === 1);
		queue.push(2);
		assert(queue.length() === 2);
		queue.push(3);
		assert(queue.length() === 3);

		assert(queue.pop() === 1);
		assert(queue.length() === 2);
		assert(queue.pop() === 2);
		assert(queue.length() === 1);
		assert(queue.pop() === 3);
		assert(queue.length() === 0);
		assert(queue.pop() === undefined);
		assert(queue.length() === 0);
	});

	it('queue performance', () => {
		const queue = Queue();

		const start = Date.now();
		let rounds = 0;

		while (Date.now() - start < 1000) {
			for (let i = 0; i < 1000; i++) {
				queue.push(1);
			}
			for (let i = 0; i < 1000; i++) {
				queue.pop(1);
			}
			rounds += 1000;
		}

		const end = Date.now();

		console.log(`${rounds} in ${end - start}ms: ${(rounds * 1000.0) / (end - start)} rounds/sec`);
	});
});
