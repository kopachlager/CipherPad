import React, { useMemo, useState } from 'react';
import { useStore } from '../hooks/useStore';
import NoteCard from '../components/Dashboard/NoteCard';
import { Pencil } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const {
    projects,
    notes,
    selectedProjectId,
    setSelectedProject,
    createProject,
    updateProject,
    createNote,
    updateNote,
    setActiveNote,
    setShowDashboard,
  } = useStore();

  const [filter, setFilter] = useState<'all' | 'important' | 'todo' | 'notes'>('all');
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [colorPickerForId, setColorPickerForId] = useState<string | null>(null);

  const colorSwatches = ['#6b7280', '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

  const project = projects.find((p) => p.id === selectedProjectId) || null;
  const projectNotes = useMemo(() => {
    if (!project) return [] as typeof notes;
    let list = notes.filter((n) => n.projectId === project.id && !n.isDeleted);
    if (filter === 'important') list = list.filter((n) => n.isFavorite);
    if (filter === 'todo') list = list.filter((n) => (n.tags || []).includes('todo'));
    if (filter === 'notes') list = list.filter((n) => (n.tags || []).includes('note'));
    return list.sort(
      (a, b) =>
        (b.position || 0) - (a.position || 0) ||
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [notes, project, filter]);

  const handleCreateInProject = async () => {
    if (!project) return;
    const note = await createNote();
    await updateNote(note.id, { projectId: project.id });
    setActiveNote(note.id);
    setShowDashboard(false);
  };

  const onOpenNote = (id: string) => {
    setActiveNote(id);
    setShowDashboard(false);
  };

  const onReorder = async (dragId: string, hoverId: string) => {
    if (!project) return;
    const list = projectNotes;
    const dragIdx = list.findIndex((n) => n.id === dragId);
    const hoverIdx = list.findIndex((n) => n.id === hoverId);
    if (dragIdx === -1 || hoverIdx === -1 || dragIdx === hoverIdx) return;
    const target = list[hoverIdx];
    const prev = list[hoverIdx - 1];
    let newPos: number;
    if (!prev) {
      newPos = (target.position || 0) + 1000;
    } else {
      newPos = ((prev.position || 0) + (target.position || 0)) / 2;
    }
    await updateNote(dragId, { position: newPos });
  };

  return (
    <div className="flex h-full">
      <aside className="w-64 border-r border-gray-200 dark:border-gray-700 p-4 space-y-2 bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs uppercase tracking-wide text-gray-500">Projects</h3>
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              const name = prompt('Project name');
              if (name) createProject(name);
            }}
            className="px-2 py-1 text-xs rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Add
          </button>
        </div>
        <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-8rem)]">
          {projects.map((p) => (
            <div
              key={p.id}
              className={`w-full flex items-center gap-2 px-2 py-1 rounded ${
                selectedProjectId === p.id ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  setSelectedProject(p.id);
                }}
                className="flex-1 flex items-center gap-2 px-1 py-1 rounded text-sm text-left"
              >
                <span
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setColorPickerForId(colorPickerForId === p.id ? null : p.id);
                  }}
                  className="w-3 h-3 rounded flex-shrink-0"
                  style={{ backgroundColor: p.color }}
                  aria-label="Change project color"
                  title="Change color"
                />
                {editingProjectId === p.id ? (
                  <input
                    autoFocus
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        updateProject(p.id, { name: nameInput.trim() || p.name });
                        setEditingProjectId(null);
                      }
                      if (e.key === 'Escape') {
                        setEditingProjectId(null);
                      }
                    }}
                    onBlur={() => {
                      updateProject(p.id, { name: nameInput.trim() || p.name });
                      setEditingProjectId(null);
                    }}
                    className="bg-transparent border border-gray-300 dark:border-gray-700 rounded px-2 py-0.5 text-sm w-full"
                  />
                ) : (
                  <span
                    className="truncate"
                    onDoubleClick={() => {
                      setEditingProjectId(p.id);
                      setNameInput(p.name);
                    }}
                    title="Double-click to rename"
                  >
                    {p.name}
                  </span>
                )}
              </button>
              {colorPickerForId === p.id && (
                <div className="absolute z-20 mt-8 p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded shadow">
                  <div className="grid grid-cols-6 gap-2">
                    {colorSwatches.map((c) => (
                      <button
                        key={c}
                        className="w-5 h-5 rounded"
                        style={{ backgroundColor: c }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          updateProject(p.id, { color: c });
                          setColorPickerForId(null);
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              {editingProjectId !== p.id && (
                <button
                  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                  title="Rename"
                  aria-label="Rename"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setEditingProjectId(p.id);
                    setNameInput(p.name);
                  }}
                >
                  <Pencil className="w-3 h-3 text-gray-600" />
                </button>
              )}
            </div>
          ))}
        </div>
      </aside>

      <main className="flex-1 p-4 overflow-y-auto">
        {!project ? (
          <div className="h-full flex items-center justify-center text-gray-500">Select a project to view its notes</div>
        ) : (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded" style={{ backgroundColor: project.color }} />
                <h2 className="text-lg font-semibold">{project.name}</h2>
              </div>
              <div className="flex items-center gap-2">
                {(['all', 'important', 'todo', 'notes'] as const).map((f) => (
                  <button
                    key={f}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setFilter(f);
                    }}
                    className={`px-2 py-1 text-xs rounded border ${
                      filter === f
                        ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleCreateInProject();
                  }}
                  className="px-3 py-1.5 text-sm rounded-md bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
                >
                  New Note
                </button>
              </div>
            </div>

            {projectNotes.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-gray-500">No notes yet. Create your first note.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {projectNotes.map((n) => (
                  <NoteCard
                    key={n.id}
                    note={n}
                    projectColor={project.color}
                    onOpen={() => onOpenNote(n.id)}
                    onReorder={onReorder}
                    showTagToggles
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
