"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  ArrowRight, 
  Link as LinkIcon, 
  Zap, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Calendar, 
  Code, 
  FileText, 
  User, 
  Briefcase,
  Star,
  Sparkles,
  X
} from "lucide-react";

// --- Minimal Inline UI Components (Replacing external @/components/ui dependencies for plug-and-play) ---
const Badge = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors ${className}`}>
    {children}
  </span>
);

const Button = ({ 
  children, 
  onClick, 
  variant = "default", 
  size = "default", 
  className = "",
  type = "button"
}: { 
  children: React.ReactNode; 
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void; 
  variant?: "default" | "outline" | "ghost" | "destructive"; 
  size?: "default" | "sm" | "icon"; 
  className?: string;
  type?: "button" | "submit" | "reset";
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    default: "bg-white text-black hover:bg-white/90 shadow",
    outline: "border border-white/20 bg-transparent hover:bg-white/10 text-white",
    ghost: "hover:bg-white/10 text-white",
    destructive: "bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30"
  };
  const sizes = {
    default: "h-9 px-4 py-2 text-sm",
    sm: "h-7 px-3 text-xs",
    icon: "h-9 w-9"
  };

  return (
    <button type={type} onClick={onClick} className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </button>
  );
};

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-xl border bg-card text-card-foreground shadow-sm ${className}`}>{children}</div>
);

const CardHeader = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex flex-col space-y-1.5 p-4 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>{children}</h3>
);

const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-4 pt-0 ${className}`}>{children}</div>
);

// --- Types ---
export interface TodoItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  iconName: string;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

// Icon mapping helper to store in state safely
const ICON_MAP: Record<string, React.ElementType> = {
  Calendar,
  Code,
  FileText,
  User,
  Clock,
  Briefcase,
  Star,
  Sparkles
};

// Initial Demo Tasks
const INITIAL_TODOS: TodoItem[] = [
  {
    id: 1,
    title: "Project Planning",
    date: "Today, 10:00 AM",
    content: "Define core features and technical stack for the new dashboard.",
    category: "Planning",
    iconName: "Calendar",
    relatedIds: [2],
    status: "completed",
    energy: 90,
  },
  {
    id: 2,
    title: "UI/UX Design",
    date: "Tomorrow, 2:00 PM",
    content: "Create wireframes and interactive glassmorphism prototypes.",
    category: "Design",
    iconName: "FileText",
    relatedIds: [1, 3],
    status: "in-progress",
    energy: 85,
  },
  {
    id: 3,
    title: "Core Development",
    date: "Jul 18, 2026",
    content: "Implement orbital animations and state management system.",
    category: "Development",
    iconName: "Code",
    relatedIds: [2, 4],
    status: "in-progress",
    energy: 100,
  },
  {
    id: 4,
    title: "Security Testing",
    date: "Jul 22, 2026",
    content: "Conduct penetration testing and resolve authentication bugs.",
    category: "Testing",
    iconName: "User",
    relatedIds: [3, 5],
    status: "pending",
    energy: 50,
  },
  {
    id: 5,
    title: "Production Release",
    date: "Jul 25, 2026",
    content: "Deploy to Vercel and monitor database performance analytics.",
    category: "Release",
    iconName: "Clock",
    relatedIds: [4],
    status: "pending",
    energy: 40,
  },
];

// --- Main Application Component ---
export default function OrbitalTodoWebsite() {
  const [todos, setTodos] = useState<TodoItem[]>(INITIAL_TODOS);
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [viewMode] = useState<"orbital">("orbital");
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [centerOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // New Todo Form State
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("Development");
  const [newDate, setNewDate] = useState("");
  const [newEnergy, setNewEnergy] = useState(75);
  const [newIcon, setNewIcon] = useState("Sparkles");

  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => {
      const newState: Record<number, boolean> = {};
      Object.keys(prev).forEach((key) => {
        if (parseInt(key) !== id) {
          newState[parseInt(key)] = false;
        }
      });

      newState[id] = !prev[id];

      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);

        const relatedItems = getRelatedItems(id);
        const newPulseEffect: Record<number, boolean> = {};
        relatedItems.forEach((relId) => {
          newPulseEffect[relId] = true;
        });
        setPulseEffect(newPulseEffect);

        centerViewOnNode(id);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }

      return newState;
    });
  };

  useEffect(() => {
    let rotationTimer: NodeJS.Timeout;

    if (autoRotate && viewMode === "orbital") {
      rotationTimer = setInterval(() => {
        setRotationAngle((prev) => {
          const newAngle = (prev + 0.25) % 360;
          return Number(newAngle.toFixed(3));
        });
      }, 50);
    }

    return () => {
      if (rotationTimer) {
        clearInterval(rotationTimer);
      }
    };
  }, [autoRotate, viewMode]);

  const centerViewOnNode = (nodeId: number) => {
    if (viewMode !== "orbital" || !nodeRefs.current[nodeId]) return;

    const nodeIndex = todos.findIndex((item) => item.id === nodeId);
    const totalNodes = todos.length;
    if (totalNodes === 0) return;
    const targetAngle = (nodeIndex / totalNodes) * 360;

    setRotationAngle(270 - targetAngle);
  };

  const calculateNodePosition = (index: number, total: number) => {
    if (total === 0) return { x: 0, y: 0, angle: 0, zIndex: 100, opacity: 1 };
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radius = Math.min(220, 150 + total * 10); // Dynamic radius based on task count
    const radian = (angle * Math.PI) / 180;

    const x = radius * Math.cos(radian) + centerOffset.x;
    const y = radius * Math.sin(radian) + centerOffset.y;

    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(
      0.4,
      Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2))
    );

    return { x, y, angle, zIndex, opacity };
  };

  const getRelatedItems = (itemId: number): number[] => {
    const currentItem = todos.find((item) => item.id === itemId);
    return currentItem ? currentItem.relatedIds : [];
  };

  const isRelatedToActive = (itemId: number): boolean => {
    if (!activeNodeId) return false;
    const relatedItems = getRelatedItems(activeNodeId);
    return relatedItems.includes(itemId);
  };

  const getStatusStyles = (status: TodoItem["status"]): string => {
    switch (status) {
      case "completed":
        return "text-white bg-black border-white";
      case "in-progress":
        return "text-black bg-white border-black font-bold";
      case "pending":
        return "text-white bg-black/40 border-white/50";
      default:
        return "text-white bg-black/40 border-white/50";
    }
  };

  // --- Task Management Functions ---
  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newId = todos.length > 0 ? Math.max(...todos.map((t) => t.id)) + 1 : 1;
    
    // Automatically link to the currently active task or the last created task
    const related = activeNodeId ? [activeNodeId] : todos.length > 0 ? [todos[todos.length - 1].id] : [];

    const newTodoItem: TodoItem = {
      id: newId,
      title: newTitle,
      content: newContent || "No detailed description provided.",
      category: newCategory,
      date: newDate || "Soon",
      energy: Number(newEnergy),
      iconName: newIcon,
      relatedIds: related,
      status: "pending",
    };

    setTodos([...todos, newTodoItem]);
    
    // Reset Form
    setNewTitle("");
    setNewContent("");
    setNewDate("");
    setIsAddModalOpen(false);
  };

  const handleStatusChange = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setTodos((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus: TodoItem["status"] =
            item.status === "pending"
              ? "in-progress"
              : item.status === "in-progress"
              ? "completed"
              : "pending";
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  const handleDeleteTodo = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setTodos((prev) => prev.filter((item) => item.id !== id));
    setExpandedItems((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    if (activeNodeId === id) {
      setActiveNodeId(null);
      setAutoRotate(true);
    }
  };

  return (
    <div
      className="w-full h-screen flex flex-col items-center justify-center bg-black overflow-hidden font-sans select-none relative"
      ref={containerRef}
      onClick={handleContainerClick}
    >
      {/* Top Header Controls */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-50 pointer-events-auto">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-teal-400 animate-ping" />
          <h1 className="text-white font-mono text-sm uppercase tracking-widest font-bold">
            Orbital Task Matrix // Rakib Sir
          </h1>
          <Badge className="bg-white/10 text-white/80 border-white/20">
            {todos.filter(t => t.status === "completed").length} / {todos.length} Done
          </Badge>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            className="border-white/30 bg-black/50 backdrop-blur-md hover:bg-white hover:text-black transition-all duration-300"
            onClick={() => setAutoRotate(!autoRotate)}
          >
            {autoRotate ? "Pause Orbit" : "Resume Orbit"}
          </Button>

          <Button
            variant="default"
            size="sm"
            className="bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 text-white border-0 hover:opacity-90 shadow-lg shadow-purple-500/20"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={16} className="mr-1" /> New Task
          </Button>
        </div>
      </div>

      {/* Main Orbital Canvas */}
      <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
        <div
          className="absolute w-full h-full flex items-center justify-center"
          ref={orbitRef}
          style={{
            perspective: "1000px",
            transform: `translate(${centerOffset.x}px, ${centerOffset.y}px)`,
          }}
        >
          {/* Glowing Center Core */}
          <div className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 animate-pulse flex items-center justify-center z-10">
            <div className="absolute w-20 h-20 rounded-full border border-white/20 animate-ping opacity-70"></div>
            <div
              className="absolute w-24 h-24 rounded-full border border-white/10 animate-ping opacity-50"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center">
              <Sparkles size={16} className="text-black animate-spin" style={{ animationDuration: "12s" }} />
            </div>
          </div>

          {/* Orbital Track Ring */}
          <div className="absolute w-96 h-96 rounded-full border border-white/10 shadow-[0_0_50px_rgba(255,255,255,0.05)]"></div>
          <div className="absolute w-[440px] h-[440px] rounded-full border border-white/5 border-dashed"></div>

          {/* Task Nodes */}
          {todos.map((item, index) => {
            const position = calculateNodePosition(index, todos.length);
            const isExpanded = expandedItems[item.id];
            const isRelated = isRelatedToActive(item.id);
            const isPulsing = pulseEffect[item.id];
            const Icon = ICON_MAP[item.iconName] || Star;

            const nodeStyle = {
              transform: `translate(${position.x}px, ${position.y}px)`,
              zIndex: isExpanded ? 200 : position.zIndex,
              opacity: isExpanded ? 1 : position.opacity,
            };

            return (
              <div
                key={item.id}
                ref={(el) => (nodeRefs.current[item.id] = el)}
                className="absolute transition-all duration-700 cursor-pointer"
                style={nodeStyle}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem(item.id);
                }}
              >
                {/* Energy Glow Field */}
                <div
                  className={`absolute rounded-full -inset-1 ${
                    isPulsing ? "animate-pulse duration-1000" : ""
                  }`}
                  style={{
                    background: `radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)`,
                    width: `${item.energy * 0.5 + 40}px`,
                    height: `${item.energy * 0.5 + 40}px`,
                    left: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
                    top: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
                  }}
                ></div>

                {/* Node Button */}
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center relative
                    ${
                      isExpanded
                        ? "bg-white text-black"
                        : item.status === "completed"
                        ? "bg-teal-500/20 text-teal-300 border-teal-500/50"
                        : isRelated
                        ? "bg-white/50 text-black"
                        : "bg-black text-white"
                    }
                    border-2 
                    ${
                      isExpanded
                        ? "border-white shadow-[0_0_20px_rgba(255,255,255,0.6)]"
                        : isRelated
                        ? "border-white animate-pulse"
                        : "border-white/40 hover:border-white"
                    }
                    transition-all duration-300 transform
                    ${isExpanded ? "scale-150" : "hover:scale-110"}
                  `}
                >
                  <Icon size={16} />
                  
                  {/* Miniature Status Indicator Badge */}
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-black flex items-center justify-center border border-white/40">
                    {item.status === "completed" && <CheckCircle2 size={10} className="text-teal-400" />}
                    {item.status === "in-progress" && <Clock size={10} className="text-amber-400" />}
                    {item.status === "pending" && <Circle size={10} className="text-white/40" />}
                  </div>
                </div>

                {/* Node Title Label */}
                <div
                  className={`
                    absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap
                    text-xs font-semibold tracking-wider font-mono
                    transition-all duration-300 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm border border-white/10
                    ${isExpanded ? "text-white scale-110 border-white/40" : "text-white/70"}
                  `}
                >
                  {item.title}
                </div>

                {/* Expanded Task Details Card */}
                {isExpanded && (
                  <Card className="absolute top-20 left-1/2 -translate-x-1/2 w-72 bg-black/95 backdrop-blur-xl border-white/40 shadow-2xl shadow-white/10 overflow-visible z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-white/60"></div>
                    
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <Badge
                          className={`px-2 text-[10px] cursor-pointer transition-transform active:scale-95 ${getStatusStyles(
                            item.status
                          )}`}
                          onClick={(e: React.MouseEvent) => handleStatusChange(item.id, e)}
                        >
                          {item.status === "completed"
                            ? "✓ COMPLETED"
                            : item.status === "in-progress"
                            ? "⚡ IN PROGRESS"
                            : "○ PENDING (CLICK TO CHANGE)"}
                        </Badge>
                        <span className="text-[11px] font-mono text-white/50">
                          {item.date}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-start mt-2">
                        <CardTitle className="text-base font-bold text-white tracking-wide">
                          {item.title}
                        </CardTitle>
                        <button 
                          onClick={(e) => handleDeleteTodo(item.id, e)}
                          className="text-white/40 hover:text-red-400 transition-colors p-1"
                          title="Delete Task"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </CardHeader>

                    <CardContent className="text-xs text-white/80">
                      <p className="bg-white/5 p-2.5 rounded border border-white/5 leading-relaxed text-white/90">
                        {item.content}
                      </p>

                      <div className="mt-4 pt-3 border-t border-white/10">
                        <div className="flex justify-between items-center text-xs mb-1.5">
                          <span className="flex items-center text-white/60 font-mono text-[11px]">
                            <Zap size={12} className="mr-1 text-amber-400" />
                            Energy / Priority Level
                          </span>
                          <span className="font-mono text-white font-bold">{item.energy}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-teal-400 transition-all duration-500"
                            style={{ width: `${item.energy}%` }}
                          ></div>
                        </div>
                      </div>

                      {item.relatedIds.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-white/10">
                          <div className="flex items-center mb-2">
                            <LinkIcon size={12} className="text-white/60 mr-1.5" />
                            <h4 className="text-[10px] uppercase tracking-wider font-mono font-semibold text-white/60">
                              Connected Dependencies
                            </h4>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {item.relatedIds.map((relatedId) => {
                              const relatedItem = todos.find(
                                (i) => i.id === relatedId
                              );
                              if (!relatedItem) return null;
                              return (
                                <Button
                                  key={relatedId}
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center h-6 px-2 py-0 text-[11px] rounded border-white/20 bg-white/5 hover:bg-white hover:text-black text-white/90 transition-all"
                                  onClick={(e: React.MouseEvent) => {
                                    e.stopPropagation();
                                    toggleItem(relatedId);
                                  }}
                                >
                                  {relatedItem.title}
                                  <ArrowRight
                                    size={10}
                                    className="ml-1 opacity-60"
                                  />
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <div className="mt-4 pt-2 flex justify-between items-center border-t border-white/10">
                        <span className="text-[10px] font-mono text-white/40 uppercase">
                          Cat: {item.category}
                        </span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="h-6 text-[10px] border-white/30 hover:bg-white hover:text-black"
                          onClick={(e: React.MouseEvent) => handleStatusChange(item.id, e)}
                        >
                          Advance Status
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Status Bar Instructions */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center pointer-events-none">
        <p className="text-white/40 text-xs font-mono tracking-widest uppercase">
          Click any node to inspect & modify status • Drag free space to clear focus
        </p>
      </div>

      {/* New Task Creation Modal */}
      {isAddModalOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[300] flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div 
            className="bg-black border border-white/30 rounded-xl max-w-md w-full p-6 shadow-2xl shadow-white/10 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white"
            >
              <X size={18} />
            </button>

            <h2 className="text-lg font-mono font-bold text-white uppercase tracking-wider mb-1 flex items-center">
              <Sparkles className="mr-2 text-teal-400" size={18} /> Create Orbital Task
            </h2>
            <p className="text-xs text-white/50 mb-6 font-mono">Inject a new task node into your orbit.</p>

            <form onSubmit={handleAddTodo} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-mono uppercase text-white/70 mb-1">Task Title *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Database Migration" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-white/70 mb-1">Category</label>
                  <input 
                    type="text" 
                    placeholder="Development" 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-white/70 mb-1">Target Date</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Tomorrow, 5 PM" 
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-white/70 mb-1">Icon Representation</label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {Object.keys(ICON_MAP).map((iconKey) => {
                    const IconComponent = ICON_MAP[iconKey];
                    return (
                      <button
                        type="button"
                        key={iconKey}
                        onClick={() => setNewIcon(iconKey)}
                        className={`p-2 rounded border transition-all ${
                          newIcon === iconKey 
                            ? "bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" 
                            : "bg-white/5 text-white/70 border-white/20 hover:border-white/60"
                        }`}
                      >
                        <IconComponent size={16} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-mono uppercase text-white/70">Energy / Priority Level</label>
                  <span className="font-mono text-xs text-white font-bold">{newEnergy}%</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="100" 
                  step="5"
                  value={newEnergy}
                  onChange={(e) => setNewEnergy(Number(e.target.value))}
                  className="w-full accent-white bg-white/10 h-1.5 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-white/70 mb-1">Description / Notes</label>
                <textarea 
                  rows={3}
                  placeholder="Provide task execution details..." 
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white transition-colors resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddModalOpen(false)}
                  className="border-white/20"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-white text-black hover:bg-white/90 font-semibold px-6"
                >
                  Launch Task
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}