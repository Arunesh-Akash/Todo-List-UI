import '../ProjectComponent/Project.css';
import { TfiMenuAlt } from "react-icons/tfi";
import { BsMenuApp } from "react-icons/bs";
import { BsPlusCircleDotted } from "react-icons/bs";
import Card from 'react-bootstrap/Card';
import { Button } from '@mui/material';
import { MdOutlineClear } from "react-icons/md";
import { IoChevronForwardOutline } from "react-icons/io5";
import { useState, useEffect } from 'react';
import { FcCheckmark } from "react-icons/fc";
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export default function Project() {
    const [todoCards, setTodoCards] = useState([]);
    const [inProgressCards, setInProgressCards] = useState([]);
    const [doneCards, setDoneCards] = useState([]);
    const [showCheckmark, setShowCheckmark] = useState(false);

    useEffect(() => {
        fetchTodoData();
    }, []);

    const fetchTodoData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('Token not found in local storage');
                return;
            }

            const decodeToken = jwtDecode(token);
            const email = decodeToken.email;

            const response = await axios.get(`https://todo-list-vm6k.onrender.com/user/todo?email=${email}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (Array.isArray(response.data)) {
                const { data } = response;
                const todoCards = data.filter(todo => todo.status === 'todo');
                const inProgressCards = data.filter(todo => todo.status === 'in_progress');
                const doneCards = data.filter(todo => todo.status === 'done');

                const todoCardsWithSubmitted = todoCards.map(card => ({ ...card, submitted: true }));
                setTodoCards(todoCardsWithSubmitted);
                setInProgressCards(inProgressCards);
                setDoneCards(doneCards);
            } else {
                console.log('Todo data is missing or not in the expected format');
            }
        } catch (err) {
            console.log('error', err);
        }
    }

    const addNewCard = () => {
        const newCard = { title: "", description: "", submitted: false };
        const updatedCards = [newCard, ...todoCards];
        const sortedCards = updatedCards.sort((a, b) => (a.submitted === b.submitted) ? 0 : a.submitted ? 1 : -1);
        setTodoCards(sortedCards);
    };

    const handleTitleChange = (index, event) => {
        setTodoCards(prevTodoCards => {
            const updatedCards = [...prevTodoCards];
            updatedCards[index].title = event.target.value;
            return updatedCards;
        });
    };

    const handleDescriptionChange = (index, event) => {
        setTodoCards(prevTodoCards => {
            const updatedCards = [...prevTodoCards];
            updatedCards[index].description = event.target.value;
            return updatedCards;
        });
    };


    const removeCard = (cards, setCards, index) => {
        const updatedCards = cards.filter((_, i) => i !== index);
        setCards(updatedCards);
    };

    const removeTodoCard = async (index) => {
        try {
            const token = localStorage.getItem('token')
            const decodeToken = jwtDecode(token);
            const email = decodeToken.email;
            const todoId = doneCards[index]._id;
            console.log("Todoid:",todoId);
            const response = await axios.delete(`https://todo-list-vm6k.onrender.com/user/todo/delete?todoId=${todoId}&email=${email}`);
            console.log(response.data);
          const updatedDoneCards = [...doneCards];
            updatedDoneCards.splice(index, 1);
            setDoneCards(updatedDoneCards);  
        } catch (err) {
            console.log('Error:', err);
        }
    }

    const submitCard = async (index) => {
        try {
            const token = localStorage.getItem('token');
            const decodeToken = jwtDecode(token);
            const email = decodeToken.email;

            const newCardData = { title: todoCards[index].title, description: todoCards[index].description };
            const response = await axios.post(`https://todo-list-vm6k.onrender.com/user/todo?email=${email}`, newCardData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });

            const updatedCard = { ...todoCards[index], _id: response.data._id };

            const updatedCards = [...todoCards];
            console.log(updatedCards);
            updatedCards[index] = updatedCard;
            updatedCards[index].submitted = true;
            setTodoCards(updatedCards);
            setShowCheckmark(index);
            setTimeout(() => {
                setShowCheckmark(null);
            }, 1000);
        } catch (err) {
            console.log('Error:', err);
        }
    };


    const moveCardToInProgress = async (index) => {
        try {
            const token = localStorage.getItem('token');
            const decodeToken = jwtDecode(token);
            const email = decodeToken.email;
            const todoId = todoCards[index]._id;
            const response = await axios.put(`https://todo-list-vm6k.onrender.com/user/todo/move-to-inprogress?todoId=${todoId}&email=${email}`);
            const movedTodo = response.data.todo;

            setTodoCards(todoCards.filter((_, i) => i !== index));
            setInProgressCards([...inProgressCards, movedTodo]);
        }
        catch (err) {
            console.log(err);
        }
    };

    const moveCardToDone = async (index) => {
        try {
            const token = localStorage.getItem('token');
            const decodeToken = jwtDecode(token);
            const email = decodeToken.email;
            const todoId = inProgressCards[index]._id;
            const response = await axios.put(`https://todo-list-vm6k.onrender.com/user/todo/move-to-done?todoId=${todoId}&email=${email}`);
            const movedTodo = response.data.todo;

            setInProgressCards(inProgressCards.filter((_, i) => i !== index));
            setDoneCards([...doneCards, movedTodo]);

        }
        catch (err) {
            console.log(err);
        }
    };

    const getCurrentDate = () => {
        const date = new Date();
        const day = date.getDate().toString().padStart(2, '0');
        const monthIndex = date.getMonth();
        const year = date.getFullYear();

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthName = monthNames[monthIndex];

        return `${day} ${monthName} ${year}`;
    };

    return (
        <div className='project-container'>
            <div className='view-container1'>
                <div className='left-view'>
                    <BsMenuApp className='board-menu-icon1' />
                    <p>Board view</p>
                </div>
                <div className='right-view'>
                    <TfiMenuAlt className='board-menu-icon2' />
                </div>
            </div>
            <div className='view-container2'>
                <div className='todo-container'>
                    <div className='add-header'>
                        <p>To do ({todoCards.length})</p>
                        <div onClick={addNewCard}><BsPlusCircleDotted /></div>
                        <span>Add New</span>
                    </div>
                    <div className='card-container'>
                        {todoCards.map((card, index) => (
                            <div key={index} className={`card${card.submitted ? ' submitted' : ''}`}>
                                <div className='card-menu'>
                                    {
                                        card.submitted ? <IoChevronForwardOutline onClick={() => moveCardToInProgress(index)} /> : null
                                    }

                                    <div className='card-menu-button'>
                                        <MdOutlineClear onClick={() => removeCard(todoCards, setTodoCards, index)} />
                                    </div>
                                </div>
                                <Card style={{ width: '18rem', padding: '8px' }}>
                                    <Card.Body>
                                        <input
                                            type="text"
                                            placeholder="Title"
                                            className="card-input"
                                            value={card.title}
                                            onChange={(event) => handleTitleChange(index, event)}
                                        />
                                        <input
                                            type="text"
                                            className="card-input"
                                            placeholder="Description"
                                            value={card.description}
                                            onChange={(event) => handleDescriptionChange(index, event)}
                                        />
                                        {!card.submitted ? (
                                            <div className='button-container'>
                                                <Button
                                                    type='submit'
                                                    variant='contained'
                                                    style={{ backgroundColor: 'rgb(243, 206, 243)' }}
                                                    onClick={() => submitCard(index)}
                                                    endIcon={<SendIcon />}
                                                >
                                                    Add
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className='button-container'>
                                                {showCheckmark === index && <FcCheckmark />}
                                            </div>
                                        )}

                                        <div className='current-date2'>
                                            {getCurrentDate()}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='inprogress-container'>
                    <div className='add-header'>
                        <p>In Progress({inProgressCards.length})</p>
                        <div><BsPlusCircleDotted /></div>
                        <span>Add New</span>
                    </div>
                    <div className='card-container'>
                        {inProgressCards.map((card, index) => (
                            <div key={index} className={`card${card.submitted ? ' submitted' : ''}`}>
                                <div className='card-menu'>
                                    <IoChevronForwardOutline onClick={() => moveCardToDone(index)} />
                                    <div className='card-menu-button'>
                                        <MdOutlineClear onClick={() => removeCard(inProgressCards, setInProgressCards, index)} />
                                    </div>
                                </div>
                                <Card style={{ width: '18rem', padding: '8px' }}>
                                    <Card.Body>
                                        <input
                                            type="text"
                                            placeholder="Title"
                                            className="card-input"
                                            value={card.title}
                                            onChange={(event) => handleTitleChange(inProgressCards, setInProgressCards, index, event)}
                                        />
                                        <input
                                            type="text"
                                            className="card-input"
                                            placeholder="Description"
                                            value={card.description}
                                            onChange={(event) => handleDescriptionChange(inProgressCards, setInProgressCards, index, event)}
                                        />
                                        <div className='current-date2'>
                                            {getCurrentDate()}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='done-container'>
                    <div className='add-header'>
                        <p>Done({doneCards.length})</p>
                        <div><BsPlusCircleDotted /></div>
                        <span>Add New</span>
                    </div>
                    <div className='card-container'>
                        {doneCards.map((card, index) => (
                            <div key={index} className={`card${card.submitted ? ' submitted' : ''}`}>
                                <div className='card-menu'>
                                    <MdOutlineClear onClick={() => removeTodoCard(index)} />
                                </div>
                                <Card style={{ width: '18rem', padding: '8px' }}>
                                    <Card.Body>
                                        <input
                                            type="text"
                                            placeholder="Title"
                                            className="card-input"
                                            value={card.title}
                                            onChange={(event) => handleTitleChange(doneCards, setDoneCards, index, event)}
                                        />
                                        <input
                                            type="text"
                                            className="card-input"
                                            placeholder="Description"
                                            value={card.description}
                                            onChange={(event) => handleDescriptionChange(doneCards, setDoneCards, index, event)}
                                        />
                                        <div className='current-date2'>
                                            {getCurrentDate()}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div >
    )
}
