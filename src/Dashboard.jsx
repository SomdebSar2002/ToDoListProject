import './index.css';
import { useState, useEffect } from 'react';
import { supabase } from './supabase-client';
import { useAuth } from './AuthProvider';
import { useNavigate } from 'react-router-dom';
export default function App() {
    const { session, signOut, users } = useAuth();
    const currentUser = users.find((user) => user.id === session?.user?.id);
    const [userName, setuserName] = useState(currentUser?.name || "");
    const [email, setEmail] = useState(currentUser?.email || "");
    const [entry, setEntry] = useState("");
    const navigate = useNavigate();
    const handleSignOut = async (e) => {
        e.preventDefault();
        const { error } = await signOut();
        if (error) {
            console.error("Error signing out:", error);
        } else {
            navigate('/signin');       
            console.log("Signed out successfully");
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) return;
        const { data, error } = await supabase
            .from('todolists')
            .insert([
                {
                    list: entry,
                    email: email,
                    checked: false,
                    name: userName,
                    user_id: currentUser.id
                }
            ])
            .single();
        setEntry("");
        if (error) {
            console.error("Error adding todo item:", error);
        }
    }
    const [incompleteTasks, setIncompleteTasks] = useState([]);
    const [completeTasks, setCompleteTasks] = useState([]);


    const fetchIncompleteTasks = async () => {
        if (!currentUser?.id) return;
        const { data, error } = await supabase.from('todolists').select('id,list, checked').eq('checked', false).eq('user_id', currentUser?.id);
        if (!error) { setIncompleteTasks(data); }
    };

    const fetchCompleteTasks = async () => {
        if (!currentUser?.id) return;
        const { data, error } = await supabase.from('todolists').select('id,list, checked').eq('checked', true).eq('user_id', currentUser?.id);

        if (!error) { setCompleteTasks(data); }
    }
    const fetchUsers = async () => {
        setuserName(currentUser?.name || "");
        setEmail(currentUser?.email || "");
    };
    useEffect(() => {
        fetchUsers();
    }, [currentUser]);
    const deleteTask = async (id) => {
        const { data, error } = await supabase.from('todolists').delete().eq('id', id).eq('user_id', currentUser?.id);

        if (error) {
            console.error("Error deleting task:", error);
        }
    }
    const toggleTaskCompletion = async (id, checked) => {
        const { data, error } = await supabase.from('todolists').update({ checked: checked }).eq('id', id).eq('user_id', currentUser?.id);
        if (error) {
            console.error("Error updating task:", error);
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
            const { data, error } = await supabase.from('todolists').update({ list: newText }).eq('id', id).eq('user_id', currentUser?.id);
            if (!error) {
                fetchIncompleteTasks();
                fetchCompleteTasks();
            }
        } else {
            item.classList.add('editMode');
        }
    }
    useEffect(() => {
        if (!currentUser) return;
        setuserName(currentUser.name || "");
        setEmail(currentUser.email || "");
    }, [currentUser]);

    useEffect(() => {
        fetchIncompleteTasks();
        fetchCompleteTasks();
        const subs = supabase.channel('todolistactivity').on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'todolists' },
            (payload) => {
                fetchIncompleteTasks();
                fetchCompleteTasks();
            }
        ).subscribe();
        return () => {
            subs.unsubscribe();
        }
    }, [session, currentUser?.id]);
    return (
        <div className="App">

            <div className="container">
                <h2>{userName ? `${userName}'s TODO LIST` : "TODO LIST"}</h2>
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
                            <button onClick={handleSignOut} style={{ display: 'block', margin: 'auto' }}>Sign Out</button>
            </div>
        </div>
    );
}
