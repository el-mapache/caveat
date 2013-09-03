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
          most_recent_score: b.inspections.first.score,
          average_score: average(b.inspections)
        }
      end
    end

    def average(inspections)
      inspections.inject(0) { |sum, i| sum + i.score } / inspections.length
    end

    def inspections_violations(business)
      v_i = {}
      violations = business.violations

      business.inspections.each do |ins|
        key = [ins.date.year, "_", ins.id].join("")
        v_i[key] = {
          inspection: {
            formatted_date: ins.date.strftime("%B %d, %Y"),
            inspection: ins
          },
          violations: violations.select {|v| v if v.date == ins.date}
        }
        v_i[key][:violations_count] = v_i[key][:violations].length
      end 
      
      v_i
    end

  end
end
