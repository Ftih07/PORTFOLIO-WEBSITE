"use client";
import React, { useState } from "react";
import Image from "next/image";
import phone from "../assets/phone.png";
import mail from "../assets/mail.png";

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        form.reset();
        setShowModal(true);
      } else {
        alert("Gagal mengirim pesan.");
      }
    } catch (err) {
      console.error("Fetch failed:", err);
      alert("Terjadi kesalahan saat mengirim pesan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="max-w-[1000px] mx-auto flex flex-col lg:flex-row text-white/70 p-8 rounded-lg space-y-8 lg:space-y-0 lg:space-x-8"
      id="contact"
    >
      {/* Kontak Info */}
      <div className="flex justify-center items-center">
        <ul className="space-y-4">
          {/* WhatsApp */}
          <li className="flex items-center group cursor-pointer">
            <Image src={phone} alt="phone" className="h-[110px] w-auto mr-6" />
            <a
              href="https://wa.me/6281226110988"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl text-white/80 group-hover:text-orange-400 transition"
            >
              +62 812-3612-2611-0988
            </a>
          </li>

          {/* Email */}
          <li className="flex items-center group cursor-pointer">
            <Image src={mail} alt="mail" className="h-[110px] w-auto mr-6" />
            <a
              href="mailto:naufalfathi37@gmail.com"
              className="text-xl text-white/80 group-hover:text-orange-400 transition"
            >
              naufalfathi37@gmail.com
            </a>
          </li>
        </ul>
      </div>

      {/* Form */}
      <div className="bg-white/10 p-6 rounded-xl max-w-[550px] relative">
        <h2 className="text-5xl font-bold text-orange-400 mb-4">
          Let&apos;s connect
        </h2>
        <p className="text-white/70 mb-6">
          Send me a message and let&apos;s schedule a call!
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              name="first_name"
              className="bg-black/70 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="First Name"
              required
            />
            <input
              type="text"
              name="last_name"
              className="bg-black/70 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Last Name"
              required
            />
            <input
              type="email"
              name="email"
              className="bg-black/70 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Email"
              required
            />
            <input
              type="phone"
              name="phone"
              className="bg-black/70 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Phone"
            />
          </div>
          <textarea
            name="message"
            className="bg-black/70 w-full rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Your Message"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center gap-2 bg-orange-500 text-white px-6 py-3 font-semibold text-xl rounded-xl transition ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:bg-orange-600"
            }`}
          >
            {loading ? (
              <>
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
                Sending...
              </>
            ) : (
              "Send Message"
            )}
          </button>
        </form>

        {/* Modal Sukses - Enhanced Design */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-md w-full transform animate-[scale-in_0.3s_ease-out]">
              {/* Header dengan Gradient */}
              <div className="bg-gradient-to-r from-orange-600 to-orange-800 p-6 text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-4xl">🎉</span>
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Message Sent Successfully!
                </h3>
              </div>

              {/* Content */}
              <div className="p-8 text-center">
                <p className="text-gray-700 text-base leading-relaxed mb-6">
                  Thank you for reaching out! I&apos;ve received your message
                  and will get back to you as soon as possible.
                </p>

                {/* Info Box */}
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
                  <p className="text-sm text-orange-800">
                    <strong>📧 Check your email</strong>
                    <br />
                    <span className="text-orange-600">
                      A confirmation has been sent to your inbox
                    </span>
                  </p>
                </div>

                {/* Expected Response Time */}
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-6">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Typical response time: 24-48 hours</span>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full bg-gradient-to-r from-orange-600 to-orange-800 text-white px-6 py-3 rounded-xl hover:from-orange-700 hover:to-orange-900 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;
