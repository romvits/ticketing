function cryptPassword(UserPassword) {
	return (md5(sha256(UserPassword)));
}


