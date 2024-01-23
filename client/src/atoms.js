import { atom } from "recoil";

export const roundAtom = atom({
  key: "code",
  default: {
    role: "individual",
    code: "no-code",
  },
});
