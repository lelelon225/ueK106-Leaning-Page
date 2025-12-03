// State management
const state = {
    expandedModule: null,
    completedTasks: {},
    userAnswers: {},
    showSolution: {}
};

// Module data
const modules = [
    {
        id: 'db-creation',
        title: 'Datenbank und Schema erstellen',
        icon: 'database',
        color: 'blue',
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
        icon: 'database',
        color: 'purple',
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
                hint: 'Verwende ALTER TABLE ...  ALTER COLUMN ...  TYPE',
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
        icon: 'database',
        color: 'yellow',
        tasks: [
            {
                id: 'insert-data',
                title: 'Datensätze einfügen',
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
        tasks: [
            {
                id: 'import-csv-comma',
                title: 'CSV Import mit Komma',
                question: 'Importiere Daten aus "mitarbeiter.csv" (Komma-getrennt) in die Tabelle employees.',
                hint: 'Verwende COPY ...  FROM ... WITH (FORMAT csv, DELIMITER \',\')',
                solution: `COPY employees (vollname, abteilung_id)
FROM '/pfad/zu/mitarbeiter.csv'
WITH (FORMAT csv, HEADER true, DELIMITER ',');`,
                explanation: 'COPY FROM importiert Daten effizient.  HEADER true überspringt die erste Zeile.'
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
        icon: 'download',
        color: 'red',
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
        icon: 'users',
        color: 'pink',
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
                explanation: 'host erlaubt TCP/IP Verbindungen.  /32 bedeutet exakt diese IP.'
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
    }
];

// SVG Icon templates
const icons = {
    database: '<ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>',
    code: '<polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3. 87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line>',
    checkCircle: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>',
    circle: '<circle cx="12" cy="12" r="10"></circle>',
    chevronRight: '<polyline points="9 18 15 12 9 6"></polyline>',
    chevronDown: '<polyline points="6 9 12 15 18 9"></polyline>'
};

// Helper functions
function createSVG(iconName, className = '') {
    return `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${icons[iconName]}</svg>`;
}

function normalize(str) {
    return str.replace(/\s+/g, ' '). trim(). toLowerCase();
}

function getProgress() {
    const totalTasks = modules.reduce((sum, m) => sum + m.tasks. length, 0);
    const completed = Object.keys(state. completedTasks).length;
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
        (solution.includes(normalize(userAnswer)) && userAnswer. length > 20)) {
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
                        data-task="${task. id}"
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
                            <p class="solution-title">✓ Lösung:</p>
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

    return `
        <div class="module">
            <button class="module-header" onclick="toggleModule('${module.id}')">
                <div class="module-header-left">
                    <div class="module-icon-wrapper ${module.color}">
                        ${createSVG(module.icon)}
                    </div>
                    <div class="module-info">
                        <h2 class="module-title">${module.title}</h2>
                        <p class="module-subtitle">${completedCount} / ${module.tasks.length} Aufgaben</p>
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
            const moduleId = e.target.dataset. module;
            const taskId = e.target.dataset.task;
            updateAnswer(moduleId, taskId, e.target.value);
        });
    });
}

// Initialize app
function init() {
    renderModules();
    updateProgress();
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document. addEventListener('DOMContentLoaded', init);
} else {
    init();
}