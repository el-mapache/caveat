class API::V1::BusinessPresenter
  class << self
    def present(obj)
      businesses = obj.kind_of?(ActiveRecord::Relation) ? obj : [obj]
      as_hash(businesses)
    end

    private
    def as_hash(businesses)
      businesses.map do |b|
        {
          business: b,
          inspections_violations: inspections_violations(b),
          most_recent_score: most_recent(b.inspections),
          average_score: average(b.inspections)
        }
      end
    end

    # Find the average health department score from all total inspections.
    # An active record call returns an empty array when no results are found.
    # Return 0 if a business hasn't recieved any inspections.
    def average(inspections)
      return 0 if inspections.empty?
      inspections.inject(0) { |sum, i| sum + i.score } / inspections.length
    end

    # Returns the current inspection score.
    def most_recent(inspections)
      return 0 if inspections.empty?
      inspections.first.score
    end

    def inspections_violations(business)
      # this hash holds inspections and their associated violations, if any.
      v_i = {}
      violations = business.violations

      business.inspections.each do |ins|
        # Key to the inspection year and id
        key = [ins.date.year, "_", ins.id].join("")
        v_i[key] = {
          inspection: {
            formatted_date: ins.date.strftime("%B %d, %Y"),
            inspection: ins
          },
          violations: violations.select {|v| v if v.date == ins.date}
        }
        # Save the total number of violations
        v_i[key][:violations_count] = v_i[key][:violations].length
      end 

      v_i
    end

  end
end
