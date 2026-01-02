export class TrafficEstimate {
  monthlyVisitors: {
    low: number;
    high: number;
  };
  monthlyPageviews: {
    low: number;
    high: number;
  };
  globalRank?: number;
}

export class ValueEstimate {
  estimatedValue: {
    low: number;
    high: number;
  };
  dailyRevenue: {
    low: number;
    high: number;
  };
  monthlyRevenue: {
    low: number;
    high: number;
  };
}

export class MonetizationEstimate {
  potential: 'Low' | 'Medium' | 'High';
  rpmRange: {
    low: number;
    high: number;
  };
  bestMethods: string[];
}

export class DomainInfo {
  domain: string;
  age?: string;
  httpsEnabled?: boolean;
  serverLocation?: string;
  cms?: string;
}

export class DomainResultDto {
  domain: string;
  traffic: TrafficEstimate;
  value: ValueEstimate;
  monetization: MonetizationEstimate;
  domainInfo: DomainInfo;
  verdict: string;
  relatedSearches: string[];
  calculatedAt: Date;
}
