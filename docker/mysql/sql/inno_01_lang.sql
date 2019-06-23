USE ticketing_db;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `feLangCode`;

CREATE TABLE `feLangCode` (
    `LangCode` VARCHAR(5) NOT NULL COMMENT 'unique available language code https://www.metamodpro.com/browser-language-codes',
    `LangNameEnglish` VARCHAR(30), 
    PRIMARY KEY (`LangCode`))
ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;
INSERT INTO `feLangCode` VALUES 
('af','Afrikaans'),
('hr','Croatian'),
('el','Greek'),
('pl','Polish'),
('sx','Sutu'),
('sq','Albanian'),
('cs','Czech'),
('gu','Gujurati'),
('pt','Portuguese'),
('sw','Swahili'),
('ar','Arabic (Standard)'),
('da','Danish'),('ht','Haitian'),('pt-br','Portuguese (Brazil)'),('sv','Swedish'),('ar-dz','Arabic (Algeria)'),('nl','Dutch (Standard)'),('he','Hebrew'),('pa','Punjabi'),('sv-fi','Swedish (Finland)'),('ar-bh','Arabic (Bahrain)'),('nl-be','Dutch (Belgian)'),('hi','Hindi'),('pa-in','Punjabi (India)'),('sv-sv','Swedish (Sweden)'),('ar-eg','Arabic (Egypt)'),('en','English'),('hu','Hungarian'),('pa-pk','Punjabi (Pakistan)'),('ta','Tamil'),('ar-iq','Arabic (Iraq)'),('en-au','English (Australia)'),('is','Icelandic'),('qu','Quechua'),('tt','Tatar'),('ar-jo','Arabic (Jordan)'),('en-bz','English (Belize)'),('id','Indonesian'),('rm','Rhaeto-Romanic'),('te','Teluga'),('ar-kw','Arabic (Kuwait)'),('en-ca','English (Canada)'),('iu','Inuktitut'),('ro','Romanian'),('th','Thai'),('ar-lb','Arabic (Lebanon)'),('en-ie','English (Ireland)'),('ga','Irish'),('ro-mo','Romanian (Moldavia)'),('tig','Tigre'),('ar-ly','Arabic (Libya)'),('en-jm','English (Jamaica)'),('it','Italian (Standard)'),('ru','Russian'),('ts','Tsonga'),('ar-ma','Arabic (Morocco)'),('en-nz','English (New Zealand)'),('it-ch','Italian (Switzerland)'),('ru-mo','Russian (Moldavia)'),('tn','Tswana'),('ar-om','Arabic (Oman)'),('en-ph','English (Philippines)'),('ja','Japanese'),('sz','Sami (Lappish)'),('tr','Turkish'),('ar-qa','Arabic (Qatar)'),('en-za','English (South Africa)'),('kn','Kannada'),('sg','Sango'),('tk','Turkmen'),('ar-sa','Arabic (Saudi Arabia)'),('en-tt','English (Trinidad & Tobago)'),('ks','Kashmiri'),('sa','Sanskrit'),('uk','Ukrainian'),('ar-sy','Arabic (Syria)'),('en-gb','English (United Kingdom)'),('kk','Kazakh'),('sc','Sardinian'),('hsb','Upper Sorbian'),('ar-tn','Arabic (Tunisia)'),('en-us','English (United States)'),('km','Khmer'),('ur','Urdu'),('ar-ae','Arabic (U.A.E.)'),('en-zw','English (Zimbabwe)'),('ky','Kirghiz'),('sd','Sindhi'),('ve','Venda'),('ar-ye','Arabic (Yemen)'),('eo','Esperanto'),('tlh','Klingon'),('si','Singhalese'),('vi','Vietnamese'),('et','Estonian'),('ko','Korean'),('sr','Serbian'),('vo','Volapuk'),('hy','Armenian'),('fo','Faeroese'),('ko-kp','Korean (North Korea)'),('sk','Slovak'),('wa','Walloon'),('as','Assamese'),('ko-kr','Korean (South Korea)'),('sl','Slovenian'),('cy','Welsh'),('ast','Asturian'),('fj','Fijian'),('la','Latin'),('so','Somani'),('xh','Xhosa'),('az','Azerbaijani'),('fi','Finnish'),('lv','Latvian'),('sb','Sorbian'),('ji','Yiddish'),('eu','Basque'),('fr','French (Standard)'),('lt','Lithuanian'),('es','Spanish'),('zu','Zulu'),('fr-be','French (Belgium)'),('lb','Luxembourgish'),('es-ar','Spanish (Argentina)'),('be','Belarusian'),('fr-ca','French (Canada)'),('mk','FYRO Macedonian'),('es-bo','Spanish (Bolivia)'),('bn','Bengali'),('fr-fr','French (France)'),('ms','Malay'),('es-cl','Spanish (Chile)'),('bs','Bosnian'),('fr-lu','French (Luxembourg)'),('ml','Malayalam'),('es-co','Spanish (Colombia)'),('br','Breton'),('fr-mc','French (Monaco)'),('mt','Maltese'),('es-cr','Spanish (Costa Rica)'),('bg','Bulgarian'),('fr-ch','French (Switzerland)'),('mi','Maori'),('es-do','Spanish (Dominican Republic)'),('my','Burmese'),('fy','Frisian'),('mr','Marathi'),('es-ec','Spanish (Ecuador)'),('ca','Catalan'),('fur','Friulian'),('mo','Moldavian'),('es-sv','Spanish (El Salvador)'),('ch','Chamorro'),('gd','Gaelic (Scots)'),('nv','Navajo'),('es-gt','Spanish (Guatemala)'),('ce','Chechen'),('gd-ie','Gaelic (Irish)'),('ng','Ndonga'),('es-hn','Spanish (Honduras)'),('zh','Chinese'),('gl','Galacian'),('ne','Nepali'),('es-mx','Spanish (Mexico)'),('zh-hk','Chinese (Hong Kong)'),('ka','Georgian'),('no','Norwegian'),('es-ni','Spanish (Nicaragua)'),('zh-cn','Chinese (PRC)'),('de','German (Standard)'),('nb','Norwegian (Bokmal)'),('es-pa','Spanish (Panama)'),('zh-sg','Chinese (Singapore)'),('de-at','German (Austria)'),('nn','Norwegian (Nynorsk)'),('es-py','Spanish (Paraguay)'),('zh-tw','Chinese (Taiwan)'),('de-de','German (Germany)'),('oc','Occitan'),('es-pe','Spanish (Peru)'),('cv','Chuvash'),('de-li','German (Liechtenstein)'),('or','Oriya'),('es-pr','Spanish (Puerto Rico)'),('co','Corsican'),('de-lu','German (Luxembourg)'),('om','Oromo'),('es-es','Spanish (Spain)'),('cr','Cree'),('de-ch','German (Switzerland)'),('fa','Persian'),('es-uy','Spanish (Uruguay)'),('fa-ir','Persian/Iran'),('es-ve','Spanish (Venezuela)');

DROP TABLE IF EXISTS `feLang`;
CREATE TABLE `feLang` (
    `LangCode` VARCHAR(5) NOT NULL COMMENT 'unique available language code https://www.metamodpro.com/browser-language-codes',
    `LangSortOrder` TINYINT(3) UNSIGNED, 
    PRIMARY KEY (`LangCode`))
ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

INSERT INTO `feLang`  VALUES ('de', 1),('de-at', 4),('de-de', 3),('de-ch', 5),('en', 2),('en-gb', 6),('en-us', 7);

SET FOREIGN_KEY_CHECKS = 1;
