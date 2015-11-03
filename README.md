# hubit copartying rest nodejs

## Doporučené zdroje
- https://nodejs.org/documentation/
- http://expressjs.com/
- http://www.sitepoint.com/creating-restful-apis-express-4/
- https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4
- http://rethinkdb.com/docs/

## Instalace

1. nainstalujte node js - https://nodejs.org/download/
2. stáhněte si tento repozitář
3. v něm pak spustěte `npm install`
4. server se spouští příkazem `npm start`
5. to, že node server běží je možné ověřit příkazem `curl http://127.0.0.1:8080/api/v1`
6. funkční jsou dvě operace
  * `GET /coparties` - vrací seznam všech coparty  
  * `POST /coparties` - slouží k vytvoření coparty. Očekává json s obsahem viz soubor data.json

## RethinkDB
Připravená instalace rethinkdb na serveru `46.28.108.92`. Dostupné i webové rozhraní `http://46.28.108.92:8080`. Příprava pro použití [thinky.io](https://thinky.io/) - ORM pro RethinkDB. V souboru coparty.js připraven model pro coparty.
