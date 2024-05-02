import type { APIRoute } from "astro"

export const GET: APIRoute = async ({ params, request }) => {
    try {
        const query = params.query
        const res = await fetch(`https://api.unsplash.com/search/photos/?query=${query}`, {
            headers: {
                'Authorization': 'Client-ID EqVKhRxa_VwEpKlsHiLKPCTjrt2EMTrMG_wrQj7Xkjs'
            },
            
        })
        const data = await res.json()
        return new Response(JSON.stringify(data), { status: 200 })

    } catch (error) {
        
        return new Response(JSON.stringify(error), { status: 500 })
    }





}