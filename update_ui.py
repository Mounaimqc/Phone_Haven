import os
import glob
import re

dir_path = r"c:\Users\ATC\Downloads\Phone_Haven-main"
html_files = glob.glob(os.path.join(dir_path, "*.html"))

gradient_css = """
    <style>
        /* Global Gradient & Responsive Fixes */
        html, body {
            max-width: 100vw;
            overflow-x: hidden;
            background: linear-gradient(135deg, #49377E 0%, #C64172 100%) !important;
            background-attachment: fixed !important;
        }
        
        /* Ensure major container backgrounds are transparent enough to show gradient */
        .bg-background-light, .dark\\:bg-background-dark, .bg-terminal-black, .bg-\\[\\#020617\\], body {
            background-color: transparent !important;
        }

        /* Make white backgrounds slightly translucent so gradient shows through, and adjust text color */
        .bg-white, .bg-slate-50 {
            background-color: rgba(255, 255, 255, 0.1) !important;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: #ffffff !important;
        }
        
        /* Adapt texts for dark gradient background */
        .text-slate-900, .text-slate-800, .text-slate-700, .text-gray-900, h1, h2, h3, h4, p, span {
            color: #ffffff !important;
        }

        /* Certain elements must keep their own colors */
        .text-secondary { color: #C64172 !important; }
        .text-primary { color: #49377E !important; }
        .text-emerald-400 { color: #34d399 !important; }
        .text-red-500 { color: #ef4444 !important; }
        .text-accent { color: #f59e0b !important; }
        .bg-red-500 { background-color: #ef4444 !important; }
        .bg-emerald-400 { background-color: #34d399 !important; }
        .bg-primary { background-color: #49377E !important; }
        .bg-secondary { background-color: #C64172 !important; }
        
        @media (max-width: 768px) {
            .container {
                padding-left: 1rem !important;
                padding-right: 1rem !important;
            }
        }
    </style>
"""

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Inject global gradient and responsive CSS right before </head>
    if "/* Global Gradient & Responsive Fixes */" not in content:
        content = content.replace("</head>", f"{gradient_css}\n</head>")

    # 2. Add viewport tag if missing
    if 'name="viewport"' not in content:
        content = content.replace("<head>", '<head>\n    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />')

    # 3. For index.html, update the subtitle under the text "Phone Haven"
    if os.path.basename(file) == "index.html":
        # First ensure we only replace it once or carefully where intended
        # The prompt says "sous le titre Phone haven ecrire 'More Thanr store ,it's a haven for phone ' comme le logo"
        # Since it says 'comme le logo', if it means the exact string representation, we do it in all spots `Phone Haven` is used as title.
        logo_html_pattern = re.compile(r'<h2\s+class="[^"]*font-display[^"]*">Phone Haven<span[^>]*>\.</span></h2>')
        
        def replacement(match):
            old_h2 = match.group(0)
            return f'''<div class="flex flex-col">
                        {old_h2}
                        <span class="text-[8.5px] xs:text-[10px] sm:text-[11px] text-white/90 font-medium whitespace-nowrap mt-0.5 tracking-wide">More Thanr store ,it's  a haven for phone </span>
                    </div>'''
        
        # In a generic replacement, this may wrap multiple times if we run it twice. We should check if the new text is already there.
        if "More Thanr store ,it's  a haven for phone" not in content:
            content = logo_html_pattern.sub(replacement, content)
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print(f"Updated {len(html_files)} files successfully.")
