import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Plus,
  Copy,
  MoreVertical,
} from "lucide-react";

const APIKeysView = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const access = localStorage.getItem("access");
    const refresh = localStorage.getItem("refresh");
    if (!access || !refresh) {
      navigate("/signin");
    }
  }, [navigate]);
  const [apiKeys, setApiKeys] = useState([]);
  const [loadingKeys, setLoadingKeys] = useState(true);

  const [showCreate, setShowCreate] = useState(false);
  const [keyName, setKeyName] = useState("");
  const [creating, setCreating] = useState(false);

  const [openMenuId, setOpenMenuId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // fetch keys
  useEffect(() => {
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

  // delete key (STRING id)
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

      // refresh list
      setApiKeys((prev) => [data, ...prev]);

      setShowCreate(false);
      setKeyName("");
    } catch (err) {
      alert(err?.detail || "Failed to create API key");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen w-full px-4 sm:px-6 lg:px-10 py-6 text-[#e3e3e3]">

      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-2xl font-semibold">API Keys</h2>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[#2a2a2a] rounded-lg">
            <FileText size={18} />
            API quickstart
          </button>

          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 bg-[#2d2e30] border border-[#3c4043] px-4 py-2 rounded-full text-sm hover:bg-[#3c4043]"
          >
            <Plus size={18} />
            Create API key
          </button>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-4 px-4 py-3 text-xs text-[#9aa0a6] border-b border-[#2a2a2a]">
        <div>Key</div>
        <div>Project</div>
        <div>Created</div>
        <div>Status</div>
      </div>

      {/* Table Body */}
      {loadingKeys ? (
        <div className="px-4 py-6 text-sm text-[#9aa0a6]">Loading...</div>
      ) : apiKeys.length === 0 ? (
        <div className="px-4 py-6 text-sm text-[#9aa0a6]">No API keys</div>
      ) : (
        apiKeys.map((key) => (
          <div
            key={key.id}
            className="grid grid-cols-4 px-4 py-6 text-sm border-b border-[#2a2a2a] hover:bg-[#1a1a1a]"
            onClick={() => setOpenMenuId(null)}
          >
            {/* Key */}
            <div className="text-[#8ab4f8]">
              ••••{key.id.slice(-6)}
              <br />
              <span className="text-xs text-[#9aa0a6]">{key.name}</span>
            </div>

            {/* Project */}
            <div className="text-[#9aa0a6]">Default project</div>

            {/* Created */}
            <div className="text-[#9aa0a6]">
              {new Date(key.created).toLocaleDateString()}
            </div>

            {/* Status + Menu */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#9aa0a6]">
                {key.revoked ? "Revoked" : "Active"}
              </span>

              <div className="relative">
                <MoreVertical
                  size={16}
                  className="cursor-pointer hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(openMenuId === key.id ? null : key.id);
                  }}
                />

                {openMenuId === key.id && (
                  <div
                    className="absolute right-0 mt-2 w-32 bg-[#1e1f20] border border-[#3c4043] rounded-lg shadow-lg z-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      disabled={deletingId === key.id}
                      onClick={() => deleteApiKey(key.id)}
                      className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-[#2d2e30]"
                    >
                      {deletingId === key.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      )}

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#1e1f20] border border-[#3c4043] rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create API key</h3>

            <input
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              placeholder="Key name"
              className="w-full bg-[#0e0e0e] border border-[#3c4043] rounded-lg px-4 py-2 text-sm"
            />

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 text-sm text-[#9aa0a6]"
              >
                Cancel
              </button>

              <button
                disabled={!keyName || creating}
                onClick={createApiKey}
                className="px-5 py-2 bg-[#8ab4f8] text-black rounded-lg text-sm disabled:opacity-50"
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
