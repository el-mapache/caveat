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
          by_year: by_year(b),
          average_score: average(b.inspections)
        }
      end
    end

    def average(inspections)
      inspections.inject(0) { |sum, i| sum + i.score } / inspections.length
    end

    def by_year(business)
      v_i = {}
      violations = business.violations

      business.inspections.sort_by {|i| i.date }.reverse.each do |ins|
        key = [ins.date.year, "_", ins.id].join("")
        v_i[key] = {
          inspection: ins,
          violations: violations.select {|v| v if v.date == ins.date}
        }
      end 
      v_i
    end

  end
end
