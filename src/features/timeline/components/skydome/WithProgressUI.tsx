import TimelineUI from "../ui/TimelineUI";

type Props = {
  currentEra: string;
  setCurrentEra: (id: string) => void;
  loading: boolean;
};

export default function WithProgressUI({
  currentEra,
  setCurrentEra,
  loading,
}: Props) {
  return (
    <TimelineUI
      currentEra={currentEra}
      setCurrentEra={setCurrentEra}
      loading={loading}
    />
  );
}
