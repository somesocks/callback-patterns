
function Node(this : any, val ? : any) {
	var self = this instanceof Node ? this : Object.create(Node.prototype);

	self.val = val;
	self.prev = self;

	return self;
}

function Queue(this : any) {
	var self = this instanceof Queue ? this : Object.create(Queue.prototype);

	self._tail = Node();
	self._head = self._tail;
	self._length = 0;

	return self;
}

Queue.prototype.push = function push(val) {
	if (this._length === 0) {
		this._head.val = val;
	} else {
		var node = Node(val);
		this._head.prev = node;
		this._head = node;
	}
	this._length++;
	return this;
};

Queue.prototype.pop = function pop() {
	var val = this._tail.val;
	this._tail = this._tail.prev;
	this._length = this._length > 0 ? this._length - 1 : 0;
	if (this._length === 0) {
		this._tail.val = undefined;
	}
	return val;
};

Queue.prototype.length = function length() {
	return this._length;
};

Queue.prototype.empty = function empty() {
	this._tail = Node();
	this._head = this._tail;
	this._length = 0;
	return this;
};

export = Queue;
