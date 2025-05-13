import { connectDB } from "@/lib/db";
import { Tasks } from "@/lib/models/Tasks";

export async function POST(request) {
  await connectDB();

  const body = await request.json();

  if (!body) {
    return Response.json({ message: "Title is Required!" });
  }

  try {
    const newTask = await Tasks.create(body);
    return Response.json({
      message: "Task Added Successfully!",
      task: newTask,
    });
  } catch (error) {
    return Response.json({
      message: "Failed To Add Task!",
    });
  }
}

export async function GET(request) {
  await connectDB();
  const tasks = await Tasks.find({});
  return Response.json({tasks});
}
