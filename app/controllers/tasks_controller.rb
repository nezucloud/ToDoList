class TasksController < ApplicationController
    def show
        sort_by = params[:sortby]
        filter_by = params[:filterby]
        hide_finished = params[:hide_finished]

        @user_tasks = current_user.task

        if hide_finished == "true"
            @user_tasks = @user_tasks.where("status != 'finished'")
        end

        if filter_by == "today"
            @user_tasks = @user_tasks.where("DATE(due_date) = DATE(NOW())")
        end

        case sort_by
            when 'due_date' 
                @user_tasks = @user_tasks.order(due_date: :asc)
            when 'status'
                @user_tasks = @user_tasks.order(status: :desc)
            else
                @user_tasks = @user_tasks.where("priority IS NOT NULL").order(priority: :asc)
            end


        return render json: {
            "data" => @user_tasks, 
            "message" => "Get user tasks",
            "status" => hide_finished
        }, status: :ok
    end

    def create
        @task = current_user.task.create(task_params)

        if @task.save
            if task_params[:priority]
                update_priority(@task, current_user)
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
        task_priority = @task.priority

        @task.update(task_params)

        if @task.priority
            User.connection.execute("
                UPDATE tasks SET priority = priority + 1 
                WHERE user_id = #{current_user.id} 
                AND priority < #{task_priority}
                AND id != #{@task.id}"
            )
        end

        return render json: {
            "data" => [], 
            "message" => "Task Successfuly Updated",
            "status" => 200
        }, status: :ok
    end

    def delete
        @task = Task.find(params[:id])
        @task.destroy

        return render json: {
            "data" => [],
            "message" => "Task Deleted",
            "status" => 200
        }, status: :ok
    end

    private 
        def task_params
            params.require(:task).permit(:title, :description, :due_date, :priority, :status)
        end

        def update_priority (task,current_user)
            User.connection.execute("
                UPDATE tasks SET priority = priority + 1 
                WHERE user_id = #{current_user.id} 
                AND priority IS NOT NULL
                AND id != #{task.id}"
            )
        end
end
