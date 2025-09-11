import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-black text-gray-400 mt-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
                    <div>
                        <h3 className="font-bold text-white uppercase mb-4">Shop</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white">Apparel</a></li>
                            <li><a href="#" className="hover:text-white">Collectibles</a></li>
                            <li><a href="#" className="hover:text-white">New Arrivals</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-white uppercase mb-4">Information</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white">About Us</a></li>
                            <li><a href="#" className="hover:text-white">Contact</a></li>
                            <li><a href="#" className="hover:text-white">Shipping Policy</a></li>
                            <li><a href="#" className="hover:text-white">Refunds</a></li>
                        </ul>
                    </div>
                    <div className="col-span-2 md:col-span-2">
                         <h3 className="font-bold text-white uppercase mb-4">Join The Fight Club</h3>
                         <p className="text-sm mb-4">Get exclusive updates on new drops and special offers.</p>
                         <form className="flex">
                            <input type="email" placeholder="Enter your email" className="bg-gray-800 border border-gray-700 rounded-l-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-red-500" />
                            <button type="submit" className="bg-red-600 text-white font-bold px-6 py-2 rounded-r-md hover:bg-red-700">Subscribe</button>
                         </form>
                    </div>
                </div>
                <div className="mt-10 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center text-sm">
                    <p>&copy; {new Date().getFullYear()} The Natural Brand. All Rights Reserved.</p>
                    <div className="flex space-x-4 mt-4 sm:mt-0">
                        <a href="#" aria-label="Instagram" className="hover:text-white"><i className="fa-brands fa-instagram fa-lg"></i></a>
                        <a href="#" aria-label="Twitter" className="hover:text-white"><i className="fa-brands fa-x-twitter fa-lg"></i></a>
                        <a href="#" aria-label="Facebook" className="hover:text-white"><i className="fa-brands fa-facebook fa-lg"></i></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};