let obj = {
	a: 1,
	b: '2',
	c: [3, '4'],
	d: {
		5: 6,
		7: '8'
	}
}

delete obj.a;

let e = obj.d;

delete obj.d;

console.log('e', e);

console.log('obj', obj);