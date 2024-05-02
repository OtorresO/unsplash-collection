import type { APIRoute } from "astro"

export const GET: APIRoute = async ({ params, request }) => {
    try {
        const id = params.id
        const clientId =import.meta.env.UNSPLASH_CLIENT_ID
        const res = await fetch(`https://api.unsplash.com/photos/${id}`, {
            headers: {
                'Authorization': `Client-ID ${clientId}`
            },
            
        })
        const data = await res.json()
        return new Response(JSON.stringify(data), { status: 200 })

    } catch (error) {
        return new Response(JSON.stringify(error), { status: 500 })
    }





}