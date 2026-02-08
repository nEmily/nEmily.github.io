# Emily's Cozy Terminal Portfolio - Working Document

## Project Overview
A personal portfolio website with a cozy terminal aesthetic - terminal functionality reimagined with warm, inviting colors inspired by games like Animal Crossing and Rune Factory. Hosted on GitHub Pages.

**Current status:** Website feature-complete. Ready for deployment after adding resume.pdf and og-image.png.

---

## File Index

```
cozy-terminal-site/
├── WORKING_DOC.md          # This file - project context & TODOs
├── src/
│   ├── index.html          # Main HTML structure ✅
│   ├── styles/
│   │   ├── main.css        # Core layout & terminal structure ✅
│   │   ├── themes/
│   │   │   ├── meadow.css  # Warm sunshine meadow theme (default) ✅
│   │   │   └── rainy.css   # Cool lavender/pink theme (TODO)
│   │   └── backdrop.css    # Watercolor background styles ✅
│   ├── scripts/
│   │   ├── tabs.js         # Tab management (switch, keyboard shortcuts) ✅
│   │   ├── terminal.js     # Interactive terminal commands ✅
│   │   ├── window.js       # Window controls (close/min/max/restore) ✅
│   │   └── themes.js       # Theme switching logic (TODO)
│   └── content/
│       └── data.json       # All text content (bio, skills, projects, etc.) ✅
├── mockups/                 # Design reference files
│   ├── mockup-v1f.html     # Cool-tone version (reference for rainy theme)
│   ├── mockup-v1g.html     # APPROVED - warm meadow version
│   ├── mockup-v2.html      # Fantasy RPG style (reference)
│   └── mockup-v3.html      # Modern hybrid (reference)
└── assets/
    └── resume.pdf          # (TODO: add resume)
```

---

## Design Decisions

### Approved Design: mockup-v1g.html
- **Layout:** Off-center terminal window on watercolor backdrop
- **Color palette:** Warm browns, mint, peach, butter, lavender, rose
- **Backdrop:** Watercolor sunshine meadow (CSS gradients)
- **Terminal style:** Dark background, colored syntax highlighting
- **Typography:** VT323 (mono), Nunito (UI elements)

### Key Visual Elements
- Window frame with brown gradient title bar
- Traffic light buttons (peach/butter/mint)
- Tab bar with `~/home`, `~/projects`, `~/games`, `~/contact`
- ASCII art header box
- Prompt: `>` in peach, commands in mint
- Skills as bordered tags
- Blinking mint cursor

---

## Content Structure

Content lives in `src/content/data.json` for easy updates:

```json
{
  "name": "Emily Nguyen",
  "location": "Bay Area, CA",
  "roles": ["software engineer", "game dev", "educator"],
  "bio": "...",
  "skills": ["python", "javascript", ...],
  "links": {
    "resume": "...",
    "github": "...",
    "linkedin": "...",
    "email": "..."
  },
  "projects": [...],
  "games": [...]
}
```

---

## TODO List

### Phase 1: Core Build ✅
- [x] Set up project structure (src/, assets/, etc.)
- [x] Create modular CSS architecture
- [x] Build index.html with semantic structure
- [x] Implement base terminal styles (from v1g)
- [x] Add watercolor backdrop
- [x] Populate with real content from resume

### Phase 2: Terminal Commands ✅
- [x] Implement tab switching with keyboard shortcuts
- [x] Add working terminal input with command parsing
- [x] Basic commands: `help`, `ls`, `cat`, `cd`, `clear`, `whoami`, `pwd`, `echo`
- [x] Command history (up/down arrows)
- [x] Tab completion for commands

### Phase 3: Search & AI Features ✅
- [x] Search feature - `search` command finds keywords in content
- [x] Natural language Q&A - `ask` command with knowledge base
  - Pre-written responses for common queries about work, projects, skills, etc.

### Phase 4: Window & Tab Management ✅
- [x] Window buttons functional (close/minimize/maximize)
- [x] Restore button appears when window hidden/minimized
- [x] Escape key restores window
- [x] **Create new tabs** - clicking + button creates a new terminal tab
- [x] **Close tabs** - X button on dynamic tabs (core tabs protected)
- [x] **Dynamic tab content** - new tabs have fresh terminal session
- [x] **Keyboard shortcuts** - Cmd/Ctrl+T (new), Cmd/Ctrl+W (close), Cmd/Ctrl+1-9 (jump)

### Phase 5: Themes ✅
- [x] Create rainy.css theme (cool lavender/pink from v1f)
- [x] Add theme switcher via `theme` terminal command
- [x] Store theme preference in localStorage
- [ ] Weather-connected themes (stretch goal)

### Phase 6: Polish & Deploy ✅
- [x] Add meta tags for SEO/social sharing (Open Graph, Twitter cards)
- [x] Add favicon (SVG terminal icon)
- [x] Created assets folder structure
- [ ] Add resume.pdf to assets (user task)
- [ ] Add og-image.png for social preview (user task)
- [ ] Set up GitHub Pages repository (user task)

### Ideas / Stretch Goals
- [x] Desktop icons when terminal is closed
  - Terminal icon: double-click to reopen terminal
  - Resume icon: opens resume.pdf in new tab
- [x] Draggable window (drag by title bar, double-click to maximize)
- [x] Resizable window (drag edges/corners to resize)
- [x] Close all tabs → shows desktop with icons
- [ ] Terminal sound effects (typing, command execution)
- [x] Easter egg commands: sudo, coffee, party, matrix, fortune, cowsay, neofetch
- [x] Utility commands: history, date, exit 

---

## Session Progress

### Session 1
1. Reviewed existing site at nemily.github.io
2. Created multiple mockup iterations:
   - v1: Animal Crossing warm tones
   - v1a-v1e: Various refinements
   - v1f: Cool lavender/pink tones with backdrop
   - v1g: **APPROVED** - warm meadow, wider/shorter terminal
   - v2: Fantasy RPG style (too game-like)
   - v3: Modern hybrid dark mode
3. Key iterations:
   - Added tab bar for folder structure
   - Made terminal off-center with watercolor backdrop
   - Removed "Welcome to Emily's Corner" and "@cozy"
   - Simplified prompt to just `>`
   - Made terminal wider and shorter
   - Switched to warm meadow color palette
4. Established modular file structure for maintainability

### Session 2
1. Read resume from /Users/emily/projects/Resume_Emily_Nguyen/
2. Built modular project structure:
   - `src/content/data.json` - all content in one place
   - `src/styles/main.css` - layout (theme-agnostic)
   - `src/styles/backdrop.css` - watercolor texture
   - `src/styles/themes/meadow.css` - all colors
   - `src/scripts/tabs.js` - tab switching with keyboard
3. Created full 4-tab site:
   - ~/home - intro, about, skills
   - ~/projects - portfolio items
   - ~/games - game demos (placeholder)
   - ~/contact - links
4. Content populated from resume:
   - Meta (Seattle), Dolby, Coder School, Lokafy experience
   - UC Berkeley education
   - Skills: Python, C++, C#, Unity, Unreal, CI/CD
   - Projects: Dolby Atmos, Crowd Sim, VR Escape Room, ArkAngel

### Session 3
1. Built interactive terminal system (`src/scripts/terminal.js`):
   - Virtual file system with content from resume
   - Command parsing and execution
   - Command history (up/down arrows)
   - Tab completion for commands
2. Implemented commands:
   - `help` - show all commands
   - `ls`, `cat`, `cd`, `pwd` - file system navigation
   - `clear`, `whoami`, `echo` - basics
   - `open` - open files/links
   - `search` - search content by keyword
   - `theme` - change theme (placeholder)
   - `github`, `linkedin`, `email` - open links
   - `ask` - natural language Q&A (Claude-style)
   - `hi/hello/hey` - friendly greeting
3. Natural language `ask` command with knowledge base:
   - Responds to questions about work, projects, skills, education
   - Conversational responses about Dolby, Meta, teaching, games

### Session 4
1. Removed GitHub API integration (github.js deleted)
   - User only wanted project links to GitHub, not repo fetching
   - Removed `repos` command from terminal.js
2. Fixed terminal scrolling:
   - Window frame now uses flexbox with max-height
   - Terminal content scrolls independently (fixed header/tabs)
3. Made window buttons functional (`src/scripts/window.js`):
   - Close button hides window with fade/scale animation
   - Minimize button slides window down
   - Maximize button toggles fullscreen mode
   - Restore button appears when window is hidden/minimized
   - Escape key restores window
4. Synced `cat about.txt` output format:
   - Virtual file system now uses same HTML structure as index.html
5. Cleaned up content:
   - Removed Seattle references from profile
   - Removed "cozy" references from ask responses
   - Removed `ls skills/` from initial home tab display

### Session 5
1. Implemented dynamic tab creation/closing (`src/scripts/tabs.js`):
   - Click + button to create new terminal tabs (~/term-1, ~/term-2, etc.)
   - X button appears on hover for closeable tabs
   - Core tabs (home, projects, games, contact) are protected from closing
   - New tabs have fresh terminal session with working commands
2. Added keyboard shortcuts:
   - Cmd/Ctrl+T = new tab
   - Cmd/Ctrl+W = close current tab (if not a core tab)
   - Cmd/Ctrl+1-9 = jump to tab by position
3. Updated terminal.js:
   - Exposed `window.initTerminalInput()` for initializing dynamic tabs
4. Added CSS for tab close button:
   - Appears on hover, turns peach on close button hover
5. Discussed domain name options:
   - emi.ly (domain hack), emily.win (Nguyen pun), etc.
6. Created rainy.css theme:
   - Cool lavender/pink palette from mockup-v1f
   - Misty watercolor backdrop
   - Rose/sage/wisteria accent colors
7. Added theme switching (`src/scripts/themes.js`):
   - `theme meadow` or `theme rainy` commands work
   - Saves preference to localStorage
   - Loads saved theme on page load
8. Added favicon.svg:
   - Terminal window icon with meadow colors
9. Added comprehensive meta tags:
   - Open Graph for Facebook/social sharing
   - Twitter card meta tags
   - SEO keywords and description
10. Created assets folder structure with .gitkeep
11. Made all tabs closeable (not just dynamic ones):
    - Any tab can close as long as 1 remains
    - Added X buttons to initial HTML tabs
12. Added window dragging:
    - Drag by title bar to move window
    - Double-click title bar to maximize/restore
    - Window stays within viewport bounds
13. Added desktop icons (`src/scripts/desktop.js`):
    - Terminal icon: double-click to reopen terminal with fresh home tab
    - Resume icon: links to resume.pdf
    - Icons appear when terminal window is closed
    - Click to select, double-click to open
14. Allow closing all tabs:
    - Last tab can now be closed
    - Closing last tab hides terminal and shows desktop
    - Reopening creates fresh home tab
15. Fixed keyboard shortcuts:
    - Changed Cmd+W to Cmd+Shift+W (browser reserves Cmd+W)
    - Added 'x' key to close tab when not typing
16. Added easter egg commands:
    - `sudo hire emily` - hire prompt
    - `coffee` - brew some coffee
    - `party` - rainbow animation
    - `matrix` - Matrix reference
    - `fortune` - random dev fortunes
    - `cowsay <msg>` - ASCII cow
    - `neofetch` - system info display
    - `history` - show command history
    - `date` - current date/time
    - `exit` - close current tab
17. Added resizable window:
    - Drag edges (N/S/E/W) to resize in one direction
    - Drag corners (NE/NW/SE/SW) to resize diagonally
    - Minimum size: 320x200px
    - Stays within viewport bounds
18. Added claude easter egg:
    - `claude` - greeting from Claude AI
    - `claude <message>` - various witty responses
    - `chatgpt` - playful "wrong AI" message

---

## Notes for AI Editors

When updating this project:

1. **To update content:** Edit `src/content/data.json` only
2. **To change colors/theme:** Edit files in `src/styles/themes/`
3. **To modify layout:** Edit `src/styles/main.css`
4. **To add interactivity:** Edit files in `src/scripts/`
5. **To change backdrop:** Edit `src/styles/backdrop.css`

The HTML structure in `index.html` should rarely need changes once built. All dynamic content is pulled from `data.json`.

---

## Reference Links
- Current site: https://nemily.github.io/
- GitHub repo: https://github.com/nEmily/nEmily.github.io
- Backdrop inspiration: Slawek Fedorczuk watercolor landscapes
