import { NamePicker, SlotMachine } from '../components/NamePicker';

/**
 * Page variant using the slot machine animation style.
 */
export function SlotMachinePage() {
  return <NamePicker AnimationComponent={SlotMachine} />;
}
