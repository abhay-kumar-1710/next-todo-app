import { connectDB } from "@/lib/db";
import { Tasks } from "@/lib/models/Tasks";

export async function PUT(request, { params }) {
  await connectDB();
  const { id } = params;
  const body = await request.json();

  try {
    const updatedTask = await Tasks.findByIdAndUpdate(id, body, { new: true });

    if (!updatedTask) {
      return Response.json({message: "Task Not Found!"});
    }

    return Response.json({ message: "Task Updated Successfully!", task: updatedTask });
  } catch (error) {
    return Response.json({
      message: "Error!",
    });
  }
}


export async function DELETE(request, {params}) {
    await connectDB();
    const {id} = params

    try {
        const deleteTask = await Tasks.findByIdAndDelete(id)

        if(!deleteTask){
            return Response.json({
              message: "Task Not Found!",
            });
        }

        return Response.json({ message: "Task Deleted Successfully!", task: deleteTask });

    } catch (error) {
        return Response.json({
          message: "Error!",
        });
    }
}