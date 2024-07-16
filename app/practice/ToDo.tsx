'use client'

import { ToDoItem } from "./TodoList"

function ToDo(props : any)
{

    return <div className="m-3 flex justify-center items-center text-center">
            <h1> {props.text} </h1>
            <input type="checkbox" className="m-2"></input>
            <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg" onClick={()=>(props.delete(props.id))}>delete</button>
        </div>
}

export default ToDo