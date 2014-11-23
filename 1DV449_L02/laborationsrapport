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
