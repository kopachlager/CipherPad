import React, { useMemo } from 'react';
import { useStore } from '../hooks/useStore';
import NoteCard from '../components/Dashboard/NoteCard';

const DashboardPage: React.FC = () => {
  const {
    projects,
    notes,
    selectedProjectId,
    setSelectedProject,
    createProject,
    createNote,
    updateNote,
    setActiveNote,
    setShowDashboard,
  } = useStore();

  const project = projects.find(p => p.id === selectedProjectId) || null;
  const projectNotes = useMemo(() => {
    if (!project) return [] as typeof notes;
    const list = notes.filter(n => n.projectId === project.id && !n.isDeleted);
    return list.sort((a,b) => (b.position || 0) - (a.position || 0) || (new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
  }, [notes, project]);

  const handleCreateInProject = async () => {
    if (!project) return;
    const n = await createNote();
    await updateNote(n.id, { projectId: project.id });
    setActiveNote(n.id);
    setShowDashboard(false);
  };

  const onOpenNote = (id: string) => {
    setActiveNote(id);
    setShowDashboard(false);
  };

  const onReorder = async (dragId: string, hoverId: string) => {
    if (!project) return;
    const list = projectNotes;
    const dragIdx = list.findIndex(n => n.id === dragId);
    const hoverIdx = list.findIndex(n => n.id === hoverId);
    if (dragIdx === -1 || hoverIdx === -1 || dragIdx === hoverIdx) return;
    // Compute new position by averaging neighbors around hoverIdx
    const target = list[hoverIdx];
    const prev = list[hoverIdx - 1]; // sorted desc
    let newPos: number;
    if (!prev) {
      newPos = (target.position || 0) + 1000; // move to top
    } else {
      newPos = ((prev.position || 0) + (target.position || 0)) / 2;
    }
    await updateNote(dragId, { position: newPos });
  };

  return (
    <div className="flex h-full">
      {/* Project rail */}
      <aside className="w-64 border-r border-gray-200 dark:border-gray-700 p-4 space-y-2 bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs uppercase tracking-wide text-gray-500">Projects</h3>
          <button
            onMouseDown={(e)=>{ e.preventDefault(); const name = prompt('Project name'); if (name) createProject(name); }}
            className="px-2 py-1 text-xs rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
          >Add</button>
        </div>
        <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-8rem)]">
          {projects.map(p => (
            <button
              key={p.id}
              onMouseDown={(e)=>{ e.preventDefault(); setSelectedProject(p.id); }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm ${selectedProjectId===p.id ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
              <span className="w-3 h-3 rounded" style={{ backgroundColor: p.color }} />
              <span className="truncate">{p.name}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* Board */}
      <main className="flex-1 p-4 overflow-y-auto">
        {!project ? (
          <div className="h-full flex items-center justify-center text-gray-500">Select a project to view its notes</div>
        ) : (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded" style={{ backgroundColor: project.color }} />
                <h2 className="text-lg font-semibold">{project.name}</h2>
              </div>
              <button
                onMouseDown={(e)=>{ e.preventDefault(); handleCreateInProject(); }}
                className="px-3 py-1.5 text-sm rounded-md bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
              >New Note</button>
            </div>

            {/* Grid of notes */}
            {projectNotes.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-gray-500">No notes yet. Create your first note.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {projectNotes.map(n => (
                  <NoteCard
                    key={n.id}
                    note={n}
                    projectColor={project.color}
                    onOpen={() => onOpenNote(n.id)}
                    onReorder={onReorder}
                  />)
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
