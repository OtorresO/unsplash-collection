import type { ICollection } from "../interfaces/Collection";
import type { ICollectionPhoto } from "../interfaces/CollectionPhoto";

export function getCollectionPhoto(collections: ICollection[]) {
    const data: ICollectionPhoto[] = []
    collections.forEach(collection => {
        //cats
        if (collection.name == 'cats') {
            data.push(
                {
                    collection_id: collection.id,
                    photo_url: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1OTE5ODJ8MHwxfHNlYXJjaHwxfHxjYXRzfGVufDB8fHx8MTcxMzU2OTI0OHww&ixlib=rb-4.0.3&q=80&w=400',
                    photo_id: 'ZCHj_2lJP00',
                    alt_description:'white and brown long fur cat'
                }

            )
        }

        if (collection.name == 'dogs') {
            data.push(
                {
                    collection_id: collection.id,
                    photo_url: 'https://images.unsplash.com/photo-1568572933382-74d440642117?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1OTE5ODJ8MHwxfHNlYXJjaHwzfHxkb2dzfGVufDB8fHx8MTcxMzU2OTM4Mnww&ixlib=rb-4.0.3&q=80&w=400',
                    photo_id: 'v0_MCllHY9M',
                    alt_description:'black and white Husky'
                },
                {
                    collection_id: collection.id,
                    photo_url: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1OTE5ODJ8MHwxfHNlYXJjaHw2fHxkb2dzfGVufDB8fHx8MTcxMzU2OTM4Mnww&ixlib=rb-4.0.3&q=80&w=400',
                    photo_id: 'MoDcnVRN5JU',
                    alt_description:'black framed eyeglasses'
                }
            )
        }


        if (collection.name == 'houses') {
            data.push(
                {
                    collection_id: collection.id,
                    photo_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1OTE5ODJ8MHwxfHNlYXJjaHw2fHxob3VzZXxlbnwwfHx8fDE3MTM1NTM1ODB8MA&ixlib=rb-4.0.3&q=80&w=400',
                    photo_id: 'mR1CIDduGLc',
                    alt_description:'white concrete building under blue sky during daytime'
                },
                {
                    collection_id: collection.id,
                    photo_url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1OTE5ODJ8MHwxfHNlYXJjaHwzfHxob3VzZXxlbnwwfHx8fDE3MTM1NTM1ODB8MA&ixlib=rb-4.0.3&q=80&w=400',
                    photo_id: 'TiVPTYCG_3E',
                    alt_description:'brown and black wooden house'
                },
                {
                    collection_id: collection.id,
                    photo_url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1OTE5ODJ8MHwxfHNlYXJjaHwxfHxob3VzZXxlbnwwfHx8fDE3MTM1NTM1ODB8MA&ixlib=rb-4.0.3&q=80&w=400',
                    photo_id: 'eWqOgJ-lfiI',
                    alt_description:'red and white house surround green grass field'
                },
            )
        }
    });

    return data
}