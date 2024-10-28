import { useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import "./index.css"


const EachTodo = ({eachObj,updateTodo,deleteTodo}) => {
    const [editInput, setEditInput] = useState(false)
    const [editInputText, setEditInputText] = useState("")


    const onEditTodoSave = () => {
        if (editInputText.length > 0) {

            updateTodo({...eachObj,name:editInputText})
        }
        setEditInput(false)
    }
    const onEditTodoEdit = () => {
        setEditInput(true)
    }

    const onEditInpuChange = (event) => {
        setEditInputText(event.target.value)
    }

    const handleToggle = (event) => {
        const toggleTodoStatus = event.target.checked ? "Completed":"Incomplete"
        updateTodo({...eachObj,status:toggleTodoStatus})
      };

    const ondeleteTodo = () => {
        deleteTodo(eachObj.id)
    }
    
    return (<li className="each-todo">
        <div className="text-container">
            <input type="checkbox" className="checkbox" checked={eachObj.status==="Completed" ? true : false} onChange={handleToggle}/>
            {editInput ? <input value={editInputText} type="text" onChange={onEditInpuChange} className="edit-input" /> : <p className={eachObj.status === "Completed" ? "todo-text todo-strike" : "todo-text"}>{eachObj.name}</p>}
        </div>
        <div>
            {editInput ? <button type="button" onClick={onEditTodoSave} className="save-button">Save</button> : <FaRegEdit onClick={onEditTodoEdit} />}
            <MdDeleteOutline className="delete-button" onClick={ondeleteTodo}  />

        </div>
    </li>)
}

export default EachTodo