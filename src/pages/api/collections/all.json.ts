import type { APIRoute } from "astro"
import sql from "../../../db/connection"
export const GET: APIRoute = async ({ params, request }) => {
    try {
        const url = new URL(request.url);
        if (!url.searchParams.has('user_id')) {
            return new Response(JSON.stringify({ message: 'Missing params' }), { status: 400 })
        }
        const userId = url.searchParams.get('user_id')
        const collections = await sql`SELECT COUNT(cp.collection_id), c.id,c.thumb as thumbs,c.name
                                    FROM collections AS c
                                    LEFT JOIN collection_photo AS cp ON c.id = cp.collection_id
                                    JOIN users AS u ON c.user_id = u.id
                                    WHERE u.id = ${userId}
                                    GROUP BY c.id`
        for (const e of collections) {
            if (parseInt(e.count) >= 2) {
                const query = await sql`SELECT photo_url,alt_description
                                        FROM collections AS c
                                        LEFT JOIN collection_photo AS cp ON c.id = cp.collection_id
                                        JOIN users AS u ON c.user_id = u.id
                                        WHERE u.id = ${userId} AND c.id = ${e.id}
                                        LIMIT ${parseInt(e.count) >= 3 ? parseInt(e.count) : 2}
                                            `;
                e.thumbs = query;
            }
        }
        return new Response(JSON.stringify(collections), { status: 200 })
    } catch (error) {
        return new Response(JSON.stringify(error), { status: 500 })

    }
}