let serverUrl = 'https://tasklist-minh.herokuapp.com/';
var user = null;
var selectedTasklist;
var selectedTask;

const register = async () => {
    let email = document.getElementById('registerEmail').value;
    let password = document.getElementById('registerPassword').value;
    const response = await fetch(`${serverUrl}/auth`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password
        })
    });
    if (response.ok)
        alert("registered");                
}

const login = async () => {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    const response = await fetch(`${serverUrl}/auth/sign_in`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password
        })
    });

    if (response.ok){
        alert("Login successfully")
        window.location.assign("home.html")
    } else {
        alert("Wrong email or password. Please login again")
    }

    user = {
        'access-token': response.headers.get('access-token'),
        uid: response.headers.get('uid'),
        client: response.headers.get('client')
        };
        localStorage.setItem('user',JSON.stringify(user)); 
    document.getElementById('currentUser').innerHTML = user.uid;
    }
           
    const refreshTasks = async () => {
                if (selectedTasklist) {
                    const taskRequest = await fetch(`${serverUrl}/task_lists/${selectedTasklist}/todos`,{
                        headers: {
                            ...user
                        }
                    }); 
                    const tasks = await taskRequest.json();
                    console.log(tasks);
                    const form = document.getElementById('tasks');
                    form.innerHTML = '';
                    for (let task of tasks) {
                        let input = document.createElement("input");
                        input.name = 'selectedTask';
                        input.value = task.id;
                        input.id = `task_${task.id}`;
                        input.type = 'radio';
                        input.oninput = onSelectTask;
                        form.appendChild(input);
                        let span = document.createElement("span");
                        span.innerHTML = `${task.name}: ${task.description ?? ""}`;
                        form.appendChild(span);
                    }
                }
            }

            const onSelectTaskList = async function(event) {
                selectedTasklist = event.target.value;
                refreshTasks();
            }

            const onSelectUser = async function(event) {
                selectedUser = event.target.value;
            }

            const onSelectTask = async function(event) {
                selectedTask = event.target.value;
            }

            const fetchTasklist = async () => {
                let form = document.getElementById('tasklistForm');
                form.innerHTML = '';
                if (user) {
                    const taskListRequest = await fetch(`${serverUrl}/task_lists`,{
                        headers: {
                            //'access-token':'HgvYj33lCyCoVL6qvc9XJw',
                            //uid: 'thanqminh+2@gmail.com',
                            //client: 'TXlAjMl6kFjVy8ULronJ0Q'
                            ...user
                        }
                    }); 
                    const sharedTaskListRequest = await fetch(`${serverUrl}/shared`,{
                        headers: {
                            //'access-token':'HgvYj33lCyCoVL6qvc9XJw',
                            //uid: 'thanqminh+2@gmail.com',
                            //client: 'TXlAjMl6kFjVy8ULronJ0Q'
                            ...user
                        }
                    });
                    let taskLists = await taskListRequest.json();
                    const sharedTaskLists = await sharedTaskListRequest.json();
                    taskLists = [...taskLists, ...sharedTaskLists];
                    
                    for (let list of taskLists) {
                        let input = document.createElement("input");
                        input.name = 'selectedTasklist';
                        input.value = list.id;
                        input.id = `tasklist_${list.id}`;
                        input.type = 'radio';
                        input.oninput = onSelectTaskList;
                        form.appendChild(input);
                        let span = document.createElement("span");
                        span.innerHTML = `${list.name}: ${list.description ?? ""}`;
                        form.appendChild(span);
                    }
                    if (selectedTasklist) 
                        document.getElementById(`tasklist_${selectedTasklist}`).checked = true;
                }
                else {
                    ul.innerHTML = 'Need to login first';
                }                
            }

            const shareTask = async() => {
                //const name = document.getElementById('createListName').value;
                //const description = document.getElementById('createListDescription').value;
                const createListRequest = await fetch(`${serverUrl}/task_lists/${selectedTasklist}/share`,{
                    method: 'POST',
                    headers: {
                        ...user,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        user_id: selectedUser,
                        task_list_id: selectedTasklist,
                        is_write: true
                    })
                });
            }

            const createTaskList = async() => {
                const name = document.getElementById('createListName').value;
                const description = document.getElementById('createListDescription').value;
                const createListRequest = await fetch(`${serverUrl}/task_lists`,{
                    method: 'POST',
                    headers: {
                        ...user,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name, description
                    })
                });
                fetchTasklist();
            }

            const updateTaskList = async() => {
                if (selectedTasklist) {
                    const name = document.getElementById('updateListname').value;
                    const updateListRequest = await fetch(`${serverUrl}/task_lists/${selectedTasklist}`,{
                        method: 'PUT',
                        headers: {
                            ...user,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            name: name
                        })
                    });
                    fetchTasklist();
                }                
            }

            const deleteTaskList = async() => {
                if (selectedTasklist) {
                    if (confirm('Are you sure you want to delete the selected task list')) {
                        const deleteListRequest = await fetch(`${serverUrl}/task_lists/${selectedTasklist}`,{
                            method: 'DELETE',
                            headers: {
                                ...user
                            }
                            })
                        }
                        fetchTasklist();
                    }
                }

            const createTask = async() => {
                const name = document.getElementById('createTaskname').value;
                const description = document.getElementById('createTaskDescription').value;
                const createTaskRequest = await fetch(`${serverUrl}/task_lists/${selectedTasklist}/todos`,{
                    method: 'POST',
                    headers: {
                        ...user,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name, description
                    })
                });
                fetchTasklist();
                refreshTasks();
            }

            const updateTask = async() => {
                const name = document.getElementById('updateTaskname').value;
                const createTaskRequest = await fetch(`${serverUrl}/task_lists/${selectedTasklist}/todos/${selectedTask}`,{
                    method: 'PUT',
                    headers: {
                        ...user,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name
                    })
                });
                refreshTasks();
            }

            const deleteTask = async() => {
                if (selectedTask) {
                    if (confirm("Are you sure you want to delete the selected task?")) {
                        const deleteTaskRequest = await fetch(`${serverUrl}/task_lists/${selectedTasklist}/todos/${selectedTask}`,{
                            method: 'DELETE',
                            headers: {
                                ...user
                            }
                        });
                        refreshTasks();
                    }
                }                
            }

            async function onLoadInit(){
                if (user == null) {
                    try {
                        const savedLogin = await checkToken();
                        if (savedLogin) {
                            document.getElementById('currentUser').innerHTML = `${user.name ?? ''} ${user.uid}`;
                            fetchTasklist();
                        }
                    } catch {
                        
                    }
                }
            }
            async function updateUserName() {
                if (user != null) {
                    let name = newName.value;
                    const response = await fetch(`${serverUrl}/auth`,{
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            ...user
                        },
                        body: JSON.stringify({
                            name
                        })
                    });
                    user.name = name;
                    document.getElementById('currentUser').innerHTML = `${user.name ?? ''} ${user.uid}`;
                }
            }