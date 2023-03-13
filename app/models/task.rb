class Task < ApplicationRecord
  belongs_to :user

  VALID_STATUSES = ["finished", "process"]

  validates :title, presence: true
  validates :due_date, presence: true
  validates :status, presence: true, inclusion: { in: VALID_STATUSES }
end
