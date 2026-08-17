import * as sim from './simulation';

export const api = {
  getStats: () => Promise.resolve(sim.getStats()),
  getClients: () => Promise.resolve(sim.getClients()),
  getRounds: () => Promise.resolve(sim.getRounds()),
  simulateRound: (agg = 'fedavg') => Promise.resolve(sim.simulateRound()),
  simulateDetection: () => Promise.resolve(sim.simulateDetection()),
  getThreatTimeline: (p = 24) => Promise.resolve(sim.getThreatTimeline(p)),
  getThreatSummary: () => Promise.resolve(sim.getThreatSummary()),
};
