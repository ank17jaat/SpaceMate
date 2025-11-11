export function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">SpaceMate</h3>
            <p className="text-slate-300 text-sm">
              Your trusted platform for finding the perfect office spaces.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><a href="#" className="hover:text-white transition">About Us</a></li>
              <li><a href="#" className="hover:text-white transition">Blog</a></li>
              <li><a href="#" className="hover:text-white transition">Careers</a></li>
              <li><a href="#" className="hover:text-white transition">Press</a></li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><a href="#" className="hover:text-white transition">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition">FAQs</a></li>
              <li><a href="#" className="hover:text-white transition">Community</a></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Disclaimer</a></li>
            </ul>
          </div>
        </div>

        {/* Team Members Section */}
        <div className="border-t border-slate-700 py-8 mb-8">
          <h4 className="font-semibold mb-6 text-lg">Our Team</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Member 1 */}
            <div className="text-center">
              <p className="font-semibold mb-2">Member 1</p>
              <a
                href="https://linkedin.com/in/member1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition text-sm"
              >
                LinkedIn Profile →
              </a>
            </div>

            {/* Member 2 */}
            <div className="text-center">
              <p className="font-semibold mb-2">Member 2</p>
              <a
                href="https://linkedin.com/in/member2"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition text-sm"
              >
                LinkedIn Profile →
              </a>
            </div>

            {/* Member 3 */}
            <div className="text-center">
              <p className="font-semibold mb-2">Member 3</p>
              <a
                href="https://linkedin.com/in/member3"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition text-sm"
              >
                LinkedIn Profile →
              </a>
            </div>

            {/* Member 4 */}
            <div className="text-center">
              <p className="font-semibold mb-2">Member 4</p>
              <a
                href="https://linkedin.com/in/member4"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition text-sm"
              >
                LinkedIn Profile →
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 pt-8">
          {/* Footer Bottom */}
          <div className="flex flex-col md:flex-row justify-center items-center">
            <p className="text-sm text-slate-400 mb-4 md:mb-0">
              &copy; 2025 SpaceMate. All rights reserved.
            </p>
            {/* <div className="flex gap-6">
              <a href="" className="text-slate-400 hover:text-white transition">LinkedIn</a>
              <a href="https://github.com/ank17jaat" className="text-slate-400 hover:text-white transition">GitHub</a>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
}
