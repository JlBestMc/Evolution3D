import TimelineUI from "../ui/TimelineUI";

type Props = {
  currentEra: string;
  setCurrentEra: (id: string) => void;
  currentSubera: string | null;
  setCurrentSubera: (id: string) => void;
  loading: boolean;
};

export default function WithProgressUI({
  currentEra,
  setCurrentEra,
  currentSubera,
  setCurrentSubera,
  loading,
}: Props) {
  return (
    <TimelineUI
      currentEra={currentEra}
      setCurrentEra={setCurrentEra}
      currentSubera={currentSubera}
      setCurrentSubera={setCurrentSubera}
      loading={loading}
    />
  );
}
