import { useState } from "react"
import Search from "./icons/Search"
import { Toaster, toast } from 'sonner'
export default function App() {
    const [data, setData] = useState<null | any>(null)
    const [filter, setFilter] = useState('')
    const [loadingData, setLoadingData] = useState(false)
    const [initialState, setInitialState] = useState(true)

    const displayData = data && data.total > 0
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        getPhotos()
    }
    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value == '') return
        setFilter(e.target.value)
    }
    const getPhotos = async () => {
        setLoadingData(true)
        setData(null)
        setInitialState(false)
        try {
            const res = await fetch(`/api/photos/search/${filter}.json`)
            if (!res.ok) {
                res.json().then(error => {
                    toast.error(error.message)
                });
                return
            }
            const data = await res.json()
            if (data.results) {
                console.log('pasa por aqui')
                setData(data)
                setLoadingData(false)
            }

        } catch (error) {
            setLoadingData(false)

        }





    }

    return (

        <div className={`flex ${initialState ? 'py-20 ' : 'flex-col pb-20'} items-center justify-center w-full `}>
            {
                initialState && <img src="/hero-left.png" alt="3 images shuffle at left for hero" className="w-1/4 h-auto" />

            }
            {
                !initialState && <div className="h-20 w-full bg-gradient-to-r from-[#F1C291] via-[#B97EB1] to-[#A73E99]">

                </div>
            }

            <div className={`${initialState ? 'w-2/4 -mt-52 ' : 'w-full'} flex flex-col items-center gap-6`}>
                {
                    initialState && <header className="text-[#121826] flex flex-col items-center gap-3" >
                        <h1 className="text-4xl font-semibold text-center ">Search</h1>
                        <p className="text-sm font-light text-center">Search high-resolution images from Unsplash</p>
                    </header>
                }
                <form onSubmit={handleSubmit} className="w-full flex justify-center items-center" >
                    <div className={`bg-[#ffffff] text-sm font-normal ${initialState ? 'w-11/12' : ' w-5/12 -mt-7'}  h-14 border rounded-lg px-5 flex justify-between items-center`}>
                        <input type="text" onChange={handleChangeInput} className="w-full h-full outline-none" placeholder="Enter your keywords..." />
                        <button><Search /></button>
                    </div>

                </form>
                {
                    loadingData && <p>Loading...</p>
                }
                {
                    (data && data.total == 0) && <div>Data not Found</div>

                }

                {




                    (displayData) && <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 mx-20 gap-3 grid-flow-row-dense">
                        {
                            data.results.map((image: any) => (

                                <a key={image.id} href={`/photo/${image.id}`} className="w-full h-fit hover:scale-105 transform transition duration-300 ease-in-out">

                                    <img src={image.urls.small} alt={image.alt_description} className="rounded-lg" />

                                </a>


                            ))
                        }
                    </div>


                }



            </div >
            {
                initialState && <img src="/hero-right.png" alt="3 images shuffle at right for hero" className="w-1/4 h-auto" />

            }

            <Toaster position="bottom-center" richColors />
        </div>





    )
}
