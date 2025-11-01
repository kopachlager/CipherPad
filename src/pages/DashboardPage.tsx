import React, { useMemo, useState } from 'react';
import { shallow } from 'zustand/shallow';
import { LayoutDashboard, Plus, Pencil, Wand2, CheckSquare, StickyNote } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import NoteCard from '../components/Dashboard/NoteCard';
import type { Note, Project } from '../types';

const PROJECT_COLORS = ['#6b7280', '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'important', label: 'Pinned' },
  { key: 'todo', label: 'Todo' },
  { key: 'notes', label: 'Notes' },
] as const;

type FilterKey = (typeof FILTERS)[number]['key'];

const DashboardPage: React.FC = () => {
  const { projects, notes, selectedProjectId } = useStore(
    (state) => ({
      projects: state.projects,
      notes: state.notes,
      selectedProjectId: state.selectedProjectId,
    }),
    shallow
  );

  const {
    setSelectedProject,
    createProject,
    updateProject,
    createNote,
    updateNote,
    setActiveNote,
    setShowDashboard,
  } = useStore(
    (state) => ({
      setSelectedProject: state.setSelectedProject,
      createProject: state.createProject,
      updateProject: state.updateProject,
      createNote: state.createNote,
      updateNote: state.updateNote,
      setActiveNote: state.setActiveNote,
      setShowDashboard: state.setShowDashboard,
    }),
    shallow
  );

  const [filter, setFilter] = useState<FilterKey>('all');
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [colorPickerForId, setColorPickerForId] = useState<string | null>(null);

  const activeProject: Project | null =
    projects.find((project) => project.id === selectedProjectId) ?? null;

  const filteredNotes = useMemo(() => {
    if (!activeProject) return [] as Note[];
    let scoped = notes.filter((note) => note.projectId === activeProject.id && !note.isDeleted);
    if (filter === 'important') scoped = scoped.filter((note) => note.isFavorite);
    if (filter === 'todo') scoped = scoped.filter((note) => (note.tags || []).includes('todo'));
    if (filter === 'notes') scoped = scoped.filter((note) => (note.tags || []).includes('note'));
    return scoped.sort(
      (a, b) =>
        (b.position ?? 0) - (a.position ?? 0) ||
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [notes, activeProject, filter]);

  const handleReorder = async (dragId: string, hoverId: string) => {
    if (!activeProject) return;
    const ordered = filteredNotes;
    const fromIndex = ordered.findIndex((note) => note.id === dragId);
    const toIndex = ordered.findIndex((note) => note.id === hoverId);
    if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return;
    const target = ordered[toIndex];
    const previous = ordered[toIndex - 1];
    const newPosition =
      previous == null ? (target.position ?? 0) + 1000 : ((previous.position ?? 0) + (target.position ?? 0)) / 2;
    await updateNote(dragId, { position: newPosition });
  };

  const handleCreateProject = () => {
    const name = prompt('Project name');
    if (name) createProject(name.trim());
  };

  const handleCreateNote = async () => {
    if (!activeProject) return;
    const newNote = await createNote(activeProject.id);
    await updateNote(newNote.id, { projectId: activeProject.id });
    setActiveNote(newNote.id);
    setShowDashboard(false);
  };

  const handleOpenNote = (id: string) => {
    setActiveNote(id);
    setShowDashboard(false);
  };

  return (
    <div className="flex h-full bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <aside className="w-68 shrink-0 border-r border-gray-200 bg-white/90 px-5 py-6 backdrop-blur dark:border-gray-800 dark:bg-gray-950/80">
        <div className="mb-4 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            <LayoutDashboard className="h-3.5 w-3.5" />
            Projects
          </div>
          <button
            onClick={handleCreateProject}
            className="inline-flex items-center gap-1 rounded-full bg-gray-900 px-2.5 py-1 text-xs font-medium text-white shadow-sm transition hover:scale-105 dark:bg-white dark:text-gray-900"
          >
            <Plus className="h-3 w-3" />
            Add
          </button>
        </div>

        <div className="space-y-1.5 overflow-y-auto pr-2 text-sm">
          {projects.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-center text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
              Create a project to organize your notes.
            </div>
          )}
          {projects.map((project) => {
            const isActive = project.id === selectedProjectId;
            return (
              <div
                key={project.id}
                className={`relative rounded-xl border transition ${
                  isActive
                    ? 'border-gray-900 bg-gray-50 shadow-sm dark:border-gray-200 dark:bg-gray-900'
                    : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-900/40'
                }`}
              >
                <button
                  onClick={() => setSelectedProject(project.id)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left"
                >
                  <span
                    className="inline-flex h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  {editingProjectId === project.id ? (
                    <input
                      autoFocus
                      value={nameInput}
                      onChange={(event) => setNameInput(event.target.value)}
                      onBlur={() => {
                        updateProject(project.id, { name: nameInput.trim() || project.name });
                        setEditingProjectId(null);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          updateProject(project.id, { name: nameInput.trim() || project.name });
                          setEditingProjectId(null);
                        } else if (event.key === 'Escape') {
                          setEditingProjectId(null);
                        }
                      }}
                      className="w-full rounded border border-gray-300 bg-transparent px-2 py-1 text-sm focus:outline-none focus:ring focus:ring-gray-300 dark:border-gray-700 dark:focus:ring-gray-600"
                    />
                  ) : (
                    <span className="flex-1 truncate font-medium text-gray-800 dark:text-gray-100">
                      {project.name}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setEditingProjectId(project.id);
                      setNameInput(project.name);
                    }}
                    className="rounded-md p-1 text-gray-500 transition hover:bg-gray-200/70 dark:hover:bg-gray-800/70"
                    aria-label="Rename project"
                  >
                    <Pencil className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setColorPickerForId(colorPickerForId === project.id ? null : project.id);
                    }}
                    className="rounded-md p-1 text-gray-500 transition hover:bg-gray-200/70 dark:hover:bg-gray-800/70"
                    aria-label="Change color"
                  >
                    <Wand2 className="h-3 w-3" />
                  </button>
                </button>

                {colorPickerForId === project.id && (
                  <div className="absolute left-full top-1/2 z-20 ml-3 w-40 -translate-y-1/2 rounded-xl border border-gray-200 bg-white p-3 shadow-xl dark:border-gray-700 dark:bg-gray-900">
                    <p className="mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400">Accent color</p>
                    <div className="grid grid-cols-5 gap-2">
                      {PROJECT_COLORS.map((color) => (
                        <button
                          key={color}
                          className="h-6 w-6 rounded-full border border-gray-200 transition hover:scale-110 dark:border-gray-600"
                          style={{ backgroundColor: color }}
                          onClick={() => {
                            updateProject(project.id, { color });
                            setColorPickerForId(null);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto px-8 py-6">
        {!activeProject ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center text-gray-500 dark:text-gray-400">
            <LayoutDashboard className="h-10 w-10 opacity-40" />
            <div>
              <p className="text-lg font-semibold">Choose a project to get started</p>
              <p className="text-sm">Projects let you group notes and keep ideas moving forward.</p>
            </div>
            <button
              onClick={handleCreateProject}
              className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:scale-105 dark:bg-white dark:text-gray-900"
            >
              <Plus className="h-4 w-4" />
              Create project
            </button>
          </div>
        ) : (
          <div className="flex h-full flex-col">
            <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white/90 px-5 py-4 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-gray-950/80">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className="inline-flex h-3 w-3 rounded-full border border-gray-200"
                  style={{ backgroundColor: activeProject.color }}
                />
                <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{activeProject.name}</h1>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {FILTERS.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key)}
                    className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition ${
                      filter === key
                        ? 'border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-gray-900'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
                    }`}
                  >
                    {key === 'important' && <HeartIcon />}
                    {key === 'todo' && <CheckSquare className="h-3 w-3" />}
                    {key === 'notes' && <StickyNote className="h-3 w-3" />}
                    {label}
                  </button>
                ))}
                <button
                  onClick={handleCreateNote}
                  className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-1.5 text-sm font-semibold text-white shadow-md transition hover:scale-105 dark:bg-white dark:text-gray-900"
                >
                  <Plus className="h-4 w-4" />
                  New note
                </button>
              </div>
            </header>

            <section className="mt-5 flex-1">
              {filteredNotes.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-300 bg-gray-50/80 p-10 text-center text-gray-500 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-400">
                  <Wand2 className="h-10 w-10 opacity-40" />
                  <div>
                    <p className="text-base font-medium">No notes match this filter yet</p>
                    <p className="text-sm">
                      Create a note or adjust the filter to see more content.
                    </p>
                  </div>
                  <button
                    onClick={handleCreateNote}
                    className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-1.5 text-sm font-semibold text-gray-600 transition hover:border-gray-400 hover:text-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:text-gray-100"
                  >
                    <Plus className="h-4 w-4" />
                    Add your first note
                  </button>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {filteredNotes.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      projectColor={activeProject.color}
                      onOpen={() => handleOpenNote(note.id)}
                      onReorder={handleReorder}
                      showTagToggles
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

const HeartIcon = () => <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-6.716-4.579-10-9c-1.818-2.479-.49-6 2.5-7 2.274-.7 4.5.5 5.5 2 1-1.5 3.226-2.7 5.5-2 2.99 1 4.318 4.521 2.5 7-3.284 4.421-10 9-10 9z"/></svg>;

export default DashboardPage;
