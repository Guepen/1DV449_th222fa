# Rapport Jobbsök

### Inledning

    Under projekttiden har jag utvecklat en applikation som jag har valt att kalla för Jobbsök.
    Idén till den här applikationen fick jag när jag var inne på Arbetsförmedlingen och skulle 
    söka efter lediga jobb på skojs skull men tyckte då att det var krångligt och allmänt bökigt. 
     
    Jag ville skapa en användarvänlig applikation där användaren på ett enkelt sätt skulle kunna 
    söka efter lediga jobb och få reda på mer information om företaget genom att använda Eniros API.
    
#### Liknande Applikationer
[Jobbsafari](http://www.jobbsafari.se/)
[Monster](http://www.monster.se/?disRe=true)
    
Schematisk Bild
---------------
![Bild](http://yuml.me/5b0a07b9)

Serversida
-----------
    På serversidan har jag valt PHP som programmeringsspråk då det känndes som ett lämpligt språk för 
    det här projektet med tanke på tidigare erfarenheter. Jag kände också att jag ville utveckla min 
    kunskap inom PHP för att bli bättre på att behärska språket.
    Jag har använt mig av ett template-ramverk för att rendera ut HTML-koden dels för att det blir mycket
    snyggare och enklare men också för att testa på något nytt som man har nytta för i framtiden.
    
### API-Anrop
    Klienten gör ajax-anrop mot servern och skickar med nödvänig data.
    Controllern fångar upp ajax-anropet och med hjälp av medskickad data
     bestäms vilken funktion i webservicen som skall köras.
    Jag har två webserivce-klasser, en för Arbetsförmedlingen och en för Eniro.
    I dessa klasserna använder jag mig av ett bibliotek som heter Requests för att göra http-anrop mot API:erna
    om API:et svarar returneras det svaret, annars null.
    
### Cachning
    Jag har använt mig av MySql databas för att cachca mitt data på servern och koden följer
    designmönstret Repository Pattern.
    Om jag får Ett svar från API:et så sparar jag ner det nödvändiga datat och skickar med en 
    timestamp med värdet för när datat anses vara ofräscht. 
    Jag har valt att cacha län, kommuner och yrkesområden i en vecka då dessa förmodligen aldrig kommer att
    ändras men det kan ju ske en uppdatering.
    Jobben har jag valt att cacha i en timme så man slipper vänta för länge  på att få se nyinkomna jobb.
     
     
### Felhantering
    Om jag inte får något svar från mitt API returneras NULL från webservicen till service-klassen. 
    Service-klassen i sin tur kollar om svaret är null och om väntat data finns. 
    Om väntat data inte finns returnas ett JSON-svar med error: true som klienten 
    sedan fångar upp och presenterar ett felmeddelande till användaren.
    
    För att inte min applikation ska krascha om ett fel inträffar när man gör ett anrop mot databasen 
    har jag valt att bara lägga en try- cactch runt koden. 
    Här vill jag inte låta användaren få reda på att ett fel har skett.
    
    Om jag inte får någon data från databsen returneras null och ett anrop mot API:et görs istället. 
    

Klientsida
----------
    På klienten har mitt största fokus legat då Javascript har blivit något av ett favoritspråk och 
    jag ser fortfarande stora utvecklingsmöjligheter hos mig själv.
    jag har använt mig native javascript och i största mån, JQuery.
    Jag har försök att jobba på ett objektorienterat sätt med konstruktorfunktioner
    och funktioner som läggs på prototypen
    
### Server-anrop
    Från min klient gör jag AJAX-anrop mot servern för att hämta data i JSON-format.
    För att få rätt svar skickar jag med data som servern som fångar upp för att 
    sedan avgöra vilket data som skall hämtas.
    Om svaret inte går att tolka som JSON körs en error-funktion som renderar ut 
    ett lämpligt felmeddelande till användaren.
    Även andra fel kan inträffa, t.ex. så svarar servern med ett JSON-svar innehållandes bool för att 
    berätta att fel har inträffat och även då renderas ett lämpligt felmeddelande till klienten.
    
### Cachning
    Ett cache manifest används för att cacha statiska filer som js och css.
    På klienten har jag valt att spara gjorda jobbsökningar i Session Storage.
    Detta valde jag att göra dels eftersom man då slipper att kolla om datat 
    är fräscht eller inte och i så fall även ta det bort det.
    Datat i Session Storage finns nämligen bara kvar så länge sessionen lever.
    
##### Hämtning av data
    När data behövs hämtas görs först en koll i Session Storage om efterfrågat data finns.
    Om det finns skickas det ut till användaren annars görs ett anrop mot servern.
    
#### Sparande av Data
    När sidan laddas renderas tillgängliga län ut till användaren som också sparas.
    Sedan beroende på vad användaren gör för val så sparas all den data som användaren har efterfrågat

#### Reflektion   
    En annan lösning är t.ex. att spara ner data i Local Storage vilket har fördelen att datat finns
    kvar även om användaren stänger ner webbläsaren och återkommer vid ett senare tillfälle.
    Jag, personligen som användare skulle dock inte vilja att "massa" data sparas ner i Local Storage.
    Men en lösning på det skulle kunna vara att man låter användaren välja om det är 
    ok att applikationen sparar data i Local Storage men p.ga. fokus på annat i applikationen blev 
    den smidigaste lösningen just, Session Storage.
    
### Säkerhet och prestandaoptimering

#### Parametriserade SQL-frågor
 * Jag har parametriserat alla min SQL-frågor för att vara säker på att ingen extern SQL-kod körs. 
    * Jag har inga input-fält så användare kan inte injecta något men det skulle kunna vara någon som har manipulerat
    något av API:erna och skjutit in SQL-kod där som jag sedan försöker spara ner i databasen.
    
#### Borttagning av eventuella taggar
    Jag använder mig av PHPs strip_tags funktion som kollar efter och tar bort alla hittade taggar i en sträng.

#### Jag anävnder mig CDN när jag länkar in Bootsraps css-filer och JQuery.
    
* Filerna hämtas från en annan server än ens egna.
* Om användaren t.ex. redan har besökt en sida som använder sig av dessa filer så behöves de inte hämtas
  igen då dom redan finns i användarens cache.
* CDN tillåter även browsern att ladda in flera filer samtidigt.

#### Minifiering och obfuskering
 * Jag har minifierat och obfuskerat mina js-filer och lagt allt i samma fil vilket skyndar på inladdningen då storleken
  på filen blir väldigt liten. 
       
#### Inläkning av scriptfiler
 * Scriptfiler länkas in sist i bodyn så att sidan kan laddas in först så användaren upplever att det går snabbare att ladda in sidan.
 
#### Cache Manifest
 * Jag har gjort ett cache manifest där statiska filer länkas in så de sparas i appcachen och slipper hämtas från servern.
 
### Offline-first
    Jag började med att undersöka navigator.onLine som anses vara en standardiserad lösning 
    för att undersöka om klienten är online.
    Det visade sig dock att den inte verkar vara så säker att använda då den undersöker
    om datorn har någon anslutning till ett nätverk. Tänk t.ex. om användaren har en anslutning
    till en router men den i sin tur inte kan kommunicera vidare ut.
    
    Det intressanta här är ju egentligen om man kan nå servern eller inte.
    Jag valde därför att polla min server efter en
    mycket liten JSON-fil var tredje sekund.
    Om klienten inte får något svar på tre sekunder anses klienten var offline och 
    applikation hamnar då i offline-läge.
    
    I offline-läget kollas det om det finns några jobb sparade Session Storage om det finns
    visas en lista på dessa jobb som man kan klicka sig in på och man ser då mer information om valt jobb. 
    
    Om det inte finns några jobb presenteras det man inte har visat några jobb innan och att man får
    vänta tills anslutningen har återupprättats. 
    
    Om Servern svarar igen och man tittar på ett jobb i offline-läge behålls den sidan och
    en box renderas att man har anslutning igen och kan göra nya sökningar.
    
### Risker med min applikation

 * Något av mina använda API:er kan gå ner
    * Man kan aldrig lita på att ett API alltid fungerarar. Den kan uppstå ett temporärt fel, API:et kan bytas ut mot ett nyttt
      eller bara ändras.
      
 * Personuppgiftslagen 
    * Från Arbetsförmedlingens API får jag personuppgifter som jag renderar ut. Jag kan inte vara helt säker på att 
    Arbetsförmedlingen följer de lagar som finns när det gäller personuppgifter.
 
 
### Betygshöjande

 * Responsiv desing som anpassar sig efter olika enheter.
 * Användarvänligt
 * Användning av templates för att bryta ut HTML-koden från PHP. Det är även något jag inte har prvoat på innan.
 * Testbar kod
    * Serversidan
        * Klasser implmenterar interface som dependency injectas i konstruktorerna vilket gör att man kan skapa testklasser
        * Objektorienterat(för det mesta... inte hunnit med att skapa klasser för allt te.x. Province, County)
    *Klientsidan
        * "Objektorienterat" (javascript är prototypbaserat)
        * Testbara funktioner för det mesta
 * Kodkvalitén överlag håller ett bra mått
 
### Reflektion

    Projektet har överlag gått bra även om jag har gjort det lite svårt för mig ibland. I databasen har
    jag fem tabeller och jag hade en tanke om att bara ha ett repository innehållandes endast en find, add
    och remove men detta visade sig bli mycket krångligt och inte alls lika rent som jag hade tänkt mig.
    Lyckades inte uppnå det helt heller utan jag borde haft en klass för varje tabell istället.
    
    I början hade jag även massa tankar om testdrivet arbete både på klientsidan och serversidan men insåg snart
    att det skulle vara omöjligt att hinna med då jag aldrig ens har provat på att göra tester först och
    sedan kod och att jag hade ett projekt till att göra. Lägg därpå till jul och nyårsfirande och
    det blir inte mycket tid kvar.
    
    Jag hade även tankar om man skulle kunna söka jobb efter sökord och sedan även kunna filtrera ut de
    datat men det har det verkligen inte funnits tid för. 
    
    
    Jag är trots detta någorlunda nöjd med projektets resultat och applikationen känns stabil och 
    designen känns användarevänlig. Om jag hade tagit lite mindre ledigt under jul hade det förmodligen
    blivit bättre kod som tyvärr har blivit lite lidande....
    