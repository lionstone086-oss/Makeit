
import React, { useState, useEffect } from 'react';
import { Project, SkillTrack } from '../types';
import SkillPassport from './SkillPassport';
import { TRACK_COLORS, MOCK_STUDENT_DATA } from '../constants';
import { StorageService } from '../services/storageService';
import { GeminiService } from '../services/geminiService';
import { 
    Upload, 
    ArrowRight, 
    CheckCircle2, 
    Clock, 
    Filter,
    Video,
    Sparkles,
    RefreshCw,
    Plus,
    Trash2,
    Check
} from 'lucide-react';

const StudentDashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [editingPrompt, setEditingPrompt] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setProjects(StorageService.getProjects());
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(reader.result as string);
        setEditingImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditImage = async () => {
    if (!editingImage || !editingPrompt) return;
    setIsEditing(true);
    try {
      const result = await GeminiService.editImage(editingImage, editingPrompt);
      if (result) setEditingImage(result);
    } catch (error) {
        alert("AI Editor busy. Please try again.");
    } finally {
        setIsEditing(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!editingImage) return;
    setIsGeneratingVideo(true);
    try {
        const url = await GeminiService.generateVideoFromProject(editingImage, `Cinematic 3D reveal of a ${projectTitle || 'student project'} in a high-tech studio environment.`);
        setGeneratedVideo(url);
    } catch (e) {
        alert("Video generation requires a selected API key with billing enabled.");
    } finally {
        setIsGeneratingVideo(false);
    }
  };

  const handleSubmitProject = () => {
    if (!projectTitle || !editingImage) return;
    setIsSubmitting(true);
    const newProject: Project = {
        id: Math.random().toString(36).substr(2, 9),
        title: projectTitle,
        description: `Created on ${new Date().toLocaleDateString()}`,
        track: SkillTrack.TECH,
        status: 'SUBMITTED',
        imageUrl: editingImage,
        videoUrl: generatedVideo || undefined,
        timestamp: Date.now()
    };
    StorageService.saveProject(newProject);
    setProjects(StorageService.getProjects());
    
    // Reset form
    setSelectedFile(null);
    setProjectTitle('');
    setGeneratedVideo(null);
    setIsSubmitting(false);
  };

  const handleDelete = (id: string) => {
    StorageService.deleteProject(id);
    setProjects(StorageService.getProjects());
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="lg:col-span-1 space-y-8">
        <SkillPassport skills={MOCK_STUDENT_DATA.skills} />
        
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center justify-between">
                Current Track
                <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4" />
                </div>
            </h3>
            <div className={`p-5 rounded-3xl border-2 ${TRACK_COLORS[SkillTrack.TECH].border} ${TRACK_COLORS[SkillTrack.TECH].bg} relative overflow-hidden`}>
                <div className="flex items-center justify-between mb-4">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${TRACK_COLORS[SkillTrack.TECH].text}`}>Full Program</span>
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-blue-100 font-black shadow-sm">TERM 2</span>
                </div>
                <h4 className="font-bold text-blue-900 text-lg mb-1 leading-tight">Advanced Robotics & IoT</h4>
                <p className="text-sm text-blue-700/70 mb-6">Course progress: 85%</p>
                <div className="h-1.5 w-full bg-blue-200/50 rounded-full mb-6">
                    <div className="h-full bg-blue-600 rounded-full w-[85%]"></div>
                </div>
                <button className="w-full py-3 bg-blue-600 text-white text-sm font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                    Resume Module
                </button>
            </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-black text-slate-800">New Submission</h2>
                    <p className="text-slate-400 text-sm">Create high-impact portfolio pieces with AI.</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                    <Upload className="w-6 h-6 text-blue-500" />
                </div>
            </div>
            
            {!selectedFile ? (
                <label className="border-4 border-dashed border-slate-100 rounded-[2.5rem] p-16 flex flex-col items-center justify-center cursor-pointer hover:border-blue-200 hover:bg-blue-50/30 transition-all group">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Plus className="w-10 h-10 text-slate-300 group-hover:text-blue-500" />
                    </div>
                    <p className="font-black text-xl text-slate-400 group-hover:text-blue-600">Choose Project Image</p>
                    <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                </label>
            ) : (
                <div className="space-y-8 animate-in zoom-in-95 duration-300">
                    <div className="space-y-4">
                        <input 
                            type="text" 
                            placeholder="Enter Project Title"
                            value={projectTitle}
                            onChange={(e) => setProjectTitle(e.target.value)}
                            className="w-full bg-slate-50 border-none rounded-2xl p-4 text-lg font-bold text-slate-800 focus:ring-4 focus:ring-blue-100 outline-none"
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="relative">
                            <img src={editingImage!} alt="Preview" className="w-full h-80 object-cover rounded-3xl shadow-xl border-4 border-white" />
                            <button onClick={() => { setSelectedFile(null); setEditingImage(null); }} className="absolute -top-3 -right-3 p-3 bg-red-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform">
                                <RefreshCw className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-6">
                            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                <h4 className="text-xs font-black text-slate-400 mb-3 uppercase tracking-widest flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-indigo-500" /> AI Retouch
                                </h4>
                                <textarea 
                                    className="w-full bg-white border border-slate-100 rounded-2xl p-4 text-sm focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none shadow-sm"
                                    rows={3}
                                    placeholder="Describe how to enhance (e.g., 'professional studio background')..."
                                    value={editingPrompt}
                                    onChange={(e) => setEditingPrompt(e.target.value)}
                                />
                                <button onClick={handleEditImage} disabled={isEditing} className="mt-4 w-full py-3 bg-slate-900 text-white text-sm font-bold rounded-2xl shadow-lg shadow-slate-200">
                                    {isEditing ? 'Processing...' : 'Enhance Image'}
                                </button>
                            </div>
                            
                            <button onClick={handleGenerateVideo} disabled={isGeneratingVideo} className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-indigo-100">
                                {isGeneratingVideo ? 'Rendering...' : <><Video className="w-6 h-6" /> Create AI Reveal</>}
                            </button>
                        </div>
                    </div>

                    {generatedVideo && (
                        <div className="p-2 bg-indigo-50 rounded-[2rem] border border-indigo-100">
                            <video src={generatedVideo} controls className="w-full h-auto rounded-[1.8rem] shadow-2xl bg-black aspect-video" />
                        </div>
                    )}

                    <div className="flex justify-center pt-4">
                        <button 
                            onClick={handleSubmitProject}
                            disabled={isSubmitting || !projectTitle}
                            className="px-12 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 disabled:opacity-50"
                        >
                            Publish to Portfolio
                        </button>
                    </div>
                </div>
            )}
        </div>

        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-800">Portfolio Highlights</h2>
                <div className="flex gap-2">
                    <button className="p-3 bg-white rounded-2xl border border-slate-200 text-slate-400 hover:text-slate-800 transition-colors">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {projects.sort((a,b) => b.timestamp - a.timestamp).map(project => (
                    <div key={project.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
                        <div className="relative h-56 overflow-hidden">
                            <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute top-4 left-4">
                                <span className={`text-[10px] font-black px-3 py-1.5 rounded-full bg-white/90 backdrop-blur shadow-sm border ${TRACK_COLORS[project.track].text} tracking-wider uppercase`}>
                                    {project.track}
                                </span>
                            </div>
                            <button onClick={() => handleDelete(project.id)} className="absolute top-4 right-4 p-2 bg-white/90 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-6">
                            <h3 className="font-bold text-slate-900 text-xl mb-2">{project.title}</h3>
                            <p className="text-xs text-slate-400 font-bold uppercase mb-4">{new Date(project.timestamp).toLocaleDateString()}</p>
                            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                {project.status === 'GRADED' ? (
                                    <div className="flex items-center gap-1.5 text-green-600 font-black text-[10px] uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full">
                                        <CheckCircle2 className="w-3 h-3" /> Grade: {project.grade}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1.5 text-amber-600 font-black text-[10px] uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full italic">
                                        <Clock className="w-3 h-3" /> Under Review
                                    </div>
                                )}
                                <button className="text-blue-600 text-sm font-black flex items-center gap-1">
                                    View <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
