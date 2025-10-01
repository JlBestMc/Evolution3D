import { useProgress } from "@react-three/drei";
import TimelineUI from "../timelineUI/TimelineUI";

type Props = {
  currentEra: string;
  setCurrentEra: (id: string) => void;
};

export default function WithProgressUI({ currentEra, setCurrentEra }: Props) {
  const { active } = useProgress();
  return (
    <TimelineUI currentEra={currentEra} setCurrentEra={setCurrentEra} loading={active} />
  );
}
