document.addEventListener('DOMContentLoaded', () => {
  
  if (typeof renderNavbar === 'function') renderNavbar('repl');
  if (typeof renderFooter === 'function') renderFooter();

  
  const replInput       = document.getElementById('frython-repl');
  const terminalOutput  = document.getElementById('terminal-output');
  const codeEditor      = document.getElementById('code-editor');
  const lineNumbers     = document.getElementById('line-numbers');
  const editorInfo      = document.getElementById('editor-info');
  const pythonOutput    = document.getElementById('python-output');
  const astOutput       = document.getElementById('ast-output');
  const tokensOutput    = document.getElementById('tokens-output');
  const btnRun          = document.getElementById('btn-run');
  const btnClearTerminal= document.getElementById('btn-clear-terminal');
  const btnClearAll     = document.getElementById('btn-clear-all');
  const btnDownload     = document.getElementById('btn-download');
  const btnShare        = document.getElementById('btn-share');
  const btnFormat       = document.getElementById('btn-format');
  const copyTranspile   = document.getElementById('copy-transpile');
  const shareModal      = document.getElementById('share-modal');
  const shareModalClose = document.getElementById('share-modal-close');
  const shareUrl        = document.getElementById('share-url');
  const copyShareUrl    = document.getElementById('copy-share-url');
  const replStatus      = document.getElementById('repl-status');
  const tabBtns         = document.querySelectorAll('.tab-btn');
  const exampleSnippets = document.querySelectorAll('.example-snippet');

  
  let history = [];
  let historyIndex = -1;

  
  let replVariables = {};
  let multilineBuffer = [];
  let inMultiline = false;
  let indentLevel = 0;

  
  
  

  const KEYWORDS = {
    
    'si': 'if',
    'sinon': 'else',
    'sinonsi': 'elif',
    'tantque': 'while',
    'pour': 'for',
    'dans': 'in',
    'casser': 'break',
    'continuer': 'continue',
    'passer': 'pass',
    
    'déf': 'def',
    'def': 'def',
    'retourner': 'return',
    'rendement': 'yield',
    'classe': 'class',
    'lambda': 'lambda',
    
    'essayer': 'try',
    'sauf': 'except',
    'enfin': 'finally',
    'lever': 'raise',
    'affirmer': 'assert',
    
    'importer': 'import',
    'depuis': 'from',
    'comme': 'as',
    
    'Vrai': 'True',
    'Faux': 'False',
    'Rien': 'None',
    
    'et': 'and',
    'ou': 'or',
    'non': 'not',
    'est': 'is',
    
    'global': 'global',
    'nonlocal': 'nonlocal',
    
    'asynchrone': 'async',
    'attendre': 'await',
    
    'supprimer': 'del',
    
    'avec': 'with',
  };

  const BUILTINS = {
    'afficher': 'print',
    'saisir': 'input',
    'longueur': 'len',
    'intervalle': 'range',
    'type': 'type',
    'entier': 'int',
    'flottant': 'float',
    'chaîne': 'str',
    'liste': 'list',
    'dictionnaire': 'dict',
    'ensemble': 'set',
    'tuple': 'tuple',
    'booléen': 'bool',
    'absolu': 'abs',
    'arrondir': 'round',
    'maximum': 'max',
    'minimum': 'min',
    'somme': 'sum',
    'trier': 'sorted',
    'renverser': 'reversed',
    'énumérer': 'enumerate',
    'compresser': 'zip',
    'cartographier': 'map',
    'filtrer': 'filter',
    'ouvert': 'open',
    'aide': 'help',
    'soi': 'self',
  };

  const LIST_METHODS = {
    'ajouter': 'append',
    'étendre': 'extend',
    'insérer': 'insert',
    'supprimer_élément': 'remove',
    'extraire': 'pop',
    'effacer': 'clear',
    'trier': 'sort',
    'inverser': 'reverse',
    'indexer': 'index',
    'compter': 'count',
    'copier': 'copy',
  };

  const STRING_METHODS = {
    'majuscule': 'upper',
    'minuscule': 'lower',
    'capitaliser': 'capitalize',
    'diviser': 'split',
    'joindre': 'join',
    'remplacer': 'replace',
    'supprimer_espaces': 'strip',
    'trouver': 'find',
    'commence_par': 'startswith',
    'termine_par': 'endswith',
    'formater': 'format',
    'encoder': 'encode',
  };

  
  
  

  function transpile(code) {
    let result = code;

    
    for (const [fr, py] of Object.entries(KEYWORDS)) {
      const regex = new RegExp(`(?<![\\wàâäéèêëîïôùûüç])(${escapeRegex(fr)})(?![\\wàâäéèêëîïôùûüç])`, 'g');
      result = result.replace(regex, py);
    }

    
    for (const [fr, py] of Object.entries(BUILTINS)) {
      const regex = new RegExp(`(?<![\\wàâäéèêëîïôùûüç])(${escapeRegex(fr)})(?![\\wàâäéèêëîïôùûüç])`, 'g');
      result = result.replace(regex, py);
    }

    
    for (const [fr, py] of Object.entries(LIST_METHODS)) {
      const regex = new RegExp(`\\.${escapeRegex(fr)}\\b`, 'g');
      result = result.replace(regex, `.${py}`);
    }
    for (const [fr, py] of Object.entries(STRING_METHODS)) {
      const regex = new RegExp(`\\.${escapeRegex(fr)}\\b`, 'g');
      result = result.replace(regex, `.${py}`);
    }

    return result;
  }

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  
  
  

  
  function executeCode(frythonCode) {
    const lines = frythonCode.split('\n').filter(l => l.trim() !== '');
    const output = [];

    try {
      const pythonCode = transpile(frythonCode);
      return simulateExecution(pythonCode);
    } catch (e) {
      return { output: [], error: `ErreurExécution: ${e.message}`, python: transpile(frythonCode) };
    }
  }

  function simulateExecution(pythonCode) {
    const output = [];
    const localVars = { ...replVariables };
    const lines = pythonCode.split('\n');

    
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith('#')) {
        i++;
        continue;
      }

      
      const printMatch = trimmed.match(/^print\((.+)\)$/);
      if (printMatch) {
        try {
          const val = evalExpr(printMatch[1], localVars);
          output.push({ type: 'output', text: String(val) });
        } catch(e) {
          output.push({ type: 'error', text: `ErreurSyntaxe: ${e.message}` });
        }
        i++;
        continue;
      }

      
      const assignMatch = trimmed.match(/^([a-zA-ZàâäéèêëîïôùûüçÀÂÄÉÈÊËÎÏÔÙÛÜÇ_][a-zA-ZàâäéèêëîïôùûüçÀÂÄÉÈÊËÎÏÔÙÛÜÇ_0-9]*)\s*=\s*(.+)$/);
      if (assignMatch && !trimmed.startsWith('if') && !trimmed.startsWith('while') && !trimmed.startsWith('for')) {
        try {
          const val = evalExpr(assignMatch[2], localVars);
          localVars[assignMatch[1]] = val;
          replVariables[assignMatch[1]] = val;
        } catch(e) {
          output.push({ type: 'error', text: `ErreurAssignation: ${e.message}` });
        }
        i++;
        continue;
      }

      
      const forMatch = trimmed.match(/^for\s+(\w+)\s+in\s+range\((.+)\)\s*:$/);
      if (forMatch) {
        const varName = forMatch[1];
        const rangeArgs = forMatch[2].split(',').map(a => evalExpr(a.trim(), localVars));
        const start = rangeArgs.length >= 2 ? rangeArgs[0] : 0;
        const end   = rangeArgs.length >= 2 ? rangeArgs[1] : rangeArgs[0];
        const step  = rangeArgs.length === 3 ? rangeArgs[2] : 1;

        const bodyLines = getIndentedBlock(lines, i + 1);
        for (let n = start; n < end; n += step) {
          localVars[varName] = n;
          replVariables[varName] = n;
          const subResult = simulateExecution(bodyLines.join('\n').replace(
            new RegExp(`\\b${varName}\\b`, 'g'), String(n)
          ));
          output.push(...(subResult.output || []));
          if (subResult.error) {
            output.push({ type: 'error', text: subResult.error });
            break;
          }
        }
        i += bodyLines.length + 1;
        continue;
      }

      
      try {
        const val = evalExpr(trimmed, localVars);
        if (val !== undefined && val !== null && trimmed !== '') {
          
        }
      } catch(e) {
        
      }

      i++;
    }

    return { output, error: null, python: pythonCode };
  }

  function getIndentedBlock(lines, startIdx) {
    const block = [];
    for (let j = startIdx; j < lines.length; j++) {
      if (lines[j].startsWith('    ') || lines[j].startsWith('\t')) {
        block.push(lines[j].replace(/^    /, '').replace(/^\t/, ''));
      } else if (lines[j].trim() === '') {
        continue;
      } else {
        break;
      }
    }
    return block;
  }

  
  function evalExpr(expr, vars = {}) {
    expr = expr.trim();

    
    let resolved = expr;
    for (const [name, val] of Object.entries(vars)) {
      const regex = new RegExp(`\\b${name}\\b`, 'g');
      if (typeof val === 'string') {
        resolved = resolved.replace(regex, JSON.stringify(val));
      } else {
        resolved = resolved.replace(regex, String(val));
      }
    }

    
    if (/\b(eval|exec|import|open|os\.|sys\.|subprocess|__)\b/.test(resolved)) {
      throw new Error('Opération non autorisée dans le simulateur');
    }

    
    const strMatch = resolved.match(/^["'](.*)["']$/);
    if (strMatch) return strMatch[1];

    // Nombre
    if (/^-?\d+(\.\d+)?$/.test(resolved)) return Number(resolved);

    // Booléen
    if (resolved === 'True')  return true;
    if (resolved === 'False') return false;
    if (resolved === 'None')  return null;

    // len(...)
    const lenMatch = resolved.match(/^len\((.+)\)$/);
    if (lenMatch) {
      const inner = evalExpr(lenMatch[1], vars);
      return typeof inner === 'string' ? inner.length : Array.isArray(inner) ? inner.length : 0;
    }

    // range(...)
    const rangeMatch = resolved.match(/^range\((.+)\)$/);
    if (rangeMatch) {
      const args = rangeMatch[1].split(',').map(a => Number(evalExpr(a.trim(), vars)));
      const start = args.length >= 2 ? args[0] : 0;
      const end   = args.length >= 2 ? args[1] : args[0];
      return Array.from({ length: Math.max(0, end - start) }, (_, i) => start + i);
    }

    // str(x) / int(x) / float(x)
    const castMatch = resolved.match(/^(str|int|float|bool)\((.+)\)$/);
    if (castMatch) {
      const inner = evalExpr(castMatch[2], vars);
      if (castMatch[1] === 'str')   return String(inner);
      if (castMatch[1] === 'int')   return parseInt(inner);
      if (castMatch[1] === 'float') return parseFloat(inner);
      if (castMatch[1] === 'bool')  return Boolean(inner);
    }

    // Concaténation de chaînes ou opération arithmétique
    // On tente une eval sécurisée minimale
    try {
      // Remplacer True/False/None pour JS
      let jsExpr = resolved
        .replace(/\bTrue\b/g, 'true')
        .replace(/\bFalse\b/g, 'false')
        .replace(/\bNone\b/g, 'null')
        .replace(/\*\*/g, '**'); // pow — handled below

      // Pas d'étoile double → Math.pow
      jsExpr = jsExpr.replace(/(\d+|\w+)\s*\*\*\s*(\d+|\w+)/g, (_, a, b) => `Math.pow(${a},${b})`);

      
      if (/^[\d\s+\-*/%().,<>=!&|"'`Math.powtruefalsenull[\]]+$/.test(jsExpr)) {
        // eslint-disable-next-line no-new-func
        return Function(`"use strict"; return (${jsExpr})`)();
      }
    } catch {
      // ignore
    }

    return expr; // Retourner tel quel si on ne sait pas
  }

  // ═══════════════════════════════════════════════════════════════
  // COMMANDES INTÉGRÉES
  // ═══════════════════════════════════════════════════════════════

  const REPL_COMMANDS = {
    'aide()': () => {
      appendTerminalLine('info', [
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '🐓 Aide Frython REPL v1.0.0',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '',
        'Commandes spéciales :',
        '  aide()          — Afficher cette aide',
        '  effacer()       — Vider le terminal',
        '  variables()     — Afficher les variables',
        '  version()       — Version de Frython',
        '  quitter()       — Fermer le REPL',
        '',
        'Mots-clés Frython :',
        '  déf / retourner / classe / soi',
        '  si / sinon / sinonsi',
        '  pour / tantque / dans',
        '  afficher() / saisir() / longueur()',
        '  Vrai / Faux / Rien',
        '  essayer / sauf / enfin / lever',
        '',
        'Raccourcis :',
        '  ↑↓  — Naviguer dans l\'historique',
        '  Tab — Autocomplétion',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      ].join('\n'));
    },
    'effacer()': () => {
      clearTerminal();
    },
    'variables()': () => {
      const vars = Object.entries(replVariables);
      if (vars.length === 0) {
        appendTerminalLine('output', 'Aucune variable définie.');
      } else {
        const lines = ['Variables en mémoire :', ...vars.map(([k, v]) => `  ${k} = ${JSON.stringify(v)}`)];
        appendTerminalLine('info', lines.join('\n'));
      }
    },
    'version()': () => {
      appendTerminalLine('info', 'Frython v1.0.0 — Python en Français 🐓\nSimulateur JS intégré au navigateur.');
    },
    'quitter()': () => {
      appendTerminalLine('info', 'Au revoir ! 🐓 Cocorico !');
    },
  };

  // ═══════════════════════════════════════════════════════════════
  // INTERFACE TERMINAL
  // ═══════════════════════════════════════════════════════════════

  function appendTerminalLine(type, text) {
    const line = document.createElement('div');
    line.className = `terminal-line ${type}-line`;

    const prefix = document.createElement('span');
    prefix.className = 'line-prefix';
    prefix.textContent = type === 'input' ? '🐓 >>>' : (type === 'error' ? '💥' : '');

    const content = document.createElement('span');
    content.className = 'line-content';
    content.textContent = text;

    line.appendChild(prefix);
    line.appendChild(content);
    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  function appendInputLine(code) {
    const line = document.createElement('div');
    line.className = 'terminal-line input-line';

    const prefix = document.createElement('span');
    prefix.className = 'line-prefix';
    prefix.textContent = '🐓 >>>';

    const content = document.createElement('span');
    content.className = 'line-content';
    content.innerHTML = syntaxHighlight(code);

    line.appendChild(prefix);
    line.appendChild(content);
    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  function clearTerminal() {
    // Garder seulement le message de bienvenue
    const welcome = terminalOutput.querySelector('.terminal-welcome');
    terminalOutput.innerHTML = '';
    if (welcome) terminalOutput.appendChild(welcome);
  }

  function setStatus(state) {
    const dot = replStatus.querySelector('.status-dot');
    if (state === 'running') {
      replStatus.classList.add('running');
      replStatus.querySelector('.status-dot').style.background = '#f59e0b';
    } else {
      replStatus.classList.remove('running');
      dot.style.background = '#22c55e';
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // COLORATION SYNTAXIQUE
  // ═══════════════════════════════════════════════════════════════

  function syntaxHighlight(code) {
    let result = escapeHtml(code);

    // Chaînes de caractères
    result = result.replace(/(["'])(?:(?!\1)[^\\]|\\.)*\1/g, '<span class="kw-str">$&</span>');

    // Commentaires
    result = result.replace(/(#[^\n]*)$/gm, '<span class="kw-cmt">$1</span>');

    // Nombres
    result = result.replace(/\b(\d+\.?\d*)\b/g, '<span class="kw-num">$1</span>');

    // Mots-clés français
    const frKeywords = Object.keys(KEYWORDS).sort((a, b) => b.length - a.length);
    for (const kw of frKeywords) {
      const regex = new RegExp(`(?<![\\wàâäéèêëîïôùûüç])(${escapeRegex(kw)})(?![\\wàâäéèêëîïôùûüç])`, 'g');
      result = result.replace(regex, '<span class="kw-fr">$1</span>');
    }

    // Fonctions intégrées françaises
    const frBuiltins = Object.keys(BUILTINS).sort((a, b) => b.length - a.length);
    for (const fn of frBuiltins) {
      const regex = new RegExp(`(?<![\\wàâäéèêëîïôùûüç])(${escapeRegex(fn)})(?=\\()`, 'g');
      result = result.replace(regex, '<span class="kw-fn">$1</span>');
    }

    // Booléens et None
    result = result.replace(/\b(Vrai|Faux|Rien|True|False|None)\b/g, '<span class="kw-bool">$&</span>');

    return result;
  }

  function syntaxHighlightPython(code) {
    let result = escapeHtml(code);

    const pyKeywords = ['def', 'class', 'if', 'elif', 'else', 'while', 'for', 'in', 'return',
      'yield', 'try', 'except', 'finally', 'raise', 'import', 'from', 'as', 'and', 'or', 'not',
      'is', 'lambda', 'global', 'nonlocal', 'async', 'await', 'del', 'with', 'pass', 'break', 'continue'];

    result = result.replace(/(["'])(?:(?!\1)[^\\]|\\.)*\1/g, '<span class="kw-str">$&</span>');
    result = result.replace(/(#[^\n]*)$/gm, '<span class="kw-cmt">$1</span>');
    result = result.replace(/\b(\d+\.?\d*)\b/g, '<span class="kw-num">$1</span>');
    for (const kw of pyKeywords) {
      result = result.replace(new RegExp(`\\b(${kw})\\b`, 'g'), '<span class="kw-py">$1</span>');
    }
    result = result.replace(/\b(True|False|None)\b/g, '<span class="kw-bool">$&</span>');
    result = result.replace(/\b(print|input|len|range|str|int|float|list|dict|set|type|abs|round|max|min|sum|sorted|enumerate|zip|map|filter)\b(?=\()/g, '<span class="kw-fn">$&</span>');

    return result;
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ═══════════════════════════════════════════════════════════════
  // GESTION DE L'INPUT REPL
  // ═══════════════════════════════════════════════════════════════

  function processReplInput(code) {
    if (!code.trim()) return;

    // Historique
    history.unshift(code);
    if (history.length > 50) history.pop();
    historyIndex = -1;

    appendInputLine(code);

    // Commandes intégrées
    const cmd = code.trim();
    if (REPL_COMMANDS[cmd]) {
      REPL_COMMANDS[cmd]();
      return;
    }

    // Exécution du code
    setStatus('running');
    setTimeout(() => {
      try {
        const result = executeCode(code);

        // Afficher les sorties
        if (result.output) {
          for (const out of result.output) {
            appendTerminalLine(out.type === 'error' ? 'error' : 'output', out.text);
          }
        }

        if (result.error) {
          appendTerminalLine('error', result.error);
        }

        // Mettre à jour la zone de transpilation
        if (result.python) {
          updateTranspilePanel(code, result.python);
        }

      } catch(e) {
        appendTerminalLine('error', `ErreurInterne: ${e.message}`);
      } finally {
        setStatus('ready');
      }
    }, 50);
  }

  function updateTranspilePanel(frython, python) {
    // Tab Python
    pythonOutput.innerHTML = `<code>${syntaxHighlightPython(python)}</code>`;

    // Tab AST (simplifié)
    const ast = generateSimpleAST(frython);
    astOutput.innerHTML = `<code class="kw-cmt">${escapeHtml(ast)}</code>`;

    // Tab Tokens
    const tokens = tokenize(frython);
    tokensOutput.innerHTML = `<code>${escapeHtml(tokens)}</code>`;
  }

  function generateSimpleAST(code) {
    const lines = code.split('\n').filter(l => l.trim());
    const nodes = lines.map(line => {
      const t = line.trim();
      if (t.startsWith('#')) return `# Commentaire: "${t.slice(1).trim()}"`;
      if (/^(déf|def)\s/.test(t)) return `FunctionDef(name="${t.match(/(?:déf|def)\s+(\w+)/)?.[1] || '?'}")`;
      if (/^(classe|class)\s/.test(t)) return `ClassDef(name="${t.match(/(?:classe|class)\s+(\w+)/)?.[1] || '?'}")`;
      if (/^afficher|^print/.test(t)) return `Expr(value=Call(func=Name('print')))`;
      if (/\s*=\s/.test(t) && !/[=!<>]=/.test(t)) return `Assign(target="${t.split('=')[0].trim()}")`;
      if (/^(si|if)\s/.test(t)) return `If(test=Compare(...))`;
      if (/^(pour|for)\s/.test(t)) return `For(target=..., iter=...)`;
      if (/^(tantque|while)\s/.test(t)) return `While(test=Compare(...))`;
      return `Expr(value=...)`;
    });
    return `Module(body=[\n  ${nodes.join(',\n  ')}\n])`;
  }

  function tokenize(code) {
    const tokens = [];
    const tokenPatterns = [
      { type: 'STRING',  re: /["'](?:[^"'\\]|\\.)*["']/ },
      { type: 'NUMBER',  re: /\d+\.?\d*/ },
      { type: 'KEYWORD', re: new RegExp(Object.keys(KEYWORDS).sort((a,b)=>b.length-a.length).map(escapeRegex).join('|')) },
      { type: 'BUILTIN', re: new RegExp(Object.keys(BUILTINS).sort((a,b)=>b.length-a.length).map(escapeRegex).join('|')) },
      { type: 'IDENT',   re: /[a-zA-ZàâäéèêëîïôùûüçÀÂÄÉÈÊËÎÏÔÙÛÜÇ_]\w*/ },
      { type: 'OP',      re: /[+\-*/%=<>!&|()[\]{},:.]+/ },
      { type: 'SPACE',   re: /\s+/ },
    ];

    let remaining = code;
    while (remaining.length > 0) {
      let matched = false;
      for (const { type, re } of tokenPatterns) {
        const m = remaining.match(new RegExp(`^(${re.source})`));
        if (m) {
          if (type !== 'SPACE') {
            tokens.push(`${type.padEnd(8)} "${m[1]}"`);
          }
          remaining = remaining.slice(m[1].length);
          matched = true;
          break;
        }
      }
      if (!matched) remaining = remaining.slice(1);
    }

    return tokens.join('\n');
  }

  // ═══════════════════════════════════════════════════════════════
  // ÉDITEUR DE CODE
  // ═══════════════════════════════════════════════════════════════

  function updateLineNumbers() {
    const lines = codeEditor.value.split('\n').length;
    lineNumbers.textContent = Array.from({ length: lines }, (_, i) => i + 1).join('\n');
  }

  function updateEditorInfo() {
    const text = codeEditor.value;
    const before = text.slice(0, codeEditor.selectionStart);
    const lines = before.split('\n');
    const line = lines.length;
    const col = lines[lines.length - 1].length + 1;
    editorInfo.textContent = `Ln ${line}, Col ${col}`;
  }

  codeEditor.addEventListener('input', () => {
    updateLineNumbers();
    updateEditorInfo();
  });

  codeEditor.addEventListener('click', updateEditorInfo);
  codeEditor.addEventListener('keyup', updateEditorInfo);

  // Tab dans l'éditeur
  codeEditor.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = codeEditor.selectionStart;
      const end = codeEditor.selectionEnd;
      codeEditor.value = codeEditor.value.slice(0, start) + '    ' + codeEditor.value.slice(end);
      codeEditor.selectionStart = codeEditor.selectionEnd = start + 4;
      updateLineNumbers();
    }
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      runEditorCode();
    }
  });

  function runEditorCode() {
    const code = codeEditor.value.trim();
    if (!code) return;

    // Ajouter séparateur
    const sep = document.createElement('div');
    sep.className = 'terminal-line separator-line';
    terminalOutput.appendChild(sep);

    appendTerminalLine('info', `▶ Exécution du script (${code.split('\n').length} ligne(s))...`);

    setStatus('running');
    setTimeout(() => {
      try {
        const result = executeCode(code);

        if (result.output && result.output.length > 0) {
          for (const out of result.output) {
            appendTerminalLine(out.type === 'error' ? 'error' : 'output', out.text);
          }
        } else if (!result.error) {
          appendTerminalLine('output', '(Pas de sortie)');
        }

        if (result.error) {
          appendTerminalLine('error', result.error);
        }

        if (result.python) {
          updateTranspilePanel(code, result.python);
        }

        appendTerminalLine('success', '✓ Exécution terminée');
      } catch(e) {
        appendTerminalLine('error', `ErreurFatale: ${e.message}`);
      } finally {
        setStatus('ready');
      }
    }, 80);
  }

  btnRun.addEventListener('click', runEditorCode);

  btnFormat.addEventListener('click', () => {
    // Indentation basique : normaliser les tabs en 4 espaces
    let code = codeEditor.value;
    code = code.replace(/\t/g, '    ');
    // Retirer les espaces de fin de ligne
    code = code.split('\n').map(l => l.trimEnd()).join('\n');
    codeEditor.value = code;
    updateLineNumbers();
    appendTerminalLine('info', '✓ Code formaté');
  });

  // ═══════════════════════════════════════════════════════════════
  // INPUT REPL (ligne de commande)
  // ═══════════════════════════════════════════════════════════════

  replInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = replInput.value;
      replInput.value = '';
      processReplInput(val);
    }

    // Historique
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        historyIndex++;
        replInput.value = history[historyIndex];
      }
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        replInput.value = history[historyIndex];
      } else {
        historyIndex = -1;
        replInput.value = '';
      }
    }

    // Autocomplétion Tab
    if (e.key === 'Tab') {
      e.preventDefault();
      const val = replInput.value;
      const allKeywords = [...Object.keys(KEYWORDS), ...Object.keys(BUILTINS)];
      const match = allKeywords.find(k => k.startsWith(val) && k !== val);
      if (match) {
        replInput.value = match;
      }
    }
  });

  // ═══════════════════════════════════════════════════════════════
  // EXEMPLES DEPUIS LA SIDEBAR
  // ═══════════════════════════════════════════════════════════════

  exampleSnippets.forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.dataset.code;
      if (code) {
        codeEditor.value = code;
        updateLineNumbers();
        codeEditor.focus();
        // Sur mobile, fermer la sidebar
        document.getElementById('repl-sidebar')?.classList.remove('open');
      }
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // CONTRÔLES DIVERS
  // ═══════════════════════════════════════════════════════════════

  btnClearTerminal?.addEventListener('click', clearTerminal);

  btnClearAll?.addEventListener('click', () => {
    clearTerminal();
    codeEditor.value = '';
    replVariables = {};
    updateLineNumbers();
    pythonOutput.innerHTML = '<code class="placeholder-code"># Tout effacé</code>';
  });

  btnDownload?.addEventListener('click', () => {
    const code = codeEditor.value;
    if (!code.trim()) {
      appendTerminalLine('error', 'Aucun code à télécharger');
      return;
    }
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'main.fy';
    a.click();
    URL.revokeObjectURL(url);
    appendTerminalLine('success', '✓ Fichier main.fy téléchargé');
  });

  btnShare?.addEventListener('click', () => {
    const code = codeEditor.value;
    const encoded = btoa(unescape(encodeURIComponent(code)));
    shareUrl.value = `${window.location.origin}${window.location.pathname}?code=${encoded}`;
    shareModal.classList.add('open');
  });

  shareModalClose?.addEventListener('click', () => shareModal.classList.remove('open'));
  shareModal?.addEventListener('click', (e) => {
    if (e.target === shareModal) shareModal.classList.remove('open');
  });

  copyShareUrl?.addEventListener('click', () => {
    navigator.clipboard.writeText(shareUrl.value).then(() => {
      copyShareUrl.textContent = '✓ Copié !';
      setTimeout(() => copyShareUrl.textContent = 'Copier', 1500);
    });
  });

  copyTranspile?.addEventListener('click', () => {
    const activePanel = document.querySelector('.tab-panel.active pre');
    if (activePanel) {
      navigator.clipboard.writeText(activePanel.textContent).then(() => {
        copyTranspile.innerHTML = '✓ Copié !';
        setTimeout(() => {
          copyTranspile.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copier`;
        }, 1500);
      });
    }
  });

  // Onglets transpilation
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      const target = document.getElementById(`tab-${btn.dataset.tab}`);
      if (target) target.classList.add('active');
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // SÉPARATEUR REDIMENSIONNABLE
  // ═══════════════════════════════════════════════════════════════

  const divider = document.getElementById('repl-divider');
  const editorPanel = document.getElementById('editor-panel');
  const terminalPanel = document.getElementById('terminal-panel');
  let isDragging = false;
  let startX = 0;
  let startEditorWidth = 0;

  divider?.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startEditorWidth = editorPanel.getBoundingClientRect().width;
    divider.classList.add('dragging');
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const container = document.getElementById('repl-split');
    const containerWidth = container.getBoundingClientRect().width;
    const newWidth = Math.min(Math.max(200, startEditorWidth + dx), containerWidth - 200);
    editorPanel.style.flex = 'none';
    editorPanel.style.width = newWidth + 'px';
    terminalPanel.style.flex = '1';
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      divider.classList.remove('dragging');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  });

  // ═══════════════════════════════════════════════════════════════
  // RESTAURATION depuis URL (partage)
  // ═══════════════════════════════════════════════════════════════

  const urlParams = new URLSearchParams(window.location.search);
  const sharedCode = urlParams.get('code');
  if (sharedCode) {
    try {
      const decoded = decodeURIComponent(escape(atob(sharedCode)));
      codeEditor.value = decoded;
      updateLineNumbers();
      appendTerminalLine('info', '📋 Code partagé chargé depuis l\'URL.');
    } catch {
      // ignore
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // INIT
  // ═══════════════════════════════════════════════════════════════

  updateLineNumbers();
  replInput.focus();

  // Bouton sidebar mobile
  const sidebarToggle = document.createElement('button');
  sidebarToggle.className = 'sidebar-mobile-toggle';
  sidebarToggle.innerHTML = '📂 Exemples';
  sidebarToggle.style.cssText = `
    display: none;
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    z-index: 150;
    padding: 0.6rem 1rem;
    border-radius: 99px;
    border: none;
    background: var(--color-primary);
    color: white;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    font-family: var(--font-body);
  `;
  document.body.appendChild(sidebarToggle);

  function checkMobile() {
    if (window.innerWidth <= 900) {
      sidebarToggle.style.display = 'block';
    } else {
      sidebarToggle.style.display = 'none';
      document.getElementById('repl-sidebar')?.classList.remove('open');
    }
  }
  checkMobile();
  window.addEventListener('resize', checkMobile);

  sidebarToggle.addEventListener('click', () => {
    document.getElementById('repl-sidebar')?.classList.toggle('open');
  });
});
