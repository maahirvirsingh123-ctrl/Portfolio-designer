import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Project } from '../types';
import { SiteSettings, subscribeToSettings, updateSettings } from '../services/settingsService';
import { Plus, Trash2, Edit2, LogOut, LogIn, Save, X, Image as ImageIcon, Settings as SettingsIcon, Layout, Upload } from 'lucide-react';

export const AdminDashboard = () => {
  const { isAdmin, loading, loginAsAdmin, logoutAdmin } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [activeTab, setActiveTab] = useState<'projects' | 'settings'>('projects');
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = await loginAsAdmin(password);
    if (!success) {
      setError('Invalid administrative password.');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.url) {
        callback(data.url);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) return;
    const q = query(collection(db, 'projects'), orderBy('order', 'asc'));
    const unsubscribeProjects = onSnapshot(q, (snapshot) => {
      setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Project[]);
    });
    const unsubscribeSettings = subscribeToSettings(setSettings);
    return () => {
      unsubscribeProjects();
      unsubscribeSettings();
    };
  }, [isAdmin]);

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    try {
      if (editingProject.id) {
        const { id, ...data } = editingProject;
        await updateDoc(doc(db, 'projects', id), data);
      } else {
        await addDoc(collection(db, 'projects'), {
          ...editingProject,
          order: projects.length,
          gallery: editingProject.gallery || [],
          stats: editingProject.stats || []
        });
      }
      setEditingProject(null);
      setIsAdding(false);
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      await updateSettings(settings);
      alert('Settings updated successfully');
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      await deleteDoc(doc(db, 'projects', id));
    }
  };

  if (loading) return <div className="min-h-screen bg-brand-dark flex items-center justify-center font-mono text-white/20">LOADING_SYSTEM...</div>;

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-8 max-w-md w-full">
          <h1 className="text-4xl font-serif italic text-white">Admin Access</h1>
          <p className="text-white/40 font-serif italic">Please enter the administrative password to manage the portfolio.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2 text-left">
              <label className="font-mono text-[10px] uppercase tracking-widest text-white/30">Password</label>
              <input 
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 p-4 focus:border-brand-accent outline-none text-white"
                placeholder="••••••••"
                required
              />
            </div>
            {error && <p className="text-red-500 text-[10px] uppercase tracking-widest">{error}</p>}
            <button 
              type="submit"
              className="w-full py-4 bg-white text-brand-dark font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-brand-accent transition-colors"
            >
              <LogIn size={16} /> Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-20 gap-8">
          <div>
            <h1 className="text-4xl font-serif italic mb-2">Portfolio Manager</h1>
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/30">Administrative Mode Active</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={logoutAdmin}
              className="text-white/30 hover:text-brand-accent uppercase tracking-widest text-[10px] font-bold flex items-center gap-2"
            >
              <LogOut size={14} /> Exit Admin
            </button>
            <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
              <button 
                onClick={() => setActiveTab('projects')}
                className={`px-4 py-2 rounded-md text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 transition-all ${activeTab === 'projects' ? 'bg-brand-accent text-brand-dark' : 'text-white/50 hover:text-white'}`}
              >
                <Layout size={14} /> Projects
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-2 rounded-md text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 transition-all ${activeTab === 'settings' ? 'bg-brand-accent text-brand-dark' : 'text-white/50 hover:text-white'}`}
              >
                <SettingsIcon size={14} /> Site Content
              </button>
            </div>
          </div>
        </header>

        {activeTab === 'projects' ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-serif italic">Project Portfolio</h2>
              <button 
                onClick={() => { setIsAdding(true); setEditingProject({}); }}
                className="px-6 py-3 bg-brand-accent text-brand-dark font-bold uppercase tracking-widest text-[10px] flex items-center gap-2"
              >
                <Plus size={14} /> New Project
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {projects.map(project => (
                <div key={project.id} className="border border-white/5 bg-brand-gray/50 p-6 flex items-center justify-between group rounded-lg">
                  <div className="flex items-center gap-6">
                    <img src={project.imageUrl} className="w-20 h-20 object-cover grayscale rounded" alt="" />
                    <div>
                      <h3 className="text-xl font-serif italic">{project.title}</h3>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-white/30">{project.category} // {project.year}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => setEditingProject(project)}
                      className="p-3 border border-white/10 hover:bg-brand-accent hover:text-brand-dark transition-all rounded"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteProject(project.id)}
                      className="p-3 border border-white/10 hover:bg-red-500/20 hover:text-red-500 transition-all rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            <h2 className="text-2xl font-serif italic">Global Site Content</h2>
            {settings && (
              <form onSubmit={handleSaveSettings} className="space-y-12">
                <div className="bg-brand-gray/50 border border-white/5 p-8 rounded-xl space-y-8">
                  <h3 className="font-mono text-[10px] uppercase tracking-[0.4em] text-brand-accent">Hero Section</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="font-mono text-[10px] uppercase tracking-widest text-white/30">Title Line 1</label>
                      <input 
                        value={settings.heroTitle1 || ''}
                        onChange={e => setSettings({...settings, heroTitle1: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 p-4 focus:border-brand-accent outline-none font-serif italic text-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-mono text-[10px] uppercase tracking-widest text-white/30">Title Line 2</label>
                      <input 
                        value={settings.heroTitle2 || ''}
                        onChange={e => setSettings({...settings, heroTitle2: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 p-4 focus:border-brand-accent outline-none font-serif italic text-xl"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="font-mono text-[10px] uppercase tracking-widest text-white/30">Subtitle / Bio</label>
                      <textarea 
                        rows={3}
                        value={settings.heroSubtitle || ''}
                        onChange={e => setSettings({...settings, heroSubtitle: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 p-4 focus:border-brand-accent outline-none font-serif italic text-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-mono text-[10px] uppercase tracking-widest text-white/30">Location Text</label>
                      <input 
                        value={settings.heroLocation || ''}
                        onChange={e => setSettings({...settings, heroLocation: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 p-4 focus:border-brand-accent outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-mono text-[10px] uppercase tracking-widest text-white/30">Vertical Rail Text</label>
                      <input 
                        value={settings.heroVerticalText || ''}
                        onChange={e => setSettings({...settings, heroVerticalText: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 p-4 focus:border-brand-accent outline-none"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="font-mono text-[10px] uppercase tracking-widest text-white/30">Hero Image</label>
                      <div className="flex gap-4">
                        <div className="flex-1 relative">
                          <input 
                            value={settings.heroImageUrl || ''}
                            onChange={e => setSettings({...settings, heroImageUrl: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 p-4 focus:border-brand-accent outline-none pr-12"
                            placeholder="Image URL or upload"
                          />
                          <label className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-white/30 hover:text-brand-accent transition-colors">
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*"
                              onChange={e => handleFileUpload(e, (url) => setSettings({...settings, heroImageUrl: url}))}
                            />
                            <Upload size={18} className={isUploading ? 'animate-pulse' : ''} />
                          </label>
                        </div>
                        {settings.heroImageUrl && <img src={settings.heroImageUrl} className="w-14 h-14 object-cover border border-white/10" alt="" />}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-brand-gray/50 border border-white/5 p-8 rounded-xl space-y-8">
                  <h3 className="font-mono text-[10px] uppercase tracking-[0.4em] text-brand-accent">Philosophy Section</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="font-mono text-[10px] uppercase tracking-widest text-white/30">Section Title</label>
                      <input 
                        value={settings.philosophyTitle || ''}
                        onChange={e => setSettings({...settings, philosophyTitle: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 p-4 focus:border-brand-accent outline-none font-serif italic text-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-mono text-[10px] uppercase tracking-widest text-white/30">Subtitle</label>
                      <input 
                        value={settings.philosophySubtitle || ''}
                        onChange={e => setSettings({...settings, philosophySubtitle: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 p-4 focus:border-brand-accent outline-none"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="font-mono text-[10px] uppercase tracking-widest text-white/30">Description</label>
                      <textarea 
                        rows={4}
                        value={settings.philosophyDescription || ''}
                        onChange={e => setSettings({...settings, philosophyDescription: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 p-4 focus:border-brand-accent outline-none font-serif italic text-lg"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-brand-gray/50 border border-white/5 p-8 rounded-xl space-y-8">
                  <h3 className="font-mono text-[10px] uppercase tracking-[0.4em] text-brand-accent">Process Steps</h3>
                  <div className="space-y-6">
                    {settings.processSteps?.map((step, i) => (
                      <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-white/5 bg-white/5 rounded-lg">
                        <input 
                          placeholder="No."
                          value={step.number}
                          onChange={e => {
                            const newSteps = [...settings.processSteps];
                            newSteps[i].number = e.target.value;
                            setSettings({...settings, processSteps: newSteps});
                          }}
                          className="bg-white/5 border border-white/10 p-2 outline-none text-xs"
                        />
                        <input 
                          placeholder="Title"
                          value={step.title}
                          onChange={e => {
                            const newSteps = [...settings.processSteps];
                            newSteps[i].title = e.target.value;
                            setSettings({...settings, processSteps: newSteps});
                          }}
                          className="bg-white/5 border border-white/10 p-2 outline-none text-xs"
                        />
                        <div className="flex gap-2">
                          <input 
                            placeholder="Description"
                            value={step.description}
                            onChange={e => {
                              const newSteps = [...settings.processSteps];
                              newSteps[i].description = e.target.value;
                              setSettings({...settings, processSteps: newSteps});
                            }}
                            className="flex-1 bg-white/5 border border-white/10 p-2 outline-none text-xs"
                          />
                          <button 
                            type="button"
                            onClick={() => {
                              const newSteps = settings.processSteps.filter((_, idx) => idx !== i);
                              setSettings({...settings, processSteps: newSteps});
                            }}
                            className="p-2 text-red-500 hover:bg-red-500/10 rounded"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                    <button 
                      type="button"
                      onClick={() => setSettings({...settings, processSteps: [...(settings.processSteps || []), { number: '', title: '', description: '' }]})}
                      className="w-full py-3 border border-dashed border-white/20 text-[10px] uppercase tracking-widest hover:border-brand-accent hover:text-brand-accent transition-all"
                    >
                      + Add Process Step
                    </button>
                  </div>
                </div>

                <div className="bg-brand-gray/50 border border-white/5 p-8 rounded-xl space-y-8">
                  <h3 className="font-mono text-[10px] uppercase tracking-[0.4em] text-brand-accent">Awards & Recognition</h3>
                  <div className="space-y-6">
                    {settings.awards?.map((award, i) => (
                      <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-white/5 bg-white/5 rounded-lg">
                        <input 
                          placeholder="Year"
                          value={award.year}
                          onChange={e => {
                            const newAwards = [...settings.awards];
                            newAwards[i].year = e.target.value;
                            setSettings({...settings, awards: newAwards});
                          }}
                          className="bg-white/5 border border-white/10 p-2 outline-none text-xs"
                        />
                        <input 
                          placeholder="Title"
                          value={award.title}
                          onChange={e => {
                            const newAwards = [...settings.awards];
                            newAwards[i].title = e.target.value;
                            setSettings({...settings, awards: newAwards});
                          }}
                          className="bg-white/5 border border-white/10 p-2 outline-none text-xs"
                        />
                        <div className="flex gap-2">
                          <input 
                            placeholder="Organization"
                            value={award.organization}
                            onChange={e => {
                              const newAwards = [...settings.awards];
                              newAwards[i].organization = e.target.value;
                              setSettings({...settings, awards: newAwards});
                            }}
                            className="flex-1 bg-white/5 border border-white/10 p-2 outline-none text-xs"
                          />
                          <button 
                            type="button"
                            onClick={() => {
                              const newAwards = settings.awards.filter((_, idx) => idx !== i);
                              setSettings({...settings, awards: newAwards});
                            }}
                            className="p-2 text-red-500 hover:bg-red-500/10 rounded"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                    <button 
                      type="button"
                      onClick={() => setSettings({...settings, awards: [...(settings.awards || []), { year: '', title: '', organization: '' }]})}
                      className="w-full py-3 border border-dashed border-white/20 text-[10px] uppercase tracking-widest hover:border-brand-accent hover:text-brand-accent transition-all"
                    >
                      + Add Award
                    </button>
                  </div>
                </div>

                <div className="bg-brand-gray/50 border border-white/5 p-8 rounded-xl space-y-8">
                  <h3 className="font-mono text-[10px] uppercase tracking-[0.4em] text-brand-accent">Materials & Craftsmanship Section</h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="font-mono text-[10px] uppercase tracking-widest text-white/30">Section Title</label>
                      <input 
                        value={settings.materialsTitle || ''}
                        onChange={e => setSettings({...settings, materialsTitle: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 p-4 focus:border-brand-accent outline-none"
                        placeholder="e.g., Materials & Craftsmanship"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-mono text-[10px] uppercase tracking-widest text-white/30">Section Description</label>
                      <textarea 
                        rows={3}
                        value={settings.materialsDescription || ''}
                        onChange={e => setSettings({...settings, materialsDescription: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 p-4 focus:border-brand-accent outline-none font-serif italic"
                        placeholder="Describe the studio's approach to materials..."
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="font-mono text-[10px] uppercase tracking-widest text-white/30">Material Items</label>
                      {settings.materialsItems?.map((item, i) => (
                        <div key={i} className="p-4 border border-white/5 bg-white/5 rounded-lg space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input 
                              placeholder="Material Title"
                              value={item.title}
                              onChange={e => {
                                const newItems = [...settings.materialsItems];
                                newItems[i].title = e.target.value;
                                setSettings({...settings, materialsItems: newItems});
                              }}
                              className="bg-white/5 border border-white/10 p-2 outline-none text-xs"
                            />
                            <div className="relative">
                              <input 
                                placeholder="Image URL or upload"
                                value={item.imageUrl}
                                onChange={e => {
                                  const newItems = [...settings.materialsItems];
                                  newItems[i].imageUrl = e.target.value;
                                  setSettings({...settings, materialsItems: newItems});
                                }}
                                className="w-full bg-white/5 border border-white/10 p-2 outline-none text-xs pr-8"
                              />
                              <label className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-white/30 hover:text-brand-accent transition-colors">
                                <input 
                                  type="file" 
                                  className="hidden" 
                                  accept="image/*"
                                  onChange={e => handleFileUpload(e, (url) => {
                                    const newItems = [...settings.materialsItems];
                                    newItems[i].imageUrl = url;
                                    setSettings({...settings, materialsItems: newItems});
                                  })}
                                />
                                <Upload size={14} className={isUploading ? 'animate-pulse' : ''} />
                              </label>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <textarea 
                              placeholder="Description"
                              value={item.description}
                              onChange={e => {
                                const newItems = [...settings.materialsItems];
                                newItems[i].description = e.target.value;
                                setSettings({...settings, materialsItems: newItems});
                              }}
                              className="flex-1 bg-white/5 border border-white/10 p-2 outline-none text-xs"
                            />
                            <button 
                              type="button"
                              onClick={() => {
                                const newItems = settings.materialsItems.filter((_, idx) => idx !== i);
                                setSettings({...settings, materialsItems: newItems});
                              }}
                              className="p-2 text-red-500 hover:bg-red-500/10 rounded"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                      <button 
                        type="button"
                        onClick={() => setSettings({...settings, materialsItems: [...(settings.materialsItems || []), { title: '', description: '', imageUrl: '' }]})}
                        className="w-full py-3 border border-dashed border-white/20 text-[10px] uppercase tracking-widest hover:border-brand-accent hover:text-brand-accent transition-all"
                      >
                        + Add Material Item
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-brand-gray/50 border border-white/5 p-8 rounded-xl space-y-8">
                  <h3 className="font-mono text-[10px] uppercase tracking-[0.4em] text-brand-accent">Testimonials</h3>
                  <div className="space-y-6">
                    {settings.testimonials?.map((t, i) => (
                      <div key={i} className="p-4 border border-white/5 bg-white/5 rounded-lg space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <input 
                            placeholder="Name"
                            value={t.name}
                            onChange={e => {
                              const newT = [...settings.testimonials];
                              newT[i].name = e.target.value;
                              setSettings({...settings, testimonials: newT});
                            }}
                            className="bg-white/5 border border-white/10 p-2 outline-none text-xs"
                          />
                          <input 
                            placeholder="Role"
                            value={t.role}
                            onChange={e => {
                              const newT = [...settings.testimonials];
                              newT[i].role = e.target.value;
                              setSettings({...settings, testimonials: newT});
                            }}
                            className="bg-white/5 border border-white/10 p-2 outline-none text-xs"
                          />
                          <input 
                            placeholder="Company"
                            value={t.company}
                            onChange={e => {
                              const newT = [...settings.testimonials];
                              newT[i].company = e.target.value;
                              setSettings({...settings, testimonials: newT});
                            }}
                            className="bg-white/5 border border-white/10 p-2 outline-none text-xs"
                          />
                        </div>
                        <div className="flex gap-2">
                          <textarea 
                            placeholder="Testimonial Content"
                            value={t.content}
                            onChange={e => {
                              const newT = [...settings.testimonials];
                              newT[i].content = e.target.value;
                              setSettings({...settings, testimonials: newT});
                            }}
                            className="flex-1 bg-white/5 border border-white/10 p-2 outline-none text-xs"
                          />
                          <button 
                            type="button"
                            onClick={() => {
                              const newT = settings.testimonials.filter((_, idx) => idx !== i);
                              setSettings({...settings, testimonials: newT});
                            }}
                            className="p-2 text-red-500 hover:bg-red-500/10 rounded"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                    <button 
                      type="button"
                      onClick={() => setSettings({...settings, testimonials: [...(settings.testimonials || []), { name: '', role: '', company: '', content: '' }]})}
                      className="w-full py-3 border border-dashed border-white/20 text-[10px] uppercase tracking-widest hover:border-brand-accent hover:text-brand-accent transition-all"
                    >
                      + Add Testimonial
                    </button>
                  </div>
                </div>

                <div className="bg-brand-gray/50 border border-white/5 p-8 rounded-xl space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="font-mono text-[10px] uppercase tracking-widest text-white/30">Email Address</label>
                      <input 
                        value={settings.contactEmail || ''}
                        onChange={e => setSettings({...settings, contactEmail: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 p-4 focus:border-brand-accent outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-mono text-[10px] uppercase tracking-widest text-white/30">Phone Number</label>
                      <input 
                        value={settings.contactPhone || ''}
                        onChange={e => setSettings({...settings, contactPhone: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 p-4 focus:border-brand-accent outline-none"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="font-mono text-[10px] uppercase tracking-widest text-white/30">Office Address</label>
                      <input 
                        value={settings.contactAddress || ''}
                        onChange={e => setSettings({...settings, contactAddress: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 p-4 focus:border-brand-accent outline-none"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-6 bg-brand-accent text-brand-dark font-bold uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:bg-white transition-all rounded-xl"
                >
                  <Save size={18} /> Update Global Site Content
                </button>
              </form>
            )}
          </div>
        )}

        {/* Edit Project Modal */}
        {(isAdding || editingProject?.id) && (
          <div className="fixed inset-0 z-[100] bg-brand-dark/95 backdrop-blur-xl flex items-center justify-center p-6 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-brand-gray border border-white/10 w-full max-w-4xl p-8 md:p-12 my-auto rounded-2xl"
            >
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-3xl font-serif italic">{editingProject?.id ? 'Edit Project' : 'New Project'}</h2>
                <button onClick={() => { setEditingProject(null); setIsAdding(false); }} className="text-white/30 hover:text-white"><X size={24} /></button>
              </div>

              <form onSubmit={handleSaveProject} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] uppercase tracking-widest text-white/30">Project Title</label>
                    <input 
                      required
                      value={editingProject?.title || ''}
                      onChange={e => setEditingProject({...editingProject, title: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 p-4 focus:border-brand-accent outline-none font-serif italic text-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] uppercase tracking-widest text-white/30">Category</label>
                    <input 
                      required
                      value={editingProject?.category || ''}
                      onChange={e => setEditingProject({...editingProject, category: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 p-4 focus:border-brand-accent outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] uppercase tracking-widest text-white/30">Year</label>
                    <input 
                      required
                      value={editingProject?.year || ''}
                      onChange={e => setEditingProject({...editingProject, year: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 p-4 focus:border-brand-accent outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] uppercase tracking-widest text-white/30">Location</label>
                    <input 
                      value={editingProject?.location || ''}
                      onChange={e => setEditingProject({...editingProject, location: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 p-4 focus:border-brand-accent outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-white/30">Description</label>
                  <textarea 
                    rows={4}
                    value={editingProject?.description || ''}
                    onChange={e => setEditingProject({...editingProject, description: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 p-4 focus:border-brand-accent outline-none font-serif italic text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-white/30">Main Image</label>
                  <div className="flex gap-4">
                    <div className="flex-1 relative">
                      <input 
                        required
                        value={editingProject?.imageUrl || ''}
                        onChange={e => setEditingProject({...editingProject, imageUrl: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 p-4 focus:border-brand-accent outline-none pr-12"
                        placeholder="Image URL or upload"
                      />
                      <label className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-white/30 hover:text-brand-accent transition-colors">
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={e => handleFileUpload(e, (url) => setEditingProject({...editingProject, imageUrl: url}))}
                        />
                        <Upload size={18} className={isUploading ? 'animate-pulse' : ''} />
                      </label>
                    </div>
                    {editingProject?.imageUrl && <img src={editingProject.imageUrl} className="w-14 h-14 object-cover border border-white/10" alt="" />}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] uppercase tracking-widest text-white/30">Design Concept</label>
                    <textarea 
                      rows={3}
                      value={editingProject?.concept || ''}
                      onChange={e => setEditingProject({...editingProject, concept: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 p-4 focus:border-brand-accent outline-none font-serif italic"
                      placeholder="Explain the idea behind the project..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] uppercase tracking-widest text-white/30">Materials & Craftsmanship</label>
                    <textarea 
                      rows={3}
                      value={editingProject?.materials || ''}
                      onChange={e => setEditingProject({...editingProject, materials: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 p-4 focus:border-brand-accent outline-none font-serif italic"
                      placeholder="Describe the premium materials used..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] uppercase tracking-widest text-white/30">Execution Details</label>
                    <textarea 
                      rows={3}
                      value={editingProject?.execution || ''}
                      onChange={e => setEditingProject({...editingProject, execution: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 p-4 focus:border-brand-accent outline-none font-serif italic"
                      placeholder="How was it brought to life?"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] uppercase tracking-widest text-white/30">Button Text</label>
                    <input 
                      value={editingProject?.buttonText || ''}
                      onChange={e => setEditingProject({...editingProject, buttonText: e.target.value})}
                      placeholder="View Project"
                      className="w-full bg-white/5 border border-white/10 p-4 focus:border-brand-accent outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] uppercase tracking-widest text-white/30">Button Link (Optional)</label>
                    <input 
                      value={editingProject?.buttonLink || ''}
                      onChange={e => setEditingProject({...editingProject, buttonLink: e.target.value})}
                      placeholder="https://..."
                      className="w-full bg-white/5 border border-white/10 p-4 focus:border-brand-accent outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="font-mono text-[10px] uppercase tracking-widest text-white/30 flex items-center gap-2">
                      <ImageIcon size={12} /> Gallery Images
                    </label>
                    <label className="cursor-pointer text-[10px] uppercase tracking-widest text-brand-accent hover:text-white transition-colors flex items-center gap-2">
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={e => handleFileUpload(e, (url) => {
                          const currentGallery = editingProject?.gallery || [];
                          setEditingProject({...editingProject, gallery: [...currentGallery, url]});
                        })}
                      />
                      <Upload size={12} className={isUploading ? 'animate-pulse' : ''} /> Upload to Gallery
                    </label>
                  </div>
                  <textarea 
                    rows={3}
                    value={editingProject?.gallery?.join(', ') || ''}
                    onChange={e => setEditingProject({...editingProject, gallery: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})}
                    className="w-full bg-white/5 border border-white/10 p-4 focus:border-brand-accent outline-none text-xs font-mono"
                    placeholder="https://url1.jpg, https://url2.jpg..."
                  />
                  <div className="flex gap-2 flex-wrap">
                    {editingProject?.gallery?.map((url, i) => (
                      <img key={i} src={url} className="w-10 h-10 object-cover border border-white/10" alt="" />
                    ))}
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-6 bg-brand-accent text-brand-dark font-bold uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:bg-white transition-all rounded-xl"
                >
                  <Save size={18} /> Save Project Changes
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};
