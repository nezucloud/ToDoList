class Task < ApplicationRecord
  belongs_to :user

  # Rules for status
  VALID_STATUSES = ["finished", "process"]

  # payload validation
  validates :title, presence: true
  validates :due_date, presence: true
  validates :status, presence: true, inclusion: { in: VALID_STATUSES }
end
