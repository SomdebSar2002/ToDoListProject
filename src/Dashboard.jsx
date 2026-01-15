import './index.css';
import { useState, useEffect } from 'react';
import { supabase } from './supabase-client';
import { useAuth } from './AuthProvider';
export default function App() {
    const {email,username,signOut} = useAuth();
    console.log("Dashboard Username: ", username);
    console.log("Dashboard Email: ", email);
    const [userName, setUserName] = useState(username);
    const [entry, setEntry] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { data, error } = await supabase.from('todolists').insert([{ list: entry, email: email, checked: false, name: userName }]).single();
        setEntry("");
        if (error) {
            console.error("Error adding todo item:", error);
        } else {
            console.log("Todo item added:", data);
        }
    }
    const [incompleteTasks, setIncompleteTasks] = useState([]);
    const [completeTasks, setCompleteTasks] = useState([]);


    const fetchIncompleteTasks = async () => {
        const { data, error } = await supabase.from('todolists').select('id,list, checked').eq('checked', false).eq('email', email);
        if (!error) { setIncompleteTasks(data); }
    };

    const fetchCompleteTasks = async () => {
        const { data, error } = await supabase.from('todolists').select('id,list, checked').eq('checked', true).eq('email', email);

        if (!error) { setCompleteTasks(data); }
    }

    const deleteTask = async (id) => {
        const { data, error } = await supabase.from('todolists').delete().eq('id', id);

        if (error) {
            console.error("Error deleting task:", error);
        } else {
            console.log("Task deleted:", data);
        }
    }
    const toggleTaskCompletion = async (id, checked) => {
        const { data, error } = await supabase.from('todolists').update({ checked: checked }).eq('id', id);
        if (error) {
            console.error("Error updating task:", error);
        }
        else {
            console.log("Task updated:", data);
        }
    }
    const editTask = async (id, ch) => {
        let task = null
        if (ch == 'ei')
            task = incompleteTasks.find((t) => t.id === id);
        else {
            task = completeTasks.find((t) => t.id === id);
        }

        if (!task) return;

        const newText = task.list;
        const item = document.getElementById(`${ch}${id}`);

        if (item.classList.contains('editMode')) {
            item.classList.remove('editMode');
            const { data, error } = await supabase.from('todolists').update({ list: newText }).eq('id', id);
            if (!error) {
                console.log("Task edited:", data);
                fetchIncompleteTasks();
                fetchCompleteTasks();
            }
        } else {
            item.classList.add('editMode');
        }
    }
    console.log("Incomplete Tasks:", incompleteTasks);
    console.log("Complete Tasks:", completeTasks);
    const fetchUsername = async () => {
        const { data, error } = await supabase.from('todolists').select('name').eq('email', email).single();
        if (!error && data) {
            setUserName(data.name);
        }
    };
    useEffect(() => {
        fetchIncompleteTasks();
        fetchCompleteTasks();
        fetchUsername();
        const subs = supabase.channel('todolistactivity').on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'todolists' },
            (payload) => {
                console.log('Change received!', payload);
                fetchIncompleteTasks();
                fetchCompleteTasks();
            }
        ).subscribe();
        return () => {
            subs.unsubscribe();
        }
    }, []);
    return (
        <div className="App">

            <h2>Welcome{userName&&', '}{userName}!</h2>
            <div className="container">
                <h2>TODO LIST</h2>
                <h3>Add Item</h3>
                <p>
                    <input id="new-task" type="text" value={entry} onChange={(e) => setEntry(e.target.value)} /><button onClick={handleSubmit}>Add</button>
                </p>

                <h3>Todo</h3>
                <ul id="incomplete-tasks">
                    {(incompleteTasks.length > 0) && incompleteTasks.map((task) => (
                        <li key={task.id} id={`ei${task.id}`}>
                            <input type="checkbox" onChange={() => toggleTaskCompletion(task.id, true)} />
                            <label >{task.list}</label>
                            <input type="text" value={task.list} onChange={(e) => setIncompleteTasks((prev) =>
                                prev.map((p) =>
                                    p.id === task.id ? { ...p, list: e.target.value } : p
                                )
                            )} />
                            <button className="edit" onClick={() => editTask(task.id, 'ei')}>Edit</button>
                            <button className="delete" onClick={() => deleteTask(task.id)}>Delete</button>
                        </li>
                    ))}<br />
                </ul>

                <h3>Completed</h3>
                <ul id="completed-tasks">
                    {(completeTasks.length > 0) && completeTasks.map((task) => (
                        <li key={task.id} id={`di${task.id}`}>
                            <input type="checkbox" onChange={() => toggleTaskCompletion(task.id, false)} checked />
                            <label >{task.list}</label>
                            <input type="text" value={task.list} onChange={(e) => setCompleteTasks((prev) =>
                                prev.map((p) =>
                                    p.id === task.id ? { ...p, list: e.target.value } : p
                                )
                            )} />
                            <button className="edit" onClick={() => editTask(task.id, 'di')}>Edit</button>
                            <button className="delete" onClick={() => deleteTask(task.id)}>Delete</button>
                        </li>
                    ))}<br />
                </ul>
                            <button onClick={signOut} style={{ display: 'block', margin: 'auto' }}>Sign Out</button>
            </div>
        </div>
    );
}