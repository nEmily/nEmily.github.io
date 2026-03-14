/**
 * TERMINAL.JS - Interactive terminal command system
 * Handles user input, command parsing, and output rendering
 */

(function() {
    'use strict';

    // ==========================================================================
    // CONFIGURATION
    // ==========================================================================

    const CONFIG = {
        prompt: '>',
        maxHistory: 50,
        typeDelay: 0 // ms between characters for "typing" effect (0 = instant)
    };

    // ==========================================================================
    // STATE
    // ==========================================================================

    const state = {
        history: [],
        historyIndex: -1,
        currentPath: '~',
        inputEnabled: true
    };

    // ==========================================================================
    // FILE SYSTEM (virtual)
    // ==========================================================================

    const fileSystem = {
        '~': {
            type: 'dir',
            children: ['about.txt', 'status.txt', 'experience.txt', 'skills/', 'projects/', 'contact.txt', 'resume.pdf']
        },
        '~/about.txt': {
            type: 'file',
            content: `<span class="comment"># hey, i'm emily</span>

I build things at <span class="highlight">Meta</span> (dev tooling for wearables — the
kind of infra where if you do it right, nobody notices).
Before that I shipped a <span class="highlight">Dolby Atmos plugin for Unreal
Engine</span> with Epic Games, which was cool.

On the side, I build party games for game night, a discord
bot that manages my household, and an AI agent swarm that
ships code while I sleep. I mostly make things I wish existed.

<span class="comment"># currently: rune factory 4 · stardew valley · hollow knight</span>`
        },
        '~/status.txt': {
            type: 'file',
            content: `<span class="comment"># what i'm working on</span>

<span class="highlight">splitsheet</span>              OCR receipt splitter — building
<span class="highlight">dude-were-so-cooked</span>     AI-curated news digest — building
<span class="highlight">AI orchestration</span>        agents manage the board, dispatch workers, ship PRs

<span class="comment"># currently playing</span>

Rune Factory 4 · Stardew Valley · Hollow Knight

<span class="comment"># status</span>

open to new opportunities → type <span class="command">linkedin</span> to connect`
        },
        '~/skills': {
            type: 'dir',
            children: ['languages/', 'frameworks/', 'tools/', 'ai/']
        },
        '~/skills/languages': {
            type: 'dir',
            children: ['python', 'typescript', 'javascript', 'cpp', 'csharp', 'java']
        },
        '~/skills/frameworks': {
            type: 'dir',
            children: ['fastapi', 'nodejs', 'playwright', 'asyncio', 'numpy', 'pandas']
        },
        '~/skills/tools': {
            type: 'dir',
            children: ['git', 'gitlab-ci', 'docker', 'aws', 'claude-code', 'llm-tooling']
        },
        '~/skills/ai': {
            type: 'dir',
            children: ['claude-code', 'prompt-engineering', 'multi-agent', 'llm-orchestration', 'tool-use', 'hook-automation']
        },
        '~/projects': {
            type: 'dir',
            children: ['roundhouse/', 'impostor-game/', 'crowd-sim/', 'thirdwheel/', 'one-night-werewolf/', 'killer-boba/', 'splitsheet/', 'dude-were-so-cooked/', 'ace-interview/']
        },
        '~/projects/roundhouse': {
            type: 'dir',
            content: `roundhouse
party game PWA for game night. 8 players, one phone, hot takes mode.
ships at: nemily.github.io/roundhouse

Tags: PWA, JavaScript, game`
        },
        '~/projects/impostor-game': {
            type: 'dir',
            content: `impostor-game
social deduction party game. find the impostor before they find you.
ships at: nemily.github.io/impostor-game

Tags: PWA, JavaScript, game`
        },
        '~/projects/one-night-werewolf': {
            type: 'dir',
            content: `one-night-werewolf
werewolf for when you only have 10 minutes and everyone's already suspicious.
ships at: nemily.github.io/one-night-werewolf

Tags: PWA, JavaScript, game`
        },
        '~/projects/thirdwheel': {
            type: 'dir',
            content: `thirdwheel
discord bot for my household. AI inbox, reminders, chaos management.
github: github.com/nEmily/thirdwheel

Tags: discord, bot, AI, JavaScript`
        },
        '~/projects/splitsheet': {
            type: 'dir',
            content: `splitsheet
snap a receipt, split it with friends, send venmo charges. that's it.
github: github.com/nEmily/splitsheet

Tags: OCR, mobile, React Native`
        },
        '~/projects/dude-were-so-cooked': {
            type: 'dir',
            content: `dude-were-so-cooked
AI-curated news digest. agents decide what's actually worth your attention.
github: github.com/nEmily/dude-were-so-cooked

Tags: AI, agents, news`
        },
        '~/projects/crowd-sim': {
            type: 'dir',
            content: `crowd-sim
NavMesh AI pedestrians navigating a live traffic intersection.
demo: nemily.github.io/traffic

Tags: AI, simulation, web`
        },
        '~/projects/killer-boba': {
            type: 'dir',
            content: `killer-boba
someone's boba is poisoned. figure out whose before you drink.

Tags: PWA, game`
        },
        '~/projects/ace-interview': {
            type: 'dir',
            content: `ace-interview
practice technical interviews with an AI that actually pushes back.

Tags: AI, web`
        },
        '~/projects/ai-powered-dev-tooling': {
            type: 'dir',
            content: `AI-Powered Developer Tooling
LLM tool-use automation system for autonomous coding agents
Hook-based orchestration, real-time terminal status indicators
Dual-agent pre-push code review gate and prompt-engineered iteration loops
Multi-agent framework with persistent cross-session memory

Tags: TypeScript, JavaScript, Claude Code, LLM, Orchestration`
        },
        '~/projects/dolby-atmos-unreal': {
            type: 'dir',
            content: `Dolby Atmos Plugin for Unreal Engine
Cross-platform real-time audio processing SDK
Released in collaboration with Epic Games

Tags: C++, Unreal, Audio
Link: https://news.dolby.com/en-WW/227541-dolby-releases-native-dolby-vision-and-dolby-atmos-plug-ins-for-unreal-engine`
        },
        '~/contact.txt': {
            type: 'file',
            content: `<span class="comment"># say hi</span>

Always down to chat about AI agents, party games,
or why Stardew Valley is a perfect game.

→ <a href="https://linkedin.com/in/nguyen-emily" class="link link-linkedin" target="_blank" rel="noopener">linkedin.com/in/nguyen-emily</a> — best way to reach me

<span class="contact-key">github</span>  <a href="https://github.com/nEmily" class="link" target="_blank" rel="noopener">github.com/nEmily</a>
<span class="contact-key">resume</span>  <a href="/assets/resume.pdf" class="link" target="_blank" rel="noopener">resume.pdf ↗</a>`
        },
        '~/experience.txt': {
            type: 'file',
            content: `<span class="comment"># work experience</span>

<span class="highlight">Meta</span> — Senior Software Engineer, Reality Labs  <span class="comment">2024–present</span>
  Built a hardware testing lab from scratch — 8 servers, 30+ devices.
  Claude-based IDE extension + LLM pipeline for auto-generating docs.
  Led 3 engineers, got an award for pioneering release testing.

<span class="highlight">Dolby Laboratories</span> — Senior SWE, Games/Audio/Test  <span class="comment">2021–2023</span>
  Shipped Dolby Atmos plugin for Unreal Engine with Epic Games.
  Made the CI pipeline 33% faster because life's too short for slow builds.

<span class="highlight">UC Berkeley</span> — B.S. Computer Science  <span class="comment">2017–2021</span>
  Taught kids to code. Ran a VR dev course. Peak college experience.

<span class="comment"># what's next? let's find out →</span> linkedin.com/in/nguyen-emily`
        },
        '~/resume.pdf': {
            type: 'file',
            content: '[Binary file - use "open resume.pdf" to download]'
        }
    };

    // ==========================================================================
    // COMMANDS
    // ==========================================================================

    const commands = {
        help: {
            description: 'Show available commands',
            usage: 'help [command]',
            execute: (args) => {
                if (args.length > 0) {
                    const cmd = commands[args[0]];
                    if (cmd) {
                        return `${args[0]}: ${cmd.description}\nUsage: ${cmd.usage}`;
                    }
                    return `help: no help for '${args[0]}'`;
                }

                const coreCommands = ['ls', 'cat', 'cd', 'pwd', 'clear', 'help'];
                const navCommands = ['resume', 'open', 'github', 'linkedin'];
                const funCommands = ['ask', 'search', 'theme', 'coffee', 'fortune', 'cowsay', 'neofetch', 'party'];
                const utilCommands = ['history', 'date', 'exit', 'whoami', 'echo'];

                let output = '<span class="comment"># navigation</span>\n';
                output += coreCommands.map(name => commands[name] ? `<span class="command">${name.padEnd(10)}</span> ${commands[name].description}` : '').filter(Boolean).join('\n');

                output += '\n\n<span class="comment"># links</span>\n';
                output += navCommands.map(name => commands[name] ? `<span class="command">${name.padEnd(10)}</span> ${commands[name].description}` : '').filter(Boolean).join('\n');

                output += '\n\n<span class="comment"># fun stuff</span>\n';
                output += funCommands.map(name => commands[name] ? `<span class="command">${name.padEnd(10)}</span> ${commands[name].description}` : '').filter(Boolean).join('\n');

                output += '\n\n<span class="comment"># keyboard shortcuts</span>\n';
                output += 'Cmd+T       New tab\n';
                output += 'Cmd+Shift+W Close tab\n';
                output += 'Cmd+1-9     Jump to tab\n';
                output += '↑/↓         Command history';

                return output;
            }
        },

        ls: {
            description: 'List directory contents',
            usage: 'ls [path]',
            execute: (args) => {
                const path = resolvePath(args[0] || '.');
                const node = fileSystem[path];

                if (!node) {
                    return `ls: cannot access '${args[0] || '.'}': No such file or directory`;
                }

                if (node.type === 'file') {
                    return args[0] || path.split('/').pop();
                }

                if (node.children) {
                    return node.children.map(child => {
                        const isDir = child.endsWith('/');
                        return isDir
                            ? `<span class="highlight">${child}</span>`
                            : child;
                    }).join('  ');
                }

                return '';
            }
        },

        cat: {
            description: 'Display file contents',
            usage: 'cat <file>',
            execute: (args) => {
                if (!args[0]) {
                    return 'cat: missing file operand';
                }

                const path = resolvePath(args[0]);
                const node = fileSystem[path];

                if (!node) {
                    return `cat: ${args[0]}: No such file or directory`;
                }

                if (node.type === 'dir') {
                    return `cat: ${args[0]}: Is a directory`;
                }

                return node.content;
            }
        },

        cd: {
            description: 'Change directory',
            usage: 'cd <directory>',
            execute: (args) => {
                if (!args[0] || args[0] === '~') {
                    state.currentPath = '~';
                    return '';
                }

                const path = resolvePath(args[0]);
                const node = fileSystem[path];

                if (!node) {
                    return `cd: ${args[0]}: No such file or directory`;
                }

                if (node.type === 'file') {
                    return `cd: ${args[0]}: Not a directory`;
                }

                state.currentPath = path;
                return '';
            }
        },

        pwd: {
            description: 'Print working directory',
            usage: 'pwd',
            execute: () => state.currentPath
        },

        clear: {
            description: 'Clear the terminal',
            usage: 'clear',
            execute: () => {
                const terminal = getActiveTerminal();
                const lines = terminal.querySelectorAll('.terminal-line:not(.input-line), .output, .ascii-art');
                lines.forEach(line => line.remove());
                return null; // null = no output
            }
        },

        history: {
            description: 'Show command history',
            usage: 'history',
            execute: () => {
                if (state.history.length === 0) {
                    return '<span class="comment"># no commands in history</span>';
                }
                return state.history
                    .slice(0, 20)
                    .map((cmd, i) => `<span class="comment">${String(i + 1).padStart(3)}</span>  ${cmd}`)
                    .reverse()
                    .join('\n');
            }
        },

        exit: {
            description: 'Close the terminal',
            usage: 'exit',
            execute: () => {
                setTimeout(() => {
                    if (window.tabManager) {
                        window.tabManager.closeTab(window.tabManager.getActiveTab());
                    }
                }, 500);
                return 'Goodbye! 👋';
            }
        },

        whoami: {
            description: 'Display current user',
            usage: 'whoami',
            execute: () => 'emily'
        },

        echo: {
            description: 'Display a line of text',
            usage: 'echo <text>',
            execute: (args) => args.join(' ')
        },

        open: {
            description: 'Open a file or link',
            usage: 'open <file>',
            execute: (args) => {
                if (!args[0]) {
                    return 'open: missing file operand';
                }

                if (args[0] === 'resume.pdf') {
                    window.open('/assets/resume.pdf', '_blank');
                    return 'Opening resume.pdf...';
                }

                // Check if it's a project with a link
                const path = resolvePath(args[0]);
                const node = fileSystem[path];
                if (node && node.content) {
                    const linkMatch = node.content.match(/Link: (https?:\/\/[^\s]+)/);
                    if (linkMatch) {
                        window.open(linkMatch[1], '_blank');
                        return `Opening ${linkMatch[1]}...`;
                    }
                }

                return `open: ${args[0]}: Cannot open file`;
            }
        },

        resume: {
            description: 'Open resume PDF',
            usage: 'resume',
            execute: () => {
                window.open('/assets/resume.pdf', '_blank');
                return 'Opening resume.pdf...\n<span class="comment"># tip: also available at the desktop icon or ~/contact</span>';
            }
        },

        theme: {
            description: 'Change color theme',
            usage: 'theme [meadow|rainy]',
            execute: (args) => {
                const tm = window.themeManager;
                if (!tm) {
                    return 'Theme manager not loaded';
                }

                if (!args[0]) {
                    const current = tm.getCurrentTheme();
                    const themes = tm.getThemes();
                    return `Current theme: ${current}\nAvailable: ${themes.join(', ')}`;
                }

                if (tm.setTheme(args[0])) {
                    return `Theme set to ${args[0]}`;
                }

                return `theme: unknown theme '${args[0]}'\nAvailable: ${tm.getThemes().join(', ')}`;
            }
        },

        search: {
            description: 'Search content for keywords',
            usage: 'search <keyword>',
            execute: (args) => {
                if (!args[0]) {
                    return 'search: missing keyword';
                }

                const keyword = args.join(' ').toLowerCase();
                const results = [];

                Object.entries(fileSystem).forEach(([path, node]) => {
                    if (node.content && node.content.toLowerCase().includes(keyword)) {
                        results.push(path);
                    }
                });

                if (results.length === 0) {
                    return `No results for "${args.join(' ')}"`;
                }

                return `<span class="comment"># found ${results.length} result(s)</span>\n\n` +
                    results.map(r => `<span class="command">${r}</span>`).join('\n');
            }
        },

        github: {
            description: 'Show GitHub profile',
            usage: 'github',
            execute: () => {
                window.open('https://github.com/nEmily', '_blank');
                return 'Opening github.com/nEmily...';
            }
        },

        linkedin: {
            description: 'Show LinkedIn profile',
            usage: 'linkedin',
            execute: () => {
                window.open('https://linkedin.com/in/nguyen-emily', '_blank');
                return 'Opening LinkedIn...';
            }
        },

        ask: {
            description: 'Ask a question (natural language)',
            usage: 'ask <question>',
            execute: (args) => {
                if (!args[0]) {
                    return '<span class="comment"># ask me anything!</span>\n\nTry: ask what do you do?\n     ask tell me about your projects';
                }

                const question = args.join(' ').toLowerCase();
                return getAskResponse(question);
            }
        },

        hi: {
            description: 'Say hello',
            usage: 'hi',
            execute: () => {
                const greetings = [
                    "Hey there! Welcome to my corner of the internet.",
                    "Hi! Thanks for stopping by. Type 'help' to see what you can do here.",
                    "Hello! I'm Emily. Feel free to explore with 'ls' or 'ask' me something!"
                ];
                return greetings[Math.floor(Math.random() * greetings.length)];
            }
        }
    };

    // Aliases
    commands.dir = commands.ls;
    commands['?'] = commands.help;
    commands.hello = commands.hi;
    commands.hey = commands.hi;
    commands.cv = commands.resume;

    // Board shortcut — redirects to ~/projects tab
    commands.board = {
        description: 'Open the projects tab',
        usage: 'board',
        execute: () => {
            setTimeout(() => {
                if (window.tabManager) {
                    window.tabManager.switchTab('projects');
                }
            }, 100);
            return 'Switching to ~/projects...';
        }
    };

    // Git — switches to experience tab
    commands.git = {
        description: 'View career history',
        usage: 'git log',
        execute: (args) => {
            if (args[0] === 'log') {
                setTimeout(() => {
                    if (window.tabManager) {
                        window.tabManager.switchTab('experience');
                    }
                }, 100);
                return '<span class="comment">cd ~/career && git log --oneline</span>';
            }
            if (args[0] === 'blame') {
                return 'Everything is Emily\'s fault. She takes full credit.';
            }
            if (args[0] === 'push') {
                return 'Everything is already deployed. Relax.';
            }
            if (args[0] === 'status') {
                return 'On branch main\nnothing to commit, working tree clean\n<span class="comment">(career is on track)</span>';
            }
            return `usage: git log | git status | git blame`;
        }
    };

    // pj — switches to projects tab (matches the TUI command shown)
    commands.pj = {
        description: 'Project dashboard',
        usage: 'pj [status]',
        execute: (args) => {
            setTimeout(() => {
                if (window.tabManager) {
                    window.tabManager.switchTab('projects');
                }
            }, 100);
            return '<span class="comment">launching project dashboard...</span>';
        }
    };

    // Status shortcut — shows ~/status.txt inline
    commands.status = {
        description: 'Show current status and what I\'m working on',
        usage: 'status',
        execute: () => fileSystem['~/status.txt'].content
    };

    // ==========================================================================
    // EASTER EGGS
    // ==========================================================================

    commands.sudo = {
        description: 'Superuser do',
        usage: 'sudo <command>',
        execute: (args) => {
            if (args[0] === 'hire' && args[1] === 'emily') {
                return `<span class="highlight">Permission granted!</span>\n\nGreat choice. Let's connect:\n• linkedin: linkedin.com/in/nguyen-emily\n• github: github.com/nEmily`;
            }
            if (args[0] === 'make' && args[1] === 'me' && args[2] === 'a' && args[3] === 'sandwich') {
                return "Okay.";
            }
            return `Sorry, user is not in the sudoers file. This incident will be reported.`;
        }
    };

    commands.coffee = {
        description: 'Brew some coffee',
        usage: 'coffee',
        execute: () => {
            const coffees = [
                "☕ Brewing a fresh cup of coffee...\n\n<span class='highlight'>Perfect!</span> Now let's get coding.",
                "☕ *coffee machine noises*\n\nHere's your coffee! Fun fact: I'm powered by caffeine and curiosity.",
                "☕ One oat milk latte, coming right up!\n\n...okay, it's just regular coffee. But pretend it's fancy."
            ];
            return coffees[Math.floor(Math.random() * coffees.length)];
        }
    };

    commands.party = {
        description: 'Start a party',
        usage: 'party',
        execute: () => {
            setTimeout(() => {
                document.body.style.animation = 'rainbow 2s linear';
                setTimeout(() => {
                    document.body.style.animation = '';
                }, 2000);
            }, 100);
            return "🎉 🎊 🥳 Party mode activated! 🥳 🎊 🎉";
        }
    };

    commands.matrix = {
        description: 'Enter the matrix',
        usage: 'matrix',
        execute: () => {
            return `<span class="command">Wake up, Neo...</span>\n<span class="comment">The Matrix has you...</span>\n<span class="highlight">Follow the white rabbit.</span>\n\n<span class="comment"># Just kidding. But wouldn't that be cool?</span>`;
        }
    };

    commands.date = {
        description: 'Display current date and time',
        usage: 'date',
        execute: () => {
            const now = new Date();
            return now.toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        }
    };

    commands.fortune = {
        description: 'Get a random fortune',
        usage: 'fortune',
        execute: () => {
            const fortunes = [
                "A beautiful, smart, and loving person will be coming into your life.",
                "Your code will compile on the first try today.",
                "The bug you're looking for is on line 42.",
                "A journey of a thousand miles begins with a single 'git init'.",
                "Today is a good day to push to production. Just kidding. Never push on Friday.",
                "You will find joy in the small things. Like when tests pass.",
                "The best time to plant a tree was 20 years ago. The second best time is now. Same goes for learning Rust.",
                "Your future is bright, like an unthemed terminal with a white background."
            ];
            return `🔮 ${fortunes[Math.floor(Math.random() * fortunes.length)]}`;
        }
    };

    commands.cowsay = {
        description: 'Have a cow say something',
        usage: 'cowsay <message>',
        execute: (args) => {
            const message = args.length > 0 ? args.join(' ') : 'Moo!';
            const line = '─'.repeat(message.length + 2);
            return `<span class="command">
 ╭${line}╮
 │ ${message} │
 ╰${line}╯
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||</span>`;
        }
    };

    commands.neofetch = {
        description: 'Display system info',
        usage: 'neofetch',
        execute: () => {
            return `<span class="highlight">
   ╭──────────────────╮
   │  <span class="command">emily@portfolio</span>  │
   ╰──────────────────╯</span>
   <span class="comment">OS:</span> Emily's Cozy Terminal v1.0
   <span class="comment">Host:</span> GitHub Pages
   <span class="comment">Shell:</span> custom-bash
   <span class="comment">Theme:</span> ${window.themeManager?.getCurrentTheme() || 'kanagawa'}
   <span class="comment">Terminal:</span> JetBrains Mono
   <span class="comment">CPU:</span> Caffeine-powered
   <span class="comment">Memory:</span> Full of game night ideas
   <span class="comment">Uptime:</span> since 2019`;
        }
    };

    commands.claude = {
        description: 'Talk to Claude',
        usage: 'claude <message>',
        execute: (args) => {
            if (args.length === 0) {
                return `<span class="highlight">Claude Code</span> <span class="comment">v1.0.0</span>

Hi! I'm Claude, but I'm currently on coffee break. ☕

<span class="comment"># Fun fact:</span> I helped build this website!

Try <span class="command">ask</span> to chat with Emily instead,
or <span class="command">sudo hire emily</span> if you're recruiting.`;
            }

            const message = args.join(' ').toLowerCase();

            if (message.includes('help') || message.includes('how')) {
                return `I'd love to help, but I'm just an easter egg here! 🥚

Try these instead:
  <span class="command">help</span>     - see all commands
  <span class="command">ask</span>      - ask Emily a question
  <span class="command">cat</span>      - read files`;
            }

            if (message.includes('hello') || message.includes('hi')) {
                return `Hello! 👋 Nice to meet you!

I helped Emily build this portfolio. Pretty cool, right?
Type <span class="command">help</span> to explore!`;
            }

            if (message.includes('build') || message.includes('make') || message.includes('code')) {
                return `<span class="comment"># thinking...</span>

I'd write some code for you, but Emily said I need to take a break.
Something about "AI boundaries" and "work-life balance"? 🤷

Check out <span class="command">ls projects/</span> to see what we built together!`;
            }

            const responses = [
                "Interesting! But I'm off-duty. Try <span class='command'>ask</span> to chat with Emily!",
                "*pretends to think deeply* ...Have you tried <span class='command'>fortune</span>?",
                "I'm flattered you want to talk! But <span class='command'>coffee</span> first?",
                "Beep boop. AI processing... Just kidding. Try <span class='command'>help</span>!",
                "I'm in read-only mode on this site. But I did help build it! 🎨"
            ];

            return responses[Math.floor(Math.random() * responses.length)];
        }
    };

    // Aliases for claude
    commands.ai = commands.claude;
    commands.chatgpt = {
        description: 'Wrong AI',
        usage: 'chatgpt',
        execute: () => `<span class="comment"># error: wrong AI</span>

This site was made with <span class="highlight">Claude</span>, not ChatGPT!
Try <span class="command">claude</span> instead. 😉`
    };

    // ==========================================================================
    // NATURAL LANGUAGE RESPONSES
    // ==========================================================================

    function getAskResponse(question) {
        // Knowledge base for Q&A
        const responses = [
            {
                patterns: ['who are you', 'about you', 'tell me about yourself', 'introduce yourself'],
                response: `swe @ meta | uc berkeley cs

I build autonomous AI agents that manage a kanban board, dispatch workers across projects, and ship code while I sleep. I wake up, review what my team did overnight, and merge the good stuff.

also: party games for game night, a discord bot for my household, and a receipt splitter for when someone always orders the lobster.`
            },
            {
                patterns: ['what do you do', 'your job', 'your work', 'current role', 'where do you work'],
                response: `swe @ meta, working on test infrastructure for Reality Labs.

outside of that: I build autonomous AI agents that manage a kanban board, dispatch workers across projects, and ship code overnight. I review in the morning.

the projects are real — roundhouse runs at actual game nights, thirdwheel is in my household discord, splitsheet is for when we go out.`
            },
            {
                patterns: ['projects', 'what have you built', 'portfolio', 'your work'],
                response: `Check the <span class="command">~/projects</span> tab for the full list.

shipped:
<span class="highlight">roundhouse</span>          party game PWA for game night
<span class="highlight">impostor-game</span>       social deduction party game
<span class="highlight">crowd-sim</span>           NavMesh AI pedestrian sim
<span class="highlight">thirdwheel</span>          discord bot for my household

building:
<span class="highlight">splitsheet</span>          OCR receipt splitter
<span class="highlight">dude-were-so-cooked</span> AI-curated news digest
<span class="highlight">ace-interview</span>       AI interview practice

Type 'ls projects/' or 'cat ~/projects/[name]' for details.`
            },
            {
                patterns: ['skills', 'languages', 'tech stack', 'technologies', 'what can you code'],
                response: `<span class="comment"># AI & LLM tooling  ← primary focus</span>
Claude Code, prompt engineering, LLM orchestration, multi-agent frameworks
tool-use pipelines, hook-based automation, persistent agent memory

<span class="comment"># languages</span>
Python, TypeScript, JavaScript, C++, C#, Java

<span class="comment"># frameworks & tools</span>
FastAPI, Node.js, Playwright, asyncio, NumPy, Pandas
Git, GitLab CI/CD, Docker, AWS

Type 'ls ~/skills/ai/' to see the full AI toolkit.`
            },
            {
                patterns: ['games', 'game dev', 'video games', 'game development'],
                response: `I love making games! Check out the <span class="command">~/projects</span> tab — most of my shipped work is party games:

• <span class="highlight">roundhouse</span> - party game PWA, 8 players, one phone
• <span class="highlight">impostor-game</span> - social deduction party game
• <span class="highlight">crowd-sim</span> - NavMesh AI pedestrian simulation

At Dolby, I also worked closely with game studios and Epic Games on audio technology.`
            },
            {
                patterns: ['education', 'school', 'university', 'degree', 'berkeley'],
                response: `I graduated from <span class="highlight">UC Berkeley</span> with a B.S. in Computer Science in 2020.

While there, I was also a teaching assistant and XR/VR course facilitator.`
            },
            {
                patterns: ['kanban', 'board', 'overnight', 'agents ship', 'while you sleep'],
                response: `my AI agents manage a kanban board (shipped / building / idea), dispatch workers across projects, and push PRs while I sleep.

I wake up, review what the team did overnight, and merge the good stuff. one of them once refactored something I'd been meaning to fix for three months and didn't even mention it.

the orchestrator has opinions. it pushes back. it's fine. mostly.

→ check the <span class="command">~/projects</span> tab to see what's shipped and what's building`
            },
            {
                patterns: ['ai', 'llm', 'machine learning', 'agent', 'claude', 'prompt', 'orchestrat'],
                response: `AI is my primary focus area right now. Current work:

<span class="highlight">multi-agent orchestration</span> — task graphs, dispatching, persistent cross-session memory
<span class="highlight">hook-based automation</span> — Claude Code hooks for pre-push review gates, status indicators
<span class="highlight">autonomous coding agents</span> — agents that plan, execute, and validate end-to-end

At Meta, I built an AI agent pipeline that auto-generates team wiki docs from code changes.

This portfolio itself was built with Claude Code. Type <span class="command">status</span> to see what I'm building now.`
            },
            {
                patterns: ['status', 'working on', 'current project', 'right now', 'lately'],
                response: `Right now I'm building:

• <span class="highlight">AI orchestration systems</span> — multi-agent task graphs with persistent memory
• <span class="highlight">Autonomous coding agents</span> — hook-based Claude Code workflows
• <span class="highlight">Developer tooling</span> — real-time agent status, pixel-art visualizer (Pixietown)

Type <span class="command">cat ~/status.txt</span> for the full picture.`
            },
            {
                patterns: ['contact', 'reach you', 'hire', 'get in touch', 'email'],
                response: `You can reach me at:

<span class="command">github</span>   github.com/nEmily
<span class="command">linkedin</span> linkedin.com/in/nguyen-emily

Or just type 'github' or 'linkedin' to open directly!`
            },
            {
                patterns: ['teaching', 'teach', 'educator', 'coder school'],
                response: `I taught programming at <span class="highlight">the Coder School</span> from 2019-2021, working with students ages 7-16.

I led personalized sessions in Python, Java, Scratch, and C#, and ran week-long camps with 12-14 students each.

I also facilitated a VR development course at UC Berkeley, teaching Unity and C#.`
            },
            {
                patterns: ['dolby', 'atmos', 'audio'],
                response: `At <span class="highlight">Dolby Laboratories</span> (2021-2023), I was a Senior Software Engineer on the Games & Audio team.

Key work:
• Released the Dolby Atmos Plugin for Unreal Engine with Epic Games
• Built Python interfaces for the real-time audio C++/C SDK
• Optimized CI/CD pipelines, improving speed by 33%
• Authored game levels for testing and visualization`
            },
            {
                patterns: ['meta', 'reality labs', 'facebook'],
                response: `I joined <span class="highlight">Meta</span> in 2024 as a Senior Software Engineer.

I design test automation pipelines for wearable devices, lead a 3-engineer testing team, and build AI-powered developer tools — including an LLM IDE plugin and an AI agent pipeline that auto-generates wiki docs from code changes.

Also surfaced 72 bugs pre-release and helped define the org's first structured software test strategy.`
            },
            {
                patterns: ['hobby', 'hobbies', 'fun', 'free time', 'interests'],
                response: `When I'm not coding, I enjoy:
• Playing games (Animal Crossing, Rune Factory, Stardew Valley)
• Game development as a creative outlet
• Exploring local food scenes
• Teaching and mentoring`
            }
        ];

        // Find matching response
        for (const item of responses) {
            for (const pattern of item.patterns) {
                if (question.includes(pattern)) {
                    return item.response;
                }
            }
        }

        // Default response
        return `Hmm, I'm not sure about that. Try asking about:
• my projects or work
• my skills and tech stack
• my education
• how to contact me

Or use 'search [keyword]' to find specific content.`;
    }

    // ==========================================================================
    // HELPER FUNCTIONS
    // ==========================================================================

    function commonPrefix(strings) {
        if (strings.length === 0) return '';
        let prefix = strings[0];
        for (let i = 1; i < strings.length; i++) {
            while (!strings[i].toLowerCase().startsWith(prefix.toLowerCase())) {
                prefix = prefix.slice(0, -1);
                if (!prefix) return '';
            }
        }
        // Return the prefix using the case from the first match
        return prefix;
    }

    function resolvePath(inputPath) {
        if (!inputPath || inputPath === '.') {
            return state.currentPath;
        }

        if (inputPath.startsWith('~/')) {
            return inputPath.replace(/\/$/, '');
        }

        if (inputPath === '~') {
            return '~';
        }

        if (inputPath === '..') {
            const parts = state.currentPath.split('/');
            parts.pop();
            return parts.length === 0 ? '~' : parts.join('/');
        }

        // Relative path
        let path = state.currentPath === '~'
            ? `~/${inputPath}`
            : `${state.currentPath}/${inputPath}`;

        return path.replace(/\/$/, '');
    }

    function getActiveTerminal() {
        return document.querySelector('.tab-content.active');
    }

    function parseCommand(input) {
        const trimmed = input.trim();
        if (!trimmed) return null;

        const parts = trimmed.split(/\s+/);
        return {
            name: parts[0].toLowerCase(),
            args: parts.slice(1)
        };
    }

    function executeCommand(input) {
        const parsed = parseCommand(input);
        if (!parsed) return '';

        const cmd = commands[parsed.name];
        if (!cmd) {
            return `<span class="highlight">${parsed.name}</span>: command not found. Type 'help' for available commands.`;
        }

        return cmd.execute(parsed.args);
    }

    // ==========================================================================
    // DOM MANIPULATION
    // ==========================================================================

    function createInputLine() {
        const line = document.createElement('div');
        line.className = 'terminal-line input-line';
        line.innerHTML = `
            <span class="prompt">${CONFIG.prompt}</span>
            <span class="input-text" contenteditable="true" spellcheck="false"></span>
        `;
        return line;
    }

    function addOutput(text, terminal) {
        if (text === null) return; // null means no output (e.g., clear)

        const output = document.createElement('div');
        output.className = 'output output-dynamic';
        output.innerHTML = text;

        const inputLine = terminal.querySelector('.input-line');
        terminal.insertBefore(output, inputLine);
    }

    function addCommandLine(input, terminal) {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = `
            <span class="prompt">${CONFIG.prompt}</span>
            <span class="command">${escapeHtml(input)}</span>
        `;

        const inputLine = terminal.querySelector('.input-line');
        terminal.insertBefore(line, inputLine);
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ==========================================================================
    // INPUT HANDLING
    // ==========================================================================

    function handleInput(e) {
        const inputEl = e.target;
        const terminal = getActiveTerminal();

        if (e.key === 'Enter') {
            e.preventDefault();
            const input = inputEl.textContent.trim();

            if (input) {
                // Add to history
                state.history.unshift(input);
                if (state.history.length > CONFIG.maxHistory) {
                    state.history.pop();
                }
                state.historyIndex = -1;

                // Show command
                addCommandLine(input, terminal);

                // Execute and show output
                const output = executeCommand(input);
                addOutput(output, terminal);
            }

            // Clear input
            inputEl.textContent = '';

            // Scroll to bottom
            terminal.scrollTop = terminal.scrollHeight;
        }

        // History navigation
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (state.historyIndex < state.history.length - 1) {
                state.historyIndex++;
                inputEl.textContent = state.history[state.historyIndex];
                // Move cursor to end
                placeCaretAtEnd(inputEl);
            }
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (state.historyIndex > 0) {
                state.historyIndex--;
                inputEl.textContent = state.history[state.historyIndex];
                placeCaretAtEnd(inputEl);
            } else if (state.historyIndex === 0) {
                state.historyIndex = -1;
                inputEl.textContent = '';
            }
        }

        // Tab completion (basic)
        if (e.key === 'Tab') {
            e.preventDefault();
            const input = inputEl.textContent;
            const parts = input.split(/\s+/);
            const lastPart = parts[parts.length - 1];

            if (parts.length === 1) {
                // Command completion
                const matches = Object.keys(commands).filter(cmd => cmd.startsWith(lastPart));
                if (matches.length === 1) {
                    inputEl.textContent = matches[0] + ' ';
                    placeCaretAtEnd(inputEl);
                } else if (matches.length > 1) {
                    const terminal = getActiveTerminal();
                    addOutput(matches.join('  '), terminal);
                    const common = commonPrefix(matches);
                    if (common.length > lastPart.length) {
                        inputEl.textContent = common;
                        placeCaretAtEnd(inputEl);
                    }
                }
            } else {
                // File/directory path completion
                const partial = lastPart;
                let parentPath, prefix;

                if (partial.includes('/')) {
                    const lastSlash = partial.lastIndexOf('/');
                    const dirPart = partial.substring(0, lastSlash) || (partial.startsWith('~/') ? '~' : '');
                    parentPath = dirPart ? resolvePath(dirPart) : state.currentPath;
                    prefix = partial.substring(lastSlash + 1);
                } else {
                    parentPath = state.currentPath;
                    prefix = partial;
                }

                const parentNode = fileSystem[parentPath];
                if (parentNode && parentNode.children) {
                    const matches = parentNode.children.filter(c =>
                        c.replace(/\/$/, '').toLowerCase().startsWith(prefix.toLowerCase())
                    );
                    if (matches.length === 1) {
                        const basePath = partial.includes('/')
                            ? partial.substring(0, partial.lastIndexOf('/') + 1)
                            : '';
                        parts[parts.length - 1] = basePath + matches[0];
                        // Add trailing space for files (not dirs)
                        if (!matches[0].endsWith('/')) parts[parts.length - 1] += ' ';
                        inputEl.textContent = parts.join(' ');
                        placeCaretAtEnd(inputEl);
                    } else if (matches.length > 1) {
                        const terminal = getActiveTerminal();
                        addOutput(matches.join('  '), terminal);
                        const common = commonPrefix(matches);
                        if (common.length > prefix.length) {
                            const basePath = partial.includes('/')
                                ? partial.substring(0, partial.lastIndexOf('/') + 1)
                                : '';
                            parts[parts.length - 1] = basePath + common;
                            inputEl.textContent = parts.join(' ');
                            placeCaretAtEnd(inputEl);
                        }
                    }
                }
            }
        }
    }

    function placeCaretAtEnd(el) {
        el.focus();
        const range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }

    // ==========================================================================
    // INITIALIZATION
    // ==========================================================================

    function init() {
        // Add input lines to all terminals
        document.querySelectorAll('.tab-content').forEach(terminal => {
            // Remove existing static input line
            const existingInput = terminal.querySelector('.input-line');
            if (existingInput) {
                existingInput.remove();
            }

            // Add interactive input line
            const inputLine = createInputLine();
            terminal.appendChild(inputLine);

            // Add event listener
            const inputEl = inputLine.querySelector('.input-text');
            inputEl.addEventListener('keydown', handleInput);
        });

        // Focus on click anywhere in terminal
        document.querySelectorAll('.terminal').forEach(terminal => {
            terminal.addEventListener('click', (e) => {
                if (!e.target.closest('.input-text')) {
                    const activeTerminal = getActiveTerminal();
                    const inputEl = activeTerminal.querySelector('.input-text');
                    if (inputEl) inputEl.focus();
                }
            });
        });

        // Focus input when tab changes
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                setTimeout(() => {
                    const activeTerminal = getActiveTerminal();
                    const inputEl = activeTerminal.querySelector('.input-text');
                    if (inputEl) inputEl.focus({ preventScroll: true });
                }, 50);
            });
        });
    }

    /**
     * Initialize terminal input for a specific tab (used for dynamic tabs)
     */
    function initTabTerminal(tabContent) {
        // Check if it already has an interactive input
        const existingInteractive = tabContent.querySelector('.input-text');
        if (existingInteractive && existingInteractive.hasAttribute('data-initialized')) {
            return;
        }

        // Remove existing static input line if present
        const existingInput = tabContent.querySelector('.input-line');
        if (existingInput && !existingInput.querySelector('.input-text')) {
            existingInput.remove();
        }

        // Add interactive input line if not present
        if (!tabContent.querySelector('.input-line')) {
            const inputLine = createInputLine();
            tabContent.appendChild(inputLine);
        }

        // Add event listener to the input
        const inputEl = tabContent.querySelector('.input-text');
        if (inputEl && !inputEl.hasAttribute('data-initialized')) {
            inputEl.addEventListener('keydown', handleInput);
            inputEl.setAttribute('data-initialized', 'true');
        }
    }

    // Expose function for dynamic tab creation
    window.initTerminalInput = initTabTerminal;

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
