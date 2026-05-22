import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight, oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

// Shadcn UI Imports
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import {
  Printer,
  Sun,
  Moon,
  Settings,
  X,
  Bold,
  Italic,
  Code as CodeIcon,
  Plus,
  Keyboard,
  Info,
  Eye,
  Edit3,
  FolderOpen,
  Save,
  Download,
  Expand,
  Minimize2,
  Target,
  Copy,
  Check,
  FileText,
  ChevronRight,
  Link
} from "lucide-react";
import { PDF_THEMES, MARGIN_SIZES } from "./templates/themes";

const APP_THEMES = [
  { id: "sleek-dark", name: "Sleek Dark", color: "#71717a", description: "Modern slate tones" },
  { id: "obsidian-black", name: "Obsidian Black", color: "#000000", description: "Pure OLED black" },
  { id: "minimal-white", name: "Minimal White", color: "#ffffff", description: "Bright, clean light" },
  { id: "midnight-navy", name: "Midnight Navy", color: "#3b82f6", description: "Deep ocean blue" },
  { id: "forest-moss", name: "Forest Moss", color: "#22c55e", description: "Organic dark green" },
  { id: "royal-violet", name: "Royal Violet", color: "#a855f7", description: "Regal purple tones" },
  { id: "rose-ember", name: "Rose Ember", color: "#f43f5e", description: "Warm dark rose" },
  { id: "warm-bronze", name: "Warm Bronze", color: "#d97706", description: "Cozy metallic amber" }
];

const FONT_OPTIONS = [
  { id: "default", name: "Default Theme Font", value: "inherit", description: "Use the preset theme font" },
  { id: "inter", name: "Inter (Sans)", value: "'Inter', sans-serif", description: "Clean modern sans-serif" },
  { id: "outfit", name: "Outfit (Sans)", value: "'Outfit', sans-serif", description: "Elegant geometric sans-serif" },
  { id: "eb-garamond", name: "EB Garamond (Serif)", value: "'EB Garamond', serif", description: "Traditional academic serif" },
  { id: "playfair", name: "Playfair Display (Serif)", value: "'Playfair Display', serif", description: "Editorial display serif" },
  { id: "monospace", name: "Fira Code (Mono)", value: "'Fira Code', Consolas, Monaco, monospace", description: "Technical monospace" }
];



function SafeCodeBlock({ codeString, language, darkMode }: { codeString: string, language: string, darkMode: boolean }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="code-block-wrapper">
      <button
        onClick={handleCopy}
        className="copy-btn absolute top-2 right-2 p-1.5 rounded-lg bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/80 border border-zinc-700/60 z-20 transition-all"
        title="Copy Code"
      >
        {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
      </button>
      <SyntaxHighlighter
        style={darkMode ? oneDark : oneLight}
        language={language}
        PreTag="pre"
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
}

const DEFAULT_MARKDOWN = `# LumiPDF Document

Welcome to **LumiPDF**, a premium desktop Markdown writer and PDF exporter.

Press \`Ctrl+Space\` to toggle between editing and viewing.

---

## ⚡ Quick Start

1. **Write**: Compose your document using standard Markdown syntax.
2. **Style**: Click the settings icon (⚙️) in the status bar to pick templates, margins, and sizes.
3. **Format**: Use bottom status bar options or shortcuts (\`Ctrl+B\`, \`Ctrl+I\`).
4. **Print**: Click **Export** or press \`Ctrl+P\` to print or save as a PDF.

---

## 📝 Document Formatting

Here is a quick showcase of styled elements:

### Quotes & Callouts

> "Simplicity is the ultimate sophistication."
> — Leonardo da Vinci

### Table Structure

| Feature | Tech Stack | Advantage |
| :--- | :--- | :--- |
| Core | Tauri v2 | Incredibly light app size (~15MB), low RAM |
| UI | React + Vite | Instant live compilation |
| Styling | Tailwind CSS | Sleek, modern templates |

### Code Blocks with Syntax Highlighting

\`\`\`typescript
// Press Ctrl+P or Ctrl+S to save!
function exportToPDF() {
  window.print();
}
\`\`\`
`;

function getExportButtonStyles(themeId: string) {
  switch (themeId) {
    case "sleek-dark":
      return {
        bg: "rgba(113, 113, 122, 0.15)", // sleek grey/slate
        border: "rgba(113, 113, 122, 0.3)",
        text: "#a1a1aa", // light slate
      };
    case "obsidian-black":
      return {
        bg: "rgba(113, 113, 122, 0.15)",
        border: "rgba(113, 113, 122, 0.3)",
        text: "#a1a1aa",
      };
    case "minimal-white":
      return {
        bg: "rgba(113, 113, 122, 0.1)",
        border: "rgba(113, 113, 122, 0.2)",
        text: "#3f3f46",
      };
    case "midnight-navy":
      return {
        bg: "rgba(59, 130, 246, 0.15)", // blue
        border: "rgba(59, 130, 246, 0.3)",
        text: "#60a5fa",
      };
    case "forest-moss":
      return {
        bg: "rgba(34, 197, 94, 0.15)", // green
        border: "rgba(34, 197, 94, 0.3)",
        text: "#4ade80",
      };
    case "royal-violet":
      return {
        bg: "rgba(168, 85, 247, 0.15)", // purple
        border: "rgba(168, 85, 247, 0.3)",
        text: "#c084fc",
      };
    case "rose-ember":
      return {
        bg: "rgba(244, 63, 94, 0.15)", // rose
        border: "rgba(244, 63, 94, 0.3)",
        text: "#f472b6",
      };
    case "warm-bronze":
      return {
        bg: "rgba(217, 119, 6, 0.15)", // bronze
        border: "rgba(217, 119, 6, 0.3)",
        text: "#fbbf24",
      };
    default:
      return {
        bg: "rgba(113, 113, 122, 0.15)",
        border: "rgba(113, 113, 122, 0.3)",
        text: "#a1a1aa",
      };
  }
}

export default function App() {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [themeId, setThemeId] = useState("modern");
  const [pageSize, setPageSize] = useState<"A4" | "Letter" | "Legal">("A4");
  const [marginSize, setMarginSize] = useState<"none" | "thin" | "normal" | "thick">("normal");
  const [appTheme, setAppTheme] = useState<string>(() => {
    return localStorage.getItem("lumipdf_app_theme") || "sleek-dark";
  });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [customHeader, setCustomHeader] = useState("");
  const [showPageNumbers, setShowPageNumbers] = useState(true);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);

  // New Upgrade States
  const [showTOC, setShowTOC] = useState(false);
  const [pageFormat, setPageFormat] = useState<"page-x" | "simple" | "page-x-y" | "line" | "none">("page-x");
  const [hideBrowserHeaderFooter, setHideBrowserHeaderFooter] = useState<boolean>(() => {
    const saved = localStorage.getItem("lumipdf_hide_browser_header_footer");
    return saved === null ? true : saved === "true";
  });
  const [customFont, setCustomFont] = useState<string>(() => {
    return localStorage.getItem("lumipdf_custom_font") || "default";
  });
  const [writingGoal, setWritingGoal] = useState<number | null>(() => {
    const saved = localStorage.getItem("lumipdf_goal");
    return saved ? parseInt(saved, 10) : null;
  });
  const [goalOpen, setGoalOpen] = useState(false);
  const [goalInput, setGoalInput] = useState("");
  const [focusMode, setFocusMode] = useState(false);
  const [selectionActive, setSelectionActive] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeTheme = PDF_THEMES.find((t) => t.id === themeId) || PDF_THEMES[0];

  const isDark = appTheme !== "minimal-white";
  const activeExportStyles = getExportButtonStyles(appTheme);
  const activeFontValue = FONT_OPTIONS.find(f => f.id === customFont)?.value ?? "inherit";

  // Theme and class toggle
  useEffect(() => {
    localStorage.setItem("lumipdf_app_theme", appTheme);
    const isDarkTheme = appTheme !== "minimal-white";
    const themeClass = `theme-${appTheme} ${isDarkTheme ? "dark" : "light"}`;
    document.documentElement.className = themeClass;
    document.body.className = themeClass;
  }, [appTheme]);

  // Load autosaved draft
  useEffect(() => {
    const autosaved = localStorage.getItem("lumipdf_autosave");
    if (autosaved) {
      setMarkdown(autosaved);
    }
  }, []);

  // Save draft on change
  useEffect(() => {
    localStorage.setItem("lumipdf_autosave", markdown);
  }, [markdown]);

  // Persist writing goal
  useEffect(() => {
    if (writingGoal !== null) {
      localStorage.setItem("lumipdf_goal", writingGoal.toString());
    } else {
      localStorage.removeItem("lumipdf_goal");
    }
  }, [writingGoal]);

  // Persist hide browser header/footer setting
  useEffect(() => {
    localStorage.setItem("lumipdf_hide_browser_header_footer", hideBrowserHeaderFooter.toString());
  }, [hideBrowserHeaderFooter]);

  // Persist custom font setting
  useEffect(() => {
    localStorage.setItem("lumipdf_custom_font", customFont);
  }, [customFont]);

  // Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle Editor/Preview: Ctrl + Space or Ctrl + E
      if ((e.ctrlKey && e.code === "Space") || (e.ctrlKey && e.key.toLowerCase() === "e")) {
        e.preventDefault();
        setActiveTab((prev) => (prev === "write" ? "preview" : "write"));
      }

      // Settings shortcut: Ctrl + , (comma)
      if (e.ctrlKey && e.key === ",") {
        e.preventDefault();
        setSettingsOpen((prev) => !prev);
      }

      // Print/Export PDF: Ctrl + P or Ctrl + S
      if ((e.ctrlKey && e.key.toLowerCase() === "p") || (e.ctrlKey && e.key.toLowerCase() === "s")) {
        e.preventDefault();
        window.print();
      }

      // Focus Mode shortcut: Ctrl + Alt + F
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "f") {
        e.preventDefault();
        setFocusMode((prev) => !prev);
      }

      // Textarea formatting macros
      if (document.activeElement === textareaRef.current) {
        if (e.ctrlKey && e.key.toLowerCase() === "b") {
          e.preventDefault();
          insertMarkdown("bold");
        }
        if (e.ctrlKey && e.key.toLowerCase() === "i") {
          e.preventDefault();
          insertMarkdown("italic");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Local File Actions
  const handleOpenFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setMarkdown(event.target.result as string);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleSaveFile = () => {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportHTML = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en" class="${isDark ? "dark" : "light"}">
<head>
  <meta charset="UTF-8">
  <title>LumiPDF Export</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Fira+Code:wght@300..700&family=Inter:wght@100..900&family=Outfit:wght@100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: ${customFont !== "default" ? FONT_OPTIONS.find(f => f.id === customFont)?.value : activeTheme.fontFamily};
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
      background: ${isDark ? "#09090b" : "#ffffff"};
      color: ${isDark ? "#f4f4f5" : "#18181b"};
      line-height: 1.6;
    }
    h1 { border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-top: 30px; }
    h2 { border-bottom: 1px solid rgba(0,0,0,0.1); padding-bottom: 6px; margin-top: 24px; }
    pre { background: #1e1e1e; color: #fff; padding: 15px; border-radius: 6px; overflow-x: auto; position: relative; }
    code { font-family: monospace; background: rgba(0,0,0,0.05); padding: 2px 4px; border-radius: 4px; }
    blockquote { border-left: 4px solid #3b82f6; background: rgba(59,130,246,0.05); padding: 10px 20px; font-style: italic; margin: 20px 0; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th, td { border-bottom: 1px solid rgba(0,0,0,0.1); padding: 10px; text-align: left; }
    th { background: rgba(0,0,0,0.02); }
    ${customFont !== "default" ? `
    h1, h2, h3, h4, h5, h6, p, li, blockquote, td, th {
      font-family: ${FONT_OPTIONS.find(f => f.id === customFont)?.value} !important;
    }
    ` : ""}
  </style>
</head>
<body>
  <div class="${activeTheme.containerClass}">
    ${document.getElementById("print-section")?.innerHTML || "No content"}
  </div>
</body>
</html>`;
    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleTextareaSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    if (start !== end && start !== null && end !== null) {
      setSelectionActive(true);
    } else {
      setSelectionActive(false);
    }
  };

  const getHeadingText = (children: React.ReactNode): string => {
    if (typeof children === "string") return children;
    if (Array.isArray(children)) return children.map(getHeadingText).join("");
    if (children && typeof children === "object" && "props" in children) {
      return getHeadingText((children as any).props.children);
    }
    return "";
  };

  const generateTOC = () => {
    const lines = markdown.split("\n");
    const headings: { level: number; text: string; id: string }[] = [];
    lines.forEach((line) => {
      const match = line.match(/^(#{1,3})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const rawText = match[2].trim();
        
        // Strip common markdown elements to get plain text for display and ID
        const plainText = rawText
          .replace(/\*\*([^*]+)\*\*/g, "$1") // bold
          .replace(/\*([^*]+)\*/g, "$1")     // italic
          .replace(/__([^_]+)__/g, "$1")     // bold
          .replace(/_([^_]+)_/g, "$1")       // italic
          .replace(/`([^`]+)`/g, "$1")       // inline code
          .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1"); // links
          
        const id = plainText.toLowerCase().trim().replace(/[^\w]+/g, "-").replace(/^-+|-+$/g, "");
        headings.push({ level, text: plainText, id });
      }
    });

    if (headings.length === 0) return null;

    return (
      <div className="toc-container select-none print:hidden mb-6">
        <div className="toc-title">Table of Contents</div>
        <ul className="toc-list">
          {headings.map((h, i) => (
            <li key={i} className={`toc-item-h${h.level}`}>
              <a
                href={`#${h.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth" });
                }}
                className="hover:underline flex items-center gap-1 cursor-pointer"
              >
                <ChevronRight size={10} className="opacity-50" />
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const insertMarkdown = (type: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    let replacement = "";
    switch (type) {
      case "bold":
        replacement = `**${selectedText || "bold text"}**`;
        break;
      case "italic":
        replacement = `*${selectedText || "italic text"}*`;
        break;
      case "code":
        replacement = `\`${selectedText || "code"}\``;
        break;
      case "link":
        replacement = `[${selectedText || "link text"}](https://example.com)`;
        break;
      case "pagebreak":
        replacement = `\n\n---\n\n`;
        break;
      default:
        return;
    }

    const newValue = text.substring(0, start) + replacement + text.substring(end);
    setMarkdown(newValue);

    // Refocus and place cursor
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + replacement.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 50);
  };

  const handleTabKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;

      // Insert 2 spaces
      const newValue = value.substring(0, start) + "  " + value.substring(end);
      setMarkdown(newValue);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  // Helper stats computation
  const getWordCount = () => {
    if (!markdown.trim()) return 0;
    return markdown.trim().split(/\s+/).length;
  };

  const getCharCount = () => {
    return markdown.length;
  };

  return (
    <TooltipProvider>
      <div className="flex h-screen w-screen flex-col overflow-hidden bg-background text-foreground transition-colors duration-300">
        {/* Dynamic print-page sizing stylesheet */}
        <style>
          {`
            @media screen {
              #print-section {
                padding: ${marginSize === "none" ? "1.5rem" : MARGIN_SIZES[marginSize]} !important;
              }
            }
            @media print {
              @page {
                size: ${pageSize === "Letter" ? "letter" : pageSize === "Legal" ? "legal" : "A4"};
                margin: ${hideBrowserHeaderFooter ? "0 !important" : MARGIN_SIZES[marginSize]};
              }
              #print-section {
                width: 100% !important;
                height: auto !important;
                min-height: 0 !important;
                padding: ${hideBrowserHeaderFooter && marginSize !== "none" ? MARGIN_SIZES[marginSize] : "0"} !important;
                background: #ffffff !important;
                color: #000000 !important;
              }
              .print-footer {
                position: fixed;
                bottom: 8mm;
                left: 0;
                right: 0;
                text-align: center;
                font-size: 9px;
                color: #64748b !important;
                font-family: sans-serif;
                display: block !important;
              }
              .page-format-simple::after {
                content: counter(page);
              }
              .page-format-page-x::after {
                content: "Page " counter(page);
              }
              .page-format-page-x-y::after {
                content: "Page " counter(page);
              }
              .page-format-line::after {
                content: "— " counter(page) " —";
              }
            }
            ${customFont !== "default" ? `
              #print-section,
              #print-section h1,
              #print-section h2,
              #print-section h3,
              #print-section h4,
              #print-section h5,
              #print-section h6,
              #print-section p,
              #print-section li,
              #print-section blockquote,
              #print-section td,
              #print-section th {
                font-family: ${FONT_OPTIONS.find(f => f.id === customFont)?.value || "inherit"} !important;
              }
            ` : ""}
          `}
        </style>

        {/* Top Navbar */}
        {!focusMode && (
          <header className="h-16 border-b border-border bg-background px-6 flex items-center justify-between shrink-0 select-none print:hidden">
            {/* Left Section: Brand Logo */}
            <div className="flex items-center gap-2.5">
              <svg className="w-5 h-5" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M15 1H1V15H15V1ZM6 5L7.41421 6.41421L5.82843 8L7.41421 9.58579L6 11L3 8L6 5ZM10 5L8.58579 6.41421L10.1716 8L8.58579 9.58579L10 11L13 8L10 5Z" fill="currentColor"/>
              </svg>
              <span className="font-bold text-foreground tracking-tight text-sm">LumiPDF</span>
            </div>

            {/* Right Section: Formatting & Actions */}
            <div className="flex items-center gap-1">
              {/* File Operations */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleOpenFile}
                    className="p-2 hover:text-foreground text-muted-foreground/60 hover:bg-secondary/40 rounded-lg transition-all cursor-pointer"
                  >
                    <FolderOpen size={15} />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="text-[10px] py-1 px-2">Open MD File</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleSaveFile}
                    className="p-2 hover:text-foreground text-muted-foreground/60 hover:bg-secondary/40 rounded-lg transition-all cursor-pointer"
                  >
                    <Save size={15} />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="text-[10px] py-1 px-2">Save MD File (Ctrl+S)</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleExportHTML}
                    className="p-2 hover:text-foreground text-muted-foreground/60 hover:bg-secondary/40 rounded-lg transition-all cursor-pointer"
                  >
                    <Download size={15} />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="text-[10px] py-1 px-2">Export Styled HTML</TooltipContent>
              </Tooltip>

              <Separator orientation="vertical" className="h-4 bg-border mx-1" />

              {/* Mode Toggle */}
              <div className="flex items-center bg-secondary/50 p-0.5 rounded-lg border border-border/60 mr-2 shrink-0">
                <button
                  onClick={() => setActiveTab("write")}
                  className={`px-2.5 py-1 text-[10px] font-medium rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                    activeTab === "write"
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground/70 hover:text-foreground"
                  }`}
                >
                  <Edit3 size={11} />
                  Write
                </button>
                <button
                  onClick={() => setActiveTab("preview")}
                  className={`px-2.5 py-1 text-[10px] font-medium rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                    activeTab === "preview"
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground/70 hover:text-foreground"
                  }`}
                >
                  <Eye size={11} />
                  Preview
                </button>
              </div>

              {/* Quick Formatting Buttons */}
              {activeTab === "write" && (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => insertMarkdown("bold")}
                        className="p-2 hover:text-foreground text-muted-foreground/60 hover:bg-secondary/40 rounded-lg transition-all cursor-pointer"
                      >
                        <Bold size={14} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="text-[10px] py-1 px-2">Bold (Ctrl+B)</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => insertMarkdown("italic")}
                        className="p-2 hover:text-foreground text-muted-foreground/60 hover:bg-secondary/40 rounded-lg transition-all cursor-pointer"
                      >
                        <Italic size={14} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="text-[10px] py-1 px-2">Italic (Ctrl+I)</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => insertMarkdown("code")}
                        className="p-2 hover:text-foreground text-muted-foreground/60 hover:bg-secondary/40 rounded-lg transition-all cursor-pointer"
                      >
                        <CodeIcon size={14} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="text-[10px] py-1 px-2">Inline Code</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => insertMarkdown("pagebreak")}
                        className="p-2 hover:text-foreground text-muted-foreground/60 hover:bg-secondary/40 rounded-lg transition-all cursor-pointer"
                      >
                        <Plus size={14} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="text-[10px] py-1 px-2">Insert Page Break</TooltipContent>
                  </Tooltip>

                  <Separator orientation="vertical" className="h-4 bg-border mx-2" />
                </>
              )}

              {/* General Actions */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setAppTheme(isDark ? "minimal-white" : "sleek-dark")}
                    className="p-2 hover:text-foreground text-muted-foreground/60 hover:bg-secondary/40 rounded-lg transition-all cursor-pointer"
                  >
                    {isDark ? <Sun size={15} /> : <Moon size={15} />}
                  </button>
                </TooltipTrigger>
                <TooltipContent className="text-[10px] py-1 px-2">Toggle Theme</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setFocusMode(true)}
                    className="p-2 hover:text-foreground text-muted-foreground/60 hover:bg-secondary/40 rounded-lg transition-all cursor-pointer"
                  >
                    <Expand size={15} />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="text-[10px] py-1 px-2">Focus Mode (Ctrl+Alt+F)</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setSettingsOpen(true)}
                    className="p-2 hover:text-foreground text-muted-foreground/60 hover:bg-secondary/40 rounded-lg transition-all cursor-pointer"
                  >
                    <Settings size={15} />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="text-[10px] py-1 px-2">Page Options (Ctrl+,)</TooltipContent>
              </Tooltip>

              <Separator orientation="vertical" className="h-4 bg-border mx-2" />

              <button
                onClick={() => window.print()}
                style={{
                  backgroundColor: activeExportStyles.bg,
                  borderColor: activeExportStyles.border,
                  color: activeExportStyles.text,
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold border shadow-xs rounded-lg transition-all cursor-pointer hover:brightness-110 active:scale-95"
                title="Export to PDF (Ctrl+P)"
              >
                <Printer size={13} className="shrink-0" />
                <span>Export</span>
              </button>
            </div>
          </header>
        )}

        {/* Main Workspace (Takes 100% height minus status bar) */}
        <div className="flex-1 overflow-hidden relative">
          {/* Focus Mode Floating Toolbar */}
          {focusMode && (
            <div className="absolute top-4 right-6 z-50 opacity-60 hover:opacity-100 transition-opacity duration-300 bg-background/80 backdrop-blur-md border border-border/80 shadow-md rounded-full py-1.5 px-3.5 flex items-center gap-1.5 select-none">
              {/* Mode Toggle */}
              <div className="flex items-center bg-secondary/40 p-0.5 rounded-full border border-border/40 mr-1 shrink-0">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setActiveTab("write")}
                      className={`p-1.5 rounded-full transition-all cursor-pointer ${
                        activeTab === "write"
                          ? "bg-background text-foreground shadow-xs"
                          : "text-muted-foreground/75 hover:text-foreground"
                      }`}
                    >
                      <Edit3 size={12} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="text-[10px] py-1 px-2">Write Mode (Ctrl+Space)</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setActiveTab("preview")}
                      className={`p-1.5 rounded-full transition-all cursor-pointer ${
                        activeTab === "preview"
                          ? "bg-background text-foreground shadow-xs"
                          : "text-muted-foreground/75 hover:text-foreground"
                      }`}
                    >
                      <Eye size={12} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="text-[10px] py-1 px-2">Preview Mode (Ctrl+Space)</TooltipContent>
                </Tooltip>
              </div>

              {/* Save Document */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleSaveFile}
                    className="p-1.5 hover:text-foreground text-muted-foreground/60 hover:bg-secondary/40 rounded-full transition-all cursor-pointer"
                  >
                    <Save size={13} />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="text-[10px] py-1 px-2">Save MD File (Ctrl+S)</TooltipContent>
              </Tooltip>

              {/* Export PDF */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => window.print()}
                    className="p-1.5 hover:text-foreground text-muted-foreground/60 hover:bg-secondary/40 rounded-full transition-all cursor-pointer"
                  >
                    <Printer size={13} />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="text-[10px] py-1 px-2">Export to PDF (Ctrl+P)</TooltipContent>
              </Tooltip>

              {/* Page Options / Configuration */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setSettingsOpen(true)}
                    className="p-1.5 hover:text-foreground text-muted-foreground/60 hover:bg-secondary/40 rounded-full transition-all cursor-pointer"
                  >
                    <Settings size={13} />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="text-[10px] py-1 px-2">Page Options (Ctrl+,)</TooltipContent>
              </Tooltip>

              <Separator orientation="vertical" className="h-4 bg-border/80 mx-1 shrink-0" />

              {/* Exit Focus Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setFocusMode(false)}
                    className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-red-500 hover:bg-red-500/10 rounded-full transition-all cursor-pointer"
                  >
                    <Minimize2 size={12} />
                    <span>Exit</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent className="text-[10px] py-1 px-2">Exit Focus Mode (Ctrl+Alt+F)</TooltipContent>
              </Tooltip>
            </div>
          )}

          {/* Floating formatting bubble */}
          {selectionActive && activeTab === "write" && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 bg-popover/90 backdrop-blur-md border border-border px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-slide-up-fade">
              <button
                onClick={() => insertMarkdown("bold")}
                className="p-1.5 hover:text-foreground text-muted-foreground/80 hover:bg-secondary/60 rounded-md transition-all cursor-pointer"
                title="Bold (Ctrl+B)"
              >
                <Bold size={13} />
              </button>
              <button
                onClick={() => insertMarkdown("italic")}
                className="p-1.5 hover:text-foreground text-muted-foreground/80 hover:bg-secondary/60 rounded-md transition-all cursor-pointer"
                title="Italic (Ctrl+I)"
              >
                <Italic size={13} />
              </button>
              <button
                onClick={() => insertMarkdown("code")}
                className="p-1.5 hover:text-foreground text-muted-foreground/80 hover:bg-secondary/60 rounded-md transition-all cursor-pointer"
                title="Code"
              >
                <CodeIcon size={13} />
              </button>
              <button
                onClick={() => insertMarkdown("link")}
                className="p-1.5 hover:text-foreground text-muted-foreground/80 hover:bg-secondary/60 rounded-md transition-all cursor-pointer"
                title="Link"
              >
                <Link size={13} />
              </button>
              <div className="w-[1px] h-3 bg-border mx-0.5"></div>
              <button
                onClick={() => setSelectionActive(false)}
                className="p-1.5 hover:text-foreground text-muted-foreground/80 hover:bg-secondary/60 rounded-md transition-all cursor-pointer"
                title="Dismiss"
              >
                <X size={13} />
              </button>
            </div>
          )}

          {/* EDITOR (WRITE MODE) */}
          {activeTab === "write" && (
            <div className="w-full h-full bg-background flex justify-center py-0 relative">
              <div className="w-[95%] h-full relative notepad-editor-wrapper">
                {markdown.trim() === "" && (
                  <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center opacity-20 select-none z-0">
                    <FileText size={48} className="text-muted-foreground mb-3 animate-pulse" />
                    <p className="text-sm font-semibold">Start typing in Notepad...</p>
                    <p className="text-xs text-muted-foreground mt-1">Press Ctrl+Space to preview. Use Ctrl+B/I to format.</p>
                  </div>
                )}
                <textarea
                  ref={textareaRef}
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  onKeyDown={handleTabKey}
                  onSelect={handleTextareaSelect}
                  placeholder=""
                  className="w-full h-full resize-none bg-transparent text-foreground focus:outline-none font-mono text-[15px] notepad-textarea relative z-10"
                  style={{
                    fontFamily: customFont !== "default" 
                      ? FONT_OPTIONS.find(f => f.id === customFont)?.value 
                      : "Consolas, Monaco, 'Courier New', monospace",
                  }}
                />
              </div>
            </div>
          )}

          {/* PREVIEW (PREVIEW MODE) */}
          {activeTab === "preview" && (
            <div className="workspace-container">
              <div
                id="print-section"
                className={`${activeTheme.containerClass} text-foreground relative w-[95%] transition-all z-10 print:bg-white print:text-slate-900 print:max-w-none print:w-full print:p-0 print:border-none print:shadow-none print:relative`}
                style={{
                  fontFamily: activeTheme.fontFamily,
                }}
              >
                {/* Optional Running Header (Print Only) */}
                {customHeader && (
                  <div className="w-full text-right text-[10px] text-muted-foreground/50 border-b border-slate-200/60 dark:border-slate-800/10 pb-1 mb-8 print:block hidden font-sans select-none font-medium">
                    {customHeader}
                  </div>
                )}

                {/* Rendered HTML */}
                <div className="w-full h-full">
                  {showTOC && generateTOC()}
                  {markdown.trim() === "" ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center opacity-30 select-none">
                      <Printer size={32} className="text-muted-foreground mb-4" />
                      <h3 className="font-semibold text-sm">Nothing to preview yet</h3>
                      <p className="text-xs text-muted-foreground mt-1">Switch to Write mode to enter text.</p>
                    </div>
                  ) : (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw]}
                      components={{
                        hr: ({ ...props }) => <hr className="page-break page-break-preview my-8" {...props} />,
                        h1: ({ children, ...props }) => {
                          const text = getHeadingText(children);
                          const id = text.toLowerCase().trim().replace(/[^\w]+/g, "-");
                          return <h1 id={id} {...props}>{children}</h1>;
                        },
                        h2: ({ children, ...props }) => {
                          const text = getHeadingText(children);
                          const id = text.toLowerCase().trim().replace(/[^\w]+/g, "-");
                          return <h2 id={id} {...props}>{children}</h2>;
                        },
                        h3: ({ children, ...props }) => {
                          const text = getHeadingText(children);
                          const id = text.toLowerCase().trim().replace(/[^\w]+/g, "-");
                          return <h3 id={id} {...props}>{children}</h3>;
                        },
                        code({ className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || "");
                          const inline = !match;
                          return !inline ? (
                            <SafeCodeBlock
                              codeString={String(children).replace(/\n$/, "")}
                              language={match[1]}
                              darkMode={isDark}
                            />
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {markdown}
                    </ReactMarkdown>
                  )}
                </div>

                {/* Optional Bottom Page Numbering (Screen Preview Only) */}
                {showPageNumbers && pageFormat !== "none" && (
                  <div className="absolute bottom-4 left-0 right-0 text-center text-[10px] text-muted-foreground/50 print:hidden font-sans select-none">
                    {pageFormat === "simple" && "1"}
                    {pageFormat === "page-x" && "Page 1"}
                    {pageFormat === "page-x-y" && "Page 1 of 1"}
                    {pageFormat === "line" && "— 1 —"}
                  </div>
                )}

                {/* Print Page Numbering (Print Only) */}
                {showPageNumbers && pageFormat !== "none" && (
                  <div className={`print-footer hidden print:block page-format-${pageFormat}`} />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Ultra-Minimalist Status Bar */}
        {!focusMode && (
          <footer className="h-12 border-t border-border bg-background px-6 flex items-center justify-between text-xs text-muted-foreground shrink-0 select-none print:hidden">
            {/* Left: Stats */}
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-secondary/20 border border-border/40 rounded-md h-7 shrink-0 px-2 text-[11px] text-muted-foreground">
                <button
                  onClick={() => {
                    setGoalInput(writingGoal ? writingGoal.toString() : "");
                    setGoalOpen(true);
                  }}
                  className="h-full hover:text-foreground focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none transition-all flex items-center gap-1.5 cursor-pointer font-medium"
                  title="Writing Goal"
                >
                  <Target size={11} className={writingGoal && getWordCount() >= writingGoal ? "text-green-500" : "text-muted-foreground/70"} />
                  {writingGoal ? (
                    <span className="leading-none text-foreground">
                      {getWordCount()}/{writingGoal} <span className="hidden sm:inline">words</span> ({Math.min(100, Math.round((getWordCount() / writingGoal) * 100))}%)
                    </span>
                  ) : (
                    <span className="leading-none">{getWordCount()} <span className="hidden sm:inline">words</span> <span className="opacity-60 hidden sm:inline">(Set Goal)</span></span>
                  )}
                </button>
                <div className="w-[1px] h-3.5 bg-border/60 mx-2" />
                <div className="flex items-center gap-1.5 font-medium">
                  <span className="leading-none">{getCharCount()} <span className="hidden sm:inline">chars</span></span>
                </div>
              </div>
            </div>

            {/* Center: Tips */}
            <div className="hidden md:flex items-center gap-1.5 text-[10px] text-muted-foreground/60">
              <span>Press</span>
              <kbd className="px-1.5 py-0.5 bg-secondary border border-border/80 rounded text-[10px]">Ctrl+Space</kbd>
              <span>to toggle preview</span>
              <span className="mx-2">•</span>
              <span>Press</span>
              <kbd className="px-1.5 py-0.5 bg-secondary border border-border/80 rounded text-[10px]">Ctrl+P</kbd>
              <span>to export PDF</span>
            </div>

            {/* Right: Active Settings */}
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-secondary/20 border border-border/40 rounded-md h-7 shrink-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="h-full px-2 hover:bg-secondary/50 rounded-l-md text-[11px] text-muted-foreground hover:text-foreground focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none font-medium cursor-pointer flex items-center gap-1.5 transition-all select-none border-r border-border/40">
                      <span className="h-2 w-2 rounded-full shrink-0 shadow-2xs" style={{
                        backgroundColor: APP_THEMES.find(t => t.id === appTheme)?.color || "transparent"
                      }} />
                      <span className="leading-none max-w-[80px] truncate">{APP_THEMES.find(t => t.id === appTheme)?.name || "Theme"}</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[220px] bg-popover/90 backdrop-blur-md border border-border p-1.5 shadow-xl rounded-lg z-50">
                    <DropdownMenuLabel className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-wider px-2.5 py-1">App Theme</DropdownMenuLabel>
                    <DropdownMenuSeparator className="my-1 bg-border/60" />
                    {APP_THEMES.map((theme) => {
                      const isSelected = appTheme === theme.id;
                      return (
                        <DropdownMenuItem
                          key={theme.id}
                          onClick={() => setAppTheme(theme.id)}
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded-md cursor-pointer transition-all ${
                            isSelected ? "bg-accent/80 text-accent-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="h-2.5 w-2.5 rounded-full shrink-0 border border-muted-foreground/30 shadow-2xs" style={{
                              backgroundColor: theme.color
                            }} />
                            <div className="flex flex-col gap-0.5">
                              <span className="text-xs font-semibold leading-none">{theme.name}</span>
                              <span className="text-[9px] text-muted-foreground/60 font-normal leading-none">{theme.description}</span>
                            </div>
                          </div>
                          {isSelected && <Check size={12} className="text-foreground shrink-0 ml-2" />}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="h-full px-2 hover:bg-secondary/50 rounded-r-md text-[11px] text-muted-foreground hover:text-foreground focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none font-medium cursor-pointer flex items-center gap-1.5 transition-all select-none">
                      <span className="leading-none max-w-[80px] truncate">{FONT_OPTIONS.find(f => f.id === customFont)?.name || "Select Font"}</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[220px] bg-popover/90 backdrop-blur-md border border-border p-1.5 shadow-xl rounded-lg z-50">
                    <DropdownMenuLabel className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-wider px-2.5 py-1">Document Font</DropdownMenuLabel>
                    <DropdownMenuSeparator className="my-1 bg-border/60" />
                    {FONT_OPTIONS.map((font) => {
                      const isSelected = customFont === font.id;
                      return (
                        <DropdownMenuItem
                          key={font.id}
                          onClick={() => setCustomFont(font.id)}
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded-md cursor-pointer transition-all ${
                            isSelected ? "bg-accent/80 text-accent-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <div className="flex flex-col gap-0.5 text-left">
                            <span className="text-xs font-semibold leading-none">{font.name}</span>
                            <span className="text-[9px] text-muted-foreground/60 font-normal leading-none">{font.description}</span>
                          </div>
                          {isSelected && <Check size={12} className="text-foreground shrink-0 ml-2" />}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </footer>
        )}

        {/* SETTINGS DIALOG (Clean pop-up overlay replacing side panels) */}
        <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
          <DialogContent className={`sm:max-w-2xl p-6 theme-${appTheme} ${isDark ? "dark" : "light"}`} style={{ fontFamily: activeFontValue }}>
            <DialogHeader>
              <DialogTitle className="text-sm font-extrabold tracking-tight flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M15 1H1V15H15V1ZM6 5L7.41421 6.41421L5.82843 8L7.41421 9.58579L6 11L3 8L6 5ZM10 5L8.58579 6.41421L10.1716 8L8.58579 9.58579L10 11L13 8L10 5Z" fill="currentColor"/>
                </svg>
                Document Configuration
              </DialogTitle>
              <DialogDescription className="text-[11px] text-muted-foreground">
                Customize your PDF's visual output template, sizing, and margins.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-[1fr_1px_1fr] gap-0 py-2">
              {/* Left Column — Style Preset list */}
              <div className="pr-8 space-y-3">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Style Preset</label>
                <div className="flex flex-col gap-1.5">
                  {PDF_THEMES.map((theme) => {
                    const isSelected = themeId === theme.id;
                    return (
                      <button
                        key={theme.id}
                        onClick={() => setThemeId(theme.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-all ${
                          isSelected
                            ? "border-primary/60 bg-primary/10 text-foreground"
                            : "border-border/40 bg-transparent text-muted-foreground hover:bg-secondary/40 hover:text-foreground hover:border-border/60"
                        }`}
                      >
                        <span className={`h-2 w-2 rounded-full shrink-0 ${isSelected ? "bg-primary" : "bg-border"}`} />
                        <div className="min-w-0">
                          <div className={`text-xs font-semibold leading-none ${isSelected ? "text-foreground" : ""}`}>{theme.name}</div>
                          <div className="text-[10px] text-muted-foreground/60 font-normal mt-0.5 leading-relaxed truncate">
                            {theme.description}
                          </div>
                        </div>
                        {isSelected && <Check size={13} className="text-primary ml-auto shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Vertical Divider */}
              <div className="bg-border/40 self-stretch mx-0" />

              {/* Right Column — Settings list */}
              <div className="pl-8 space-y-5">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Options</label>

                {/* Page Size */}
                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-foreground/80">Page Size</div>
                  <Select value={pageSize} onValueChange={(val: any) => setPageSize(val)}>
                    <SelectTrigger className="w-full bg-secondary/40 border border-border/80 text-xs h-8">
                      <SelectValue placeholder="Page Size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A4">A4 (Standard)</SelectItem>
                      <SelectItem value="Letter">US Letter</SelectItem>
                      <SelectItem value="Legal">US Legal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="opacity-50" />

                {/* Margins */}
                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-foreground/80">Margins</div>
                  <Select value={marginSize} onValueChange={(val: any) => setMarginSize(val)}>
                    <SelectTrigger className="w-full bg-secondary/40 border border-border/80 text-xs h-8">
                      <SelectValue placeholder="Margins" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None (0mm)</SelectItem>
                      <SelectItem value="thin">Thin (10mm)</SelectItem>
                      <SelectItem value="normal">Normal (20mm)</SelectItem>
                      <SelectItem value="thick">Thick (30mm)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="opacity-50" />

                {/* Running Header */}
                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-foreground/80">Running Header</div>
                  <Input
                    type="text"
                    value={customHeader}
                    onChange={(e) => setCustomHeader(e.target.value)}
                    placeholder="E.g., LumiPDF Guide"
                    className="bg-secondary/40 border border-border/80 text-xs h-8"
                  />
                </div>

                <Separator className="opacity-50" />

                {/* Page Numbers */}
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-foreground/80">Page Numbers</div>
                  <Checkbox
                    id="modal-page-numbers"
                    checked={showPageNumbers}
                    onCheckedChange={(checked) => setShowPageNumbers(checked === true)}
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer actions */}
            <div className="flex items-center justify-between pt-3 border-t border-border mt-2">
              <button
                onClick={() => {
                  setSettingsOpen(false);
                  setShowShortcutsHelp(true);
                }}
                className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground font-semibold"
              >
                <Keyboard size={11} />
                Shortcuts Cheat Sheet
              </button>
              <button
                onClick={() => setSettingsOpen(false)}
                style={{
                  backgroundColor: activeExportStyles.bg,
                  borderColor: activeExportStyles.border,
                  color: activeExportStyles.text,
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold border shadow-xs rounded-lg transition-all cursor-pointer hover:brightness-110 active:scale-95"
              >
                Done
              </button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Keyboard Shortcuts Dialog Modal */}
        <Dialog open={showShortcutsHelp} onOpenChange={setShowShortcutsHelp}>
          <DialogContent className={`max-w-sm p-6 theme-${appTheme} ${isDark ? "dark" : "light"}`} style={{ fontFamily: activeFontValue }}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-1.5 text-sm font-extrabold tracking-tight">
                <Keyboard size={16} className="text-violet-500" />
                Keyboard Shortcuts
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-3 text-xs pt-2">
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span className="text-muted-foreground">Toggle Write / Preview</span>
                <kbd className="px-1.5 py-0.5 rounded bg-secondary border border-border/80 font-mono text-[10px]">Ctrl + Space</kbd>
              </div>
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span className="text-muted-foreground">Open Configuration</span>
                <kbd className="px-1.5 py-0.5 rounded bg-secondary border border-border/80 font-mono text-[10px]">Ctrl + ,</kbd>
              </div>
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span className="text-muted-foreground">Export PDF / Print</span>
                <kbd className="px-1.5 py-0.5 rounded bg-secondary border border-border/80 font-mono text-[10px]">Ctrl + P</kbd>
              </div>
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span className="text-muted-foreground">Bold Selection</span>
                <kbd className="px-1.5 py-0.5 rounded bg-secondary border border-border/80 font-mono text-[10px]">Ctrl + B</kbd>
              </div>
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span className="text-muted-foreground">Italic Selection</span>
                <kbd className="px-1.5 py-0.5 rounded bg-secondary border border-border/80 font-mono text-[10px]">Ctrl + I</kbd>
              </div>
              <div className="flex items-center justify-between pb-1">
                <span className="text-muted-foreground">Insert Indentation</span>
                <kbd className="px-1.5 py-0.5 rounded bg-secondary border border-border/80 font-mono text-[10px]">Tab</kbd>
              </div>
            </div>

            <div className="mt-4 p-3 rounded bg-violet-600/5 border border-violet-500/10 flex items-start gap-2">
              <Info size={14} className="text-violet-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Standard text shortcuts like <span className="font-semibold text-foreground">Ctrl+Z</span> (Undo) and <span className="font-semibold text-foreground">Ctrl+Y</span> (Redo) run natively in the editor.
              </p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Hidden File Input for Opening Local Files */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".md,.markdown,.txt"
        />

        {/* Writing Goal Dialog */}
        <Dialog open={goalOpen} onOpenChange={setGoalOpen}>
          <DialogContent className={`max-w-xs p-6 theme-${appTheme} ${isDark ? "dark" : "light"}`} style={{ fontFamily: activeFontValue }}>
            <DialogHeader>
              <DialogTitle className="text-sm font-extrabold tracking-tight flex items-center gap-2">
                <Target size={16} className="text-primary" />
                Set Writing Goal
              </DialogTitle>
              <DialogDescription className="text-[11px] text-muted-foreground">
                Define a target word count for your current session.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Word Count Target</label>
                <Input
                  type="number"
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  placeholder="E.g., 500"
                  className="bg-secondary/40 border border-border/80 text-xs h-9"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-border pt-4 mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setWritingGoal(null);
                  setGoalOpen(false);
                }}
                className="text-xs text-red-500 hover:text-red-600 hover:bg-red-500/5 h-8 cursor-pointer"
              >
                Clear Goal
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setGoalOpen(false)}
                  className="text-xs h-8 cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => {
                    const val = parseInt(goalInput, 10);
                    if (!isNaN(val) && val > 0) {
                      setWritingGoal(val);
                    } else {
                      setWritingGoal(null);
                    }
                    setGoalOpen(false);
                  }}
                  className="text-xs h-8 px-4 cursor-pointer"
                >
                  Save Goal
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
