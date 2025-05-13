"use client";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

export default function Home() {
  const [title, setTitle] = useState("");
  // const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);

  const [editIndex, setEditIndex] = useState(null);

  const [status, setStatus] = useState("all");

  const filteredTasks = tasks.filter((task) => {
    if (status === "completed") return task.isCompleted;
    if (status === "pending") return !task.isCompleted;
    return true; // "all"
  });
  

  // const notify = () => toast("jjj");

  // POST METHOD
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editIndex) {
      const res = await fetch(`api/tasks/${editIndex}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      const data = await res.json();

      if (res.ok) {
        // setMessage("Task Updated Successfully!");
        toast("Task Updated Successfully!");
        setTitle("");
        fetchAllTasks();
        setEditIndex(null);
      } else {
        toast(data.error || "Something went Wrong!");
      }
    } else {
      const res = await fetch("api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log(title);

        // setMessage("Task Added Successfully!");
        toast("Task Added Successfully!");
        setTitle("");
        fetchAllTasks();
        // console.log(message);
      } else {
        toast(data.error || "Something went Wrong!");
      }
    }
  };

  // UPDATE METHOD
  const handleUpdate = async (task, title) => {
    setTitle(title);
    setEditIndex(task);
    console.log(title);
  };

  // GET METHOD
  const fetchAllTasks = async () => {
    const res = await fetch("api/tasks");
    const data = await res.json();
    setLoading(false);
    setTasks(data.tasks);
  };

  // DELETE METHOD
  const handleDelete = async (id) => {
    console.log("delete id---", id);

    const res = await fetch(`api/tasks/${id}`, { method: "DELETE" });
    const data = res.json();
    try {
      // setMessage("Task deleted Successfully!");
      toast("Task deleted Successfully!");
      fetchAllTasks();
    } catch (error) {
      toast(data.error || "Something went Wrong");
    }
  };

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const handleToggleComplete = async (id, currentStatus, title) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isCompleted: !currentStatus }),
    });
    if (res.ok) {
      fetchAllTasks();
      if(currentStatus) {
        toast(`${title} has not been Completed!`);
      }else{
        toast(`${title} has been Completed!`)
      }
    }
  };
  

  // useEffect(() => {
  //   console.log("Message--", message);
  // }, [message]);

  useEffect(() => {
    console.log("EDIT INDEX--", editIndex);
  }, [editIndex]);

  return (
    <>
      <div className="w-full h-auto flex justify-start items-center flex-col gap-5 py-10 ">
        <h1 className="bg-gradient-to-t from-black to-white/80 bg-clip-text text-transparent uppercase text-[10vw] font-bold leading-none flex justify-center items-center">
          <lord-icon
            src="https://cdn.lordicon.com/gdowkrjt.json"
            trigger="loop"
            state="loop-oscillate"
            colors="primary:#ffffff,secondary:#000000,tertiary:#000000,quaternary:#ffffff"
            className="w-[200px] h-[200px]"
          ></lord-icon>
          to-do list
        </h1>
        <h3 className="text-5xl font-semibold">Add Task</h3>
        <form
          onSubmit={handleSubmit}
          className="w-[50%] relative overflow-hidden"
        >
          <input
            name="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              console.log(title);
            }}
            placeholder="Write a Task..."
            className="w-full py-2 px-5 bg-zinc-200  rounded-xl focus:outline-0 text-black capitalize"
            type="text"
          />
          <button
            // onClick={() => {
            //   notify();
            // }}
            disabled={title.length === 0}
            className={`${
              title.length === 0
                ? "hover:cursor-not-allowed"
                : "hover:cursor-pointer"
            } bg-zinc-600 px-3 absolute top-0 right-0 h-full rounded-xl rounded-tl-none rounded-bl-none font-semibold flex justify-center items-center gap-2 `}
          >
            {" "}
            {editIndex ? "Update Task" : "Add Task"}
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick={false}
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
          </button>
        </form>
        {/* <h3 className="text-5xl font-semibold">Your All Task</h3> */}
        <div className="w-[50%]  p-2 flex justify-start items-center flex-col gap-2">
          <div className="w-full flex justify-around items-center p-2 border-b-2">
            <button
              onClick={() => setStatus("all")}
              className={`${
                status === "all" ? "bg-zinc-600" : ""
              }  text-white font-semibold text-lg py-2 px-3 rounded-2xl hover:cursor-pointer hover:bg-zinc-600`}
            >
              All
            </button>
            <button
              onClick={() => setStatus("completed")}
              className={`${
                status === "completed" ? "bg-zinc-600" : ""
              } text-white font-semibold text-lg py-2 px-3 rounded-2xl hover:cursor-pointer hover:bg-zinc-600`}
            >
              Completed
            </button>
            <button
              onClick={() => setStatus("pending")}
              className={`${
                status === "pending" ? "bg-zinc-600" : ""
              } text-white font-semibold text-lg py-2 px-3 rounded-2xl hover:cursor-pointer hover:bg-zinc-600`}
            >
              Pending
            </button>
          </div>
          {loading ? (
            <h1 className="text-4xl">Fetching The Data...</h1>
          ) : tasks.length === 0 ? (
            <h1 className="text-5xl">No Data To Show!</h1>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task._id}
                className="w-full py-3 px-5 flex justify-between items-start border-b-2"
              >
                <div className="flex justify-center items-start gap-5">
                  <input
                    className="dark:border-white-400/20 dark:scale-100 transition-all duration-500 ease-in-out dark:hover:scale-110 dark:checked:scale-100 w-5 h-5 hover:cursor-pointer"
                    type="checkbox"
                    checked={task.isCompleted}
                    onChange={() =>
                      handleToggleComplete(task._id, task.isCompleted, task.title)
                    }
                  />
                  <span className={`w-100 capitalize ${task.isCompleted ? "line-through" : ""}`}>{task.title}</span>
                </div>
                <div className="flex justify-center items-center gap-5">
                  <button
                    onClick={() => {
                      handleUpdate(task._id, task.title);
                    }}
                    className="bg-green-600 py-2 px-3 rounded-xl gap-2 hover:cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      // notify();
                      handleDelete(task._id);
                    }}
                    className="bg-red-600 py-2 px-3 rounded-xl gap-2 hover:cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
