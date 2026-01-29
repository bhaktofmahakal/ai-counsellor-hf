
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/lightswind/card';
import { GradientButton } from '@/components/lightswind/gradient-button';
import { Badge } from '@/components/lightswind/badge';
import { FileText, Download, Trash2, Edit3, Plus, Save, Sparkles, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '@/lib/store';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

interface Document {
    id: string;
    title: string;
    type: string;
    content: string;
    status: string;
    updatedAt: string;
}

export default function DocumentsPage() {
    const { user } = useAppStore();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editData, setEditData] = useState({ title: '', content: '', type: 'SOP' });
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const res = await fetch('/api/documents');
            if (res.ok) {
                const data = await res.json();
                setDocuments(data);
            }
        } catch (e) {
            toast.error('Failed to load documents');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingId('new');
        setEditData({ title: 'Untitled Document', content: '', type: 'SOP' });
    };

    const handleSave = async () => {
        if (!editData.title.trim() || !editData.content.trim()) {
            toast.error('Title and content are required');
            return;
        }

        try {
            const isNew = editingId === 'new';
            const method = isNew ? 'POST' : 'PATCH';
            const body = isNew ? editData : { id: editingId, ...editData };

            const res = await fetch('/api/documents', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                toast.success(isNew ? 'Document created!' : 'Document saved!');
                setEditingId(null);
                fetchDocuments();
            }
        } catch (e) {
            toast.error('Error saving document');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this document?')) return;
        try {
            const res = await fetch(`/api/documents?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Deleted successfully');
                fetchDocuments();
            }
        } catch (e) {
            toast.error('Error deleting');
        }
    };

    const exportPDF = (doc: Document) => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const formatMarkdownForPDF = (text: string) => {
            let html = text
                // Headers
                .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                // Bold
                .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
                // Italic
                .replace(/\*(.*?)\*/gim, '<em>$1</em>')
                // Lists
                .replace(/^\s*[\-\*]\s+(.*$)/gim, '<li>$1</li>')
                .replace(/^\s*\d+\.\s+(.*$)/gim, '<li>$1</li>');

            // Wrap paragraphs
            html = html.split(/\n\n+/).map(block => {
                if (block.match(/<h|<li>/)) return block;
                return `<p>${block.replace(/\n/g, '<br/>')}</p>`;
            }).join('');

            return html;
        };

        printWindow.document.write(`
      <html>
        <head>
          <title>${doc.title}</title>
          <style>
            body { font-family: 'Times New Roman', serif; padding: 40px; color: #000; line-height: 1.6; max-width: 800px; mx-auto; }
            h1 { font-size: 24px; border-bottom: 2px solid #000; padding-bottom: 5px; margin-top: 20px; }
            h2 { font-size: 20px; margin-top: 15px; margin-bottom: 10px; font-weight: bold; }
            h3 { font-size: 16px; margin-top: 15px; font-weight: bold; text-decoration: underline; }
            p { margin-bottom: 15px; text-align: justify; }
            li { margin-left: 20px; margin-bottom: 5px; }
            strong { font-weight: bold; }
            .type { font-weight: bold; color: #666; font-size: 0.8em; text-transform: uppercase; margin-bottom: 30px; border-bottom: 1px dotted #ccc; padding-bottom: 10px; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <div class="type">${doc.type} - Generated by AI Counsellor</div>
          <h1>${doc.title}</h1>
          <div class="content">${formatMarkdownForPDF(doc.content)}</div>
          <script>window.onload = () => { window.print(); window.close(); };</script>
        </body>
      </html>
    `);
        printWindow.document.close();
    };

    const [itemStatuses, setItemStatuses] = useState<Record<string, string>>({
        transcript: 'PENDING',
        passport: 'PENDING',
        lor: 'PENDING',
        financial: 'PENDING',
    });

    const readinessItems = [
        { label: 'Transcripts', icon: FileText, key: 'transcript' },
        { label: 'Passport', icon: AlertCircle, key: 'passport' },
        { label: 'Reference Letters (LOR)', icon: Plus, key: 'lor' },
        { label: 'Financial Documents', icon: CheckCircle, key: 'financial' },
    ];

    const toggleStatus = (key: string) => {
        const statuses = ['PENDING', 'ONGOING', 'COMPLETED'];
        const currentIndex = statuses.indexOf(itemStatuses[key]);
        const nextIndex = (currentIndex + 1) % statuses.length;
        setItemStatuses({ ...itemStatuses, [key]: statuses[nextIndex] });
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'ONGOING': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            default: return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
        }
    };

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-display font-black text-white">Document Workspace</h1>
                    <p className="text-slate-400 mt-2">Draft, edit, and export your application documents.</p>
                </div>
                {!editingId && (
                    <GradientButton onClick={handleCreate} className="h-12 px-6 w-full sm:w-auto">
                        <Plus className="h-4 w-4 mr-2" /> New Document
                    </GradientButton>
                )}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column: Readiness Checklist (Phase 1) */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-xl">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-blue-400" />
                            Phase 1: Readiness
                        </h3>
                        <div className="space-y-4">
                            {readinessItems.map((item) => {
                                const status = itemStatuses[item.key];
                                return (
                                    <div
                                        key={item.key}
                                        onClick={() => toggleStatus(item.key)}
                                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon className="h-4 w-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
                                            <span className="text-sm text-slate-200">{item.label}</span>
                                        </div>
                                        <Badge className={`text-[10px] ${getStatusStyles(status)} transition-all`}>
                                            {status}
                                        </Badge>
                                    </div>
                                );
                            })}
                        </div>
                        <p className="text-[10px] text-slate-500 mt-6 leading-relaxed">
                            *Collecting these early speeds up your admission process significantly.
                        </p>
                    </Card>

                    <Card className="p-6 bg-gradient-to-br from-blue-600/20 to-transparent border-blue-500/20">
                        <h3 className="font-bold text-white mb-2">AI Tip</h3>
                        <p className="text-xs text-blue-200/70 leading-relaxed">
                            Ask the AI Counsellor to "Draft an SOP structure based on my profile" to get started instantly!
                        </p>
                    </Card>
                </div>

                {/* Right Column: Document List and Editor (Phase 4) */}
                <div className="lg:col-span-2">
                    {editingId ? (
                        <Card className="p-8 bg-slate-900/40 border-white/10 space-y-6">
                            <div className="flex justify-between items-center">
                                <input
                                    value={editData.title}
                                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                    className="bg-transparent text-2xl font-bold text-white outline-none focus:border-b-2 focus:border-blue-500 w-full"
                                    placeholder="Document Title"
                                />
                                <select
                                    value={editData.type}
                                    onChange={(e) => setEditData({ ...editData, type: e.target.value })}
                                    className="bg-slate-800 text-slate-300 text-xs px-3 py-1.5 rounded-lg outline-none"
                                >
                                    <option>SOP</option>
                                    <option>RESUME</option>
                                    <option>LOR</option>
                                    <option>OTHER</option>
                                </select>
                            </div>
                            <textarea
                                value={editData.content}
                                onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                                className="w-full h-[400px] bg-slate-950/50 rounded-2xl p-6 text-slate-200 border border-white/10 outline-none focus:border-blue-500/50 font-mono text-sm leading-relaxed resize-none"
                                placeholder="Paste your content here or type..."
                            />
                            <div className="flex gap-4">
                                <GradientButton onClick={handleSave} className="flex-1 h-12">
                                    <Save className="h-4 w-4 mr-2" /> Save Draft
                                </GradientButton>
                                <button
                                    onClick={() => setEditingId(null)}
                                    className="px-6 h-12 rounded-xl bg-slate-800 text-slate-400 hover:bg-slate-700 transition-all font-bold"
                                >
                                    Cancel
                                </button>
                            </div>
                        </Card>
                    ) : isLoading ? (
                        <div className="flex justify-center p-20 text-blue-500"><div className="animate-spin rounded-full h-12 w-12 border-4 border-current border-t-transparent" /></div>
                    ) : documents.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-20 bg-white/5 rounded-[2rem] border-2 border-dashed border-white/5 text-center">
                            <FileText className="h-16 w-16 text-slate-700 mb-4" />
                            <h3 className="text-xl font-bold text-slate-300">No documents yet</h3>
                            <p className="text-slate-500 max-w-xs mt-2">Start by creating your Statement of Purpose (SOP) or Resume.</p>
                            <GradientButton onClick={handleCreate} className="mt-8">Create First Document</GradientButton>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {documents.map((doc) => (
                                <div key={doc.id} className="group p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/30 hover:bg-blue-600/[0.02] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-5">
                                        <div className="h-12 w-12 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500 flex-shrink-0">
                                            <FileText className="h-6 w-6" />
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors truncate">{doc.title}</h4>
                                            <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                                <span className="uppercase font-bold text-blue-500/70">{doc.type}</span>
                                                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Updated {new Date(doc.updatedAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                                        <button
                                            onClick={() => { setEditingId(doc.id); setEditData({ title: doc.title, content: doc.content, type: doc.type }); }}
                                            className="p-2.5 bg-white/5 sm:bg-transparent hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                                            title="Edit"
                                        >
                                            <Edit3 className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => exportPDF(doc)}
                                            className="p-2.5 bg-blue-600/10 sm:bg-transparent hover:bg-blue-600/20 rounded-lg text-blue-500 hover:text-blue-400 transition-colors"
                                            title="Export PDF"
                                        >
                                            <Download className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(doc.id)}
                                            className="p-2.5 bg-red-600/10 sm:bg-transparent hover:bg-red-600/20 rounded-lg text-red-500 hover:text-red-400 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
