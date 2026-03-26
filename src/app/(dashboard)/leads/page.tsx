"use client";

import React, { useEffect, useState } from "react";
import { 
  Phone, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ChevronRight
} from "lucide-react";
import { fetchLeads, updateLeadStatus } from "@/lib/api";
import { cn } from "@/lib/utils";

type Lead = {
  id: string;
  customerName: string;
  phone: string;
  status: "NEW" | "CALLED" | "CLOSED";
  createdAt: string;
  platform?: string; // Giả định từ backend
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const shopId = "test_shop"; // Thực tế lấy từ Auth/Context

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      const data = await fetchLeads(shopId);
      setLeads(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateLeadStatus(id, newStatus);
      setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus as any } : l));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const filteredLeads = leads.filter(l => 
    l.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.phone?.includes(searchTerm)
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "NEW": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "CALLED": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "CLOSED": return "bg-green-500/10 text-green-400 border-green-500/20";
      default: return "bg-neutral-500/10 text-neutral-400 border-neutral-500/20";
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads Management</h1>
          <p className="text-neutral-400">Quản lý và cập nhật trạng thái các khách hàng tiềm năng.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
             <input 
               type="text" 
               placeholder="Search name or phone..."
               className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-sm w-64"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
        </div>
      </div>

      <div className="bg-black/40 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/5">
              <th className="px-6 py-4 text-sm font-semibold text-neutral-400">Customer</th>
              <th className="px-6 py-4 text-sm font-semibold text-neutral-400">Phone Number</th>
              <th className="px-6 py-4 text-sm font-semibold text-neutral-400">Platform</th>
              <th className="px-6 py-4 text-sm font-semibold text-neutral-400">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-neutral-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={5} className="px-6 py-8 bg-white/2" />
                </tr>
              ))
            ) : filteredLeads.length > 0 ? (
              filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-neutral-700 to-neutral-900 flex items-center justify-center text-xs font-bold border border-white/10 text-white">
                        {lead.customerName?.charAt(0) || "U"}
                      </div>
                      <div>
                        <div className="font-medium text-white">{lead.customerName || "Unknown User"}</div>
                        <div className="text-xs text-neutral-500 font-mono">ID: {lead.id.slice(-6)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-neutral-300 font-medium">
                      <Phone className="h-3.5 w-3.5 text-neutral-500" />
                      {lead.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs px-2 py-1 rounded-md bg-white/5 border border-white/10 text-neutral-400 uppercase font-bold tracking-wider">
                      Messenger
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                      className={cn(
                        "text-xs font-bold py-1.5 px-3 rounded-full border cursor-pointer outline-none transition-all",
                        getStatusStyle(lead.status)
                      )}
                    >
                      <option value="NEW">🔵 NEW</option>
                      <option value="CALLED">🟡 CALLED</option>
                      <option value="CLOSED">🟢 CLOSED</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-neutral-500 hover:text-white">
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                  No leads found. AI is still hunting... 🕵️‍♂️
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
