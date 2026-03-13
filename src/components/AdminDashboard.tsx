import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { loginWithGoogle, logout, db } from '../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Project } from '../types';
import { Plus, Trash2, Edit2, LogOut, LogIn, Save, X, Image as ImageIcon } from 'lucide-react';

export const AdminDashboard = () => {
  const { user, isAdmin, loading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;
    const q = query(collection(db, 'projects'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Project[]);
    });
    return unsubscribe;
  }, [isAdmin]);

  const handleSave = async (e: React.FormEvent) => {
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

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      await deleteDoc(doc(db, 'projects', id));
    }
  };

  if (loading) return <div className="min-h-screen bg-brand-dark flex items-center justify-center font-mono text-white/20">LOADING_SYSTEM...</div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-8 max-w-md">
          <h1 className="text-4xl font-serif italic text-white">Admin Access</h1>
          <p className="text-white/40 font-serif italic">Please authenticate to manage the Maavis Projects portfolio.</p>
          <button 
            onClick={loginWithGoogle}
            className="w-full py-4 bg-white text-brand-dark font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-brand-accent transition-colors"
          >
            <LogIn size={16} /> Authenticate with Google
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-8 max-w-md">
          <h1 className="text-4xl font-serif italic text-white">Access Denied</h1>
          <p className="text-white/40 font-serif italic">Your account ({user.email}) does not have administrative privileges.</p>
          <button onClick={logout} className="text-brand-accent uppercase tracking-widest text-[10px] font-bold">Logout</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-20">
          <div>
            <h1 className="text-4xl font-serif italic mb-2">Portfolio Manager</h1>
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/30">Logged in as {user.email}</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => { setIsAdding(true); setEditingProject({}); }}
              className="px-6 py-3 bg-brand-accent text-brand-dark font-bold uppercase tracking-widest text-[10px] flex items-center gap-2"
            >
              <Plus size={14} /> New Project
            </button>
            <button onClick={logout} className="p-3 border border-white/10 hover:bg-white/5 transition-colors">
              <LogOut size={16} />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6">
          {projects.map(project => (
            <div key={project.id} className="border border-white/5 bg-brand-gray/50 p-6 flex items-center justify-between group">
              <div className="flex items-center gap-6">
                <img src={project.imageUrl} className="w-20 h-20 object-cover grayscale" alt="" />
                <div>
                  <h3 className="text-xl font-serif italic">{project.title}</h3>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-white/30">{project.category} // {project.year}</p>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => setEditingProject(project)}
                  className="p-3 border border-white/10 hover:bg-brand-accent hover:text-brand-dark transition-all"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(project.id)}
                  className="p-3 border border-white/10 hover:bg-red-500/20 hover:text-red-500 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Modal */}
        {(isAdding || editingProject?.id) && (
          <div className="fixed inset-0 z-[100] bg-brand-dark/95 backdrop-blur-xl flex items-center justify-center p-6 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-brand-gray border border-white/10 w-full max-w-4xl p-8 md:p-12 my-auto"
            >
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-3xl font-serif italic">{editingProject?.id ? 'Edit Project' : 'New Project'}</h2>
                <button onClick={() => { setEditingProject(null); setIsAdding(false); }} className="text-white/30 hover:text-white"><X size={24} /></button>
              </div>

              <form onSubmit={handleSave} className="space-y-8">
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
                  <label className="font-mono text-[10px] uppercase tracking-widest text-white/30">Main Image URL</label>
                  <div className="flex gap-4">
                    <input 
                      required
                      value={editingProject?.imageUrl || ''}
                      onChange={e => setEditingProject({...editingProject, imageUrl: e.target.value})}
                      className="flex-1 bg-white/5 border border-white/10 p-4 focus:border-brand-accent outline-none"
                    />
                    {editingProject?.imageUrl && <img src={editingProject.imageUrl} className="w-14 h-14 object-cover border border-white/10" alt="" />}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-white/30 flex items-center gap-2">
                    <ImageIcon size={12} /> Gallery Images (comma separated URLs)
                  </label>
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
                  className="w-full py-6 bg-brand-accent text-brand-dark font-bold uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:bg-white transition-all"
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
