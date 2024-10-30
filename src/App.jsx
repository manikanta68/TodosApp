import { useEffect, useState } from "react";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
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
    const [searchInput, setSearchInput] = useState("")
    const [search, setSearch] = useState(false)
    const [selected, setSelected] = useState('');

    console.log(apiResponse.data)

    useEffect(() => {
        setApiResponse((prev) => ({
            ...prev,
            status: apiStatusConstants.inProgress,
        }));
        const fetchData = async () => {
            const url = `${backendUrl}/todos/?search_q=${searchInput}&filter_by=${selected}`;
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
            setSearchInput("")

        };

        fetchData();
        setSearch(false)

    }, [search,selected]);

    const onAddItem = async () => {
        const newTodo = {
            name: name,
            status: "Incomplete"
        }
        const response = await fetch(`${backendUrl}/todos/`, {
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
        const response = await fetch(`${backendUrl}/todos/${obj.id}`, {
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
        const response = await fetch(`${backendUrl}/todos/${id}`, { method: 'DELETE' });
        const deleteStatusResponse = await response.json()
        console.log(deleteStatusResponse.deleteStatus, deleteStatusResponse.id);
        const updatedData = apiResponse.data.filter((each) => each.id !== id)
        setApiResponse((prev) => ({
            ...prev, data: updatedData
        }))
    };

    const onSearchInput = (event) => {
        setSearchInput(event.target.value)
    }
    const onSearch = () => {
        setSearch((prev) => !prev.search)
    }
    const handleSelectChange = (event) => {
        setSelected(event.target.value);
      };
    


    const renderSuccessView = () => {
        const { data } = apiResponse;
        return (
            <div className="successview-container">
                <div className="filters-bg-container">
                    {
                        data.length > 0 && <div className="searcbar-container">
                            <input type="text" placeholder="Search by todo name" className="search-input" value={searchInput} onChange={onSearchInput} />
                            <button type="button" className="search-button" onClick={onSearch}>Search</button>
                        </div>
                    }
                    {
                        data.length > 0 &&  <div className="filters-container">
                        <label htmlFor="filter">Filter by:</label>
                        <select id="filter" value={selected} onChange={handleSelectChange} className="select-container">
                            <option value="">default</option>
                            <option value="Completed">Completed</option>
                            <option value="Incomplete">Incomplete</option>
                        </select>
                    </div>
                    }
                   
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
        console.log(errorMsg)
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
