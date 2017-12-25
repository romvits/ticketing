export default class Socket {

	constructor(config) {
		this.config = config;
	}

	received(socket) {
		/*
		let nick = socket.handshake.query.nick;
		let currentUser = {
			id: socket.id,
			nick: nick
		};

		if (findIndex(users, currentUser.id) > -1) {
			log.msg('info', 'User ID is already connected, kicking.');
			socket.disconnect();
		} else if (!validNick(currentUser.nick)) {
			socket.disconnect();
		} else {
			console.log('[INFO] User ' + currentUser.nick + ' connected!');
			sockets[currentUser.id] = socket;
			users.push(currentUser);
			io.emit('userJoin', {nick: currentUser.nick});
			console.log('[INFO] Total users: ' + users.length);
		}

		socket.on('ding', () => {
			socket.emit('dong');
		});

		socket.on('disconnect', () => {
			if (findIndex(users, currentUser.id) > -1) users.splice(findIndex(users, currentUser.id), 1);
			console.log('[INFO] User ' + currentUser.nick + ' disconnected!');
			socket.broadcast.emit('userDisconnect', {nick: currentUser.nick});
		});

		socket.on('userChat', (data) => {
			let _nick = sanitizeString(data.nick);
			let _message = sanitizeString(data.message);
			let date = new Date();
			let time = ("0" + date.getHours()).slice(-2) + ("0" + date.getMinutes()).slice(-2);

			console.log('[CHAT] [' + time + '] ' + _nick + ': ' + _message);
			socket.broadcast.emit('serverSendUserChat', {nick: _nick, message: _message});
		});
		*/
	}
};