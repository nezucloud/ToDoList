class PagesController < ApplicationController
  def index
    if user_signed_in?
      redirect_to "/dashboard"
    end
  end

  def dashboard
    unless user_signed_in?
      return redirect_to "/"
    end

    render "pages/dashboard"
  end
end
