import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import ButtonMain from "../../ui/Buttons/ButtonMain/ButtonMain";
import Input from "../../ui/Input/Input";
import Textarea from "../../ui/Textarea/Textarea";
import { useNavigate } from "react-router-dom";
import { ITask } from "../../../store/types/store.types";
import { useAddTaskMutation } from "../../../services/TasksService.ts";
import { useAppSelector } from "../../../hooks/redux.ts";
import { selectUser } from "../../../store/reducers/authSlice.ts";

const NewTaskForm = () => {
  const navigate = useNavigate();
  const [addTask, { isLoading }] = useAddTaskMutation();
  const { userId } = useAppSelector(selectUser);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ITask>({
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      status: "In progress",
    },
  });

  const submit: SubmitHandler<ITask> = async (data) => {
    const newTask = {
      date: data.date,
      title: data.title,
      description: data.description,
      status: data.status,
    };
    if (userId) {
      await addTask({ newTask: newTask as ITask, userId });
    }
    navigate("/");
  };

  const error: SubmitErrorHandler<ITask> = (data) => {};
  return (
    <form className="flex justify-center items-start w-full flex-col gap-5" onSubmit={handleSubmit(submit, error)}>
      <Input
        type="text"
        placeholder="Task Title"
        {...register("title", {
          validate: (value) => {
            return !!value.trim() || "Title field is empty";
          },
        })}
      />
      {errors.title && <p className="text-xs text-red-400">{errors.title.message}</p>}
      <Textarea
        placeholder="Add your task details"
        {...register("description", {
          validate: (value) => {
            return !!value.trim() || "Title field is empty";
          },
        })}
      />
      <Input
        type="date"
        style={{ color: "rgb(64 64 64)" }}
        {...register("date", {
          required: "Choose a date",
          validate: (value) => {
            const currentYear = value.split("-")[0];
            return (currentYear.length === 4 && +currentYear[0] === 2) || "Choose a correct date";
          },
        })}
      />
      {errors.date && <p className="text-xs text-red-400">{errors.date.message}</p>}

      {errors.description && <p className="text-xs text-red-400">{errors.description.message}</p>}
      <ButtonMain className="mt-7" type="submit" disabled={false}>
        {isLoading ? "Loading" : "Create task"}
      </ButtonMain>
    </form>
  );
};

export default NewTaskForm;
