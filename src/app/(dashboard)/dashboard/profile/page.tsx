'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/lightswind/card';
import { Input } from '@/components/lightswind/input';
import { useAppStore } from '@/lib/store';
import { GradientButton } from '@/components/lightswind/gradient-button';
import { Badge } from '@/components/lightswind/badge';
import { User, Mail, GraduationCap, DollarSign, FileText, CheckCircle, Camera, X } from 'lucide-react';
import { toast } from 'sonner';
import { getProfileCompletionItems, calculateProfileStrength } from '@/lib/utils/profile';

export default function ProfilePage() {
  const { user, updateUser } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    education: '',
    degree: '',
    gpa: '',
    studyGoal: '',
    budgetMin: '',
    budgetMax: '',
    examStatus: '',
    examScores: '',
    fundingPlan: '',
    sopStatus: '',
    targetIntake: '',
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        education: user.education || '',
        degree: user.degree || '',
        gpa: user.gpa || '',
        studyGoal: user.studyGoal || '',
        budgetMin: user.budgetMin?.toString() || '',
        budgetMax: user.budgetMax?.toString() || '',
        examStatus: user.examStatus || '',
        examScores: user.examScores || '',
        fundingPlan: user.fundingPlan || '',
        sopStatus: user.sopStatus || '',
        targetIntake: user.targetIntake || '',
      });
      setProfileImage(user.avatar || null);
    }
  }, [user]);

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

  const completionItems = getProfileCompletionItems(profileData);
  const completionPercentage = calculateProfileStrength(profileData);

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
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              GPA / Percentage
            </label>
            <Input
              value={profileData.gpa}
              onChange={(e) => updateField('gpa', e.target.value)}
              className="w-full bg-slate-950/50 border-white/10 text-white focus:border-blue-600/50"
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
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Target Intake Year
            </label>
            <select
              value={profileData.targetIntake}
              onChange={(e) => updateField('targetIntake', e.target.value)}
              className="w-full px-3 py-2 bg-slate-950/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/50 text-white"
            >
              <option value="" className="bg-slate-950">Select Intake</option>
              <option value="fall-2026" className="bg-slate-950">Fall 2026</option>
              <option value="spring-2027" className="bg-slate-950">Spring 2027</option>
              <option value="fall-2027" className="bg-slate-950">Fall 2027</option>
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
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Funding Plan
            </label>
            <select
              value={profileData.fundingPlan}
              onChange={(e) => updateField('fundingPlan', e.target.value)}
              className="w-full px-3 py-2 bg-slate-950/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/50 text-white"
            >
              <option value="" className="bg-slate-950">Select Funding</option>
              <option value="self-funded" className="bg-slate-950">Self-funded</option>
              <option value="scholarship" className="bg-slate-950">Scholarship-dependent</option>
              <option value="loan" className="bg-slate-950">Loan-dependent</option>
            </select>
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
              SOP Status
            </label>
            <select
              value={profileData.sopStatus}
              onChange={(e) => updateField('sopStatus', e.target.value)}
              className="w-full px-3 py-2 bg-slate-950/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/50 text-white"
            >
              <option value="not-started" className="bg-slate-950">Not started</option>
              <option value="drafting" className="bg-slate-950">Drafting</option>
              <option value="reviewing" className="bg-slate-950">Reviewing</option>
              <option value="ready" className="bg-slate-950">Ready</option>
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
    </div >
  );
}
