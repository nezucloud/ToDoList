class Task < ApplicationRecord
  belongs_to :user

  scope :unfinished, -> { where('status != ?', 'finished')}
  scope :due_today, -> { where('DATE(due_date) = ?', Date.today) }
  scope :title, ->(title) { where('title LIKE ?', 
    "%" + Task.sanitize_sql_like( title ) + "%")  }
  scope :late, -> { unfinished.where('DATE(due_date) < ?', Date.today) }

  # Rules for status
  VALID_STATUSES = ["finished", "process", "draft"]

  # payload validation
  validates :title, presence: true
  validates :due_date, presence: true
  validates :status, presence: true, inclusion: { in: VALID_STATUSES }
end
