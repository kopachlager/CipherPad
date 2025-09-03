import React, { useEffect } from 'react';
import { useStore } from '../hooks/useStore';

const DashboardPage: React.FC = () => {
  const { projects, lanes, notes, selectedProjectId, setSelectedProject, loadLanes, createProject, createLane } = useStore();

  useEffect(() => {
    if (selectedProjectId) loadLanes(selectedProjectId);
  }, [selectedProjectId, loadLanes]);

  const project = projects.find(p => p.id === selectedProjectId) || null;
  const projectLanes = project ? lanes.filter(l => l.projectId === project.id).sort((a,b)=>a.position-b.position) : [];
  const projectNotes = project ? notes.filter(n => n.projectId === project.id && !n.isDeleted) : [];

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
      <main className="flex-1 p-4 overflow-x-auto">
        {!project ? (
          <div className="h-full flex items-center justify-center text-gray-500">Select a project to view its board</div>
        ) : (
          <div className="min-w-full flex gap-4">
            {projectLanes.length === 0 && (
              <div className="text-sm text-gray-500">No lanes yet. <button className="underline" onMouseDown={(e)=>{ e.preventDefault(); const name = prompt('Lane name'); if (name) createLane(project.id, name); }}>Create one</button></div>
            )}
            {projectLanes.map(lane => (
              <div key={lane.id} className="w-72 flex-shrink-0 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-3">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold" style={{ color: lane.color }}>{lane.name}</h4>
                </div>
                <div className="space-y-2">
                  {projectNotes.filter(n => n.laneId === lane.id).sort((a,b)=> (b.position||0)-(a.position||0)).map(n => (
                    <div key={n.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded p-2 text-sm truncate">
                      {n.title || 'Untitled'}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;

