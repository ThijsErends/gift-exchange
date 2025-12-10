import { useState, useCallback } from 'react';

/**
 * Custom hook for managing the name picker game logic.
 * Supports unlimited rounds - game continues until all players protect their gifts.
 *
 * @param {string[]} initialNames - Array of participant names
 * @returns {object} Name picker state and controls
 */
export function useNamePicker(initialNames) {
  const [availableNames, setAvailableNames] = useState([...initialNames]);
  const [pickedNames, setPickedNames] = useState([]);
  const [currentName, setCurrentName] = useState(null);
  const [pendingName, setPendingName] = useState(null);
  const [protectedNames, setProtectedNames] = useState([]);
  const [currentRound, setCurrentRound] = useState(1);

  /**
   * Pick a random name from available names (doesn't add to picked list yet).
   * @returns {string|null} The picked name, or null if no names available
   */
  const pickName = useCallback(() => {
    if (availableNames.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * availableNames.length);
    const pickedName = availableNames[randomIndex];

    // Remove from available but don't add to picked yet
    setAvailableNames((prev) => prev.filter((_, i) => i !== randomIndex));
    setPendingName(pickedName);

    return pickedName;
  }, [availableNames]);

  /**
   * Confirm the pick - adds to picked list and sets as current.
   * Call this after the spinning animation completes.
   */
  const confirmPick = useCallback(() => {
    if (pendingName) {
      setPickedNames((prev) => [...prev, pendingName]);
      setCurrentName(pendingName);
      setPendingName(null);
    }
  }, [pendingName]);

  /**
   * Protect the current player's gift.
   * Protected gifts cannot be stolen, allowing the player to leave early.
   */
  const protectGift = useCallback(() => {
    if (currentName && !protectedNames.includes(currentName)) {
      setProtectedNames((prev) => [...prev, currentName]);
    }
  }, [currentName, protectedNames]);

  /**
   * Reset the game to initial state.
   */
  const reset = useCallback(() => {
    setAvailableNames([...initialNames]);
    setPickedNames([]);
    setCurrentName(null);
    setPendingName(null);
    setProtectedNames([]);
    setCurrentRound(1);
  }, [initialNames]);

  /**
   * Check if current round is complete (all names picked this round).
   */
  const isRoundComplete = availableNames.length === 0 && pendingName === null;

  /**
   * Get unprotected players (players who can still participate in future rounds).
   */
  const unprotectedPlayers = initialNames.filter(name => !protectedNames.includes(name));

  /**
   * Check if game is fully complete (all players have protected their gifts).
   */
  const isGameComplete = unprotectedPlayers.length === 0;

  /**
   * Start next round - refill available names with unprotected players only.
   */
  const startNextRound = useCallback(() => {
    if (isRoundComplete && !isGameComplete) {
      setCurrentRound(prev => prev + 1);
      // Only include players who haven't protected their gift
      setAvailableNames(unprotectedPlayers);
      setPickedNames([]);
    }
  }, [isRoundComplete, isGameComplete, unprotectedPlayers]);

  /**
   * Check if current player can protect their gift.
   * Available after round 1 and player hasn't already protected.
   */
  const canProtect = currentRound > 1 && currentName && !protectedNames.includes(currentName);

  return {
    availableNames,
    pickedNames,
    currentName,
    pendingName,
    protectedNames,
    pickName,
    confirmPick,
    protectGift,
    reset,
    startNextRound,
    isRoundComplete,
    isGameComplete,
    currentRound,
    canProtect,
    totalNames: initialNames.length,
    unprotectedCount: unprotectedPlayers.length,
  };
}
