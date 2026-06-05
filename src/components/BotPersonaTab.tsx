"use client";

import React, { useState } from 'react';
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Plus, Trash2, Bot, Library, FileText, Download } from 'lucide-react';
import { cn } from "@/lib/utils";

// Cấu trúc Data Bộ Kịch Bản Mẫu chuyên ngành Ecommerce
const EC_TEMPLATE = [
  { matchType: "FUZZY", trigger: "xin địa chỉ, shop ở đâu, địa chỉ shop, cửa hàng ở đâu", script: "Dạ, cửa hàng tụi mình ngụ tại [NHẬP_ĐỊA_CHỈ], mở cửa từ 8h đến 22h hàng ngày ạ! Hoan nghênh bạn ghé chơi." },
  { matchType: "FUZZY", trigger: "shop bán gì, cửa hàng bán gì, sản phẩm gì, kinh doanh gì", script: "Dạ bên mình chuyên cung cấp các mặt hàng [NHẬP_NGÀNH_HÀNG] chất lượng cao ạ. Bạn đang quan tâm dòng sản phẩm cụ thể nào không?" },
  { matchType: "FUZZY", trigger: "tính ship sao, freeship không, phí vận chuyển", script: "Dạ, phí vận chuyển đồng giá [NHẬP_PHÍ]đ. Đối với đơn hàng trên [NHẬP_GIÁ]đ sẽ được bên em Freeship toàn quốc nhé ạ!" },
  { matchType: "FUZZY", trigger: "hủy đơn, không mua nữa, hủy giúp", script: "Dạ, hệ thống đã ghi nhận yêu cầu kiểm tra hủy đơn của bạn. Vui lòng đợi chốc lát để nhân viên CSKH trực tiếp hỗ trợ nhé!" },
  { matchType: "KEYWORD", trigger: "bao lâu nhận được, chừng nào giao, khi nào tới", script: "Dạ, thời gian giao hàng dự kiến là từ 2-4 ngày tùy khu vực ạ. Đơn vị vận chuyển sẽ chủ động gọi bạn trước khi giao hàng tới tay nha." },
  { matchType: "FUZZY", trigger: "được kiểm hàng không, xem hàng, bóc hàng", script: "Dạ có ạ! Shop mình hỗ trợ khách hàng được kiểm tra, đồng kiểm sản phẩm với shipper thoải mái trước khi thanh toán nên bạn cứ yên tâm ạ." },
  { matchType: "KEYWORD", trigger: "gặp nhân viên, người thật tư vấn, gọi tư vấn", script: "Dạ, hệ thống AI tự động sẽ nhường quầy lại cho Nhân viên (CSKH). Bạn vui lòng đợi mình chuyển máy, nhân viên sẽ tiếp nối câu chuyện ngay thôi ạ!" },
  { matchType: "KEYWORD", trigger: "cám ơn, ok shop, tks shop, okie, okela", script: "Dạ vâng, cảm ơn bạn đã quan tâm đến hệ thống của tụi mình! Chúc bạn một ngày tràn đầy năng lượng nha 💕" },
];

const FASHION_TEMPLATE = [
  { matchType: "FUZZY", trigger: "tư vấn size, chọn size, size gì, mặc rộng không", script: "Dạ, để tư vấn size chuẩn nhất, bạn cho mình xin Chiều cao và Cân nặng của bạn nhé. Form bên mình là form [NHẬP_FORM] ạ!" },
  { matchType: "KEYWORD", trigger: "có được đổi trả không, đổi size, đổi màu", script: "Dạ bên em hỗ trợ đổi size/mẫu trong vòng [NHẬP_NGÀY] ngày nếu còn nguyên tem mác ạ. Phí ship đổi hàng khách hỗ trợ giúp shop nhé!" },
];

const TECH_TEMPLATE = [
  { matchType: "FUZZY", trigger: "bảo hành thế nào, chính sách bảo hành, hỏng thì sao", script: "Dạ, sản phẩm này được bảo hành chính hãng [NHẬP_THÁNG] tháng. Lỗi 1 đổi 1 trong [NHẬP_NGÀY] ngày đầu nếu có lỗi nhà sản xuất ạ!" },
  { matchType: "KEYWORD", trigger: "có sẵn máy không, qua xem máy, tình trạng máy", script: "Dạ, máy đang có sẵn tại cửa hàng ạ. Bạn có thể ghé qua trải nghiệm máy trực tiếp tại [NHẬP_ĐỊA_CHỈ] nha!" },
];

export function BotPersonaTab({ data, onChange, onSave }: { data: any, onChange: (d: any) => void, onSave: () => void }) {
  if (!data) return null;

  const handleAddScenario = () => {
    const sc = [...(data.scenarios || []), { trigger: "", matchType: "FUZZY", script: "" }];
    onChange({ ...data, scenarios: sc });
  };

  const handleUpdateScenario = (index: number, field: string, value: string) => {
    const sc = [...(data.scenarios || [])];
    sc[index][field] = value;
    onChange({ ...data, scenarios: sc });
  };

  const handleDeleteScenario = (index: number) => {
    if(window.confirm("Xóa rule cấm này? Gỡ bỏ đồng nghĩa việc Token AI sẽ nhúng vào tin nhắn này!")) {
      const sc = [...(data.scenarios || [])].filter((_, i) => i !== index);
      onChange({ ...data, scenarios: sc });
    }
  };

  const applyTemplate = (type: string) => {
    let template = EC_TEMPLATE;
    let label = "Bán Lẻ";
    if (type === 'fashion') { template = FASHION_TEMPLATE; label = "Thời Trang"; }
    if (type === 'tech') { template = TECH_TEMPLATE; label = "Công Nghệ"; }

    if(window.confirm(`Bộ mẫu này sẽ Chèn Thêm các quy luật chặn AI tối ưu ngành ${label}. Bạn đồng ý không?`)) {
      const existing = data.scenarios || [];
      onChange({ ...data, scenarios: [...existing, ...template], enableDualModel: true });
      alert("Đã Import Thư Viện Mẫu thành công! Hãy sửa lại các thông số trong dấu [NGOẶC_VUÔNG] và bật Saver Mode nhé!");
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-br from-indigo-600/10 to-transparent border border-indigo-500/20 p-8 rounded-[2.5rem] space-y-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-500/20">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">Bot Persona & Rule Engine</h3>
            <p className="text-sm text-neutral-400">Định hình tính cách AI & Xây dựng mạng lưới Proxy bắt Keyword tiết kiệm chi phí.</p>
          </div>
        </div>

        {/* Identity Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-black/20 border border-white/5 rounded-3xl">
          <div className="space-y-2">
            <label className="text-xs font-bold text-indigo-400 uppercase">Tên Bot</label>
            <input 
              value={data.botName || ""}
              onChange={e => onChange({...data, botName: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:border-indigo-500 transition-colors focus:outline-none"
              placeholder="VD: Vera Assistant"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-indigo-400 uppercase">Khẩu khí / Tone (Tùy chọn)</label>
            <input 
              value={data.tone || ""}
              onChange={e => onChange({...data, tone: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:border-indigo-500 transition-colors focus:outline-none"
              placeholder="VD: Nhiệt tình, genZ, chuyên nghiệp"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-bold text-indigo-400 uppercase">Tiểu sử / Nhiệm vụ cốt lõi (System Persona)</label>
            <textarea 
              value={data.persona || ""}
              onChange={e => onChange({...data, persona: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:border-indigo-500 transition-colors focus:outline-none h-24"
              placeholder="Bối cảnh hoạt động của Bot. Lời dặn dò cho AI Chatbot..."
            />
          </div>
        </div>

        <hr className="border-white/10" />

        {/* Scenarios Rules */}
        <div className="space-y-6">
          <div className="flex justify-between items-center group">
            <div>
               <h4 className="text-lg font-bold text-white flex items-center gap-2">
                 Proxy Rules (Chặn Tiêu Hao Token LLM)
               </h4>
               <p className="text-xs text-neutral-500">Các quy tắc kiểm tra khớp chuỗi và phản hồi ngay lập tức, bỏ qua Pipeline của AI Model.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 gap-1">
                <button 
                  onClick={() => applyTemplate('retail')} 
                  className="px-3 py-1.5 hover:bg-white/5 text-neutral-400 hover:text-white rounded-lg text-[10px] font-bold transition-all"
                >
                  Mẫu Bán Lẻ
                </button>
                <button 
                  onClick={() => applyTemplate('fashion')} 
                  className="px-3 py-1.5 hover:bg-white/5 text-neutral-400 hover:text-white rounded-lg text-[10px] font-bold transition-all"
                >
                  Mẫu Thời Trang
                </button>
                <button 
                  onClick={() => applyTemplate('tech')} 
                  className="px-3 py-1.5 hover:bg-white/5 text-neutral-400 hover:text-white rounded-lg text-[10px] font-bold transition-all"
                >
                  Mẫu Tech
                </button>
              </div>
              <button 
                onClick={handleAddScenario} 
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
              >
                <Plus className="h-4 w-4"/> Thêm Rule Thủ Công
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {(data.scenarios || []).length === 0 ? (
               <div className="text-center py-12 bg-black/20 border border-dashed border-white/10 rounded-[2rem]">
                 <p className="text-sm text-neutral-600">Chưa có Rule chặn Bot nào. Hãy nhấn [Thêm Rule Mới] ở phía trên để bắt đầu tối ưu AI Proxy!</p>
               </div>
            ) : (data.scenarios || []).map((sc: any, idx: number) => (
              <div key={idx} className="bg-black/60 border border-white/10 p-5 rounded-3xl flex flex-col md:flex-row gap-4 relative group hover:border-indigo-500/50 transition-colors">
                
                {/* Index tag */}
                <div className="absolute -top-3 -left-3 h-8 w-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-black text-sm border-4 border-[#09090b]">
                   {idx + 1}
                </div>

                <div className="flex-1 space-y-4 mt-2">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="md:w-1/4 space-y-1">
                      <label className="text-[10px] text-neutral-500 font-bold uppercase">Phương thức (MatchType)</label>
                      <select 
                        value={sc.matchType || "FUZZY"}
                        onChange={e => handleUpdateScenario(idx, "matchType", e.target.value)}
                        className="w-full bg-white/5 border border-white/5 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500/50"
                      >
                        <option className="bg-neutral-900" value="FUZZY">Fuzzy (~80% giống)</option>
                        <option className="bg-neutral-900" value="KEYWORD">Keyword (Gồm cụm)</option>
                        <option className="bg-neutral-900" value="EXACT">Exact (Tuyệt Đối)</option>
                      </select>
                    </div>
                    <div className="flex-1 space-y-1">
                      <label className="text-[10px] text-indigo-400 font-bold uppercase">Từ Khóa Kích Hoạt (Triggers - Cách nhau dấu phẩy)</label>
                      <input 
                        value={sc.trigger || ""}
                        onChange={e => handleUpdateScenario(idx, "trigger", e.target.value)}
                        className="w-full bg-white/5 border border-white/5 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500/50"
                        placeholder="VD: xin địa chỉ, vị trí kho, ở đâu vậy"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-green-400 font-bold uppercase">Kịch Bản Phản Hồi (Nội dung Bot Rep)</label>
                    <textarea 
                      value={sc.script || ""}
                      onChange={e => handleUpdateScenario(idx, "script", e.target.value)}
                      className="w-full bg-white/5 border border-white/5 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-500/50 h-20"
                      placeholder="Dạ shop ở số 123 Lê Lợi..."
                    />
                  </div>
                </div>
                <div className="md:w-16 flex items-center justify-center border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0">
                  <button onClick={() => handleDeleteScenario(idx)} className="p-3 bg-white/5 text-neutral-600 rounded-xl hover:bg-red-500/20 hover:text-red-500 hover:scale-105 transition-all outline-none">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <ShimmerButton onClick={onSave}>Lưu Cấu Hình Persona & Kịch Bản Rules</ShimmerButton>
      </div>
    </div>
  );
}
