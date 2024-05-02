import { useEffect, useMemo, useState, type ReactNode } from "react"
import type { Photo } from "../../interfaces/Photo"
import Plus from "./icons/Plus"
import Download from "./icons/Download"
import Remove from "./icons/Remove"
import Search from "./icons/Search"
import Close from "./icons/Close"
import { Toaster, toast } from "sonner"

export default function AddPhotoToCollectionModal({ userId, photo }: { userId: string, photo: Photo }) {
    const [collectionsNotIncludesPhoto, setCollectionsNotIncludesPhoto] = useState<Array<any> | null>(null)
    const [collectionsIncludesPhoto, setCollectionsIncludesPhoto] = useState<Array<any> | null>(null)

    const [search, setSearch] = useState('')
    const filteredCollectionsNotIncludesPhoto = useMemo(() => {
        return collectionsNotIncludesPhoto && search && search.trim() !== '' ? collectionsNotIncludesPhoto.filter((e: any) => e.name.includes(search)) : null
    }, [search])
    const [visible, setVisible] = useState(false)
    const getCollection = async () => {
        try {

            const res = await fetch(`http://localhost:4321/api/actions-photos/methods.json?user_id=${userId}&photo_id=${photo.id}`)
            if (!res.ok) {
                return res.json().then(error => {
                    toast.error(error.message)
                    throw new Error(error.message)
                });
                
            }
            const data = await res.json()
            setCollectionsNotIncludesPhoto(data.collectionsNotIncludesPhoto)
            setCollectionsIncludesPhoto(data.collectionsIncludesPhoto)
        } catch (error) {
        }

    }
    useEffect(() => {
        getCollection()
    }, [])
    const handleClickAddToCollection = async (collectionId: string, photoUrl: string, photoId: string, photoAltDescription: string, userId: string) => {
        try {
            const res = await fetch('http://localhost:4321/api/actions-photos/methods.json', {
                method: 'POST',
                body: JSON.stringify({ collection_id: collectionId, photo_url: photoUrl, photo_id: photoId, alt_description: photoAltDescription, user_id: userId })
            })
            if (!res.ok) {
                return res.json().then(error => {
                    toast.error(error.message)
                    throw new Error(error.message);
                })
            }

            const data = await res.json()
            setVisible(false)
            getCollection()
            setSearch('')


        } catch (error) {
        }
    }

    const handleClickRemoveToCollection = async (collectionId: string, photoId: string, userId: string) => {
        try {
            const res = await fetch('http://localhost:4321/api/actions-photos/methods.json', {
                method: 'DELETE',
                body: JSON.stringify({ collection_id: collectionId, photo_id: photoId, user_id: userId })
            })
            if (!res.ok) {
                return res.json().then(error => {
                    toast.error(error.message)
                    throw new Error(error.message);
                })
            }

            const data = await res.json()
            getCollection()


        } catch (error) {
        }
    }

    return (
        <>
            <div className="flex gap-3">
                <button onClick={() => setVisible(!visible)} className="bg-[#E5E7EB] py-3 px-10 rounded text-xs font-medium flex gap-2">
                    <Plus />  Add to Collection
                </button>
                <a target="_blank" href={photo.urlDownload} className="bg-[#E5E7EB] py-3 px-10 rounded text-xs font-medium flex gap-2"><Download />  Download</a>
            </div>

            {
                collectionsIncludesPhoto &&
                <div className="flex flex-col gap-3">
                    <h1 className="text-xl font-semibold">Collections</h1>
                    <ul>
                        {collectionsIncludesPhoto.map(e => (
                            <li className={`w-full h-auto flex justify-between p-3 items-center hover:bg-[#E5E7EB] rounded cursor-pointer`}>
                                <div className="flex items-center gap-3">
                                    <img src={e.thumb} alt="Thumb collection" className="w-16 h-16 rounded" />
                                    <div className="">
                                        <div className="font-medium">{e.name}</div>
                                        <div className="font-light text-xs">{e.count_photos} photos</div>
                                    </div>

                                </div>
                                <div className="cursor-pointer flex gap-2 items-center text-xs" onClick={() => handleClickRemoveToCollection(e.id, photo.id, userId)}>
                                    <Remove />Remove
                                </div>

                            </li>
                        ))}
                    </ul>



                </div>
            }



            <div className={`fixed left-0 top-0 h-screen min-h-screen w-full ${visible ? 'block bg-[#E5E7EBCC]' : 'hidden'}`} >
                <div className="flex flex-col p-5 bg-[#FFFFFF] w-[90%] sm:w-[40%] h-4/5 mx-auto mt-16 gap-5 rounded relative">
                    <h1 className="text-xl font-semibold text-[#121826]">Add to Collections</h1>
                    <div className="w-full flex  items-center" >
                        <div className={`bg-[#ffffff] text-sm font-normal h-14 w-full border rounded-lg px-5 flex justify-between items-center`}>
                            <input type="text" onChange={(e) => { setSearch(e.target.value) }} className="w-full h-full outline-none" placeholder="Enter your keywords..." />
                            <button ><Search /></button>
                        </div>
                    </div>
                    <div>
                        {
                            filteredCollectionsNotIncludesPhoto ?
                                <div className="flex flex-col gap-3">
                                    <span className="text-xs text-[#121826]">{filteredCollectionsNotIncludesPhoto.length} matches</span>
                                    <ul className="overflow-y-scroll">
                                        {filteredCollectionsNotIncludesPhoto.map(e => (
                                            <li className="w-full h-auto flex justify-between p-3 items-center hover:bg-[#E5E7EB] rounded cursor-pointer">
                                                <div className="flex items-center gap-3">
                                                    <img src={e.thumb} alt="Thumb collection" className="w-16 h-16 rounded" />
                                                    <div className="">
                                                        <div className="font-medium">{e.name}</div>
                                                        <div className="font-light text-xs">{e.count_photos} photos</div>
                                                    </div>

                                                </div>
                                                <div className="cursor-pointer flex gap-2 items-center text-xs" onClick={() => handleClickAddToCollection(e.id, photo.url, photo.id, photo.altDescription, userId)}>
                                                    <Plus /> Add to Collection
                                                </div>

                                            </li>
                                        ))}
                                    </ul>



                                </div>
                                :
                                null
                        }
                    </div>

                    <div className="absolute top-4 right-2 cursor-pointer" onClick={() => setVisible(false)}>
                        <Close />
                    </div>

                </div>


            </div>
            <Toaster position="bottom-center" richColors />

        </>)
}
