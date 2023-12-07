import  { useReducer, useEffect, useState } from "react";

import './TodoList.css';

const initialState = {
    items: JSON.parse(localStorage.getItem('todoList')) || [],
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'ADD_ITEM':
            return {
                ...state,
                items: [...state.items, action.payload]
            };
        case 'REMOVE_ITEM':
            return {
                ...state,
                items: state.items.filter((item, index) => index !== action.payload)
            };
        case 'EDIT_ITEM': {
            const updatedItems = [...state.items];
            updatedItems[action.payload.index] = action.payload.newValue;
            return {
                ...state,
                items: updatedItems
            };
        }
        default:
            return state;
    }
};

const TodoList = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [editIndex, setEditIndex] = useState(null);
    const [editFirstName, setEditFirstName] = useState('');
    const [editLastName, setEditLastName] = useState('');
    const [editEmail, setEditEmail] = useState('');

    const addItem = (text) => {
        dispatch({ type: 'ADD_ITEM', payload: text });
    };
    const removeItem = (index) => {
        dispatch({ type: 'REMOVE_ITEM', payload: index });
    };
    const editItem = (index, newValues) => {
        dispatch({ type: 'EDIT_ITEM', payload: { index, newValue: newValues } });
        setEditIndex(null);
        setEditFirstName('');
        setEditLastName('');
        setEditEmail('');
    };

    useEffect(() => {
        localStorage.setItem('todoList', JSON.stringify(state.items));
    }, [state.items]);

    return (
        <div className="container">
            <h1 className="title">To Do</h1>
            <form className="form"
                onSubmit={(e) => {
                    e.preventDefault();
                    const firstName = e.target.firstName.value.trim();
                    const lastName = e.target.lastName.value.trim();
                    const email = e.target.email.value.trim();

                    if (firstName !== '' && lastName !== '' && email !== '') {
                        const fullName = `${firstName} ${lastName} (${email})`;
                        addItem(fullName);
                        e.target.reset();
                    }
                }}
            >
                <input type="text" name="firstName" placeholder="First name" />
                <input type="text" name="lastName" placeholder="Last name" />
                <input type="text" name="email" placeholder="Email" />
                <button type="submit">Submit</button>
            </form>

            <div className="lists">Lists</div>
            {state.items.map((item, index) => (
                <div key={index} className="lists__content">
                    {editIndex === index ? (
                        <div>
                            <input
                                type="text"
                                value={editFirstName}
                                onChange={(e) => setEditFirstName(e.target.value)}
                                placeholder="First name"
                            />
                            <input
                                type="text"
                                value={editLastName}
                                onChange={(e) => setEditLastName(e.target.value)}
                                placeholder="Last name"
                            />
                            <input
                                type="text"
                                value={editEmail}
                                onChange={(e) => setEditEmail(e.target.value)}
                                placeholder="Email"
                            />
                            <button
                                className="doneButton"
                                onClick={() => {
                                    if (editFirstName.trim() !== '' && editLastName.trim() !== '' && editEmail.trim() !== '') {
                                        const newValues = `${editFirstName} ${editLastName} (${editEmail})`;
                                        editItem(index, newValues);
                                    }
                                }}
                            >
                                Done
                            </button>
                            <button onClick={() => setEditIndex(null)}>Cancel</button>
                        </div>
                    ) : (
                        <div>
                            <div>{item}</div>
                            <button onClick={() => removeItem(index)}>Delete</button>
                            <button
                                onClick={() => {
                                    const [firstName, lastName, email] = item.match(/([^\s]+)\s([^\s]+)\s\(([^)]+)\)/).slice(1);
                                    setEditFirstName(firstName);
                                    setEditLastName(lastName);
                                    setEditEmail(email);
                                    setEditIndex(index);
                                }}
                            >
                                Edit
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default TodoList;