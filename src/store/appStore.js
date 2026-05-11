import { create } from 'zustand';

const useAppStore = create((set) => ({
  // Level 1 outputs
  sortedStations: [],        // ["AK","QA","FM",...]
  signalValues: {},          // {AK: 140, QA: 146, ...}
  inversionCount: 0,         // e.g. 23
  disorderLevel: "LOW",      // LOW/MODERATE/CRITICAL
  
  // Level 2 outputs  
  dependencyMatrix: [],      // 14x14 array
  activationSequence: [],    // topological order
  cycleDetected: false,
  cycleNodes: [],
  
  // Level 3 outputs
  connectivityWeights: {},
  finalReport: {},
  
  // UI state
  currentLevel: 1,           // 1, 2, or 3
  level1Complete: false,
  level2Complete: false,
  level3Complete: false,

  // Actions for Level 1
  setLevel1Data: (data) => set((state) => ({
    sortedStations: data.sortedStations || state.sortedStations,
    signalValues: data.signalValues || state.signalValues,
    inversionCount: data.inversionCount !== undefined ? data.inversionCount : state.inversionCount,
    disorderLevel: data.disorderLevel || state.disorderLevel,
    level1Complete: true,
  })),

  // Actions for Level 2
  setLevel2Data: (data) => set((state) => ({
    dependencyMatrix: data.dependencyMatrix || state.dependencyMatrix,
    activationSequence: data.activationSequence || state.activationSequence,
    cycleDetected: data.cycleDetected !== undefined ? data.cycleDetected : state.cycleDetected,
    cycleNodes: data.cycleNodes || state.cycleNodes,
    level2Complete: true,
  })),

  // Actions for Level 3
  setLevel3Data: (data) => set((state) => ({
    connectivityWeights: data.connectivityWeights || state.connectivityWeights,
    finalReport: data.finalReport || state.finalReport,
    level3Complete: true,
  })),

  // Set current level
  setCurrentLevel: (level) => set({ currentLevel: level }),

  // Reset all state (for new game)
  resetState: () => set({
    sortedStations: [],
    signalValues: {},
    inversionCount: 0,
    disorderLevel: "LOW",
    dependencyMatrix: [],
    activationSequence: [],
    cycleDetected: false,
    cycleNodes: [],
    connectivityWeights: {},
    finalReport: {},
    currentLevel: 1,
    level1Complete: false,
    level2Complete: false,
    level3Complete: false,
  }),
}));

export default useAppStore;
