USE ticketing_db;

CREATE VIEW viewLang AS
SELECT
	Lang.LangCode,
    Country.CountryDE AS de,
    Country.CountryEN AS en
FROM feLang Lang
INNER JOIN feCountry Country
ON Lang.LangCode = Country.CountryLangCode
