import Helpers from './helpers';
import randtoken from "rand-token";
import Validator from 'better-validator';
import _ from 'lodash';

const errors = {
	'0010': 'language code §§LangCode not found',
	'1000': 'wrong user name',
	'1001': 'wrong password',
	'1002': 'token not found',
	'1100': 'list §§ID not found',
	'1101': 'list §§ID count not valid',
	'1102': 'list §§ID no columns found',
	'1200': 'form §§ID not found',
	'1201': 'form §§ID no fields found',
}


class Module extends Helpers {

	_error(nr, values) {
		let message = errors[nr];
		_.each(values, (value, name) => {
			let re = new RegExp(name, 'g');
			message.replace(re, value);
		});
		return {'nr': nr, 'message': message};
	}

}

module.exports = Module;
