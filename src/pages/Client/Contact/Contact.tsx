import React, { useState } from "react";
import {
  Phone,
  Mail,
  CheckCircle2,
  Send,
  User,
  MapPin,
  Building2,
  Layers,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";

interface ContactFormData {
  fullName: string;
  phoneNumber: string;
  courtName: string;
  courtAddress: string;
  scale: string;
  message: string;
}

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: "",
    phoneNumber: "",
    courtName: "",
    courtAddress: "",
    scale: "Dưới 5 thảm",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Giả lập gửi API
    setTimeout(() => {
      alert(
        "Thông tin đã được gửi tới Admin! Chúng tôi sẽ liên hệ bạn sớm nhất."
      );
      setIsSubmitting(false);
    }, 1500);
  };

  const steps = [
    {
      title: "Gửi Thông Tin",
      desc: "Điền form đăng ký với các thông tin cơ bản về sân cầu lông của bạn.",
      icon: <Send className="w-6 h-6 text-blue-600" />,
      color: "bg-blue-100",
    },
    {
      title: "Admin Xác Thực",
      desc: "Admin sẽ kiểm tra thông tin và liên hệ qua Zalo/SĐT để xác nhận chính chủ.",
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      color: "bg-emerald-100",
    },
    {
      title: "Nhận Tài Khoản",
      desc: "Hệ thống gửi thông tin đăng nhập và hướng dẫn sử dụng qua tin nhắn.",
      icon: <CheckCircle2 className="w-6 h-6 text-orange-600" />,
      color: "bg-orange-100",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900">
      {/* Hero Section */}
      <section className="bg-indigo-700 py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            Đăng Ký Tài Khoản Quản Lý Sân
          </h1>
          <p className="text-indigo-100 text-lg max-w-2xl mx-auto">
            Gia nhập hệ thống quản lý chuyên nghiệp để tối ưu doanh thu và vận
            hành sân cầu lông của bạn một cách dễ dàng.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 -mt-10 pb-20">
        {/* Step Guide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start space-x-4"
            >
              <div className={`${step.color} p-3 rounded-xl`}>{step.icon}</div>
              <div>
                <h3 className="font-bold text-slate-800 tracking-tight">
                  Bước {idx + 1}: {step.title}
                </h3>
                <p className="text-sm text-slate-500 mt-1">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Contact Info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold mb-6 text-slate-800">
                Hỗ trợ trực tiếp
              </h2>

              <div className="space-y-6">
                <a href="tel:0901234567" className="flex items-center group">
                  <div className="bg-slate-50 p-3 rounded-full mr-4 group-hover:bg-indigo-50 transition-colors">
                    <Phone className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Hotline / Zalo
                    </p>
                    <p className="font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">
                      0901.234.567
                    </p>
                  </div>
                </a>

                <div className="flex items-center">
                  <div className="bg-slate-50 p-3 rounded-full mr-4">
                    <Mail className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Email
                    </p>
                    <p className="font-semibold text-slate-700">
                      admin@badminton.vn
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 p-5 bg-indigo-50 rounded-2xl border border-indigo-100">
                <p className="text-sm text-indigo-800 leading-relaxed italic">
                  "Chúng tôi cam kết bảo mật thông tin sân và dữ liệu khách hàng
                  của bạn 100%."
                </p>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 md:p-10 border border-slate-100">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1 flex items-center">
                      <User className="w-4 h-4 mr-2 text-indigo-500" /> Họ tên
                      người đại diện
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
                      placeholder="Nguyễn Văn A"
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1 flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-indigo-500" /> Số điện
                      thoại (Zalo)
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
                      placeholder="09xx xxx xxx"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phoneNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Court Name */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1 flex items-center">
                      <Building2 className="w-4 h-4 mr-2 text-indigo-500" /> Tên
                      sân cầu lông
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
                      placeholder="Sân cầu lông ABC..."
                      onChange={(e) =>
                        setFormData({ ...formData, courtName: e.target.value })
                      }
                    />
                  </div>

                  {/* Scale */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1 flex items-center">
                      <Layers className="w-4 h-4 mr-2 text-indigo-500" /> Quy mô
                    </label>
                    <select
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none bg-white"
                      onChange={(e) =>
                        setFormData({ ...formData, scale: e.target.value })
                      }
                    >
                      <option>Dưới 5 thảm</option>
                      <option>5 - 10 thảm</option>
                      <option>Trên 10 thảm</option>
                    </select>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1 flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-indigo-500" /> Địa chỉ
                    chi tiết
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
                    placeholder="Số nhà, đường, quận/huyện, tỉnh/thành..."
                    onChange={(e) =>
                      setFormData({ ...formData, courtAddress: e.target.value })
                    }
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1 flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2 text-indigo-500" />{" "}
                    Ghi chú thêm
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
                    placeholder="Bạn có yêu cầu đặc biệt nào không?"
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all transform flex items-center justify-center space-x-2
                    ${
                      isSubmitting
                        ? "bg-indigo-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-1 active:scale-[0.98] shadow-indigo-200"
                    }`}
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">Đang gửi thông tin...</span>
                  ) : (
                    <>
                      <span>GỬI YÊU CẦU CẤP TÀI KHOẢN</span>
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactPage;
