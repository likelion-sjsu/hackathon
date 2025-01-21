import { ActivityIndicator } from "react-native";

export default function Loader({ size = "small" as "small" | "large", color = "white" }) {
  return <ActivityIndicator animating={true} size={size} color={color} />;
}
