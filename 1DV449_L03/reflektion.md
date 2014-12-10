Reflektion Laboration 3
=======================

Anpassning och krav för API:erna
--------------------------------

- Materialet som tillhandahålls via Sveriges Radios API får inte användas på ett sådant sätt att det skulle kunna skada deras 
  oberoende eller trovärdighet.
  
- Man får en copyrightsträng i JSON-svaret vilken jag använder för att tala om att datat kommer ifrån dom. 
  Jag hittar inga krav för att detta måste användas men jag tycker det är schysst att tala om vems data man använder.
  
- För att få tillgång till google maps API så måste man skaffa en API-nyckel. Detta för att hålla koll på antal 
  requests som ens tjänst gör. Om man kommer upp i MÅNGA requests så kommer man att faktueras.
  
Cachning
-------

- Jag har valt att cacha mitt data från Sveriges Radio i fem minuter för att hålla nere mina request. Fem minuter 
  känns lagom då då datat inte uppdateras allt för ofta men om det har skett en uppdatering så ska man inte behöva vänta
  på den nya informationen. Jag hade först en tanke att kolla cache-control i response-headern men denna visade sig
  var privat.
  
- När det kommer till caching och google så verkar dom vara ganska känsliga. Jag har därför "safeat" och låter google 
  själva ta hand om den biten vilket dom gör ganska bra.
  
Risker med applikationen
-------------------------

  - Något av API:erna kan gå ner vilket skulle innebära att man kan få olika fel-koder eller tomma svar.
    Detta har jag tagit hand om och renderar ett felmeddelande om detta skulle inträffa.
  
Säkerhet
--------
  - Någon kan ha manipulerat datat man får som svar t.ex. kan någon ha skjutit in ett script eller liknande.
    Jag har valt att undersöka om meddelande-arrayen finns i svaret. Om den inte finns renderas ett felmeddalnde.
    Jag väljer också att skriva ut allt data som text genom textContent för att vara säker på att inga script exekveras.
    
Optimering
----------
  - Jag anävnder mig CDN när jag länkar in css och javascript.
    Detta är en stor fördel om användaren t.ex. redan har besökt en sida som använder sig av dessa med filer så
    behöver inte dessa laddas in då dom redan finns i användarens cache.
    CDN tillåter även browsern att ladda in flera filer samtidigt.
    
  - Jag har minifierat och obfuskerat mina js-filer och lagt allt i samma fil vilket skyndar på inladdningen. 
  
  - Script-filer länkas in sist i bodyn. 
  
  - Jag valde att inte minifiera min egna css-fil då denna bara är på 700 B.
    

  
  