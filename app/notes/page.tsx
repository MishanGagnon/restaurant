'use client'
// import { createClient } from '@/utils/supabase/server';
// import { data } from 'autoprefixer';

// export default async function Notes() {
//   const supabase = createClient();
//   const { data: notes } = await supabase.from("notes").select();
//     console.log(data)
//   return <h1>hello</h1>
// }

const Notes = () => {
    //fetch request for db information from local api, returns it, and you visualize here

    
    return (
        <div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">hi</button>
        </div>
    )
}
export default Notes