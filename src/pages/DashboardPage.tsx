import React, { useEffect, useMemo, useState } from 'react';
import { shallow } from 'zustand/shallow';
import {
  Wand2,
  Plus,
  PlusCircle,
  LayoutDashboard,
  Pencil,
  MoreHorizontal,
} from 'lucide-react';
import { useStore } from '../hooks/useStore';
import NoteCard from '../components/Dashboard/NoteCard';
import type { Lane, Note, Project } from '../types';

const COLOR_SWATCHES = ['#6b7280', '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

type LaneKey = string | null;

interface LaneColumnProps {
  lane: Lane | null;
  notes: Note[];
  accentColor: string;
  isHighlighted: boolean;
  onCreateNote: () => Promise<void>;
  onDropNote: (laneId: LaneKey, event: React.DragEvent<HTMLDivElement>) => void;
  onDragEnter: (laneId: LaneKey) => void;
  onDragLeave: () => void;
  onOpenNote: (id: string) => void;
}

const LaneColumn: React.FC<LaneColumnProps> = ({
  lane,
  notes,
  accentColor,
  isHighlighted,
  onCreateNote,
  onDropNote,
  onDragEnter,
  onDragLeave,
  onOpenNote,
}) => {
  const columnTitle = lane ? lane.name : 'Backlog';
  const columnDescription = lane
    ? `${notes.length} ${notes.length === 1 ? 'note' : 'notes'}`
    : 'Unassigned notes live here until you move them into a lane.';

  return (
    <div
      className={`relative flex-shrink-0 w-72 min-w-[18rem] rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur transition-shadow ${
        isHighlighted ? 'ring-2 ring-blue-400 dark:ring-blue-500 shadow-xl' : 'shadow-sm'
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
      }}
      onDragEnter={(e) => {
        e.preventDefault();
        onDragEnter(lane ? lane.id : null);
      }}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDropNote(lane ? lane.id : null, e)}
    >
      <div className="flex items-start justify-between px-4 pt-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-xs font-semibold text-gray-600 dark:text-gray-300">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: accentColor }} />
            {columnTitle}
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{columnDescription}</p>
        </div>
        <button
          onClick={onCreateNote}
          className="inline-flex items-center gap-1 rounded-full bg-gray-900 text-white dark:bg-white dark:text-gray-900 px-2.5 py-1 text-xs font-medium transition hover:scale-105"
        >
          <Plus className="w-3 h-3" />
          Note
        </button>
      </div>

      <div className="max-h-[calc(100vh-19rem)] overflow-y-auto px-4 pb-4 pt-3 space-y-3">
        {notes.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/40 p-4 text-center text-xs text-gray-500 dark:text-gray-400">
            Drop a note here or create a new one.
          </div>
        ) : (
          notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              projectColor={accentColor}
              onOpen={() => onOpenNote(note.id)}
              showTagToggles
            />
          ))
        )}
      </div>
    </div>
  );
};

const DashboardPage: React.FC = () => {
  const projects = useStore((state) => state.projects);
  const notes = useStore((state) => state.notes);
  const lanes = useStore((state) => state.lanes);
  const projectsLoaded = useStore((state) => state.projectsLoaded);
  const selectedProjectId = useStore((state) => state.selectedProjectId);

  const {
    setSelectedProject,
    createProject,
    updateProject,
    createNote,
    updateNote,
    setActiveNote,
    setShowDashboard,
    loadProjects,
    loadLanes,
    createLane,
  } = useStore(
    (state) => ({
      setSelectedProject: state.setSelectedProject,
      createProject: state.createProject,
      updateProject: state.updateProject,
      createNote: state.createNote,
      updateNote: state.updateNote,
      setActiveNote: state.setActiveNote,
      setShowDashboard: state.setShowDashboard,
      loadProjects: state.loadProjects,
      loadLanes: state.loadLanes,
      createLane: state.createLane,
    }),
    shallow
  );

  const [filter, setFilter] = useState<'all' | 'important' | 'todo' | 'notes'>('all');
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [laneHover, setLaneHover] = useState<LaneKey>(null);
  const [colorPickerForId, setColorPickerForId] = useState<string | null>(null);

  useEffect(() => {
    if (!projectsLoaded) {
      loadProjects();
    }
  }, [projectsLoaded, loadProjects]);

  useEffect(() => {
    if (projectsLoaded && projects.length > 0 && !selectedProjectId) {
      setSelectedProject(projects[0].id);
    }
  }, [projectsLoaded, projects, selectedProjectId, setSelectedProject]);

  useEffect(() => {
    if (selectedProjectId) {
      loadLanes(selectedProjectId);
    }
  }, [selectedProjectId, loadLanes]);

  const activeProject: Project | null = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) || null,
    [projects, selectedProjectId]
  );

  const projectNotes = useMemo(() => {
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

  const projectLanes = useMemo(
    () =>
      activeProject
        ? lanes
            .filter((lane) => lane.projectId === activeProject.id)
            .sort((a, b) => (a.position ?? 0) - (b.position ?? 0) || a.createdAt.getTime() - b.createdAt.getTime())
        : [],
    [lanes, activeProject]
  );

  const notesByLane = useMemo(() => {
    const map = new Map<LaneKey, Note[]>();
    map.set(null, []); // backlog
    projectLanes.forEach((lane) => map.set(lane.id, []));
    for (const note of projectNotes) {
      const key = note.laneId ?? null;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(note);
    }
    return map;
  }, [projectNotes, projectLanes]);

  const handleCreateLane = async () => {
    if (!activeProject) return;
    const name = prompt('Lane name');
    if (!name) return;
    await createLane(activeProject.id, name.trim(), '#e5e7eb');
  };

  const handleCreateNoteForLane = async (laneId: LaneKey) => {
    if (!activeProject) return;
    const newNote = await createNote();
    await updateNote(newNote.id, {
      projectId: activeProject.id,
      laneId: laneId ?? undefined,
      position: Date.now(),
    });
    setActiveNote(newNote.id);
    setShowDashboard(false);
  };

  const handleOpenNote = (noteId: string) => {
    setActiveNote(noteId);
    setShowDashboard(false);
  };

  const handleLaneDrop = async (laneId: LaneKey, event: React.DragEvent<HTMLDivElement>) => {
    if (!activeProject) return;
    event.preventDefault();
    setLaneHover(null);
    const raw = event.dataTransfer.getData('application/json');
    if (!raw) return;
    try {
      const payload = JSON.parse(raw) as { noteId?: string };
      if (!payload.noteId) return;
      const noteId = payload.noteId;
      const existing = notes.find((note) => note.id === noteId);
      if (!existing) return;
      const targetLaneId = laneId ?? undefined;
      if (existing.projectId === activeProject.id && existing.laneId === targetLaneId) return;
      await updateNote(noteId, {
        projectId: activeProject.id,
        laneId: targetLaneId,
        position: Date.now(),
      });
    } catch (error) {
      console.warn('Failed to parse drag payload', error);
    }
  };

  const handleCreateProject = () => {
    const name = prompt('Project name');
    if (name) createProject(name.trim());
  };

  const renderedLanes = [
    { lane: null as Lane | null, accent: '#9ca3af' },
    ...projectLanes.map((lane) => ({ lane, accent: lane.color || activeProject?.color || '#6b7280' })),
  ];

  return (
    <div className="flex h-full overflow-hidden">
      <aside className="w-68 shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-5">
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-xs font-semibold text-gray-600 dark:text-gray-300">
            <LayoutDashboard className="w-3.5 h-3.5" />
            Projects
          </div>
          <button
            onClick={handleCreateProject}
            className="inline-flex items-center gap-1 rounded-full bg-gray-900 text-white dark:bg-white dark:text-gray-900 px-2.5 py-1 text-xs font-medium transition hover:scale-105"
          >
            <Plus className="w-3 h-3" />
            Add
          </button>
        </div>

        <div className="space-y-1.5 overflow-y-auto max-h-[calc(100vh-8rem)] pr-1">
          {projects.map((project) => {
            const isActive = project.id === selectedProjectId;
            return (
              <div
                key={project.id}
                className={`relative rounded-xl border ${isActive ? 'border-gray-900 dark:border-gray-200 bg-gray-50 dark:bg-gray-900' : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-900/40'}`}
              >
                <button
                  onClick={() => setSelectedProject(project.id)}
                  className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-left"
                >
                  <span
                    className="inline-flex h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: project.color }}
                    aria-hidden
                  />
                  {editingProjectId === project.id ? (
                    <input
                      autoFocus
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      onBlur={() => {
                        updateProject(project.id, { name: nameInput.trim() || project.name });
                        setEditingProjectId(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          updateProject(project.id, { name: nameInput.trim() || project.name });
                          setEditingProjectId(null);
                        } else if (e.key === 'Escape') {
                          setEditingProjectId(null);
                        }
                      }}
                      className="w-full rounded border border-gray-300 dark:border-gray-700 bg-transparent px-2 py-1 text-sm focus:outline-none focus:ring focus:ring-gray-300 dark:focus:ring-gray-600"
                    />
                  ) : (
                    <div className="flex-1 truncate text-sm font-medium text-gray-800 dark:text-gray-100">
                      {project.name}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingProjectId(project.id);
                      setNameInput(project.name);
                    }}
                    className="rounded-md p-1 text-gray-500 transition hover:bg-gray-200/80 dark:hover:bg-gray-800/80"
                    aria-label="Rename project"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setColorPickerForId(colorPickerForId === project.id ? null : project.id);
                    }}
                    className="rounded-md p-1 text-gray-500 transition hover:bg-gray-200/80 dark:hover:bg-gray-800/80"
                    aria-label="Change color"
                  >
                    <MoreHorizontal className="w-3 h-3" />
                  </button>
                </button>

                {colorPickerForId === project.id && (
                  <div className="absolute left-full top-1/2 z-20 ml-2 w-40 -translate-y-1/2 rounded-xl border border-gray-200 bg-white p-3 shadow-xl dark:border-gray-700 dark:bg-gray-900">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Accent color</p>
                    <div className="grid grid-cols-5 gap-2">
                      {COLOR_SWATCHES.map((color) => (
                        <button
                          key={color}
                          className="h-6 w-6 rounded-full border border-gray-200 transition hover:scale-110"
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

      <main className="flex-1 bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        {!activeProject ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center text-gray-500 dark:text-gray-400">
            <Wand2 className="w-10 h-10 opacity-40" />
            <div>
              <p className="text-lg font-medium">Pick or create a project</p>
              <p className="text-sm">Organize notes into projects and lanes to keep ideas moving forward.</p>
            </div>
            <button
              onClick={handleCreateProject}
              className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:scale-105 dark:bg-white dark:text-gray-900"
            >
              <Plus className="w-4 h-4" />
              New project
            </button>
          </div>
        ) : (
          <div className="flex h-full flex-col overflow-hidden">
            <header className="flex flex-col gap-3 border-b border-gray-200 bg-white/80 px-8 py-6 dark:border-gray-800 dark:bg-gray-950/70 backdrop-blur">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className="inline-flex h-3 w-3 rounded-full border border-gray-200"
                  style={{ backgroundColor: activeProject.color }}
                />
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{activeProject.name}</h1>
                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  {projectNotes.length} {projectNotes.length === 1 ? 'note' : 'notes'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {(['all', 'important', 'todo', 'notes'] as const).map((value) => (
                  <button
                    key={value}
                    onClick={() => setFilter(value)}
                    className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition ${
                      filter === value
                        ? 'border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-gray-900'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
                    }`}
                  >
                    {value === 'all' && <LayoutDashboard className="w-3 h-3" />}
                    {value === 'important' && <Wand2 className="w-3 h-3" />}
                    {value === 'todo' && <PlusCircle className="w-3 h-3" />}
                    {value === 'notes' && <Plus className="w-3 h-3" />}
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </button>
                ))}
                <button
                  onClick={() => handleCreateNoteForLane(projectLanes.length ? projectLanes[0].id : null)}
                  className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-1.5 text-sm font-semibold text-white shadow-md transition hover:scale-105 dark:bg-white dark:text-gray-900"
                >
                  <Plus className="w-4 h-4" />
                  Quick note
                </button>
                <button
                  onClick={handleCreateLane}
                  className="inline-flex items-center gap-2 rounded-full border border-dashed border-gray-300 px-3 py-1 text-xs text-gray-500 transition hover:border-gray-400 hover:text-gray-700 dark:border-gray-700 dark:hover:border-gray-500 dark:hover:text-gray-200"
                >
                  <PlusCircle className="w-3 h-3" />
                  Add lane
                </button>
              </div>
            </header>

            <section className="flex-1 overflow-x-auto px-8 py-6">
              <div className="flex min-h-full gap-5 pb-6">
                {renderedLanes.map(({ lane, accent }) => (
                  <LaneColumn
                    key={lane ? lane.id : 'backlog'}
                    lane={lane}
                    notes={notesByLane.get(lane ? lane.id : null) ?? []}
                    accentColor={accent}
                    isHighlighted={laneHover === (lane ? lane.id : null)}
                    onCreateNote={() => handleCreateNoteForLane(lane ? lane.id : null)}
                    onDropNote={handleLaneDrop}
                    onDragEnter={setLaneHover}
                    onDragLeave={() => setLaneHover(null)}
                    onOpenNote={handleOpenNote}
                  />
                ))}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
