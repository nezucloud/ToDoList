class AssetsController < ApplicationController
  def index
  end

  def images
    file_name       = params[:file_name]
    file_extension  = params[:ext]
    send_file("#{Rails.root}/app/assets/images/#{file_name}.#{file_extension}")
  end
end