"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/lightswind/button";
import { Card } from "@/components/lightswind/card";
import { Lock, Unlock, Trash2, CheckCircle2 } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";

interface ShortlistedUniversity {
    id: string;
    name: string;
    location: string;
    country: string;
    logo?: string;
}

export default function ShortlistPage() {
    const router = useRouter();
    const { user } = useAppStore();
    const [universities, setUniversities] = useState<ShortlistedUniversity[]>([]);
    const [lockedUniversityId, setLockedUniversityId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchShortlist();
    }, []);

    const fetchShortlist = async () => {
        try {
            const res = await fetch("/api/shortlist");
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to fetch shortlist");
            }
            const data = await res.json();
            console.log("✅ [Shortlist] API Response:", data);

            // API returns array of shortlists with nested university objects
            // Transform: [{ university: {...} }] => [{...university}]
            const shortlistedUniversities = Array.isArray(data)
                ? data.map((item: any) => {
                    if (!item.university) {
                        console.warn("⚠️ [Shortlist] Missing university data in item:", item);
                        return null;
                    }
                    return {
                        id: item.university.id,
                        name: item.university.name || "Unknown University",
                        location: item.university.location || "Multiple Locations",
                        country: item.university.country || "Global",
                        logo: item.university.logo || item.university.domain
                    };
                }).filter(Boolean) as ShortlistedUniversity[]
                : [];
            
            console.log("✅ [Shortlist] Transformed Universities:", shortlistedUniversities);
            setUniversities(shortlistedUniversities);

            // Fetch locked university from user profile
            if (user?.email) {
                const userRes = await fetch(`/api/user?email=${user.email}`);
                if (userRes.ok) {
                    const userData = await userRes.json();
                    setLockedUniversityId(userData.lockedUniversityId || null);
                }
            }
        } catch (error) {
            console.error("Error fetching shortlist:", error);
            toast.error("Failed to load shortlist");
        } finally {
            setLoading(false);
        }
    };

    const handleLock = async (universityId: string) => {
        try {
            const res = await fetch("/api/shortlist/lock", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ universityId }),
            });

            if (!res.ok) throw new Error("Failed to lock university");

            setLockedUniversityId(universityId);
            toast.success("University locked! Application Guidance is now unlocked.", {
                action: {
                    label: "Go to Tasks",
                    onClick: () => router.push("/dashboard/tasks"),
                },
            });

            // Auto redirect after a short delay
            setTimeout(() => {
                router.push("/dashboard/tasks");
            }, 1500);
        } catch (error) {
            console.error("Error locking university:", error);
            toast.error("Failed to lock university");
        }
    };

    const handleUnlock = async () => {
        try {
            const res = await fetch("/api/shortlist/lock", {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to unlock university");

            setLockedUniversityId(null);
            toast.success("University unlocked");
        } catch (error) {
            console.error("Error unlocking university:", error);
            toast.error("Failed to unlock university");
        }
    };

    const handleRemove = async (universityId: string) => {
        try {
            const res = await fetch(`/api/shortlist/${universityId}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to remove university");

            setUniversities(universities.filter((u) => u.id !== universityId));
            if (lockedUniversityId === universityId) {
                setLockedUniversityId(null);
            }
            toast.success("University removed from shortlist");
        } catch (error) {
            console.error("Error removing university:", error);
            toast.error("Failed to remove university");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 p-6 md:p-12">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-start justify-between mb-12">
                    <div>
                        <h1 className="text-5xl font-bold text-white mb-3">Your Shortlist</h1>
                        <p className="text-slate-400 text-lg">
                            Select and lock a university to unlock Application Guidance
                        </p>
                    </div>
                    {lockedUniversityId && (
                        <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-2">
                            <span className="text-emerald-500">✓</span>
                            <p className="text-emerald-500 font-medium">University Locked</p>
                        </div>
                    )}
                </div>

                {/* Empty State */}
                {universities.length === 0 && (
                    <Card className="p-16 text-center bg-slate-900/50 border-white/5">
                        <div className="max-w-md mx-auto">
                            <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Lock className="w-10 h-10 text-slate-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">
                                No universities shortlisted yet
                            </h3>
                            <p className="text-slate-400 mb-8 text-lg leading-relaxed">
                                Go to Discovery to find and shortlist universities that match your profile.
                            </p>
                            <Button
                                onClick={() => router.push("/dashboard/universities")}
                                className="bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-bold px-8 py-6 h-auto text-lg rounded-xl transition-all hover:scale-105"
                            >
                                Go to Discovery
                            </Button>
                        </div>
                    </Card>
                )}

                {/* University Cards */}
                <div className="space-y-4">
                    {universities.map((university) => {
                        const isLocked = lockedUniversityId === university.id;
                        const canLock = !lockedUniversityId;

                        return (
                            <Card
                                key={university.id}
                                className={`p-6 bg-white/[0.03] border transition-all ${isLocked
                                    ? "border-emerald-500/30 bg-emerald-500/5 shadow-[0_0_30px_rgba(16,185,129,0.05)]"
                                    : "border-white/5 hover:border-white/10"
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        {/* Logo Placeholder like Reference */}
                                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-indigo-500/20">
                                            {university.name.charAt(0)}
                                        </div>

                                        {/* Info */}
                                        <div className="space-y-1">
                                            <h3 className="text-2xl font-bold text-white">
                                                {university.name}
                                            </h3>
                                            <p className="text-slate-400 text-lg">
                                                {university.location}, {university.country}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-4">
                                        {isLocked ? (
                                            <>
                                                <Button
                                                    onClick={() => router.push("/dashboard/tasks")}
                                                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-12 px-6 rounded-xl"
                                                >
                                                    Go to Tasks & Guidance
                                                </Button>
                                                <Button
                                                    onClick={handleUnlock}
                                                    variant="ghost"
                                                    className="text-slate-400 hover:text-white hover:bg-white/5"
                                                >
                                                    <Unlock className="w-5 h-5 mr-2" />
                                                    Unlock
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button
                                                    onClick={() => handleLock(university.id)}
                                                    disabled={!canLock}
                                                    className="bg-[#B49E4F] hover:bg-[#C5AF5F] text-slate-950 font-bold h-12 px-8 flex items-center gap-2 rounded-xl transition-all hover:scale-105 disabled:opacity-50 disabled:grayscale disabled:scale-100"
                                                >
                                                    <Lock className="w-4 h-4" />
                                                    Lock
                                                </Button>
                                                <button
                                                    onClick={() => handleRemove(university.id)}
                                                    className="p-3 text-red-500/60 hover:text-red-500 transition-colors"
                                                    title="Remove from Shortlist"
                                                >
                                                    <Trash2 className="w-6 h-6" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
