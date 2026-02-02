import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { motion } from 'framer-motion';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language = 'python' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative group"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-primary/10 rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-500" />
      <div className="relative bg-primary rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-primary-foreground/10 bg-primary">
          <span className="text-sm text-primary-foreground/70 font-mono">{language}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-green-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
        <pre className="p-4 overflow-x-auto bg-primary">
          <code className="text-sm font-mono text-primary-foreground/90 leading-relaxed">
            {code.split('\n').map((line, i) => (
              <div key={i} className="flex">
                <span className="select-none text-primary-foreground/30 w-8 text-right mr-4">
                  {i + 1}
                </span>
                <span>
                  {highlightSyntax(line)}
                </span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </motion.div>
  );
}

function highlightSyntax(line: string) {
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: line
          .replace(/(from|import|def|class|return|async|await)/g, '<span class="text-cyan-300">$1</span>')
          .replace(/(".*?"|'.*?')/g, '<span class="text-green-300">$1</span>')
          .replace(/\b(DotPaymentsMiddleware|True|False|None|FastAPI)\b/g, '<span class="text-yellow-300">$1</span>')
          .replace(/(#.*)/g, '<span class="text-primary-foreground/50">$1</span>')
          .replace(/(@\w+)/g, '<span class="text-pink-300">$1</span>'),
      }}
    />
  );
}
