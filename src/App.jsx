import { useEffect, useState } from "react";
import EachTodo from "./components/EachTodo";
import { ThreeDots } from 'react-loader-spinner';
import "./App.css";

const apiStatusConstants = {
    initial: "INITIAL",
    inProgress: "IN_PROGRESS",
    success: "SUCCESS",
    failure: "FAILURE"
};

const App = () => {
    const [apiResponse, setApiResponse] = useState({
        status: apiStatusConstants.initial,
        data: null,
        errorMsg: null
    });
    const [name, setName] = useState("")
    console.log(apiResponse.data)

    useEffect(() => {
        setApiResponse((prev) => ({
            ...prev,
            status: apiStatusConstants.inProgress,
        }));
        const fetchData = async () => {
            const url = "https://todosbackend-production.up.railway.app/todos/";
            try {
                const response = await fetch(url);
                const responseData = await response.json();
                if (response.ok) {
                    setApiResponse({
                        status: apiStatusConstants.success,
                        data: responseData,
                        errorMsg: null,
                    })
                }

            } catch (error) {
                setApiResponse((prev) => ({
                    ...prev,
                    errorMsg: error,
                    status: apiStatusConstants.failure,
                }));
            }
        };

        fetchData();
    }, []);

    const onAddItem = async () => {
        const newTodo = {
            name: name,
            status: "Incomplete"
        }
        const response = await fetch('https://todosbackend-production.up.railway.app/todos/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTodo),
        });
        const newItem = await response.json();
        setApiResponse(prev => ({
            prev,
            status: apiStatusConstants.success,
            data: [...prev.data, newItem]
        }))
        setName('');
    };

    const updateTodo = async (obj) => {
        console.log(obj)
        const response = await fetch(`https://todosbackend-production.up.railway.app/todos/${obj.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(obj),
        });
        const updateStatusResponse = await response.json()
        console.log(updateStatusResponse.updateStatus);
        const updateData = apiResponse.data.map((each) => {
            if (each.id === obj.id) {
                return obj


            }
            return each
        })
        setApiResponse((prev) => ({
            ...prev, data: updateData
        }))
    };

    const deleteTodo = async (id) => {
        const response = await fetch(`https://todosbackend-production.up.railway.app/todos/${id}`, { method: 'DELETE' });
        const deleteStatusResponse = await response.json()
        console.log(deleteStatusResponse.deleteStatus, deleteStatusResponse.id);
        const updatedData = apiResponse.data.filter((each) => each.id !== id)
        setApiResponse((prev) => ({
            ...prev, data: updatedData
        }))
    };

    const renderSuccessView = () => {
        const { data } = apiResponse;
        return (
            <div className="successview-container">
                <div className="filters-bg-container">
                    <div className="searcbar-container">
                        <input type="text" className="search-input" />
                        <button type="button" className="search-button">Search</button>
                    </div>
                    <div className="filters-container">
                        <input type="radio" />
                        <label className="label">Complete</label>
                        <input type="radio" />
                        <lable className="label">Incomplete</lable>
                        
                    </div>
                </div>
                <ul className="todo-list-container">
                    {data.map((each) => (
                        <EachTodo key={each.id} eachObj={each} updateTodo={updateTodo} deleteTodo={deleteTodo} />
                    ))}
                </ul>
            </div>
        );
    };

    const renderLoadingView = () => (
        <ThreeDots
            visible={true}
            height="80"
            width="80"
            color="#4fa94d"
            radius="9"
            ariaLabel="three-dots-loading"
        />
    );

    const renderFailureView = () => {
        const { errorMsg } = apiResponse
        return <p>Error: {errorMsg}</p>;

    }
    const renderTodos = () => {
        const { status } = apiResponse;
        switch (status) {
            case apiStatusConstants.inProgress:
                return renderLoadingView();
            case apiStatusConstants.success:
                return renderSuccessView();
            case apiStatusConstants.failure:
                return renderFailureView();
            default:
                return null;
        }
    };

    const onInputField = (event) => {
        setName(event.target.value)
    }


    return (
        <div className="app-background">
            <div className="todo-background">
                <h1 className="todo-heading">What's The plan for Today?</h1>
                <div className="search-bar">
                    <input type="text" value={name} onChange={onInputField} placeholder="Add a todo" className="input-field" />
                    <button type="button" onClick={onAddItem} className="add-button">Add Todo</button>
                </div>
                {renderTodos()}
            </div>
        </div>
    );
};

export default App;
