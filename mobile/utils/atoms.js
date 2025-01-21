import { atom } from "recoil";

export const modeAtom = atom({
  key: "mode",
  default: {
    role: 0, // 0: leader, 1: member
    size: 1,
    code: "",
  },
});
