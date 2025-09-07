
const IndexElement = () => {
    return (
        <>
            <div className="w-full flex flex-col p-4 gap-4 text-lg font-semibold shadow-md border rounded-sm lg:w-full">
                <div className="w-full flex flex-row justify-between">
                    <p className="text-gray-600">Subtotal (2 Items)</p>
                    <p className="text-end font-bold">$99.98</p>
                </div>
                <hr className="bg-gray-200 h-0.5" />
                <div className="flex flex-row justify-between">
                    <p className="text-gray-600">Freight</p>
                    <div>
                        <p className="text-end font-bold">$3.90</p>
                        <p className="text-gray-600 text-sm font-normal">Arrives on Jul 16</p>
                    </div>
                </div>
                <hr className="bg-gray-200 h-0.5" />
                <div className="flex flex-row justify-between">
                    <p className="text-gray-600">Discount Coupon</p>
                    <a className="text-gray-500 text-base underline" href="#">Add</a>
                </div>
                <hr className="bg-gray-200 h-0.5" />
                <div className="flex flex-row justify-between">
                    <p className="text-gray-600">Total</p>
                    <div>
                        <p className="text-end font-bold">$103.88</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="transition-colors text-sm bg-blue-600 hover:bg-blue-700 p-2 rounded-sm w-full text-white shadow-md">
                        FINISH
                    </button>
                    <button className="transition-colors text-sm bg-white border border-gray-600 p-2 rounded-sm w-full text-gray-700 shadow-md">
                        ADD MORE PRODUCTS
                    </button>
                </div>
            </div>
        </>
    )
}

export default IndexElement
