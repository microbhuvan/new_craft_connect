import React from "react";

const ShopifyLaunchPage = () => {
  const handleConnect = () => console.log("Connect to Shopify");

  return (
    <div className="bg-[#f8f7f5] dark:bg-[#221810] text-[#181411] dark:text-gray-200 min-h-screen">
      <main className="px-4 sm:px-10 md:px-20 lg:px-40 flex justify-center py-5">
        <div className="w-full max-w-[960px]">
          {/* TopNav */}
          <header className="flex items-center justify-between border-b border-gray-200/80 dark:border-gray-800/80 px-4 sm:px-10 py-3">
            <div className="flex items-center gap-4">
              <div className="size-6 text-[#f16d0e]">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#c)"><path clipRule="evenodd" d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z" fill="currentColor" fillRule="evenodd"/></g><defs><clipPath id="c"><rect width="48" height="48" fill="white"/></clipPath></defs></svg>
              </div>
              <h2 className="text-lg font-bold tracking-[-0.015em]">Craft Connect Hub</h2>
            </div>
            <div className="hidden sm:flex flex-1 justify-end gap-8">
              <div className="flex items-center gap-9">
                <a className="text-sm font-medium text-[#181411] dark:text-gray-300">Dashboard</a>
                <a className="text-sm font-medium text-[#181411] dark:text-gray-300">Help</a>
              </div>
            </div>
          </header>

          {/* Body */}
          <section className="flex flex-col gap-10 sm:gap-12 p-4 pt-8 sm:p-10">
            {/* Heading */}
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-black tracking-[-0.033em]">Launch Your Professional Shop with Shopify</p>
              <p className="mt-3 text-base md:text-lg text-[#8a7260] dark:text-gray-400 max-w-2xl mx-auto">Connect your artisan craft to a global audience in one simple step.</p>
            </div>

            {/* Benefits */}
            <div className="flex flex-col gap-6">
              <h3 className="text-lg font-bold tracking-[-0.015em] px-4 text-center sm:text-left">Key Benefits</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {icon:'verified_user', title:'Secure Payments', desc:'Offer your customers a seamless and secure checkout experience.'},
                  {icon:'inventory_2', title:'Inventory Tracking', desc:'Automatically sync and manage your inventory across platforms.'},
                  {icon:'language', title:'Global Reach', desc:'Sell your unique creations to customers all over the world.'},
                  {icon:'storefront', title:'Professional Storefront', desc:'Build a beautiful, custom-branded online store with ease.'},
                ].map((b)=> (
                  <div key={b.title} className="flex items-center gap-4 bg-white dark:bg-[#221810] dark:border dark:border-gray-800/80 p-4 min-h-[72px] justify-between rounded-lg shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-lg bg-[#f5f2f0] dark:bg-gray-800 flex items-center justify-center text-[#181411] dark:text-gray-200"><span className="material-symbols-outlined">{b.icon}</span></div>
                      <div>
                        <p className="text-base font-medium line-clamp-1">{b.title}</p>
                        <p className="text-sm text-[#8a7260] dark:text-gray-400 line-clamp-2">{b.desc}</p>
                      </div>
                    </div>
                    <div className="size-7 flex items-center justify-center text-[#07880e]"><span className="material-symbols-outlined text-xl">check_circle</span></div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col items-center gap-4 border-t border-gray-200/80 dark:border-gray-800/80 pt-10 mt-4">
              <button onClick={handleConnect} className="flex items-center justify-center gap-2 w-full max-w-md h-12 px-6 bg-[#f16d0e] text-white font-bold rounded-lg shadow-md hover:bg-[#e2630e] focus:outline-none focus:ring-2 focus:ring-[#f16d0e]/50 focus:ring-offset-2 focus:ring-offset-[#f8f7f5] dark:focus:ring-offset-[#221810]">
                <span>Connect to Shopify & Launch Shop</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <p className="text-xs text-[#8a7260] dark:text-gray-500 max-w-sm text-center">You'll be redirected to Shopify to securely authorize the connection.</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ShopifyLaunchPage;
