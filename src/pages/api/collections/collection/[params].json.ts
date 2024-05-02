import type { APIRoute } from "astro"
import sql from "../../../../db/connection"

export const GET: APIRoute = async ({ params, request }) => {
    try {
        const paramsString = params.params
        if (!paramsString) return new Response(JSON.stringify({}), { status: 400, statusText: "Missing params" })
        const [user_id, collection_id] = paramsString.split('-')
        const photos = await sql`SELECT cp.photo_url,cp.photo_id,c.name
                        FROM collections as c 
                        JOIN collection_photo as cp
                        ON c.id=cp.collection_id
                        JOIN users as u
                        ON u.id=c.user_id 
                        WHERE c.id=${collection_id} AND u.id=${user_id} `
        const collection = await sql`SELECT c.name,count(cp.collection_id),c.id
                        FROM collections as c 
                        LEFT JOIN collection_photo as cp
                        ON c.id=cp.collection_id
                        JOIN users as u 
                        ON u.id=c.user_id
                        WHERE u.id=${user_id} AND c.id=${collection_id}
                        GROUP BY c.name,c.id`

        return new Response(JSON.stringify({photos,collection:collection[0]}), { status: 200 })

    } catch (error) {
        return new Response(JSON.stringify(error), { status: 500 })
    }





}