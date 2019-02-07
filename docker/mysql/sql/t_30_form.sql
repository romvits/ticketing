USE ticketing_db;

DROP TABLE IF EXISTS `t_form`;
CREATE TABLE `t_form` (
  `form_id` VARCHAR(32) NOT NULL COMMENT 'unique id of the form - will be a auto generated 32 character string',
  `table` VARCHAR(100) NOT NULL COMMENT 'the name of the table or the view from where data will be feched',
  `pk` VARCHAR(100) NOT NULL DEFAULT 'id' COMMENT 'which field is the PK field in this table? (default = id) OR (record_id)',
  `json` JSON NULL COMMENT 'json configuration string for the form, information like fields and so on',
  PRIMARY KEY (`form_id`))
ENGINE = MyISAM DEFAULT CHARSET=UTF8MB4;

INSERT INTO `t_form` (`form_id`,`table`,`pk`,`json`) VALUES ('mock_form','t_mock_data','id','{
"fields": [{"name":"gender"},{"name":"first_name"},{"name":"last_name"}],
"title": "mock_form",
"formData": [{
    "type": "settings",
    "position": "label-left",
    "labelWidth": 130,
    "inputWidth": 120
}, {
    "type": "fieldset",
    "label": "Welcome",
    "inputWidth": 340,
    "list": [{
        "type": "radio",
        "name": "type",
        "label": "Already have account",
        "labelWidth": "auto",
        "position": "label-right",
        "checked": true,
        "list": [{
            "type": "input",
            "label": "Login",
            "value": "p_rossi"
        }, {
            "type": "password",
            "label": "Password",
            "value": "123"
        }, {
            "type": "checkbox",
            "label": "Remember me",
            "checked": true
        }]
    }, {
        "type": "radio",
        "name": "type",
        "label": "Not registered yet",
        "labelWidth": "auto",
        "position": "label-right",
        "list": [{
            "type": "input",
            "label": "Full Name",
            "value": "Patricia D. Rossi"
        }, {
            "type": "input",
            "label": "E-mail Address",
            "value": "p_rossi@example.com"
        }, {
            "type": "input",
            "label": "Login",
            "value": "p_rossi"
        }, {
            "type": "password",
            "label": "Password",
            "value": "123"
        }, {
            "type": "password",
            "label": "Confirm Password",
            "value": "123"
        }, {
            "type": "checkbox",
            "label": "Subscribe on news"
        }]
    }, {
        "type": "radio",
        "name": "type",
        "label": "Guest login",
        "labelWidth": "auto",
        "position": "label-right",
        "list": [{
            "type": "select",
            "label": "Account type",
            "options": [{
                "text": "Admin",
                "value": "admin"
            }, {
                "text": "Organiser",
                "value": "org"
            }, {
                "text": "Power User",
                "value": "poweruser"
            }, {
                "text": "User",
                "value": "user"
            }]
        }, {
            "type": "checkbox",
            "label": "Show logs window"
        }]
    }]
}]}');
