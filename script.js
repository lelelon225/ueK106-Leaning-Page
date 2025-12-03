// State management
const state = {
    expandedModule: null,
    completedTasks: {},
    userAnswers: {},
    showSolution: {},
    currentFilter: 'all'
};

// Module data with LB1 and LB2 content
const modules = [
    // ============ LB1 MODULES ============
    {
        id: 'db-creation',
        title: 'Datenbank und Schema erstellen',
        icon: 'database',
        color: 'blue',
        lb: 'lb1',
        tasks: [
            {
                id: 'create-db',
                title: 'Datenbank erstellen',
                question: 'Schreibe ein SQL-Statement, um eine Datenbank namens "firma_db" zu erstellen.',
                hint: 'Verwende CREATE DATABASE',
                solution: 'CREATE DATABASE firma_db;',
                explanation: 'Mit CREATE DATABASE wird eine neue Datenbank erstellt. Der Name sollte aussagekräftig sein.'
            },
            {
                id: 'create-schema',
                title: 'Schema erstellen',
                question: 'Erstelle ein Schema namens "personal" in der Datenbank.',
                hint: 'Verwende CREATE SCHEMA',
                solution: 'CREATE SCHEMA personal;',
                explanation: 'Schemas helfen, Datenbankobjekte logisch zu organisieren.'
            }
        ]
    },
    {
        id: 'sql-scripts',
        title: 'SQL-Scripts ausführen',
        icon: 'code',
        color: 'green',
        lb: 'lb1',
        tasks: [
            {
                id: 'exec-script',
                title: 'Script ausführen',
                question: 'Wie führst du ein SQL-Script namens "setup.sql" in PostgreSQL aus?',
                hint: 'Verwende \\i im psql oder psql -f',
                solution: '\\i setup.sql\nODER\npsql -d firma_db -f setup.sql',
                explanation: 'Im psql Terminal verwendet man \\i, von der Kommandozeile psql -f'
            }
        ]
    },
    {
        id: 'tables',
        title: 'Erstellen und Anpassen von Tabellen',
        icon: 'database',
        color: 'purple',
        lb: 'lb1',
        tasks: [
            {
                id: 'create-table',
                title: 'Tabelle erstellen',
                question: 'Erstelle eine Tabelle "mitarbeiter" mit den Spalten: id (INT, Primary Key), name (VARCHAR(100)), abteilung_id (INT, Foreign Key)',
                hint: 'Verwende CREATE TABLE mit PRIMARY KEY und FOREIGN KEY Constraints',
                solution: `CREATE TABLE mitarbeiter (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    abteilung_id INT,
    FOREIGN KEY (abteilung_id) REFERENCES abteilung(id)
);`,
                explanation: 'SERIAL erstellt automatisch eine Auto-Increment ID.  PRIMARY KEY definiert den Primärschlüssel.'
            },
            {
                id: 'rename-table',
                title: 'Tabelle umbenennen',
                question: 'Benenne die Tabelle "mitarbeiter" in "employees" um.',
                hint: 'Verwende ALTER TABLE ...  RENAME TO',
                solution: 'ALTER TABLE mitarbeiter RENAME TO employees;',
                explanation: 'ALTER TABLE RENAME TO ändert den Namen einer existierenden Tabelle.'
            },
            {
                id: 'rename-column',
                title: 'Spalte umbenennen',
                question: 'Benenne die Spalte "name" in "vollname" um.',
                hint: 'Verwende ALTER TABLE ...  RENAME COLUMN',
                solution: 'ALTER TABLE employees RENAME COLUMN name TO vollname;',
                explanation: 'RENAME COLUMN ändert den Spaltennamen ohne die Daten zu beeinflussen.'
            },
            {
                id: 'change-type',
                title: 'Spaltentyp ändern',
                question: 'Ändere den Typ der Spalte "vollname" zu VARCHAR(200).',
                hint: 'Verwende ALTER TABLE ... ALTER COLUMN ...  TYPE',
                solution: 'ALTER TABLE employees ALTER COLUMN vollname TYPE VARCHAR(200);',
                explanation: 'ALTER COLUMN TYPE ändert den Datentyp.  PostgreSQL konvertiert die Daten wenn möglich.'
            },
            {
                id: 'add-pk',
                title: 'Primary Key hinzufügen',
                question: 'Füge einen Primary Key zur Spalte "email" in der Tabelle "users" hinzu.',
                hint: 'Verwende ALTER TABLE ...  ADD PRIMARY KEY',
                solution: 'ALTER TABLE users ADD PRIMARY KEY (email);',
                explanation: 'ADD PRIMARY KEY definiert nachträglich einen Primärschlüssel.'
            },
            {
                id: 'remove-fk',
                title: 'Foreign Key entfernen',
                question: 'Entferne einen Foreign Key Constraint namens "fk_abteilung".',
                hint: 'Verwende ALTER TABLE ... DROP CONSTRAINT',
                solution: 'ALTER TABLE employees DROP CONSTRAINT fk_abteilung;',
                explanation: 'DROP CONSTRAINT entfernt einen benannten Constraint.'
            },
            {
                id: 'fk-cascade',
                title: 'Foreign Key mit CASCADE (Referential Actions)',
                question: 'Erstelle einen Foreign Key mit ON DELETE CASCADE und ON UPDATE CASCADE.',
                hint: 'Füge ON DELETE CASCADE und ON UPDATE CASCADE hinzu',
                solution: `ALTER TABLE employees 
ADD CONSTRAINT fk_abteilung 
FOREIGN KEY (abteilung_id) 
REFERENCES abteilung(id) 
ON DELETE CASCADE 
ON UPDATE CASCADE;`,
                explanation: 'CASCADE bewirkt, dass Änderungen/Löschungen in der Elterntabelle auf Kindtabellen übertragen werden.'
            }
        ]
    },
    {
        id: 'data-manipulation',
        title: 'Dateninhalt anpassen',
        icon: 'edit',
        color: 'yellow',
        lb: 'lb1',
        tasks: [
            {
                id: 'insert-data',
                title: 'Datensätze hinzufügen',
                question: 'Füge einen Mitarbeiter mit id=1, name="Max Mustermann", abteilung_id=5 ein.',
                hint: 'Verwende INSERT INTO',
                solution: `INSERT INTO employees (id, vollname, abteilung_id) 
VALUES (1, 'Max Mustermann', 5);`,
                explanation: 'INSERT INTO fügt neue Datensätze ein.  Spaltennamen können optional angegeben werden.'
            },
            {
                id: 'update-data',
                title: 'Datensätze ändern',
                question: 'Ändere die abteilung_id von "Max Mustermann" auf 7.',
                hint: 'Verwende UPDATE ...  SET ...  WHERE',
                solution: `UPDATE employees 
SET abteilung_id = 7 
WHERE vollname = 'Max Mustermann';`,
                explanation: 'UPDATE ändert existierende Datensätze.  WHERE ist wichtig, sonst werden ALLE Zeilen geändert!'
            },
            {
                id: 'delete-data',
                title: 'Datensätze löschen',
                question: 'Lösche alle Mitarbeiter mit abteilung_id = 5.',
                hint: 'Verwende DELETE FROM ...  WHERE',
                solution: `DELETE FROM employees 
WHERE abteilung_id = 5;`,
                explanation: 'DELETE FROM löscht Datensätze.  Ohne WHERE werden ALLE Zeilen gelöscht!'
            }
        ]
    },
    {
        id: 'import',
        title: 'Datenimport aus CSV',
        icon: 'upload',
        color: 'indigo',
        lb: 'lb1',
        tasks: [
            {
                id: 'import-csv-comma',
                title: 'CSV Import mit Komma-Delimiter',
                question: 'Importiere Daten aus "mitarbeiter.csv" (Komma-getrennt) in die Tabelle employees.',
                hint: 'Verwende COPY ...  FROM ... WITH (FORMAT csv, DELIMITER \',\')',
                solution: `COPY employees (vollname, abteilung_id)
FROM '/pfad/zu/mitarbeiter.csv'
WITH (FORMAT csv, HEADER true, DELIMITER ',');`,
                explanation: 'COPY FROM importiert Daten effizient.  HEADER true überspringt die erste Zeile.  DELIMITER gibt das Trennzeichen an.'
            },
            {
                id: 'import-csv-semicolon',
                title: 'CSV Import mit Semikolon-Delimiter',
                question: 'Importiere Daten aus "daten.csv" (Semikolon-getrennt).',
                hint: 'Verwende DELIMITER \';\'',
                solution: `COPY employees (vollname, abteilung_id)
FROM '/pfad/zu/daten.csv'
WITH (FORMAT csv, HEADER true, DELIMITER ';');`,
                explanation: 'In Europa werden CSVs oft mit Semikolon statt Komma getrennt.  Das Delimiter muss entsprechend angepasst werden.'
            }
        ]
    },
    {
        id: 'export',
        title: 'Datenexport und Dumps',
        icon: 'download',
        color: 'red',
        lb: 'lb1',
        tasks: [
            {
                id: 'dump-schema',
                title: 'Dump eines Schemas erstellen',
                question: 'Erstelle einen Dump des Schemas "personal" in die Datei "backup.sql".',
                hint: 'Verwende pg_dump mit -n für Schema',
                solution: 'pg_dump -d firma_db -n personal -f backup.sql',
                explanation: 'pg_dump erstellt Backups. -n spezifiziert das Schema, -f die Ausgabedatei.'
            },
            {
                id: 'dump-no-privileges',
                title: 'Dump ohne Privilegien',
                question: 'Erstelle einen Dump ohne Berechtigungen (Grants).',
                hint: 'Verwende --no-privileges oder -x',
                solution: 'pg_dump -d firma_db --no-privileges -f backup.sql',
                explanation: '--no-privileges verhindert, dass GRANT/REVOKE Statements im Dump enthalten sind.'
            },
            {
                id: 'dump-inserts',
                title: 'Dump mit INSERT Statements',
                question: 'Erstelle einen Dump mit INSERT Statements anstelle von COPY.',
                hint: 'Verwende --inserts oder --column-inserts',
                solution: 'pg_dump -d firma_db --inserts -f backup.sql',
                explanation: '--inserts verwendet INSERT Statements, die portabler aber langsamer sind als COPY.'
            }
        ]
    },
    {
        id: 'users',
        title: 'Benutzermanagement und Berechtigungen',
        icon: 'users',
        color: 'pink',
        lb: 'lb1',
        tasks: [
            {
                id: 'role-vs-user',
                title: 'Unterschied Rolle vs.  User',
                question: 'Was ist der Unterschied zwischen einer Rolle und einem User in PostgreSQL?',
                hint: 'In PostgreSQL sind beide sehr ähnlich.. .',
                solution: 'In PostgreSQL sind Roles und Users identisch. Eine Role mit LOGIN ist praktisch ein User.',
                explanation: 'Eine ROLE ohne LOGIN ist eine Gruppe.  Eine ROLE mit LOGIN ist ein User.'
            },
            {
                id: 'create-role',
                title: 'Rolle erstellen',
                question: 'Erstelle eine Rolle namens "entwickler" ohne Login-Berechtigung.',
                hint: 'Verwende CREATE ROLE',
                solution: 'CREATE ROLE entwickler;',
                explanation: 'CREATE ROLE erstellt eine Rolle ohne LOGIN-Recht, ideal für Gruppenberechtigungen.'
            },
            {
                id: 'create-user',
                title: 'Benutzer erstellen',
                question: 'Erstelle einen Benutzer "hans" mit Passwort "geheim123".',
                hint: 'Verwende CREATE USER oder CREATE ROLE ...  WITH LOGIN',
                solution: `CREATE USER hans WITH PASSWORD 'geheim123';
-- ODER
CREATE ROLE hans WITH LOGIN PASSWORD 'geheim123';`,
                explanation: 'CREATE USER ist ein Alias für CREATE ROLE WITH LOGIN.'
            },
            {
                id: 'local-access',
                title: 'Nur lokaler Zugang',
                question: 'Wie konfigurierst du, dass "hans" nur lokal (nicht remote) zugreifen kann?',
                hint: 'Bearbeite pg_hba.conf',
                solution: `In pg_hba.conf:
# Nur lokale Verbindung für hans
local   all   hans   md5
# Keine remote Verbindung (keine host Zeile für hans)`,
                explanation: 'pg_hba.conf steuert, von wo sich User verbinden dürfen.  local = nur Unix Socket.'
            },
            {
                id: 'remote-access',
                title: 'Remote Zugang erlauben',
                question: 'Erlaube "hans" Zugriff von IP 192.168.1.50.',
                hint: 'Füge eine host Zeile in pg_hba.conf hinzu',
                solution: `In pg_hba.conf:
host   firma_db   hans   192.168.1.50/32   md5`,
                explanation: 'host erlaubt TCP/IP Verbindungen. /32 bedeutet exakt diese IP.'
            },
            {
                id: 'grant-permissions',
                title: 'Berechtigungen erteilen',
                question: 'Gib "hans" SELECT und INSERT Rechte auf die Tabelle "employees".',
                hint: 'Verwende GRANT',
                solution: 'GRANT SELECT, INSERT ON employees TO hans;',
                explanation: 'GRANT erteilt Berechtigungen.  Man kann einzelne oder mehrere Rechte vergeben.'
            },
            {
                id: 'revoke-permissions',
                title: 'Berechtigungen entziehen',
                question: 'Entziehe "hans" das INSERT Recht auf "employees".',
                hint: 'Verwende REVOKE',
                solution: 'REVOKE INSERT ON employees FROM hans;',
                explanation: 'REVOKE entzieht spezifische Berechtigungen von einem User/Rolle.'
            },
            {
                id: 'grant-role',
                title: 'Rolle zuweisen',
                question: 'Weise dem User "hans" die Rolle "entwickler" zu.',
                hint: 'Verwende GRANT Rolle TO User',
                solution: 'GRANT entwickler TO hans;',
                explanation: 'Rollen können anderen Rollen/Users zugewiesen werden, um Berechtigungen zu erben.'
            }
        ]
    },
    
    // ============ LB2 MODULES ============
    {
        id: 'select-queries',
        title: 'SELECT Abfragen',
        icon: 'search',
        color: 'teal',
        lb: 'lb2',
        tasks: [
            {
                id: 'select-basic',
                title: 'Einfache SELECT Abfrage',
                question: 'Wähle alle Spalten aus der Tabelle "employees".',
                hint: 'Verwende SELECT * FROM',
                solution: 'SELECT * FROM employees;',
                explanation: 'SELECT * wählt alle Spalten aus.  FROM gibt die Tabelle an.'
            },
            {
                id: 'select-label',
                title: 'Spalten explizit beschriften',
                question: 'Wähle die Spalte "vollname" aus und benenne sie als "Mitarbeiter Name".',
                hint: 'Verwende AS für Aliase',
                solution: `SELECT vollname AS "Mitarbeiter Name" 
FROM employees;`,
                explanation: 'AS erstellt einen Alias für die Spalte.  Anführungszeichen erlauben Leerzeichen im Namen.'
            },
            {
                id: 'select-sort',
                title: 'Sortieren',
                question: 'Wähle alle Mitarbeiter und sortiere sie nach Namen aufsteigend.',
                hint: 'Verwende ORDER BY',
                solution: `SELECT * FROM employees 
ORDER BY vollname ASC;`,
                explanation: 'ORDER BY sortiert die Ergebnisse. ASC = aufsteigend, DESC = absteigend.'
            },
            {
                id: 'select-limit',
                title: 'Ergebnisse begrenzen',
                question: 'Wähle die ersten 10 Mitarbeiter aus.',
                hint: 'Verwende LIMIT',
                solution: 'SELECT * FROM employees LIMIT 10;',
                explanation: 'LIMIT begrenzt die Anzahl der zurückgegebenen Zeilen.'
            },
            {
                id: 'select-where',
                title: 'Einträge filtern',
                question: 'Wähle alle Mitarbeiter aus der Abteilung mit abteilung_id = 5.',
                hint: 'Verwende WHERE',
                solution: `SELECT * FROM employees 
WHERE abteilung_id = 5;`,
                explanation: 'WHERE filtert die Ergebnisse nach einer Bedingung.'
            }
        ]
    },
    {
        id: 'advanced-select',
        title: 'Erweiterte SELECT Abfragen',
        icon: 'filter',
        color: 'cyan',
        lb: 'lb2',
        tasks: [
            {
                id: 'single-row-functions',
                title: 'Single Row Funktionen',
                question: 'Konvertiere alle Mitarbeiternamen in Großbuchstaben.',
                hint: 'Verwende UPPER()',
                solution: `SELECT UPPER(vollname) AS name_gross 
FROM employees;`,
                explanation: 'Single Row Funktionen wie UPPER(), LOWER(), LENGTH() operieren auf einzelnen Zeilen.'
            },
            {
                id: 'join-tables',
                title: 'Tabellen verbinden',
                question: 'Verbinde die Tabellen "employees" und "abteilung" über abteilung_id.',
                hint: 'Verwende JOIN ...  ON',
                solution: `SELECT e.vollname, a.name AS abteilung
FROM employees e
JOIN abteilung a ON e.abteilung_id = a.id;`,
                explanation: 'JOIN verbindet Tabellen. ON gibt die Verbindungsbedingung an.'
            },
            {
                id: 'group-by',
                title: 'Einträge gruppieren',
                question: 'Zähle die Anzahl der Mitarbeiter pro Abteilung.',
                hint: 'Verwende GROUP BY mit COUNT()',
                solution: `SELECT abteilung_id, COUNT(*) AS anzahl
FROM employees
GROUP BY abteilung_id;`,
                explanation: 'GROUP BY gruppiert Zeilen.  Aggregatfunktionen wie COUNT() werden auf Gruppen angewendet.'
            },
            {
                id: 'having',
                title: 'Gruppeneinträge filtern',
                question: 'Zeige nur Abteilungen mit mehr als 5 Mitarbeitern.',
                hint: 'Verwende HAVING nach GROUP BY',
                solution: `SELECT abteilung_id, COUNT(*) AS anzahl
FROM employees
GROUP BY abteilung_id
HAVING COUNT(*) > 5;`,
                explanation: 'HAVING filtert Gruppen (nach GROUP BY). WHERE filtert Zeilen (vor GROUP BY).'
            },
            {
                id: 'aggregate-functions',
                title: 'Gruppenfunktionen anwenden',
                question: 'Berechne das durchschnittliche Gehalt, min, max und Summe aller Gehälter.',
                hint: 'Verwende AVG(), MIN(), MAX(), SUM()',
                solution: `SELECT 
    AVG(gehalt) AS durchschnitt,
    MIN(gehalt) AS minimum,
    MAX(gehalt) AS maximum,
    SUM(gehalt) AS summe
FROM employees;`,
                explanation: 'Aggregatfunktionen: AVG (Durchschnitt), MIN, MAX, SUM, COUNT.'
            },
            {
                id: 'subquery',
                title: 'Unterabfragen einsetzen',
                question: 'Finde alle Mitarbeiter, die mehr als das Durchschnittsgehalt verdienen.',
                hint: 'Verwende eine Subquery in WHERE',
                solution: `SELECT * FROM employees
WHERE gehalt > (
    SELECT AVG(gehalt) FROM employees
);`,
                explanation: 'Subqueries sind SELECT-Statements innerhalb anderer Queries.  Sie werden in () geschrieben.'
            }
        ]
    },
    {
        id: 'performance',
        title: 'Performance Optimierung',
        icon: 'zap',
        color: 'orange',
        lb: 'lb2',
        tasks: [
            {
                id: 'timing',
                title: 'Timing anzeigen',
                question: 'Wie aktivierst du die Anzeige der Ausführungszeit in psql?',
                hint: 'Verwende \\timing',
                solution: '\\timing on',
                explanation: '\\timing zeigt die Ausführungszeit jeder Query an.  Hilfreich für Performance-Analyse.'
            },
            {
                id: 'explain',
                title: 'Performance Analyse',
                question: 'Analysiere den Ausführungsplan einer Query auf "employees".',
                hint: 'Verwende EXPLAIN ANALYZE',
                solution: `EXPLAIN ANALYZE 
SELECT * FROM employees 
WHERE abteilung_id = 5;`,
                explanation: 'EXPLAIN zeigt den Query-Plan.  ANALYZE führt die Query aus und zeigt tatsächliche Zeiten.'
            },
            {
                id: 'index-create',
                title: 'Index erstellen',
                question: 'Erstelle einen Index auf der Spalte "abteilung_id" in "employees".',
                hint: 'Verwende CREATE INDEX',
                solution: `CREATE INDEX idx_abteilung 
ON employees(abteilung_id);`,
                explanation: 'Indizes beschleunigen Suchen.  Sinnvoll bei häufig gefilterten/verbundenen Spalten.'
            },
            {
                id: 'index-use',
                title: 'Wann sind Indizes sinnvoll?',
                question: 'Bei welchen Operationen sind Indizes besonders sinnvoll?',
                hint: 'Denke an WHERE, JOIN, ORDER BY',
                solution: `-- Indizes sind sinnvoll für:
-- 1. WHERE Klauseln (Filterung)
-- 2. JOIN Operationen
-- 3. ORDER BY / GROUP BY
-- 4. Foreign Keys
-- NICHT sinnvoll bei kleinen Tabellen oder häufigen INSERTS/UPDATES`,
                explanation: 'Indizes beschleunigen Lesezugriffe, verlangsamen aber Schreibvorgänge.  Abwägung notwendig!'
            },
            {
                id: 'index-drop',
                title: 'Index entfernen',
                question: 'Entferne den Index "idx_abteilung".',
                hint: 'Verwende DROP INDEX',
                solution: 'DROP INDEX idx_abteilung;',
                explanation: 'DROP INDEX entfernt einen Index. Die Tabellendaten bleiben unverändert.'
            }
        ]
    },
    {
        id: 'transactions',
        title: 'Transaktionen',
        icon: 'shield',
        color: 'red',
        lb: 'lb2',
        tasks: [
            {
                id: 'acid',
                title: 'ACID Prinzip',
                question: 'Was bedeutet ACID bei Datenbank-Transaktionen? ',
                hint: 'Atomicity, Consistency, Isolation, Durability',
                solution: `-- ACID steht für:
-- A - Atomicity (Atomarität): Alles oder nichts
-- C - Consistency (Konsistenz): Daten bleiben gültig
-- I - Isolation (Isolation): Transaktionen beeinflussen sich nicht
-- D - Durability (Dauerhaftigkeit): Änderungen sind permanent`,
                explanation: 'ACID garantiert Zuverlässigkeit von Datenbank-Transaktionen.'
            },
            {
                id: 'begin-transaction',
                title: 'Transaktion starten',
                question: 'Starte eine Transaktion, füge einen Mitarbeiter ein und committe.',
                hint: 'Verwende BEGIN, dann SQL, dann COMMIT',
                solution: `BEGIN;
INSERT INTO employees (vollname, abteilung_id) 
VALUES ('Anna Schmidt', 3);
COMMIT;`,
                explanation: 'BEGIN startet eine Transaktion.  COMMIT speichert alle Änderungen permanent.'
            },
            {
                id: 'rollback',
                title: 'Rollback durchführen',
                question: 'Starte eine Transaktion, lösche Daten und mache es rückgängig.',
                hint: 'Verwende ROLLBACK statt COMMIT',
                solution: `BEGIN;
DELETE FROM employees WHERE id = 100;
ROLLBACK;`,
                explanation: 'ROLLBACK macht alle Änderungen seit BEGIN rückgängig.  Daten bleiben unverändert.'
            },
            {
                id: 'savepoint',
                title: 'Savepoints verwenden',
                question: 'Erstelle einen Savepoint innerhalb einer Transaktion und rollback zu diesem.',
                hint: 'Verwende SAVEPOINT und ROLLBACK TO',
                solution: `BEGIN;
INSERT INTO employees (vollname) VALUES ('Test 1');
SAVEPOINT sp1;
INSERT INTO employees (vollname) VALUES ('Test 2');
ROLLBACK TO sp1;  -- Test 2 wird rückgängig gemacht
COMMIT;  -- Test 1 bleibt`,
                explanation: 'SAVEPOINT erstellt einen Punkt, zu dem man zurückrollen kann, ohne die ganze Transaktion zu verwerfen.'
            },
            {
                id: 'transaction-isolation',
                title: 'Isolation Level setzen',
                question: 'Setze das Isolation Level einer Transaktion auf SERIALIZABLE.',
                hint: 'Verwende SET TRANSACTION ISOLATION LEVEL',
                solution: `BEGIN;
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
-- Deine Queries hier
COMMIT;`,
                explanation: 'Isolation Levels: READ UNCOMMITTED, READ COMMITTED, REPEATABLE READ, SERIALIZABLE.  Höhere Level = mehr Isolation, weniger Concurrency.'
            }
        ]
    }
];

// SVG Icon templates
const icons = {
    database: '<ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1. 34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>',
    code: '<polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3. 87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line>',
    checkCircle: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9. 14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>',
    circle: '<circle cx="12" cy="12" r="10"></circle>',
    chevronRight: '<polyline points="9 18 15 12 9 6"></polyline>',
    chevronDown: '<polyline points="6 9 12 15 18 9"></polyline>',
    edit: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>',
    search: '<circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path>',
    filter: '<polygon points="22 3 2 3 10 12. 46 10 19 14 21 14 12.46 22 3"></polygon>',
    zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>'
};

// Helper functions
function createSVG(iconName, className = '') {
    return `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${icons[iconName]}</svg>`;
}

function normalize(str) {
    return str.replace(/\s+/g, ' ').trim(). toLowerCase();
}

function getProgress() {
    const totalTasks = modules.reduce((sum, m) => sum + m.tasks. length, 0);
    const completed = Object.keys(state.completedTasks).length;
    return Math.round((completed / totalTasks) * 100);
}

function updateProgress() {
    const progress = getProgress();
    document.getElementById('progressFill').style.width = `${progress}%`;
    document. getElementById('progressText').textContent = `Fortschritt: ${progress}%`;
}

function toggleModule(moduleId) {
    state.expandedModule = state.expandedModule === moduleId ? null : moduleId;
    renderModules();
}

function checkAnswer(moduleId, taskId) {
    const taskKey = `${moduleId}-${taskId}`;
    const userAnswer = (state.userAnswers[taskKey] || '').trim(). toLowerCase();
    const module = modules.find(m => m.id === moduleId);
    const task = module.tasks.find(t => t.id === taskId);
    const solution = task.solution. toLowerCase();
    
    if (normalize(userAnswer) === normalize(solution) || 
        (solution.includes(normalize(userAnswer)) && userAnswer.length > 20)) {
        state.completedTasks[taskKey] = true;
        alert('✓ Richtig!  Gut gemacht!');
        updateProgress();
        renderModules();
    } else {
        alert('Nicht ganz richtig. Versuche es nochmal oder schau dir den Hinweis an.');
    }
}

function toggleSolution(moduleId, taskId) {
    const taskKey = `${moduleId}-${taskId}`;
    state.showSolution[taskKey] = !state.showSolution[taskKey];
    renderModules();
}

function updateAnswer(moduleId, taskId, value) {
    const taskKey = `${moduleId}-${taskId}`;
    state.userAnswers[taskKey] = value;
}

function filterModules(filter) {
    state.currentFilter = filter;
    
    // Update button states
    document.querySelectorAll('.lb-button').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    renderModules();
}

// Render functions
function renderTask(module, task, index) {
    const taskKey = `${module.id}-${task.id}`;
    const isCompleted = state.completedTasks[taskKey];
    const showingSolution = state.showSolution[taskKey];
    const userAnswer = state.userAnswers[taskKey] || '';

    return `
        <div class="task">
            <div class="task-header">
                ${createSVG(isCompleted ? 'checkCircle' : 'circle', `task-icon ${isCompleted ? 'completed' : 'incomplete'}`)}
                <div class="task-content">
                    <h3 class="task-title">Aufgabe ${index + 1}: ${task.title}</h3>
                    <p class="task-question">${task.question}</p>

                    <div class="task-hint">
                        <p>💡 Hinweis: ${task.hint}</p>
                    </div>

                    <textarea 
                        class="task-textarea" 
                        placeholder="Dein SQL-Code hier..."
                        ${isCompleted ? 'disabled' : ''}
                        data-module="${module.id}"
                        data-task="${task.id}"
                    >${userAnswer}</textarea>

                    <div class="task-buttons">
                        <button 
                            class="btn btn-check" 
                            ${isCompleted ? 'disabled' : ''}
                            onclick="checkAnswer('${module.id}', '${task.id}')"
                        >
                            Prüfen
                        </button>
                        <button 
                            class="btn btn-solution"
                            onclick="toggleSolution('${module.id}', '${task.id}')"
                        >
                            ${showingSolution ? 'Lösung ausblenden' : 'Lösung anzeigen'}
                        </button>
                    </div>

                    ${showingSolution ?  `
                        <div class="solution-container">
                            <p class="solution-title">Lösung:</p>
                            <div class="solution-code">
                                <code>${task.solution}</code>
                            </div>
                            <p class="solution-explanation">
                                <strong>Erklärung:</strong> ${task.explanation}
                            </p>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

function renderModule(module) {
    const isExpanded = state.expandedModule === module.id;
    const moduleCompleted = module.tasks.every(task => 
        state.completedTasks[`${module.id}-${task.id}`]
    );
    const completedCount = module.tasks.filter(t => 
        state.completedTasks[`${module.id}-${t.id}`]
    ). length;

    // Filter logic
    const shouldShow = state.currentFilter === 'all' || module.lb === state.currentFilter;

    return `
        <div class="module ${shouldShow ? '' : 'hidden'}">
            <button class="module-header" onclick="toggleModule('${module.id}')">
                <div class="module-header-left">
                    <div class="module-icon-wrapper ${module.color}">
                        ${createSVG(module.icon)}
                    </div>
                    <div class="module-info">
                        <h2 class="module-title">${module.title}</h2>
                        <p class="module-subtitle">${completedCount} / ${module.tasks.length} Aufgaben</p>
                        <span class="module-badge ${module.lb}">${module.lb. toUpperCase()}</span>
                    </div>
                </div>
                <div class="module-header-right">
                    ${moduleCompleted ? createSVG('checkCircle', 'check-icon') : ''}
                    ${createSVG(isExpanded ? 'chevronDown' : 'chevronRight')}
                </div>
            </button>

            ${isExpanded ? `
                <div class="tasks-container">
                    ${module.tasks.map((task, index) => renderTask(module, task, index)).join('')}
                </div>
            ` : ''}
        </div>
    `;
}

function renderModules() {
    const container = document.getElementById('modulesContainer');
    container.innerHTML = modules.map(module => renderModule(module)).join('');
    
    // Add event listeners to textareas
    document.querySelectorAll('.task-textarea').forEach(textarea => {
        textarea. addEventListener('input', (e) => {
            const moduleId = e.target.dataset.module;
            const taskId = e.target.dataset.task;
            updateAnswer(moduleId, taskId, e.target.value);
        });
    });
}

// Initialize app
// Initialize app
function init() {
    renderModules();
    updateProgress();
    
    // Load saved state from localStorage
    loadState();
}

// Save and load state to/from localStorage
function saveState() {
    localStorage.setItem('postgresqlLearningState', JSON.stringify({
        completedTasks: state.completedTasks,
        userAnswers: state.userAnswers
    }));
}

function loadState() {
    const saved = localStorage.getItem('postgresqlLearningState');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            state.completedTasks = data.completedTasks || {};
            state.userAnswers = data.userAnswers || {};
            renderModules();
            updateProgress();
        } catch (e) {
            console.error('Error loading saved state:', e);
        }
    }
}

// Save state whenever it changes
const originalCheckAnswer = checkAnswer;
checkAnswer = function(moduleId, taskId) {
    originalCheckAnswer(moduleId, taskId);
    saveState();
};

const originalUpdateAnswer = updateAnswer;
updateAnswer = function(moduleId, taskId, value) {
    originalUpdateAnswer(moduleId, taskId, value);
    saveState();
};

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + S to save (already auto-saves, but gives feedback)
    if ((e.ctrlKey || e. metaKey) && e.key === 's') {
        e.preventDefault();
        saveState();
        showNotification('Fortschritt gespeichert!  ✓');
    }
    
    // Ctrl/Cmd + R to reset (with confirmation)
    if ((e. ctrlKey || e.metaKey) && e.key === 'r' && e.shiftKey) {
        e. preventDefault();
        if (confirm('Möchtest du deinen gesamten Fortschritt zurücksetzen?')) {
            resetProgress();
        }
    }
});

// Reset progress function
function resetProgress() {
    state.completedTasks = {};
    state.userAnswers = {};
    state.showSolution = {};
    localStorage.removeItem('postgresqlLearningState');
    renderModules();
    updateProgress();
    showNotification('Fortschritt zurückgesetzt! ');
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        font-weight: 600;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document. body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document. addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Export functions to global scope for onclick handlers
window.toggleModule = toggleModule;
window. checkAnswer = checkAnswer;
window.toggleSolution = toggleSolution;
window.filterModules = filterModules;
window.resetProgress = resetProgress;