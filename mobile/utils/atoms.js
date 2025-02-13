import { atom } from "recoil";
import { LocationObject } from "expo-location";

export const modeAtom = atom({
  key: "mode",
  default: {
    role: 0, // 0: leader, 1: member
    size: 1,
    code: "",
  },
});

export const locAtom = atom({
  key: "location",
  default: null,
});
