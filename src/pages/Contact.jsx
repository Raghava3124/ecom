import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaTelegram
} from "react-icons/fa";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const Contact = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 px-4 py-10 space-y-12">

     {/* Banner Image */}
{/* <div className="w-full max-w-6xl h-[600px] overflow-hidden rounded-xl shadow-lg bg-white flex items-center justify-center">
  <img
    src="/images/banner.png"
    alt="Shop Banner"
    className="object-contain"
    style={{
      height: "600px",
      width: "400px",
      display: "block",
      margin: "0 auto"
    }}
  />
</div> */}
<div className="w-full max-w-6xl overflow-hidden rounded-xl shadow-lg bg-white flex items-center justify-center">
  <img
    src="/images/banner.png"
    alt="Shop Banner"
    className="object-contain"
    style={{
      height: "600px",
      width: "400px",
      display: "block",
      margin: "0 auto"
    }}
  />
</div>





      {/* Contact Info */}
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl p-10" data-aos="fade-up">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">Contact Us</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-lg text-gray-700">
          <div className="flex items-center space-x-4 hover:bg-gray-100 p-4 rounded-md transition">
            <FaEnvelope className="text-blue-500 text-2xl" />
            <span>raghavindana@gmail.com</span>
          </div>
          <div className="flex items-center space-x-4 hover:bg-gray-100 p-4 rounded-md transition">
            <FaPhone className="text-green-500 text-2xl" />
            <span>+91 63000 73279</span>
          </div>
          <div className="flex items-center space-x-4 hover:bg-gray-100 p-4 rounded-md transition">
            <FaMapMarkerAlt className="text-red-500 text-2xl" />
            <span>Tadepalligudem, Andhra Pradesh</span>
          </div>
          <div className="flex items-center space-x-4 hover:bg-gray-100 p-4 rounded-md transition">
            <FaWhatsapp className="text-green-500 text-2xl" />
            <span>+91 63000 73279</span>
          </div>
          <div className="flex items-center space-x-4 hover:bg-gray-100 p-4 rounded-md transition">
            <FaTelegram className="text-blue-400 text-2xl" />
            <span>@Huriccanee</span>
          </div>
        </div>
      </div>

      {/* Send a Message Form */}
      {/* <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl p-10" data-aos="fade-up">
        <h3 className="text-3xl font-semibold mb-6 text-gray-800 text-center">Send Us a Message</h3>
        <form className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Your Name"
              className="border border-gray-300 rounded-md px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              className="border border-gray-300 rounded-md px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <textarea
            rows="5"
            placeholder="Your Message"
            className="border border-gray-300 rounded-md px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
          >
            Send Message
          </button>
        </form>
      </div> */}

      {/* Map Section */}
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl p-6" data-aos="fade-up">
        <h3 className="text-3xl font-semibold mb-4 text-gray-800 text-center">Our Location</h3>
        <div className="w-full h-[300px] rounded-xl overflow-hidden">
          <iframe
  title="Sri Aparna Handloom Sarees Location"
  //src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d395.44429411027903!2d82.31694887000445!3d17.088014168370833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a382c65cda7547d%3A0xdd38665bdfd3babc!2sSri%20Aparna%20Handloom%20Sarees!5e0!3m2!1sen!2sin!4v1751390987655!5m2!1sen!2sin"
  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1906.841507575503!2d82.317333!3d17.088151!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a382c65cda7547d%3A0xdd38665bdfd3babc!2sSri%20Aparna%20Handloom%20Sarees!5e0!3m2!1sen!2sin!4v1752573588460!5m2!1sen!2sin"
  width="100%"
  height="100%"
  allowFullScreen=""
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
  className="w-full h-full border-none rounded-xl"
/>

        </div>
      </div>

      {/* Business Hours */}
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl p-10" data-aos="fade-up">
        <h3 className="text-3xl font-semibold mb-6 text-gray-800 text-center">Business Hours</h3>
        <div className="text-lg text-gray-700 space-y-2 text-center">
          <p>🕒 We are open every day</p>
          <p>⏰ 9:30 AM – 7:30 PM</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
