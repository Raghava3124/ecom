import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaWhatsapp, FaTelegram } from "react-icons/fa";

const Contact = () => {
    return (
        <div className="flex row-[450px]">
            {/* Left Side - Image (fixed height, 50% width) */}
            <div className="w-1/2">
                <img 
                    src="https://hdqwalls.com/wallpapers/2018-dodge-challenger-srt-hellcat-widebody-front-1z.jpg" 
                    alt="Contact Us" 
                    className="w-full h-full object-cover"
                    height={450}
                />
            </div>

            {/* Right Side - Contact Info */}
            <div className="w-1/2 flex flex-col justify-center p-10 bg-gray-100">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Contact Us</h2>

                <div className="space-y-4">
                    <p className="flex items-center text-lg text-gray-700">
                        <FaEnvelope className="text-blue-500 mr-3" /> raghavindana@gmail.com
                    </p>

                    <p className="flex items-center text-lg text-gray-700">
                        <FaPhone className="text-green-500 mr-3" /> +91 63000 73279
                    </p>

                    <p className="flex items-center text-lg text-gray-700">
                        <FaMapMarkerAlt className="text-red-500 mr-3" /> Tadepalligudem,Andhra Pradesh
                    </p>

                    <p className="flex items-center text-lg text-gray-700">
                        <FaWhatsapp className="text-green-500 mr-3" /> +91 63000 73279
                    </p>

                    <p className="flex items-center text-lg text-gray-700">
                        <FaTelegram className="text-blue-400 mr-3" /> @Huriccanee
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Contact;
