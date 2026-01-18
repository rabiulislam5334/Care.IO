"use client";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
    e.target.reset();
  };

  return (
    <div className="py-24 bg-white">
      <div className="w-11/12 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-20">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-5xl font-black text-slate-900 mb-8">
              Get in <span className="text-blue-600">Touch</span>
            </h2>
            <p className="text-slate-500 text-lg mb-12 font-medium leading-relaxed">
              Have questions about our services or need help finding a
              caretaker? Our team is here to support you 24/7.
            </p>

            <div className="space-y-8">
              {[
                { icon: <Phone />, label: "Call Us", val: "+880 1234 567 890" },
                { icon: <Mail />, label: "Email Us", val: "support@care.io" },
                {
                  icon: <MapPin />,
                  label: "Visit Us",
                  val: "Gulshan 2, Dhaka, Bangladesh",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      {item.label}
                    </p>
                    <p className="text-xl font-bold text-slate-800">
                      {item.val}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 shadow-sm"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  className="p-4 rounded-2xl border-none outline-none focus:ring-4 focus:ring-blue-100 w-full transition-all"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  className="p-4 rounded-2xl border-none outline-none focus:ring-4 focus:ring-blue-100 w-full transition-all"
                />
              </div>
              <input
                type="text"
                placeholder="Subject"
                className="p-4 rounded-2xl border-none outline-none focus:ring-4 focus:ring-blue-100 w-full transition-all"
              />
              <textarea
                rows="4"
                placeholder="How can we help you?"
                required
                className="p-4 rounded-2xl border-none outline-none focus:ring-4 focus:ring-blue-100 w-full transition-all"
              ></textarea>

              <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95">
                <Send size={20} /> Send Message
              </button>
            </form>
          </motion.div>
        </div>

        {/* Google Maps Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full h-[450px] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-slate-50"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.050541334645!2d90.4106673!3d23.790119!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c70977227d8d%3A0x6331189196b65349!2sGulshan%202%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1715421234567!5m2!1sen!2sbd"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </motion.div>
      </div>
    </div>
  );
}
