import { useState } from 'react';
import { useStream } from '@/store/StreamContext';
import { Plus, Gamepad2, MessageCircle, Play, Coffee, LogOut, MoreVertical, Trash2, Edit2 } from 'lucide-react';
import type { Scene } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const iconMap: Record<string, React.ElementType> = {
  Gamepad2,
  MessageCircle,
  Play,
  Coffee,
  LogOut,
};

export function ScenesPanel() {
  const { state, setActiveScene, addScene, deleteScene, updateScene } = useStream();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingScene, setEditingScene] = useState<Scene | null>(null);
  const [newSceneName, setNewSceneName] = useState('');
  const [newSceneIcon, setNewSceneIcon] = useState('Gamepad2');

  const handleAddScene = () => {
    if (!newSceneName.trim()) return;
    
    addScene({
      name: newSceneName,
      icon: newSceneIcon,
      overlays: ['chat', 'alerts'],
      chatPosition: { x: 20, y: 60 },
      alertsPosition: { x: 50, y: 20 },
    });
    
    setNewSceneName('');
    setNewSceneIcon('Gamepad2');
    setIsAddDialogOpen(false);
  };

  const handleUpdateScene = () => {
    if (!editingScene || !newSceneName.trim()) return;
    
    updateScene({
      ...editingScene,
      name: newSceneName,
      icon: newSceneIcon,
    });
    
    setEditingScene(null);
    setNewSceneName('');
    setNewSceneIcon('Gamepad2');
  };

  const startEdit = (scene: Scene) => {
    setEditingScene(scene);
    setNewSceneName(scene.name);
    setNewSceneIcon(scene.icon);
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#F2F5FF]">Scenes</h2>
          <p className="text-sm text-[#A7B0C8]">Manage your stream scenes</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <button className="btn-primary flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Scene
            </button>
          </DialogTrigger>
          <DialogContent className="border-[rgba(46,230,255,0.2)] bg-[rgba(13,18,32,0.98)] text-[#F2F5FF]">
            <DialogHeader>
              <DialogTitle>Create New Scene</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="mb-2 block text-sm text-[#A7B0C8]">Scene Name</label>
                <input
                  type="text"
                  value={newSceneName}
                  onChange={(e) => setNewSceneName(e.target.value)}
                  placeholder="e.g., Intermission"
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-[#A7B0C8]">Icon</label>
                <div className="flex gap-2">
                  {Object.keys(iconMap).map((icon) => {
                    const IconComponent = iconMap[icon];
                    return (
                      <button
                        key={icon}
                        onClick={() => setNewSceneIcon(icon)}
                        className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-all duration-200 ${
                          newSceneIcon === icon
                            ? 'border-[#2EE6FF] bg-[rgba(46,230,255,0.2)] text-[#2EE6FF]'
                            : 'border-[rgba(46,230,255,0.2)] text-[#A7B0C8] hover:border-[rgba(46,230,255,0.4)]'
                        }`}
                      >
                        <IconComponent className="h-5 w-5" />
                      </button>
                    );
                  })}
                </div>
              </div>
              <button onClick={handleAddScene} className="btn-primary w-full">
                Create Scene
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Scenes Grid */}
      <div className="grid gap-3">
        {state.scenes.map((scene, index) => {
          const IconComponent = iconMap[scene.icon] || Gamepad2;
          const isActive = state.activeSceneId === scene.id;

          return (
            <div
              key={scene.id}
              onClick={() => setActiveScene(scene.id)}
              className={`scene-card flex items-center justify-between ${
                isActive ? 'active' : ''
              } animate-slide-in-up stagger-${Math.min(index + 1, 5)}`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                    isActive
                      ? 'bg-[rgba(46,230,255,0.2)] text-[#2EE6FF]'
                      : 'bg-[rgba(46,230,255,0.08)] text-[#A7B0C8]'
                  }`}
                >
                  <IconComponent className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#F2F5FF]">{scene.name}</h3>
                  <p className="text-xs text-[#A7B0C8]">
                    {scene.overlays.length} overlays
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isActive && (
                  <span className="rounded-full bg-[rgba(39,251,91,0.15)] px-2.5 py-1 text-xs font-medium text-[#27FB5B]">
                    Active
                  </span>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-[#A7B0C8] transition-colors hover:bg-[rgba(46,230,255,0.1)] hover:text-[#2EE6FF]"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="border-[rgba(46,230,255,0.2)] bg-[rgba(13,18,32,0.98)]"
                  >
                    <Dialog>
                      <DialogTrigger asChild>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.preventDefault();
                            startEdit(scene);
                          }}
                          className="cursor-pointer text-[#A7B0C8] focus:bg-[rgba(46,230,255,0.1)] focus:text-[#2EE6FF]"
                        >
                          <Edit2 className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                      </DialogTrigger>
                      {editingScene?.id === scene.id && (
                        <DialogContent className="border-[rgba(46,230,255,0.2)] bg-[rgba(13,18,32,0.98)] text-[#F2F5FF]">
                          <DialogHeader>
                            <DialogTitle>Edit Scene</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 pt-4">
                            <div>
                              <label className="mb-2 block text-sm text-[#A7B0C8]">Scene Name</label>
                              <input
                                type="text"
                                value={newSceneName}
                                onChange={(e) => setNewSceneName(e.target.value)}
                                className="input-field w-full"
                              />
                            </div>
                            <button onClick={handleUpdateScene} className="btn-primary w-full">
                              Save Changes
                            </button>
                          </div>
                        </DialogContent>
                      )}
                    </Dialog>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.preventDefault();
                        deleteScene(scene.id);
                      }}
                      className="cursor-pointer text-[#FF2D6E] focus:bg-[rgba(255,45,110,0.1)] focus:text-[#FF2D6E]"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Tips */}
      <div className="mt-6 rounded-xl border border-[rgba(46,230,255,0.15)] bg-[rgba(46,230,255,0.05)] p-4">
        <p className="text-sm text-[#A7B0C8]">
          <span className="text-[#2EE6FF]">Pro tip:</span> Click a scene to activate it. 
          Each scene can have different overlays and positions.
        </p>
      </div>
    </div>
  );
}
