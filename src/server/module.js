import Helpers from './helpers';
import randtoken from "rand-token";
import Validator from 'better-validator';
import _ from 'lodash';

const errors = {
	'1000':'wrong user name',
	'1001':'wrong password',
	'1002':'token not found',
}


class Module extends Helpers {

	_error(nr) {
		return {'nr': nr, 'message': errors[nr]};
	}

}

module.exports = Module;
