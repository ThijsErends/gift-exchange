import { NamePicker, SpinningWheel } from '../components/NamePicker';

/**
 * Page variant using the spinning wheel animation style.
 */
export function SpinningWheelPage() {
  return <NamePicker AnimationComponent={SpinningWheel} />;
}
