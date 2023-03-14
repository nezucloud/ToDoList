class TasksController < ApplicationController
    # show user tasks with parameters
    def show
        # Params exists in the method
        sort_by         = params[:sortby]
        filter_by       = params[:filterby]
        hide_finished   = params[:hide_finished]

        @user_tasks = current_user.task

        # conditions of the tasks if they have finished
        if hide_finished == "true"
            @user_tasks = @user_tasks.where("status != 'finished'")
        end

        # Conditions of the tasks if they have filtered by today
        if filter_by == "today"
            @user_tasks = @user_tasks.where("DATE(due_date) = DATE(NOW())")
        end

        # Case in parameter sort by
        case sort_by
            when 'due_date' 
                @user_tasks = @user_tasks.order(due_date: :asc)
            when 'status'
                @user_tasks = @user_tasks.order(status: :desc)
            else
                @user_tasks = @user_tasks.where("priority IS NOT NULL").order(priority: :asc)
            end

        # Send response to the client
        return render json: success_respond_object(@user_tasks, "Get user tasks"), status: :ok
    end

    # craete the user tasks
    def create
        @task = current_user.task.create(task_params)

        if @task.save
            if task_params[:priority]
                #Update the priority
                update_priority(@task, current_user)
            end

            # Respond with success
            return render json: success_respond_object([], "Task Successfuly Created"), status: :ok
        else
            # Respond with error
            return render json: { errors: @task.errors, params: task_params.inspect }, status: :unprocessable_entity
        end
    end

    # update task
    def update
        @task = Task.find(params[:id])
        task_priority = @task.priority

        #Update the priority
        @task.update(task_params)

        if @task.priority
            # Task priority updated to current priority if user checked the "Set as priority"
            User.connection.execute("
                UPDATE tasks SET priority = priority + 1 
                WHERE user_id = #{current_user.id} 
                AND priority < #{task_priority}
                AND id != #{@task.id}"
            )
        end

        # Respond with success
        return render json: success_respond_object([], "Task successfully updated"), status: :ok
    end

    # delete task
    def delete
        @task = Task.find(params[:id])
        @task.destroy

        # Respond with success
        return render json: success_respond_object([], "Task Deleted"), status: :ok
    end

    private 
        # permit access for the parmeters
        def task_params
            params.require(:task).permit(:title, :description, :due_date, :priority, :status)
        end

        # Method to update a task priority per user
        def update_priority (task,current_user)
            User.connection.execute("
                UPDATE tasks SET priority = priority + 1 
                WHERE user_id = #{current_user.id} 
                AND priority IS NOT NULL
                AND id != #{task.id}"
            )
        end
        
        # function to generate success response object
        def success_respond_object (data, message)
            return {
                "data"      => data,
                "message"   => message,
                "status"    => 200
            }
        end
end
