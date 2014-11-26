Laborationsrapport
==================

Säkerhetshål hittade
--------------------
#### Ej parametriserade sql-frågor
Detta kan leda till att elaka användare kan använda sig av SQL-injections för att hacka användarkonton och sabotera databasen.
Detta är åtgärdat då implementationen nu har parametriserade SQL-frågor. 
   
#### Lösenord i klartext i databasen
Om det skulle uppstå en databasläcka så skulle man få tag på användarnas lösenord.
Detta skulle i sin tur leda till att användarna kan få fler konton kapade om de använder samma lösenord där.
Jag har åtgärdat detta genom att hasha lösenordet i databasen.

#### Inget skydd mot CSRF
Detta kan leda till att användare som blir lurade att trycka på en länk som gör ett request som vilket i labben skulle kunna leda till
att det sker en POST av ett meddelande i det requestet.
Jag har åtgärdat detta med Synchronizer Token Pattern.

#### Ingen utloggning utan bara redirect
När man klickar på logga ut så sker det egentligen ingen utloggning utan det är en redirect till inloggningsformuläret.
Detta leder till att sessionen lever kvar och användaren är fortfarande inloggad.
Åtgärdat med "dödning" av sessionen.

#### Inmatning av scripttaggar tillåts i namn och meddelandefälten
Detta kan leda till att elaka användare kan skicka in skadlig kod.
Den skadliga koden kan leda bl.a. leda till att användarens kakor blir stulna genom cross-site scripting.
Åtgärdat genom borttagning av taggar.
    
#### "Ekar" ut felmeddelande från PDO-Exceptions
Detta kan leda till att användare får information om databasens struktur så som namn på databas, tabeller och kolumner.
Med hjälp av denna informationen kan elaka användare ge sig på att sabotera databasen och kapa användarkonton.
Åtgärdat genom att returnera false istället när ett undantag kastas.


Optimering
----------
Skolan verkar blockera FTP-anslutning till webbhotellet vilket gör att följande tester sker lokalt och tidsmätningen känns då onödig.

#### styling-attribut i HTML flyttad till css-fil
Man vill inte ha syling-attribut i HTML då det går långsammare att ladda sidan då.
kurslitteraturen tar upp detta i kapitel 8.


#### Minskning av requests
Man vill alltid försöka att minska antalet requests för snabbare laddning av sidan vilket kurslitteraturen tar upp i kapitel 1.
kurslitteraturen tar också upp att man ska ta bort dubbla inlänkningar av script i kapitel 12.
Jag hittade dubbla inlänkningar av scriptfiler och även oanvända filer som hämtades. Dessa har jag tagit bort.

antalet requests innan: 13, nu 9.
antal KB innan 719, nu 715.

reflektion: det är nu tre mindre resurser som requestas men det blev ingen större skillnad på storleken då det inte var några större filer som togs bort.

Man skulle kunna minska antalet requests ännu mer genom användning av CSS-sprites och ihopslganing av css- och
javascriptfiler som sedan minifieras

#### Placering av script-taggar placerade längst ner i bodyn
Genom att placera scrip-taggarna längst ner på sidan så laddas själva sidan in först vilket leder till att anävndaren upplever att det går snabbare.
laddningstiden och storleken blir den samma som innan vilket är väntat då det är samma filer som laddas in, men i en annan ordning.
kurslitteraturen tar upp detta i kapitel 6.

#### Minifiering av JQUERY och bootstrap
Jag har läkat in de minifierade filerna av jquery och bootstrap och har även bara länkat in det som faktiskt används i
bootstrap-filen alltså form och button.

Vid minifiering tas allt onödigt bort vilket leder till mindre filer och det går då snabbare att ladda in de filerna.
kurslitteraturen tar upp minifiering i kapitel 10.
antal KB innan 715, nu 163.

reflektion: Här blev det en väldigt stor skillnad på storleken vilket var ganska väntat då bootstrap och jquery filerna(ej minifierade)
är väldigt stora stora.


Long-Polling
------------
När sidan är färdigladdad körs funktionen init i MessageBoard.js som triggar igång "meddelandelyssnaren".
Meddelandelyssnaren kallar i sin tur på funktionen getNewMessages i MessageHandler.js och skickar med en callback-funktion.
getNewMessages gör ett ajax-anrop till servern där bl.a. följande data-attribut skickas med:
"numberOfMessages" som innehåler hur många meddelanden det finns på klienten och "lastTime" som innehåller tiden på det nyaste meddelandet som finns på klienten.

Servern fångar in data-attributen och startar sedan e while-loop som varar i tjugo sekunder. Det första som händer i loopen är att meddelandena från databasen hämtas ut
och sedan sparas tiden på det nyaste meddelandet ner i en variabel. Denna variabeln jämförs sedan med tiden på det nyaste meddelandet på klienten om tiden är den samma i
dessa variablerna finns det inga nya medddelanden om de skulle skilja sig från varandra finns det nya meddelanden.

Om det finns nya meddelanden jämförs det hur många meddelanden det finns på klienten och hur många det finns i databasen med hjälp av den skillnaden bestäms hur många
nya meddelanden det finns. Eftersom jag i min SQL-fråga väljer att sortera på nyaste meddelanden först och jag vet hur många nya meddelanden det finns så kan jag här lägga
till meddelanden från position noll - antal nya meddelanden från arrayen som ges som svar från databasen i en ny array som sedan skickas ut till klienten.

Om klienten har fått nya meddelanden anropas callbacken med de nya meddelandena som argument. De nya meddelandena renderas sedan ut.
När anropet är klart görs ett nytt.

#### Fördelar

#### Nackdelar





