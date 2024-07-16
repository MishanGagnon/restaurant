'use client'
import { useState } from "react";
import ToDo from "./ToDo";

export interface ToDoItem
{
    id : number
    text : string
}


const TodoList =() => {

    const [inputText, setinputText] = useState('')
    const [todoList, settodoList] = useState<ToDoItem[]>([])

    function deleteToDo(id : number)
    {
        settodoList(()=>todoList.filter(el=>el.id !== id))
    }

    function submitToDo()
    {
        // Generate unique ID (for demo purposes, replace with actual unique ID generation)
        const id = Math.floor(Math.random() * 1000);
        settodoList(prevItems=>[...prevItems,{id, text : inputText}])
    }

    return (<div className="w-full h-full flex flex-col item-center">
               <header className="text-center justify-start">To-Do List</header>
               <div className="text-center p-2 m-2">
                <input className="w-3/4 text-black" onChange={(e)=>setinputText(e.target.value)}></input>
                <button className="m-5 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg" onClick={()=>submitToDo()}>enter</button>
               </div>
               {todoList.map(value=> <ToDo id = {value.id} text = {value.text} delete = {deleteToDo}/>)}
            </div>)
}

export default TodoList

