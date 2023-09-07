import { useEffect, useState } from "react"

export default function Header() {
    const [currentAccount, setCurrentAccount] = useState("")

    // تعمل الدالة على ربط الموقع بالمحفظة
    const connectWallet = async () => {
        try {
            const { ethereum } = window

            // التحقق ما إذا كان المستخدم قام بتثبيت المحفظة
            if (!ethereum) {
                // إذا لم يقم بذلك فسيتم طباعة هذا الامر امامه
                alert("Please install MetaMask")
                return;
            }

            // في حال المستخدم قد قام بتثبيت المحفظة سيقوم بطلب إتصال المحفظة
            const accounts = await ethereum.request({
                method: "eth_requestAccounts",
            })

            // المستخدم في المتصفح address تخزين
            localStorage.setItem("walletAddress", accounts[0])
            setCurrentAccount(accounts[0])
        } catch (error) {
            console.error(error)
        }
    };

    useEffect(() => {
        connectWallet()
    }, [])

    return (
        <>
            <nav className="relative z-20 bg-white w-full md:static md:text-sm md:border-none -mt-6">
                <div className="items-center gap-x-14 px-4 max-w-screen-xl mx-auto md:flex md:px-8">
                    <div className="flex items-center justify-between py-3 md:py-5 md:block">
                        <a href="/">
                            <img
                                src="https://img.freepik.com/premium-vector/red-youtube-logo-social-media-logo_197792-1803.jpg?w=2000"
                                width={80}
                                height={40}
                                className="-mt-1"
                                alt="YouTube logo"
                            />
                        </a>
                    </div>
                    <div className="nav-menu flex-1 pb-3 mt-8 md:block md:pb-0 md:mt-0">
                        <ul className="items-center space-y-6 md:flex md:space-x-6 md:space-x-reverse md:space-y-0">
                            <div className='flex-1 items-center justify-end gap-x-6 space-y-3 md:flex md:space-y-0'>
                                <li>
                                    <a href="/upload" className="block py-3 px-4 font-medium text-center text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 active:shadow-none rounded-lg shadow md:inline">
                                        نشر فيديو
                                    </a>
                                </li>
                                
                                {!currentAccount ? (
                                    <li>
                                        <button onClick={() => connectWallet()} className="block py-3 px-4 font-medium text-center text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 active:shadow-none rounded-lg shadow md:inline">
                                            ربط المحفظة
                                        </button>
                                    </li>
                                ) : null}
                            </div>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}
