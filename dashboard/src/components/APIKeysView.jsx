import React, { useEffect, useState } from "react";
import {
  FileText,
  Plus,
  Copy,
  CircleDollarSign,
  BarChart3,
  MoreVertical,
  Check,
  X,
  Key,
} from "lucide-react";

const APIKeysView = () => {
  // Mock authentication - replace with your actual auth logic
  const [isAuthenticated] = useState(true);

  const [apiKeys, setApiKeys] = useState([]);
  const [loadingKeys, setLoadingKeys] = useState(true);

  const [showCreate, setShowCreate] = useState(false);
  const [keyName, setKeyName] = useState("");
  const [creating, setCreating] = useState(false);

  const [openMenuId, setOpenMenuId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [selectedKey, setSelectedKey] = useState(null);
  const [copied, setCopied] = useState(false);
  const [createdKey, setCreatedKey] = useState(null);


  // fetch keys
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const fetchKeys = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api-keys/api-keys/", {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch keys");

        const data = await res.json();
        setApiKeys(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingKeys(false);
      }
    };

    fetchKeys();
  }, []);

  // delete key
  const deleteApiKey = async (id) => {
    if (!window.confirm("Delete this API key? This cannot be undone.")) return;

    setDeletingId(id);
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api-keys/api-keys/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );

      if (!res.ok) throw new Error("Delete failed");

      setApiKeys((prev) => prev.filter((k) => k.id !== id));
      if (selectedKey?.id === id) setSelectedKey(null);
    } catch (err) {
      alert("Failed to delete API key");
    } finally {
      setDeletingId(null);
      setOpenMenuId(null);
    }
  };

  // create key
const createApiKey = async () => {
  setCreating(true);
  try {
    const res = await fetch("http://127.0.0.1:8000/api-keys/api-keys/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
      body: JSON.stringify({ name: keyName }),
    });

    const data = await res.json();
    if (!res.ok) throw data;

    setCreatedKey(data.key);
    const { key, ...safeData } = data;
    setApiKeys((prev) => [safeData, ...prev]);
    setSelectedKey({
      ...safeData,
      key: data.key, 
    });

    setShowCreate(false);
    setKeyName("");
  } catch (err) {
    alert(err?.detail || "Failed to create API key");
  } finally {
    setCreating(false);
  }
};
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full text-[#e3e3e3]">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-2xl font-semibold">API Keys</h2>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium hover:bg-[#2a2a2a] rounded-lg transition-colors">
            <FileText size={18} />
            API quickstart
          </button>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 bg-[#2d2e30] border border-[#3c4043] px-4 py-2 rounded-full text-sm font-medium hover:bg-[#3c4043] transition-colors"
          >
            <Plus size={18} />
            Create API key
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <span className="text-sm text-[#9aa0a6]">Group by</span>
          <div className="flex bg-[#1e1f20] rounded-full p-1 border border-[#3c4043]">
            <button className="px-4 py-1 text-xs bg-[#2d2e30] rounded-full flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-white"></div> API key
            </button>
          </div>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-4 px-4 py-3 text-xs font-medium text-[#9aa0a6] border-b border-[#2a2a2a]">
        <div>Key</div>
        <div>Project</div>
        <div>Created on</div>
        <div>Quota tier</div>
      </div>

      {/* Table Body */}
      {loadingKeys ? (
        <div className="px-4 py-8 text-sm text-[#9aa0a6]">Loading keys...</div>
      ) : apiKeys.length === 0 ? (
        <div className="mt-20 flex flex-col items-center text-center">
          <h3 className="text-lg font-medium mb-3">
            Can't find your API keys here?
          </h3>
          <p className="text-sm text-[#9aa0a6] max-w-md leading-relaxed mb-8">
            This list only shows API keys for projects imported into LARC AI
            Studio. Import other projects to manage their associated API Keys.
            You can also create a new API Key above.{" "}
            <span className="text-[#8ab4f8] cursor-pointer">Learn more</span>
          </p>
        </div>
      ) : (
        apiKeys.map((key) => (
          <div
            key={key.id}
            className="grid grid-cols-4 px-4 py-6 text-sm border-b border-[#2a2a2a] hover:bg-[#1a1a1a] transition-colors group"
          >
            {/* Key */}
            <div
              onClick={() => setSelectedKey(key)}
              className="text-[#8ab4f8] cursor-pointer hover:underline underline-offset-4"
            >
              ...{key.id.slice(-4)}
              <br />
              <span className="text-[#9aa0a6] text-xs no-underline inline-block mt-1">
                {key.name}
              </span>
            </div>

            {/* Project */}
            <div className="text-[#8ab4f8] cursor-pointer hover:underline underline-offset-4">
              Default Project
              <br />
              <span className="text-[#9aa0a6] text-xs no-underline inline-block mt-1">
                gen-lang-client-0758454406
              </span>
            </div>

            {/* Created */}
            <div className="text-[#9aa0a6]">
              {new Date(key.created).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>

            {/* Quota tier + Actions */}
            <div className="flex items-center justify-between">
              <div className="text-[#8ab4f8] cursor-pointer hover:underline underline-offset-4">
                Set up billing
                <br />
                <span className="text-[#9aa0a6] text-xs no-underline inline-block mt-1">
                  {key.revoked ? "Revoked" : "Unavailable"}
                </span>
              </div>
              <div className="flex items-center gap-4 text-[#9aa0a6]">
                <Copy
                  size={16}
                  className="hover:text-white cursor-pointer transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (key.key) copyToClipboard(key.key);
                  }}
                />
                <CircleDollarSign
                  size={16}
                  className="hover:text-white cursor-pointer transition-colors"
                />
                <BarChart3
                  size={16}
                  className="hover:text-white cursor-pointer transition-colors"
                />
                <div className="relative">
                  <MoreVertical
                    size={16}
                    className="hover:text-white cursor-pointer transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === key.id ? null : key.id);
                    }}
                  />
                  {openMenuId === key.id && (
                    <div
                      className="absolute right-0 mt-2 w-36 bg-[#1e1f20] border border-[#3c4043] rounded-lg shadow-xl z-50 py-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        disabled={deletingId === key.id}
                        onClick={() => deleteApiKey(key.id)}
                        className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-[#2d2e30] transition-colors disabled:opacity-50"
                      >
                        {deletingId === key.id ? "Deleting..." : "Delete key"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
      )}

      {/* API Key Detail Modal */}
      {selectedKey && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200"
          onClick={() => setSelectedKey(null)}
        >
          <div
            className="bg-[#1e1f20] border border-[#3c4043] rounded-2xl w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-[#3c4043]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#2d2e30] flex items-center justify-center">
                  <Key size={20} className="text-[#8ab4f8]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedKey.name}</h3>
                  <p className="text-xs text-[#9aa0a6] mt-0.5">
                    Created{" "}
                    {new Date(selectedKey.created).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedKey(null)}
                className="p-2 hover:bg-[#2d2e30] rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="px-8 py-6 space-y-6">

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#9aa0a6] mb-2">
                    Status
                  </label>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        selectedKey.revoked ? "bg-red-500" : "bg-green-500"
                      }`}
                    ></div>
                    <span className="text-sm">
                      {selectedKey.revoked ? "Revoked" : "Active"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#9aa0a6] mb-2">
                    Project
                  </label>
                  <p className="text-sm">Default Project</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#9aa0a6] mb-2">
                    Created
                  </label>
                  <p className="text-sm">
                    {new Date(selectedKey.created).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#9aa0a6] mb-2">
                    Key ID
                  </label>
                  <p className="text-sm font-mono text-[#9aa0a6] truncate">
                    {selectedKey.id.slice(0, 20)}...
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between px-8 py-6 border-t border-[#3c4043] bg-[#1a1a1a] rounded-b-2xl">
              <button
                onClick={() => {
                  deleteApiKey(selectedKey.id);
                }}
                disabled={deletingId === selectedKey.id}
                className="px-4 py-2 text-sm text-red-400 hover:bg-[#2d2e30] rounded-lg transition-colors disabled:opacity-50"
              >
                {deletingId === selectedKey.id
                  ? "Deleting..."
                  : "Delete API Key"}
              </button>
              <button
                onClick={() => setSelectedKey(null)}
                className="px-6 py-2 bg-[#2d2e30] hover:bg-[#3c4043] rounded-lg text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200"
          onClick={() => setShowCreate(false)}
        >
          <div
            className="bg-[#1e1f20] border border-[#3c4043] rounded-2xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-semibold mb-6">Create API key</h3>

            <div className="mb-6">
              <label className="block text-sm font-medium text-[#9aa0a6] mb-3">
                Name
              </label>
              <input
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                placeholder="My API Key"
                className="w-full bg-[#0e0e0e] border border-[#3c4043] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#8ab4f8] transition-colors"
                autoFocus
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCreate(false);
                  setKeyName("");
                }}
                className="px-5 py-2 text-sm hover:bg-[#2d2e30] rounded-lg transition-colors"
              >
                Cancel
              </button>

              <button
                disabled={!keyName.trim() || creating}
                onClick={createApiKey}
                className="px-5 py-2 bg-[#8ab4f8] text-black rounded-lg text-sm font-medium hover:bg-[#aecbfa] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {creating ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default APIKeysView;