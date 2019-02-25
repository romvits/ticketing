function cryptPassword(password) {
	return (md5(sha256(password)));
}