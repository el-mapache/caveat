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
          violations: b.violations,
          inspections: b.inspections,
          average_score: average(b.inspections)
        }
      end
    end

    def average(inspections)
      inspections.inject(0) { |sum, i| sum + i.score } / inspections.length
    end
  end
end
