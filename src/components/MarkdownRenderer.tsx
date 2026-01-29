'use client';

import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const renderedContent = React.useMemo(() => {
    // Strip internal document delimiters from being rendered in chat
    let html = content
      .replace(/\[\[\[DOC_CONTENT_START\]\]\]/gi, '')
      .replace(/\[\[\[DOC_CONTENT_END\]\]\]/gi, '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Headers (handling after escaping < >)
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-white mt-4 mb-2">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-white mt-4 mb-3">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-white mt-4 mb-3">$1</h1>');

    // Bold/Italic
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold text-white">$1</strong>');
    html = html.replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>');

    // Code
    html = html.replace(/`([^`]+)`/gim, '<code class="bg-white/10 px-1.5 py-0.5 rounded text-blue-300 text-sm font-mono">$1</code>');

    // Lists logic:
    // 1. Identify list items and wrap them
    html = html.replace(/^\s*[\-\*]\s+(.*$)/gim, '<li class="list-item-bullet">$1</li>');
    html = html.replace(/^\s*\d+\.\s+(.*$)/gim, '<li class="list-item-number">$1</li>');

    // 2. Group adjacent bullet items into <ul>
    html = html.replace(/(<li class="list-item-bullet">.*<\/li>(\s*<li class="list-item-bullet">.*<\/li>)*)/gim, '<ul class="list-disc list-inside space-y-1 my-3 text-slate-300">$1</ul>');

    // 3. Group adjacent numbered items into <ol>
    html = html.replace(/(<li class="list-item-number">.*<\/li>(\s*<li class="list-item-number">.*<\/li>)*)/gim, '<ol class="list-decimal list-inside space-y-1 my-3 text-slate-300">$1</ol>');

    // Clean up temporary classes
    html = html.replace(/class="list-item-bullet"/g, '');
    html = html.replace(/class="list-item-number"/g, '');

    // Paragraphs and breaks
    // Avoid wrapping items already in lists/headers
    const lines = html.split('\n');
    const processedLines = lines.map(line => {
      if (line.trim() === '') return '<div class="h-2"></div>';
      if (line.startsWith('<h') || line.startsWith('<ul') || line.startsWith('<ol') || line.startsWith('<li') || line.startsWith('</')) {
        return line;
      }
      return `<p class="mb-3 last:mb-0">${line}</p>`;
    });

    return processedLines.join('');
  }, [content]);

  return (
    <div
      className={`prose prose-invert max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedContent }}
    />
  );
}
