import React from "react";
import { assets } from "../assets/assets";
import { Fingerprint, CloudUpload, FileDown } from "lucide-react";

const About = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center mt-5 bg-gray-50 px-4 py-16">
      <div className="text-center mb-2">
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-800">
          About Note<span className="text-rose-500">Hub</span>
        </h1>
        <p className="text-sm md:text-base text-slate-500 mt-3 max-w-lg mx-auto">
          NoteHub is a free platform where you can easily upload and download
          important notes. It’s built to help students and professionals share
          study materials, documents, and resources without any cost — simple,
          fast, and accessible from anywhere.
        </p>
      </div>

      <div className="max-w-5xl w-full mx-auto flex flex-col md:flex-row items-center justify-center gap-12 py-10">
        <img
          className="max-w-sm w-full rounded-xl shadow-md h-auto"
          src={assets.about}
          alt="About section illustration"
        />

        <div className="flex flex-col items-start text-left max-w-md">
          <h2 className="text-2xl font-semibold text-gray-800">
            What Makes Our Platform Different
          </h2>
          <p className="text-sm md:text-base text-slate-500 mt-3 leading-relaxed">
            We’ve built a simple, secure, and efficient system that helps users
            upload, manage, and access resources with confidence. Everything you
            need — with none of the clutter.
          </p>

          <div className="flex flex-col gap-8 mt-8">
            {/* Feature 1 */}
            <div className="flex items-center gap-4">
              <div className="size-10 p-2 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center justify-center">
                <Fingerprint className="size-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-base font-medium text-slate-700">
                  Secure Access
                </h3>
                <p className="text-sm text-slate-500">
                  Every upload and download is verified — keeping your data
                  protected from start to finish.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center gap-4">
              <div className="size-10 p-2 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-center">
                <CloudUpload className="size-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-base font-medium text-slate-700">
                  Effortless Uploads
                </h3>
                <p className="text-sm text-slate-500">
                  Drag, drop, or browse — upload notes or documents in seconds
                  without unnecessary steps.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center gap-4">
              <div className="size-10 p-2 bg-rose-50 border border-rose-200 rounded-lg flex items-center justify-center">
                <FileDown className="size-6 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-medium text-slate-700">
                  Quick Downloads
                </h3>
                <p className="text-sm text-slate-500">
                  Download files instantly from verified sources — no waiting,
                  no popups, just one click.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
