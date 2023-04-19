class TaskMailer < ApplicationMailer
    def deadline_email
        @user = params[:user]
        @url  = 'http://localhost:3000/login'
        mail(to: @user.email, 
            subject: 'It is a deadline day',
            template_path: 'task_mailer',
            template_name: 'deadline_email'
        )
    end
end
