class TasksController < ApplicationController
    def show
        sort_by = params[:sortby]

        @user_tasks = current_user.task
        case sort_by
        when 'due_date' 
            @user_tasks = @user_tasks.order(due_date: :desc)
        when 'status'
            @user_tasks = @user_tasks.order(status: :desc)
        else
            @user_tasks = @user_tasks.where("priority IS NOT NULL").order(priority: :asc)
        end

        return render json: {
            "data" => @user_tasks, 
            "message" => "Get user tasks",
            "status" => 200
        }, status: :ok
    end

    def create
        @task = current_user.task.create(task_params)

        if @task.save
            if task_params[:priority]
                User.connection.execute("
                    UPDATE tasks SET priority = priority + 1 
                    WHERE user_id = #{current_user.id} 
                    AND priority IS NOT NULL
                    AND id != #{@task.id}"
                )
            end

            return render json: {
                "data" => [], 
                "message" => "Task Successfuly Created",
                "status" => 200
            }, status: :ok
        else
            return render json: { errors: @task.errors, params: task_params.inspect }, status: :unprocessable_entity
        end
    end

    def update
        @task = Task.find(params[:id])
        @task.update(task_params)

        return render json: {
            "data" => [], 
            "message" => "Task Successfuly Updated",
            "status" => 200
        }, status: :ok
    end

    private 
        def task_params
            params.require(:task).permit(:title, :description, :due_date, :priority, :status)
        end
end
