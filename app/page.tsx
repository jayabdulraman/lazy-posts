"use client";

import React from "react";
import ReactMarkdown from 'react-markdown';
import TwitterPostCard from '../components/twitter/TwitterPostCard';
import TwitterStatus from '../components/twitter/TwitterStatus';
import { useTwitterStore } from '../store/twitterStore';

function IconHamburger() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  );
}

function IconGlobe() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M2 12h20"></path>
      <path d="M12 2a15.3 15.3 0 0 0 0 20a15.3 15.3 0 0 0 0-20"></path>
    </svg>
  );
}

function IconPlusSparkles() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 3v4M3 5h4" />
      <path d="M19 11v4M17 13h4" />
      <path d="M8 20l2-2 2 2 2-2 2 2" />
    </svg>
  );
}

function IconCompass() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <polygon points="16 8 14 14 8 16 10 10 16 8" />
    </svg>
  );
}

function IconCode() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function IconHat() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 10L12 6 2 10l10 4 10-4z" />
      <path d="M6 12v4c3 2 9 2 12 0v-4" />
    </svg>
  );
}

function IconArrowUp() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 19V5" />
      <path d="M5 12l7-7 7 7" />
    </svg>
  );
}

function IconChevronDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );
}


function IconPlus() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function IconTools() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function IconCopy() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function IconBranch() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="6" y1="3" x2="6" y2="15" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M18 9a9 9 0 0 1-9 9" />
    </svg>
  );
}

function IconRefresh() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}

function ChipButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="inline-flex items-center gap-2 rounded-full border border-rose-200/60 bg-white/70 px-4 py-2 text-sm font-medium text-rose-900 shadow-sm backdrop-blur transition hover:bg-white">
      <span className="text-rose-500">{icon}</span>
      {label}
    </button>
  );
}

type ChatMessage = { 
  id: string; 
  role: "user" | "assistant"; 
  content: string;
  toolCalls?: ToolCall[];
  toolResults?: ToolResult[];
  twitterPosts?: TwitterPostResult[];
  sources?: string[];
  researchText?: string;
  model?: string;
  tokensPerSecond?: number;
  totalTokens?: number;
  timeToFirstToken?: number;
  timestamp?: number;
};
type Thread = { id: string; title: string; messages: ChatMessage[] };

const twitterPrompts: string[] = [
  "Research and create a Twitter post about current AI trends",
  "Find latest news and tweet about space exploration", 
  "Research recent tech developments and post on Twitter",
  "Discover trending topics and create engaging Twitter content",
];

interface Toolkit {
  slug: string;
  name: string;
  meta: {
    description: string;
    logo: string;
    tools_count: number;
    categories: Array<{id: string; name: string}>;
  };
  tools?: Tool[];
}

interface Tool {
  name: string;
  slug: string;
  description: string;
  displayName: string;
}

interface ToolCall {
  type: 'tool-call';
  toolName: string;
  toolCallId: string;
  args: any;
}

interface ToolResult {
  type: 'tool-result';
  toolCallId: string;
  toolName: string;
  result: any;
}

interface TwitterPostResult {
  type: 'twitter-post-result' | 'twitter-post-preview' | 'twitter-post-success';
  toolCallId?: string;
  tweetId?: string;
  tweetUrl?: string;
  content: string;
  createdAt?: string;
  timestamp?: number;
  user?: {
    id?: string;
    name?: string;
    username?: string;
    profile_image_url?: string;
  };
  success?: boolean;
  posted: boolean;
  userId?: string;
  tweetData?: any;
  sources?: string[];
  researchText?: string;
}

function MessageActions({ 
  message, 
  onCopy, 
  onBranchOff, 
  onRetry 
}: { 
  message: ChatMessage; 
  onCopy: () => void; 
  onBranchOff: () => void; 
  onRetry: () => void; 
}) {
  const [copied, setCopied] = React.useState(false);
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    onCopy();
    setTimeout(() => setCopied(false), 2000);
  };
  
  const formatDuration = (ms?: number) => {
    if (!ms) return null;
    return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(2)} sec`;
  };
  
  return (
    <div className="mt-3 flex items-center justify-between text-xs border-t border-rose-200/30 pt-2">
      <div className="flex items-center gap-1">
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-md hover:bg-rose-100/40 transition-colors hover:text-[#432A78]"
          style={{ color: '#432A78' }}
          title={copied ? 'Copied!' : 'Copy message'}
        >
          <IconCopy />
        </button>
        
        <button
          onClick={onBranchOff}
          className="p-1.5 rounded-md hover:bg-rose-100/40 transition-colors hover:text-[#432A78]"
          style={{ color: '#432A78' }}
          title="Branch off to new conversation with different model"
        >
          <IconBranch />
        </button>
        
        <button
          onClick={onRetry}
          className="p-1.5 rounded-md hover:bg-rose-100/40 transition-colors hover:text-[#432A78]"
          style={{ color: '#432A78' }}
          title="Retry message"
        >
          <IconRefresh />
        </button>
      </div>
      
      <div className="flex items-center gap-3 font-medium" style={{ color: '#432A78' }}>
        {message.model && (
          <span className="text-xs">{message.model}</span>
        )}
        {message.tokensPerSecond && (
          <span className="text-xs">{message.tokensPerSecond.toFixed(2)} tok/sec</span>
        )}
        {message.totalTokens && (
          <span className="text-xs">{message.totalTokens} tokens</span>
        )}
        {message.timeToFirstToken && (
          <span className="text-xs">Time-to-First: {formatDuration(message.timeToFirstToken)}</span>
        )}
      </div>
    </div>
  );
}

function ToolCallComponent({ toolCall, toolResult }: { toolCall: ToolCall; toolResult?: ToolResult }) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [logoUrl, setLogoUrl] = React.useState<string | null>(null);
  
  const getToolIcon = (toolName: string) => {
    if (toolName.includes('GMAIL')) return '✉️';
    if (toolName.includes('CALENDAR')) return '📅';
    if (toolName.includes('GITHUB')) return '🐙';
    if (toolName.includes('SLACK')) return '💬';
    return '🔧';
  };
  
  const getToolDisplayName = (toolName: string) => {
    return toolName.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };
  
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem('t3chat:toolkits');
      if (!raw) return;
      const items = JSON.parse(raw) as Array<{ slug: string; name: string; meta?: { logo?: string } }>;
      const prefix = (toolCall.toolName || '').split('_')[0]?.toLowerCase() || '';
      const match = items.find((tk) =>
        tk.slug?.toLowerCase().includes(prefix) || tk.name?.toLowerCase().includes(prefix)
      );
      if (match?.meta?.logo) setLogoUrl(match.meta.logo);
    } catch {}
  }, [toolCall.toolName]);
  
  return (
    <div className="my-3 w-full rounded-2xl border border-rose-200/70 bg-[#f5dbef] p-4 shadow-sm">
      <div className="flex items-center justify-between gap-4 min-h-[72px]">
        <div className="flex items-center gap-3">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-white/80 text-[#ca0277] shadow-sm overflow-hidden">
            {logoUrl ? (
              <img src={logoUrl} alt="toolkit logo" className="h-5 w-5 object-contain" />
            ) : (
              <span className="text-base">{getToolIcon(toolCall.toolName)}</span>
            )}
          </div>
          <div>
            <div className="font-semibold text-[#ca0277]">{getToolDisplayName(toolCall.toolName)}</div>
            <div className="text-xs text-[#6F4DA3]">
              {toolResult ? '✅ Completed' : '⏳ Running...'}
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[#ca0277] hover:text-[#ca0277]/80 text-sm font-medium underline-offset-2 hover:underline"
        >
          {isExpanded ? 'Hide details' : 'Show details'}
        </button>
      </div>
      
      {isExpanded && (
        <div className="mt-4 space-y-3">
          <div>
            <div className="mb-1 text-xs font-medium text-[#6F4DA3]">Input:</div>
            <div className="rounded-lg border border-white/70 bg-white/60 p-2 font-mono text-xs text-[#432A78]">
              {JSON.stringify(toolCall.args, null, 2)}
            </div>
          </div>
          
          {toolResult && (
            <div>
              <div className="mb-1 text-xs font-medium text-[#6F4DA3]">Output:</div>
              <div className="max-h-40 overflow-y-auto rounded-lg border border-white/70 bg-white/60 p-2 font-mono text-xs text-[#432A78]">
                {JSON.stringify(toolResult.result, null, 2)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ToolsModalContent({ 
  selectedTools, 
  setSelectedTools 
}: { 
  selectedTools: string[]; 
  setSelectedTools: (tools: string[]) => void; 
}) {
  const [loading, setLoading] = React.useState(false);

  const toggleTwitter = () => {
    if (selectedTools.includes('TWITTER')) {
      // Remove Twitter tools
      setSelectedTools([]);
    } else {
      // Add Twitter tools (search tools are added automatically by backend)
      setSelectedTools(['TWITTER']);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">X.com</h3>
              <p className="text-sm text-gray-500">Research topics and post to your X account automatically</p>
            </div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedTools.includes('TWITTER')}
                onChange={toggleTwitter}
                className="text-[#aa4673] focus:ring-[#aa4673] mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Enable</span>
            </label>
          </div>
          
          {selectedTools.includes('TWITTER') && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-800 font-medium">
                ✨ Includes automatic web research and X.com posting
              </p>
              <p className="text-xs text-blue-600 mt-1">
                When enabled, the AI will research topics using web search and post to your X account automatically.
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          <strong>Note:</strong> More tools coming soon! For now, we're focusing on perfecting the X research and posting workflow.
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  const STORAGE_THREADS = "t3chat:threads";
  const STORAGE_ACTIVE = "t3chat:activeThreadId";
  const STORAGE_MODEL = "t3chat:selectedModel";

  const [threads, setThreads] = React.useState<Thread[]>([{ id: crypto.randomUUID(), title: "Greeting Title", messages: [] }]);
  const [activeThreadId, setActiveThreadId] = React.useState<string>("");
  const [input, setInput] = React.useState("");
  const [selectedModel, setSelectedModel] = React.useState("gpt-4.1-nano-2025-04-14");
  const [isModelMenuOpen, setIsModelMenuOpen] = React.useState(false);
  const [modelQuery, setModelQuery] = React.useState("");
  const modelMenuRef = React.useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [messageStartTime, setMessageStartTime] = React.useState<number | null>(null);
  const [firstTokenTime, setFirstTokenTime] = React.useState<number | null>(null);
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);
  const composerRef = React.useRef<HTMLDivElement | null>(null);
  const [composerHeight, setComposerHeight] = React.useState<number>(160);
  const [isToolsModalOpen, setIsToolsModalOpen] = React.useState(false);
  const [selectedTools, setSelectedTools] = React.useState<string[]>([]);
  const [isTwitterAuthenticated, setIsTwitterAuthenticated] = React.useState(false);
  const { getUserId } = useTwitterStore();

  const modelOptions = React.useMemo(
    () => [
      // OpenAI models (2025)
      "o3",
      "o4-mini",
      "gpt-5",
      "gpt-5-mini",
      "gpt-5-nano",
      "GPT-4.1",
      "GPT-4.1 Mini",
      // Anthropic models (2025)
      "Claude 4 Opus",
      "Claude 4 Sonnet", 
      "Claude 3.5 Sonnet",
      "Claude 3.5 Haiku",
      // Google models (2025)
      "Gemini 2.5 Pro",
      "Gemini 2.5 Flash",
      "Gemini 2.0 Flash",
      "Gemini 2.0 Flash Thinking",
      // Groq models (2025)
      "DeepSeek R1 Llama 70B",
      "Llama 3.3 70B",
    ],
    []
  );

  const filteredModels = React.useMemo(
    () => modelOptions.filter((m) => m.toLowerCase().includes(modelQuery.toLowerCase())),
    [modelOptions, modelQuery]
  );

  React.useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (isModelMenuOpen && modelMenuRef.current && !modelMenuRef.current.contains(e.target as Node)) {
        setIsModelMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [isModelMenuOpen]);

  // Load from storage on first mount to avoid SSR/CSR mismatch
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_THREADS);
      if (raw) {
        const parsed = JSON.parse(raw) as Thread[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setThreads(parsed);
        }
      }
      const savedActive = localStorage.getItem(STORAGE_ACTIVE);
      if (savedActive) setActiveThreadId(savedActive);
      const savedModel = localStorage.getItem(STORAGE_MODEL);
      if (savedModel) setSelectedModel(savedModel);
    } catch {}
  }, []);

  // Persist threads, active thread, and model selection
  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_THREADS, JSON.stringify(threads));
    } catch {}
  }, [threads]);

  React.useEffect(() => {
    try {
      if (activeThreadId) localStorage.setItem(STORAGE_ACTIVE, activeThreadId);
    } catch {}
  }, [activeThreadId]);

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_MODEL, selectedModel);
    } catch {}
  }, [selectedModel]);

  // Ensure we always have a valid active thread id after hydration
  React.useEffect(() => {
    if (!activeThreadId && threads[0]) {
      setActiveThreadId(threads[0].id);
    }
  }, [threads, activeThreadId]);
  
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [threads, isLoading]);

  // Measure composer height so content never sits under it
  React.useEffect(() => {
    function measure() {
      const h = composerRef.current?.offsetHeight ?? 160;
      setComposerHeight(h);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  const activeThread = threads.find((t) => t.id === activeThreadId) ?? threads[0];
  const showWelcome = (activeThread?.messages.length ?? 0) === 0 && input.trim().length === 0;

  // Handle posting a tweet after preview
  const handlePostTweet = async (content: string, userId: string) => {
    try {
      const response = await fetch('/api/twitter/post', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ content, userId })
      });
      
      const result = await response.json();
      
      console.log('Post tweet result:', result);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to post tweet');
      }
      
      // Update the message to show the posted tweet
      setThreads((prev) => prev.map((thread) => {
        if (thread.id !== activeThread.id) return thread;
        
        return {
          ...thread,
          messages: thread.messages.map((message) => {
            if (message.role !== 'assistant' || !message.twitterPosts) return message;
            
            return {
              ...message,
              twitterPosts: message.twitterPosts.map((post) => {
                if (post.content === content && !post.posted) {
                  // Convert preview to posted with all the returned data
                  const updatedPost = {
                    ...post, // Keep original preview data
                    ...result.twitterData, // Override with API response data
                    posted: true
                  } as TwitterPostResult;
                  
                  console.log('Updated post data:', updatedPost);
                  return updatedPost;
                }
                return post;
              })
            };
          })
        };
      }));
      
    } catch (error) {
      console.error('Error posting tweet:', error);
      throw error;
    }
  };
  
  async function sendMessage(text: string, retryFromMessage?: ChatMessage) {
    if (!text.trim()) return;
    
    let targetMessages: ChatMessage[];
    if (retryFromMessage) {
      // Find the index of the message we're retrying from
      const msgIndex = activeThread.messages.findIndex(m => m.id === retryFromMessage.id);
      // Keep all messages up to (but not including) the retry message
      targetMessages = activeThread.messages.slice(0, msgIndex);
    } else {
      targetMessages = activeThread.messages;
    }
    
    const userMsg: ChatMessage = { 
      id: crypto.randomUUID(), 
      role: "user", 
      content: text.trim(),
      timestamp: Date.now()
    };
    
    const optimistic = threads.map((t) => {
      if (t.id !== activeThread.id) return t;
      const isFirst = targetMessages.length === 0;
      const maybeTitle = isFirst ? text.trim().slice(0, 40) || t.title : t.title;
      return { ...t, title: maybeTitle, messages: [...targetMessages, userMsg] };
    });
    setThreads(optimistic);
    if (!retryFromMessage) setInput("");
    setIsLoading(true);
    setMessageStartTime(Date.now());
    setFirstTokenTime(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          model: selectedModel,
          messages: [...targetMessages, userMsg],
          tools: selectedTools,
          userId: getUserId(), // Include user ID for Composio tools
        }),
      });

      // Check if Twitter tools are selected (now using non-streaming for Twitter)
      const hasTwitterTools = selectedTools?.some(tool => tool.includes('TWITTER')) || false;
      
      // Handle text response for both Twitter and non-Twitter requests
      const fullText = await res.text();
      
      // Parse Twitter post data from response
      let twitterPosts: TwitterPostResult[] = [];
      let cleanContent = fullText;
      
      // Parse published Twitter posts
      const twitterPostMatches = fullText.matchAll(/__TWITTER_POST__(.*?)__TWITTER_POST__/g);
      for (const match of twitterPostMatches) {
        try {
          console.log('Found Twitter post match:', match[1]);
          const twitterPost = JSON.parse(match[1]) as TwitterPostResult;
          console.log('Parsed Twitter post:', twitterPost);
          twitterPosts.push(twitterPost);
          cleanContent = cleanContent.replace(match[0], '');
        } catch (e) {
          console.error('Error parsing Twitter post:', e, match[1]);
        }
      }
      
      // Parse Twitter preview posts
      const twitterPreviewMatches = fullText.matchAll(/__TWITTER_PREVIEW__(.*?)__TWITTER_PREVIEW__/g);
      let extractedSources: string[] = [];
      let extractedResearchText: string | undefined;
      
      for (const match of twitterPreviewMatches) {
        try {
          console.log('Found Twitter preview match:', match[1]);
          const twitterPreview = JSON.parse(match[1]) as TwitterPostResult;
          console.log('Parsed Twitter preview:', twitterPreview);
          
          // Extract sources from preview data
          if (twitterPreview.sources && twitterPreview.sources.length > 0) {
            extractedSources = twitterPreview.sources;
            console.log('Extracted sources from preview data:', extractedSources);
          }
          
          // Extract research text from preview data
          if (twitterPreview.researchText) {
            extractedResearchText = twitterPreview.researchText;
            console.log('Extracted research text from preview data');
          }
          
          twitterPosts.push(twitterPreview);
          cleanContent = cleanContent.replace(match[0], '');
        } catch (e) {
          console.error('Error parsing Twitter preview:', e, match[1]);
        }
      }
      
      const botMsg: ChatMessage = { 
        id: crypto.randomUUID(), 
        role: "assistant", 
        content: cleanContent.trim(),
        twitterPosts: twitterPosts.length > 0 ? twitterPosts : undefined,
        sources: extractedSources.length > 0 ? extractedSources : undefined,
        researchText: extractedResearchText,
        model: selectedModel,
        timestamp: Date.now(),
        timeToFirstToken: firstTokenTime || undefined
      };
      
      setThreads((prev) => prev.map((t) => t.id === activeThread.id ? { ...t, messages: [...t.messages, botMsg] } : t));
    } catch (e) {
      const errorMsg: ChatMessage = { 
        id: crypto.randomUUID(), 
        role: "assistant", 
        content: "Sorry, something went wrong.",
        model: selectedModel,
        timestamp: Date.now()
      };
      setThreads((prev) => prev.map((t) => t.id === activeThread.id ? { ...t, messages: [...t.messages, errorMsg] } : t));
    } finally {
      setIsLoading(false);
      setMessageStartTime(null);
      setFirstTokenTime(null);
    }
  }

  function startNewChat() {
    const id = crypto.randomUUID();
    const newThread: Thread = { id, title: "New Chat", messages: [] };
    setThreads((prev) => [newThread, ...prev]);
    setActiveThreadId(id);
    setInput("");
  }

  function onSuggestionClick(prompt: string) {
    setInput(prompt);
    // optionally send immediately
    // sendMessage(prompt);
  }
  
  function handleCopyMessage() {
    // Copy functionality is handled within MessageActions component
  }
  
  function handleBranchOff(message: ChatMessage) {
    // Create a new thread starting from this message for trying a different model
    const messageIndex = activeThread.messages.findIndex(m => m.id === message.id);
    const messagesUpToHere = activeThread.messages.slice(0, messageIndex);
    
    const newThreadId = crypto.randomUUID();
    const newThread: Thread = {
      id: newThreadId,
      title: `Branch: ${message.content.slice(0, 30)}...`,
      messages: messagesUpToHere
    };
    
    setThreads(prev => [newThread, ...prev]);
    setActiveThreadId(newThreadId);
  }
  
  function handleRetryMessage(message: ChatMessage) {
    // Find the user message that generated this assistant response
    const messageIndex = activeThread.messages.findIndex(m => m.id === message.id);
    if (messageIndex > 0) {
      const userMessage = activeThread.messages[messageIndex - 1];
      if (userMessage.role === "user") {
        sendMessage(userMessage.content, message);
      }
    }
  }

  return (
    <div className="font-sans min-h-screen w-full bg-[#fdf7fd]">
      {/* Top-left toolbar with only + for New Chat */}
      <div className="fixed left-3 top-3 z-50">
        <button
          aria-label="New chat"
          onClick={startNewChat}
          className="grid h-9 w-9 place-items-center rounded-lg bg-[#f5dbef] text-[#ca0277] shadow-sm hover:brightness-95"
        >
          <IconPlus />
        </button>
      </div>
      <div className="mx-auto flex gap-6 p-4 sm:p-6 lg:py-8 justify-center">
        
<div className="w-full space-y-6 px-2 pt-8 duration-300 animate-in fade-in-50 zoom-in-90 sm:px-8 pt-18">
          {showWelcome && (
          <section className="mx-auto mt-8 w-full max-w-2xl text-left">
            <h1 className="text-2xl font-semibold font-weight-600 tracking-tight sm:text-[30px] pb-6 pt-12 justify-left text-[#4e2a58]">How can I help you?</h1>

            {activeThread?.messages.length === 0 && (
              <div className="mx-auto mt-4 w-full max-w-2xl divide-y divide-rose-100 overflow-hidden rounded-2xl text-left pt-1">
                {twitterPrompts.map((prompt: string) => (
                  <button
                    key={prompt}
                    onClick={() => onSuggestionClick(prompt)}
                    className="block w-full px-5 py-3 text-left text-rose-900/90 transition hover:bg-[#ed78c6]/20 text-font-10px"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}
          </section>
          )}

          {/* Messages */}
          <div className="mx-auto mt-6 w-full max-w-3xl flex-1" style={{ paddingBottom: composerHeight + 24 }}>
            <div className="space-y-4">
              {activeThread?.messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] ${m.role === "user" ? "flex justify-end" : ""}`}>
                    {/* Tool calls (only for assistant messages) */}
                    {m.role === "assistant" && m.toolCalls && m.toolCalls.length > 0 && (
                      <div className="mb-3 w-full">
                        {m.toolCalls.map((toolCall) => {
                          const toolResult = m.toolResults?.find(tr => tr.toolCallId === toolCall.toolCallId);
                          return (
                            <ToolCallComponent 
                              key={toolCall.toolCallId}
                              toolCall={toolCall}
                              toolResult={toolResult}
                            />
                          );
                        })}
                      </div>
                    )}
                    
                    {/* Message content */}
                    {/* Twitter workflow - Show static layout */}
                    {m.role === "assistant" && m.twitterPosts && m.twitterPosts.length > 0 ? (
                      <div className="w-full space-y-4">
                        {/* Step 1: Searching */}
                        <div className="bg-[#fdf7fd] text-rose-900 rounded-2xl px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span>🔍</span>
                            <span>Searching for current information...</span>
                          </div>
                        </div>
                        
                        {/* Step 2: Research completed */}
                        <div className="bg-[#fdf7fd] text-rose-900 rounded-2xl px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span>📊</span>
                            <span>Research completed!</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Regular message content */
                      m.content && (
                        <div className="w-full">
                          <div
                            className={`${
                              m.role === "user"
                                ? "bg-[#f5dbef] text-[#432A78]"
                                : "bg-[#fdf7fd] text-rose-900"
                            } whitespace-pre-wrap rounded-2xl px-4 py-3`}
                          >
                            {m.role === "assistant" ? (
                              <div className="prose prose-sm max-w-none prose-headings:text-rose-900 prose-p:text-rose-900 prose-li:text-rose-900 prose-strong:text-rose-900 prose-code:text-rose-800 prose-code:bg-rose-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-rose-100 prose-pre:text-rose-800">
                                <ReactMarkdown>
                                  {m.content}
                                </ReactMarkdown>
                              </div>
                            ) : (
                              m.content
                            )}
                          </div>
                        </div>
                      )
                    )}
                    
                    {/* Research findings accordion - only for assistant messages with research text */}
                    {m.role === "assistant" && m.researchText && (
                      <div className="mt-3">
                        <details className="group bg-blue-50 rounded-lg border border-blue-200">
                          <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-blue-800 hover:bg-blue-100 rounded-lg transition-colors duration-200 flex items-center justify-between">
                            <span className="flex items-center gap-2">
                              🔍 Research Findings
                            </span>
                            <svg className="w-4 h-4 transform transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                          </summary>
                          <div className="px-4 pb-4 pt-2 border-t border-blue-200 bg-blue-25">
                            <div className="prose prose-sm max-w-none prose-headings:text-blue-900 prose-p:text-blue-800 prose-li:text-blue-800 prose-strong:text-blue-900 prose-code:text-blue-800 prose-code:bg-blue-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-blue-100 prose-pre:text-blue-800">
                              <ReactMarkdown>
                                {m.researchText}
                              </ReactMarkdown>
                            </div>
                          </div>
                        </details>
                      </div>
                    )}
                    
                    {/* Sources chips - appear after research findings */}
                    {m.role === "assistant" && (() => {
                      console.log('Message sources debug:', { 
                        messageId: m.id, 
                        hasSources: !!m.sources, 
                        sourcesLength: m.sources?.length || 0,
                        sources: m.sources 
                      });
                      return m.sources && m.sources.length > 0;
                    })() && (
                      <div className="mt-3">
                        <div className="text-xs text-rose-600 mb-2 font-medium">Sources:</div>
                        <div className="flex flex-wrap gap-2">
                          {m.sources?.slice(0, 3).map((source, index) => {
                            // Handle both string URLs and source objects
                            const sourceUrl = typeof source === 'string' ? source : (source as any).url;
                            const sourceTitle = typeof source === 'string' ? source : (source as any).title;
                            
                            return (
                              <a
                                key={index}
                                href={sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block px-3 py-1 bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs rounded-full transition-colors duration-200 max-w-xs truncate border border-rose-200"
                                title={sourceTitle}
                              >
                                🔗 {(() => {
                                  try {
                                    return new URL(sourceUrl).hostname;
                                  } catch {
                                    return sourceUrl?.length > 30 ? sourceUrl.substring(0, 30) + '...' : sourceUrl;
                                  }
                                })()}
                              </a>
                            );
                          })}
                          
                          {m.sources && m.sources.length > 3 && (
                            <div className="relative group">
                              <div className="inline-block px-3 py-1 bg-rose-100 text-rose-700 text-xs rounded-full border border-rose-200 cursor-default">
                                +{m.sources.length - 3}
                              </div>
                              
                              {/* Tooltip with remaining sources */}
                              <div className="absolute bottom-full left-0 mb-2 w-80 p-3 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                <div className="text-xs font-medium text-gray-700 mb-2">Additional sources:</div>
                                <div className="flex flex-wrap gap-2">
                                  {m.sources.slice(3).map((source, index) => {
                                    const sourceUrl = typeof source === 'string' ? source : (source as any).url;
                                    const sourceTitle = typeof source === 'string' ? source : (source as any).title;
                                    
                                    return (
                                      <a
                                        key={index + 3}
                                        href={sourceUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs rounded-full transition-colors duration-200 max-w-xs truncate"
                                        title={sourceTitle}
                                      >
                                        🔗 {(() => {
                                          try {
                                            return new URL(sourceUrl).hostname;
                                          } catch {
                                            return sourceUrl?.length > 25 ? sourceUrl.substring(0, 25) + '...' : sourceUrl;
                                          }
                                        })()}
                                      </a>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Twitter workflow: Step 3 - Generating tweet */}
                    {m.role === "assistant" && m.twitterPosts && m.twitterPosts.length > 0 && (
                      <div className="mt-4">
                        <div className="bg-[#fdf7fd] text-rose-900 rounded-2xl px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span>💭</span>
                            <span>Generating tweet based on findings...</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Twitter post cards (only for assistant messages) - After message content, before actions */}
                    {m.role === "assistant" && m.twitterPosts && m.twitterPosts.length > 0 && (
                      <div className="mt-3 w-full">
                        {m.twitterPosts.map((twitterPost, index) => (
                          <TwitterPostCard 
                            key={twitterPost.toolCallId || `preview-${index}`}
                            postData={twitterPost}
                            onPost={!twitterPost.posted ? handlePostTweet : undefined}
                          />
                        ))}
                      </div>
                    )}
                    
                    {/* Message Actions - only for assistant messages */}
                    {m.role === "assistant" && (
                      <MessageActions
                        message={m}
                        onCopy={handleCopyMessage}
                        onBranchOff={() => handleBranchOff(m)}
                        onRetry={() => handleRetryMessage(m)}
                      />
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1 rounded-2xl bg-[#fdf7fd] px-4 py-3">
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Composer (floating) */}
          <section className="mx-auto mt-10 w-full max-w-3xl">
            <div className="input-bar" ref={composerRef}>
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <textarea
                    rows={2}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage(input);
                      }
                    }}
                    placeholder="Type your message here..."
                    className="h-[68px] w-full resize-none rounded-l-2xl border border-transparent bg-[#FBF7FB] px-4 py-3 text-[#432A78] placeholder-[#6F4DA3] outline-none"
                  />
                  <div className="mt-2 flex items-center gap-2 text-xs text-rose-700">
                    <div className="relative inline-block" ref={modelMenuRef}>
                      <button
                        aria-haspopup="listbox"
                        aria-expanded={isModelMenuOpen}
                        onClick={() => setIsModelMenuOpen((v) => !v)}
                        className="inline-flex items-center gap-1 rounded-full border border-rose-200/60 bg-white/70 px-2.5 py-1 font-medium hover:bg-[#ed78c6]/20"
                      >
                        {selectedModel}
                        <IconChevronDown />
                      </button>
                      {isModelMenuOpen && (
                        <div className="absolute left-0 bottom-full z-50 mb-2 w-72 rounded-xl border border-rose-200/60 bg-white p-2 text-rose-900 shadow-lg">
                          <input
                            autoFocus
                            value={modelQuery}
                            onChange={(e) => setModelQuery(e.target.value)}
                            placeholder="Search models..."
                            className="mb-2 w-full rounded-lg border border-rose-200/60 bg-white px-2.5 py-1 text-xs outline-none"
                          />
                          <ul role="listbox" className="max-h-56 overflow-auto">
                            {filteredModels.length === 0 && (
                              <li className="px-2 py-1 text-xs text-rose-500">No models found</li>
                            )}
                            {filteredModels.map((m) => (
                              <li key={m}>
                                <button
                                  role="option"
                                  onClick={() => { setSelectedModel(m); setIsModelMenuOpen(false); }}
                                  className={`block w-full rounded-md px-2 py-1 text-left text-sm hover:bg-[#ed78c6]/20 ${selectedModel === m ? 'bg-[#ed78c6]/20' : ''}`}
                                >
                                  {m}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => setIsToolsModalOpen(true)}
                      className={`inline-flex items-center gap-1 rounded-full border border-rose-200/60 px-2.5 py-1 font-medium transition ${
                        selectedTools.length > 0 
                          ? "bg-[#aa4673] text-white border-[#aa4673] hover:bg-[#aa4673]/90"
                          : "bg-white/70 hover:bg-white"
                      }`}
                    >
                      <span className={selectedTools.length > 0 ? "text-white" : "text-rose-500"}>
                        <IconTools />
                      </span>
                      Tools {selectedTools.length > 0 && `(${selectedTools.length})`}
                    </button>
                    
                    {/* Twitter Status */}
                    <div className="ml-2">
                      <TwitterStatus 
                        onAuthChange={setIsTwitterAuthenticated}
                        className="text-xs"
                      />
                    </div>
                  </div>
                </div>
                <button aria-label="Send" onClick={() => sendMessage(input)} className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-b from-rose-800 to-pink-800 text-white shadow-md transition hover:from-rose-600 hover:to-pink-600">
                  <IconArrowUp />
                </button>
              </div>
            </div>
          </section>
          </div>
      </div>

      {/* Tools Modal */}
      {isToolsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Select Tools</h2>
              <button
                onClick={() => setIsToolsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <ToolsModalContent 
                selectedTools={selectedTools}
                setSelectedTools={setSelectedTools}
              />
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setIsToolsModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsToolsModalOpen(false)}
                className="px-6 py-2 bg-[#aa4673] text-white rounded-lg hover:bg-[#aa4673]/90 transition"
              >
                Done ({selectedTools.length} selected)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
