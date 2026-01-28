"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
    content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
    return (
        <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:p-0 prose-pre:bg-transparent">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    code({ node, inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || "");
                        return !inline && match ? (
                            <div className="rounded-xl overflow-hidden my-4 border border-white/10 shadow-2xl">
                                <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-white/5">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                        {match[1]}
                                    </span>
                                </div>
                                <SyntaxHighlighter
                                    {...props}
                                    style={vscDarkPlus}
                                    language={match[1]}
                                    PreTag="div"
                                    className="!m-0 !bg-slate-950/50 !p-4 !text-sm"
                                >
                                    {String(children).replace(/\n$/, "")}
                                </SyntaxHighlighter>
                            </div>
                        ) : (
                            <code {...props} className={`${className} bg-white/10 px-1.5 py-0.5 rounded text-blue-300 font-mono text-sm`}>
                                {children}
                            </code>
                        );
                    },
                    h1: ({ children }) => <h1 className="text-3xl font-black mb-6 text-white tracking-tight">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-2xl font-black mb-4 mt-8 text-white tracking-tight flex items-center gap-2">
                        <div className="h-4 w-1 bg-blue-500 rounded-full" />
                        {children}
                    </h2>,
                    h3: ({ children }) => <h3 className="text-xl font-bold mb-3 mt-6 text-slate-200">{children}</h3>,
                    p: ({ children }) => <p className="text-slate-400 mb-4 leading-relaxed font-light">{children}</p>,
                    ul: ({ children }) => <ul className="space-y-2 mb-6 ml-4 list-none">{children}</ul>,
                    ol: ({ children }) => <ol className="space-y-3 mb-8 ml-4 list-decimal marker:text-blue-500 marker:font-black text-slate-400">{children}</ol>,
                    li: ({ children }) => (
                        <li className="flex gap-3 text-slate-400 leading-relaxed font-light">
                            <div className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500/50" />
                            <span>{children}</span>
                        </li>
                    ),
                    blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-blue-600 bg-blue-600/5 px-6 py-4 my-6 rounded-r-xl italic text-slate-300">
                            {children}
                        </blockquote>
                    ),
                    strong: ({ children }) => <strong className="font-bold text-white tracking-wide">{children}</strong>,
                    a: ({ children, href }) => (
                        <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline decoration-blue-500/30 underline-offset-4 transition-colors font-medium">
                            {children}
                        </a>
                    ),
                    hr: () => <hr className="my-10 border-white/5" />,
                    table: ({ children }) => (
                        <div className="overflow-x-auto my-8 rounded-xl border border-white/10">
                            <table className="min-w-full divide-y divide-white/10 bg-slate-950/20">
                                {children}
                            </table>
                        </div>
                    ),
                    th: ({ children }) => <th className="px-4 py-3 bg-white/5 text-left text-xs font-black uppercase tracking-widest text-slate-400">{children}</th>,
                    td: ({ children }) => <td className="px-4 py-3 text-sm text-slate-400 border-t border-white/5">{children}</td>,
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownRenderer;
