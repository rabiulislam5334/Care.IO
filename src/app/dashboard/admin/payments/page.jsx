"use client";
import { useEffect, useState } from "react";
import {
  CreditCard,
  FileText,
  Download, // CSV এর জন্য আইকন
  Search,
  Loader2,
  CheckCircle2,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });
  const itemsPerPage = 7;

  useEffect(() => {
    fetch("/api/admin/payments")
      .then((res) => res.json())
      .then((data) => {
        setPayments(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  // --- 📄 PDF Export Function ---
  const exportPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("CareIO Transaction Report", 14, 15);
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);

      const tableData = filteredPayments.map((p) => [
        p.userName || "Customer",
        p.userEmail || p.email,
        p.transactionId || p._id,
        new Date(p.date || p.updatedAt).toLocaleDateString(),
        `BDT ${p.price || p.amount}`,
      ]);

      autoTable(doc, {
        startY: 30,
        head: [["User", "Email", "TRX ID", "Date", "Amount"]],
        body: tableData,
        theme: "grid",
        headStyles: { fillColor: [37, 99, 235], fontSize: 10 },
      });

      doc.save(`CareIO_Payments_${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error("PDF Error:", error);
    }
  };

  // --- 📊 CSV Export Function ---
  const exportCSV = () => {
    const headers = ["User", "Email", "Transaction ID", "Date", "Amount (BDT)"];
    
    // ডাটা রো তৈরি করা
    const rows = filteredPayments.map(p => [
      `"${p.userName || "Customer"}"`,
      `"${p.userEmail || p.email}"`,
      `"${p.transactionId || p._id}"`,
      `"${new Date(p.date || p.updatedAt).toLocaleDateString()}"`,
      p.price || p.amount
    ]);

    // CSV স্ট্রিং তৈরি
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    
    // ডাউনলোড লিংক তৈরি
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `CareIO_Transactions_${new Date().getTime()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredPayments = payments
    .filter((p) =>
      (p.userEmail?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (p.transactionId?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (p.userName?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const currentData = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading)
    return (
      <div className="h-96 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-blue-600 mb-2" size={40} />
        <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">Loading Data...</p>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <CreditCard className="text-blue-600" size={32} /> Payments
          </h1>
          <p className="text-slate-500 font-medium">Manage all transaction logs.</p>
        </div>
        
        <div className="flex gap-3">
          {/* CSV Button */}
          <button 
            onClick={exportCSV}
            className="flex items-center gap-2 bg-slate-800 text-white px-5 py-2.5 rounded-2xl font-bold text-sm hover:bg-slate-700 transition-all shadow-lg active:scale-95"
          >
            <Download size={18} /> CSV
          </button>
          
          {/* PDF Button */}
          <button 
            onClick={exportPDF}
            className="flex items-center gap-2 bg-rose-600 text-white px-5 py-2.5 rounded-2xl font-bold text-sm hover:bg-rose-700 transition-all shadow-lg active:scale-95"
          >
            <FileText size={18} /> PDF
          </button>
        </div>
      </div>

      {/* Total Stats Card */}
      <div className="bg-blue-700 p-8 rounded-[2.5rem] text-white flex justify-between items-center shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-blue-200 font-bold text-[10px] uppercase tracking-[0.2em] mb-1">Total Net Revenue</p>
          <h2 className="text-4xl font-black">
            ৳ {payments.reduce((acc, curr) => acc + (parseFloat(curr.price || curr.amount) || 0), 0).toLocaleString()}
          </h2>
        </div>
        <div className="bg-white/10 p-5 rounded-3xl backdrop-blur-md border border-white/20 relative z-10">
          <CreditCard size={32} />
        </div>
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Transactions</h3>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input
              type="text"
              placeholder="Search anything..."
              onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl text-xs font-bold border-none focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">User</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 cursor-pointer" onClick={() => requestSort('transactionId')}>TRX ID <ArrowUpDown size={10} className="inline ml-1"/></th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 cursor-pointer" onClick={() => requestSort('date')}>Date <ArrowUpDown size={10} className="inline ml-1"/></th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 cursor-pointer" onClick={() => requestSort('price')}>Amount <ArrowUpDown size={10} className="inline ml-1"/></th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentData.length > 0 ? currentData.map((payment) => (
                <tr key={payment._id} className="hover:bg-slate-50/30 transition-all">
                  <td className="px-8 py-5">
                    <p className="font-bold text-slate-800 text-sm">{payment.userName || "Customer"}</p>
                    <p className="text-[10px] text-slate-400">{payment.userEmail || payment.email}</p>
                  </td>
                  <td className="px-8 py-5">
                    <span className="font-mono text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-500">
                      {payment.transactionId?.substring(0, 10) || payment._id.substring(0, 10)}...
                    </span>
                  </td>
                  <td className="px-8 py-5 text-[11px] text-slate-500 font-bold">
                    {new Date(payment.date || payment.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-5 font-black text-slate-800 text-sm">
                    ৳{payment.price || payment.amount}
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase border border-emerald-100">
                      <CheckCircle2 size={10} /> Success
                    </span>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="5" className="text-center py-10 text-slate-400 font-bold uppercase text-xs">No Results Found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Page {currentPage} of {totalPages || 1}</p>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-2 rounded-xl bg-white border border-slate-200 disabled:opacity-30 hover:bg-slate-50 active:scale-90"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-2 rounded-xl bg-white border border-slate-200 disabled:opacity-30 hover:bg-slate-50 active:scale-90"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}