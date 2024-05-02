import type { APIRoute } from "astro"
import sql from "../../../db/connection"

export const GET: APIRoute = async ({ params, request }) => {
  try {
    const url = new URL(request.url);
    if (!url.searchParams.has('user_id')
      || !url.searchParams.has('photo_id')
    ) {
      return new Response(JSON.stringify({ message: 'Missing params' }), { status: 400,statusText:'Missing params' })
    }
    const userId = url.searchParams.get('user_id')
    const photoId = url.searchParams.get('photo_id')
    const userQuery = await sql`SELECT * FROM users WHERE id=${userId}`
    if (userQuery.count == 0) return new Response(JSON.stringify({ message: 'User not found' }), { status: 500 })
    const collectionsIncludesPhoto = await sql`
                SELECT count(cp.collection_id) as count_photos,c.id,c.name,c.thumb 
                FROM 
                users as u 
                JOIN collections as c on u.id=c.user_id 
                LEFT JOIN collection_photo as cp on c.id=cp.collection_id 
                WHERE c.user_id=${userId} 
                AND c.id  IN ( SELECT c.id 
                                  FROM
                                  collections as c
                                  JOIN collection_photo as cp on c.id = cp.collection_id
                                  JOIN users as u on u.id = c.user_id 
                                  WHERE cp.photo_id=${photoId}
                                  AND u.id=${userId}
                               ) group by c.name,c.thumb,c.id
`
    const collectionsNotIncludesPhoto = await sql`
                SELECT count(cp.collection_id) as count_photos,c.id,c.name,c.thumb 
                FROM 
                users as u 
                JOIN collections as c on u.id=c.user_id 
                LEFT JOIN collection_photo as cp on c.id=cp.collection_id 
                WHERE c.user_id=${userId} 
                AND c.id NOT IN ( SELECT c.id 
                                    FROM
                                    collections as c
                                    JOIN collection_photo as cp on c.id = cp.collection_id
                                    JOIN users as u on u.id = c.user_id 
                                    WHERE cp.photo_id=${photoId}
                                    AND u.id=${userId}
                                ) group by c.name,c.thumb,c.id
    `
    return new Response(JSON.stringify({collectionsIncludesPhoto,collectionsNotIncludesPhoto}), { status: 200 })
} catch (error) {
  return new Response(JSON.stringify(error), { status: 500 })

}
}


export const POST: APIRoute = async ({ params, request }) => {
  try {
    const { collection_id, photo_id, photo_url,user_id,alt_description } = await request.json()
    if (!collection_id || !photo_id || !photo_url || !user_id ||!alt_description) return new Response(JSON.stringify({ message: 'Missing params' }), { status: 400 })
    const userQuery = await sql`SELECT * FROM users WHERE id=${user_id}`
    if (userQuery.count == 0) return new Response(JSON.stringify({ message: 'User not found' }), { status: 500 })
    const existPhotoInCollection = await sql`SELECT * FROM users as u JOIN collections as c on u.id=c.user_id JOIN collection_photo as cp on c.id=cp.collection_id WHERE c.id=${collection_id} AND cp.photo_id=${photo_id} AND u.id=${user_id}`
    if(existPhotoInCollection.count!=0) return new Response(JSON.stringify({}), { status: 409,statusText:'The photo has already been added to the collection.' })
    const query = await sql.begin(async () => {
      return await sql`INSERT INTO collection_photo ${sql({ collection_id, photo_id, photo_url,alt_description })} returning *`
    })
    return new Response(JSON.stringify({ message: 'Image added to collection' }), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 })
  }
}

export const DELETE: APIRoute = async ({ params, request }) => {
  try {
    const { collection_id, photo_id,user_id } = await request.json()
    if (!collection_id || !photo_id||!user_id) return new Response(JSON.stringify({ message: 'Missing params' }), { status: 400 })
    const userQuery = await sql`SELECT * FROM users WHERE id=${user_id}`
    if (userQuery.count == 0) return new Response(JSON.stringify({ message: 'User not found' }), { status: 500 })
    const existPhotoInCollection = await sql`SELECT * FROM users as u JOIN collections as c on u.id=c.user_id JOIN collection_photo as cp on c.id=cp.collection_id WHERE c.id=${collection_id} AND cp.photo_id=${photo_id} AND u.id=${user_id}`
    if(existPhotoInCollection.count==0) return new Response(JSON.stringify({}), { status: 404,statusText:'The photo does not exist in the collection.' })
    const query = await sql.begin(async () => {
      return await sql`DELETE FROM collection_photo WHERE collection_id=${collection_id} AND photo_id=${photo_id} returning *`
    })
    return new Response(JSON.stringify({ message: 'Image deleted from collection' }), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 })
  }
}