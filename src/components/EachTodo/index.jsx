import { useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import "./index.css"


const EachTodo = (props) => {
    const [editInput, setEditInput] = useState(false)
    const [editInputText, setEditInputText] = useState("")
    const { eachObj } = props

    const onDeleteTodo = () => {
        props.delete(eachObj.id)
    }
    const onEditTodoSave = () => {
        if (editInputText.length > 0) {
            props.edit({ ...eachObj, text: editInputText })
        }
        setEditInput(false)
    }
    const onEditTodoEdit = () => {
        setEditInput(true)
    }

    const onEditInpuChange = (event) => {
        setEditInputText(event.target.value)
    }
    const onCheckTodo = () => {
       props.check(eachObj.id)
    }

    return (<li className="each-todo">
        <div className="text-container">
            <input type="checkbox" onChange={onCheckTodo} />
            {editInput ? <input value={editInputText} type="text" onChange={onEditInpuChange} className="edit-input" /> : <p className={eachObj.check ? "todo-text todo-strike" : "todo-text"}>{eachObj.text}</p>}
        </div>
        <div>
            {editInput ? <button type="button" onClick={onEditTodoSave} className="save-button">Save</button> : <FaRegEdit onClick={onEditTodoEdit} />}
            <MdDeleteOutline className="delete-button" onClick={onDeleteTodo} />

        </div>
    </li>)
}

export default EachTodo