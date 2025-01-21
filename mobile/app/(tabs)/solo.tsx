import Categories from "@/components/Categories";
import { modeAtom } from "@/utils/atoms";
import { useEffect } from "react";
import { useRecoilState } from "recoil";

export default function Solo() {
  const [_, setMode] = useRecoilState(modeAtom);
  useEffect(() => {
    setMode({ role: 0, size: 1, code: "" });
  }, []);
  return <Categories />;
}
