import { MONTHS } from '../constants/constants'
import sql from '../db/connection';
export function formatDate(stringDate: string) {
    const newDate = new Date(stringDate);
    const nameMonth = MONTHS[newDate.getMonth()];
    const year = newDate.getFullYear();
    const formattedDate = "Published on " + nameMonth + " " + newDate.getDate() + "," + year;
    return formattedDate
}

export function cookiesToObject() {
    const cookies = document.cookie.split('; ')
    const objectCookies: Record<string, string> = {}
    cookies.forEach(e => {
        const [key, value] = e
        objectCookies[key] = value
    })

    return { ...objectCookies }
}
export function getCookie(name: string) {
    const cookies = cookiesToObject()
    return cookies[name]
}

export function buildingQueryFilterCollection(keyword: string, userId: string, photoId: string) {
   
    
    return `SELECT count(c.id) as count_photos,c.id,c.name,c.thumb 
    FROM 
    users as u 
    JOIN collections as c on u.id=c.user_id 
    JOIN collection_photo as cp on c.id=cp.collection_id 
    WHERE c.user_id=${userId} 
    AND c.id ${keyword} ( SELECT c.id 
                                    FROM
                                    collections as c
                                    JOIN collection_photo as cp on c.id = cp.collection_id
                                    JOIN users as u on u.id = c.user_id 
                                    WHERE cp.photo_id=${photoId}
                                    AND u.id=${userId}
                                ) group by c.name,c.thumb,c.id`

}