export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-20 pb-10">
      <div className="w-11/12 mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-slate-800 pb-16">
        {/* Branding */}
        <div className="col-span-1 md:col-span-2">
          <h2 className="text-3xl font-black text-white mb-6">Care.IO</h2>
          <p className="max-w-sm leading-relaxed opacity-70">
            Making professional caregiving accessible and affordable for
            families across Bangladesh. Trusted by 5000+ happy clients.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">
            Company
          </h4>
          <ul className="space-y-4 text-sm">
            <li>
              <a href="#" className="hover:text-blue-400 transition-all">
                Our Story
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-400 transition-all">
                Careers
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-400 transition-all">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">
            Support
          </h4>
          <ul className="space-y-4 text-sm">
            <li>Email: help@care.io</li>
            <li>Phone: +880 1234 567 890</li>
            <li>Address: Dhaka, Bangladesh</li>
          </ul>
        </div>
      </div>

      <div className="w-11/12 mx-auto mt-10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-50 font-medium">
        <p>© 2026 Care.IO. All rights reserved.</p>
        <div className="flex gap-6">
          <span>Facebook</span>
          <span>Twitter</span>
          <span>LinkedIn</span>
        </div>
      </div>
    </footer>
  );
}
