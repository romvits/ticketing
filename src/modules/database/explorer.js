import EventEmitter from 'events';

class Explorer extends EventEmitter {
	constructor(pool, client) {
		super();
		try {
			const request = pool.request();
			const result = request.query('select * from fe_mnu', (err, result) => {
				client.send(result);
			});
		} catch (err) {
			//console.error('SQL error', err);
			return false;
		}
	}
}

module.exports = Explorer;
