'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/lightswind/card';
import { Input } from '@/components/lightswind/input';
import { useAppStore } from '@/lib/store';
import { GradientButton } from '@/components/lightswind/gradient-button';
import { calculateProfileStrength, getProfileCompletionItems } from '@/lib/utils/profile';
import { Badge } from '@/components/lightswind/badge';
import { User, Mail, GraduationCap, DollarSign, FileText, CheckCircle, Camera, X } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user, updateUser, currentStage } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploadingDoc, setUploadingDoc] = useState<{ id: string, name: string } | null>(null);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    education: '',
    degree: '',
    gpa: '',
    gpaScale: '10.0',
    studyGoal: '',
    targetField: '',
    targetIntake: '',
    fundingPlan: '',
    preferredCountries: '',
    budgetMin: '',
    budgetMax: '',
    examStatus: '',
    examScores: '',
    sopStatus: '', // Added to avoid missing field in logic
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        education: user.education || '',
        degree: user.degree || '',
        gpa: user.gpa || '',
        gpaScale: user.gpaScale || '10.0',
        studyGoal: user.studyGoal || '',
        targetField: user.targetField || '',
        targetIntake: user.targetIntake || '',
        fundingPlan: user.fundingPlan || '',
        preferredCountries: user.preferredCountries?.join(', ') || '',
        budgetMin: user.budgetMin?.toString() || '',
        budgetMax: user.budgetMax?.toString() || '',
        examStatus: user.examStatus || '',
        examScores: user.examScores || '',
        sopStatus: user.sopStatus || '',
      });
      setProfileImage(user.avatar || null);
    }
  }, [user]);

  const [documents, setDocuments] = useState<any[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);

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
      console.error('Error fetching documents:', e);
    } finally {
      setLoadingDocs(false);
    }
  };

  const handleUploadClick = (docType: string, docName: string) => {
    setUploadingDoc({ id: docType, name: docName });
    if (docInputRef.current) {
      docInputRef.current.value = ''; // Reset to allow same file re-upload
      docInputRef.current.click();
    }
  };

  const handleDocFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadingDoc) return;

    const docType = uploadingDoc.id;
    const docName = uploadingDoc.name;

    toast.promise(
      async () => {
        const reader = new FileReader();
        const contentPromise = new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file); // Use DataURL for all file types (PDF, Doc, etc)
        });
        
        const fileContent = await contentPromise;
        const res = await fetch('/api/documents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: `${docName} - ${file.name}`,
            type: docType,
            content: fileContent, // Base64 content
            status: 'ready'
          }),
        });
        if (!res.ok) throw new Error('Failed to upload');
        await fetchDocuments();
      },
      {
        loading: `Uploading ${file.name}...`,
        success: `${file.name} uploaded successfully!`,
        error: `Failed to upload ${file.name}`,
      }
    );
  };

  const getDocStatus = (type: string) => {
    return documents.some(d => d.type.toUpperCase() === type.toUpperCase()) ? 'uploaded' : 'missing';
  };
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: profileData.email,
          ...profileData,
          preferredCountries: profileData.preferredCountries.split(',').map(c => c.trim()).filter(Boolean),
          budgetMin: parseInt(profileData.budgetMin) || 0,
          budgetMax: parseInt(profileData.budgetMax) || 0,
          avatar: profileImage
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        updateUser(updatedUser);
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    }
    setIsSaving(false);
  };

  const updateField = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Use centralized logic for consistency
  const completionItems = getProfileCompletionItems({
    ...profileData,
    budgetMax: parseInt(profileData.budgetMax) || 0,
    preferredCountries: profileData.preferredCountries.split(',').map(c => c.trim()).filter(Boolean)
  });

  const completionPercentage = calculateProfileStrength({
    ...profileData,
    budgetMax: parseInt(profileData.budgetMax) || 0,
    preferredCountries: profileData.preferredCountries.split(',').map(c => c.trim()).filter(Boolean)
  });

  const initials = profileData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'JD';

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 font-display">
          Profile Settings
        </h1>
        <p className="text-slate-400">
          Keep your profile updated for the best recommendations
        </p>
      </div>

      <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
        <div className="flex items-center gap-6 mb-6">
          <div className="relative group">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-blue-600/20 overflow-hidden border-2 border-white/10">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-1.5 bg-slate-900 border border-white/20 rounded-full text-blue-400 hover:text-white transition-colors shadow-lg"
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-1">{profileData.name}</h3>
            <p className="text-slate-400">{profileData.email}</p>
            <div className="flex gap-2 mt-2">
              <Badge className="bg-blue-600/10 text-blue-400 border border-blue-600/20">
                {completionPercentage}% Complete
              </Badge>
              <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Active
              </Badge>
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoChange}
            className="hidden"
            accept="image/*"
          />
          <input
            type="file"
            ref={docInputRef}
            onChange={handleDocFileChange}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt"
          />
          <GradientButton
            variant="outline"
            className="border-white/10 hover:bg-white/5 text-white"
            onClick={() => fileInputRef.current?.click()}
          >
            Change Photo
          </GradientButton>
        </div>

        <div className="border-t border-white/10 pt-6">
          <h4 className="font-semibold text-white mb-4">Profile Completion</h4>
          <div className="space-y-2">
            {completionItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <CheckCircle className={`h-4 w-4 ${item.completed ? 'text-emerald-500' : 'text-slate-600'}`} />
                <span className={item.completed ? 'text-slate-300' : 'text-slate-500'}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 font-display">
          <User className="h-5 w-5 text-blue-600" />
          Personal Information
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Full Name
            </label>
            <Input
              value={profileData.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="w-full bg-slate-950/50 border-white/10 text-white focus:border-blue-600/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Email Address
            </label>
            <Input
              type="email"
              value={profileData.email}
              onChange={(e) => updateField('email', e.target.value)}
              className="w-full bg-slate-950/50 border-white/10 text-white focus:border-blue-600/50"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 font-display">
          <GraduationCap className="h-5 w-5 text-violet-500" />
          Academic Background
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Current Education Level
            </label>
            <select
              value={profileData.education}
              onChange={(e) => updateField('education', e.target.value)}
              className="w-full px-3 py-2 bg-slate-950/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/50 text-white"
            >
              <option value="high-school" className="bg-slate-950">High School</option>
              <option value="bachelors" className="bg-slate-950">Bachelor's Degree</option>
              <option value="masters" className="bg-slate-950">Master's Degree</option>
              <option value="other" className="bg-slate-950">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Degree/Major
            </label>
            <Input
              value={profileData.degree}
              onChange={(e) => updateField('degree', e.target.value)}
              className="w-full bg-slate-950/50 border-white/10 text-white focus:border-blue-600/50"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-400 mb-2">
                GPA / Percentage
              </label>
              <Input
                value={profileData.gpa}
                onChange={(e) => updateField('gpa', e.target.value)}
                className="w-full bg-slate-950/50 border-white/10 text-white focus:border-blue-600/50"
              />
            </div>
            <div className="w-32">
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Scale
              </label>
              <select
                value={profileData.gpaScale}
                onChange={(e) => updateField('gpaScale', e.target.value)}
                className="w-full px-3 py-2 bg-slate-950/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/50 text-white"
              >
                <option value="4.0" className="bg-slate-950">4.0</option>
                <option value="10.0" className="bg-slate-950">10.0</option>
                <option value="100" className="bg-slate-950">100%</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Target Field of Study (e.g. CS, AI, Finance)
            </label>
            <Input
              value={profileData.targetField}
              onChange={(e) => updateField('targetField', e.target.value)}
              className="w-full bg-slate-950/50 border-white/10 text-white focus:border-blue-600/50"
              placeholder="e.g. Computer Science"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Preferred Countries (comma separated)
            </label>
            <Input
              value={profileData.preferredCountries}
              onChange={(e) => updateField('preferredCountries', e.target.value)}
              className="w-full bg-slate-950/50 border-white/10 text-white focus:border-blue-600/50"
              placeholder="e.g. USA, Canada, Germany"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Target Intake (e.g. Fall 2025)
            </label>
            <Input
              value={profileData.targetIntake}
              onChange={(e) => updateField('targetIntake', e.target.value)}
              className="w-full bg-slate-950/50 border-white/10 text-white focus:border-blue-600/50"
              placeholder="e.g. Fall 2025"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Study Goal
            </label>
            <select
              value={profileData.studyGoal}
              onChange={(e) => updateField('studyGoal', e.target.value)}
              className="w-full px-3 py-2 bg-slate-950/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/50 text-white"
            >
              <option value="bachelors" className="bg-slate-950">Bachelor's Degree</option>
              <option value="masters" className="bg-slate-950">Master's Degree</option>
              <option value="phd" className="bg-slate-950">PhD</option>
              <option value="certificate" className="bg-slate-950">Certificate Program</option>
            </select>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 font-display">
          <DollarSign className="h-5 w-5 text-emerald-500" />
          Budget Planning
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Funding Plan
            </label>
            <select
              value={profileData.fundingPlan}
              onChange={(e) => updateField('fundingPlan', e.target.value)}
              className="w-full px-3 py-2 bg-slate-950/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/50 text-white"
            >
              <option value="Self-funded" className="bg-slate-950">Self-funded</option>
              <option value="Scholarship" className="bg-slate-950">Scholarship</option>
              <option value="Loan" className="bg-slate-950">Educational Loan</option>
              <option value="Sponsorship" className="bg-slate-950">Company Sponsorship</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Minimum Budget (USD/year)
            </label>
            <Input
              type="number"
              value={profileData.budgetMin}
              onChange={(e) => updateField('budgetMin', e.target.value)}
              className="w-full bg-slate-950/50 border-white/10 text-white focus:border-blue-600/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Maximum Budget (USD/year)
            </label>
            <Input
              type="number"
              value={profileData.budgetMax}
              onChange={(e) => updateField('budgetMax', e.target.value)}
              className="w-full bg-slate-950/50 border-white/10 text-white focus:border-blue-600/50"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 font-display">
          <FileText className="h-5 w-5 text-amber-500" />
          Exam Information
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Exam Status
            </label>
            <select
              value={profileData.examStatus}
              onChange={(e) => updateField('examStatus', e.target.value)}
              className="w-full px-3 py-2 bg-slate-950/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/50 text-white"
            >
              <option value="completed" className="bg-slate-950">Completed (have scores)</option>
              <option value="scheduled" className="bg-slate-950">Scheduled</option>
              <option value="planning" className="bg-slate-950">Planning to take</option>
              <option value="not-required" className="bg-slate-950">Not required</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Exam Scores
            </label>
            <Input
              value={profileData.examScores}
              onChange={(e) => updateField('examScores', e.target.value)}
              placeholder="e.g., GRE: 320, TOEFL: 110"
              className="w-full bg-slate-950/50 border-white/10 text-white focus:border-blue-600/50"
            />
          </div>
        </div>
      </Card>

      {/* Documents Vault */}
      <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 font-display">
          <FileText className="h-5 w-5 text-indigo-400" />
          Documents Vault
        </h3>
        <div className="space-y-4">
          {[
            { id: 'RESUME', name: 'Resume / CV' },
            { id: 'SOP', name: 'Statement of Purpose' },
            { id: 'TRANSCRIPT', name: 'Transcripts' },
          ].map((doc, idx) => {
            const status = getDocStatus(doc.id);
            return (
              <div key={idx} className="flex flex-col gap-2 p-4 bg-slate-950/50 border border-white/5 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className={`w-5 h-5 ${status === 'uploaded' ? 'text-indigo-400' : 'text-slate-600'}`} />
                    <span className="text-white font-medium">{doc.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={status === 'uploaded' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}>
                      {status === 'uploaded' ? 'UPLOADED' : 'MISSING'}
                    </Badge>
                    <button
                      type="button"
                      onClick={() => handleUploadClick(doc.id, doc.name)}
                      className="px-3 py-1 bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 rounded-lg border border-white/5 transition-all outline-none focus:ring-2 focus:ring-indigo-500/50"
                    >
                      {status === 'uploaded' ? 'REPLACE' : 'UPLOAD'}
                    </button>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 italic pl-8">
                  {status === 'uploaded' ? "File stored in your vault. AI will use this for analysis." : "Click Upload to select a file from your computer."}
                </p>
              </div>
            );
          })}
        </div>
        <p className="text-[10px] text-slate-500 mt-4 leading-relaxed">
          *Note: Documents are used by AI to analyze your application strength and provide specific feedback on essays.
        </p>
      </Card>


      <div className="flex gap-4">
        <GradientButton
          onClick={handleSave}
          disabled={isSaving}
          className="flex-1"
          gradientColors={['#2563eb', '#8b5cf6']}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </GradientButton>
        <GradientButton variant="outline" className="flex-1 border-white/10 hover:bg-white/5 text-white">
          Cancel
        </GradientButton>
      </div>
    </div>
  );
}
