import { useEffect, useState } from "react"
import { v4 as uuidv4 } from 'uuid';
import EachTodo from "./components/EachTodo";
import "./App.css"


const todoList = [
    {
        id: uuidv4(),
        text: "learn Html",
        check: false
    }, {
        id: uuidv4(),
        text: "learn css",
        check: false
    },
    {
        id: uuidv4(),
        text: "learn java",
        check: false
    }, {
        id: uuidv4(),
        text: "learn react",
        check: false
    },
    {
        id: uuidv4(),
        text: "learn php",
        check: false
    }, {
        id: uuidv4(),
        text: "learn python",
        check: false
    },


]

const App = () => {
    const [newList,setNewList] = useState(localStorage.getItem("TodoList") !== null ? JSON.parse(localStorage.getItem("TodoList")) :todoList)
    const [input, setInput] = useState("")

    useEffect(() => {
       localStorage.setItem("TodoList",JSON.stringify(newList))
    },[newList])





    const onChangeInput = (event) => {
        setInput(event.target.value)
    }
    const onAddTodo = () => {
        const newTodo = {
            id: uuidv4(),
            text: input,
            check: false
        }
        setNewList([...newList,newTodo]) 
    }
    const deleteTodo = (id) => {
       const filterList = newList.filter(each => each.id !== id)
       setNewList(filterList)
    }

    const editTodo = (obj) => {
        setNewList(newList.map(each => {
            if(each.id === obj.id){
                return obj
            }
            return each
        } ))
    }

    const  checkTodo = (id) => {
          setNewList(newList.map(each => {
            if(each.id === id){
               return {...each,check: !each.check}
            }
            return each
          } ))
    }

    return (
        <div className="app-background">
            <div className="todo-background">
                <h1 className="todo-heading">What's The plan for Today?</h1>
                <div className="search-bar">
                    <input type="text" placeholder="Add a todo" value={input} onChange={onChangeInput} className="input-field" />
                    <button type="button" className="add-button" onClick={onAddTodo}>Add Todo</button>
                </div>
                <ul className="todo-list-container">
                    {newList.map((each) => <EachTodo key={each.id} eachObj={each} delete={deleteTodo} edit={editTodo} check={checkTodo} />)}
                </ul>
            </div>
        </div>
    )
}


export default App