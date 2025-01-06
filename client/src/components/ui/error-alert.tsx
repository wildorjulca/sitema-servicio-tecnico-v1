import React from 'react';

export const ErrorAlert = ({ message = "This is an error message that requires your attention.", onClose }) => {
    return (
        <div
            className="flex items-start max-sm:flex-col bg-red-100 text-red-800 p-4 rounded-lg relative"
            role="alert"
        >
            <div className="flex items-center max-sm:mb-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-[18px] fill-red-500 inline mr-3"
                    viewBox="0 0 32 32"
                >
                    <path
                        d="M16 1a15 15 0 1 0 15 15A15 15 0 0 0 16 1zm6.36 20L21 22.36l-5-4.95-4.95 4.95L9.64 21l4.95-5-4.95-4.95 1.41-1.41L16 14.59l5-4.95 1.41 1.41-5 4.95z"
                        data-original="#ea2d3f"
                    />
                </svg>
                <strong className="font-bold text-sm">Error!</strong>
            </div>

            <span className="block sm:inline text-sm ml-4 mr-8 max-sm:ml-0 max-sm:mt-2">
                {message}
            </span>

            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 hover:bg-red-200 rounded-lg transition-all p-2 cursor-pointer fill-red-500 absolute right-4 top-1/2 -translate-y-1/2"
                viewBox="0 0 320.591 320.591"
                onClick={onClose}
            >
                <path
                    d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                    data-original="#000000"
                />
                <path
                    d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                    data-original="#000000"
                />
            </svg>
        </div>
    );
};

export default ErrorAlert;
