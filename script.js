import React, { useState } from 'react';
import { CheckCircle, Circle, ChevronRight, ChevronDown, Database, Code, Users, Upload, Download, Key } from 'lucide-react';

const PostgreSQLLernplattform = () => {
  const [expandedModule, setExpandedModule] = useState(null);
  const [completedTasks, setCompletedTasks] = useState({});
  const [userAnswers, setUserAnswers] = useState({});
  const [showSolution, setShowSolution] = useState({});

  const modules = [
    {
      id: 'db-creation',
      title: 'Datenbank und Schema erstellen',
      icon: Database,
      color: 'bg-blue-500',
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
      icon: Code,
      color: 'bg-green-500',
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
      title: 'Tabellen erstellen und anpassen',
      icon: Database,
      color: 'bg-purple-500',
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
          explanation: 'SERIAL erstellt automatisch eine Auto-Increment ID. PRIMARY KEY definiert den Primärschlüssel.'
        },
        {
          id: 'rename-table',
          title: 'Tabelle umbenennen',
          question: 'Benenne die Tabelle "mitarbeiter" in "employees" um.',
          hint: 'Verwende ALTER TABLE ... RENAME TO',
          solution: 'ALTER TABLE mitarbeiter RENAME TO employees;',
          explanation: 'ALTER TABLE RENAME TO ändert den Namen einer existierenden Tabelle.'
        },
        {
          id: 'rename-column',
          title: 'Spalte umbenennen',
          question: 'Benenne die Spalte "name" in "vollname" um.',
          hint: 'Verwende ALTER TABLE ... RENAME COLUMN',
          solution: 'ALTER TABLE employees RENAME COLUMN name TO vollname;',
          explanation: 'RENAME COLUMN ändert den Spaltennamen ohne die Daten zu beeinflussen.'
        },
        {
          id: 'change-type',
          title: 'Spaltentyp ändern',
          question: 'Ändere den Typ der Spalte "vollname" zu VARCHAR(200).',
          hint: 'Verwende ALTER TABLE ... ALTER COLUMN ... TYPE',
          solution: 'ALTER TABLE employees ALTER COLUMN vollname TYPE VARCHAR(200);',
          explanation: 'ALTER COLUMN TYPE ändert den Datentyp. PostgreSQL konvertiert die Daten wenn möglich.'
        },
        {
          id: 'add-pk',
          title: 'Primary Key hinzufügen',
          question: 'Füge einen Primary Key zur Spalte "email" in der Tabelle "users" hinzu.',
          hint: 'Verwende ALTER TABLE ... ADD PRIMARY KEY',
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
          title: 'Foreign Key mit CASCADE',
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
      title: 'Daten hinzufügen, ändern, löschen',
      icon: Database,
      color: 'bg-yellow-500',
      tasks: [
        {
          id: 'insert-data',
          title: 'Datensätze einfügen',
          question: 'Füge einen Mitarbeiter mit id=1, name="Max Mustermann", abteilung_id=5 ein.',
          hint: 'Verwende INSERT INTO',
          solution: `INSERT INTO employees (id, vollname, abteilung_id) 
VALUES (1, 'Max Mustermann', 5);`,
          explanation: 'INSERT INTO fügt neue Datensätze ein. Spaltennamen können optional angegeben werden.'
        },
        {
          id: 'update-data',
          title: 'Datensätze ändern',
          question: 'Ändere die abteilung_id von "Max Mustermann" auf 7.',
          hint: 'Verwende UPDATE ... SET ... WHERE',
          solution: `UPDATE employees 
SET abteilung_id = 7 
WHERE vollname = 'Max Mustermann';`,
          explanation: 'UPDATE ändert existierende Datensätze. WHERE ist wichtig, sonst werden ALLE Zeilen geändert!'
        },
        {
          id: 'delete-data',
          title: 'Datensätze löschen',
          question: 'Lösche alle Mitarbeiter mit abteilung_id = 5.',
          hint: 'Verwende DELETE FROM ... WHERE',
          solution: `DELETE FROM employees 
WHERE abteilung_id = 5;`,
          explanation: 'DELETE FROM löscht Datensätze. Ohne WHERE werden ALLE Zeilen gelöscht!'
        }
      ]
    },
    {
      id: 'import',
      title: 'Datenimport aus CSV',
      icon: Upload,
      color: 'bg-indigo-500',
      tasks: [
        {
          id: 'import-csv-comma',
          title: 'CSV Import mit Komma',
          question: 'Importiere Daten aus "mitarbeiter.csv" (Komma-getrennt) in die Tabelle employees.',
          hint: 'Verwende COPY ... FROM ... WITH (FORMAT csv, DELIMITER \',\')',
          solution: `COPY employees (vollname, abteilung_id)
FROM '/pfad/zu/mitarbeiter.csv'
WITH (FORMAT csv, HEADER true, DELIMITER ',');`,
          explanation: 'COPY FROM importiert Daten effizient. HEADER true überspringt die erste Zeile.'
        },
        {
          id: 'import-csv-semicolon',
          title: 'CSV Import mit Semikolon',
          question: 'Importiere Daten aus "daten.csv" (Semikolon-getrennt).',
          hint: 'Verwende DELIMITER \';\'',
          solution: `COPY employees (vollname, abteilung_id)
FROM '/pfad/zu/daten.csv'
WITH (FORMAT csv, HEADER true, DELIMITER ';');`,
          explanation: 'In Europa werden CSVs oft mit Semikolon statt Komma getrennt.'
        }
      ]
    },
    {
      id: 'export',
      title: 'Datenexport und Dumps',
      icon: Download,
      color: 'bg-red-500',
      tasks: [
        {
          id: 'dump-schema',
          title: 'Schema Dump erstellen',
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
          question: 'Erstelle einen Dump mit INSERT Statements statt COPY.',
          hint: 'Verwende --inserts oder --column-inserts',
          solution: 'pg_dump -d firma_db --inserts -f backup.sql',
          explanation: '--inserts verwendet INSERT Statements, die portabler aber langsamer sind als COPY.'
        }
      ]
    },
    {
      id: 'users',
      title: 'Benutzermanagement und Berechtigungen',
      icon: Users,
      color: 'bg-pink-500',
      tasks: [
        {
          id: 'role-vs-user',
          title: 'Unterschied Rolle vs. User',
          question: 'Was ist der Unterschied zwischen einer Rolle und einem User in PostgreSQL?',
          hint: 'In PostgreSQL sind beide sehr ähnlich...',
          solution: 'In PostgreSQL sind Roles und Users identisch. Eine Role mit LOGIN ist praktisch ein User.',
          explanation: 'Eine ROLE ohne LOGIN ist eine Gruppe. Eine ROLE mit LOGIN ist ein User.'
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
          hint: 'Verwende CREATE USER oder CREATE ROLE ... WITH LOGIN',
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
          explanation: 'pg_hba.conf steuert, von wo sich User verbinden dürfen. local = nur Unix Socket.'
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
          explanation: 'GRANT erteilt Berechtigungen. Man kann einzelne oder mehrere Rechte vergeben.'
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
    }
  ];

  const toggleModule = (moduleId) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  const checkAnswer = (moduleId, taskId) => {
    const taskKey = `${moduleId}-${taskId}`;
    const userAnswer = (userAnswers[taskKey] || '').trim().toLowerCase();
    const module = modules.find(m => m.id === moduleId);
    const task = module.tasks.find(t => t.id === taskId);
    const solution = task.solution.toLowerCase();
    
    // Einfacher Vergleich (ignoriert Whitespace-Unterschiede)
    const normalized = (str) => str.replace(/\s+/g, ' ').trim();
    
    if (normalized(userAnswer) === normalized(solution) || 
        solution.includes(normalized(userAnswer)) && userAnswer.length > 20) {
      setCompletedTasks({...completedTasks, [taskKey]: true});
      alert('✓ Richtig! Gut gemacht!');
    } else {
      alert('Nicht ganz richtig. Versuche es nochmal oder schau dir den Hinweis an.');
    }
  };

  const toggleSolution = (moduleId, taskId) => {
    const taskKey = `${moduleId}-${taskId}`;
    setShowSolution({...showSolution, [taskKey]: !showSolution[taskKey]});
  };

  const getProgress = () => {
    const totalTasks = modules.reduce((sum, m) => sum + m.tasks.length, 0);
    const completed = Object.keys(completedTasks).length;
    return Math.round((completed / totalTasks) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-12 h-12 text-purple-400" />
            <h1 className="text-4xl font-bold">PostgreSQL Lernplattform</h1>
          </div>
          <p className="text-gray-300 text-lg">
            Interaktive Übungen zu Datenbanken, SQL und Benutzerverwaltung
          </p>
          
          {/* Progress Bar */}
          <div className="mt-6 bg-slate-800 rounded-full h-4 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-500"
              style={{width: `${getProgress()}%`}}
            />
          </div>
          <p className="text-sm text-gray-400 mt-2">Fortschritt: {getProgress()}%</p>
        </div>

        {/* Modules */}
        <div className="space-y-4">
          {modules.map((module) => {
            const ModuleIcon = module.icon;
            const isExpanded = expandedModule === module.id;
            const moduleCompleted = module.tasks.every(task => 
              completedTasks[`${module.id}-${task.id}`]
            );

            return (
              <div key={module.id} className="bg-slate-800 rounded-lg overflow-hidden shadow-xl">
                {/* Module Header */}
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full p-6 flex items-center justify-between hover:bg-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`${module.color} p-3 rounded-lg`}>
                      <ModuleIcon className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <h2 className="text-xl font-bold">{module.title}</h2>
                      <p className="text-sm text-gray-400">
                        {module.tasks.filter(t => completedTasks[`${module.id}-${t.id}`]).length} / {module.tasks.length} Aufgaben
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {moduleCompleted && <CheckCircle className="w-6 h-6 text-green-400" />}
                    {isExpanded ? <ChevronDown className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                  </div>
                </button>

                {/* Tasks */}
                {isExpanded && (
                  <div className="border-t border-slate-700">
                    {module.tasks.map((task, index) => {
                      const taskKey = `${module.id}-${task.id}`;
                      const isCompleted = completedTasks[taskKey];
                      const showingSolution = showSolution[taskKey];

                      return (
                        <div key={task.id} className="p-6 border-b border-slate-700 last:border-b-0">
                          <div className="flex items-start gap-3 mb-4">
                            {isCompleted ? (
                              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                            ) : (
                              <Circle className="w-6 h-6 text-gray-500 flex-shrink-0 mt-1" />
                            )}
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold mb-2">
                                Aufgabe {index + 1}: {task.title}
                              </h3>
                              <p className="text-gray-300 mb-4">{task.question}</p>

                              {/* Hint */}
                              <div className="bg-slate-900 rounded p-3 mb-4">
                                <p className="text-sm text-yellow-400">💡 Hinweis: {task.hint}</p>
                              </div>

                              {/* Answer Input */}
                              <textarea
                                className="w-full bg-slate-900 text-white p-3 rounded font-mono text-sm mb-3 min-h-24"
                                placeholder="Dein SQL-Code hier..."
                                value={userAnswers[taskKey] || ''}
                                onChange={(e) => setUserAnswers({
                                  ...userAnswers,
                                  [taskKey]: e.target.value
                                })}
                                disabled={isCompleted}
                              />

                              {/* Buttons */}
                              <div className="flex gap-3">
                                <button
                                  onClick={() => checkAnswer(module.id, task.id)}
                                  disabled={isCompleted}
                                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 px-4 py-2 rounded font-semibold transition-colors"
                                >
                                  Prüfen
                                </button>
                                <button
                                  onClick={() => toggleSolution(module.id, task.id)}
                                  className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded font-semibold transition-colors"
                                >
                                  {showingSolution ? 'Lösung ausblenden' : 'Lösung anzeigen'}
                                </button>
                              </div>

                              {/* Solution */}
                              {showingSolution && (
                                <div className="mt-4 bg-green-900/20 border border-green-500/50 rounded p-4">
                                  <p className="text-green-400 font-semibold mb-2">✓ Lösung:</p>
                                  <pre className="bg-slate-900 p-3 rounded overflow-x-auto text-sm mb-3">
                                    <code>{task.solution}</code>
                                  </pre>
                                  <p className="text-sm text-gray-300">
                                    <strong>Erklärung:</strong> {task.explanation}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>PostgreSQL Lernplattform - Übe und meistere Datenbankverwaltung! 🚀</p>
        </div>
      </div>
    </div>
  );
};

export default PostgreSQLLernplattform;